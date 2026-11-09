import type { Metadata } from "next";
import { requireStaff } from "@/lib/supabase/auth";
import AdminNav from "./AdminNav";

export const metadata: Metadata = { title: "Dashboard | Level-Up", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Every dashboard page: staff only, with the side navigation.
export default async function DashboardLayout({ children }: LayoutProps<"/admin">) {
  const staff = await requireStaff();
  return (
    <div className="min-h-svh bg-paper lg:grid lg:grid-cols-[230px_1fr]">
      <AdminNav name={staff.name || staff.email} isOwner={staff.role === "owner"} />
      <main className="min-w-0 px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
