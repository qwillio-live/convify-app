import { IBM_Plex_Sans } from "next/font/google";

export const ibm_plex_sans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "200"],
});
