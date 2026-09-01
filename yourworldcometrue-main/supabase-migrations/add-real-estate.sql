-- Run this in Supabase Dashboard → SQL Editor
-- Adds Real Estate: businesses (e.g. AMMA DEVELOPERS), their admin logins, and property listings

-- 1. Real estate businesses (so this supports multiple builders later, not just AMMA DEVELOPERS)
create table if not exists public.real_estate_businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  phone text,
  whatsapp text,
  created_at timestamptz default now()
);

-- 2. Links an auth user (a login) to a business as its admin
create table if not exists public.real_estate_admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid not null references public.real_estate_businesses(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, business_id)
);

-- 3. Property listings
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.real_estate_businesses(id) on delete cascade,
  title text not null,
  description text,
  price numeric,
  location text,
  bedrooms int,
  bathrooms int,
  area_sqft numeric,
  status text not null default 'available' check (status in ('available', 'sold', 'coming_soon')),
  images text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Seed AMMA DEVELOPERS as the first business
insert into public.real_estate_businesses (name, slug)
values ('AMMA DEVELOPERS', 'amma-developers')
on conflict (slug) do nothing;

-- Row Level Security
alter table public.real_estate_businesses enable row level security;
alter table public.real_estate_admins enable row level security;
alter table public.properties enable row level security;

-- Anyone can view businesses and available properties (public listings)
create policy if not exists "Businesses are publicly viewable"
  on public.real_estate_businesses for select
  using (true);

create policy if not exists "Properties are publicly viewable"
  on public.properties for select
  using (true);

-- Only a business's own admins can see their own admin link (used to check "am I an admin")
create policy if not exists "Admins can see their own admin rows"
  on public.real_estate_admins for select
  using (auth.uid() = user_id);

-- Only a business's admins can insert/update/delete that business's properties
create policy if not exists "Business admins manage their own properties"
  on public.properties for all
  using (
    exists (
      select 1 from public.real_estate_admins
      where real_estate_admins.business_id = properties.business_id
      and real_estate_admins.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.real_estate_admins
      where real_estate_admins.business_id = properties.business_id
      and real_estate_admins.user_id = auth.uid()
    )
  );

-- After creating the AMMA DEVELOPERS login user in Supabase Auth (Dashboard → Authentication → Add user),
-- run this to link that user as the AMMA DEVELOPERS admin (replace the email):
--
-- insert into public.real_estate_admins (user_id, business_id)
-- select u.id, b.id
-- from auth.users u, public.real_estate_businesses b
-- where u.email = 'REPLACE_WITH_AMMA_DEVELOPERS_LOGIN_EMAIL'
-- and b.slug = 'amma-developers';
