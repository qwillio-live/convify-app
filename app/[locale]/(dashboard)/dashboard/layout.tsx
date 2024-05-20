import { notFound } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { MainNav } from "@/components/main-nav"
import { DashboardNav } from "@/components/nav"
import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"
import StoreProvider from "@/lib/state/flows-state/store-provider"

interface DashboardLayoutProps {
  children?: React.ReactNode
  params: { locale: string }
}

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
    <div className="flex min-h-screen flex-col space-y-6">
      <main>{children}</main>
      {/* <SiteFooter className="border-t" /> */}
    </div>
    </StoreProvider>
  )
}
