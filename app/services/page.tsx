import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Pricing from "@/components/Pricing";
import Promos from "@/components/Promos";
import ServiceRows from "@/components/ServiceRows";

export const metadata: Metadata = {
  title: "Hair Services in Los Angeles | Cuts, Colour & Perms | Level-Up",
  description:
    "Haircuts for women, men and kids, cut and colour, blow-drys, styling, perms and chemical treatments at Level-Up Hair Salon on Pico Blvd, Rancho Park.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        title="Services"
        kicker="Cuts, colour, styling and perms"
        image="/images/ai/service-haircut.webp"
        alt="Stylist giving a woman a precise shoulder-length cut"
      />
      <ServiceRows />
      <div className="bg-paper">
        <Pricing />
      </div>
      <Promos />
    </>
  );
}
