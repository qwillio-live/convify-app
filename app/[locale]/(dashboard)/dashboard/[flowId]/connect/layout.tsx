import StoreProvider from "@/lib/state/flows-state/store-provider"
import React from "react"

interface FlowsLayoutProps {
  children?: React.ReactNode
}
import { env } from "@/env.mjs"

export const metadata = {
  title: process.env.APP_NAME + " - Connect",
}
export default async function ConnectLayout({ children }: FlowsLayoutProps) {
  return <>{children}</>
}
