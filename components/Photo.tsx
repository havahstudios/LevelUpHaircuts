"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// A photo in a sized box. Two optional effects, both taken from the template:
// - drift: the whole box moves from `drift[0]` to `drift[1]` pixels as it passes
//   through the screen (the template's about-section images, e.g. 50 to -50)
// - reveal: the photo fades in and its shadow appears when it first comes into view
export default function Photo({
  src,
  alt,
  className = "",
  sizes = "100vw",
  drift,
  reveal = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  drift?: [number, number];
  reveal?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const range = drift && !reduce ? drift : [0, 0];
  const y = useTransform(scrollYProgress, [0, 1], range);
  const shown = !reveal || inView;

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`relative overflow-hidden transition-shadow duration-700 ${className} ${
        reveal && !shown ? "!shadow-none" : ""
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover transition-opacity duration-[650ms] ease-[cubic-bezier(0.5,1,0.5,1)] ${shown ? "opacity-100" : "opacity-0"}`}
      />
    </motion.div>
  );
}
