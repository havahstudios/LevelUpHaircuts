"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";

// Answers come from the salon's Yelp page where possible. Anything the salon
// has not told us yet says "to confirm".
const faqs = [
  {
    q: "Do you take walk-ins at Level-Up Hair Salon?",
    a: "to confirm",
  },
  {
    q: "Is there parking at the salon?",
    a: "Yes. A client review mentions free parking at the rear of the salon, behind 10962 W Pico Blvd.",
  },
  {
    q: "How does booking an appointment work?",
    a: "Send the form on this page with a day that suits you and the service you want. The salon gets back to you to confirm a time.",
  },
  {
    q: "Do you cut men's and kids' hair?",
    a: "Yes. Level-Up is a unisex salon for women, men and kids, including fades and clipper cuts.",
  },
  {
    q: "What are your opening hours?",
    a: "Monday to Wednesday 9am to 6pm, Thursday and Friday 9am to 7pm, Saturday 9am to 6pm. Closed on Sunday.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[860px] px-4 md:px-8">
        <SectionHeading before="Good to" underline="know" className="text-center" />
        <div className="mt-14 divide-y divide-line border-y border-line">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <h3 className="font-sans text-[18px] font-bold tracking-normal">{f.q}</h3>
                <span className={`text-[26px] leading-none text-gold transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[640px] pb-6">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
