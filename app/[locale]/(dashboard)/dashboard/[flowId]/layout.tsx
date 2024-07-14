import StoreProvider from "@/lib/state/flows-state/store-provider"
import React from "react"
import { redirect } from "next/navigation"
import { FlowsAutoSaveProvider } from "./autoSyncProvider"

interface FlowsLayoutProps {
  children?: React.ReactNode
  params: { flowId: string }
}

export default async function FlowsLayout({
  children,
  params: { flowId },
}: FlowsLayoutProps) {
  return (
    <StoreProvider>
      <FlowsAutoSaveProvider flowId={flowId}>{children}</FlowsAutoSaveProvider>
    </StoreProvider>
  )
}
