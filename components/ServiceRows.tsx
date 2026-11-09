import Link from "next/link";
import Photo from "@/components/Photo";
import { ArrowIcon, ColorIcon, CurlIcon, DryerIcon, ScissorsIcon } from "@/components/Icons";
import { services, type ServiceIcon } from "@/lib/content";

const icons: Record<ServiceIcon, typeof ScissorsIcon> = {
  scissors: ScissorsIcon,
  color: ColorIcon,
  dryer: DryerIcon,
  curl: CurlIcon,
};

// Longer descriptions for the Services page, keyed by service title.
const details: Record<string, string> = {
  Haircuts:
    "From a quick trim to a whole new shape. Women, men and kids are all welcome, including fades and clipper work, and every cut starts with a chat about what you want.",
  Colour:
    "Cut and colour, root touch-ups, toning and highlights. Bring a photo or just describe the look, and we will talk through the shade before anything is mixed.",
  "Blowouts & styling":
    "Smooth, full blow-drys and styling for every day, a dinner out or a big event. Book one on its own or add it to a cut or colour.",
  "Perms & treatments":
    "Perms for soft waves or defined curls, and chemical treatments chosen for your hair. Ask us what suits your hair type before you book.",
};

// Each service as a big photo beside its text, alternating sides down the page.
export default function ServiceRows() {
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-24 px-4 md:gap-32 md:px-8">
        {services.map((s, i) => {
          const Icon = icons[s.icon];
          const flip = i % 2 === 1;
          return (
            <div key={s.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div className={flip ? "lg:order-2" : ""}>
                <Photo src={s.image} alt={s.text} className="h-[340px] rounded-[6px] md:h-[480px]" sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-gold-deep">Service 0{i + 1}</p>
                <div className="mt-4 flex items-center gap-4">
                  <Icon className="h-10 w-10 text-gold" />
                  <h2 className="text-[38px] md:text-[48px]">{s.title}</h2>
                </div>
                <p className="mt-6 max-w-[460px]">{details[s.title]}</p>
                <Link href="/contact" className="group mt-8 inline-flex items-center gap-2 text-[15px] font-bold text-ink">
                  Book {s.title.toLowerCase()}
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
