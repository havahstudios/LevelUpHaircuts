import Link from "next/link";
import { formatWhen, isUpcoming } from "@/lib/booking/time";
import { getSupabaseAuth } from "@/lib/supabase/auth";
import { cardClass, inputClass } from "../admin-styles";

type Row = {
  id: string;
  name: string;
  phone: string;
  email: string;
  bookings: { starts_at: string; status: string; services: { name: string } | null }[];
};

// Searchable client list with each person's visits.
export default async function ClientsAdminPage({ searchParams }: PageProps<"/admin/clients">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().replace(/[%,()]/g, "") : "";
  let query = (await getSupabaseAuth())
    .from("clients")
    .select("id, name, phone, email, bookings(starts_at, status, services(name))")
    .order("name")
    .limit(100);
  if (q) {
    const digits = q.replace(/\D/g, "");
    query = query.or([`name.ilike.%${q}%`, `email.ilike.%${q}%`, ...(digits.length >= 3 ? [`phone_digits.like.%${digits}%`] : [])].join(","));
  }
  const { data } = await query;
  const clients = (data ?? []) as unknown as Row[];

  return (
    <div className="max-w-[900px]">
      <h1 className="text-[30px] md:text-[38px]">Clients</h1>
      <form className="mt-6 flex gap-2" action="/admin/clients">
        <input name="q" defaultValue={q} placeholder="Search name, phone or email" className={inputClass} />
        <button type="submit" className="h-11 rounded-[4px] bg-ink px-5 text-[14px] font-bold text-white">
          Search
        </button>
      </form>
      {q && (
        <Link href="/admin/clients" className="mt-2 inline-block text-[14px] underline">
          Clear search
        </Link>
      )}

      <div className="mt-6 space-y-3">
        {clients.length === 0 && <p>No clients found.</p>}
        {clients.map((c) => {
          const visits = [...c.bookings].sort((a, b) => b.starts_at.localeCompare(a.starts_at));
          const next = visits.filter((v) => v.status === "booked" && isUpcoming(v.starts_at)).at(-1);
          return (
            <details key={c.id} className={cardClass}>
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2">
                <span>
                  <span className="text-[17px] font-bold text-ink">{c.name}</span>
                  <span className="ml-3 text-[14px]">
                    {c.phone} {c.email && `· ${c.email}`}
                  </span>
                </span>
                <span className="text-[13px]">
                  {visits.length} booking{visits.length === 1 ? "" : "s"}
                  {next && ` · next ${formatWhen(next.starts_at)}`}
                </span>
              </summary>
              <ul className="mt-4 divide-y divide-line text-[14px]">
                {visits.map((v, i) => (
                  <li key={i} className="flex justify-between gap-4 py-2">
                    <span>
                      {formatWhen(v.starts_at)} · {v.services?.name}
                    </span>
                    <span className="font-bold capitalize text-ink">{v.status.replace("_", "-")}</span>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </div>
  );
}
