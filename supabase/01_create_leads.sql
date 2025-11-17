create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  condo_name text,
  city text,
  fractions_number int,
  contact_email text,
  created_at timestamptz default now()
);
