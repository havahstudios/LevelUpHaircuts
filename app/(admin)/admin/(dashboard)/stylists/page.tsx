import type { Service, Stylist, StylistHours } from "@/lib/booking/types";
import { getSupabaseAuth } from "@/lib/supabase/auth";
import AdminForm from "../AdminForm";
import { cardClass, inputClass, labelClass, weekdays } from "../admin-styles";
import { saveStylistAction } from "../setup-actions";

// Stylists: name, working days and hours, and which services they offer.
export default async function StylistsAdminPage() {
  const supabase = await getSupabaseAuth();
  const [stylists, services, hours, links] = await Promise.all([
    supabase.from("stylists").select("*").order("sort"),
    supabase.from("services").select("*").order("sort"),
    supabase.from("stylist_hours").select("*"),
    supabase.from("stylist_services").select("stylist_id, service_id"),
  ]);

  const all = { services: (services.data ?? []) as Service[], hours: (hours.data ?? []) as StylistHours[], links: links.data ?? [] };

  return (
    <div className="max-w-[900px]">
      <h1 className="text-[30px] md:text-[38px]">Stylists</h1>
      <p className="mt-2">Working hours can only fall inside the salon&apos;s opening hours. Untick &ldquo;Taking bookings&rdquo; to hide someone.</p>
      <div className="mt-8 space-y-4">
        {((stylists.data ?? []) as Stylist[]).map((s) => (
          <details key={s.id} className={cardClass}>
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span className="text-[17px] font-bold text-ink">{s.name}</span>
              {!s.active && <span className="text-[12px] font-bold uppercase text-muted">Not taking bookings</span>}
            </summary>
            <StylistFields stylist={s} {...all} />
          </details>
        ))}
      </div>
      <div className={`${cardClass} mt-8`}>
        <h2 className="text-[24px]">Add a stylist</h2>
        <StylistFields {...all} />
      </div>
    </div>
  );
}

function StylistFields({
  stylist,
  services,
  hours,
  links,
}: {
  stylist?: Stylist;
  services: Service[];
  hours: StylistHours[];
  links: { stylist_id: string; service_id: string }[];
}) {
  const own = (d: number) => hours.find((h) => h.stylist_id === stylist?.id && h.weekday === d);
  const offers = (id: string) => (stylist ? links.some((l) => l.stylist_id === stylist.id && l.service_id === id) : true);

  return (
    <AdminForm action={saveStylistAction} className="mt-5" submitLabel={stylist ? "Save" : "Add stylist"}>
      <input type="hidden" name="id" value={stylist?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="sm:col-span-2">
          <span className={labelClass}>Name</span>
          <input name="name" defaultValue={stylist?.name} required className={`${inputClass} mt-1`} />
        </label>
        <label>
          <span className={labelClass}>Order</span>
          <input name="sort" type="number" defaultValue={stylist?.sort ?? 0} className={`${inputClass} mt-1`} />
        </label>
        <label className="flex items-center gap-2 text-[15px] sm:col-span-3">
          <input type="checkbox" name="active" defaultChecked={stylist?.active ?? true} className="h-4 w-4 accent-[#141210]" /> Taking bookings
        </label>
      </div>

      <p className={`${labelClass} mt-6`}>Working hours</p>
      <div className="mt-2 divide-y divide-line rounded-[4px] border border-line">
        {weekdays.map((name, d) => {
          const h = own(d);
          const off = stylist ? (h?.off ?? true) : d === 0;
          return (
            <div key={d} className="grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-2 sm:grid-cols-[140px_1fr_1fr_auto]">
              <span className="font-bold text-ink">{name}</span>
              <label className="flex items-center gap-2 text-[14px] sm:order-last">
                <input type="checkbox" name={`off_${d}`} defaultChecked={off} className="h-4 w-4 accent-[#141210]" /> Off
              </label>
              <input type="time" name={`starts_${d}`} defaultValue={h?.starts?.slice(0, 5) ?? "09:00"} step={900} className={inputClass} aria-label={`${name} start`} />
              <input type="time" name={`ends_${d}`} defaultValue={h?.ends?.slice(0, 5) ?? "18:00"} step={900} className={inputClass} aria-label={`${name} end`} />
            </div>
          );
        })}
      </div>

      <p className={`${labelClass} mt-6`}>Services offered</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {services.map((s) => (
          <label key={s.id} className="flex items-center gap-2 text-[15px]">
            <input type="checkbox" name="services" value={s.id} defaultChecked={offers(s.id)} className="h-4 w-4 accent-[#141210]" /> {s.name}
          </label>
        ))}
      </div>
    </AdminForm>
  );
}
