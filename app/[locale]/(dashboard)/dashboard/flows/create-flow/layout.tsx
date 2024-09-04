import StoreProvider from "@/lib/state/flows-state/store-provider"
import React from "react"

interface FlowsLayoutProps {
  children?: React.ReactNode
}
import { env } from "@/env.mjs"
import { getTranslations } from "next-intl/server"

const APP_NAME = process.env.APP_NAME

export async function generateMetadata() {
  const t = await getTranslations("Components") // Fetch translations

  return {
    title: `${APP_NAME} - ${t("Create")}`, // Use translations for title
  }
}
export default async function FlowsLayout({ children }: FlowsLayoutProps) {
  return <>{children}</>
}
