import StoreProvider from "@/lib/state/flows-state/store-provider"
import React from "react"
import { redirect } from "next/navigation"
import { FlowsAutoSaveProvider } from "./autoSyncProvider"

interface FlowsLayoutProps {
  children?: React.ReactNode
  params: { flowId: string }
}
import localFont from "next/font/local"
import { env } from "@/env.mjs"

export async function generateMetadata() {
  const t = await getTranslations("Components") // Fetch translations
  const APP_NAME = process.env.APP_NAME
  return {
    title: `${APP_NAME} - ${t("Create")}`, // Use translations for title
  }
}
const geist = localFont({
  variable: "--font-geist",
  src: [
    {
      path: "../../../../../assets/fonts/Geist-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../../../../assets/fonts/Geist-UltraBlack.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../../../assets/fonts/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../../../assets/fonts/Geist-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../../../assets/fonts/Geist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../../../assets/fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../../assets/fonts/Geist-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../../../assets/fonts/Geist-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../../../assets/fonts/Geist-Thin.woff2",
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
} from "../../../fonts"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"
import ReactQueryProvider from "@/components/react-query-provider"
export default async function FlowsLayout({
  children,
  params: { flowId },
}: FlowsLayoutProps) {
  return (
    <main
      className={cn(
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
      <StoreProvider>
        <ReactQueryProvider>
          <FlowsAutoSaveProvider flowId={flowId}>
            <div className="font-sans">{children}</div>
          </FlowsAutoSaveProvider>
        </ReactQueryProvider>
      </StoreProvider>
    </main>
  )
}
