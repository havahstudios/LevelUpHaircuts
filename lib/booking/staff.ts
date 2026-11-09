import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isStillFree } from "@/lib/booking/bookings";
import { addDays, isDayString, laToUtc } from "@/lib/booking/time";
import type { BookingStatus, SalonHours, Service, Stylist, StylistHours, TimeOff } from "@/lib/booking/types";

// Everything the staff dashboard reads and changes. Always called with the
// logged-in staff member's client, so Row Level Security still applies.

export type ScheduleBooking = {
  id: string;
  stylist_id: string;
  service_id: string;
  starts_at: string;
  ends_at: string;
  status: BookingStatus;
  source: string;
  note: string;
  client: { id: string; name: string; phone: string; email: string };
  service: { name: string };
};

export type Schedule = {
  from: string;
  to: string; // exclusive
  stylists: Stylist[];
  services: Service[];
  salonHours: SalonHours[];
  stylistHours: StylistHours[];
  closedDates: string[];
  bookings: ScheduleBooking[];
  timeOff: TimeOff[];
  /** Every upcoming online booking still waiting for the salon, with a live availability check. */
  pending: (ScheduleBooking & { stillFree: boolean })[];
};

/** Bookings, time off and setup for the days from `from` up to (not including) `to`. */
export async function loadSchedule(supabase: SupabaseClient, from: string, to: string): Promise<Schedule> {
  const start = laToUtc(from, "00:00").toISOString();
  const end = laToUtc(to, "00:00").toISOString();
  const [stylists, services, hours, sHours, closed, bookings, timeOff] = await Promise.all([
    supabase.from("stylists").select("*").eq("active", true).order("sort"),
    supabase.from("services").select("*").order("sort"),
    supabase.from("salon_hours").select("*").order("weekday"),
    supabase.from("stylist_hours").select("*"),
    supabase.from("closed_dates").select("day").gte("day", from).lt("day", to),
    supabase
      .from("bookings")
      .select("id, stylist_id, service_id, starts_at, ends_at, status, source, note, client:clients(id, name, phone, email), service:services(name)")
      .lt("starts_at", end)
      .gt("ends_at", start)
      .order("starts_at"),
    supabase.from("time_off").select("*").lt("starts_at", end).gt("ends_at", start).order("starts_at"),
  ]);
  const failed = [stylists, services, hours, sHours, closed, bookings, timeOff].find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);

  const { data: waiting } = await supabase
    .from("bookings")
    .select("id, stylist_id, service_id, starts_at, ends_at, status, source, note, client:clients(id, name, phone, email), service:services(name)")
    .eq("status", "pending")
    .gt("ends_at", new Date().toISOString())
    .order("starts_at");
  const pending = await Promise.all(
    ((waiting ?? []) as unknown as ScheduleBooking[]).map(async (b) => ({ ...b, stillFree: await isStillFree(supabase, b) })),
  );
  return {
    from,
    to,
    stylists: stylists.data as Stylist[],
    services: services.data as Service[],
    salonHours: hours.data as SalonHours[],
    stylistHours: sHours.data as StylistHours[],
    closedDates: (closed.data ?? []).map((d) => d.day),
    bookings: bookings.data as unknown as ScheduleBooking[],
    timeOff: timeOff.data as TimeOff[],
    pending,
  };
}

export type ActionResult = { ok: true } | { ok: false; message: string; fields?: Record<string, string> };

const overlapMessage = "That stylist already has a booking at that time.";

/** Move or edit a booking: client details, service, stylist, day, time, note. */
export async function updateBooking(
  supabase: SupabaseClient,
  input: { id: string; serviceId: string; stylistId: string; day: string; time: string; note: string; client: { name: string; phone: string; email: string } },
): Promise<ActionResult> {
  if (!isDayString(input.day) || !/^\d{2}:\d{2}$/.test(input.time)) return { ok: false, message: "Please choose a day and time." };
  if (input.client.name.trim().length < 2) return { ok: false, message: "Please enter the client's name.", fields: { name: "Required" } };

  const { data: service } = await supabase.from("services").select("duration_minutes").eq("id", input.serviceId).single();
  const { data: booking } = await supabase.from("bookings").select("client_id").eq("id", input.id).single();
  if (!service || !booking) return { ok: false, message: "That booking or service no longer exists." };

  const startsAt = laToUtc(input.day, input.time);
  const endsAt = new Date(startsAt.getTime() + service.duration_minutes * 60000);
  const { error } = await supabase
    .from("bookings")
    .update({
      service_id: input.serviceId,
      stylist_id: input.stylistId,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      note: input.note.trim().slice(0, 500),
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id);
  if (error?.code === "23P01") return { ok: false, message: overlapMessage };
  if (error) return { ok: false, message: error.message };

  await supabase
    .from("clients")
    .update({ name: input.client.name.trim(), phone: input.client.phone.trim(), email: input.client.email.trim().toLowerCase() })
    .eq("id", booking.client_id);
  return { ok: true };
}

export async function setBookingStatus(supabase: SupabaseClient, id: string, status: BookingStatus): Promise<ActionResult> {
  const { error } = await supabase.from("bookings").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error?.code === "23P01") return { ok: false, message: overlapMessage };
  return error ? { ok: false, message: error.message } : { ok: true };
}

/** Block time for one stylist (or the whole salon when stylistId is empty). */
export async function addTimeOff(
  supabase: SupabaseClient,
  input: { stylistId: string; day: string; from: string; to: string; reason: string },
): Promise<ActionResult> {
  if (!isDayString(input.day) || !/^\d{2}:\d{2}$/.test(input.from) || !/^\d{2}:\d{2}$/.test(input.to) || input.from >= input.to) {
    return { ok: false, message: "Choose a day and a start time before the end time." };
  }
  const { error } = await supabase.from("time_off").insert({
    stylist_id: input.stylistId || null,
    starts_at: laToUtc(input.day, input.from).toISOString(),
    ends_at: laToUtc(input.day, input.to).toISOString(),
    reason: input.reason.trim().slice(0, 120),
  });
  return error ? { ok: false, message: error.message } : { ok: true };
}

export async function removeTimeOff(supabase: SupabaseClient, id: string): Promise<ActionResult> {
  const { error } = await supabase.from("time_off").delete().eq("id", id);
  return error ? { ok: false, message: error.message } : { ok: true };
}

/** Clients whose name, phone or email contains the search text (for suggestions). */
export async function searchClients(supabase: SupabaseClient, q: string) {
  const term = q.trim().replace(/[%,()]/g, "");
  if (term.length < 2) return [];
  const digits = term.replace(/\D/g, "");
  const filters = [`name.ilike.%${term}%`, `email.ilike.%${term}%`];
  if (digits.length >= 3) filters.push(`phone_digits.like.%${digits}%`);
  const { data } = await supabase.from("clients").select("id, name, phone, email").or(filters.join(",")).order("name").limit(8);
  return data ?? [];
}

/** First day (Sunday) of the week containing `day`. */
export function weekStart(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return addDays(day, -dow);
}
