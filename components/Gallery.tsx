import Photo from "@/components/Photo";

const photos = [
  { src: "/images/ai/gallery-fade.webp", alt: "Clean skin fade being finished with clippers", span: "lg:col-span-5" },
  { src: "/images/ai/service-color.webp", alt: "Colourist painting colour onto foiled sections", span: "lg:col-span-4" },
  { src: "/images/ai/gallery-curls.webp", alt: "Voluminous natural curls, freshly styled", span: "lg:col-span-3" },
];

// A row of three photos straddling the edge between two sections.
export default function Gallery() {
  return (
    <section aria-label="Salon photos" className="bg-[linear-gradient(var(--color-cream)_50%,var(--color-paper)_50%)]">
      <div className="mx-auto grid max-w-[1320px] gap-5 px-4 sm:grid-cols-3 md:px-8 lg:grid-cols-12">
        {photos.map((p) => (
          <div key={p.src} className={p.span}>
            <div className="group overflow-hidden rounded-[6px]">
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
