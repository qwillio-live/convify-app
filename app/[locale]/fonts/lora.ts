import { Lora } from "next/font/google";

export const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "500", "700", "600"],
});
