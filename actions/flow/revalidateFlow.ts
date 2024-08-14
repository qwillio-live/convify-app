"use server"

import { revalidateTag } from "next/cache"

export async function revalidateFlow({ tag }: { tag: string }) {
  console.log("revalidating flow...")
  revalidateTag(tag)
}
