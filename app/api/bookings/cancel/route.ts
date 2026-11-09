import { cancelByCode } from "@/lib/booking/bookings";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

// POST /api/bookings/cancel { code }: a customer cancels from their email link.
export async function POST(request: Request) {
  console.log("[api/bookings/cancel] start");
  if (!isSupabaseConfigured()) return Response.json({ ok: false, message: "Online booking is not set up yet." }, { status: 503 });

  let code: unknown;
  try {
    code = (await request.json()).code;
  } catch {
    return Response.json({ ok: false, message: "We could not read that request." }, { status: 400 });
  }

  const result = await cancelByCode(getSupabaseAdmin(), code);
  console.log("[api/bookings/cancel] end:", result.ok ? "cancelled" : result.message);
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
