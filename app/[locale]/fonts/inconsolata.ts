import { Inconsolata } from "next/font/google";

export const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
  display: "swap",
  weight: ["200", "300", "400", "500", "700", "900"],
});
