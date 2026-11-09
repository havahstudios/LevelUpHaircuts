-- Level-Up Hair Salon: the salon accepts or declines online bookings.
-- Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to run after 0001_booking.sql. Existing bookings are kept as they are.

-- Two new statuses: pending (waiting for the salon) and declined.
alter table public.bookings drop constraint if exists bookings_status_check;
alter table public.bookings add constraint bookings_status_check
  check (status in ('pending', 'booked', 'declined', 'cancelled', 'completed', 'no_show'));

-- Pending bookings hold their time while the salon decides. Declined and
-- cancelled ones free it.
alter table public.bookings drop constraint if exists bookings_no_overlap;
alter table public.bookings add constraint bookings_no_overlap exclude using gist (
  stylist_id with =,
  tstzrange(starts_at, ends_at) with &&
) where (status in ('pending', 'booked', 'completed'));

-- Private code for the Accept / Decline links in the salon's email.
alter table public.bookings add column if not exists respond_code text unique
  default (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''));
update public.bookings set respond_code = replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')
  where respond_code is null;
alter table public.bookings alter column respond_code set not null;

-- When the salon answered.
alter table public.bookings add column if not exists decided_at timestamptz;
