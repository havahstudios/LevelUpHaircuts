// Thin line icons drawn for this site. All use currentColor.

type P = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 48 48",
  "aria-hidden": true,
};

export function ScissorsIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <circle cx="13" cy="34" r="6" />
      <circle cx="13" cy="14" r="6" />
      <path d="M18 17 40 34M18 31 40 14" />
      <circle cx="24" cy="24" r="1" />
    </svg>
  );
}

export function ColorIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M14 6h8v14l-4 4-4-4z" />
      <path d="M18 24v18" />
      <path d="M30 18c0 0 7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13z" />
    </svg>
  );
}

export function DryerIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M8 14h20a8 8 0 0 1 0 16h-6l-2 12h-6l1-12H8a4 4 0 0 1-4-4v-8a4 4 0 0 1 4-4z" />
      <circle cx="28" cy="22" r="3" />
      <path d="M40 17h4M40 22h6M40 27h4" />
    </svg>
  );
}

export function CurlIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M16 6c-6 4-6 10 0 13s6 9 0 13-6 9 0 10" />
      <path d="M26 6c-6 4-6 10 0 13s6 9 0 13-6 9 0 10" />
      <path d="M36 6c-6 4-6 10 0 13s6 9 0 13-6 9 0 10" />
    </svg>
  );
}

export function ArrowIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CalendarIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" className={className} aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function PinIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function InstagramIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z" />
    </svg>
  );
}

export function YelpIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M11 3.2c0-.6-.5-1-1.1-.9-1.6.3-3.9 1-5 1.6-.5.3-.7.9-.4 1.4l4.6 7.9c.6 1 2 .6 2-.5zM10 15.6c.8-.3.8-1.4 0-1.7l-5.3-1.8c-.6-.2-1.2.2-1.3.8-.2 1.2 0 2.9.4 4 .2.6.8.8 1.4.6zM11.4 17.2c-.5-.7-1.6-.4-1.6.5l-.1 5.4c0 .6.6 1.1 1.2 1 1.1-.2 2.6-.9 3.5-1.6.5-.4.5-1 .2-1.5zM20.3 15.2l-5.2-1.6c-.9-.3-1.5.8-1 1.5l3.1 4.4c.4.5 1.1.5 1.5.1.8-.8 1.7-2.2 2.1-3.3.2-.5-.1-1-.5-1.1zM15 12.2l5.3-1.5c.6-.2.9-.8.6-1.4-.5-1-1.6-2.4-2.6-3.1-.5-.4-1.2-.2-1.5.3l-3 4.5c-.5.8.3 1.7 1.2 1.2z" />
    </svg>
  );
}
