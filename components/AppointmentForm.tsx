"use client";

import { useState, type FormEvent } from "react";
import SectionHeading from "@/components/SectionHeading";
import SwitchText from "@/components/SwitchText";
import { ArrowIcon } from "@/components/Icons";
import { serviceOptions, type AppointmentRequest } from "@/lib/appointments";
import { site } from "@/lib/site";

type Errors = Partial<Record<keyof AppointmentRequest, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full border-b border-line bg-transparent py-4 text-[16px] text-ink outline-none transition-colors duration-300 placeholder:text-muted focus:border-gold";

// Appointment request form. Posts to /api/appointment and shows a clear
// success or error message.
export default function AppointmentForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setErrors({});
    setMessage("");

    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("sent");
        form.reset();
        return;
      }
      setErrors(json.errors ?? {});
      setMessage(json.message ?? "Please check the highlighted fields.");
      setStatus("error");
    } catch {
      setMessage("We could not send your request. Check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <section id="book" className="bg-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-14 px-4 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div>
          <SectionHeading before="Request an" underline="appointment" />
          <div>
            <p className="mt-6 max-w-[380px]">
              Send us a day that works and what you would like done. We will get back to you to confirm a time.
            </p>
            <p className="mt-8 text-[13px] font-bold uppercase tracking-[0.2em] text-ink">Prefer to call?</p>
            <p className="mt-1 font-display text-[28px] text-ink">{site.phone}</p>
          </div>
        </div>

        <div>
          {status === "sent" ? (
            <div role="status" className="rounded-[6px] border border-line bg-white p-10">
              <p className="font-display text-[32px] text-ink">Thank you.</p>
              <p className="mt-3">Your request is in. We will be in touch to confirm your appointment.</p>
              <button type="button" onClick={() => setStatus("idle")} className="mt-6 font-bold text-ink underline decoration-gold underline-offset-4">
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              <Field label="Your name" error={errors.name}>
                <input name="name" autoComplete="name" required placeholder="Your name*" className={field} />
              </Field>
              <Field label="Your email address" error={errors.email}>
                <input name="email" type="email" autoComplete="email" required placeholder="Your email address*" className={field} />
              </Field>
              <Field label="Phone number" error={errors.phone}>
                <input name="phone" type="tel" autoComplete="tel" placeholder="Phone number" className={field} />
              </Field>
              <Field label="Preferred date" error={errors.date}>
                <input name="date" type="date" required className={field} />
              </Field>
              <Field label="Service" error={errors.service} wide>
                <select name="service" required defaultValue="" className={`${field} cursor-pointer`}>
                  <option value="" disabled>
                    Select a service*
                  </option>
                  {serviceOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Your message" wide>
                <textarea name="message" rows={3} placeholder="Anything we should know?" className={`${field} resize-none`} />
              </Field>

              <div className="mt-6 flex flex-wrap items-center gap-6 sm:col-span-2">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex items-center gap-3 rounded-[4px] bg-ink px-8 py-4 text-[14px] font-bold text-white disabled:opacity-60"
                >
                  {status === "sending" ? "Sending..." : <SwitchText>Request appointment</SwitchText>}
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <p className="max-w-[320px] text-[13px] leading-[1.6]">We only use your details to arrange your appointment.</p>
              </div>
              {status === "error" && message && (
                <p role="alert" className="text-[15px] font-bold text-[#a3341f] sm:col-span-2">
                  {message}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
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
