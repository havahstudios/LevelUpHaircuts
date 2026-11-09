import Link from "next/link";
import Image from "next/image";

const promos = [
  {
    tag: "Women, men and kids",
    title: "Cut & colour",
    text: "A fresh cut, a new shade, or both",
    image: "/images/ai/gallery-balayage.webp",
    alt: "Long hair with a warm honey balayage",
  },
  {
    tag: "Every day or a big night",
    title: "Blow-dry & style",
    text: "Smooth, full and ready to go",
    image: "/images/ai/service-styling.webp",
    alt: "Blowout with a round brush for volume",
  },
];

// Two image cards with a tag, title and line.
export default function Promos() {
  return (
    <section aria-label="Featured services" className="bg-cream py-24 md:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 md:grid-cols-2 md:px-8">
        {promos.map((p) => (
          <div key={p.title}>
            <Link href="/book" className="group relative block h-[380px] overflow-hidden rounded-[6px] md:h-[440px]">
              <Image
                src={p.image}
                alt={p.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-ink/50" />
              <span className="absolute right-6 top-6 rounded-[3px] bg-ink/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                {p.tag}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-8 text-center md:p-12">
                <h3 className="text-[40px] leading-none text-white md:text-[48px]">{p.title}</h3>
                <p className="mt-3 text-white/80">{p.text}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
