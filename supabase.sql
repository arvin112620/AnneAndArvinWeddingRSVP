create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_email text not null unique,
  full_name text not null,
  plus_one text,
  attendance text not null check (attendance in ('accept', 'decline')),
  dietary text not null check (dietary in ('standard', 'vegan', 'gluten-free', 'allergies')),
  message text,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;

drop policy if exists "Allow RSVP inserts" on public.rsvps;
create policy "Allow RSVP inserts"
  on public.rsvps
  for insert
  to anon, authenticated
  with check (true);

-- Run these two statements when upgrading an existing RSVP table.
alter table public.rsvps add column if not exists guest_email text;
create unique index if not exists rsvps_guest_email_idx on public.rsvps (guest_email) where guest_email is not null;
