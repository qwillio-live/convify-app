import { Heebo } from "next/font/google";

export const heebo = Heebo({
  subsets: ["latin"],
  variable: "--font-heebo",
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
});
