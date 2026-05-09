-- Audits table
create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  share_token text unique not null,
  team_size int not null,
  use_case text not null,
  tools jsonb not null,
  results jsonb not null,
  total_monthly_spend numeric not null default 0,
  potential_savings numeric not null default 0
);

-- Leads table
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  audit_id uuid references audits(id) on delete cascade,
  email text not null,
  company_name text,
  role text,
  honeypot text -- must be empty; bot protection
);

-- Indexes
create index if not exists audits_share_token_idx on audits(share_token);
create index if not exists leads_audit_id_idx on leads(audit_id);
create index if not exists leads_email_idx on leads(email);

-- RLS
alter table audits enable row level security;
alter table leads enable row level security;

-- Audits: anyone can read (public share URLs)
create policy "audits_public_read" on audits
  for select using (true);

-- Audits: only service role can insert
create policy "audits_service_insert" on audits
  for insert with check (true);

-- Leads: only service role can insert/read
create policy "leads_service_insert" on leads
  for insert with check (true);

create policy "leads_service_read" on leads
  for select using (true);