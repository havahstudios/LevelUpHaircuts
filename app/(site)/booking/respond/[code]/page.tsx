import type { Metadata } from "next";
import Link from "next/link";
import { getByRespondCode, isStillFree } from "@/lib/booking/bookings";
import { formatWhen } from "@/lib/booking/time";
import { statusLabel } from "@/lib/booking/types";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import RespondButtons from "./RespondButtons";

export const metadata: Metadata = { title: "Booking request | Level-Up", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Opened from the Accept / Decline buttons in the salon's email. Shows the
// booking, its status and whether the time is still free, then asks for one
// confirming tap (email scanners open links but never tap buttons).
export default async function RespondPage({ params, searchParams }: PageProps<"/booking/respond/[code]">) {
  const { code } = await params;
  const { action } = await searchParams;
  const supabase = isSupabaseConfigured() ? getSupabaseAdmin() : null;
  const booking = supabase ? await getByRespondCode(supabase, code) : null;
  const free = booking && supabase && booking.status === "pending" ? await isStillFree(supabase, booking) : null;

  return (
    <section className="bg-cream pb-24 pt-36 md:pt-44">
      <div className="mx-auto max-w-[600px] px-4 md:px-8">
        <div className="rounded-[8px] border border-line bg-white p-8 md:p-10">
          {!booking ? (
            <>
              <h1 className="text-[34px]">Link not found</h1>
              <p className="mt-3">This link is not valid. Open the dashboard to see all bookings.</p>
            </>
          ) : (
            <>
              <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-gold-deep">Booking request</p>
              <h1 className="mt-3 text-[34px] leading-[1.1] md:text-[42px]">{booking.client.name}</h1>
              <dl className="mt-6 divide-y divide-line border-y border-line text-[15px]">
                {[
                  ["Service", booking.service.name],
                  ["Stylist", booking.stylist.name],
                  ["When", formatWhen(booking.starts_at)],
                  ["Phone", booking.client.phone],
                  ["Email", booking.client.email || "none"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 py-2.5">
                    <dt>{k}</dt>
                    <dd className="text-right font-bold text-ink">{v}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-6 py-2.5">
                  <dt>Status</dt>
                  <dd className={`font-bold ${booking.status === "pending" ? "text-gold-deep" : "text-ink"}`}>{statusLabel[booking.status]}</dd>
                </div>
                {free !== null && (
                  <div className="flex justify-between gap-6 py-2.5">
                    <dt>Availability</dt>
                    <dd className={`text-right font-bold ${free ? "text-[#3e6b4c]" : "text-[#a3341f]"}`}>
                      {free ? `${booking.stylist.name} is free at this time` : "Clashes with another booking or blocked time"}
                    </dd>
                  </div>
                )}
              </dl>

              {booking.status === "pending" ? (
                <RespondButtons code={code} suggested={action === "decline" ? "decline" : action === "accept" ? "accept" : null} />
              ) : (
                <p className="mt-6">This request has already been answered.</p>
              )}
            </>
          )}
          <Link href="/admin" className="mt-8 inline-block text-[14px] font-bold text-ink underline decoration-gold underline-offset-4">
            Open the schedule
          </Link>
        </div>
      </div>
    </section>
  );
}
