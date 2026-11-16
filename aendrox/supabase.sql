create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  company text,
  service text not null,
  budget text,
  description text not null,
  consent boolean not null check (consent = true)
);
alter table public.contact_submissions enable row level security;
revoke all on public.contact_submissions from anon, authenticated;
