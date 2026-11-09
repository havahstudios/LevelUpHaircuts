import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** True once the Supabase keys are in .env.local (or Vercel). */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/**
 * Server-only client with the service role key. It skips Row Level Security,
 * so it is used only after the server has checked the request itself:
 * public bookings, cancel links, and the owner adding staff accounts.
 * Never import this from a client component.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured. Add the keys to .env.local.");
  return createClient(url, key, { auth: { persistSession: false } });
}
