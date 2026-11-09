import Image from "next/image";
import Link from "next/link";
import SwitchText from "@/components/SwitchText";

// Light card: a bright photo beside the late-opening message and a Book button.
export default function Feature() {
  return (
    <section aria-label="Late opening" className="bg-paper pb-24 md:pb-32">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="grid overflow-hidden rounded-[12px] border border-line bg-cream md:grid-cols-2">
          <div className="relative h-[300px] md:h-auto md:min-h-[440px]">
            <Image src="/images/ai/salon-wash.webp" alt="Client relaxing at the wash basin with warm towels" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center px-8 py-12 md:px-14">
            <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-gold-deep">Thursday and Friday</p>
            <p className="mt-4 font-display text-[44px] leading-[1] tracking-[-0.04em] text-ink md:text-[60px]">Open until 7pm</p>
            <p className="mt-5 max-w-[380px]">Come in after work for a cut, colour or blow-dry. Monday to Saturday from 9am.</p>
            <Link href="/book" className="group mt-8 inline-flex w-fit rounded-[4px] bg-gold px-8 py-4 text-[14px] font-bold text-ink">
              <SwitchText>Book an evening visit</SwitchText>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
