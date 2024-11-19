import { Bitter } from "next/font/google";

export const bitter = Bitter({
  subsets: ["latin"],
  variable: "--font-bitter",
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
});
