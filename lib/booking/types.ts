// Shapes of the booking tables, as the app uses them.

export type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  duration_minutes: number;
  price_cents: number | null;
  price_from: boolean;
  active: boolean;
  sort: number;
};

export type Stylist = { id: string; name: string; active: boolean; sort: number };

export type Settings = {
  min_notice_minutes: number;
  max_days_ahead: number;
  slot_minutes: number;
  notify_email: string | null;
};

export type SalonHours = { weekday: number; opens: string | null; closes: string | null; closed: boolean };
export type StylistHours = { stylist_id: string; weekday: number; starts: string | null; ends: string | null; off: boolean };
export type TimeOff = { id: string; stylist_id: string | null; starts_at: string; ends_at: string; reason: string };
export type BookingStatus = "booked" | "cancelled" | "completed" | "no_show";
export type BookingSource = "online" | "phone" | "walk_in";

export type Booking = {
  id: string;
  client_id: string;
  stylist_id: string;
  service_id: string;
  starts_at: string;
  ends_at: string;
  status: BookingStatus;
  source: BookingSource;
  note: string;
};

export type Client = { id: string; name: string; phone: string; email: string; notes: string };

/** Show a price the way the salon wants it: "$45", "from $45", or "to confirm". */
export function formatPrice(s: Pick<Service, "price_cents" | "price_from">): string {
  if (s.price_cents === null) return "to confirm";
  const dollars = s.price_cents % 100 === 0 ? `$${s.price_cents / 100}` : `$${(s.price_cents / 100).toFixed(2)}`;
  return s.price_from ? `from ${dollars}` : dollars;
}

export function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}
