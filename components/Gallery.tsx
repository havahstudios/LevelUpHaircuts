import Photo from "@/components/Photo";

const photos = [
  { src: "/images/ai/service-haircut.webp", alt: "Stylist giving a woman a precise shoulder-length cut", span: "lg:col-span-5" },
  { src: "/images/ai/gallery-updo.webp", alt: "Braided updo being pinned for an event", span: "lg:col-span-3" },
  { src: "/images/ai/service-treatment.webp", alt: "Soft, defined curls after a perm", span: "lg:col-span-4" },
];

// A row of three bright photos straddling the edge between two sections, with room below.
export default function Gallery() {
  return (
    <section aria-label="Salon photos" className="bg-[linear-gradient(var(--color-cream)_50%,var(--color-paper)_50%)] pb-24 md:pb-32">
      <div className="mx-auto grid max-w-[1320px] gap-5 px-4 sm:grid-cols-3 md:px-8 lg:grid-cols-12">
        {photos.map((p) => (
          <div key={p.src} className={p.span}>
            <div className="group overflow-hidden rounded-[8px]">
              <div className="transition-transform duration-[1.2s] ease-out group-hover:scale-105">
                <Photo src={p.src} alt={p.alt} className="h-[300px] md:h-[380px]" sizes="(min-width: 1024px) 33vw, 100vw" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
