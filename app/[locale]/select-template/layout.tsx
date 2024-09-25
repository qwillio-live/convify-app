import { Montserrat, Open_Sans } from "next/font/google"

import { cn } from "@/lib/utils"
import StoreProvider from "@/lib/state/flows-state/store-provider"

interface SelectTemplateLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}
import { env } from "@/env.mjs"
import { getTranslations } from "next-intl/server"

const APP_NAME = process.env.APP_NAME

export async function generateMetadata() {
  const t = await getTranslations("Components") // Fetch translations

  return {
    title: `${APP_NAME} - ${t("Select template")}`, // Use translations for title
  }
}

const fontSans = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cal-sans",
  display: "swap",
})

const fontHeading = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export default async function SelectTemplateLayout({
  children,
  params: { locale },
}: SelectTemplateLayoutProps) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-[#f9f9fb] font-sans text-[#1c212c] antialiased",
          fontSans.className,
          fontHeading.className
        )}
      >
        <main>
          {" "}
          <StoreProvider>{children}</StoreProvider>
        </main>
      </body>
    </html>
  )
}
