import { decideBooking, getByRespondCode } from "@/lib/booking/bookings";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

// POST /api/bookings/respond { code, decision: "accept" | "decline" }
// The salon answers a pending online booking from the link in its email.
export async function POST(request: Request) {
  console.log("[api/bookings/respond] start");
  if (!isSupabaseConfigured()) return Response.json({ ok: false, message: "Booking is not set up yet." }, { status: 503 });

  let body: { code?: unknown; decision?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "We could not read that request." }, { status: 400 });
  }
  if (typeof body.code !== "string" || (body.decision !== "accept" && body.decision !== "decline")) {
    return Response.json({ ok: false, message: "That link is not valid." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const booking = await getByRespondCode(supabase, body.code);
  if (!booking) return Response.json({ ok: false, message: "That link is not valid." }, { status: 404 });

  const result = await decideBooking(supabase, booking.id, body.decision);
  console.log("[api/bookings/respond] end:", result.ok ? result.status : result.message);
  return Response.json(result, { status: result.ok ? 200 : 409 });
}
