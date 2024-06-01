import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { ThemeProvider } from "@/components/theme-provider"

import "@/styles/globals.css"
import { NextIntlClientProvider, useMessages } from "next-intl"
import {
  fontSans,
  fontHeading,
  inter,
  roboto_mono,
  open_sans,
  montserrat,
  lato,
  oswald,
  source_sans_pro,
  raleway,
  pt_sans,
  merriweather,
  nunito,
  playfair_display,
  poppins,
  ubuntu,
  mukta,
  rubik,
  work_sans,
  roboto_condensed,
  noto_sans,
  fira_sans,
  quicksand,
  karla,
  cabin,
  barlow,
  arimo,
  teko,
  catamaran,
  libre_franklin,
  oxygen,
  heebo,
  asap,
  bitter,
  ibm_plex_sans,
  exo_2,
  dosis,
  pt_serif,
  overpass,
  varela_round,
  questrial,
  inconsolata,
  rokkitt,
  red_hat_display,
  cairo,
  lora,
  titillium_web,
  bebas_neue,
  anton,
  zilla_slab,
  nunito_sans,
  roboto_slab,
  roboto,
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
          open_sans.variable,
          montserrat.variable,
          lato.variable,
          oswald.variable,
          source_sans_pro.variable,
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
          roboto_slab.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
