// Text wordmark standing in for the real logo until the salon sends the file.
export default function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span
        className={`font-display text-[26px] tracking-[0.02em] md:text-[30px] ${light ? "text-white" : "text-ink"}`}
      >
        LEVEL<span className="text-gold">-</span>UP
      </span>
      <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.42em] text-gold">Hair Salon</span>
    </span>
  );
}
