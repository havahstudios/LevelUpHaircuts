import { createOnlineBooking } from "@/lib/booking/bookings";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

// POST /api/bookings: a customer books on /book.
export async function POST(request: Request) {
  console.log("[api/bookings] start");
  if (!isSupabaseConfigured()) return Response.json({ ok: false, message: "Online booking is not set up yet." }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "We could not read that request." }, { status: 400 });
  }

  const result = await createOnlineBooking(getSupabaseAdmin(), {
    serviceId: body.serviceId,
    stylistId: body.stylistId,
    startsAt: body.startsAt,
    note: body.note,
    client: body.client,
  });

  console.log("[api/bookings] end:", result.ok ? "booked" : result.reason);
  if (result.ok) return Response.json(result);
  const status = result.reason === "invalid" ? 422 : result.reason === "taken" ? 409 : 500;
  return Response.json(result, { status });
}
