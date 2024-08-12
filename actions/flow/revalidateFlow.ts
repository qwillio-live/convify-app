"use server"

import { revalidateTag } from "next/cache"

export async function revalidateFlow() {
  console.log("revalidating flow...")
  revalidateTag("previewFlow")
}
