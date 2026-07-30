-- Run this in Supabase Dashboard → SQL Editor
-- Adds the alternate email field used for account recovery

alter table public.profiles
  add column if not exists alternate_email text;
