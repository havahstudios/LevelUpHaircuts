"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { YelpIcon } from "@/components/Icons";
import { reviews } from "@/lib/content";
import { site } from "@/lib/site";

// Real Yelp reviews, one at a time, sliding sideways with Prev / Next like the template.
export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const count = reviews.length;

  const go = (step: number) => {
    setDir(step);
    setIndex((i) => (i + step + count) % count);
  };

  const review = reviews[index];

  return (
    <section id="reviews" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1000px] px-4 md:px-8">
        <SectionHeading before="Happy" underline="clients" className="text-center" />

        <div className="mt-14 grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-10">
          <SlideButton label="Prev" onClick={() => go(-1)} />
          <div className="relative min-h-[300px] overflow-hidden text-center sm:min-h-[230px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={index}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-display text-[64px] leading-[0.6] text-gold" aria-hidden>
                  &ldquo;
                </p>
                <blockquote className="mt-2 font-display text-[21px] leading-[1.5] text-ink md:text-[26px]">
                  {review.text}
                </blockquote>
                <figcaption className="mt-6 text-[14px]">
                  <span className="font-bold uppercase tracking-[0.15em] text-ink">{review.name}</span>
                  <span className="mx-2 text-gold">/</span>
                  <span>Yelp, {review.date}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <SlideButton label="Next" onClick={() => go(1)} />
        </div>

        <div className="mt-6 flex justify-center gap-1" role="tablist" aria-label="Choose a review">
          {reviews.map((r, i) => (
            <button
              key={r.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Review by ${r.name}`}
              onClick={() => {
                setDir(i > index ? 1 : -1);
                setIndex(i);
              }}
              className="grid h-11 w-7 place-items-center"
            >
              <span className={`block h-[3px] rounded-full transition-all duration-500 ${i === index ? "w-7 bg-gold" : "w-3 bg-line"}`} />
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-[15px]">
          <a
            href={site.social.yelp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold text-ink underline decoration-gold underline-offset-4 hover:text-gold-deep"
          >
            <YelpIcon className="h-4 w-4 text-[#c41200]" />
            Read all 17 reviews on Yelp
          </a>
        </p>
      </div>
    </section>
  );
}

function SlideButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} review`}
      className="h-11 px-1 text-[12px] font-bold uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:text-gold-deep"
    >
      {label}
    </button>
  );
}
