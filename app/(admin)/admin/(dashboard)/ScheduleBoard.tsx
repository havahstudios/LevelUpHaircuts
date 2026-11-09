"use client";

import Link from "next/link";
import { useState } from "react";
import type { Schedule, ScheduleBooking } from "@/lib/booking/staff";
import { addDays, formatMinutes, laDay, laMinutes, minutesToTime, timeToMinutes, weekdayOf } from "@/lib/booking/time";
import type { TimeOff } from "@/lib/booking/types";
import BookingModal, { type ModalState } from "./BookingModal";
import PendingList from "./PendingList";
import TimeOffModal from "./TimeOffModal";

const ROW = 22; // pixels per 15 minutes
const colors = ["#c9a24a", "#6f8f7a", "#8a6f9e", "#b0675a", "#5f7f9c", "#9c8a5f"];

const statusStyle: Record<string, string> = {
  pending: "bg-[#fbf4e2] text-ink outline-dashed outline-1 outline-gold",
  declined: "bg-white/70 text-muted line-through ring-1 ring-line",
  booked: "bg-ink text-white",
  completed: "bg-[#e6efe8] text-ink",
  no_show: "bg-white text-[#a3341f] ring-1 ring-[#a3341f]",
  cancelled: "bg-white/70 text-muted line-through ring-1 ring-line",
};

export default function ScheduleBoard({ schedule, day, view }: { schedule: Schedule; day: string; view: "day" | "week" }) {
  const [modal, setModal] = useState<ModalState | null>(null);
  const [offModal, setOffModal] = useState<{ stylistId: string; day: string; from: string } | TimeOff | null>(null);
  const [showCancelled, setShowCancelled] = useState(false);

  const colorOf = (stylistId: string) => colors[Math.max(0, schedule.stylists.findIndex((s) => s.id === stylistId)) % colors.length];
  const visible = schedule.bookings.filter((b) => showCancelled || (b.status !== "cancelled" && b.status !== "declined"));

  if (schedule.stylists.length === 0) {
    return (
      <p className="mt-10 rounded-[6px] border border-line bg-white p-8">
        No active stylists yet. Add one on the <Link href="/admin/stylists" className="font-bold underline">Stylists</Link> page.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <PendingList pending={schedule.pending} stylists={schedule.stylists} onOpen={(b) => setModal({ mode: "edit", booking: b })} />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setModal({ mode: "new", day, time: "10:00", stylistId: schedule.stylists[0].id })}
          className="h-11 rounded-[4px] bg-gold px-5 text-[14px] font-bold text-ink"
        >
          + Add booking
        </button>
        <button
          type="button"
          onClick={() => setOffModal({ stylistId: "", day, from: "12:00" })}
          className="h-11 rounded-[4px] border border-ink px-5 text-[14px] font-bold text-ink"
        >
          Block time
        </button>
        <label className="ml-auto flex items-center gap-2 text-[14px]">
          <input type="checkbox" checked={showCancelled} onChange={(e) => setShowCancelled(e.target.checked)} className="h-4 w-4 accent-[#141210]" />
          Show cancelled & declined
        </label>
      </div>

      {view === "day" ? (
        <DayGrid
          schedule={schedule}
          day={day}
          bookings={visible}
          colorOf={colorOf}
          onEmpty={(stylistId, time) => setModal({ mode: "new", day, time, stylistId })}
          onBooking={(b) => setModal({ mode: "edit", booking: b })}
          onTimeOff={(t) => setOffModal(t)}
        />
      ) : (
        <WeekGrid schedule={schedule} bookings={visible} colorOf={colorOf} onBooking={(b) => setModal({ mode: "edit", booking: b })} />
      )}

      <div className="mt-4 flex flex-wrap gap-4 text-[13px]">
        {schedule.stylists.map((s) => (
          <span key={s.id} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: colorOf(s.id) }} />
            {s.name}
          </span>
        ))}
      </div>

      {modal && <BookingModal state={modal} schedule={schedule} onClose={() => setModal(null)} />}
      {offModal && <TimeOffModal state={offModal} stylists={schedule.stylists} onClose={() => setOffModal(null)} />}
    </div>
  );
}

function DayGrid({
  schedule,
  day,
  bookings,
  colorOf,
  onEmpty,
  onBooking,
  onTimeOff,
}: {
  schedule: Schedule;
  day: string;
  bookings: ScheduleBooking[];
  colorOf: (id: string) => string;
  onEmpty: (stylistId: string, time: string) => void;
  onBooking: (b: ScheduleBooking) => void;
  onTimeOff: (t: TimeOff) => void;
}) {
  const weekday = weekdayOf(day);
  const salon = schedule.salonHours.find((h) => h.weekday === weekday);
  const closed = !salon || salon.closed || schedule.closedDates.includes(day);

  // Grid runs from the earliest of opening time / first booking to the latest of closing / last booking.
  const mins = (iso: string) => laMinutes(new Date(iso));
  const starts = bookings.map((b) => mins(b.starts_at));
  const ends = bookings.map((b) => (laDay(new Date(b.ends_at)) > day ? 24 * 60 : mins(b.ends_at)));
  const open = salon?.opens ? timeToMinutes(salon.opens) : 9 * 60;
  const close = salon?.closes ? timeToMinutes(salon.closes) : 18 * 60;
  const gridStart = Math.floor(Math.min(open, ...starts) / 60) * 60;
  const gridEnd = Math.ceil(Math.max(close, ...ends) / 60) * 60;
  const rows = (gridEnd - gridStart) / 15;
  const y = (m: number) => ((m - gridStart) / 15) * ROW;

  return (
    <div className="overflow-x-auto rounded-[6px] border border-line bg-white">
      {closed && <p className="border-b border-line bg-cream px-4 py-2 text-[14px] font-bold text-ink">The salon is closed this day. You can still add bookings.</p>}
      <div className="grid min-w-max" style={{ gridTemplateColumns: `64px repeat(${schedule.stylists.length}, minmax(170px, 1fr))` }}>
        <div className="sticky left-0 z-20 border-b border-r border-line bg-white" />
        {schedule.stylists.map((s) => (
          <div key={s.id} className="border-b border-l border-line px-3 py-3 text-[15px] font-bold text-ink">
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: colorOf(s.id) }} />
            {s.name}
          </div>
        ))}

        <div className="sticky left-0 z-20 border-r border-line bg-white" style={{ height: rows * ROW }}>
          {Array.from({ length: rows / 4 }, (_, i) => (
            <span key={i} className="absolute right-2 -translate-y-1/2 text-[11px] text-muted" style={{ top: i * 4 * ROW + 6, position: "absolute" }}>
              {formatMinutes(gridStart + i * 60)}
            </span>
          ))}
        </div>

        {schedule.stylists.map((s) => {
          const own = schedule.stylistHours.find((h) => h.stylist_id === s.id && h.weekday === weekday);
          const workStart = closed || own?.off ? null : Math.max(open, own?.starts ? timeToMinutes(own.starts) : open);
          const workEnd = closed || own?.off ? null : Math.min(close, own?.ends ? timeToMinutes(own.ends) : close);
          const offBlocks = schedule.timeOff.filter((t) => (t.stylist_id === null || t.stylist_id === s.id) && laDay(new Date(t.starts_at)) <= day && laDay(new Date(t.ends_at)) >= day);

          return (
            <div
              key={s.id}
              className="relative cursor-pointer border-l border-line"
              style={{
                height: rows * ROW,
                backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${ROW * 4 - 1}px, #e4dccd ${ROW * 4 - 1}px, #e4dccd ${ROW * 4}px), repeating-linear-gradient(to bottom, transparent 0, transparent ${ROW - 1}px, #f3eee4 ${ROW - 1}px, #f3eee4 ${ROW}px)`,
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const m = gridStart + Math.floor((e.clientY - rect.top) / ROW) * 15;
                onEmpty(s.id, minutesToTime(Math.min(m, gridEnd - 15)));
              }}
            >
              {/* Hours this stylist is not working are shaded. */}
              {workStart === null ? (
                <div className="pointer-events-none absolute inset-0 bg-[#f1ece2]/80" />
              ) : (
                <>
                  <div className="pointer-events-none absolute inset-x-0 top-0 bg-[#f1ece2]/80" style={{ height: Math.max(0, y(workStart)) }} />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[#f1ece2]/80" style={{ top: y(workEnd!) }} />
                </>
              )}

              {offBlocks.map((t) => {
                const top = laDay(new Date(t.starts_at)) < day ? gridStart : mins(t.starts_at);
                const bottom = laDay(new Date(t.ends_at)) > day ? gridEnd : mins(t.ends_at);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTimeOff(t);
                    }}
                    className="absolute inset-x-1 overflow-hidden rounded-[4px] px-2 py-1 text-left text-[12px] font-bold text-muted ring-1 ring-line"
                    style={{
                      top: y(Math.max(top, gridStart)),
                      height: Math.max(ROW, y(Math.min(bottom, gridEnd)) - y(Math.max(top, gridStart))),
                      backgroundImage: "repeating-linear-gradient(45deg, #f5efe3 0, #f5efe3 6px, #ece4d4 6px, #ece4d4 12px)",
                    }}
                  >
                    {t.reason || "Blocked"}
                    {t.stylist_id === null && " (salon)"}
                  </button>
                );
              })}

              {bookings
                .filter((b) => b.stylist_id === s.id)
                .map((b) => {
                  const top = mins(b.starts_at);
                  const bottom = laDay(new Date(b.ends_at)) > day ? gridEnd : mins(b.ends_at);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBooking(b);
                      }}
                      className={`absolute inset-x-1 z-10 overflow-hidden rounded-[4px] border-l-4 px-2 py-1 text-left text-[12px] leading-tight shadow-sm ${statusStyle[b.status]}`}
                      style={{ top: y(top) + 1, height: Math.max(ROW, y(bottom) - y(top)) - 2, borderLeftColor: colorOf(s.id) }}
                    >
                      <span className="block font-bold">
                        {formatMinutes(top)} {b.client.name}
                      </span>
                      <span className="block opacity-80">
                        {b.service.name}
                        {b.source !== "online" && ` · ${b.source === "phone" ? "phone" : "walk-in"}`}
                        {b.status === "pending" && " · pending"}
                        {b.status === "no_show" && " · no-show"}
                        {b.status === "completed" && " · done"}
                      </span>
                    </button>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekGrid({
  schedule,
  bookings,
  colorOf,
  onBooking,
}: {
  schedule: Schedule;
  bookings: ScheduleBooking[];
  colorOf: (id: string) => string;
  onBooking: (b: ScheduleBooking) => void;
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(schedule.from, i));
  const today = laDay(new Date());
  const stylistName = (id: string) => schedule.stylists.find((s) => s.id === id)?.name ?? "";

  return (
    <div className="overflow-x-auto rounded-[6px] border border-line bg-white">
      <div className="grid min-w-[980px] grid-cols-7 divide-x divide-line">
        {days.map((d) => {
          const list = bookings.filter((b) => laDay(new Date(b.starts_at)) === d);
          const closed = schedule.salonHours.find((h) => h.weekday === weekdayOf(d))?.closed || schedule.closedDates.includes(d);
          return (
            <div key={d} className={`min-h-[420px] ${closed ? "bg-[#f7f3eb]" : ""}`}>
              <Link href={`/admin?day=${d}&view=day`} className={`block border-b border-line px-3 py-3 hover:bg-cream ${d === today ? "text-gold-deep" : "text-ink"}`}>
                <span className="block text-[12px] font-bold uppercase tracking-[0.15em]">
                  {new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`))}
                </span>
                <span className="text-[22px] font-bold">{Number(d.slice(8))}</span>
                <span className="ml-2 text-[12px] text-muted">{closed ? "Closed" : `${list.filter((b) => b.status !== "cancelled").length} booked`}</span>
              </Link>
              <div className="space-y-1.5 p-2">
                {list.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onBooking(b)}
                    className={`block w-full rounded-[4px] border-l-4 px-2 py-1.5 text-left text-[12px] leading-tight ${statusStyle[b.status]}`}
                    style={{ borderLeftColor: colorOf(b.stylist_id) }}
                  >
                    <span className="block font-bold">
                      {formatMinutes(laMinutes(new Date(b.starts_at)))} {b.client.name}
                    </span>
                    <span className="block opacity-80">
                      {b.service.name} · {stylistName(b.stylist_id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
