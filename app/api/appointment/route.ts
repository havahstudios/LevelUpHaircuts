import { saveAppointment, validateAppointment } from "@/lib/appointments";

export async function POST(request: Request) {
  console.log("[api/appointment] start");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    console.log("[api/appointment] end: bad JSON");
    return Response.json({ ok: false, message: "We could not read that request. Please try again." }, { status: 400 });
  }

  const result = validateAppointment(body);
  if (!result.ok) {
    console.log("[api/appointment] end: invalid", Object.keys(result.errors));
    return Response.json({ ok: false, errors: result.errors }, { status: 422 });
  }

  try {
    await saveAppointment(result.data);
  } catch (error) {
    console.error("[api/appointment] save failed", error);
    return Response.json({ ok: false, message: "Something went wrong on our side. Please try again." }, { status: 500 });
  }

  console.log("[api/appointment] end: saved");
  return Response.json({ ok: true });
}
