// Server-only: admin logins. Both are full admins, there is no
// per-user access difference. Set ADMIN_USERS="name:password,name2:password2"
// in the environment to override default local accounts.
import { createHash, timingSafeEqual } from "node:crypto";

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

/** Returns the canonical username when the credentials match, otherwise null. */
export function verifyCredentials(username: string, password: string): string | null {
  const wantedName = digest(username.trim().toLowerCase());
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
