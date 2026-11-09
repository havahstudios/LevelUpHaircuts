import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-side client with the public (anon) key and no login. Row Level
 * Security limits it to what any visitor may read: active services,
 * stylists and opening hours.
 */
export function getSupabasePublic() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}
