create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  description text,
  city text,
  price_avg text,
  rating_avg numeric,
  services jsonb default '[]',
  verified boolean default true
);

insert into public.profiles (company_name, description, city, price_avg, rating_avg)
values
('Administradora Central', 'Gestão completa 24/7', 'Lisboa', '€1.10/fração', 4.7),
('Gestão & Companhia', 'Soluções personalizadas', 'Porto', '€0.95/fração', 4.5),
('CondoFácil Lda', 'Relatórios mensais', 'Lisboa', '€1.00/fração', 4.6);
