import type { SupabaseClient } from "@supabase/supabase-js";
import { addDays, laDay, laToUtc, minutesToTime, timeToMinutes, weekdayOf, formatMinutes } from "@/lib/booking/time";
import type { Booking, SalonHours, Service, Settings, StylistHours, TimeOff } from "@/lib/booking/types";

// Works out which start times are free on one day. The pure part
// (findSlots) is separate from the database part (loadDay) so it is easy to test.

export type DayData = {
  day: string;
  settings: Settings;
  salonHours: SalonHours | null;
  closed: boolean;
  stylists: { id: string; name: string; sort: number }[];
  stylistHours: StylistHours[];
  stylistServices: { stylist_id: string; service_id: string }[];
  timeOff: TimeOff[];
  bookings: Pick<Booking, "stylist_id" | "starts_at" | "ends_at" | "status">[];
};

export type Slot = { time: string; label: string; startsAt: string; stylistIds: string[] };

type Range = [number, number]; // epoch ms

function overlaps(a: Range, b: Range) {
  return a[0] < b[1] && b[0] < a[1];
}

/** The minutes-of-day a stylist works on this day, or null if they are off. */
function workingWindow(data: DayData, stylistId: string): [number, number] | null {
  const salon = data.salonHours;
  if (data.closed || !salon || salon.closed || !salon.opens || !salon.closes) return null;
  const own = data.stylistHours.find((h) => h.stylist_id === stylistId);
  if (own?.off) return null;
  const start = Math.max(timeToMinutes(salon.opens), own?.starts ? timeToMinutes(own.starts) : 0);
  const end = Math.min(timeToMinutes(salon.closes), own?.ends ? timeToMinutes(own.ends) : 24 * 60);
  return start < end ? [start, end] : null;
}

/**
 * Free start times for `service` on `data.day`.
 * stylistId null means "any stylist": a time is free if at least one stylist is.
 */
export function findSlots(data: DayData, service: Pick<Service, "id" | "duration_minutes">, stylistId: string | null, now: Date): Slot[] {
  const { settings } = data;
  const today = laDay(now);
  if (data.day < today || data.day > addDays(today, settings.max_days_ahead)) return [];

  const earliest = now.getTime() + settings.min_notice_minutes * 60000;
  const offers = new Set(data.stylistServices.filter((s) => s.service_id === service.id).map((s) => s.stylist_id));
  const candidates = data.stylists.filter((s) => offers.has(s.id) && (!stylistId || s.id === stylistId));

  const busy = (id: string): Range[] => [
    ...data.bookings
      .filter((b) => b.stylist_id === id && (b.status === "booked" || b.status === "completed"))
      .map((b): Range => [Date.parse(b.starts_at), Date.parse(b.ends_at)]),
    ...data.timeOff
      .filter((t) => t.stylist_id === null || t.stylist_id === id)
      .map((t): Range => [Date.parse(t.starts_at), Date.parse(t.ends_at)]),
  ];

  const byTime = new Map<number, string[]>();
  for (const stylist of candidates) {
    const window = workingWindow(data, stylist.id);
    if (!window) continue;
    const blocked = busy(stylist.id);
    for (let m = window[0]; m + service.duration_minutes <= window[1]; m += settings.slot_minutes) {
      const start = laToUtc(data.day, minutesToTime(m)).getTime();
      const range: Range = [start, start + service.duration_minutes * 60000];
      if (start < earliest || blocked.some((b) => overlaps(range, b))) continue;
      byTime.set(m, [...(byTime.get(m) ?? []), stylist.id]);
    }
  }

  return [...byTime.entries()]
    .sort(([a], [b]) => a - b)
    .map(([m, ids]) => ({
      time: minutesToTime(m),
      label: formatMinutes(m),
      startsAt: laToUtc(data.day, minutesToTime(m)).toISOString(),
      stylistIds: ids,
    }));
}

/** For "any stylist": the free stylist with the fewest bookings that day. */
export function pickStylist(data: DayData, ids: string[]): string {
  const count = (id: string) => data.bookings.filter((b) => b.stylist_id === id && b.status === "booked").length;
  const order = (id: string) => data.stylists.find((s) => s.id === id)?.sort ?? 0;
  return [...ids].sort((a, b) => count(a) - count(b) || order(a) - order(b))[0];
}

/** Everything findSlots needs for one day, read from the database. */
export async function loadDay(supabase: SupabaseClient, day: string): Promise<DayData> {
  const dayStart = laToUtc(day, "00:00").toISOString();
  const dayEnd = laToUtc(addDays(day, 1), "00:00").toISOString();
  const weekday = weekdayOf(day);

  const [settings, salon, closed, stylists, hours, links, timeOff, bookings] = await Promise.all([
    supabase.from("settings").select("min_notice_minutes, max_days_ahead, slot_minutes, notify_email").eq("id", 1).single(),
    supabase.from("salon_hours").select("*").eq("weekday", weekday).maybeSingle(),
    supabase.from("closed_dates").select("day").eq("day", day).maybeSingle(),
    supabase.from("stylists").select("id, name, sort").eq("active", true).order("sort"),
    supabase.from("stylist_hours").select("*").eq("weekday", weekday),
    supabase.from("stylist_services").select("stylist_id, service_id"),
    supabase.from("time_off").select("*").lt("starts_at", dayEnd).gt("ends_at", dayStart),
    supabase.from("bookings").select("stylist_id, starts_at, ends_at, status").lt("starts_at", dayEnd).gt("ends_at", dayStart).in("status", ["booked", "completed"]),
  ]);

  const failed = [settings, salon, closed, stylists, hours, links, timeOff, bookings].find((r) => r.error);
  if (failed?.error) throw new Error(`Could not load the schedule: ${failed.error.message}`);

  return {
    day,
    settings: settings.data as Settings,
    salonHours: salon.data as SalonHours | null,
    closed: Boolean(closed.data),
    stylists: stylists.data ?? [],
    stylistHours: (hours.data ?? []) as StylistHours[],
    stylistServices: links.data ?? [],
    timeOff: (timeOff.data ?? []) as TimeOff[],
    bookings: bookings.data ?? [],
  };
}
