import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionResult } from "@/lib/booking/staff";

// Changes to the booking setup from the dashboard: services, stylists,
// salon hours, closed dates and booking rules. Staff client, RLS applies.

const text = (v: FormDataEntryValue | null, max = 200) => String(v ?? "").trim().slice(0, max);
const int = (v: FormDataEntryValue | null) => Number.parseInt(String(v ?? ""), 10);
const time = (v: FormDataEntryValue | null) => (/^\d{2}:\d{2}/.test(String(v ?? "")) ? String(v).slice(0, 5) : null);

export async function saveService(supabase: SupabaseClient, form: FormData): Promise<ActionResult> {
  const id = text(form.get("id"), 60);
  const name = text(form.get("name"), 80);
  const duration = int(form.get("duration_minutes"));
  const priceRaw = text(form.get("price"), 12);
  const price = priceRaw === "" ? null : Math.round(Number(priceRaw.replace(/[$,]/g, "")) * 100);
  if (name.length < 2) return { ok: false, message: "Please give the service a name." };
  if (!Number.isFinite(duration) || duration < 5 || duration > 600) return { ok: false, message: "Length must be between 5 and 600 minutes." };
  if (price !== null && (!Number.isFinite(price) || price < 0)) return { ok: false, message: "Price must be a number, or empty for 'to confirm'." };

  const row = {
    name,
    category: text(form.get("category"), 60) || "Cut & colour",
    description: text(form.get("description"), 200),
    duration_minutes: duration,
    price_cents: price,
    price_from: form.get("price_from") === "on",
    active: form.get("active") === "on",
    sort: int(form.get("sort")) || 0,
  };

  if (id) {
    const { error } = await supabase.from("services").update(row).eq("id", id);
    return error ? { ok: false, message: error.message } : { ok: true };
  }
  // New service: every active stylist offers it until changed on the Stylists page.
  const { data, error } = await supabase.from("services").insert(row).select("id").single();
  if (error) return { ok: false, message: error.message };
  const { data: stylists } = await supabase.from("stylists").select("id");
  if (stylists?.length) await supabase.from("stylist_services").insert(stylists.map((s) => ({ stylist_id: s.id, service_id: data.id })));
  return { ok: true };
}

export async function saveStylist(supabase: SupabaseClient, form: FormData): Promise<ActionResult> {
  let id = text(form.get("id"), 60);
  const name = text(form.get("name"), 60);
  if (name.length < 2) return { ok: false, message: "Please enter the stylist's name." };

  const hours = [0, 1, 2, 3, 4, 5, 6].map((weekday) => {
    const off = form.get(`off_${weekday}`) === "on";
    const starts = time(form.get(`starts_${weekday}`));
    const ends = time(form.get(`ends_${weekday}`));
    return { weekday, off: off || !starts || !ends, starts: off ? null : starts, ends: off ? null : ends };
  });
  const bad = hours.find((h) => !h.off && h.starts! >= h.ends!);
  if (bad) return { ok: false, message: "Each working day needs a start time before the end time." };

  const row = { name, active: form.get("active") === "on", sort: int(form.get("sort")) || 0 };
  if (id) {
    const { error } = await supabase.from("stylists").update(row).eq("id", id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { data, error } = await supabase.from("stylists").insert(row).select("id").single();
    if (error) return { ok: false, message: error.message };
    id = data.id;
  }

  const { error: hErr } = await supabase
    .from("stylist_hours")
    .upsert(hours.map((h) => ({ stylist_id: id, ...h })), { onConflict: "stylist_id,weekday" });
  if (hErr) return { ok: false, message: hErr.message };

  const offered = form.getAll("services").map(String);
  await supabase.from("stylist_services").delete().eq("stylist_id", id);
  if (offered.length) {
    const { error } = await supabase.from("stylist_services").insert(offered.map((service_id) => ({ stylist_id: id, service_id })));
    if (error) return { ok: false, message: error.message };
  }
  return { ok: true };
}

export async function saveSalonHours(supabase: SupabaseClient, form: FormData): Promise<ActionResult> {
  const rows = [0, 1, 2, 3, 4, 5, 6].map((weekday) => {
    const closed = form.get(`closed_${weekday}`) === "on";
    const opens = time(form.get(`opens_${weekday}`));
    const closes = time(form.get(`closes_${weekday}`));
    return { weekday, closed: closed || !opens || !closes, opens: closed ? null : opens, closes: closed ? null : closes };
  });
  if (rows.some((r) => !r.closed && r.opens! >= r.closes!)) return { ok: false, message: "Each open day needs an opening time before the closing time." };

  const minNotice = int(form.get("min_notice_minutes"));
  const maxDays = int(form.get("max_days_ahead"));
  const notify = text(form.get("notify_email"), 200).toLowerCase();
  if (!Number.isFinite(minNotice) || minNotice < 0 || minNotice > 7 * 24 * 60) return { ok: false, message: "Minimum notice must be between 0 and 10080 minutes." };
  if (!Number.isFinite(maxDays) || maxDays < 1 || maxDays > 365) return { ok: false, message: "Booking window must be between 1 and 365 days." };
  if (notify && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notify)) return { ok: false, message: "Please check the notification email." };

  const { error } = await supabase.from("salon_hours").upsert(rows, { onConflict: "weekday" });
  if (error) return { ok: false, message: error.message };
  const { error: sErr } = await supabase
    .from("settings")
    .update({ min_notice_minutes: minNotice, max_days_ahead: maxDays, notify_email: notify || null })
    .eq("id", 1);
  return sErr ? { ok: false, message: sErr.message } : { ok: true };
}

export async function addClosedDate(supabase: SupabaseClient, day: string, reason: string): Promise<ActionResult> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return { ok: false, message: "Choose a date." };
  const { error } = await supabase.from("closed_dates").upsert({ day, reason: reason.trim().slice(0, 120) });
  return error ? { ok: false, message: error.message } : { ok: true };
}

export async function removeClosedDate(supabase: SupabaseClient, day: string): Promise<ActionResult> {
  const { error } = await supabase.from("closed_dates").delete().eq("day", day);
  return error ? { ok: false, message: error.message } : { ok: true };
}
