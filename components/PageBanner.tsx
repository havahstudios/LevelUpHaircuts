"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Dark photo banner that opens every inner page: title, short line and a
// breadcrumb. Same half-speed photo parallax as the home hero, nothing else.
export default function PageBanner({
  title,
  kicker,
  image,
  alt,
}: {
  title: string;
  kicker: string;
  image: string;
  alt: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "50%"]);

  return (
    <section ref={ref} className="relative flex h-[62svh] min-h-[440px] items-end overflow-hidden bg-ink">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-ink/55" />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 pb-16 md:px-8 md:pb-20">
        <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-gold">{kicker}</p>
        <h1 className="mt-5 text-[54px] leading-[1] tracking-[-0.045em] text-white md:text-[90px]">{title}</h1>
        <nav aria-label="Breadcrumb" className="mt-6 text-[14px] text-white/70">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <span className="mx-3 text-gold">/</span>
          <span className="text-white">{title}</span>
        </nav>
      </div>
    </section>
  );
}
