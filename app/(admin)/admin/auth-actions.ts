"use server";

import { redirect } from "next/navigation";
import { getSupabaseAuth } from "@/lib/supabase/auth";

export type LoginState = { message: string };

export async function signIn(_prev: LoginState, form: FormData): Promise<LoginState> {
  console.log("[admin] sign in start");
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { message: "Enter your email and password." };

  const supabase = await getSupabaseAuth();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.log("[admin] sign in end: failed");
    return { message: "That email and password don't match." };
  }
  console.log("[admin] sign in end: ok");
  redirect("/admin");
}

export async function signOut() {
  const supabase = await getSupabaseAuth();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
