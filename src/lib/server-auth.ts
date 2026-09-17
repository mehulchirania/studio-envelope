// Server-only admin verification, shared by every API route that needs to
// confirm the caller is a signed-in admin (api/revalidate, api/upload).
//
// We verify the Firebase ID token the client sends by asking Google's
// Identity Toolkit "lookup" endpoint for the account behind it (no
// firebase-admin / service account needed on Vercel), then check the
// returned, verified email against the server-only ADMIN_EMAILS allowlist.
// Keep this list in sync with the admin list at the top of firestore.rules.
// Only import this from server code (API routes) — it reads server-only env vars.

interface LookupUser {
  email?: string;
  emailVerified?: boolean;
}

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Verifies a Firebase ID token and confirms the account it belongs to is a
 * verified-email admin (present in ADMIN_EMAILS). Returns the lowercased
 * email on success, or null when the token is missing/invalid/not an admin.
 */
export async function verifyAdminToken(idToken: string | null | undefined): Promise<string | null> {
  if (!idToken) return null;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) return null;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    }
  );
  if (!res.ok) return null;

  const data = (await res.json()) as { users?: LookupUser[] };
  const user = data.users?.[0];
  if (!user?.email || !user.emailVerified) return null;

  const email = user.email.toLowerCase();
  return adminEmails.includes(email) ? email : null;
}

/** Extracts a bearer token from a request's Authorization header. */
export function bearerTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
