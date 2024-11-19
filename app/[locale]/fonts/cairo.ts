import { Cairo } from "next/font/google";

export const cairo = Cairo({
  subsets: ["latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["200", "300", "400", "500", "700", "900"],
});
