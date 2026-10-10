"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { UNAUTHORIZED_EVENT, getSessionUser, login } from "@/lib/admin/client";
import AdminNav from "@/components/admin/AdminNav";

const fieldClass =
  "w-full bg-ink/[0.05] border border-ink/25 rounded-lg px-3.5 py-3 text-[15px] text-ink focus:outline-none focus:border-teal transition-colors";

function LoginForm({ onSignedIn }: { onSignedIn: (user: string) => void }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Enter in either field submits the form. Values are read from the form itself (not React
  // state) so browser autofill and password managers are picked up even if no input event fired.
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      onSignedIn(await login(String(data.get("username") ?? ""), String(data.get("password") ?? "")));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-light tracking-wide">Studio Envelope</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-teal-deep">Admin</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-xs uppercase tracking-wider text-muted mb-1.5">
              Username
            </label>
            <input
              id="username"
              name="username"
              className={fieldClass}
              autoComplete="username"
              autoCapitalize="none"
              autoFocus
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs uppercase tracking-wider text-muted mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={fieldClass}
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-700 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-night text-bone text-sm font-medium hover:bg-abyss transition-colors disabled:opacity-60"
        >
          {busy && <Loader2 size={14} className="animate-spin" />}
          Sign in
        </button>
      </form>
    </div>
  );
}

export default function AuthGuard({ children }: { children: ReactNode }) {
  // undefined = still checking, null = signed out
  const [user, setUser] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getSessionUser()
      .then((name) => {
        if (!cancelled) setUser(name);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    const onUnauthorized = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => {
      cancelled = true;
      window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    };
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted">
        <Loader2 size={16} className="animate-spin mr-2" /> Loading…
      </div>
    );
  }

  if (user === null) return <LoginForm onSignedIn={setUser} />;

  return (
    <>
      <AdminNav user={user} onSignedOut={() => setUser(null)} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</main>
    </>
  );
}
