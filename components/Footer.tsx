import Image from "next/image";
import Link from "next/link";
import SwitchText from "@/components/SwitchText";
import Logo from "@/components/Logo";
import SocialLinks from "@/components/SocialLinks";
import { navLinks } from "@/lib/content";
import { fullAddress, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white/70">
      <Image src="/images/ai/banner-detail.webp" alt="" fill sizes="100vw" className="object-cover opacity-20" />
      <div className="relative mx-auto max-w-[1200px] px-4 pb-10 pt-24 md:px-8">
        <div className="text-center">
          <p className="font-display text-[44px] leading-none text-white md:text-[72px]">
            Ready to <span className="text-gold">level up</span>?
          </p>
          <Link
            href="/book"
            className="group mt-10 inline-flex rounded-[4px] bg-gold px-8 py-4 text-[14px] font-bold text-ink"
          >
            <SwitchText>Book an appointment</SwitchText>
          </Link>
        </div>

        <div className="mt-24 grid gap-10 border-t border-white/10 pt-14 md:grid-cols-3">
          <div>
            <Logo light />
            <p className="mt-5 max-w-[280px] text-[15px]">A family-owned unisex hair salon in Rancho Park, Los Angeles.</p>
          </div>
          <div className="text-[15px]">
            <p className="font-bold text-white">Visit</p>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block hover:text-gold">
              {fullAddress}
            </a>
            <p className="mt-2">Mon to Sat. Open until 7pm Thu and Fri.</p>
          </div>
          <div className="text-[15px]">
            <p className="font-bold text-white">Explore</p>
            <nav className="mt-2 flex flex-wrap gap-x-6 gap-y-1" aria-label="Footer">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-gold">
                  {l.label}
                </Link>
              ))}
            </nav>
            <SocialLinks className="-ml-3 mt-4" />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-[13px] md:flex-row md:justify-between">
          <p>&copy; {site.name}. All rights reserved.</p>
          <p>Images are illustrative until our own photos are added.</p>
        </div>
      </div>
    </footer>
  );
}
