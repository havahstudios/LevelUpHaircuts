import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Supabase client tied to the visitor's login cookies. Everything it does
 * runs under Row Level Security as that user, so staff see staff data and
 * nobody else sees anything private.
 */
export async function getSupabaseAuth() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server components cannot set cookies; proxy.ts refreshes the session instead.
        }
      },
    },
  });
}

export type StaffMember = { userId: string; email: string; name: string; role: "owner" | "staff" };

/** The logged-in staff member, or null if logged out or not on the staff list. */
export async function getStaff(): Promise<StaffMember | null> {
  const supabase = await getSupabaseAuth();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data } = await supabase.from("staff").select("name, role").eq("user_id", auth.user.id).maybeSingle();
  if (!data) return null;
  return { userId: auth.user.id, email: auth.user.email ?? "", name: data.name, role: data.role };
}

/** Use at the top of every admin page and action: sends non-staff to the login page. */
export async function requireStaff(): Promise<StaffMember> {
  const staff = await getStaff();
  if (!staff) redirect("/admin/login");
  return staff;
}

export async function requireOwner(): Promise<StaffMember> {
  const staff = await requireStaff();
  if (staff.role !== "owner") redirect("/admin");
  return staff;
}
