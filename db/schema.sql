-- BrokerFlow AI - Supabase PostgreSQL schema
create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text unique,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references users(id) on delete cascade,
  whatsapp_provider text not null default 'mock' check (whatsapp_provider in ('mock', 'twilio', 'meta')),
  timezone text not null default 'Asia/Kolkata',
  billing_status text not null default 'trial' check (billing_status in ('trial', 'active', 'past_due', 'cancelled')),
  working_hours jsonb not null default '{"start":"09:00","end":"19:00"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  source text not null check (source in ('99acres', 'magicbricks', 'manual')),
  phone_number text not null,
  name text,
  budget text,
  location_preference text,
  intent text not null default 'unknown' check (intent in ('buy', 'rent', 'unknown')),
  status text not null default 'new' check (status in ('new', 'qualifying', 'hot', 'appointment_booked')),
  ai_confidence numeric(4,3) not null default 0,
  qualified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists agent_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  lead_id uuid not null references leads(id) on delete cascade,
  alert_type text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  razorpay_order_id text unique not null,
  razorpay_payment_id text,
  amount_paise integer not null,
  currency text not null default 'INR',
  status text not null default 'created' check (status in ('created', 'paid', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leads_user_created on leads(user_id, created_at desc);
create index if not exists idx_messages_lead_created on messages(lead_id, created_at asc);
create index if not exists idx_payment_orders_user_created on payment_orders(user_id, created_at desc);

-- -------------------------
-- RLS: Clerk JWT based tenant isolation
-- Set JWT template in Supabase with: {"sub":"{{user.id}}"}
-- -------------------------
alter table users enable row level security;
alter table settings enable row level security;
alter table leads enable row level security;
alter table messages enable row level security;
alter table agent_alerts enable row level security;
alter table payment_orders enable row level security;

create or replace function requesting_clerk_user_id()
returns text
language sql
stable
as $$
  select coalesce(
    nullif((current_setting('request.jwt.claims', true)::jsonb ->> 'sub'), ''),
    'anonymous'
  );
$$;

drop policy if exists users_select_own on users;
create policy users_select_own on users for select using (clerk_user_id = requesting_clerk_user_id());

drop policy if exists users_insert_own on users;
create policy users_insert_own on users for insert with check (clerk_user_id = requesting_clerk_user_id());

drop policy if exists users_update_own on users;
create policy users_update_own on users for update using (clerk_user_id = requesting_clerk_user_id());

drop policy if exists settings_all_own on settings;
create policy settings_all_own on settings
for all
using (user_id in (select id from users where clerk_user_id = requesting_clerk_user_id()))
with check (user_id in (select id from users where clerk_user_id = requesting_clerk_user_id()));

drop policy if exists leads_all_own on leads;
create policy leads_all_own on leads
for all
using (user_id in (select id from users where clerk_user_id = requesting_clerk_user_id()))
with check (user_id in (select id from users where clerk_user_id = requesting_clerk_user_id()));

drop policy if exists alerts_all_own on agent_alerts;
create policy alerts_all_own on agent_alerts
for all
using (user_id in (select id from users where clerk_user_id = requesting_clerk_user_id()))
with check (user_id in (select id from users where clerk_user_id = requesting_clerk_user_id()));

drop policy if exists payment_orders_all_own on payment_orders;
create policy payment_orders_all_own on payment_orders
for all
using (user_id in (select id from users where clerk_user_id = requesting_clerk_user_id()))
with check (user_id in (select id from users where clerk_user_id = requesting_clerk_user_id()));

drop policy if exists messages_all_own on messages;
create policy messages_all_own on messages
for all
using (
  lead_id in (
    select l.id from leads l
    join users u on u.id = l.user_id
    where u.clerk_user_id = requesting_clerk_user_id()
  )
)
with check (
  lead_id in (
    select l.id from leads l
    join users u on u.id = l.user_id
    where u.clerk_user_id = requesting_clerk_user_id()
  )
);
