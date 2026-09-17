// Issues Vercel Blob client-upload tokens for the admin image uploader.
// The browser talks to Vercel Blob directly (see uploadProjectImage in
// src/lib/admin-api.ts) after fetching a short-lived token from this route.
// We authenticate the request the same way as /api/revalidate: the caller's
// Firebase ID token travels in `clientPayload`, and we verify it against the
// server-only ADMIN_EMAILS allowlist before handing out a token.
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
];
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        let idToken: string | null = null;
        try {
          idToken = clientPayload ? (JSON.parse(clientPayload).idToken ?? null) : null;
        } catch {
          idToken = null;
        }

        const adminEmail = await verifyAdminToken(idToken);
        if (!adminEmail) {
          throw new Error("Not authorized");
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
