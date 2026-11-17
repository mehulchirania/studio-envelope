// Server-only: admin logins. Both are full admins, there is no
// per-user access difference. Set ADMIN_USERS="name:password,name2:password2"
// in the environment to override default local accounts.
import { createHash, randomBytes, randomInt, scryptSync, timingSafeEqual } from "node:crypto";
import { HttpError } from "@/lib/admin/http";
import { getPasswordRecord, setPasswordRecord, setTempPasswordRecord } from "@/lib/firebase/admin-server";

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

function hashMatches(password: string, salt: string, hash: string): boolean {
  const given = Buffer.from(hashPassword(password, salt), "hex");
  const wanted = Buffer.from(hash, "hex");
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

// Only these logins can be reset by email; the mail goes to the studio inbox.
const RESETTABLE = ["prachi"];
const TEMP_MINUTES = 60;
const RESET_COOLDOWN_MS = 5 * 60 * 1000;
// No look-alike characters (0/O, 1/l/I) so the code is easy to read from an email.
const TEMP_ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Creates a one-hour temporary password for a resettable admin and returns it so it can be
 * emailed. Returns null when the username can't be reset or one was issued in the last
 * few minutes (callers answer the same way either way, so nothing leaks).
 */
export async function issueTempPassword(username: string): Promise<string | null> {
  const name = username.trim().toLowerCase();
  if (!RESETTABLE.includes(name)) return null;
  const existing = await getPasswordRecord(name);
  if (existing?.temp && Date.now() - Date.parse(existing.temp.createdAt) < RESET_COOLDOWN_MS) return null;

  const temp = Array.from({ length: 12 }, () => TEMP_ALPHABET[randomInt(TEMP_ALPHABET.length)]).join("");
  const salt = randomBytes(16).toString("hex");
  await setTempPasswordRecord(name, {
    salt,
    hash: hashPassword(temp, salt),
    expiresAt: new Date(Date.now() + TEMP_MINUTES * 60 * 1000).toISOString(),
  });
  return temp;
}

/** Like verifyCredentials, but also says whether the match was an emailed temporary password. */
export async function verifyLogin(username: string, password: string): Promise<{ user: string; temporary: boolean } | null> {
  const name = username.trim().toLowerCase();
  let stored: Awaited<ReturnType<typeof getPasswordRecord>>;
  try {
    stored = await getPasswordRecord(name);
  } catch {
    // Fail closed: never fall back to env passwords when the lookup itself failed.
    throw new HttpError(503, "Sign-in is temporarily unavailable. Please try again.");
  }
  if (stored?.temp && Date.parse(stored.temp.expiresAt) > Date.now() && hashMatches(password, stored.temp.salt, stored.temp.hash)) {
    return { user: name, temporary: true };
  }
  if (stored?.hash) {
    return hashMatches(password, stored.salt, stored.hash) ? { user: name, temporary: false } : null;
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
  return matched ? { user: matched, temporary: false } : null;
}

/** Returns the canonical username when the credentials match (real or temporary password), otherwise null. */
export async function verifyCredentials(username: string, password: string): Promise<string | null> {
  return (await verifyLogin(username, password))?.user ?? null;
}
