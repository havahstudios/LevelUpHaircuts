import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/booking/staff";

// Staff accounts. Only called after requireOwner(), because creating a login
// needs the service role key.

export async function addStaffAccount(input: { name: string; email: string; password: string; role: string }): Promise<ActionResult> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim().slice(0, 60);
  const role = input.role === "owner" ? "owner" : "staff";
  if (name.length < 2) return { ok: false, message: "Please enter their name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Please enter a valid email." };
  if (input.password.length < 10) return { ok: false, message: "The starting password needs at least 10 characters." };

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.admin.createUser({ email, password: input.password, email_confirm: true });
  if (error) return { ok: false, message: error.message.includes("already") ? "That email already has an account." : error.message };

  const { error: staffError } = await admin.from("staff").insert({ user_id: data.user.id, name, role });
  if (staffError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { ok: false, message: staffError.message };
  }
  return { ok: true };
}

export async function removeStaffAccount(userId: string, byUserId: string): Promise<ActionResult> {
  if (userId === byUserId) return { ok: false, message: "You can't remove your own account." };
  const { error } = await getSupabaseAdmin().auth.admin.deleteUser(userId);
  return error ? { ok: false, message: error.message } : { ok: true };
}
