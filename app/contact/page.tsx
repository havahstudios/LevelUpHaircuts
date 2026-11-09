import type { Metadata } from "next";
import AppointmentForm from "@/components/AppointmentForm";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import PageBanner from "@/components/PageBanner";

export const metadata: Metadata = {
  title: "Book an Appointment | Contact Level-Up Hair Salon, Los Angeles",
  description:
    "Request an appointment at Level-Up Hair Salon, 10962 W Pico Blvd, Los Angeles, CA 90064. Open Mon to Sat, until 7pm on Thursday and Friday.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageBanner
        title="Contact & booking"
        kicker="10962 W Pico Blvd"
        image="/images/ai/banner-detail.webp"
        alt="Brass salon mirror and amber product bottles"
      />
      <AppointmentForm />
      <Contact />
      <Faq />
    </>
  );
}
