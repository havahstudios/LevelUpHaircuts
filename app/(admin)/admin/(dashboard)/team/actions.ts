"use server";

import { revalidatePath } from "next/cache";
import { addStaffAccount, removeStaffAccount } from "@/lib/booking/team";
import { getSupabaseAuth, requireOwner, requireStaff } from "@/lib/supabase/auth";
import type { FormState } from "../setup-actions";

export async function addStaffAction(_prev: FormState, form: FormData): Promise<FormState> {
  console.log("[admin] add staff start");
  await requireOwner();
  const result = await addStaffAccount({
    name: String(form.get("name") ?? ""),
    email: String(form.get("email") ?? ""),
    password: String(form.get("password") ?? ""),
    role: String(form.get("role") ?? "staff"),
  });
  revalidatePath("/admin/team");
  console.log("[admin] add staff end", result.ok);
  return result.ok ? { ok: true, message: "Added. Give them the email and starting password." } : { ok: false, message: result.message };
}

export async function removeStaffAction(userId: string) {
  const owner = await requireOwner();
  await removeStaffAccount(userId, owner.userId);
  revalidatePath("/admin/team");
}

export async function changePasswordAction(_prev: FormState, form: FormData): Promise<FormState> {
  await requireStaff();
  const password = String(form.get("password") ?? "");
  if (password.length < 10) return { ok: false, message: "Use at least 10 characters." };
  if (password !== String(form.get("confirm") ?? "")) return { ok: false, message: "The two passwords don't match." };
  const { error } = await (await getSupabaseAuth()).auth.updateUser({ password });
  return error ? { ok: false, message: error.message } : { ok: true, message: "Password changed." };
}
