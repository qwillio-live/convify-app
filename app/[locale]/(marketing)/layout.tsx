import Link from "next/link"

import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { marketingConfig } from "@/config/marketing"
import { cn } from "@/lib/utils"

interface MarketingLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default async function MarketingLayout({
  children,
  params: { locale },
}: MarketingLayoutProps) {
  return (
    <div
      className={`flex min-h-screen flex-col `}
    >
      <header className="bg-background z-4 container font-sans">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={marketingConfig.mainNav} />
          <nav>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4"
              )}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
