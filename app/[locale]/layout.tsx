import { Analytics } from "@/components/analytics"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import localFont from "next/font/local"

import "@/styles/globals.css"
import { NextIntlClientProvider, useMessages } from "next-intl"

const geist = localFont({
  variable: "--font-geist",
  src: [
    {
      path: "../../assets/fonts/Geist-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../assets/fonts/Geist-UltraBlack.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../assets/fonts/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../assets/fonts/Geist-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../assets/fonts/Geist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../assets/fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../assets/fonts/Geist-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../assets/fonts/Geist-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../assets/fonts/Geist-Thin.woff2",
      weight: "100",
      style: "normal",
    },
  ],
})

import {
  anton,
  arimo,
  asap,
  barlow,
  bebas_neue,
  bitter,
  cabin,
  cairo,
  catamaran,
  dosis,
  exo_2,
  fira_sans,
  fontHeading,
  fontSans,
  heebo,
  ibm_plex_sans,
  inconsolata,
  inter,
  karla,
  lato,
  libre_franklin,
  lora,
  merriweather,
  montserrat,
  mukta,
  noto_sans,
  nunito,
  nunito_sans,
  open_sans,
  oswald,
  overpass,
  oxygen,
  playfair_display,
  poppins,
  pt_sans,
  pt_serif,
  questrial,
  quicksand,
  raleway,
  red_hat_display,
  roboto,
  roboto_condensed,
  roboto_mono,
  roboto_slab,
  rokkitt,
  rubik,
  teko,
  titillium_web,
  ubuntu,
  varela_round,
  work_sans,
  zilla_slab,
  sans3,
} from "./fonts"

interface RootLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
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
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  const messages = useMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          roboto.variable,
          fontSans.variable,
          fontHeading.variable,
          inter.variable,
          roboto_mono.variable,
          geist.variable,
          open_sans.variable,
          montserrat.variable,
          lato.variable,
          oswald.variable,
          raleway.variable,
          pt_sans.variable,
          merriweather.variable,
          nunito.variable,
          playfair_display.variable,
          poppins.variable,
          ubuntu.variable,
          mukta.variable,
          rubik.variable,
          work_sans.variable,
          roboto_condensed.variable,
          noto_sans.variable,
          fira_sans.variable,
          quicksand.variable,
          karla.variable,
          cabin.variable,
          barlow.variable,
          arimo.variable,
          teko.variable,
          catamaran.variable,
          libre_franklin.variable,
          oxygen.variable,
          heebo.variable,
          asap.variable,
          bitter.variable,
          ibm_plex_sans.variable,
          exo_2.variable,
          dosis.variable,
          pt_serif.variable,
          overpass.variable,
          varela_round.variable,
          questrial.variable,
          inconsolata.variable,
          rokkitt.variable,
          red_hat_display.variable,
          cairo.variable,
          lora.variable,
          titillium_web.variable,
          bebas_neue.variable,
          anton.variable,
          zilla_slab.variable,
          nunito_sans.variable,
          roboto_slab.variable,
          sans3.variable
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
