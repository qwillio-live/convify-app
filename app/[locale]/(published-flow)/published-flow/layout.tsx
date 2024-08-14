import StoreProviderNonPersist from "@/lib/state/store-provider-non-persist"
import React from "react"

interface FlowsLayoutProps {
  children?: React.ReactNode
  params: { flowId: string }
}

export default async function FlowsLayout({ children }: FlowsLayoutProps) {
  return <StoreProviderNonPersist>{children}</StoreProviderNonPersist>
}
