import { Dosis } from "next/font/google";

export const dosis = Dosis({
  subsets: ["latin"],
  variable: "--font-dosis",
  display: "swap",
  weight: ["300", "400", "500", "700", "800"],
});
