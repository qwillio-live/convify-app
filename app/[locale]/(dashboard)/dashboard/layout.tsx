import { notFound } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { MainNav } from "@/components/main-nav"
import { DashboardNav } from "@/components/nav"
import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"
import StoreProvider from "@/lib/state/flows-state/store-provider"
import { Toaster } from "@/components/ui/toaster"
import { getTranslations } from "next-intl/server"

interface DashboardLayoutProps {
  children?: React.ReactNode
  params: { locale: string }
}
const APP_NAME = process.env.APP_NAME

export async function generateMetadata() {
  const t = await getTranslations("Components") // Fetch translations

  return {
    title: `${APP_NAME} - ${t("flows")}`, // Use translations for title
  }
}
import { cn } from "@/lib/utils"
import { ScreenshotsProvider } from "./thumbnailCronProvider"

export default async function DashboardLayout({
  children,
  params: { locale },
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return (
    <StoreProvider>
      <ScreenshotsProvider>
        <div
          className={cn(
            "flex h-screen flex-col space-y-6 bg-white",
          )}
        >
          <main>{children}</main>
          <Toaster />
          {/* <SiteFooter className="border-t" /> */}
        </div>
      </ScreenshotsProvider>
    </StoreProvider>
  )
}
