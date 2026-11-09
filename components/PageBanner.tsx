"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Light banner that opens every inner page: title and breadcrumb on a cream
// background, with a rounded photo beside it. The photo keeps the template's
// half-speed parallax.
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
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "25%"]);

  return (
    <section ref={ref} className="bg-cream pb-14 pt-32 md:pb-20 md:pt-40">
      <div className="mx-auto grid max-w-[1200px] items-end gap-10 px-4 md:px-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="lg:pb-6">
          <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-gold-deep">{kicker}</p>
          <h1 className="mt-5 text-[54px] leading-[1] tracking-[-0.045em] md:text-[84px]">{title}</h1>
          <nav aria-label="Breadcrumb" className="mt-6 text-[14px]">
            <Link href="/" className="hover:text-gold-deep">
              Home
            </Link>
            <span className="mx-3 text-gold">/</span>
            <span className="text-ink">{title}</span>
          </nav>
        </div>
        <div className="relative h-[240px] overflow-hidden rounded-[8px] md:h-[340px]">
          <motion.div style={{ y }} className="absolute -inset-y-[15%] inset-x-0">
            <Image src={image} alt={alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
