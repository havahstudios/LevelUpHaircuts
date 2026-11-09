-- Level-Up Hair Salon: online booking and salon schedule.
-- Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Every table has Row Level Security on. Visitors can read services,
-- stylists and hours; only staff can read or change bookings and clients.

create extension if not exists btree_gist;

-- ---------------------------------------------------------------- staff --
-- Which logged-in users work at the salon. Owners can manage other staff.
create table public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  role text not null default 'staff' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now()
);

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;

create or replace function public.is_owner() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid() and role = 'owner');
$$;

-- ------------------------------------------------------------- settings --
-- One row of booking rules the salon can change in the dashboard.
create table public.settings (
  id int primary key default 1 check (id = 1),
  min_notice_minutes int not null default 120,
  max_days_ahead int not null default 60,
  slot_minutes int not null default 15,
  notify_email text
);
insert into public.settings (id) values (1);

-- ------------------------------------------------------ services/stylists --
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Cut & colour',
  description text not null default '',
  duration_minutes int not null check (duration_minutes between 5 and 600),
  price_cents int check (price_cents >= 0),        -- null shows "to confirm"
  price_from boolean not null default false,       -- shows "from $X"
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table public.stylists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table public.stylist_services (
  stylist_id uuid not null references public.stylists (id) on delete cascade,
  service_id uuid not null references public.services (id) on delete cascade,
  primary key (stylist_id, service_id)
);

-- ------------------------------------------------------------------ hours --
-- weekday: 0 = Sunday ... 6 = Saturday. Times are Los Angeles local time.
create table public.salon_hours (
  weekday int primary key check (weekday between 0 and 6),
  opens time,
  closes time,
  closed boolean not null default false,
  check (closed or (opens is not null and closes is not null and opens < closes))
);

create table public.stylist_hours (
  stylist_id uuid not null references public.stylists (id) on delete cascade,
  weekday int not null check (weekday between 0 and 6),
  starts time,
  ends time,
  off boolean not null default false,
  primary key (stylist_id, weekday),
  check (off or (starts is not null and ends is not null and starts < ends))
);

create table public.closed_dates (
  day date primary key,
  reason text not null default ''
);

-- stylist_id null = the whole salon is blocked.
create table public.time_off (
  id uuid primary key default gen_random_uuid(),
  stylist_id uuid references public.stylists (id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text not null default '',
  created_at timestamptz not null default now(),
  check (starts_at < ends_at)
);

-- ------------------------------------------------------ clients/bookings --
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null default '',
  email text not null default '',
  notes text not null default '',
  -- Digits only, so "(310) 555-0100" and "310.555.0100" match the same client.
  phone_digits text generated always as (regexp_replace(phone, '\D', '', 'g')) stored,
  created_at timestamptz not null default now()
);
create index clients_phone_idx on public.clients (phone_digits);
create index clients_email_idx on public.clients (lower(email));

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete restrict,
  stylist_id uuid not null references public.stylists (id) on delete restrict,
  service_id uuid not null references public.services (id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'booked' check (status in ('booked', 'cancelled', 'completed', 'no_show')),
  source text not null default 'online' check (source in ('online', 'phone', 'walk_in')),
  note text not null default '',
  manage_code text not null unique default (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (starts_at < ends_at),
  -- The rule that makes double bookings impossible: a stylist cannot have two
  -- live bookings whose times overlap. Cancelled ones do not count.
  constraint bookings_no_overlap exclude using gist (
    stylist_id with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (status in ('booked', 'completed'))
);
create index bookings_starts_idx on public.bookings (starts_at);

-- ------------------------------------------------------------------- RLS --
alter table public.staff enable row level security;
alter table public.settings enable row level security;
alter table public.services enable row level security;
alter table public.stylists enable row level security;
alter table public.stylist_services enable row level security;
alter table public.salon_hours enable row level security;
alter table public.stylist_hours enable row level security;
alter table public.closed_dates enable row level security;
alter table public.time_off enable row level security;
alter table public.clients enable row level security;
alter table public.bookings enable row level security;

-- Public (anyone) can read what the booking page needs. Nothing else.
create policy "public reads active services" on public.services for select using (active or public.is_staff());
create policy "public reads active stylists" on public.stylists for select using (active or public.is_staff());
create policy "public reads stylist services" on public.stylist_services for select using (true);
create policy "public reads salon hours" on public.salon_hours for select using (true);
create policy "public reads stylist hours" on public.stylist_hours for select using (true);
create policy "public reads closed dates" on public.closed_dates for select using (true);
create policy "public reads settings" on public.settings for select using (true);

-- Staff can change the booking setup.
create policy "staff manage services" on public.services for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage stylists" on public.stylists for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage stylist services" on public.stylist_services for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage salon hours" on public.salon_hours for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage stylist hours" on public.stylist_hours for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage closed dates" on public.closed_dates for all using (public.is_staff()) with check (public.is_staff());
create policy "staff update settings" on public.settings for update using (public.is_staff()) with check (public.is_staff());

-- Bookings, clients and time off: staff only. Online bookings are written by
-- the server with the service key after it re-checks the time is free.
create policy "staff manage time off" on public.time_off for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage clients" on public.clients for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage bookings" on public.bookings for all using (public.is_staff()) with check (public.is_staff());

-- Staff list: staff can see colleagues; only owners add or remove.
create policy "staff read staff" on public.staff for select using (public.is_staff());
create policy "owner manages staff" on public.staff for all using (public.is_owner()) with check (public.is_owner());

-- ------------------------------------------------------------ starting data --
-- From the salon's Yelp page. The salon edits all of this in the dashboard.
insert into public.salon_hours (weekday, opens, closes, closed) values
  (0, null, null, true),
  (1, '09:00', '18:00', false),
  (2, '09:00', '18:00', false),
  (3, '09:00', '18:00', false),
  (4, '09:00', '19:00', false),
  (5, '09:00', '19:00', false),
  (6, '09:00', '18:00', false);

-- Durations are starting guesses for the salon to correct. Prices are unknown (null).
insert into public.services (name, category, description, duration_minutes, sort) values
  ('Haircut', 'Cut & colour', 'Women, men and kids', 45, 1),
  ('Cut and colour', 'Cut & colour', 'Colour with a finished cut', 120, 2),
  ('Hair styling', 'Cut & colour', 'Styled for the day or an event', 45, 3),
  ('Blow-dry', 'Style & treatment', 'Smooth, full and long-lasting', 45, 4),
  ('Perm', 'Style & treatment', 'Soft waves to defined curls', 120, 5),
  ('Chemical treatment', 'Style & treatment', 'Ask us what suits your hair', 90, 6);

-- Stylists named in recent Yelp reviews. The salon confirms or edits them.
insert into public.stylists (name, sort) values ('Norma', 1), ('Sara', 2), ('Isabella', 3);

insert into public.stylist_services (stylist_id, service_id)
  select st.id, sv.id from public.stylists st cross join public.services sv;

insert into public.stylist_hours (stylist_id, weekday, starts, ends, off)
  select st.id, h.weekday, h.opens, h.closes, h.closed
  from public.stylists st cross join public.salon_hours h;
