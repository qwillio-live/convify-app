import React from "react"
import FlowStateSetter from "../storeSetter"
import { unstable_setRequestLocale } from "next-intl/server"
import MetaGoogleAnalytics from "@/components/googleMetaAnalytics"
import StaticPublishedFile from "@/components/user/publishedFlowStaticFile"
import { env } from "@/env.mjs"
import Head from "next/head"
import localFont from "next/font/local"
import { redirect } from "next/navigation"
import { CookieConsentComponent } from "@/components/cookie-consent/CookieConsentComponent"

interface PageProps {
  params: {
    flowId: string
    locale: any
  }
  searchParams: {
    screen: string
  }
}

const fontMappings: Record<string, string> = {
  "--font-roboto": "Roboto:wght@100;300;400;500;700;900",
  "--font-inter": "Inter:wght@100;300;400;500;600;700;800;900",
  "--font-roboto-mono": "Roboto+Mono:wght@100;300;400;500;700",
  "--font-open-sans": "Open+Sans:wght@300;400;600;700",
  "--font-montserrat": "Montserrat:wght@100;300;400;500;600;700;800;900",
  "--font-lato": "Lato:wght@100;300;400;700;900",
  "--font-oswald": "Oswald:wght@400;700",
  "--font-raleway": "Raleway:wght@100;300;400;500;600;700;800;900",
  "--font-pt-sans": "PT+Sans:wght@400",
  "--font-merriweather": "Merriweather:wght@300;400;700;900",
  "--font-nunito": "Nunito:wght@200;300;400;600;700;800;900",
  "--font-playfair-display": "Playfair+Display:wght@400;700",
  "--font-poppins": "Poppins:wght@100;300;400;500;600;700;800;900",
  "--font-ubuntu": "Ubuntu:wght@300;400;500;700",
  "--font-mukta": "Mukta:wght@200;300;400;500;600;700",
  "--font-rubik": "Rubik:wght@300;400;500;600;700;900",
  "--font-work-sans": "Work+Sans:wght@100;300;400;500;600;700;800;900",
  "--font-roboto-condensed": "Roboto+Condensed:wght@300;400;700",
  "--font-noto-sans": "Noto+Sans:wght@100;300;400;500;700",
  "--font-fira-sans": "Fira+Sans:wght@100;300;400;500;700;900",
  "--font-quicksand": "Quicksand:wght@300;400;500;600;700",
  "--font-karla": "Karla:wght@300;400;500;600;700",
  "--font-cabin": "Cabin:wght@400;500;600;700",
  "--font-barlow": "Barlow:wght@100;300;400;500;600;700;900",
  "--font-arimo": "Arimo:wght@400;500;600;700",
  "--font-teko": "Teko:wght@300;400;500;600;700",
  "--font-catamaran": "Catamaran:wght@100;300;400;500;700;900",
  "--font-libre-franklin":
    "Libre+Franklin:wght@100;300;400;500;600;700;800;900",
  "--font-oxygen": "Oxygen:wght@300;400;700",
  "--font-heebo": "Heebo:wght@100;300;400;500;700;900",
  "--font-asap": "Asap:wght@100;300;400;500;700;900",
  "--font-bitter": "Bitter:wght@100;300;400;500;700;900",
  "--font-ibm-plex-sans": "IBM+Plex+Sans:wght@100;300;400;500;600;700",
  "--font-exo-2": "Exo+2:wght@100;300;400;500;600;700;800;900",
  "--font-dosis": "Dosis:wght@300;400;500;600;700",
  "--font-pt-serif": "PT+Serif:wght@400;700",
  "--font-overpass": "Overpass:wght@100;300;400;500;600;700;900",
  "--font-varela-round": "Varela+Round:wght@400",
  "--font-questrial": "Questrial:wght@400",
  "--font-inconsolata": "Inconsolata:wght@200;300;400;500;600;700;900",
  "--font-rokkitt": "Rokkitt:wght@100;300;400;500;700;900",
  "--font-red-hat-display": "Red+Hat+Display:wght@300;400;500;700;900",
  "--font-cairo": "Cairo:wght@200;300;400;500;600;700;900",
  "--font-lora": "Lora:wght@400;500;600;700",
  "--font-titillium-web": "Titillium+Web:wght@200;300;400;600;700;900",
  "--font-bebas-neue": "Bebas+Neue:wght@400",
  "--font-anton": "Anton:wght@400",
  "--font-zilla-slab": "Zilla+Slab:wght@300;400;500;600;700",
  "--font-nunito-sans": "Nunito+Sans:wght@200;300;400;500;600;700;900",
  "--font-roboto-slab": "Roboto+Slab:wght@100;300;400;500;600;700;900",
  "--font-sans3": "Source+Sans+3:wght@200;300;400;500;600;700;800;900",
}
const geist = localFont({
  variable: "--font-geist",
  src: [
    {
      path: "../../../../assets/fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
})
export default async function PublishedFlows({
  params,
  searchParams,
}: PageProps) {
  unstable_setRequestLocale(params.locale)
  const flowDomain = process.env.NEXT_PUBLIC_FLOW_DOMAIN || ""
  const flowId = params?.flowId

  const response = await fetch(`${flowDomain}/api/flows/published/${flowId}`, {
    method: "GET",
    cache: "default",
    next: { tags: ["publishedFlow"], revalidate: 0 },
  })
  const data = await response.json()
  const redirect_url = process.env.NOT_PUBLISHED_REDIRECT || ""
  if (data.length === 0) redirect(redirect_url)
  const screenNames = data?.steps?.map((screen) => screen.name)
  const screenName = searchParams?.screen || screenNames[0]

  const primaryFontKey =
    data?.flowSettings?.text?.primaryFont || "--font-roboto"
  const secondaryFontKey =
    data?.flowSettings?.text?.secondaryFont || "--font-inter"
    const showCookieConsentPopup = data?.flowSettings?.general?.showCookieConsentPopup ?? false
  const getFontImport = (fontKeys: string[]) => {
    const fontQueries = fontKeys
      .map((fontKey) => fontMappings[fontKey])
      .filter(Boolean)
      .join("&family=")

    return fontQueries
      ? `@import url('https://fonts.googleapis.com/css2?family=${fontQueries}&display=swap');`
      : ""
  }

  const primaryFontImport = getFontImport([primaryFontKey])
  const secondaryFontImport = getFontImport([secondaryFontKey])
  console.log(
    "primaryFontImport, secondaryFontImport",
    primaryFontImport,
    secondaryFontImport
  )

  // const styles = `
  // [font-family="${primaryFontKey}"] {
  //   font-family: ${fontMappings[primaryFontKey]
  //     .split(":")[0]
  //     .replace("+", " ")} !important;
  // }
  // [font-family="${secondaryFontKey}"] {
  //   font-family: ${fontMappings[secondaryFontKey]
  //     .split(":")[0]
  //     .replace("+", " ")} !important;
  // }`
  const cssVariables = `
    :root {
      ${Object.entries(fontMappings)
        .map(
          ([key, value]) =>
            `${key}: ${value.split(":")[0].replace(/\+/g, " ")};`
        )
        .join("\n")}
    }
  `
  console.log("cssVariables", cssVariables)
  return (
    <>
      <style>
        {`
            ${primaryFontImport}
            ${secondaryFontImport}
            ${cssVariables}
          `}
      </style>
      <div
        className={`${geist.variable}`}
        // style={{
        //   fontFamily: fontMappings[secondaryFontKey]
        //     ? fontMappings[secondaryFontKey]
        //         .split(":")[0] // Extract font family name
        //         .replace(/\+/g, " ") // Replace '+' with spaces
        //     : "sans-serif",
        // }}
      >
        <MetaGoogleAnalytics
          gtm={data?.integrations?.googleTagManagerId}
          gta={data?.integrations?.googleAnalyticsId}
          meta={data?.integrations?.metaPixelId}
        />
        {showCookieConsentPopup && <CookieConsentComponent/>}
        <FlowStateSetter flowData={data} screenNames={screenNames} />
        <StaticPublishedFile
          data={data}
          screenName={screenName === undefined ? screenNames[0] : screenName}
          allScreens={screenNames}
        />
      </div>
    </>
  )
}
