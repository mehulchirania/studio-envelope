// Server-only: admin logins. Both are full admins, there is no
// per-user access difference. Set ADMIN_USERS="name:password,name2:password2"
// in the environment to override default local accounts.
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { HttpError } from "@/lib/admin/http";
import { getPasswordRecord,setPasswordRecord } from "@/lib/firebase/admin-server";

interface AdminUser {
  username: string;
  password: string;
}

const DEFAULT_USERS: AdminUser[] = [
  { username: "admin", password: "admin" },
  { username: "prachi", password: "password" },
];

function configuredUsers(): AdminUser[] {
  const raw = process.env.ADMIN_USERS?.trim();
  // The well-known default passwords are for local development only: in
  // production, with no ADMIN_USERS set, nobody can sign in.
  const fallback = process.env.NODE_ENV === "production" ? [] : DEFAULT_USERS;
  if (!raw) return fallback;
  const users = raw
    .split(",")
    .map((pair) => {
      const index = pair.indexOf(":");
      if (index < 1) return null;
      return { username: pair.slice(0, index).trim().toLowerCase(), password: pair.slice(index + 1).trim() };
    })
    .filter((user): user is AdminUser => Boolean(user && user.username && user.password));
  return users.length > 0 ? users : fallback;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

/** A password changed from the admin panel (stored hashed in Firestore) replaces the one from ADMIN_USERS. */
export async function setPassword(username: string, password: string): Promise<void> {
  const salt = randomBytes(16).toString("hex");
  await setPasswordRecord(username.trim().toLowerCase(), salt, hashPassword(password, salt));
}

/** Version stamp of the user's stored password ("" when none). Throws if the lookup fails. */
export async function getPasswordVersion(username: string): Promise<string> {
  return (await getPasswordRecord(username.trim().toLowerCase()))?.updatedAt ?? "";
}

/** Returns the canonical username when the credentials match, otherwise null. */
export async function verifyCredentials(username: string, password: string): Promise<string | null> {
  const name = username.trim().toLowerCase();
  let stored: Awaited<ReturnType<typeof getPasswordRecord>>;
  try {
    stored = await getPasswordRecord(name);
  } catch {
    // Fail closed: never fall back to env passwords when the lookup itself failed.
    throw new HttpError(503, "Sign-in is temporarily unavailable. Please try again.");
  }
  if (stored) {
    const given = Buffer.from(hashPassword(password, stored.salt), "hex");
    const wanted = Buffer.from(stored.hash, "hex");
    const ok = given.length === wanted.length && timingSafeEqual(given, wanted);
    return ok ? name : null;
  }

  const wantedName = digest(name);
  const givenPassword = digest(password);
  let matched: string | null = null;
  // Check every user (no early exit) so timing doesn't reveal which names exist.
  for (const user of configuredUsers()) {
    const nameOk = timingSafeEqual(wantedName, digest(user.username));
    const passwordOk = timingSafeEqual(givenPassword, digest(user.password));
    if (nameOk && passwordOk) matched = user.username;
  }
  return matched;
}
