import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { findSlots, loadDay, pickStylist } from "@/lib/booking/availability";
import { sendBookingEmails } from "@/lib/booking/email";
import { isDayString, laDay, laToUtc } from "@/lib/booking/time";
import { HOLDING_STATUSES, type BookingSource, type BookingStatus, type Service } from "@/lib/booking/types";

export type ClientInput = { name: string; phone: string; email: string };

export type CreateResult =
  | { ok: true; bookingId: string; manageCode: string; startsAt: string; stylistName: string; serviceName: string; status: string }
  | { ok: false; reason: "invalid" | "taken" | "error"; message: string; fields?: Record<string, string> };

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const digits = (phone: string) => phone.replace(/\D/g, "");

/** Checks the customer details typed on the booking page. */
export function validateClient(input: unknown, requireEmail: boolean) {
  const body = (input ?? {}) as Record<string, unknown>;
  const client: ClientInput = { name: clean(body.name, 100), phone: clean(body.phone, 40), email: clean(body.email, 200).toLowerCase() };
  const fields: Record<string, string> = {};
  if (client.name.length < 2) fields.name = "Please enter a name.";
  if (requireEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) fields.email = "Please enter a valid email address.";
  if (!requireEmail && client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) fields.email = "Please check the email address.";
  if (digits(client.phone).length < 7) fields.phone = "Please enter a phone number.";
  return { client, fields };
}

/** Finds a returning client by phone or email, or adds a new one. */
async function findOrCreateClient(supabase: SupabaseClient, c: ClientInput): Promise<string> {
  const phoneDigits = digits(c.phone);
  if (phoneDigits) {
    const { data } = await supabase.from("clients").select("id").eq("phone_digits", phoneDigits).limit(1).maybeSingle();
    if (data) return data.id;
  }
  if (c.email) {
    const { data } = await supabase.from("clients").select("id").eq("email", c.email).limit(1).maybeSingle();
    if (data) return data.id;
  }
  const { data, error } = await supabase.from("clients").insert({ name: c.name, phone: c.phone, email: c.email }).select("id").single();
  if (error) throw new Error(error.message);
  return data.id;
}

async function getService(supabase: SupabaseClient, id: string) {
  const { data } = await supabase.from("services").select("id, name, duration_minutes, active").eq("id", id).maybeSingle();
  return data as (Pick<Service, "id" | "name" | "duration_minutes" | "active"> | null);
}

/**
 * An online booking from /book. Uses the service-role client, so everything
 * is re-checked here: the service, the stylist and that the time is still free.
 * The database's no-overlap rule is the final guard against two people
 * clicking the same time at once.
 */
export async function createOnlineBooking(
  supabase: SupabaseClient,
  input: { serviceId: unknown; stylistId: unknown; startsAt: unknown; note: unknown; client: unknown },
): Promise<CreateResult> {
  const { client, fields } = validateClient(input.client, true);
  if (typeof input.serviceId !== "string" || typeof input.startsAt !== "string" || Number.isNaN(Date.parse(input.startsAt))) {
    fields.time = "Please choose a time.";
  }
  if (Object.keys(fields).length) return { ok: false, reason: "invalid", message: "Please check the highlighted fields.", fields };

  const service = await getService(supabase, input.serviceId as string);
  if (!service?.active) return { ok: false, reason: "invalid", message: "That service is no longer available." };

  const startsAt = new Date(input.startsAt as string);
  const day = laDay(startsAt);
  const data = await loadDay(supabase, day);
  const wanted = typeof input.stylistId === "string" && input.stylistId ? input.stylistId : null;
  const slot = findSlots(data, service, wanted, new Date()).find((s) => s.startsAt === startsAt.toISOString());
  if (!slot) return { ok: false, reason: "taken", message: "That time was just taken. Please pick another." };

  const stylistId = wanted ?? pickStylist(data, slot.stylistIds);
  return insertBooking(supabase, { service, stylistId, startsAt, client, note: clean(input.note, 500), source: "online", createdBy: null });
}

/**
 * A booking added by staff (phone call or walk-in). Runs as the logged-in
 * staff member, under Row Level Security. Staff may book outside normal hours;
 * the database still refuses overlaps.
 */
export async function createStaffBooking(
  supabase: SupabaseClient,
  input: { serviceId: string; stylistId: string; day: string; time: string; source: BookingSource; note: string; client: unknown; createdBy: string },
): Promise<CreateResult> {
  const { client, fields } = validateClient(input.client, false);
  if (!isDayString(input.day) || !/^\d{2}:\d{2}$/.test(input.time)) fields.time = "Please choose a day and time.";
  if (Object.keys(fields).length) return { ok: false, reason: "invalid", message: "Please check the highlighted fields.", fields };

  const service = await getService(supabase, input.serviceId);
  if (!service) return { ok: false, reason: "invalid", message: "Please choose a service." };
  const startsAt = laToUtc(input.day, input.time);
  return insertBooking(supabase, {
    service,
    stylistId: input.stylistId,
    startsAt,
    client,
    note: clean(input.note, 500),
    source: input.source,
    createdBy: input.createdBy,
  });
}

async function insertBooking(
  supabase: SupabaseClient,
  b: {
    service: { id: string; name: string; duration_minutes: number };
    stylistId: string;
    startsAt: Date;
    client: ClientInput;
    note: string;
    source: BookingSource;
    createdBy: string | null;
  },
): Promise<CreateResult> {
  // Online bookings wait for the salon to accept; staff bookings are confirmed.
  const status = b.source === "online" ? "pending" : "booked";
  try {
    const clientId = await findOrCreateClient(supabase, b.client);
    const endsAt = new Date(b.startsAt.getTime() + b.service.duration_minutes * 60000);
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        client_id: clientId,
        stylist_id: b.stylistId,
        service_id: b.service.id,
        starts_at: b.startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        status,
        source: b.source,
        note: b.note,
        created_by: b.createdBy,
      })
      .select("id, manage_code, respond_code, stylists(name)")
      .single();

    if (error?.code === "23P01") return { ok: false, reason: "taken", message: "That stylist is already booked at that time." };
    if (error) throw new Error(error.message);

    const stylistName = (data.stylists as unknown as { name: string } | null)?.name ?? "";
    const result = {
      ok: true as const,
      bookingId: data.id,
      manageCode: data.manage_code,
      startsAt: b.startsAt.toISOString(),
      stylistName,
      serviceName: b.service.name,
      status,
    };
    await sendBookingEmails(status === "pending" ? "request" : "staff_booked", {
      ...result,
      respondCode: data.respond_code,
      stillFree: true,
      client: b.client,
    });
    return result;
  } catch (error) {
    console.error("[booking] save failed", error);
    return { ok: false, reason: "error", message: "Something went wrong saving the booking. Please try again." };
  }
}

const bookingSelect = "id, status, starts_at, ends_at, stylist_id, manage_code, respond_code, client:clients(name, phone, email), service:services(name), stylist:stylists(name)";

type FullBooking = {
  id: string;
  status: BookingStatus;
  starts_at: string;
  ends_at: string;
  stylist_id: string;
  manage_code: string;
  respond_code: string;
  client: ClientInput;
  service: { name: string };
  stylist: { name: string };
};

function emailFields(b: FullBooking) {
  return { startsAt: b.starts_at, stylistName: b.stylist.name, serviceName: b.service.name, manageCode: b.manage_code, client: b.client };
}

/** The booking behind an Accept / Decline link, or null. */
export async function getByRespondCode(supabase: SupabaseClient, code: string): Promise<FullBooking | null> {
  if (!/^[a-f0-9]{64}$/.test(code)) return null;
  const { data } = await supabase.from("bookings").select(bookingSelect).eq("respond_code", code).maybeSingle();
  return data as unknown as FullBooking | null;
}

/**
 * Is the stylist still free for this booking? Checks other live bookings and
 * time off that overlap it (the booking itself is ignored).
 */
export async function isStillFree(supabase: SupabaseClient, b: Pick<FullBooking, "id" | "stylist_id" | "starts_at" | "ends_at">): Promise<boolean> {
  const [clash, off] = await Promise.all([
    supabase
      .from("bookings")
      .select("id")
      .eq("stylist_id", b.stylist_id)
      .neq("id", b.id)
      .in("status", HOLDING_STATUSES)
      .lt("starts_at", b.ends_at)
      .gt("ends_at", b.starts_at)
      .limit(1),
    supabase.from("time_off").select("id").or(`stylist_id.is.null,stylist_id.eq.${b.stylist_id}`).lt("starts_at", b.ends_at).gt("ends_at", b.starts_at).limit(1),
  ]);
  return !(clash.data?.length || off.data?.length);
}

/**
 * The salon accepts or declines a pending online booking. Used by the email
 * link (service-role client, after checking the private code) and by the
 * dashboard (staff client). Only a pending booking can be decided, so a link
 * cannot be used twice.
 */
export async function decideBooking(supabase: SupabaseClient, bookingId: string, decision: "accept" | "decline") {
  const { data } = await supabase.from("bookings").select(bookingSelect).eq("id", bookingId).maybeSingle();
  const booking = data as unknown as FullBooking | null;
  if (!booking) return { ok: false as const, message: "We could not find that booking." };
  if (booking.status !== "pending") return { ok: false as const, message: `This booking was already answered (${booking.status}).` };

  const status = decision === "accept" ? "booked" : "declined";
  const { data: updated, error } = await supabase
    .from("bookings")
    .update({ status, decided_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .eq("status", "pending") // only if nobody answered in the meantime
    .select("id");
  if (error) return { ok: false as const, message: error.message };
  if (!updated?.length) return { ok: false as const, message: "This booking was already answered." };

  await sendBookingEmails(decision === "accept" ? "accepted" : "declined", emailFields(booking));
  return { ok: true as const, status };
}

/** Customer cancels from the link in their email (pending or booked). */
export async function cancelByCode(supabase: SupabaseClient, code: unknown) {
  if (typeof code !== "string" || !/^[a-f0-9]{64}$/.test(code)) return { ok: false as const, message: "That link is not valid." };
  const { data } = await supabase.from("bookings").select(bookingSelect).eq("manage_code", code).maybeSingle();
  const booking = data as unknown as FullBooking | null;
  if (!booking) return { ok: false as const, message: "We could not find that booking." };
  if (booking.status !== "booked" && booking.status !== "pending") return { ok: false as const, message: "This booking is already cancelled or finished." };
  if (Date.parse(booking.starts_at) < Date.now()) return { ok: false as const, message: "This appointment has already started." };

  const { error } = await supabase.from("bookings").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", booking.id);
  if (error) return { ok: false as const, message: "Something went wrong. Please call the salon." };

  await sendBookingEmails("cancelled", emailFields(booking));
  return { ok: true as const };
}
