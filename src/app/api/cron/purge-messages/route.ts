import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { privacy } from "@/lib/content/site";
import { purgeMessagesBefore } from "@/lib/firebase/admin-server";

// Data retention: deletes enquiries older than `privacy.retentionMonths`.
// Called weekly by Vercel Cron (vercel.json), which sends `Authorization: Bearer $CRON_SECRET`.
// Set CRON_SECRET in Vercel; without it this route refuses every request.
export const runtime = "nodejs";

function authorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request: Request) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - privacy.retentionMonths);
  try {
    const deleted = await purgeMessagesBefore(cutoff);
    return NextResponse.json({ ok: true, deleted, olderThan: cutoff.toISOString() });
  } catch (err) {
    console.error("[cron] purge-messages failed:", err);
    return NextResponse.json({ error: "Purge failed." }, { status: 500 });
  }
}
