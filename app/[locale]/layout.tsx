import { Analytics } from "@/components/analytics"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import localFont from "next/font/local"

import "@/styles/globals.css"
import { NextIntlClientProvider, useMessages } from "next-intl"
import { env } from "@/env.mjs"

const fontSans = localFont({
  src: "../../assets/fonts/Inter-Regular.ttf",
  variable: "--font-sans",
})
interface RootLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}
const APP_NAME = process.env.APP_NAME
export const metadata = {
  title: {
    default: APP_NAME,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
  ],
  authors: [
    {
      name: "shadcn",
      url: "https://shadcn.com",
    },
  ],
  creator: "shadcn",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@shadcn",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon_logo_blue.png",
    apple: "/icon_logo_blue.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  const messages = useMessages()

  return (
    <html lang={locale}>
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased ",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <Toaster richColors />
          </NextIntlClientProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
