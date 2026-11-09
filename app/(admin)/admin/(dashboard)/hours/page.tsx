import type { SalonHours, Settings } from "@/lib/booking/types";
import { formatDay, laDay } from "@/lib/booking/time";
import { getSupabaseAuth } from "@/lib/supabase/auth";
import AdminForm from "../AdminForm";
import { cardClass, inputClass, labelClass, weekdays } from "../admin-styles";
import { addClosedDateAction, removeClosedDateAction, saveHoursAction } from "../setup-actions";

// Salon opening hours, holidays and the online booking rules.
export default async function HoursAdminPage() {
  const supabase = await getSupabaseAuth();
  const today = laDay(new Date());
  const [hours, settings, closed] = await Promise.all([
    supabase.from("salon_hours").select("*").order("weekday"),
    supabase.from("settings").select("*").eq("id", 1).single(),
    supabase.from("closed_dates").select("*").gte("day", today).order("day"),
  ]);
  const h = (d: number) => (hours.data as SalonHours[] | null)?.find((x) => x.weekday === d);
  const s = settings.data as Settings;

  return (
    <div className="max-w-[900px] space-y-8">
      <h1 className="text-[30px] md:text-[38px]">Hours &amp; settings</h1>

      <AdminForm action={saveHoursAction} className={cardClass}>
        <h2 className="text-[24px]">Opening hours</h2>
        <div className="mt-4 divide-y divide-line rounded-[4px] border border-line">
          {weekdays.map((name, d) => (
            <div key={d} className="grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-2 sm:grid-cols-[140px_1fr_1fr_auto]">
              <span className="font-bold text-ink">{name}</span>
              <label className="flex items-center gap-2 text-[14px] sm:order-last">
                <input type="checkbox" name={`closed_${d}`} defaultChecked={h(d)?.closed ?? false} className="h-4 w-4 accent-[#141210]" /> Closed
              </label>
              <input type="time" name={`opens_${d}`} defaultValue={h(d)?.opens?.slice(0, 5) ?? "09:00"} step={900} className={inputClass} aria-label={`${name} opens`} />
              <input type="time" name={`closes_${d}`} defaultValue={h(d)?.closes?.slice(0, 5) ?? "18:00"} step={900} className={inputClass} aria-label={`${name} closes`} />
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-[24px]">Online booking rules</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>
            <span className={labelClass}>Minimum notice (minutes)</span>
            <input name="min_notice_minutes" type="number" min={0} step={15} defaultValue={s?.min_notice_minutes ?? 120} className={`${inputClass} mt-1`} />
          </label>
          <label>
            <span className={labelClass}>Book up to (days ahead)</span>
            <input name="max_days_ahead" type="number" min={1} max={365} defaultValue={s?.max_days_ahead ?? 60} className={`${inputClass} mt-1`} />
          </label>
          <label className="sm:col-span-2">
            <span className={labelClass}>Email for new online bookings</span>
            <input name="notify_email" type="email" defaultValue={s?.notify_email ?? ""} placeholder="salon@example.com" className={`${inputClass} mt-1`} />
          </label>
        </div>
      </AdminForm>

      <div className={cardClass}>
        <h2 className="text-[24px]">Closed dates</h2>
        <p className="mt-1 text-[15px]">Holidays or other days the whole salon is closed. Nobody can book online on these days.</p>
        <ul className="mt-4 divide-y divide-line">
          {(closed.data ?? []).map((c) => (
            <li key={c.day} className="flex items-center justify-between gap-4 py-2">
              <span>
                <strong className="text-ink">{formatDay(c.day)}</strong> {c.reason && `· ${c.reason}`}
              </span>
              <form action={removeClosedDateAction.bind(null, c.day)}>
                <button type="submit" className="text-[14px] font-bold text-[#a3341f]">
                  Remove
                </button>
              </form>
            </li>
          ))}
          {(closed.data ?? []).length === 0 && <li className="py-2 text-[15px]">No closed dates coming up.</li>}
        </ul>
        <AdminForm action={addClosedDateAction} submitLabel="Add closed date" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Date</span>
              <input name="day" type="date" min={today} required className={`${inputClass} mt-1`} />
            </label>
            <label>
              <span className={labelClass}>Reason (optional)</span>
              <input name="reason" placeholder="Thanksgiving" className={`${inputClass} mt-1`} />
            </label>
          </div>
        </AdminForm>
      </div>
    </div>
  );
}
