export type FontType = {
  name: string;
  variable: string;
}
export type PrimaryFontType = FontType[];
export type SecondaryFontType = FontType[];

interface FontTypes{
  primaryFonts: PrimaryFontType;
  secondaryFonts: SecondaryFontType;
}
export const FONTS: FontTypes = {
  primaryFonts: [
    {
      name: "Inter",
      variable: "--font-inter",
    },
    {
      name: "Roboto Mono",
      variable: "--font-roboto-mono",
    },
    {
      name: "Inter-Sans",
      variable: "--font-sans",
    },
    {
      name: "CalSans",
      variable: "--font-heading",
    },
  ],
  secondaryFonts: [
    {
      name: "Inter",
      variable: "--font-inter",
    },
    {
      name: "Roboto Mono",
      variable: "--font-roboto-mono",
    },
    {
      name: "Inter-Sans",
      variable: "--font-sans",
    },
    {
      name: "CalSans",
      variable: "--font-heading",
    },
  ],
}
