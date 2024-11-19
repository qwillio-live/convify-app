import { Noto_Sans } from "next/font/google";

export const noto_sans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
});
