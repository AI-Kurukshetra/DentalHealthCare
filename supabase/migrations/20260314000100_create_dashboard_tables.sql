create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  patient_id text,
  age integer,
  status text,
  avatar_url text,
  phone text,
  email text,
  address text,
  emergency_contact text,
  allergies text,
  conditions text,
  medications text,
  past_treatments text,
  insurance_provider text,
  policy_number text,
  coverage_status text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date,
  time text,
  type text,
  provider text,
  created_at timestamp with time zone default now()
);

create table if not exists public.treatments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date,
  procedure text,
  tooth text,
  provider text,
  created_at timestamp with time zone default now()
);

create table if not exists public.billing_summary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  balance text,
  last_payment text,
  next_invoice text,
  created_at timestamp with time zone default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  message text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.treatments enable row level security;
alter table public.billing_summary enable row level security;
alter table public.notifications enable row level security;

create policy "Profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = user_id);
create policy "Profiles are editable by owner" on public.profiles
  for update using (auth.uid() = user_id);
create policy "Profiles are insertable by owner" on public.profiles
  for insert with check (auth.uid() = user_id);

create policy "Appointments are viewable by owner" on public.appointments
  for select using (auth.uid() = user_id);
create policy "Appointments are editable by owner" on public.appointments
  for update using (auth.uid() = user_id);
create policy "Appointments are insertable by owner" on public.appointments
  for insert with check (auth.uid() = user_id);
create policy "Appointments are deletable by owner" on public.appointments
  for delete using (auth.uid() = user_id);

create policy "Treatments are viewable by owner" on public.treatments
  for select using (auth.uid() = user_id);
create policy "Treatments are editable by owner" on public.treatments
  for update using (auth.uid() = user_id);
create policy "Treatments are insertable by owner" on public.treatments
  for insert with check (auth.uid() = user_id);
create policy "Treatments are deletable by owner" on public.treatments
  for delete using (auth.uid() = user_id);

create policy "Billing summary is viewable by owner" on public.billing_summary
  for select using (auth.uid() = user_id);
create policy "Billing summary is editable by owner" on public.billing_summary
  for update using (auth.uid() = user_id);
create policy "Billing summary is insertable by owner" on public.billing_summary
  for insert with check (auth.uid() = user_id);
create policy "Billing summary is deletable by owner" on public.billing_summary
  for delete using (auth.uid() = user_id);

create policy "Notifications are viewable by owner" on public.notifications
  for select using (auth.uid() = user_id);
create policy "Notifications are insertable by owner" on public.notifications
  for insert with check (auth.uid() = user_id);
create policy "Notifications are deletable by owner" on public.notifications
  for delete using (auth.uid() = user_id);
