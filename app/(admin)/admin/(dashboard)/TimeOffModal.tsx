"use client";

import { useState, useTransition, type FormEvent } from "react";
import { formatMinutes, formatWhen, minutesToTime } from "@/lib/booking/time";
import type { Stylist, TimeOff } from "@/lib/booking/types";
import { addTimeOffAction, removeTimeOffAction } from "./schedule-actions";

const input = "h-11 w-full rounded-[4px] border border-line bg-white px-3 text-[15px] text-ink outline-none focus:border-gold";
const label = "block text-[12px] font-bold uppercase tracking-[0.12em] text-muted";
const times = Array.from({ length: (22 - 6) * 4 + 1 }, (_, i) => 6 * 60 + i * 15);

// Block time (lunch, a day off) or remove an existing block.
export default function TimeOffModal({
  state,
  stylists,
  onClose,
}: {
  state: { stylistId: string; day: string; from: string } | TimeOff;
  stylists: Stylist[];
  onClose: () => void;
}) {
  const existing = "id" in state ? state : null;
  const draft = "id" in state ? { stylistId: "", day: "", from: "12:00" } : state;
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError("");
    start(async () => {
      const result = await addTimeOffAction({
        stylistId: String(f.get("stylist")),
        day: String(f.get("day")),
        from: String(f.get("from")),
        to: String(f.get("to")),
        reason: String(f.get("reason") ?? ""),
      });
      if (result.ok) onClose();
      else setError(result.message);
    });
  }

  function remove() {
    if (!existing) return;
    start(async () => {
      const result = await removeTimeOffAction(existing.id);
      if (result.ok) onClose();
      else setError(result.message);
    });
  }

  const who = existing ? (existing.stylist_id ? stylists.find((s) => s.id === existing.stylist_id)?.name ?? "Stylist" : "Whole salon") : "";
  const fromMins = Number(draft.from.slice(0, 2)) * 60 + Number(draft.from.slice(3, 5));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 sm:items-center sm:p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label="Block time">
      <div className="w-full max-w-[480px] rounded-t-[10px] bg-paper p-6 sm:rounded-[8px] md:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h2 className="text-[28px]">{existing ? "Blocked time" : "Block time"}</h2>
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center text-3xl leading-none text-ink" aria-label="Close">
            ×
          </button>
        </div>

        {existing ? (
          <div className="mt-4">
            <p className="text-ink">
              <strong>{who}</strong>: {existing.reason || "Blocked"}
            </p>
            <p className="mt-1 text-[14px]">
              {formatWhen(existing.starts_at)} to {formatWhen(existing.ends_at)}
            </p>
            {error && <p className="mt-3 font-bold text-[#a3341f]">{error}</p>}
            <button type="button" onClick={remove} disabled={pending} className="mt-6 h-11 rounded-[4px] border border-[#a3341f] px-5 text-[14px] font-bold text-[#a3341f]">
              {pending ? "Removing..." : "Remove block"}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label} htmlFor="to-who">
                Who
              </label>
              <select id="to-who" name="stylist" defaultValue={draft.stylistId} className={`${input} mt-1`}>
                <option value="">Whole salon</option>
                {stylists.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="to-day">
                Day
              </label>
              <input id="to-day" name="day" type="date" defaultValue={draft.day} className={`${input} mt-1`} required />
            </div>
            <div>
              <label className={label} htmlFor="to-from">
                From
              </label>
              <select id="to-from" name="from" defaultValue={draft.from} className={`${input} mt-1`}>
                {times.map((m) => (
                  <option key={m} value={minutesToTime(m)}>
                    {formatMinutes(m)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="to-to">
                To
              </label>
              <select id="to-to" name="to" defaultValue={minutesToTime(Math.min(fromMins + 60, 22 * 60))} className={`${input} mt-1`}>
                {times.map((m) => (
                  <option key={m} value={minutesToTime(m)}>
                    {formatMinutes(m)}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="to-reason">
                Reason (optional)
              </label>
              <input id="to-reason" name="reason" placeholder="Lunch, day off, training..." className={`${input} mt-1`} />
            </div>
            {error && <p className="font-bold text-[#a3341f] sm:col-span-2">{error}</p>}
            <div className="sm:col-span-2">
              <button type="submit" disabled={pending} className="h-11 rounded-[4px] bg-ink px-6 text-[14px] font-bold text-white disabled:opacity-60">
                {pending ? "Saving..." : "Block time"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
