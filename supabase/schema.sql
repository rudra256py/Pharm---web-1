-- =====================================================================
-- Department of Pharmacy website: database setup
-- Run this ONCE in Supabase -> SQL Editor -> New query -> paste -> Run
-- =====================================================================

-- 1. PROFILES: one row per user, holds the role and programme -----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null default '',
  role text not null default 'student'
    check (role in ('student', 'uploader', 'alumni', 'admin')),
  discipline text not null default 'dpharm'
    check (discipline in ('dpharm', 'bpharm', 'mpharm', 'phd')),
  created_at timestamptz not null default now()
);

-- Helper functions (security definer so policies can read the caller's role safely)
create or replace function public.get_my_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.get_my_discipline()
returns text language sql stable security definer set search_path = public as $$
  select discipline from public.profiles where id = auth.uid()
$$;

-- Automatically create a profile when someone signs up.
-- People can only ever start as 'student' or 'alumni'. Uploader/admin is given by an admin.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  req_role text;
  disc text;
begin
  req_role := case when new.raw_user_meta_data->>'requested_role' = 'alumni'
                    then 'alumni' else 'student' end;
  disc := coalesce(nullif(new.raw_user_meta_data->>'discipline', ''), 'dpharm');
  if disc not in ('dpharm', 'bpharm', 'mpharm', 'phd') then
    disc := 'dpharm';
  end if;
  insert into public.profiles (id, email, full_name, role, discipline)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), req_role, disc);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.get_my_role() = 'admin');

drop policy if exists "profiles: admin update" on public.profiles;
create policy "profiles: admin update" on public.profiles
  for update to authenticated
  using (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

-- 2. NOTICES ------------------------------------------------------------
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  discipline text not null default 'all'
    check (discipline in ('all', 'dpharm', 'bpharm', 'mpharm', 'phd')),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null default '',
  created_at timestamptz not null default now()
);

alter table public.notices enable row level security;

drop policy if exists "notices: anyone can read" on public.notices;
create policy "notices: anyone can read" on public.notices
  for select using (true);

drop policy if exists "notices: uploader or admin insert" on public.notices;
create policy "notices: uploader or admin insert" on public.notices
  for insert to authenticated
  with check (
    author_id = auth.uid() and (
      public.get_my_role() = 'admin'
      or (public.get_my_role() = 'uploader' and discipline = public.get_my_discipline())
    )
  );

drop policy if exists "notices: owner or admin delete" on public.notices;
create policy "notices: owner or admin delete" on public.notices
  for delete to authenticated
  using (author_id = auth.uid() or public.get_my_role() = 'admin');

-- 3. LECTURE NOTES ------------------------------------------------------
create table if not exists public.lecture_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  discipline text not null
    check (discipline in ('dpharm', 'bpharm', 'mpharm', 'phd')),
  file_path text not null,
  file_name text not null,
  uploader_id uuid not null references auth.users(id) on delete cascade,
  uploader_name text not null default '',
  created_at timestamptz not null default now()
);

alter table public.lecture_notes enable row level security;

-- Logged-in users only see notes of their own programme (admin sees all)
drop policy if exists "lecture_notes: read own programme" on public.lecture_notes;
create policy "lecture_notes: read own programme" on public.lecture_notes
  for select to authenticated
  using (public.get_my_role() = 'admin' or discipline = public.get_my_discipline());

drop policy if exists "lecture_notes: uploader or admin insert" on public.lecture_notes;
create policy "lecture_notes: uploader or admin insert" on public.lecture_notes
  for insert to authenticated
  with check (
    uploader_id = auth.uid() and (
      public.get_my_role() = 'admin'
      or (public.get_my_role() = 'uploader' and discipline = public.get_my_discipline())
    )
  );

drop policy if exists "lecture_notes: owner or admin delete" on public.lecture_notes;
create policy "lecture_notes: owner or admin delete" on public.lecture_notes
  for delete to authenticated
  using (uploader_id = auth.uid() or public.get_my_role() = 'admin');

-- 4. ALUMNI REGISTRY ----------------------------------------------------
create table if not exists public.alumni (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null,
  batch text not null,
  discipline text,
  job_title text,
  organization text,
  city text,
  bio text,
  linkedin text,
  created_at timestamptz not null default now()
);

alter table public.alumni enable row level security;

drop policy if exists "alumni: anyone can read" on public.alumni;
create policy "alumni: anyone can read" on public.alumni
  for select using (true);

drop policy if exists "alumni: own insert" on public.alumni;
create policy "alumni: own insert" on public.alumni
  for insert to authenticated
  with check (user_id = auth.uid() and public.get_my_role() in ('alumni', 'admin'));

drop policy if exists "alumni: own update" on public.alumni;
create policy "alumni: own update" on public.alumni
  for update to authenticated
  using (user_id = auth.uid() or public.get_my_role() = 'admin')
  with check (user_id = auth.uid() or public.get_my_role() = 'admin');

drop policy if exists "alumni: admin delete" on public.alumni;
create policy "alumni: admin delete" on public.alumni
  for delete to authenticated
  using (public.get_my_role() = 'admin');

-- 5. GALLERY ------------------------------------------------------------
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_path text not null,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.gallery enable row level security;

drop policy if exists "gallery: anyone can read" on public.gallery;
create policy "gallery: anyone can read" on public.gallery
  for select using (true);

drop policy if exists "gallery: admin insert" on public.gallery;
create policy "gallery: admin insert" on public.gallery
  for insert to authenticated with check (public.get_my_role() = 'admin');

drop policy if exists "gallery: admin delete" on public.gallery;
create policy "gallery: admin delete" on public.gallery
  for delete to authenticated using (public.get_my_role() = 'admin');

-- 6. FILE STORAGE (buckets + rules) --------------------------------------
-- lecture-notes = private (needs login), gallery = public images
insert into storage.buckets (id, name, public)
values ('lecture-notes', 'lecture-notes', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Files are stored as  <programme>/<file>.pdf  so the first folder = programme
drop policy if exists "notes files: read own programme" on storage.objects;
create policy "notes files: read own programme" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'lecture-notes'
    and (public.get_my_role() = 'admin'
         or (storage.foldername(name))[1] = public.get_my_discipline())
  );

drop policy if exists "notes files: uploader upload" on storage.objects;
create policy "notes files: uploader upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'lecture-notes'
    and (public.get_my_role() = 'admin'
         or (public.get_my_role() = 'uploader'
             and (storage.foldername(name))[1] = public.get_my_discipline()))
  );

drop policy if exists "notes files: uploader delete" on storage.objects;
create policy "notes files: uploader delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'lecture-notes'
    and (public.get_my_role() = 'admin'
         or (public.get_my_role() = 'uploader'
             and (storage.foldername(name))[1] = public.get_my_discipline()))
  );

drop policy if exists "gallery files: public read" on storage.objects;
create policy "gallery files: public read" on storage.objects
  for select using (bucket_id = 'gallery');

drop policy if exists "gallery files: admin upload" on storage.objects;
create policy "gallery files: admin upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'gallery' and public.get_my_role() = 'admin');

drop policy if exists "gallery files: admin delete" on storage.objects;
create policy "gallery files: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gallery' and public.get_my_role() = 'admin');

-- =====================================================================
-- MAKE YOURSELF ADMIN (do this AFTER you sign up on the website once)
-- Replace the email below with the email you signed up with, then Run:
--
-- update public.profiles set role = 'admin'
-- where email = 'your-email@example.com';
-- =====================================================================
