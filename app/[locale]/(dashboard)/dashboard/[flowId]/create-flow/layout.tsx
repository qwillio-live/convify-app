import StoreProvider from "@/lib/state/flows-state/store-provider"
import React from "react"
import { cn } from "@/lib/utils"

interface FlowsLayoutProps {
  children?: React.ReactNode
}
import { env } from "@/env.mjs"
import { getTranslations } from "next-intl/server"

const APP_NAME = process.env.APP_NAME

export async function generateMetadata() {
  const t = await getTranslations("Components") // Fetch translations

  return {
    title: `${APP_NAME} - ${t("Create")}`, // Use translations for title
  }
}
import localFont from "next/font/local"

const geist = localFont({
  variable: "--font-geist",
  src: [
    {
      path: "../../../../../../assets/fonts/Geist-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../../../../../assets/fonts/Geist-UltraBlack.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../../../../assets/fonts/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../../../../assets/fonts/Geist-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../../../../assets/fonts/Geist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../../../../assets/fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../../../assets/fonts/Geist-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../../../../assets/fonts/Geist-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../../../../assets/fonts/Geist-Thin.woff2",
      weight: "100",
      style: "normal",
    },
  ],
})

import { fontHeading } from "@/app/[locale]/fonts/fontHeading"
import { fontSans } from "@/app/[locale]/fonts/fontSans"
import { roboto_slab } from "@/app/[locale]/fonts/roboto_slab"
import { nunito_sans } from "@/app/[locale]/fonts/nunito_sans"
import { zilla_slab } from "@/app/[locale]/fonts/zilla_slab"
import { anton } from "@/app/[locale]/fonts/anton"
import { bebas_neue } from "@/app/[locale]/fonts/bebas_neue"
import { titillium_web } from "@/app/[locale]/fonts/titillium_web"
import { lora } from "@/app/[locale]/fonts/lora"
import { cairo } from "@/app/[locale]/fonts/cairo"
import { red_hat_display } from "@/app/[locale]/fonts/red_hat_display"
import { rokkitt } from "@/app/[locale]/fonts/rokkitt"
import { inconsolata } from "@/app/[locale]/fonts/inconsolata"
import { questrial } from "@/app/[locale]/fonts/questrial"
import { varela_round } from "@/app/[locale]/fonts/varela_round"
import { overpass } from "@/app/[locale]/fonts/overpass"
import { pt_serif } from "@/app/[locale]/fonts/pt_serif"
import { dosis } from "@/app/[locale]/fonts/dosis"
import { exo_2 } from "@/app/[locale]/fonts/exo_2"
import { ibm_plex_sans } from "@/app/[locale]/fonts/ibm_plex_sans"
import { bitter } from "@/app/[locale]/fonts/bitter"
import { asap } from "@/app/[locale]/fonts/asap"
import { heebo } from "@/app/[locale]/fonts/heebo"
import { oxygen } from "@/app/[locale]/fonts/oxygen"
import { libre_franklin } from "@/app/[locale]/fonts/libre_franklin"
import { catamaran } from "@/app/[locale]/fonts/catamaran"
import { teko } from "@/app/[locale]/fonts/teko"
import { arimo } from "@/app/[locale]/fonts/arimo"
import { barlow } from "@/app/[locale]/fonts/barlow"
import { cabin } from "@/app/[locale]/fonts/cabin"
import { karla } from "@/app/[locale]/fonts/karla"
import { quicksand } from "@/app/[locale]/fonts/quicksand"
import { fira_sans } from "@/app/[locale]/fonts/fira_sans"
import { noto_sans } from "@/app/[locale]/fonts/noto_sans"
import { roboto_condensed } from "@/app/[locale]/fonts/roboto_condensed"
import { work_sans } from "@/app/[locale]/fonts/work_sans"
import { rubik } from "@/app/[locale]/fonts/rubik"
import { mukta } from "@/app/[locale]/fonts/mukta"
import { ubuntu } from "@/app/[locale]/fonts/ubuntu"
import { poppins } from "@/app/[locale]/fonts/poppins"
import { playfair_display } from "@/app/[locale]/fonts/playfair_display"
import { nunito } from "@/app/[locale]/fonts/nunito"
import { merriweather } from "@/app/[locale]/fonts/merriweather"
import { pt_sans } from "@/app/[locale]/fonts/pt_sans"
import { raleway } from "@/app/[locale]/fonts/raleway"
import { lato } from "@/app/[locale]/fonts/lato"
import { montserrat } from "@/app/[locale]/fonts/montserrat"
import { open_sans } from "@/app/[locale]/fonts/open_sans"
import { roboto_mono } from "@/app/[locale]/fonts/roboto_mono"
import { oswald } from "@/app/[locale]/fonts/oswald"
import { inter } from "@/app/[locale]/fonts/inter"
import { roboto } from "@/app/[locale]/fonts/roboto"
import { sans3 } from "@/app/[locale]/fonts/sans3"
export default async function FlowsLayout({ children }: FlowsLayoutProps) {
  return <div
  className={cn(
    "flex h-screen flex-col space-y-6 bg-white",
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
><>{children}</>
</div>
}
