create extension if not exists pgcrypto;

create table if not exists public.web_quote_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  page_path text,
  business_type text,
  website_goal text,
  quote_reference text,
  generated_summary text,
  selected_services jsonb not null default '[]'::jsonb,
  selected_problems jsonb not null default '[]'::jsonb,
  selected_testimonials jsonb not null default '[]'::jsonb,
  selected_faq_question text,
  custom_question text,
  name text,
  phone text,
  whatsapp_message text
);

create table if not exists public.web_lead_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_name text not null,
  is_final_submission boolean not null default false,
  page_path text,
  business_type text,
  website_goal text,
  quote_reference text,
  generated_summary text,
  selected_services jsonb not null default '[]'::jsonb,
  selected_problems jsonb not null default '[]'::jsonb,
  selected_testimonials jsonb not null default '[]'::jsonb,
  selected_faq_question text,
  custom_question text,
  name text,
  phone text,
  whatsapp_message text
);

alter table public.web_quote_leads enable row level security;
alter table public.web_lead_events enable row level security;

drop policy if exists "public can insert quote leads" on public.web_quote_leads;
create policy "public can insert quote leads"
on public.web_quote_leads
for insert
to anon, authenticated
with check (true);

drop policy if exists "public can insert lead events" on public.web_lead_events;
create policy "public can insert lead events"
on public.web_lead_events
for insert
to anon, authenticated
with check (true);