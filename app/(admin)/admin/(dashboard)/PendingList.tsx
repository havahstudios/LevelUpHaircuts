"use client";

import { useState, useTransition } from "react";
import type { ScheduleBooking } from "@/lib/booking/staff";
import { formatWhen } from "@/lib/booking/time";
import type { Stylist } from "@/lib/booking/types";
import { decideAction } from "./schedule-actions";

// Online bookings waiting for the salon to accept or decline, newest time first.
export default function PendingList({
  pending,
  stylists,
  onOpen,
}: {
  pending: (ScheduleBooking & { stillFree: boolean })[];
  stylists: Stylist[];
  onOpen: (b: ScheduleBooking) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [, start] = useTransition();

  if (pending.length === 0) return null;

  function decide(id: string, decision: "accept" | "decline") {
    setBusy(id);
    setError("");
    start(async () => {
      const result = await decideAction(id, decision);
      if (!result.ok) setError(result.message);
      setBusy(null);
    });
  }

  return (
    <div className="mb-6 rounded-[6px] border border-gold bg-[#fbf4e2] p-4 md:p-5">
      <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-gold-deep">Waiting for approval · {pending.length}</p>
      <ul className="mt-3 divide-y divide-gold/30">
        {pending.map((b) => (
          <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <button type="button" onClick={() => onOpen(b)} className="text-left">
              <span className="block font-bold text-ink">
                {b.client.name} · {b.service.name}
              </span>
              <span className="block text-[14px]">
                {formatWhen(b.starts_at)} with {stylists.find((s) => s.id === b.stylist_id)?.name ?? "stylist"}
              </span>
              <span className={`mt-0.5 block text-[13px] font-bold ${b.stillFree ? "text-[#3e6b4c]" : "text-[#a3341f]"}`}>
                {b.stillFree ? "Available: this time is free" : "Clashes with blocked time"}
              </span>
            </button>
            <span className="flex gap-2">
              <button type="button" disabled={busy === b.id} onClick={() => decide(b.id, "accept")} className="h-11 rounded-[4px] bg-gold px-5 text-[14px] font-bold text-ink disabled:opacity-60">
                Accept
              </button>
              <button type="button" disabled={busy === b.id} onClick={() => decide(b.id, "decline")} className="h-11 rounded-[4px] border border-ink bg-white px-5 text-[14px] font-bold text-ink disabled:opacity-60">
                Decline
              </button>
            </span>
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 font-bold text-[#a3341f]">{error}</p>}
    </div>
  );
}
