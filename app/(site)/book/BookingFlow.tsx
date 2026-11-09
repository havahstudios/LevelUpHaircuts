"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowIcon } from "@/components/Icons";
import SwitchText from "@/components/SwitchText";
import type { Catalog } from "@/lib/booking/catalog";
import { addDays, formatDay, formatWhen, laDay, weekdayOf } from "@/lib/booking/time";
import { formatDuration, formatPrice, type Service } from "@/lib/booking/types";

type Slot = { label: string; startsAt: string };
type Done = { startsAt: string; stylistName: string; serviceName: string; manageCode: string };
type Step = 1 | 2 | 3 | 4;

const field =
  "w-full border-b border-line bg-transparent py-4 text-[16px] text-ink outline-none transition-colors duration-300 placeholder:text-muted focus:border-gold";
const steps = ["Service", "Stylist", "Day & time", "Your details"];

// The four booking steps. Free times come from /api/availability each time
// the day changes, so they always reflect the live schedule.
export default function BookingFlow({ catalog }: { catalog: Catalog }) {
  const [step, setStep] = useState<Step>(1);
  const [service, setService] = useState<Service | null>(null);
  const [stylistId, setStylistId] = useState<string>("any");
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  const stylistsForService = useMemo(() => {
    if (!service) return [];
    const ids = new Set(catalog.stylistServices.filter((l) => l.service_id === service.id).map((l) => l.stylist_id));
    return catalog.stylists.filter((s) => ids.has(s.id));
  }, [service, catalog]);

  const stylistName = stylistId === "any" ? "Any stylist" : catalog.stylists.find((s) => s.id === stylistId)?.name ?? "";

  if (done) return <Confirmation done={done} />;

  return (
    <div>
      <ol className="mb-12 grid grid-cols-4 gap-2" aria-label="Booking steps">
        {steps.map((label, i) => {
          const n = (i + 1) as Step;
          const reachable = n < step;
          return (
            <li key={label}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => setStep(n)}
                className={`w-full border-t-[3px] pt-3 text-left text-[12px] font-bold uppercase tracking-[0.15em] md:text-[13px] ${
                  n === step ? "border-gold text-ink" : n < step ? "border-ink text-ink hover:text-gold-deep" : "border-line text-muted"
                }`}
                aria-current={n === step ? "step" : undefined}
              >
                <span className="hidden sm:inline">{n}. </span>
                {label}
              </button>
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <ServiceStep
          services={catalog.services}
          selected={service?.id}
          onPick={(s) => {
            setService(s);
            setStylistId("any");
            setSlot(null);
            setStep(2);
          }}
        />
      )}

      {step === 2 && service && (
        <div>
          <StepTitle>Who would you like?</StepTitle>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[{ id: "any", name: "Any stylist", note: "First available" }, ...stylistsForService.map((s) => ({ id: s.id, name: s.name, note: "Stylist" }))].map(
              (s) => (
                <Choice
                  key={s.id}
                  selected={stylistId === s.id}
                  onClick={() => {
                    setStylistId(s.id);
                    setSlot(null);
                    setStep(3);
                  }}
                  title={s.name}
                  meta={s.note}
                />
              ),
            )}
          </div>
        </div>
      )}

      {step === 3 && service && (
        <DayTimeStep
          catalog={catalog}
          service={service}
          stylistId={stylistId}
          day={day}
          slot={slot}
          onDay={(d) => {
            setDay(d);
            setSlot(null);
          }}
          onSlot={(s) => {
            setSlot(s);
            setStep(4);
          }}
        />
      )}

      {step === 4 && service && slot && (
        <DetailsStep
          service={service}
          stylistId={stylistId}
          stylistName={stylistName}
          slot={slot}
          onTaken={() => {
            setSlot(null);
            setStep(3);
          }}
          onDone={setDone}
        />
      )}
    </div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[34px] leading-[1.1] md:text-[44px]">{children}</h2>;
}

function Choice({ selected, onClick, title, meta, side }: { selected: boolean; onClick: () => void; title: string; meta: string; side?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center justify-between gap-4 rounded-[6px] border bg-white px-6 py-5 text-left transition-colors duration-300 ${
        selected ? "border-gold" : "border-line hover:border-ink"
      }`}
    >
      <span>
        <span className="block text-[18px] font-bold text-ink">{title}</span>
        <span className="mt-1 block text-[15px]">{meta}</span>
      </span>
      {side && <span className="shrink-0 text-[15px] font-bold text-ink">{side}</span>}
    </button>
  );
}

function ServiceStep({ services, selected, onPick }: { services: Service[]; selected?: string; onPick: (s: Service) => void }) {
  const categories = [...new Set(services.map((s) => s.category))];
  return (
    <div>
      <StepTitle>What would you like?</StepTitle>
      {categories.map((cat) => (
        <div key={cat} className="mt-10">
          <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-gold-deep">{cat}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {services
              .filter((s) => s.category === cat)
              .map((s) => (
                <Choice
                  key={s.id}
                  selected={selected === s.id}
                  onClick={() => onPick(s)}
                  title={s.name}
                  meta={`${formatDuration(s.duration_minutes)}${s.description ? ` · ${s.description}` : ""}`}
                  side={formatPrice(s)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DayTimeStep({
  catalog,
  service,
  stylistId,
  day,
  slot,
  onDay,
  onSlot,
}: {
  catalog: Catalog;
  service: Service;
  stylistId: string;
  day: string | null;
  slot: Slot | null;
  onDay: (d: string) => void;
  onSlot: (s: Slot) => void;
}) {
  const today = laDay(new Date());
  const last = addDays(today, catalog.settings.max_days_ahead);
  const closedWeekdays = new Set(catalog.salonHours.filter((h) => h.closed).map((h) => h.weekday));
  const closedDates = new Set(catalog.closedDates);
  const isOpen = (d: string) => d >= today && d <= last && !closedWeekdays.has(weekdayOf(d)) && !closedDates.has(d);

  const [month, setMonth] = useState(today.slice(0, 7));
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!day) return;
    let cancelled = false;
    fetch(`/api/availability?service=${service.id}&stylist=${stylistId}&day=${day}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.ok) setSlots(json.slots);
        else setError(json.message ?? "Could not load times.");
      })
      .catch(() => !cancelled && setError("Could not load times. Check your connection."));
    return () => {
      cancelled = true;
    };
  }, [day, service.id, stylistId]);

  const [y, m] = month.split("-").map(Number);
  const first = `${month}-01`;
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lead = weekdayOf(first);
  const cells = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`)];
  const shiftMonth = (n: number) => {
    const d = new Date(Date.UTC(y, m - 1 + n, 1));
    setMonth(d.toISOString().slice(0, 7));
  };
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, 1)));

  return (
    <div>
      <StepTitle>When suits you?</StepTitle>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[6px] border border-line bg-white p-5 md:p-6">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => shiftMonth(-1)} disabled={month <= today.slice(0, 7)} className="grid h-11 w-11 place-items-center text-ink disabled:opacity-25" aria-label="Previous month">
              <ArrowIcon className="h-5 w-5 rotate-180" />
            </button>
            <p className="font-bold text-ink">{monthLabel}</p>
            <button type="button" onClick={() => shiftMonth(1)} disabled={month >= last.slice(0, 7)} className="grid h-11 w-11 place-items-center text-ink disabled:opacity-25" aria-label="Next month">
              <ArrowIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-7 text-center text-[12px] font-bold uppercase tracking-[0.1em] text-muted">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d} className="py-2">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) =>
              d ? (
                <button
                  key={d}
                  type="button"
                  disabled={!isOpen(d)}
                  onClick={() => {
                    setSlots(null);
                    setError("");
                    onDay(d);
                  }}
                  aria-label={formatDay(d)}
                  aria-pressed={d === day}
                  className={`aspect-square rounded-full text-[15px] transition-colors duration-200 ${
                    d === day ? "bg-ink text-white" : isOpen(d) ? "text-ink hover:bg-cream" : "text-line line-through"
                  }`}
                >
                  {Number(d.slice(8))}
                </button>
              ) : (
                <span key={`e${i}`} />
              ),
            )}
          </div>
        </div>

        <div>
          {!day && <p className="pt-2">Choose a day to see open times.</p>}
          {day && (
            <>
              <p className="font-bold text-ink">{formatDay(day)}</p>
              {error && (
                <p role="alert" className="mt-4 font-bold text-[#a3341f]">
                  {error}
                </p>
              )}
              {!error && !slots && <p className="mt-4">Loading times...</p>}
              {slots && slots.length === 0 && <p className="mt-4">No open times this day. Please try another day{stylistId !== "any" ? " or another stylist" : ""}.</p>}
              {slots && slots.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((s) => (
                    <button
                      key={s.startsAt}
                      type="button"
                      onClick={() => onSlot(s)}
                      className={`min-h-11 rounded-[4px] border text-[15px] font-bold transition-colors duration-200 ${
                        slot?.startsAt === s.startsAt ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailsStep({
  service,
  stylistId,
  stylistName,
  slot,
  onTaken,
  onDone,
}: {
  service: Service;
  stylistId: string;
  stylistName: string;
  slot: Slot;
  onTaken: () => void;
  onDone: (d: Done) => void;
}) {
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSending(true);
    setErrors({});
    setMessage("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          stylistId: stylistId === "any" ? null : stylistId,
          startsAt: slot.startsAt,
          note: form.get("note"),
          client: { name: form.get("name"), phone: form.get("phone"), email: form.get("email") },
        }),
      });
      const json = await res.json();
      if (json.ok) return onDone(json);
      if (json.reason === "taken") {
        alert(json.message);
        return onTaken();
      }
      setErrors(json.fields ?? {});
      setMessage(json.message ?? "Something went wrong. Please try again.");
    } catch {
      setMessage("We could not send your booking. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <StepTitle>Almost done</StepTitle>
        <dl className="mt-8 space-y-4 rounded-[6px] border border-line bg-white p-6 text-[15px]">
          <Row label="Service" value={`${service.name} · ${formatDuration(service.duration_minutes)}`} />
          <Row label="Price" value={formatPrice(service)} />
          <Row label="Stylist" value={stylistName} />
          <Row label="When" value={formatWhen(slot.startsAt)} />
        </dl>
      </div>
      <form onSubmit={submit} noValidate className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
        <Field label="Your name" error={errors.name} wide>
          <input name="name" autoComplete="name" placeholder="Your name*" className={field} />
        </Field>
        <Field label="Phone number" error={errors.phone}>
          <input name="phone" type="tel" autoComplete="tel" placeholder="Phone number*" className={field} />
        </Field>
        <Field label="Email address" error={errors.email}>
          <input name="email" type="email" autoComplete="email" placeholder="Email address*" className={field} />
        </Field>
        <Field label="Note for the salon" wide>
          <textarea name="note" rows={2} placeholder="Anything we should know? (optional)" className={`${field} resize-none`} />
        </Field>
        <div className="mt-6 sm:col-span-2">
          <button type="submit" disabled={sending} className="group inline-flex items-center gap-3 rounded-[4px] bg-ink px-8 py-4 text-[14px] font-bold text-white disabled:opacity-60">
            {sending ? "Booking..." : <SwitchText>Confirm booking</SwitchText>}
          </button>
          {message && (
            <p role="alert" className="mt-4 text-[15px] font-bold text-[#a3341f]">
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

function Confirmation({ done }: { done: Done }) {
  return (
    <div role="status" className="rounded-[6px] border border-line bg-white p-8 text-center md:p-14">
      <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-gold-deep">You&apos;re booked</p>
      <h2 className="mt-4 text-[38px] leading-[1.1] md:text-[52px]">See you soon</h2>
      <p className="mx-auto mt-6 max-w-[460px] text-[17px] text-ink">
        {done.serviceName} with {done.stylistName}
        <br />
        {formatWhen(done.startsAt)}
      </p>
      <p className="mx-auto mt-4 max-w-[460px]">Save this page. If you need to cancel, use the link below.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        <Link href={`/book/manage/${done.manageCode}`} className="font-bold text-ink underline decoration-gold underline-offset-4">
          View or cancel this booking
        </Link>
        <Link href="/" className="font-bold text-ink underline decoration-gold underline-offset-4">
          Back to home
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6">
      <dt>{label}</dt>
      <dd className="text-right font-bold text-ink">{value}</dd>
    </div>
  );
}

function Field({ label, error, wide = false, children }: { label: string; error?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="sr-only">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[13px] font-bold text-[#a3341f]">{error}</span>}
    </label>
  );
}
