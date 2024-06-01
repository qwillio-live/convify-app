import localFont from "next/font/local"
import {
  Inter,
  Roboto_Mono,
  Open_Sans,
  Montserrat,
  Lato,
  Oswald,
  Source_Sans_Pro,
  Raleway,
  PT_Sans,
  Merriweather,
  Nunito,
  Playfair_Display,
  Poppins,
  Ubuntu,
  Mukta,
  Rubik,
  Work_Sans,
  Roboto_Condensed,
  Noto_Sans,
  Fira_Sans,
  Quicksand,
  Karla,
  Cabin,
  Barlow,
  Arimo,
  Teko,
  Catamaran,
  Libre_Franklin,
  Oxygen,
  Heebo,
  Asap,
  Bitter,
  IBM_Plex_Sans,
  Exo_2,
  Dosis,
  PT_Serif,
  Overpass,
  Varela_Round,
  Questrial,
  Inconsolata,
  Rokkitt,
  Red_Hat_Display,
  Cairo,
  Lora,
  Titillium_Web,
  Bebas_Neue,
  Anton,
  Zilla_Slab,
  Nunito_Sans,
  Roboto_Slab,
} from "next/font/google"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { ThemeProvider } from "@/components/theme-provider"

import "@/styles/globals.css"
import { NextIntlClientProvider, useMessages } from "next-intl"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
})

// google fonts
const open_sans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  weight: "400",
})

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
})

const source_sans_pro = Source_Sans_Pro({
  subsets: ["latin"],
  variable: "--font-source-sans-pro",
  display: "swap",
  weight: "400",
})

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
})

const pt_sans = PT_Sans({
  subsets: ["latin"],
  variable: "--font-pt-sans",
  display: "swap",
  weight: "400",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
  weight: "400",
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "700"],
})

const playfair_display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "700"],
})

const ubuntu = Ubuntu({
  subsets: ["latin"],
  variable: "--font-ubuntu",
  display: "swap",
  weight: ["400", "700"],
})

const mukta = Mukta({
  subsets: ["latin"],
  variable: "--font-mukta",
  display: "swap",
  weight: ["400", "700"],
})

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
  weight: ["400", "700"],
})

const work_sans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
  weight: ["400", "700"],
})

const roboto_condensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  display: "swap",
  weight: ["400", "700"],
})

const noto_sans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
  weight: ["400", "700"],
})

const fira_sans = Fira_Sans({
  subsets: ["latin"],
  variable: "--font-fira-sans",
  display: "swap",
  weight: ["400", "700"],
})

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
  weight: ["400", "700"],
})

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
  weight: ["400", "700"],
})

const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-cabin",
  display: "swap",
  weight: ["400", "700"],
})

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
  weight: ["400", "700"],
})

const arimo = Arimo({
  subsets: ["latin"],
  variable: "--font-arimo",
  display: "swap",
  weight: ["400", "700"],
})

const teko = Teko({
  subsets: ["latin"],
  variable: "--font-teko",
  display: "swap",
  weight: ["400", "700"],
})

const catamaran = Catamaran({
  subsets: ["latin"],
  variable: "--font-catamaran",
  display: "swap",
  weight: ["400", "700"],
})

const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  display: "swap",
  weight: ["400", "700"],
})

const oxygen = Oxygen({
  subsets: ["latin"],
  variable: "--font-oxygen",
  display: "swap",
  weight: ["400", "700"],
})

const heebo = Heebo({
  subsets: ["latin"],
  variable: "--font-heebo",
  display: "swap",
  weight: ["400", "700"],
})

const asap = Asap({
  subsets: ["latin"],
  variable: "--font-asap",
  display: "swap",
  weight: ["400", "700"],
})

const bitter = Bitter({
  subsets: ["latin"],
  variable: "--font-bitter",
  display: "swap",
  weight: ["400", "700"],
})

const ibm_plex_sans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  weight: ["400", "700"],
})

const exo_2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo-2",
  display: "swap",
  weight: ["400", "700"],
})

const dosis = Dosis({
  subsets: ["latin"],
  variable: "--font-dosis",
  display: "swap",
  weight: ["400", "700"],
})

const pt_serif = PT_Serif({
  subsets: ["latin"],
  variable: "--font-pt-serif",
  display: "swap",
  weight: ["400", "700"],
})

const overpass = Overpass({
  subsets: ["latin"],
  variable: "--font-overpass",
  display: "swap",
  weight: ["400", "700"],
})

const varela_round = Varela_Round({
  subsets: ["latin"],
  variable: "--font-varela-round",
  display: "swap",
  weight: "400",
})

const questrial = Questrial({
  subsets: ["latin"],
  variable: "--font-questrial",
  display: "swap",
  weight: "400",
})

const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
  display: "swap",
  weight: "400",
})

const rokkitt = Rokkitt({
  subsets: ["latin"],
  variable: "--font-rokkitt",
  display: "swap",
  weight: "400",
})

const red_hat_display = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-red-hat-display",
  display: "swap",
  weight: "400",
})

const cairo = Cairo({
  subsets: ["latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: "400",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: "400",
})

const titillium_web = Titillium_Web({
  subsets: ["latin"],
  variable: "--font-titillium-web",
  display: "swap",
  weight: "400",
})

const bebas_neue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
  weight: "400",
})

const anton = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
  weight: "400",
})

const zilla_slab = Zilla_Slab({
  subsets: ["latin"],
  variable: "--font-zilla-slab",
  display: "swap",
  weight: "400",
})

const nunito_sans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
  weight: "400",
})

const roboto_slab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  display: "swap",
  weight: "400",
})

// local fonts
const fontSans = localFont({
  src: "../../assets/fonts/Inter-Regular.ttf",
  variable: "--font-sans",
})

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

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
