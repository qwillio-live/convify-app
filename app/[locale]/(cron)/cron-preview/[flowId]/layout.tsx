import dynamic from "next/dynamic"

// Client Components:
import FlowLayout from "@/components/flow-preview/flow-preview-server"
import localFont from "next/font/local"
import { cn } from "lib/utils"

import { env } from "@/env.mjs"

import { getTranslations } from "next-intl/server"

export async function generateMetadata() {
  const t = await getTranslations("Components") // Fetch translations
  const APP_NAME = process.env.APP_NAME
  return {
    title: `${APP_NAME} - ${t("Preview")}`, // Use translations for title
  }
}

import StoreProviderNonPersist from "@/lib/state/store-provider-non-persist"
export default function PreviewFlowsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "h-full",
       
      )}
    >
      {/* <FlowLayout isHeader={true} /> */}

      {children}
    </div>
  )
}
