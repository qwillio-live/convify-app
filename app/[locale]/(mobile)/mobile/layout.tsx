interface AuthLayoutProps {
  children: React.ReactNode
}
import localFont from "next/font/local"
import { env } from "@/env.mjs"

export const metadata = {
  title: process.env.APP_NAME + " - Create",
}
const geist = localFont({
  variable: "--font-geist",
  src: [
    {
      path: "../../../../assets/fonts/Geist-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../../../assets/fonts/Geist-UltraBlack.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../../assets/fonts/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../../assets/fonts/Geist-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../../assets/fonts/Geist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../../assets/fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../assets/fonts/Geist-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../../assets/fonts/Geist-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../../assets/fonts/Geist-Thin.woff2",
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
} from "../../fonts"
export default function MobileLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className={`
        ${roboto.className}
        ${fontSans.className}
        ${fontHeading.className}
        ${inter.className}
        ${roboto_mono.className}
        ${geist.className}
        ${open_sans.className}
        ${montserrat.className}
        ${lato.className}
        ${oswald.className}
        ${raleway.className}
        ${pt_sans.className}
        ${merriweather.className}
        ${nunito.className}
        ${playfair_display.className}
        ${poppins.className}
        ${ubuntu.className}
        ${mukta.className}
        ${rubik.className}
        ${work_sans.className}
        ${roboto_condensed.className}
        ${noto_sans.className}
        ${fira_sans.className}
        ${quicksand.className}
        ${karla.className}
        ${cabin.className}
        ${barlow.className}
        ${arimo.className}
        ${teko.className}
        ${catamaran.className}
        ${libre_franklin.className}
        ${oxygen.className}
        ${heebo.className}
        ${asap.className}
        ${bitter.className}
        ${ibm_plex_sans.className}
        ${exo_2.className}
        ${dosis.className}
        ${pt_serif.className}
        ${overpass.className}
        ${varela_round.className}
        ${questrial.className}
        ${inconsolata.className}
        ${rokkitt.className}
        ${red_hat_display.className}
        ${cairo.className}
        ${lora.className}
        ${titillium_web.className}
        ${bebas_neue.className}
        ${anton.className}
        ${zilla_slab.className}
        ${nunito_sans.className}
        ${roboto_slab.className}
        ${sans3.className}
      `}
    >
      {children}
    </div>
  )
}
