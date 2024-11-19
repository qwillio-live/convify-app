import { Teko } from "next/font/google";

export const teko = Teko({
  subsets: ["latin"],
  variable: "--font-teko",
  display: "swap",
  weight: ["300", "400", "500", "700", "600"],
});
