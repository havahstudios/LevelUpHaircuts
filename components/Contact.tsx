import { PinIcon } from "@/components/Icons";
import { fullAddress, site } from "@/lib/site";

// Map across the full width with a dark contact card floating over it.
export default function Contact() {
  return (
    <section id="contact" aria-label="Contact and opening hours" className="relative bg-cream">
      <iframe
        title="Map showing Level-Up Hair Salon at 10962 W Pico Blvd, Los Angeles"
        src={site.mapsEmbedUrl}
        className="block h-[460px] w-full grayscale-[0.6] sepia-[0.15] md:h-[640px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="mx-auto max-w-[1200px] px-4 md:absolute md:inset-0 md:flex md:items-center md:justify-end md:px-8 md:pointer-events-none">
        <div className="relative -mt-24 rounded-[6px] border border-line bg-white p-8 text-muted shadow-[0_30px_60px_rgba(20,18,16,0.12)] md:pointer-events-auto md:mt-0 md:w-[400px] md:p-12">
          <h2 className="text-[38px]">Contact us</h2>
          <p className="mt-6 font-bold text-ink">{site.name}</p>
          <address className="not-italic">{fullAddress}</address>
          <p className="mt-1 text-[15px]">{site.address.neighborhood}, West Los Angeles</p>
          <p className="mt-5">
            <span className="text-ink">Phone:</span> {site.phone}
          </p>
          <dl className="mt-6 space-y-1 border-t border-line pt-6 text-[15px]">
            {site.hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-6">
                <dt className="text-ink">{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 border-b border-gold pb-1 text-[13px] font-bold uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:text-gold-deep"
          >
            <PinIcon className="h-4 w-4" />
            Get directions
          </a>
        </div>
      </div>
    </section>
  );
}
