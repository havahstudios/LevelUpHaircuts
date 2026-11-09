// The "Built by Havah Studios" pill used across Havah Studios sites
// (same markup and hover lift as the Benny's Grill footer), in this site's colours.
export default function HavahCredit() {
  return (
    <a
      href="https://havahstudios.live/"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1 rounded-full border border-line bg-white/60 px-3.5 py-[5px] text-[11px] tracking-[0.08em] text-inherit no-underline"
    >
      <span className="pointer-events-none font-normal text-muted">Built by</span>
      <strong className="inline-block font-bold uppercase tracking-[0.1em] text-ink transition duration-200 ease-out group-hover:-translate-y-[3px] group-hover:text-gold-deep">
        Havah Studios
      </strong>
    </a>
  );
}
