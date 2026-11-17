import { NextResponse } from "next/server";
import { handle, requireAdmin } from "@/lib/admin/http";
import { getAnalytics } from "@/lib/admin/analytics";
import type { AnalyticsRange } from "@/lib/admin/types";

const RANGES: AnalyticsRange[] = [7, 30, 90];

export async function GET(request: Request) {
  return handle(async () => {
    await requireAdmin(request);
    const asked = Number(new URL(request.url).searchParams.get("range"));
    const range = RANGES.find((r) => r === asked) ?? 30;
    return NextResponse.json(await getAnalytics(range));
  });
}
