alter table public.appointments
  add column if not exists guest_name text,
  add column if not exists guest_email text,
  add column if not exists guest_phone text;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'appointments'
      and policyname = 'Appointments are insertable for public booking'
  ) then
    create policy "Appointments are insertable for public booking" on public.appointments
      for insert with check (user_id is null or auth.uid() = user_id);
  end if;
end
$$;