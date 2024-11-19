import { Overpass } from "next/font/google";

export const overpass = Overpass({
  subsets: ["latin"],
  variable: "--font-overpass",
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
});
