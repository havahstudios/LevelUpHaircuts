import "server-only";
import { getSupabasePublic } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { SalonHours, Service, Settings, Stylist } from "@/lib/booking/types";

export type Catalog = {
  services: Service[];
  stylists: Stylist[];
  stylistServices: { stylist_id: string; service_id: string }[];
  salonHours: SalonHours[];
  closedDates: string[];
  settings: Settings;
};

/** What the booking page and the Services page show. Null if Supabase is not set up yet. */
export async function getCatalog(): Promise<Catalog | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabasePublic();
  const today = new Date().toISOString().slice(0, 10);
  const [services, stylists, links, hours, closed, settings] = await Promise.all([
    supabase.from("services").select("*").eq("active", true).order("sort"),
    supabase.from("stylists").select("*").eq("active", true).order("sort"),
    supabase.from("stylist_services").select("stylist_id, service_id"),
    supabase.from("salon_hours").select("*").order("weekday"),
    supabase.from("closed_dates").select("day").gte("day", today),
    supabase.from("settings").select("min_notice_minutes, max_days_ahead, slot_minutes, notify_email").eq("id", 1).single(),
  ]);
  const failed = [services, stylists, links, hours, closed, settings].find((r) => r.error);
  if (failed?.error) {
    console.error("[catalog] load failed", failed.error.message);
    return null;
  }
  return {
    services: services.data as Service[],
    stylists: stylists.data as Stylist[],
    stylistServices: links.data ?? [],
    salonHours: hours.data as SalonHours[],
    closedDates: (closed.data ?? []).map((d) => d.day),
    settings: { ...(settings.data as Settings), notify_email: null },
  };
}
