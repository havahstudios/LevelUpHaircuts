import Link from "next/link";
import { addDays, formatDay, isDayString, laDay } from "@/lib/booking/time";
import { loadSchedule, weekStart } from "@/lib/booking/staff";
import { getSupabaseAuth } from "@/lib/supabase/auth";
import ScheduleBoard from "./ScheduleBoard";

// The schedule: one day (a column per stylist) or one week.
export default async function SchedulePage({ searchParams }: PageProps<"/admin">) {
  const params = await searchParams;
  const today = laDay(new Date());
  const day = isDayString(params.day) ? params.day : today;
  const view = params.view === "week" ? "week" : "day";

  const from = view === "week" ? weekStart(day) : day;
  const to = addDays(from, view === "week" ? 7 : 1);
  const schedule = await loadSchedule(await getSupabaseAuth(), from, to);

  const step = view === "week" ? 7 : 1;
  const link = (d: string, v = view) => `/admin?day=${d}&view=${v}`;
  const title = view === "week" ? `Week of ${formatDay(from)}` : formatDay(day);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-gold-deep">{day === today && view === "day" ? "Today" : "Schedule"}</p>
          <h1 className="mt-1 text-[30px] md:text-[38px]">{title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-[4px] border border-line bg-white">
            <Link href={link(addDays(day, -step))} className="grid h-11 w-11 place-items-center text-ink hover:bg-cream" aria-label="Previous">
              &#8249;
            </Link>
            <Link href={link(today)} className="grid h-11 place-items-center border-x border-line px-4 text-[14px] font-bold text-ink hover:bg-cream">
              Today
            </Link>
            <Link href={link(addDays(day, step))} className="grid h-11 w-11 place-items-center text-ink hover:bg-cream" aria-label="Next">
              &#8250;
            </Link>
          </div>
          <div className="flex overflow-hidden rounded-[4px] border border-line bg-white text-[14px] font-bold">
            <Link href={link(day, "day")} className={`grid h-11 place-items-center px-4 ${view === "day" ? "bg-ink text-white" : "text-ink hover:bg-cream"}`}>
              Day
            </Link>
            <Link href={link(day, "week")} className={`grid h-11 place-items-center px-4 ${view === "week" ? "bg-ink text-white" : "text-ink hover:bg-cream"}`}>
              Week
            </Link>
          </div>
          <form action="/admin" className="flex">
            <input type="hidden" name="view" value={view} />
            <input type="date" name="day" defaultValue={day} className="h-11 rounded-l-[4px] border border-line bg-white px-3 text-[14px] text-ink" aria-label="Go to date" />
            <button type="submit" className="h-11 rounded-r-[4px] bg-ink px-4 text-[14px] font-bold text-white">
              Go
            </button>
          </form>
        </div>
      </div>

      <ScheduleBoard schedule={schedule} day={day} view={view} />
    </div>
  );
}
