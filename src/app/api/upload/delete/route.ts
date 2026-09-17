// Deletes a project image from Vercel Blob. Called by
// deleteProjectImageByUrl in src/lib/admin-api.ts when an admin removes an
// image. Verifies the caller the same way as /api/revalidate and /api/upload
// (bearer Firebase ID token, checked against ADMIN_EMAILS).
import { del } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";
import { bearerTokenFromHeader, verifyAdminToken } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

const BLOB_HOSTNAME_SUFFIX = ".public.blob.vercel-storage.com";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const idToken = bearerTokenFromHeader(request.headers.get("authorization"));
  const adminEmail = await verifyAdminToken(idToken);
  if (!adminEmail) {
    return NextResponse.json({ deleted: false, error: "Not authorized" }, { status: 403 });
  }

  const { url } = (await request.json().catch(() => ({}))) as { url?: string };
  if (!url) {
    return NextResponse.json({ deleted: false, error: "Missing url" }, { status: 400 });
  }

  // Only ever delete our own Blob URLs — ignore anything else (Unsplash seed
  // placeholders, or already-deleted URLs) rather than erroring on them.
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return NextResponse.json({ deleted: false, error: "Invalid url" }, { status: 400 });
  }
  if (!hostname.endsWith(BLOB_HOSTNAME_SUFFIX)) {
    return NextResponse.json({ deleted: false, skipped: true });
  }

  try {
    await del(url);
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json(
      { deleted: false, error: err instanceof Error ? err.message : "Delete failed" },
      { status: 500 }
    );
  }
}
