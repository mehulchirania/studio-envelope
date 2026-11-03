import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { pingIndexNow } from "@/lib/indexnow";

/** Marks every public page stale so the next visit shows the saved change straight away,
 * then (after the response is sent) tells search engines via IndexNow. Pass
 * `{ notify: false }` for changes that add or remove no URLs, such as reordering. */
export function revalidateSite({ notify = true }: { notify?: boolean } = {}): void {
  revalidatePath("/", "layout");
  if (notify) after(pingIndexNow);
}
