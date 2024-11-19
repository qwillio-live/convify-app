import { Barlow } from "next/font/google";

export const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
});
