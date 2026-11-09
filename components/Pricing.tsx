import SectionHeading from "@/components/SectionHeading";
import { priceGroups } from "@/lib/content";

// Two-column price menu. The first row of each column sits on its own,
// the rest sit inside a labelled card, like the reference. Rows nudge right on hover.
export default function Pricing() {
  return (
    <section id="pricing" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <SectionHeading before="Simple" underline="pricing" className="text-center" />
        <div>
          <p className="mx-auto mt-5 max-w-[520px] text-center">
            Every visit starts with a quick chat about the look you want and what it will take to get there.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {priceGroups.map((group) => {
            const [first, ...rest] = group.items;
            return (
              <div key={group.label}>
                <PriceRow {...first} />
                <div className="mt-6 rounded-[6px] border border-line bg-white">
                  <p className="border-b border-line bg-cream px-8 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-ink">
                    {group.label}
                  </p>
                  <div className="divide-y divide-line">
                    {rest.map((item) => (
                      <PriceRow key={item.name} {...item} boxed />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PriceRow({ name, note, price, boxed = false }: { name: string; note: string; price: string; boxed?: boolean }) {
  return (
    <div className={`group flex items-start justify-between gap-6 transition-transform duration-500 hover:translate-x-[15px] ${boxed ? "px-8 py-6" : "px-8 py-2"}`}>
      <div>
        <h3 className="font-sans text-[18px] font-bold tracking-normal transition-colors duration-300 group-hover:text-gold-deep">
          {name}
        </h3>
        <p className="mt-1 text-[16px]">{note}</p>
      </div>
      <p className="shrink-0 pt-0.5 text-[15px] font-bold text-ink">{price}</p>
    </div>
  );
}
