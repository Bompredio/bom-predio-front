-- Cria tabela 'profiles' (se ainda não existir) e insere 6 administradoras de exemplo
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  company_name text not null,
  logo_url text,
  description text,
  city text,
  price_avg text,
  rating_avg numeric,
  services jsonb default '[]'::jsonb,
  verified boolean default true,
  created_at timestamptz default now()
);

create index if not exists idx_profiles_city on public.profiles (city);
create index if not exists idx_profiles_company_name on public.profiles ((lower(company_name)));

insert into public.profiles (company_name, logo_url, description, city, price_avg, rating_avg, services, verified)
values
('Administradora Central', null, 'Gestão completa de condomínios, contabilidade e suporte 24/7.', 'Lisboa', '€1.10/fração', 4.7, '["Contabilidade","Assembleias","Manutenção"]', true),
('Gestão & Companhia', null, 'Soluções personalizadas e assembleias digitais.', 'Porto', '€0.95/fração', 4.5, '["Assembleias","Contratos","Relatórios"]', true),
('CondoFácil Lda', null, 'Transparência e relatórios mensais detalhados.', 'Lisboa', '€1.00/fração', 4.6, '["Relatórios","Cobrança","Suporte"]', true),
('Atlas Administradora', null, 'Foco em redução de custos e transparência fiscal.', 'Coimbra', '€0.85/fração', 4.4, '["Gestão Financeira","Legal"]', true),
('Norte Condominial', null, 'Atendimento local, com equipa técnica própria.', 'Porto', '€0.98/fração', 4.3, '["Manutenção","Inspeções","Serviços Técnicos"]', true),
('Sul & Sol Administracao', null, 'Atendimento presencial e linha de apoio dedicada.', 'Faro', '€1.05/fração', 4.6, '["Atendimento Presencial","Relatórios","Contabilidade"]', true);
