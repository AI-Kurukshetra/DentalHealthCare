create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  preferred_date date not null,
  location text,
  notes text,
  created_at timestamp with time zone default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  tag text not null,
  created_at timestamp with time zone default now()
);

alter table public.appointments enable row level security;
alter table public.posts enable row level security;

create policy "Allow insert appointments" on public.appointments
  for insert with check (true);

create policy "Allow read posts" on public.posts
  for select using (true);

-- Optional demo seed data
insert into public.posts (title, excerpt, tag)
values
  ('Optimizing Chair Utilization', 'Strategies to fill chair time without overwhelming staff.', 'Operations'),
  ('Compliance Built In', 'How audit trails keep your team aligned and safe.', 'Compliance'),
  ('Insurance Workflow Tips', 'Reduce denials with clean claims and instant eligibility.', 'Billing');
