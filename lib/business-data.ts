import { site } from "@/lib/site";

// Business details for Google, added to every page. The phone number stays out
// until the salon confirms it.
export const businessData = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: site.name,
  description: site.description,
  url: site.siteUrl,
  image: `${site.siteUrl}/images/ai/salon-interior.webp`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: "US",
  },
  areaServed: ["Rancho Park", "Cheviot Hills", "West Los Angeles", "Century City", "Palms"],
  openingHoursSpecification: site.hours
    .filter((h) => h.schema.length)
    .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.schema, opens: h.opens, closes: h.closes })),
  sameAs: Object.values(site.social),
};
