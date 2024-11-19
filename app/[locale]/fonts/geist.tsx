import localFont from "next/font/local";

export const geist = localFont({
  variable: "--font-geist",
  src: [
    {
      path: "../../../assets/fonts/Geist-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/Geist-UltraBlack.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/Geist-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/Geist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/Geist-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/Geist-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/Geist-Thin.woff2",
      weight: "100",
      style: "normal",
    },
  ],
});
