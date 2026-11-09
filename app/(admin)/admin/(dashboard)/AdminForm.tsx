"use client";

import { useActionState, type ReactNode } from "react";
import type { FormState } from "./setup-actions";

// A form wired to a server action, with a save button and a saved / error message.
export default function AdminForm({
  action,
  children,
  submitLabel = "Save",
  className = "",
}: {
  action: (prev: FormState, form: FormData) => Promise<FormState>;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, { ok: false, message: "" });
  return (
    <form action={formAction} className={className}>
      {children}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="h-11 rounded-[4px] bg-ink px-6 text-[14px] font-bold text-white disabled:opacity-60">
          {pending ? "Saving..." : submitLabel}
        </button>
        {state.message && (
          <p role={state.ok ? "status" : "alert"} className={`text-[14px] font-bold ${state.ok ? "text-[#3e6b4c]" : "text-[#a3341f]"}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
