import { revalidatePath } from "next/cache";

/** Marks every public page stale so the next visit shows the saved change straight away. */
export function revalidateSite(): void {
  revalidatePath("/", "layout");
}
