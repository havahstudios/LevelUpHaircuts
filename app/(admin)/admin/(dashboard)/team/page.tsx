import { getSupabaseAuth, requireStaff } from "@/lib/supabase/auth";
import AdminForm from "../AdminForm";
import { cardClass, inputClass, labelClass } from "../admin-styles";
import { addStaffAction, changePasswordAction, removeStaffAction } from "./actions";

export default async function TeamPage() {
  const me = await requireStaff();
  const { data } = await (await getSupabaseAuth()).from("staff").select("user_id, name, role").order("created_at");
  const isOwner = me.role === "owner";

  return (
    <div className="max-w-[760px] space-y-8">
      <h1 className="text-[30px] md:text-[38px]">Team &amp; password</h1>

      <div className={cardClass}>
        <h2 className="text-[24px]">Staff logins</h2>
        <ul className="mt-4 divide-y divide-line">
          {(data ?? []).map((s) => (
            <li key={s.user_id} className="flex items-center justify-between gap-4 py-3">
              <span>
                <strong className="text-ink">{s.name || "Unnamed"}</strong>
                <span className="ml-2 text-[13px] uppercase tracking-[0.1em]">{s.role}</span>
                {s.user_id === me.userId && <span className="ml-2 text-[13px]">(you)</span>}
              </span>
              {isOwner && s.user_id !== me.userId && (
                <form action={removeStaffAction.bind(null, s.user_id)}>
                  <button type="submit" className="text-[14px] font-bold text-[#a3341f]">
                    Remove
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>

        {isOwner ? (
          <AdminForm action={addStaffAction} submitLabel="Add staff login" className="mt-6 border-t border-line pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className={labelClass}>Name</span>
                <input name="name" required className={`${inputClass} mt-1`} />
              </label>
              <label>
                <span className={labelClass}>Email</span>
                <input name="email" type="email" required className={`${inputClass} mt-1`} />
              </label>
              <label>
                <span className={labelClass}>Starting password (10+ characters)</span>
                <input name="password" type="text" minLength={10} required autoComplete="off" className={`${inputClass} mt-1`} />
              </label>
              <label>
                <span className={labelClass}>Role</span>
                <select name="role" defaultValue="staff" className={`${inputClass} mt-1`}>
                  <option value="staff">Staff</option>
                  <option value="owner">Owner (can manage logins)</option>
                </select>
              </label>
            </div>
          </AdminForm>
        ) : (
          <p className="mt-4 text-[14px]">Only the owner can add or remove logins.</p>
        )}
      </div>

      <AdminForm action={changePasswordAction} submitLabel="Change my password" className={cardClass}>
        <h2 className="text-[24px]">Change my password</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>
            <span className={labelClass}>New password</span>
            <input name="password" type="password" minLength={10} required autoComplete="new-password" className={`${inputClass} mt-1`} />
          </label>
          <label>
            <span className={labelClass}>Type it again</span>
            <input name="confirm" type="password" minLength={10} required autoComplete="new-password" className={`${inputClass} mt-1`} />
          </label>
        </div>
      </AdminForm>
    </div>
  );
}
