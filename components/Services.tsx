import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { ColorIcon, CurlIcon, DryerIcon, ScissorsIcon } from "@/components/Icons";
import { services, type ServiceIcon } from "@/lib/content";

const icons: Record<ServiceIcon, typeof ScissorsIcon> = {
  scissors: ScissorsIcon,
  color: ColorIcon,
  dryer: DryerIcon,
  curl: CurlIcon,
};

// Four service columns with line icons, divided by thin rules.
export default function Services() {
  return (
    <section id="services" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <SectionHeading before="Salon" underline="services" className="text-center" />

        <div className="mt-16 grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <div
                key={s.title}
                className={`group flex flex-col items-center px-6 pt-14 text-center ${
                  i > 0 ? "border-t border-line sm:border-t-0 sm:border-l" : ""
                } ${i === 2 ? "sm:border-l-0 lg:border-l" : ""} ${i >= 2 ? "sm:border-t lg:border-t-0" : ""}`}
              >
                <span className="grid h-[100px] w-[100px] place-items-center rounded-full bg-paper text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-gold">
                  <Icon className="h-11 w-11" />
                </span>
                <h3 className="mt-8 font-sans text-[20px] font-bold tracking-normal">{s.title}</h3>
                <p className="mt-3 max-w-[240px] text-[16px] leading-[1.7]">{s.text}</p>
                <Link
                  href="/services#pricing"
                  className="mt-10 w-full border-t border-line py-5 text-[12px] font-bold uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:text-gold-deep"
                >
                  See pricing
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex items-center justify-center gap-4 text-center text-[16px] text-ink">
          <ScissorsIcon className="h-7 w-7 shrink-0 text-gold" />
          <p>Here to help women, men and kids look and feel their best.</p>
        </div>
      </div>
    </section>
  );
}
