import StoreProvider from "@/lib/state/flows-state/store-provider"
import React from "react"

interface FlowsLayoutProps {
  children?: React.ReactNode
}
import { env } from "@/env.mjs"

export const metadata = {
  title: env.NEXT_PUBLIC_APP_NAME + " - Connect",
}
export default async function ConnectLayout({ children }: FlowsLayoutProps) {
  return <>{children}</>
}
