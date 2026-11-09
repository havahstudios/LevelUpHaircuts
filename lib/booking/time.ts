// Date helpers for Los Angeles time. Bookings are stored in UTC; the salon
// thinks in local wall-clock time, including daylight saving changes.

export const SALON_TZ = "America/Los_Angeles";

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SALON_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function laParts(date: Date) {
  const p = Object.fromEntries(partsFormatter.formatToParts(date).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, min: +p.minute, s: +p.second };
}

/** Minutes Los Angeles is ahead of UTC at this instant (negative: -480 or -420). */
function offsetMinutes(date: Date): number {
  const p = laParts(date);
  const asUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s);
  return Math.round((asUtc - date.getTime()) / 60000);
}

/** "2026-12-01" + "09:30" in Los Angeles -> the matching UTC instant. */
export function laToUtc(day: string, time: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, min);
  let result = guess - offsetMinutes(new Date(guess)) * 60000;
  // Second pass corrects days when the clocks change.
  result = guess - offsetMinutes(new Date(result)) * 60000;
  return new Date(result);
}

/** The Los Angeles calendar day of an instant, as "YYYY-MM-DD". */
export function laDay(date: Date): string {
  const p = laParts(date);
  return `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
}

/** Minutes since local midnight in Los Angeles. */
export function laMinutes(date: Date): number {
  const p = laParts(date);
  return p.h * 60 + p.min;
}

/** 0 = Sunday ... 6 = Saturday, for a "YYYY-MM-DD" calendar day. */
export function weekdayOf(day: string): number {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return t.toISOString().slice(0, 10);
}

/** "09:30:00" or "09:30" -> 570 */
export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

/** 570 -> "9:30am" */
export function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

/** "Tuesday 1 December" */
export function formatDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}

/** "Tuesday 1 December at 9:30am" for a stored instant. */
export function formatWhen(iso: string): string {
  const date = new Date(iso);
  return `${formatDay(laDay(date))} at ${formatMinutes(laMinutes(date))}`;
}

export function isDayString(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

/** True if the stored instant is still ahead of now. */
export function isUpcoming(iso: string): boolean {
  return Date.parse(iso) > Date.now();
}
