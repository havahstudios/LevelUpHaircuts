import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import { getCatalog } from "@/lib/booking/catalog";
import { site } from "@/lib/site";
import BookingFlow from "./BookingFlow";

export const metadata: Metadata = {
  title: "Book Online | Level-Up Hair Salon, Los Angeles",
  description: "Book a haircut, colour, blow-dry or perm at Level-Up Hair Salon on Pico Blvd. Pick your stylist and a time that suits you.",
  alternates: { canonical: "/book" },
};

// Always fresh: services, stylists and prices change in the dashboard.
export const dynamic = "force-dynamic";

export default async function BookPage() {
  const catalog = await getCatalog();

  return (
    <>
      <PageBanner title="Book online" kicker="Pick a service, stylist and time" image="/images/ai/salon-interior.webp" alt="Salon floor with black chairs and brass mirrors" />
      <section className="bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-[980px] px-4 md:px-8">
          {catalog && catalog.services.length > 0 ? (
            <BookingFlow catalog={catalog} />
          ) : (
            <div className="rounded-[6px] border border-line bg-white p-10 text-center">
              <h2 className="text-[34px]">Online booking is almost ready</h2>
              <p className="mx-auto mt-4 max-w-[460px]">
                Please call the salon to book for now. Phone: {site.phone}. We are at {site.address.street}.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
