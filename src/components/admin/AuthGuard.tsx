"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { UNAUTHORIZED_EVENT, changePassword, getSession, login, logout, requestPasswordReset, type AdminSession } from "@/lib/admin/client";
import AdminShell from "@/components/admin/AdminShell";

/** The full-colour logo on the light theme, the white one on the dark theme (swapped in admin.css). */
function AdminLogo() {
  return (
    <div className="flex justify-center">
      {/* eslint-disable @next/next/no-img-element -- small static logos */}
      <img src="/brand/logo-color.png" alt="Studio Envelope" width={200} height={68} className="a-logo-light h-auto w-[200px]" />
      <img src="/brand/logo-white.png" alt="Studio Envelope" width={200} height={68} className="a-logo-dark h-auto w-[200px]" />
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  );
}

const fieldClass =
  "w-full bg-ink/[0.05] border border-ink/25 rounded-lg px-3.5 py-3 text-[15px] text-ink focus:outline-none focus:border-teal transition-colors";

const alertClass = "text-sm text-red-700 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2";
const buttonClass =
  "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full a-pri text-sm font-medium transition-colors disabled:opacity-60";
const labelClass = "block text-xs uppercase tracking-wider text-muted mb-1.5";

function ForgotForm({ onBack }: { onBack: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const username = String(new FormData(event.currentTarget).get("username") ?? "");
    setBusy(true);
    setError(null);
    try {
      await requestPasswordReset(username);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send the email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5">
        <div className="text-center space-y-3">
          <AdminLogo />
          <h1 className="font-display text-3xl font-medium">Reset password</h1>
        </div>

        {sent ? (
          <p role="status" className="text-sm text-teal-deep bg-teal/10 border border-teal/20 rounded-lg px-3 py-2">
            If that login can be reset, a temporary password has been emailed to the studio inbox. It works for 1 hour. Your current
            password keeps working until you change it.
          </p>
        ) : (
          <>
            <div>
              <label htmlFor="forgot-username" className={labelClass}>Username</label>
              <input id="forgot-username" name="username" className={fieldClass} autoComplete="username" autoCapitalize="none" autoFocus required />
              <p className="mt-1.5 text-xs text-muted">We&apos;ll email a temporary password to the studio&apos;s hello@ address.</p>
            </div>
            {error && <p role="alert" className={alertClass}>{error}</p>}
            <button type="submit" disabled={busy} className={buttonClass}>
              {busy && <Loader2 size={14} className="animate-spin" />}
              Email me a temporary password
            </button>
          </>
        )}

        <button type="button" onClick={onBack} className="block mx-auto text-sm text-muted hover:text-ink underline underline-offset-4">
          Back to sign in
        </button>
      </form>
    </div>
  );
}

/** Shown after signing in with an emailed temporary password: choose a real one before anything else. */
function NewPasswordForm({ tempPassword, onDone, onSignOut }: { tempPassword?: string; onDone: () => void; onSignOut: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const next = String(data.get("next") ?? "");
    if (next !== String(data.get("confirm") ?? "")) {
      setError("The new passwords don't match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await changePassword(tempPassword ?? String(data.get("current") ?? ""), next);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't change the password.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-light tracking-wide">Choose a new password</h1>
          <p className="mt-1 text-sm text-muted">You signed in with a temporary password. Set your own to continue.</p>
        </div>
        {tempPassword === undefined && (
          <div>
            <label htmlFor="current" className={labelClass}>Temporary password</label>
            <input id="current" name="current" type="password" className={fieldClass} autoComplete="current-password" required />
          </div>
        )}
        <div>
          <label htmlFor="next" className={labelClass}>New password</label>
          <input id="next" name="next" type="password" className={fieldClass} autoComplete="new-password" minLength={10} autoFocus required />
          <p className="mt-1.5 text-xs text-muted">At least 10 characters.</p>
        </div>
        <div>
          <label htmlFor="confirm" className={labelClass}>Confirm new password</label>
          <input id="confirm" name="confirm" type="password" className={fieldClass} autoComplete="new-password" required />
        </div>
        {error && <p role="alert" className={alertClass}>{error}</p>}
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy && <Loader2 size={14} className="animate-spin" />}
          Save and continue
        </button>
        <button type="button" onClick={onSignOut} className="block mx-auto text-sm text-muted hover:text-ink underline underline-offset-4">
          Sign out
        </button>
      </form>
    </div>
  );
}

function LoginForm({ onSignedIn, onForgot }: { onSignedIn: (session: AdminSession, password: string) => void; onForgot: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Enter in either field submits the form. Values are read from the form itself (not React
  // state) so browser autofill and password managers are picked up even if no input event fired.
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    setBusy(true);
    setError(null);
    try {
      onSignedIn(await login(String(data.get("username") ?? ""), password), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5">
        <div className="text-center space-y-3">
          <AdminLogo />
          <h1 className="font-display text-3xl font-medium">Admin sign-in</h1>
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
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full a-pri text-sm font-medium transition-colors disabled:opacity-60"
        >
          {busy && <Loader2 size={14} className="animate-spin" />}
          Sign in
        </button>
        <button type="button" onClick={onForgot} className="block mx-auto text-sm text-muted hover:text-ink underline underline-offset-4">
          Forgot password?
        </button>
      </form>
    </div>
  );
}

export default function AuthGuard({ children }: { children: ReactNode }) {
  // undefined = still checking, null = signed out
  const [session, setSession] = useState<AdminSession | null | undefined>(undefined);
  const [forgot, setForgot] = useState(false);
  // The temporary password just typed, kept in memory only so the user isn't asked for it twice.
  const [tempPassword, setTempPassword] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getSession()
      .then((s) => {
        if (!cancelled) setSession(s);
      })
      .catch(() => {
        if (!cancelled) setSession(null);
      });
    const onUnauthorized = () => setSession(null);
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => {
      cancelled = true;
      window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    };
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted">
        <Loader2 size={16} className="animate-spin mr-2" /> Loading…
      </div>
    );
  }

  if (session === null) {
    if (forgot) return <ForgotForm onBack={() => setForgot(false)} />;
    return (
      <LoginForm
        onSignedIn={(s, password) => {
          setTempPassword(s.mustChange ? password : undefined);
          setSession(s);
        }}
        onForgot={() => setForgot(true)}
      />
    );
  }

  const signOut = () => {
    setTempPassword(undefined);
    setSession(null);
  };

  if (session.mustChange) {
    return (
      <NewPasswordForm
        tempPassword={tempPassword}
        onDone={() => {
          setTempPassword(undefined);
          setSession({ user: session.user, mustChange: false });
        }}
        onSignOut={() => {
          logout().catch(() => {});
          signOut();
        }}
      />
    );
  }

  return (
    <AdminShell user={session.user} onSignedOut={signOut}>
      {children}
    </AdminShell>
  );
}
