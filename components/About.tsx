import Link from "next/link";
import SwitchText from "@/components/SwitchText";
import Drift from "@/components/Drift";
import Photo from "@/components/Photo";
import { ArrowIcon, ScissorsIcon } from "@/components/Icons";

// Big gold address number and overlapping photos, like the reference's
// "2023 / since 1998" block.
export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-paper py-24 md:py-36">
      <ScissorsIcon className="pointer-events-none absolute -left-6 bottom-16 hidden h-40 w-40 text-gold/25 lg:block" />
      <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-4 md:px-8 lg:grid-cols-2 lg:gap-24">
        <div>
          <div>
            <p className="font-display text-[110px] leading-[0.8] tracking-[-0.04em] text-gold sm:text-[150px] md:text-[190px]">
              10962
            </p>
          </div>
          <div>
            <h2 className="mt-8 text-[40px] leading-[1.05] md:text-[52px]">
              A family salon
              <br />
              for everyone.
            </h2>
          </div>
          <div>
            <p className="mt-6 max-w-[460px]">
              Level-Up is a family-owned unisex salon at 10962 W Pico Blvd in Rancho Park. Women, men and kids come in for
              cuts, colour, blow-drys and perms, and leave feeling like the best version of themselves.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 rounded-[4px] bg-gold px-7 py-4 text-[14px] font-bold text-ink"
            >
              <SwitchText>Our story</SwitchText>
            </Link>
            <Link href="/book" className="group inline-flex items-center gap-2 text-[15px] font-bold text-ink">
              Book a visit
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="relative h-[520px] md:h-[600px]">
          <div className="absolute left-0 top-0 h-[78%] w-[68%]">
            <Photo
              src="/images/ai/salon-interior.webp"
              alt="Salon floor with black chairs and brass mirrors"
              className="h-full w-full rounded-[6px] shadow-[0_30px_60px_rgba(20,18,16,0.15)]"
              sizes="(min-width: 1024px) 400px, 70vw"
              drift={[50, -50]} reveal
            />
          </div>
          <div className="absolute bottom-0 right-0 h-[55%] w-[52%]">
            <Photo
              src="/images/ai/salon-tools.webp"
              alt="Shears, comb and brush on a walnut counter"
              className="h-full w-full rounded-[6px] border-[10px] border-paper shadow-[0_30px_60px_rgba(20,18,16,0.2)]"
              sizes="(min-width: 1024px) 320px, 55vw"
              drift={[-15, 15]} reveal
            />
          </div>
          <Drift className="absolute right-0 top-6 text-right">
            <p className="text-[15px] font-bold uppercase tracking-[0.25em] text-ink">On Pico</p>
            <p className="font-display text-[56px] leading-none text-gold md:text-[72px]">Blvd</p>
          </Drift>
        </div>
      </div>
    </section>
  );
}
