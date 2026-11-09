"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { signOut } from "../auth-actions";

const links = [
  { href: "/admin", label: "Schedule" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/services", label: "Services & prices" },
  { href: "/admin/stylists", label: "Stylists" },
  { href: "/admin/hours", label: "Hours & settings" },
  { href: "/admin/team", label: "Team & password" },
];

export default function AdminNav({ name, isOwner }: { name: string; isOwner: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className="bg-ink text-white/80 lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
      <div className="flex items-center justify-between px-5 py-4 lg:block lg:px-6 lg:py-8">
        <Link href="/admin" aria-label="Schedule">
          <Logo light />
        </Link>
        <button type="button" onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center lg:hidden" aria-label="Menu" aria-expanded={open}>
          <span className="block h-px w-6 bg-white shadow-[0_-7px_0_white,0_7px_0_white]" />
        </button>
      </div>
      <nav className={`${open ? "block" : "hidden"} px-3 pb-4 lg:block lg:flex-1`} aria-label="Dashboard">
        {links.map((l) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-[4px] px-3 py-2.5 text-[15px] ${active ? "bg-white/10 font-bold text-gold" : "hover:text-white"}`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className={`${open ? "block" : "hidden"} border-t border-white/10 px-6 py-5 text-[13px] lg:block`}>
        <p className="truncate text-white">{name}</p>
        <p className="text-white/50">{isOwner ? "Owner" : "Staff"}</p>
        <div className="mt-3 flex gap-4">
          <Link href="/" className="hover:text-gold">
            View site
          </Link>
          <form action={signOut}>
            <button type="submit" className="hover:text-gold">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
