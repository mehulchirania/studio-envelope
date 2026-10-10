"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { UNAUTHORIZED_EVENT, getSessionUser, login } from "@/lib/admin/client";
import AdminNav from "@/components/admin/AdminNav";

const fieldClass =
  "w-full bg-[#EDE8E0]/[0.04] border border-[#EDE8E0]/15 rounded-lg px-3.5 py-3 text-[15px] text-[#EDE8E0] focus:outline-none focus:border-[#5E9AA3]/60 transition-colors";

function LoginForm({ onSignedIn }: { onSignedIn: (user: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      onSignedIn(await login(username, password));
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
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#5E9AA3]">Admin</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-xs uppercase tracking-wider text-[#EDE8E0]/50 mb-1.5">
              Username
            </label>
            <input
              id="username"
              className={fieldClass}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoCapitalize="none"
              autoFocus
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs uppercase tracking-wider text-[#EDE8E0]/50 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={fieldClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#5E9AA3] text-[#0B0C0C] text-sm font-medium hover:bg-[#5E9AA3]/90 transition-colors disabled:opacity-60"
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
      <div className="min-h-screen flex items-center justify-center text-sm text-[#EDE8E0]/50">
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
