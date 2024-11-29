import StoreProvider from "@/lib/state/flows-state/store-provider"
import React from "react"
import { redirect } from "next/navigation"
import { FlowsAutoSaveProvider } from "./autoSyncProvider"

interface FlowsLayoutProps {
  children?: React.ReactNode
  params: { flowId: string }
}
import { env } from "@/env.mjs"

export async function generateMetadata() {
  const t = await getTranslations("Components") // Fetch translations
  const APP_NAME = process.env.APP_NAME
  return {
    title: `${APP_NAME} - ${t("Create")}`, // Use translations for title
  }
}
import { getTranslations } from "next-intl/server"
import ReactQueryProvider from "@/components/react-query-provider"
export default async function FlowsLayout({
  children,
  params: { flowId },
}: FlowsLayoutProps) {
  return (
    <main>
      <StoreProvider>
        <ReactQueryProvider>
          <FlowsAutoSaveProvider flowId={flowId}>
            <div className="font-sans">{children}</div>
          </FlowsAutoSaveProvider>
        </ReactQueryProvider>
      </StoreProvider>
    </main>
  )
}
