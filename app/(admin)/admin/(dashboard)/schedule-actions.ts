"use server";

import { revalidatePath } from "next/cache";
import { createStaffBooking, type CreateResult } from "@/lib/booking/bookings";
import { addTimeOff, removeTimeOff, searchClients, setBookingStatus, updateBooking, type ActionResult } from "@/lib/booking/staff";
import type { BookingSource, BookingStatus } from "@/lib/booking/types";
import { getSupabaseAuth, requireStaff } from "@/lib/supabase/auth";

// Thin wrappers: check the person is staff, call the booking code, refresh the schedule.

type BookingForm = {
  id?: string;
  serviceId: string;
  stylistId: string;
  day: string;
  time: string;
  source: BookingSource;
  note: string;
  client: { name: string; phone: string; email: string };
};

export async function saveBookingAction(input: BookingForm): Promise<CreateResult | ActionResult> {
  console.log("[admin] save booking start", input.id ? "edit" : "new");
  const staff = await requireStaff();
  const supabase = await getSupabaseAuth();
  const result = input.id
    ? await updateBooking(supabase, { ...input, id: input.id })
    : await createStaffBooking(supabase, { ...input, createdBy: staff.userId });
  revalidatePath("/admin");
  console.log("[admin] save booking end", result.ok ? "ok" : "failed");
  return result;
}

export async function setStatusAction(id: string, status: BookingStatus): Promise<ActionResult> {
  await requireStaff();
  const result = await setBookingStatus(await getSupabaseAuth(), id, status);
  revalidatePath("/admin");
  return result;
}

export async function addTimeOffAction(input: { stylistId: string; day: string; from: string; to: string; reason: string }): Promise<ActionResult> {
  await requireStaff();
  const result = await addTimeOff(await getSupabaseAuth(), input);
  revalidatePath("/admin");
  return result;
}

export async function removeTimeOffAction(id: string): Promise<ActionResult> {
  await requireStaff();
  const result = await removeTimeOff(await getSupabaseAuth(), id);
  revalidatePath("/admin");
  return result;
}

export async function searchClientsAction(q: string) {
  await requireStaff();
  return searchClients(await getSupabaseAuth(), q);
}
