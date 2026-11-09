"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelButton({ code }: { code: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function cancel() {
    if (!confirm("Cancel this appointment?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = await res.json();
      if (json.ok) router.refresh();
      else setError(json.message);
    } catch {
      setError("Could not cancel. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 border-t border-line pt-8">
      <button type="button" onClick={cancel} disabled={busy} className="rounded-[4px] border border-[#a3341f] px-6 py-3 text-[14px] font-bold text-[#a3341f] hover:bg-[#a3341f] hover:text-white disabled:opacity-60">
        {busy ? "Cancelling..." : "Cancel appointment"}
      </button>
      {error && (
        <p role="alert" className="mt-3 font-bold text-[#a3341f]">
          {error}
        </p>
      )}
    </div>
  );
}
