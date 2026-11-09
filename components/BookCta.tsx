import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import SwitchText from "@/components/SwitchText";
import { site } from "@/lib/site";

// Booking block on the Contact page: online booking, or call.
export default function BookCta() {
  return (
    <section id="book" className="bg-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
        <div>
          <SectionHeading before="Book your" underline="appointment" />
          <p className="mt-6 max-w-[460px]">
            Pick your service, your stylist (or whoever is free) and a time that suits you. You&apos;ll see only the times that are really open, and your booking is confirmed straight away.
          </p>
          <Link href="/book" className="group mt-10 inline-flex items-center gap-3 rounded-[4px] bg-gold px-8 py-4 text-[14px] font-bold text-ink">
            <SwitchText>Book online</SwitchText>
          </Link>
        </div>
        <div className="rounded-[6px] border border-line bg-white p-8 md:p-10">
          <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-ink">Prefer to call?</p>
          <p className="mt-2 font-display text-[30px] tracking-[-0.04em] text-ink">{site.phone}</p>
          <p className="mt-4 text-[15px]">Calls are added straight into the same schedule, so phone and online bookings never clash.</p>
        </div>
      </div>
    </section>
  );
}
