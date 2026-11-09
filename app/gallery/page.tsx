import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import PageBanner from "@/components/PageBanner";

export const metadata: Metadata = {
  title: "Gallery | Haircuts, Colour & Styling | Level-Up Hair Salon",
  description: "Haircuts, colour, blow-drys and styling for women, men and kids at Level-Up Hair Salon in Rancho Park, Los Angeles.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageBanner
        title="Gallery"
        kicker="Cuts, colour and styling"
        image="/images/ai/salon-interior.webp"
        alt="Salon floor with black chairs and brass mirrors"
      />
      <GalleryGrid />
    </>
  );
}
