import Image from "next/image";
import Link from "next/link";

// Wide photo with a short message, standing in for the template's video block.
export default function Feature() {
  return (
    <section aria-label="Inside the salon" className="bg-paper pb-24 md:pb-32">
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <div className="relative h-[420px] overflow-hidden rounded-[6px] md:h-[620px]">
          <Image src="/images/ai/salon-dusk.webp" alt="Salon at dusk with warm pendant lights and brass mirrors" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-ink/25" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.32em] text-gold">Thursday and Friday</p>
            <p className="mt-5 font-display text-[44px] leading-[1] tracking-[-0.04em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.3)] md:text-[72px]">Open until 7pm</p>
            <Link
              href="/book"
              className="mt-10 grid h-[110px] w-[110px] place-items-center rounded-full bg-white text-[12px] font-bold uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-gold"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
