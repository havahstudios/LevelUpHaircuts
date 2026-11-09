"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "../auth-actions";

const input =
  "w-full border-b border-white/20 bg-transparent py-4 text-center text-[16px] text-white outline-none placeholder:text-white/40 focus:border-gold";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, { message: "" });

  return (
    <form action={action} className="mt-6 space-y-2">
      <label className="block">
        <span className="sr-only">Email</span>
        <input name="email" type="email" autoComplete="email" placeholder="Email" required className={input} />
      </label>
      <label className="block">
        <span className="sr-only">Password</span>
        <input name="password" type="password" autoComplete="current-password" placeholder="Password" required className={input} />
      </label>
      <button type="submit" disabled={pending} className="!mt-8 w-full rounded-[4px] bg-gold py-4 text-[14px] font-bold text-ink disabled:opacity-60">
        {pending ? "Signing in..." : "Sign in"}
      </button>
      {state.message && (
        <p role="alert" className="pt-3 text-[14px] font-bold text-[#f08a73]">
          {state.message}
        </p>
      )}
    </form>
  );
}
