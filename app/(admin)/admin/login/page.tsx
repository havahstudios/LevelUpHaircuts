import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import { getStaff, getSupabaseAuth } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { signOut } from "../auth-actions";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Staff login | Level-Up", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const configured = isSupabaseConfigured();
  let notStaffEmail: string | null = null;
  if (configured) {
    if (await getStaff()) redirect("/admin");
    const { data } = await (await getSupabaseAuth()).auth.getUser();
    notStaffEmail = data.user?.email ?? null;
  }

  return (
    <main className="grid min-h-svh place-items-center bg-cream px-4">
      <div className="w-full max-w-[380px] text-center">
        <Logo />
        <p className="mt-10 text-[13px] font-bold uppercase tracking-[0.25em] text-gold-deep">Staff login</p>
        {!configured ? (
          <p className="mt-6">The booking database is not connected yet.</p>
        ) : notStaffEmail ? (
          <div className="mt-6">
            <p>{notStaffEmail} is not on the staff list. Ask the owner to add you.</p>
            <form action={signOut} className="mt-6">
              <button type="submit" className="rounded-[4px] border border-ink px-6 py-3 text-[14px] font-bold text-ink">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
