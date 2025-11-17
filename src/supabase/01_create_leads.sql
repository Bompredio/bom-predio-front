-- SQL para criar tabela 'leads' no Supabase
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  condo_name text,
  condo_address text,
  city text,
  fractions_number int,
  service_needs text,
  budget_estimate text,
  contact_name text,
  contact_email text,
  contact_phone text,
  matched_admins jsonb default '[]'::jsonb,
  status text default 'new',
  created_at timestamptz default now()
);

-- índice para pesquisa por cidade
create index if not exists idx_leads_city on public.leads (city);
