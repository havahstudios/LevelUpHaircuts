import type { Service } from "@/lib/booking/types";
import { formatPrice } from "@/lib/booking/types";
import { getSupabaseAuth } from "@/lib/supabase/auth";
import AdminForm from "../AdminForm";
import { cardClass, inputClass, labelClass } from "../admin-styles";
import { saveServiceAction } from "../setup-actions";

// Services, lengths and prices. Changes show on the website straight away.
export default async function ServicesAdminPage() {
  const { data } = await (await getSupabaseAuth()).from("services").select("*").order("sort");
  const services = (data ?? []) as Service[];

  return (
    <div className="max-w-[900px]">
      <h1 className="text-[30px] md:text-[38px]">Services &amp; prices</h1>
      <p className="mt-2">Leave the price empty to show &ldquo;to confirm&rdquo; on the website. Untick &ldquo;Bookable&rdquo; to hide a service.</p>

      <div className="mt-8 space-y-4">
        {services.map((s) => (
          <details key={s.id} className={cardClass}>
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
              <span className="text-[17px] font-bold text-ink">
                {s.name} {!s.active && <span className="ml-2 text-[12px] font-bold uppercase text-muted">Hidden</span>}
              </span>
              <span className="text-[15px]">
                {s.duration_minutes} min · {formatPrice(s)}
              </span>
            </summary>
            <ServiceFields service={s} />
          </details>
        ))}
      </div>

      <div className={`${cardClass} mt-8`}>
        <h2 className="text-[24px]">Add a service</h2>
        <ServiceFields />
      </div>
    </div>
  );
}

function ServiceFields({ service }: { service?: Service }) {
  return (
    <AdminForm action={saveServiceAction} className="mt-5" submitLabel={service ? "Save" : "Add service"}>
      <input type="hidden" name="id" value={service?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className={labelClass}>Name</span>
          <input name="name" defaultValue={service?.name} required className={`${inputClass} mt-1`} />
        </label>
        <label>
          <span className={labelClass}>Group</span>
          <input name="category" defaultValue={service?.category ?? "Cut & colour"} className={`${inputClass} mt-1`} />
        </label>
        <label>
          <span className={labelClass}>Length (minutes)</span>
          <input name="duration_minutes" type="number" min={5} max={600} step={5} defaultValue={service?.duration_minutes ?? 45} required className={`${inputClass} mt-1`} />
        </label>
        <label>
          <span className={labelClass}>Price in $ (empty = to confirm)</span>
          <input name="price" inputMode="decimal" defaultValue={service?.price_cents != null ? String(service.price_cents / 100) : ""} className={`${inputClass} mt-1`} />
        </label>
        <label>
          <span className={labelClass}>Order on the page</span>
          <input name="sort" type="number" defaultValue={service?.sort ?? 0} className={`${inputClass} mt-1`} />
        </label>
        <label className="sm:col-span-2">
          <span className={labelClass}>Short description</span>
          <input name="description" defaultValue={service?.description} className={`${inputClass} mt-1`} />
        </label>
        <label className="flex items-center gap-2 text-[15px]">
          <input type="checkbox" name="price_from" defaultChecked={service?.price_from} className="h-4 w-4 accent-[#141210]" /> Show as &ldquo;from&rdquo; price
        </label>
        <label className="flex items-center gap-2 text-[15px]">
          <input type="checkbox" name="active" defaultChecked={service?.active ?? true} className="h-4 w-4 accent-[#141210]" /> Bookable
        </label>
      </div>
    </AdminForm>
  );
}
