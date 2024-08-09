import StoreProvider from "@/lib/state/flows-state/store-provider"
import React from "react"

interface FlowsLayoutProps {
  children?: React.ReactNode
  params: { flowId: string }
}

export default async function FlowsLayout({ children }: FlowsLayoutProps) {
  return <StoreProvider>{children}</StoreProvider>
}
