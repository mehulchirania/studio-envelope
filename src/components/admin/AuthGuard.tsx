"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import { checkIsAdmin, signInWithGoogle, signOutAdmin, watchAuthState } from "@/lib/admin-api";
import AdminNav from "./AdminNav";

type Status = "loading" | "signed-out" | "not-admin" | "admin";

function CenteredScreen({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full">{children}</div>
    </div>
  );
}

function NotConfiguredScreen() {
  return (
    <CenteredScreen>
      <div className="text-center space-y-4">
        <h1 className="text-xl font-light tracking-wide">Firebase not configured</h1>
        <p className="text-sm text-[#EDE8E0]/60 leading-relaxed">
          The admin panel needs a Firebase project to sign in and store data. Add the{" "}
          <code className="text-[#EDE8E0]/80">NEXT_PUBLIC_FIREBASE_*</code> environment variables to{" "}
          <code className="text-[#EDE8E0]/80">.env.local</code> (see{" "}
          <code className="text-[#EDE8E0]/80">.env.local.example</code> and the README) and restart the dev
          server. The public site works fine without this — it falls back to local seed data.
        </p>
      </div>
    </CenteredScreen>
  );
}

export default function AuthGuard({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = watchAuthState(async (u) => {
      setUser(u);
      if (!u) {
        setStatus("signed-out");
        return;
      }
      const admin = await checkIsAdmin();
      setStatus(admin ? "admin" : "not-admin");
    });
    return unsubscribe;
  }, []);

  if (!isFirebaseConfigured) {
    return <NotConfiguredScreen />;
  }

  if (status === "loading") {
    return (
      <CenteredScreen>
        <p className="text-center text-sm text-[#EDE8E0]/50">Loading…</p>
      </CenteredScreen>
    );
  }

  if (status === "signed-out") {
    return (
      <CenteredScreen>
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-2xl font-light tracking-wide">Studio Envelope</h1>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#5E9AA3]">Admin</p>
            <p className="mt-4 text-sm text-[#EDE8E0]/60">Sign in with an authorized Google account.</p>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            onClick={async () => {
              setError(null);
              try {
                await signInWithGoogle();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Sign-in failed.");
              }
            }}
            className="px-5 py-2.5 rounded-full border border-[#5E9AA3]/60 text-sm tracking-wide hover:bg-[#5E9AA3]/10 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </CenteredScreen>
    );
  }

  if (status === "not-admin") {
    return (
      <CenteredScreen>
        <div className="text-center space-y-4">
          <h1 className="text-xl font-light">Not authorized</h1>
          <p className="text-sm text-[#EDE8E0]/60 leading-relaxed">
            {user?.email} is signed in but isn&apos;t on the admin allowlist. Ask an existing admin to add
            this email to the list in <code className="text-[#EDE8E0]/80">firestore.rules</code> (and to{" "}
            <code className="text-[#EDE8E0]/80">ADMIN_EMAILS</code>), then redeploy.
          </p>
          <button
            onClick={() => signOutAdmin()}
            className="px-4 py-2 rounded-full border border-[#EDE8E0]/15 text-sm hover:bg-[#EDE8E0]/5 transition-colors"
          >
            Sign out
          </button>
        </div>
      </CenteredScreen>
    );
  }

  return (
    <>
      <AdminNav email={user?.email ?? undefined} />
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </>
  );
}
