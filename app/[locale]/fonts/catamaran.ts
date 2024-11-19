import { Catamaran } from "next/font/google";

export const catamaran = Catamaran({
  subsets: ["latin"],
  variable: "--font-catamaran",
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
});
