import StoreProvider from "@/lib/state/flows-state/store-provider"
import React from "react"

interface FlowsLayoutProps {
  children?: React.ReactNode
}
import { env } from "@/env.mjs"

import { getTranslations } from "next-intl/server"

export async function generateMetadata() {
  const t = await getTranslations("Components") // Fetch translations
  const APP_NAME = process.env.APP_NAME
  return {
    title: `${APP_NAME} - ${t("Connect")}`, // Use translations for title
  }
}
export default async function ConnectLayout({ children }: FlowsLayoutProps) {
  return <>{children}</>
}
