import { FacebookIcon, InstagramIcon, YelpIcon } from "@/components/Icons";
import { site } from "@/lib/site";

const links = [
  { href: site.social.instagram, label: "Level-Up Hair Salon on Instagram", Icon: InstagramIcon },
  { href: site.social.facebook, label: "Level-Up Hair Salon on Facebook", Icon: FacebookIcon },
  { href: site.social.yelp, label: "Level-Up Hair Salon reviews on Yelp", Icon: YelpIcon },
];

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="grid h-11 w-11 place-items-center transition-colors duration-300 hover:text-gold"
        >
          <Icon className="h-[18px] w-[18px]" />
        </a>
      ))}
    </div>
  );
}
