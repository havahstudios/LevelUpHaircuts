"use server";

import { revalidatePath } from "next/cache";
import { addClosedDate, removeClosedDate, saveSalonHours, saveService, saveStylist } from "@/lib/booking/setup";
import type { ActionResult } from "@/lib/booking/staff";
import { getSupabaseAuth, requireStaff } from "@/lib/supabase/auth";

export type FormState = { ok: boolean; message: string };

// Public pages that show services, prices or hours are refreshed after a change.
function refreshPublic() {
  revalidatePath("/services");
  revalidatePath("/book");
  revalidatePath("/admin", "layout");
}

function toState(r: ActionResult, success: string): FormState {
  return r.ok ? { ok: true, message: success } : { ok: false, message: r.message };
}

export async function saveServiceAction(_prev: FormState, form: FormData): Promise<FormState> {
  console.log("[admin] save service start");
  await requireStaff();
  const result = await saveService(await getSupabaseAuth(), form);
  if (result.ok) refreshPublic();
  console.log("[admin] save service end", result.ok);
  return toState(result, "Saved.");
}

export async function saveStylistAction(_prev: FormState, form: FormData): Promise<FormState> {
  console.log("[admin] save stylist start");
  await requireStaff();
  const result = await saveStylist(await getSupabaseAuth(), form);
  if (result.ok) refreshPublic();
  console.log("[admin] save stylist end", result.ok);
  return toState(result, "Saved.");
}

export async function saveHoursAction(_prev: FormState, form: FormData): Promise<FormState> {
  console.log("[admin] save hours start");
  await requireStaff();
  const result = await saveSalonHours(await getSupabaseAuth(), form);
  if (result.ok) refreshPublic();
  console.log("[admin] save hours end", result.ok);
  return toState(result, "Saved.");
}

export async function addClosedDateAction(_prev: FormState, form: FormData): Promise<FormState> {
  await requireStaff();
  const result = await addClosedDate(await getSupabaseAuth(), String(form.get("day") ?? ""), String(form.get("reason") ?? ""));
  if (result.ok) refreshPublic();
  return toState(result, "Closed date added.");
}

export async function removeClosedDateAction(day: string) {
  await requireStaff();
  await removeClosedDate(await getSupabaseAuth(), day);
  refreshPublic();
}
