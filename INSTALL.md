# Install BreakBite on Android

BreakBite is set up as an installable Progressive Web App (PWA). It opens like an app and caches its interface for offline viewing.

## Publish it once

PWA installation needs the app to be served from a secure HTTPS website (or `localhost` for development). A `file://` page cannot be installed. Publish the files in this folder to any static web host that provides HTTPS. Keep `index.html`, `app.js`, `backend-config.js`, `styles.css`, `manifest.webmanifest`, `icon.svg`, and `sw.js` together in the published folder. Follow [BACKEND-SETUP.md](BACKEND-SETUP.md) to connect the shared Supabase service and deploy the secure staff account function before sharing the site.

## Install on Android

1. Open the published HTTPS address in Chrome on the phone.
2. Tap **Install app** in BreakBite, or open Chrome’s menu and choose **Install app** / **Add to Home screen**.
3. Confirm. BreakBite will appear on the home screen and launch in its own window.

Without the Supabase setup, the app runs in local demo mode and orders are stored only in that browser. With Supabase configured, students and kitchen staff share live orders, menu updates, service hours, and online availability.
