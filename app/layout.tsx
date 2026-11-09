import type { Metadata } from "next";
import { Limelight, Sen } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { businessData } from "@/lib/business-data";
import { site } from "@/lib/site";
import "./globals.css";

// Same heading font as the Crafto barber template.
const limelight = Limelight({
  variable: "--font-limelight",
  subsets: ["latin"],
  weight: "400",
});

const sen = Sen({
  variable: "--font-sen",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: "Hair Salon in Los Angeles | Level-Up Hair Salon, Rancho Park",
  description:
    "Family-owned unisex hair salon on Pico Blvd in Rancho Park, Los Angeles. Haircuts, colour, blow-drys and perms for women, men and kids. Open Mon to Sat.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Level-Up Hair Salon | Unisex Hair Salon in Los Angeles",
    description: site.description,
    url: "/",
    siteName: site.name,
    images: [{ url: "/images/ai/salon-interior.webp" }],
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: site.indexable ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${limelight.variable} ${sen.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
