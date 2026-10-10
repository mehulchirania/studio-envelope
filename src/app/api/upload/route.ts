// Issues Vercel Blob client-upload tokens for the admin image uploader. The
// browser talks to Vercel Blob directly (see uploadImage in
// src/lib/admin/client.ts) after fetching a short-lived token from this route.
// Only signed-in admins get a token. The "upload completed" callback comes from
// Vercel's servers (no cookie), so the session is only checked when a token is
// being generated.
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser } from "@/lib/admin/session";

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await getSessionUser())) throw new Error("Please sign in again to upload images.");
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
