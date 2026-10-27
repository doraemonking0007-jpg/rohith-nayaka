-- BreakBite online canteen setup.
-- Run once in Supabase Dashboard > SQL Editor as the project owner.
create extension if not exists pgcrypto;

create sequence if not exists public.order_token_seq start 1;
revoke all on sequence public.order_token_seq from anon, authenticated;

create table if not exists public.staff_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'kitchen' check (role in ('admin', 'kitchen')),
  display_name text not null default 'Kitchen staff',
  created_at timestamptz not null default now()
);
alter table public.staff_users add column if not exists role text not null default 'kitchen';
alter table public.staff_users add column if not exists display_name text not null default 'Kitchen staff';
alter table public.staff_users add column if not exists created_at timestamptz not null default now();
alter table public.staff_users enable row level security;
revoke all on public.staff_users from anon, authenticated;
grant select on public.staff_users to authenticated;
drop policy if exists "Staff can read own staff record" on public.staff_users;
create policy "Staff can read own staff record" on public.staff_users
  for select to authenticated using (user_id = (select auth.uid()));

create table if not exists public.menu_items (
  id text primary key,
  name text not null check (char_length(name) between 1 and 70),
  description text not null default '' check (char_length(description) <= 180),
  price integer not null check (price between 1 and 100000),
  category text not null check (category in ('quick', 'hot', 'drinks')),
  image_url text not null default '',
  available boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.menu_items enable row level security;
grant select on public.menu_items to anon, authenticated;
grant insert, update, delete on public.menu_items to authenticated;
drop policy if exists "Menu is publicly readable" on public.menu_items;
create policy "Menu is publicly readable" on public.menu_items for select to anon, authenticated using (true);
drop policy if exists "Staff manage menu" on public.menu_items;
create policy "Staff manage menu" on public.menu_items for all to authenticated
  using (exists (select 1 from public.staff_users s where s.user_id = (select auth.uid())))
  with check (exists (select 1 from public.staff_users s where s.user_id = (select auth.uid())));

create table if not exists public.service_settings (
  id integer primary key check (id = 1),
  is_open boolean not null default false,
  service_name text not null default 'Breakfast pickup' check (char_length(service_name) between 1 and 48),
  pickup_start time not null default '10:00',
  pickup_end time not null default '10:30',
  cutoff_time time not null default '09:45',
  timezone text not null default 'Asia/Kolkata',
  updated_at timestamptz not null default now(),
  check (pickup_end > pickup_start)
);
alter table public.service_settings enable row level security;
grant select on public.service_settings to anon, authenticated;
grant insert, update on public.service_settings to authenticated;
drop policy if exists "Service hours are publicly readable" on public.service_settings;
create policy "Service hours are publicly readable" on public.service_settings for select to anon, authenticated using (true);
drop policy if exists "Staff manage service hours" on public.service_settings;
create policy "Staff manage service hours" on public.service_settings for all to authenticated
  using (exists (select 1 from public.staff_users s where s.user_id = (select auth.uid())))
  with check (exists (select 1 from public.staff_users s where s.user_id = (select auth.uid())));
insert into public.service_settings (id) values (1) on conflict (id) do nothing;

insert into public.menu_items (id, name, description, price, category, available, position) values
  ('sandwich', 'Veggie sandwich', 'Fresh greens, tomato & mint chutney', 45, 'quick', true, 0),
  ('idli', 'Idli sambar', 'Fluffy idlis with warm, homestyle sambar', 35, 'hot', true, 1),
  ('poha', 'Masala poha', 'Light, lemony & topped with crunchy sev', 30, 'quick', true, 2),
  ('chai', 'Hot masala chai', 'A little ginger, a lot of comfort', 15, 'drinks', true, 3)
on conflict (id) do nothing;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  token text not null unique default ('B' || lpad(nextval('public.order_token_seq')::text, 3, '0')),
  customer_id uuid not null references auth.users(id),
  name text not null check (char_length(name) between 1 and 36),
  items jsonb not null,
  total integer not null check (total >= 0),
  status text not null default 'Received' check (status in ('Received', 'Preparing', 'Ready', 'Collected')),
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
grant select, update on public.orders to authenticated;
drop policy if exists "Anonymous customers can create own orders" on public.orders;
drop policy if exists "Customers and staff can read orders" on public.orders;
create policy "Customers and staff can read orders" on public.orders for select to authenticated using (
  customer_id = (select auth.uid()) or exists (select 1 from public.staff_users s where s.user_id = (select auth.uid()))
);
drop policy if exists "Staff can update orders" on public.orders;
create policy "Staff can update orders" on public.orders for update to authenticated
  using (exists (select 1 from public.staff_users s where s.user_id = (select auth.uid())))
  with check (exists (select 1 from public.staff_users s where s.user_id = (select auth.uid())));

create or replace function public.place_order(p_name text, p_items jsonb)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders;
  v_settings public.service_settings;
  v_items jsonb;
  v_total integer;
  v_requested integer;
  v_matched integer;
begin
  if auth.uid() is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) is not true then
    raise exception 'Student sign-in is required to place an order';
  end if;
  if char_length(trim(coalesce(p_name, ''))) not between 1 and 36 then
    raise exception 'Enter a name between 1 and 36 characters';
  end if;
  if jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'Add at least one menu item';
  end if;
  if jsonb_array_length(p_items) = 0 then raise exception 'Add at least one menu item'; end if;
  if jsonb_array_length(p_items) > 100 then raise exception 'An order can contain at most 100 different menu items'; end if;
  select * into v_settings from public.service_settings where id = 1;
  if not found or not v_settings.is_open then raise exception 'Online ordering is closed'; end if;
  if (now() at time zone v_settings.timezone)::time >= v_settings.cutoff_time then
    raise exception 'The order cutoff time has passed';
  end if;
  select count(*) into v_requested from jsonb_to_recordset(p_items) as requested(id text, qty integer);
  if exists (
    select 1 from jsonb_to_recordset(p_items) as requested(id text, qty integer)
    left join public.menu_items menu on menu.id = requested.id
    where menu.id is null or menu.available is not true or requested.qty is null or requested.qty < 1 or requested.qty > 20
  ) then raise exception 'One or more menu items are unavailable'; end if;
  select jsonb_agg(jsonb_build_object('name', menu.name, 'qty', requested.qty, 'price', menu.price) order by menu.position),
         sum(menu.price * requested.qty), count(*)
    into v_items, v_total, v_matched
    from jsonb_to_recordset(p_items) as requested(id text, qty integer)
    join public.menu_items menu on menu.id = requested.id and menu.available is true;
  if v_matched <> v_requested then raise exception 'Could not validate the complete order'; end if;
  insert into public.orders (customer_id, name, items, total)
  values (auth.uid(), trim(p_name), v_items, v_total)
  returning * into v_order;
  return v_order;
end;
$$;
revoke all on function public.place_order(text, jsonb) from public, anon;
grant execute on function public.place_order(text, jsonb) to authenticated;

-- Publicly readable food photos; only authenticated staff can upload or remove them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('menu-images', 'menu-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "Menu photos are public" on storage.objects;
create policy "Menu photos are public" on storage.objects for select using (bucket_id = 'menu-images');
drop policy if exists "Staff upload menu photos" on storage.objects;
create policy "Staff upload menu photos" on storage.objects for insert to authenticated with check (
  bucket_id = 'menu-images' and exists (select 1 from public.staff_users s where s.user_id = (select auth.uid()))
);
drop policy if exists "Staff update menu photos" on storage.objects;
create policy "Staff update menu photos" on storage.objects for update to authenticated using (
  bucket_id = 'menu-images' and exists (select 1 from public.staff_users s where s.user_id = (select auth.uid()))
) with check (bucket_id = 'menu-images' and exists (select 1 from public.staff_users s where s.user_id = (select auth.uid())));
drop policy if exists "Staff delete menu photos" on storage.objects;
create policy "Staff delete menu photos" on storage.objects for delete to authenticated using (
  bucket_id = 'menu-images' and exists (select 1 from public.staff_users s where s.user_id = (select auth.uid()))
);

do $$ begin
  alter publication supabase_realtime add table public.orders;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table public.menu_items;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table public.service_settings;
exception when duplicate_object then null;
end $$;
