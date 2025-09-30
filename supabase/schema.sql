
-- Enable UUIDs & crypto
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type visa_type as enum ('tourist','business','transit');
exception when duplicate_object then null; end $$;

do $$ begin
   create type app_status as enum ('draft','submitted','in_review','approved','rejected','requires_information','payment_pending','payment_received','issued','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type doc_type as enum ('photo','passport_scan','itinerary','invitation_letter','business_letter','hotel_booking','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending','authorized','captured','failed','refunded','voided');
exception when duplicate_object then null; end $$;

-- Profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  phone text,
  nationality text,
  created_at timestamptz default now()
);

-- Applications
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null, -- Require authenticated user
  reference_number text unique,
  visa_type visa_type not null,
  purpose text,
  travel_start date,
  travel_end date,
  amount_usd numeric(10,2),
  status app_status not null default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Applicant details attached to an application (flattened for simplicity)
create table if not exists public.applicants (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  given_names text not null,
  surname text not null,
  gender text,
  date_of_birth date,
  country_of_birth text,
  nationality text,
  passport_number text not null,
  passport_issue_date date,
  passport_expiry_date date,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  phone text,
  email text
);

-- Documents
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  doc_type doc_type not null,
  storage_path text not null,
  file_name text,
  uploaded_at timestamptz default now()
);

-- Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  amount_usd numeric(10,2) not null,
  provider text,
  provider_ref text,
  status payment_status not null default 'pending',
  created_at timestamptz default now()
);

-- Status History
create table if not exists public.application_status_history (
  id bigserial primary key,
  application_id uuid not null references public.applications(id) on delete cascade,
  status app_status not null,
  note text,
  created_at timestamptz default now()
);

-- Reference number generator
create or replace function public.generate_reference_number() returns trigger as $$
declare
  y text := to_char(now(), 'YYYY');
  seq int;
begin
  -- daily sequence (or yearly): use application count this year + 1
  select count(*) + 1 into seq from public.applications where date_part('year', created_at) = date_part('year', now());
  new.reference_number := 'GN-EVISA-' || y || '-' || lpad(seq::text, 4, '0');
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_app_ref on public.applications;
create trigger trg_app_ref before insert on public.applications
for each row execute procedure public.generate_reference_number();

-- RLS
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.applicants enable row level security;
alter table public.documents enable row level security;
alter table public.payments enable row level security;
alter table public.application_status_history enable row level security;

-- Policies: only owner (auth.uid()) can access their rows
create policy "profiles owner access" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- Enable proper RLS policies for authenticated users
create policy "applications owner select" on public.applications
  for select using (user_id = auth.uid());
create policy "applications owner modify" on public.applications
  for insert with check (user_id = auth.uid());
create policy "applications owner update" on public.applications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "applications owner delete" on public.applications
  for delete using (user_id = auth.uid());

-- Enable owner-based policies for applicants
create policy "applicants by owner" on public.applicants
  for all using (application_id in (select id from public.applications where user_id = auth.uid()))
  with check (application_id in (select id from public.applications where user_id = auth.uid()));

-- Remove anonymous access policies
drop policy if exists "applications anonymous access" on public.applications;
drop policy if exists "applicants anonymous access" on public.applicants;
drop policy if exists "public select applicants" on public.applicants;
drop policy if exists "status history anonymous access" on public.application_status_history;

-- Enable proper owner-based policies for all tables
create policy "documents by owner" on public.documents
  for all using (application_id in (select id from public.applications where user_id = auth.uid()))
  with check (application_id in (select id from public.applications where user_id = auth.uid()));

create policy "payments by owner" on public.payments
  for all using (application_id in (select id from public.applications where user_id = auth.uid()))
  with check (application_id in (select id from public.applications where user_id = auth.uid()));

create policy "status history by owner" on public.application_status_history
  for select using (application_id in (select id from public.applications where user_id = auth.uid()));

-- RPC to create an application in one shot (used by UI)
create or replace function public.create_application(
  p_visa_type visa_type,
  p_given_names text,
  p_surname text,
  p_passport_number text,
  p_email text,
  p_travel_start date,
  p_travel_end date
) returns void as $$
declare
  app_id uuid;
  amount numeric(10,2);
begin
  case p_visa_type
    when 'tourist' then amount := 85.00;
    when 'business' then amount := 150.00;
    when 'transit' then amount := 45.00;
    else amount := 0.00;
  end case;

  -- Create application for authenticated user
  insert into public.applications (user_id, visa_type, travel_start, travel_end, amount_usd, status)
   values (auth.uid(), p_visa_type, p_travel_start, p_travel_end, amount, 'payment_pending')
    returning id into app_id;

  insert into public.applicants (application_id, given_names, surname, passport_number, email)
    values (app_id, p_given_names, p_surname, p_passport_number, p_email);

  insert into public.application_status_history (application_id, status, note)
    values (app_id, 'payment_pending', 'Application created, pending payment');
end;
$$ language plpgsql security definer;

-- RPC to retrieve application by email
create or replace function public.get_application_by_email(p_email text)
returns json
as $$
declare
  result json;
begin
  select json_build_object(
    'id', a.id,
    'visa_type', a.visa_type,
    'status', a.status,
    'amount_usd', a.amount_usd
  ) into result
  from public.applications a
  join public.applicants ap on a.id = ap.application_id
  where ap.email = p_email
  order by a.created_at desc
  limit 1;
  return result;
end;
$$ language plpgsql security definer;

-- A *detailed* flattened table (as requested) for analytics or exports
create table if not exists public.visa_applications_detailed (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reference_number text not null,
  visa_type visa_type not null,
  status app_status not null,
  given_names text,
  surname text,
  gender text,
  date_of_birth date,
  nationality text,
  passport_number text,
  passport_issue_date date,
  passport_expiry_date date,
  travel_start date,
  travel_end date,
  purpose text,
  amount_usd numeric(10,2),
  payment_status payment_status,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_applications_user on public.applications(user_id);
create index if not exists idx_applications_ref on public.applications(reference_number);
create index if not exists idx_applicants_app on public.applicants(application_id);
create index if not exists idx_documents_app on public.documents(application_id);
create index if not exists idx_payments_app on public.payments(application_id);
