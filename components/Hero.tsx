"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CalendarIcon } from "@/components/Icons";
import SwitchText from "@/components/SwitchText";

// Full-screen photo with the headline over it. The only motion is the
// template's background parallax: the photo scrolls at half speed.
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "50%"]);

  return (
    <section ref={ref} id="top" className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden bg-ink">
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        <Image src="/images/ai/hero.webp" alt="Stylist cutting long dark hair with professional shears" fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-ink/50" />

      <div className="relative z-10 px-4 text-center text-white">
        <h1 className="text-white">
          <span className="mb-6 block font-sans text-[13px] font-bold uppercase tracking-[0.3em] text-white/85 md:text-[14px]">
            Unisex hair salon in Los Angeles
          </span>
          <span className="block text-[58px] leading-[1] tracking-[-0.045em] sm:text-[78px] lg:text-[96px]">
            Level <span className="text-gold">up</span> your look
          </span>
        </h1>
        <Link
          href="/contact"
          className="group mt-10 inline-flex items-center gap-3 rounded-[4px] bg-white px-7 py-3.5 text-[15px] font-bold text-ink"
        >
          <CalendarIcon className="h-[18px] w-[18px]" />
          <SwitchText>Book an appointment</SwitchText>
        </Link>
      </div>

      <Link href="#about" aria-label="Scroll to about" className="absolute bottom-8 left-1/2 z-10 flex h-12 w-7 -translate-x-1/2 justify-center rounded-full border border-white/50 pt-2">
        <span className="block h-2 w-px bg-white" />
      </Link>
    </section>
  );
}
