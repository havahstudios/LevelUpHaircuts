import { findSlots, loadDay } from "@/lib/booking/availability";
import { isDayString } from "@/lib/booking/time";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

// GET /api/availability?service=ID&stylist=ID|any&day=YYYY-MM-DD
// Returns only free start times. Never booking or client details.
export async function GET(request: Request) {
  console.log("[api/availability] start");
  if (!isSupabaseConfigured()) return Response.json({ ok: false, message: "Online booking is not set up yet." }, { status: 503 });

  const params = new URL(request.url).searchParams;
  const serviceId = params.get("service");
  const stylist = params.get("stylist");
  const day = params.get("day");
  if (!serviceId || !isDayString(day)) {
    console.log("[api/availability] end: bad request");
    return Response.json({ ok: false, message: "Choose a service and a day." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: service } = await supabase.from("services").select("id, duration_minutes, active").eq("id", serviceId).maybeSingle();
    if (!service?.active) return Response.json({ ok: false, message: "That service is not available." }, { status: 404 });
    const data = await loadDay(supabase, day);
    const slots = findSlots(data, service, stylist && stylist !== "any" ? stylist : null, new Date());
    console.log("[api/availability] end:", slots.length, "slots");
    return Response.json({ ok: true, slots: slots.map(({ label, startsAt }) => ({ label, startsAt })) });
  } catch (error) {
    console.error("[api/availability] failed", error);
    return Response.json({ ok: false, message: "Could not load times. Please try again." }, { status: 500 });
  }
}
