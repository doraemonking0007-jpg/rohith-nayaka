# Put BreakBite online

BreakBite uses Supabase for shared orders, menu items, service hours, food photos, and staff sign-in. Staff changes show up on student devices in real time. The site also needs an HTTPS host for students and kitchen staff to access it.

## 1. Create a Supabase project

Create a project at [supabase.com/dashboard](https://supabase.com/dashboard). In **Authentication → Sign In / Providers**, enable **Anonymous Sign-Ins** so students can place and securely track an order without creating an account. The app does not need public staff sign-ups; an administrator creates staff logins from the staff dashboard.

## 2. Create the online tables and photo storage

In the project dashboard, open **SQL Editor → New query**, paste the full contents of `supabase-schema.sql`, and run it. This creates:

- The live menu and canteen service settings.
- The shared order queue, token counter, and price checked order function.
- Row-level access rules for students, kitchen staff, and administrators.
- The public `menu-images` photo bucket, with upload access restricted to staff.

The service starts closed. An administrator can open ordering after the first staff login is set up.

## 3. Create the first administrator login

The first administrator must be bootstrapped in Supabase because no administrator exists yet to create accounts from the app.

1. In **Authentication → Users**, choose **Add user**, enter the administrator's email and a strong password, and confirm the user.
2. Copy that user's UUID.
3. In **SQL Editor**, run this statement with the UUID and name:

   ```sql
   insert into public.staff_users (user_id, role, display_name)
   values ('PASTE-ADMIN-USER-UUID-HERE', 'admin', 'Canteen administrator')
   on conflict (user_id) do update set role = 'admin', display_name = excluded.display_name;
   ```

The administrator can now sign in through **Staff view**. In the dashboard's **Staff accounts** panel, they can create kitchen logins using the staff member's email and a temporary password. Share that password privately. Staff log in with their email and password; account creation is never done in the public browser with an admin key.

## 4. Deploy the secure staff account function

Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and run these commands from this app folder:

```sh
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy manage-staff
```

The function uses Supabase's server-side secret key only inside the Edge Function environment. Never paste a secret or `service_role` key into `backend-config.js` or any browser file. Supabase provides function keys in the server environment; auth administration must remain server-side. See [Supabase Edge Function secrets](https://supabase.com/docs/guides/functions/secrets) and [Auth admin create user](https://supabase.com/docs/reference/javascript/auth-admin-createuser).

## 5. Connect the website to Supabase

In Supabase **Project Settings → API**, copy the Project URL and the public/publishable key (older projects call it `anon`). Put those values in `backend-config.js`:

```js
window.BREAKBITE_SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
window.BREAKBITE_SUPABASE_PUBLISHABLE_KEY = 'YOUR-PUBLISHABLE-KEY';
```

The public key is intended for browser apps when row-level security is enabled. Keep all secret keys out of this file.

## 6. Publish the app

Upload the app folder to a static HTTPS host, such as Netlify, Cloudflare Pages, or GitHub Pages. Keep `index.html`, `app.js`, `styles.css`, `backend-config.js`, `manifest.webmanifest`, `icon.svg`, and `sw.js` together at the site root. Share the HTTPS address with students and staff.

## Kitchen dashboard

Staff can sign in to:

- Turn online ordering on or off for everyone.
- Change the service name, pickup start/end, and order cutoff.
- Add, edit, hide, or remove menu items and set prices.
- Upload a JPG, PNG, or WebP menu photo, or supply an HTTPS image URL.
- Move orders through Received, Preparing, Ready, and Collected.

Menu prices are checked again by the database when an order is submitted, and an order is rejected if the kitchen is closed or the cutoff has passed. Payments are not implemented; this version does not collect money.

## Local preview

When the Supabase settings are blank, the app shows a local demo preview. Demo orders stay in that browser and are not shared. The kitchen controls and staff login require the online backend.
