import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { businessData } from "@/lib/business-data";

// Public pages: salon header, footer and Google business data.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }} />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
