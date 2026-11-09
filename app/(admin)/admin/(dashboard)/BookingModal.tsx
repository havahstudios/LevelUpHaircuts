"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import type { Schedule, ScheduleBooking } from "@/lib/booking/staff";
import { formatWhen, laDay, laMinutes, minutesToTime, formatMinutes } from "@/lib/booking/time";
import { formatDuration, type BookingStatus } from "@/lib/booking/types";
import { saveBookingAction, searchClientsAction, setStatusAction } from "./schedule-actions";

export type ModalState = { mode: "new"; day: string; time: string; stylistId: string } | { mode: "edit"; booking: ScheduleBooking };

type Suggestion = { id: string; name: string; phone: string; email: string };

const input = "h-11 w-full rounded-[4px] border border-line bg-white px-3 text-[15px] text-ink outline-none focus:border-gold";
const label = "block text-[12px] font-bold uppercase tracking-[0.12em] text-muted";
// Every 15 minutes from 6am to 10pm, so staff can squeeze in early or late bookings.
const times = Array.from({ length: (22 - 6) * 4 + 1 }, (_, i) => 6 * 60 + i * 15);

// Add a phone-in or walk-in booking, or open an existing one to edit,
// move, cancel or mark it completed / no-show.
export default function BookingModal({ state, schedule, onClose }: { state: ModalState; schedule: Schedule; onClose: () => void }) {
  const editing = state.mode === "edit" ? state.booking : null;
  const [name, setName] = useState(editing?.client.name ?? "");
  const [phone, setPhone] = useState(editing?.client.phone ?? "");
  const [email, setEmail] = useState(editing?.client.email ?? "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const activeServices = schedule.services.filter((s) => s.active || s.id === editing?.service_id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Suggest existing clients while typing a name or phone (new bookings only).
  useEffect(() => {
    if (editing) return;
    const q = name.length >= 2 ? name : phone.replace(/\D/g, "").length >= 3 ? phone : "";
    if (!q) return;
    const id = setTimeout(() => searchClientsAction(q).then(setSuggestions), 250);
    return () => clearTimeout(id);
  }, [name, phone, editing]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError("");
    start(async () => {
      const result = await saveBookingAction({
        id: editing?.id,
        serviceId: String(f.get("service")),
        stylistId: String(f.get("stylist")),
        day: String(f.get("day")),
        time: String(f.get("time")),
        source: (f.get("source") as "phone" | "walk_in") ?? "phone",
        note: String(f.get("note") ?? ""),
        client: { name, phone, email },
      });
      if (result.ok) onClose();
      else setError(result.message);
    });
  }

  function status(next: BookingStatus, confirmText?: string) {
    if (!editing || (confirmText && !confirm(confirmText))) return;
    setError("");
    start(async () => {
      const result = await setStatusAction(editing.id, next);
      if (result.ok) onClose();
      else setError(result.message);
    });
  }

  const initialDay = editing ? laDay(new Date(editing.starts_at)) : state.mode === "new" ? state.day : "";
  const initialTime = editing ? minutesToTime(laMinutes(new Date(editing.starts_at))) : state.mode === "new" ? state.time : "10:00";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={editing ? "Edit booking" : "Add booking"}>
      <div className="max-h-[94svh] w-full max-w-[560px] overflow-y-auto rounded-t-[10px] bg-paper p-6 sm:rounded-[8px] md:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[28px]">{editing ? "Booking" : "Add booking"}</h2>
            {editing && (
              <p className="mt-1 text-[14px]">
                {formatWhen(editing.starts_at)} · {editing.status.replace("_", "-")} · booked {editing.source === "online" ? "online" : editing.source === "phone" ? "by phone" : "as walk-in"}
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center text-3xl leading-none text-ink" aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="relative sm:col-span-2">
            <label className={label} htmlFor="bk-name">
              Client name
            </label>
            <input id="bk-name" value={name} onChange={(e) => setName(e.target.value)} className={`${input} mt-1`} autoComplete="off" required />
            {suggestions.length > 0 && !editing && (
              <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-[4px] border border-line bg-white shadow-lg">
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setName(s.name);
                        setPhone(s.phone);
                        setEmail(s.email);
                        setSuggestions([]);
                      }}
                      className="block w-full px-3 py-2 text-left text-[14px] hover:bg-cream"
                    >
                      <span className="font-bold text-ink">{s.name}</span> {s.phone} {s.email}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className={label} htmlFor="bk-phone">
              Phone
            </label>
            <input id="bk-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`${input} mt-1`} required />
          </div>
          <div>
            <label className={label} htmlFor="bk-email">
              Email (optional)
            </label>
            <input id="bk-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${input} mt-1`} />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="bk-service">
              Service
            </label>
            <select id="bk-service" name="service" defaultValue={editing?.service_id ?? activeServices[0]?.id} className={`${input} mt-1`}>
              {activeServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({formatDuration(s.duration_minutes)})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="bk-stylist">
              Stylist
            </label>
            <select id="bk-stylist" name="stylist" defaultValue={editing?.stylist_id ?? (state.mode === "new" ? state.stylistId : "")} className={`${input} mt-1`}>
              {schedule.stylists.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          {!editing && (
            <div>
              <label className={label} htmlFor="bk-source">
                Booked by
              </label>
              <select id="bk-source" name="source" defaultValue="phone" className={`${input} mt-1`}>
                <option value="phone">Phone call</option>
                <option value="walk_in">Walk-in</option>
              </select>
            </div>
          )}
          <div>
            <label className={label} htmlFor="bk-day">
              Day
            </label>
            <input id="bk-day" name="day" type="date" defaultValue={initialDay} className={`${input} mt-1`} required />
          </div>
          <div>
            <label className={label} htmlFor="bk-time">
              Time
            </label>
            <select id="bk-time" name="time" defaultValue={initialTime} className={`${input} mt-1`}>
              {times.map((m) => (
                <option key={m} value={minutesToTime(m)}>
                  {formatMinutes(m)}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="bk-note">
              Note
            </label>
            <textarea id="bk-note" name="note" rows={2} defaultValue={editing?.note ?? ""} className={`${input} mt-1 h-auto py-2`} />
          </div>

          {error && (
            <p role="alert" className="text-[14px] font-bold text-[#a3341f] sm:col-span-2">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button type="submit" disabled={pending} className="h-11 rounded-[4px] bg-ink px-6 text-[14px] font-bold text-white disabled:opacity-60">
              {pending ? "Saving..." : editing ? "Save changes" : "Add booking"}
            </button>
            <button type="button" onClick={onClose} className="h-11 rounded-[4px] border border-line px-6 text-[14px] font-bold text-ink">
              Close
            </button>
          </div>
        </form>

        {editing && (
          <div className="mt-6 border-t border-line pt-6">
            <p className={label}>Mark as</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {editing.status !== "completed" && (
                <button type="button" disabled={pending} onClick={() => status("completed")} className="h-11 rounded-[4px] border border-line bg-white px-4 text-[14px] font-bold text-ink">
                  Completed
                </button>
              )}
              {editing.status !== "no_show" && (
                <button type="button" disabled={pending} onClick={() => status("no_show")} className="h-11 rounded-[4px] border border-line bg-white px-4 text-[14px] font-bold text-ink">
                  No-show
                </button>
              )}
              {editing.status !== "booked" && (
                <button type="button" disabled={pending} onClick={() => status("booked")} className="h-11 rounded-[4px] border border-line bg-white px-4 text-[14px] font-bold text-ink">
                  Back to booked
                </button>
              )}
              {editing.status !== "cancelled" && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => status("cancelled", `Cancel ${editing.client.name}'s booking?`)}
                  className="h-11 rounded-[4px] border border-[#a3341f] px-4 text-[14px] font-bold text-[#a3341f]"
                >
                  Cancel booking
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
