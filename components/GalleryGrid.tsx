"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { ArrowIcon, InstagramIcon } from "@/components/Icons";
import { gallery, type GalleryCategory } from "@/lib/content";
import { site } from "@/lib/site";

const filters: ("All" | GalleryCategory)[] = ["All", "Cuts", "Colour", "Styling", "Salon"];

// Photo grid with category filters. Clicking a photo opens it full screen,
// with arrows (and arrow keys) to move through the current filter.
export default function GalleryGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [open, setOpen] = useState<number | null>(null);
  const items = filter === "All" ? gallery : gallery.filter((g) => g.category === filter);

  const step = useCallback(
    (dir: number) => setOpen((i) => (i === null ? null : (i + dir + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter photos">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`min-h-11 rounded-full px-6 text-[13px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${
                filter === f ? "bg-ink text-white" : "text-ink hover:text-gold-deep"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {items.map((g, i) => (
              <button
                key={g.src}
                type="button"
                onClick={() => setOpen(i)}
                className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-[6px]"
                aria-label={`Open photo: ${g.alt}`}
              >
                <div className={`relative w-full ${g.tall ? "aspect-[4/5]" : "aspect-[3/2]"}`}>
                  <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
                </div>
                <div className="absolute inset-0 flex items-end bg-ink/0 p-6 transition-colors duration-500 group-hover:bg-ink/20">
                  <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {g.category}
                  </span>
                </div>
              </button>
            ))}
        </div>

        <p className="mt-12 text-center">
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-ink underline decoration-gold underline-offset-4 hover:text-gold-deep">
            <InstagramIcon className="h-4 w-4" />
            See more on Instagram
          </a>
        </p>
      </div>

      <AnimatePresence>
        {open !== null && items[open] && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-paper/95 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={items[open].alt}
          >
            <div className="relative h-[80svh] w-full max-w-[1100px]" onClick={(e) => e.stopPropagation()}>
              <Image src={items[open].src} alt={items[open].alt} fill sizes="100vw" className="object-contain" />
            </div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[13px] text-muted">
              {open + 1} / {items.length}
            </p>
            <button type="button" onClick={() => setOpen(null)} className="absolute right-4 top-4 grid h-12 w-12 place-items-center text-4xl leading-none text-ink hover:text-gold" aria-label="Close photo">
              ×
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center text-ink hover:text-gold-deep md:left-6" aria-label="Previous photo">
              <ArrowIcon className="h-7 w-7 rotate-180" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center text-ink hover:text-gold-deep md:right-6" aria-label="Next photo">
              <ArrowIcon className="h-7 w-7" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
