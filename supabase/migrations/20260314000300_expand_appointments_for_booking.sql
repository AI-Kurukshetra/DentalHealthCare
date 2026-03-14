alter table public.appointments
  add column if not exists patient_id text,
  add column if not exists appointment_date date,
  add column if not exists appointment_time text,
  add column if not exists doctor_id text,
  add column if not exists status text default 'scheduled',
  add column if not exists notes text;

update public.appointments
set
  appointment_date = coalesce(appointment_date, date),
  appointment_time = coalesce(appointment_time, time),
  status = coalesce(status, 'scheduled')
where appointment_date is null or appointment_time is null or status is null;
