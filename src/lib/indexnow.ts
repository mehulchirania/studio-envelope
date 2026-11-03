import { SITE_URL } from "@/lib/seo";

/** Public by design: IndexNow verifies it against public/<key>.txt. */
export const INDEXNOW_KEY = "da0fc452378d09cac0b452d3afa4340c";

/** Tells IndexNow (Bing, Yandex and partners) which URLs changed, using the live
 * sitemap as the URL list. Fetching the sitemap also makes it regenerate with the
 * latest projects. Production only, and never throws: SEO pings must not break an admin save. */
export async function pingIndexNow(): Promise<void> {
  if (process.env.VERCEL_ENV !== "production") return;
  try {
    const sitemap = await fetch(`${SITE_URL}/sitemap.xml`, { cache: "no-store" });
    if (!sitemap.ok) return;
    const urlList = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    if (urlList.length === 0) return;
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });
  } catch {
    // Best effort only.
  }
}
