import React from "react"
import { notFound } from "next/navigation"
import StoreProvider from "../../../../lib/state/flows-state/store-provider"


interface FlowsLayoutProps {
  children?: React.ReactNode
}

export default async function FlowsLayout({
  children,
}: FlowsLayoutProps) {

  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  )
}
