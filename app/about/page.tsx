import type { Metadata } from "next";
import Counters from "@/components/Counters";
import PageBanner from "@/components/PageBanner";
import Drift from "@/components/Drift";
import Photo from "@/components/Photo";
import SectionHeading from "@/components/SectionHeading";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "About Level-Up Hair Salon | Family-Owned Salon in Rancho Park",
  description:
    "Level-Up is a family-owned unisex hair salon on Pico Blvd in Rancho Park, Los Angeles, run by owner and stylist Norma with an experienced team.",
  alternates: { canonical: "/about" },
};

// Every point here comes from the salon's Yelp page and reviews.
const values = [
  { title: "You lead, we listen", text: "Clients say the stylists ask questions until they know exactly the look you want, then deliver it." },
  { title: "Everyone is welcome", text: "Women, men and kids, from a fade to a full colour, all under one roof." },
  { title: "Experienced hands", text: "A new salon with stylists who have built loyal clients over many years." },
];

export default function AboutPage() {
  return (
    <>
      <PageBanner title="About" kicker="Family owned on Pico Blvd" image="/images/ai/salon-dusk.webp" alt="Salon at dusk with warm pendant lights" />

      <section className="bg-paper py-24 md:py-36">
        <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-4 md:px-8 lg:grid-cols-2 lg:gap-24">
          <div>
            <div>
              <p className="font-display text-[110px] leading-[0.8] tracking-[-0.04em] text-gold sm:text-[150px]">10962</p>
            </div>
            <div>
              <h2 className="mt-8 text-[40px] leading-[1.05] md:text-[52px]">Our story</h2>
            </div>
            <div>
              <p className="mt-6 max-w-[480px]">
                Level-Up Hair Salon is a family-owned unisex salon at 10962 W Pico Blvd in Rancho Park. Owner Norma spent years
                building a loyal following at another salon before opening her own, and many of her clients followed her here.
              </p>
              <p className="mt-4 max-w-[480px]">
                Today the team cuts, colours and styles hair for women, men and kids, six days a week. Opening year: to confirm.
              </p>
            </div>
          </div>
          <div className="relative h-[560px] md:h-[640px]">
            <div className="absolute left-0 top-0 h-[80%] w-[66%]">
              <Photo src="/images/ai/stylist-portrait.webp" alt="Stylist smiling at her station with scissors and comb" className="h-full w-full rounded-[6px] shadow-[0_30px_60px_rgba(20,18,16,0.15)]" sizes="(min-width: 1024px) 400px, 70vw" drift={[50, -50]} reveal />
            </div>
            <div className="absolute bottom-0 right-0 h-[52%] w-[54%]">
              <Photo src="/images/ai/salon-wash.webp" alt="Client relaxing at the wash basin" className="h-full w-full rounded-[6px] border-[10px] border-paper shadow-[0_30px_60px_rgba(20,18,16,0.2)]" sizes="(min-width: 1024px) 320px, 55vw" drift={[-15, 15]} reveal />
            </div>
            <Drift className="absolute right-0 top-6 text-right">
              <p className="text-[15px] font-bold uppercase tracking-[0.25em] text-ink">Rancho</p>
              <p className="font-display text-[56px] leading-none text-gold md:text-[72px]">Park</p>
            </Drift>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          <SectionHeading before="What we" underline="care about" className="text-center" />
          <div className="mt-16 grid border-y border-line md:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.title} className={`px-8 py-12 text-center ${i > 0 ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
                <h3 className="text-[28px]">{v.title}</h3>
                <p className="mx-auto mt-4 max-w-[300px]">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <Counters />
    </>
  );
}
