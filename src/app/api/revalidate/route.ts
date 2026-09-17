// Admin-triggered revalidation. Called by src/lib/admin-api.ts after a
// project is saved/deleted/reordered so the public (statically cached) site
// picks up the change without waiting for the next deploy.
//
// The caller sends the signed-in admin's Firebase ID token as a bearer
// token; src/lib/server-auth.ts verifies it and checks the account against
// the server-only ADMIN_EMAILS allowlist.
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { bearerTokenFromHeader, verifyAdminToken } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const idToken = bearerTokenFromHeader(request.headers.get("authorization"));

  if (!idToken) {
    return NextResponse.json({ revalidated: false, error: "Missing bearer token" }, { status: 401 });
  }

  const adminEmail = await verifyAdminToken(idToken);
  if (!adminEmail) {
    return NextResponse.json({ revalidated: false, error: "Not authorized" }, { status: 403 });
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
