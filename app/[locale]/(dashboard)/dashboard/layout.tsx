import { notFound } from "next/navigation"

import { getCurrentUser } from "@/lib/session"

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
    <div className="flex min-h-screen flex-col space-y-6">
      <main>{children}</main>
      {/* <SiteFooter className="border-t" /> */}
    </div>
  )
}
