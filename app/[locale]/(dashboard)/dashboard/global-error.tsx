"use client"

import { notFound } from "next/navigation"
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return notFound()
}
