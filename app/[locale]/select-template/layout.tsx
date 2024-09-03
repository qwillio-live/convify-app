import { Montserrat, Open_Sans } from "next/font/google"

import { cn } from "@/lib/utils"

interface SelectTemplateLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}
import { env } from "@/env.mjs"

export const metadata = {
  title: process.env.APP_NAME + " - Select template",
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
        <main>{children}</main>
      </body>
    </html>
  )
}
