import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Pricing, { type PriceGroup } from "@/components/Pricing";
import Promos from "@/components/Promos";
import ServiceRows from "@/components/ServiceRows";
import { getCatalog } from "@/lib/booking/catalog";
import { formatDuration, formatPrice } from "@/lib/booking/types";

export const metadata: Metadata = {
  title: "Hair Services in Los Angeles | Cuts, Colour & Perms | Level-Up",
  description:
    "Haircuts for women, men and kids, cut and colour, blow-drys, styling, perms and chemical treatments at Level-Up Hair Salon on Pico Blvd, Rancho Park.",
  alternates: { canonical: "/services" },
};

// Refreshed when staff change a service, and at least every 5 minutes.
export const revalidate = 300;

export default async function ServicesPage() {
  const catalog = await getCatalog();
  const groups: PriceGroup[] | undefined = catalog?.services.length
    ? [...new Set(catalog.services.map((s) => s.category))].map((label) => ({
        label,
        items: catalog.services
          .filter((s) => s.category === label)
          .map((s) => ({ name: s.name, note: [formatDuration(s.duration_minutes), s.description].filter(Boolean).join(" · "), price: formatPrice(s) })),
      }))
    : undefined;

  return (
    <>
      <PageBanner
        title="Services"
        kicker="Cuts, colour, styling and perms"
        image="/images/ai/salon-tools.webp"
        alt="Shears, comb and brush on a walnut counter"
      />
      <ServiceRows />
      <div className="bg-paper">
        <Pricing groups={groups} />
      </div>
      <Promos />
    </>
  );
}
