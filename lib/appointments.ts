// Checks an appointment request. Used by the API route; the form uses the
// same service list so both sides agree.

export const serviceOptions = [
  "Haircut",
  "Cut and colour",
  "Blow-dry or styling",
  "Perm",
  "Chemical treatment",
  "Not sure yet",
];

export type AppointmentRequest = {
  name: string;
  email: string;
  phone: string;
  date: string;
  service: string;
  message: string;
};

export type ValidationResult =
  | { ok: true; data: AppointmentRequest }
  | { ok: false; errors: Partial<Record<keyof AppointmentRequest, string>> };

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function validateAppointment(input: unknown): ValidationResult {
  const body = (input ?? {}) as Record<string, unknown>;
  const data: AppointmentRequest = {
    name: text(body.name, 100),
    email: text(body.email, 200),
    phone: text(body.phone, 40),
    date: text(body.date, 20),
    service: text(body.service, 60),
    message: text(body.message, 2000),
  };

  const errors: Partial<Record<keyof AppointmentRequest, string>> = {};
  if (data.name.length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please enter a valid email address.";
  if (data.phone && !/^[\d\s()+.-]{7,}$/.test(data.phone)) errors.phone = "Please check your phone number.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) errors.date = "Please choose a date.";
  // One day of slack, so "today" in Los Angeles still passes when UTC has rolled over.
  else if (data.date < new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)) errors.date = "Please choose a date from today on.";
  if (!serviceOptions.includes(data.service)) errors.service = "Please choose a service.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

// Option A from project_specs.md: no database yet, so the request is logged
// on the server. Swap this for a Supabase insert or an email later.
export async function saveAppointment(data: AppointmentRequest) {
  console.log("[appointment] new request", {
    ...data,
    receivedAt: new Date().toISOString(),
  });
}
