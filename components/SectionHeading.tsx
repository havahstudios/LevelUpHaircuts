"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

// A section title with one word underlined. The underline draws in once the
// heading comes into view, like the template's heading separator.
export default function SectionHeading({
  before,
  underline,
  after = "",
  className = "",
}: {
  before: string;
  underline: string;
  after?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <h2 ref={ref} className={`text-[40px] leading-[1.05] md:text-[55px] ${inView ? "is-inview" : ""} ${className}`}>
      {before} <span className="underline-draw">{underline}</span>
      {after}
    </h2>
  );
}
