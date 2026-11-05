"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { changePassword } from "@/lib/admin/client";

const fieldClass =
  "w-full rounded-lg border border-ink/20 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-teal-deep";
const labelClass = "block text-xs uppercase tracking-wider text-muted mb-1.5";

export default function AccountPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setDone(false);
    if (next !== confirm) {
      setError("The new passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      await changePassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't change the password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm space-y-6">
      <h1 className="text-xl font-light">Change password</h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="current" className={labelClass}>Current password</label>
          <input id="current" type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="next" className={labelClass}>New password</label>
          <input id="next" type="password" autoComplete="new-password" required minLength={10} value={next} onChange={(e) => setNext(e.target.value)} className={fieldClass} />
          <p className="mt-1.5 text-xs text-muted">At least 10 characters.</p>
        </div>
        <div>
          <label htmlFor="confirm" className={labelClass}>Confirm new password</label>
          <input id="confirm" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={fieldClass} />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-700 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
        )}
        {done && (
          <p role="status" className="text-sm text-teal-deep bg-teal/10 border border-teal/20 rounded-lg px-3 py-2">
            Password changed. Use it the next time you sign in.
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-night text-bone text-sm font-medium hover:bg-abyss transition-colors disabled:opacity-60"
        >
          {busy && <Loader2 size={14} className="animate-spin" />}
          Change password
        </button>
      </form>
    </div>
  );
}
