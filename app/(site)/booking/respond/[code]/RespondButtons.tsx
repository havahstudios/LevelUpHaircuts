"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// The confirming tap for Accept / Decline. The button the salon clicked in the
// email is highlighted, but nothing happens until it is tapped here.
export default function RespondButtons({ code, suggested }: { code: string; suggested: "accept" | "decline" | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState("");

  async function respond(decision: "accept" | "decline") {
    setBusy(decision);
    setError("");
    try {
      const res = await fetch("/api/bookings/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, decision }),
      });
      const json = await res.json();
      if (json.ok) router.refresh();
      else setError(json.message);
    } catch {
      setError("Could not save. Check your connection and try again.");
    } finally {
      setBusy(null);
    }
  }

  const ring = (d: "accept" | "decline") => (suggested === d ? "ring-2 ring-gold ring-offset-2" : "");

  return (
    <div className="mt-8">
      {suggested && <p className="mb-4 text-[15px]">Tap to confirm your choice.</p>}
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy !== null} onClick={() => respond("accept")} className={`h-12 rounded-[4px] bg-gold px-8 text-[15px] font-bold text-ink disabled:opacity-60 ${ring("accept")}`}>
          {busy === "accept" ? "Accepting..." : "Accept booking"}
        </button>
        <button type="button" disabled={busy !== null} onClick={() => respond("decline")} className={`h-12 rounded-[4px] border border-ink bg-white px-8 text-[15px] font-bold text-ink disabled:opacity-60 ${ring("decline")}`}>
          {busy === "decline" ? "Declining..." : "Decline"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-4 font-bold text-[#a3341f]">
          {error}
        </p>
      )}
    </div>
  );
}
