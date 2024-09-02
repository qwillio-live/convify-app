import StoreProvider from "@/lib/state/flows-state/store-provider"
import React from "react"

interface FlowsLayoutProps {
  children?: React.ReactNode
}
import { env } from "@/env.mjs"

export const metadata = {
  title: env.NEXT_PUBLIC_APP_NAME + " - Results",
}
export default async function ResultsLayout({ children }: FlowsLayoutProps) {
  return <>{children}</>
}
