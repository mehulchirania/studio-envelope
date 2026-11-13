import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { HttpError, handle, readJson, requireAdmin } from "@/lib/admin/http";
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/admin/session";
import { getPasswordVersion, setPassword, verifyCredentials } from "@/lib/admin/users";

const MIN_LENGTH = 10;
const MAX_LENGTH = 200;

// Changes the signed-in admin's own password. Needs the current password too,
// so a stolen session cookie alone can't lock the owner out.
export async function POST(request: Request) {
  return handle(async () => {
    const user = await requireAdmin(request);
    const body = (await readJson(request)) as { current?: unknown; next?: unknown };
    const current = typeof body.current === "string" ? body.current : "";
    const next = typeof body.next === "string" ? body.next : "";

    if (next.length < MIN_LENGTH) throw new HttpError(400, `Use at least ${MIN_LENGTH} characters for the new password.`);
    if (next.length > MAX_LENGTH) throw new HttpError(400, "That password is too long.");
    if (next === current) throw new HttpError(400, "Choose a password different from the current one.");
    if ((await verifyCredentials(user, current)) !== user) throw new HttpError(403, "Current password is wrong.");

    await setPassword(user, next);
    // Old sessions (any device) are now invalid; keep this admin signed in.
    const token = createSessionToken(user, await getPasswordVersion(user));
    if (token) (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);
    return NextResponse.json({ ok: true });
  });
}
