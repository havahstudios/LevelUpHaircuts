"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { counters } from "@/lib/content";

// Four numbers whose digits roll up into place, like an odometer, when they
// come into view. The same counter style as the template.
export default function Counters() {
  return (
    <section aria-label="Level-Up in numbers" className="border-t border-line bg-paper py-16 md:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-y-12 px-4 md:px-8 lg:grid-cols-4">
        {counters.map((c) => (
          <Counter key={c.label} {...c} />
        ))}
      </div>
    </section>
  );
}

function Counter({ value, suffix, label }: { value: number | null; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  if (value === null) {
    return (
      <div ref={ref} className="text-center lg:border-l lg:border-line lg:first:border-l-0">
        <p className="flex h-[56px] items-center justify-center text-[15px] font-bold uppercase tracking-[0.2em] text-gold-deep md:h-[68px]">to confirm</p>
        <p className="mt-3 text-[15px]">{label}</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="text-center lg:border-l lg:border-line lg:first:border-l-0">
      <p className="flex items-baseline justify-center font-display text-[56px] leading-none tracking-[-0.04em] text-ink md:text-[68px]">
        <span className="sr-only">
          {value}
          {suffix}
        </span>
        <span aria-hidden className="flex">
          {String(value)
            .split("")
            .map((d, i) => (
              <span key={i} className="inline-block h-[1em] overflow-hidden">
                <span
                  className="flex flex-col transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: `translateY(${inView ? -Number(d) : 0}em)` }}
                >
                  {"0123456789".split("").map((n) => (
                    <span key={n} className="h-[1em]">
                      {n}
                    </span>
                  ))}
                </span>
              </span>
            ))}
        </span>
        {suffix && (
          <span aria-hidden className="ml-1 text-[0.5em] text-gold">
            {suffix}
          </span>
        )}
      </p>
      <p className="mt-3 text-[15px]">{label}</p>
    </div>
  );
}
