import type { Metadata } from "next";
import Link from "next/link";
import { formatWhen, isUpcoming } from "@/lib/booking/time";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import CancelButton from "./CancelButton";

export const metadata: Metadata = { title: "Your booking | Level-Up Hair Salon", robots: { index: false } };
export const dynamic = "force-dynamic";

const statusText: Record<string, string> = {
  booked: "Booked",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "Missed",
};

// The page a customer reaches from the link in their confirmation.
export default async function ManageBookingPage({ params }: PageProps<"/book/manage/[code]">) {
  const { code } = await params;
  const booking =
    isSupabaseConfigured() && /^[a-f0-9]{64}$/.test(code)
      ? (
          await getSupabaseAdmin()
            .from("bookings")
            .select("status, starts_at, services(name), stylists(name), clients(name)")
            .eq("manage_code", code)
            .maybeSingle()
        ).data
      : null;

  const one = <T,>(v: unknown) => v as T;

  return (
    <section className="bg-paper pb-24 pt-40 md:pt-48">
      <div className="mx-auto max-w-[640px] px-4 md:px-8">
        <div className="rounded-[6px] border border-line bg-white p-8 md:p-12">
          {!booking ? (
            <>
              <h1 className="text-[38px]">Booking not found</h1>
              <p className="mt-4">This link may be wrong or out of date. Please call the salon if you need help.</p>
            </>
          ) : (
            <>
              <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-gold-deep">{statusText[booking.status]}</p>
              <h1 className="mt-3 text-[38px] leading-[1.1] md:text-[48px]">Your booking</h1>
              <dl className="mt-8 space-y-3 text-[16px]">
                <div className="flex justify-between gap-6">
                  <dt>Name</dt>
                  <dd className="font-bold text-ink">{one<{ name: string }>(booking.clients).name}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt>Service</dt>
                  <dd className="font-bold text-ink">{one<{ name: string }>(booking.services).name}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt>Stylist</dt>
                  <dd className="font-bold text-ink">{one<{ name: string }>(booking.stylists).name}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt>When</dt>
                  <dd className="text-right font-bold text-ink">{formatWhen(booking.starts_at)}</dd>
                </div>
              </dl>
              {booking.status === "booked" && isUpcoming(booking.starts_at) && <CancelButton code={code} />}
            </>
          )}
          <Link href="/book" className="mt-8 inline-block font-bold text-ink underline decoration-gold underline-offset-4">
            Make another booking
          </Link>
        </div>
      </div>
    </section>
  );
}
