"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import SwitchText from "@/components/SwitchText";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import SocialLinks from "@/components/SocialLinks";
import { navLinks } from "@/lib/content";

const MotionLink = motion.create(Link);
// Transparent over the hero, then a solid dark bar once you scroll.
export default function Header() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(y > 120);
  });

  const left = navLinks.slice(0, 3);
  const right = navLinks.slice(3);
  const linkClass = (href: string) => `relative py-2 text-[15px] transition-colors duration-300 hover:text-gold after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold after:transition-all after:duration-300 hover:after:w-full ${
      pathname === href ? "text-gold after:w-full" : "after:w-0"
    }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid || pathname.startsWith("/book/manage") ? "bg-ink/95 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur" : "bg-transparent"
        }`}
      >
        <div className={`mx-auto grid max-w-[1320px] grid-cols-[1fr_auto_1fr] items-center px-4 h-[84px] text-white md:px-8`}>
          <div className="flex items-center gap-8">
            <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
              {left.map((l) => (
                <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="-ml-2 grid h-11 w-11 place-items-center lg:hidden"
              aria-label="Open menu"
            >
              <span className="block h-px w-6 bg-white shadow-[0_-7px_0_white,0_7px_0_white]" />
            </button>
          </div>

          <Link href="/" aria-label="Level-Up Hair Salon home" className="px-6">
            <Logo light />
          </Link>

          <div className="flex items-center justify-end gap-8">
            <nav className="hidden items-center gap-8 lg:flex" aria-label="More">
              {right.map((l) => (
                <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/book"
              className="hidden rounded-[4px] border border-gold px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.15em] text-gold xl:inline-block group"
            >
              <SwitchText>Book now</SwitchText>
            </Link>
            <SocialLinks className="hidden md:flex xl:hidden" />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink px-6 pb-10 pt-6 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between">
              <Logo light />
              <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center text-3xl leading-none" aria-label="Close menu">
                ×
              </button>
            </div>
            <nav className="mt-14 flex flex-col gap-2" aria-label="Mobile">
              {[...navLinks, { href: "/book", label: "Book a visit" }].map((l) => (
                <MotionLink
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-[40px] leading-[1.3] text-white hover:text-gold"
                >
                  {l.label}
                </MotionLink>
              ))}
            </nav>
            <SocialLinks className="mt-auto -ml-3" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
