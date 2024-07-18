export type FontType = {
  name: string
  variable: string
}
export type PrimaryFontType = FontType[]
export type SecondaryFontType = FontType[]

interface FontTypes {
  primaryFonts: PrimaryFontType
  secondaryFonts: SecondaryFontType
}
export const FONTS: FontTypes = {
  primaryFonts: [
    {
      name: "Roboto",
      variable: "--font-roboto",
    },
    {
      name: "Open Sans",
      variable: "--font-open-sans",
    },
    {
      name: "Montserrat",
      variable: "--font-montserrat",
    },
    {
      name: "Lato",
      variable: "--font-lato",
    },
    {
      name: "Oswald",
      variable: "--font-oswald",
    },
    {
      name: "Raleway",
      variable: "--font-raleway",
    },
    {
      name: "PT Sans",
      variable: "--font-pt-sans",
    },
    {
      name: "Merriweather",
      variable: "--font-merriweather",
    },
    {
      name: "Nunito",
      variable: "--font-nunito",
    },
    {
      name: "Playfair Display",
      variable: "--font-playfair-display",
    },
    {
      name: "Poppins",
      variable: "--font-poppins",
    },
    {
      name: "Ubuntu",
      variable: "--font-ubuntu",
    },
    {
      name: "Mukta",
      variable: "--font-mukta",
    },
    {
      name: "Rubik",
      variable: "--font-rubik",
    },
    {
      name: "Work Sans",
      variable: "--font-work-sans",
    },
    {
      name: "Roboto Condensed",
      variable: "--font-roboto-condensed",
    },
    {
      name: "Noto Sans",
      variable: "--font-noto-sans",
    },
    {
      name: "Fira Sans",
      variable: "--font-fira-sans",
    },
    {
      name: "Quicksand",
      variable: "--font-quicksand",
    },
    {
      name: "Karla",
      variable: "--font-karla",
    },
    {
      name: "Cabin",
      variable: "--font-cabin",
    },
    {
      name: "Barlow",
      variable: "--font-barlow",
    },
    {
      name: "Arimo",
      variable: "--font-arimo",
    },
    {
      name: "Teko",
      variable: "--font-teko",
    },
    {
      name: "Catamaran",
      variable: "--font-catamaran",
    },
    {
      name: "Libre Franklin",
      variable: "--font-libre-franklin",
    },
    {
      name: "Oxygen",
      variable: "--font-oxygen",
    },
    {
      name: "Heebo",
      variable: "--font-heebo",
    },
    {
      name: "Asap",
      variable: "--font-asap",
    },
    {
      name: "Bitter",
      variable: "--font-bitter",
    },
    {
      name: "IBM Plex Sans",
      variable: "--font-ibm-plex-sans",
    },
    {
      name: "Exo 2",
      variable: "--font-exo-2",
    },
    {
      name: "Dosis",
      variable: "--font-dosis",
    },
    {
      name: "PT Serif",
      variable: "--font-pt-serif",
    },
    {
      name: "Overpass",
      variable: "--font-overpass",
    },
    {
      name: "Varela Round",
      variable: "--font-varela-round",
    },
    {
      name: "Questrial",
      variable: "--font-questrial",
    },
    {
      name: "Inconsolata",
      variable: "--font-inconsolata",
    },
    {
      name: "Rokkitt",
      variable: "--font-rokkitt",
    },
    {
      name: "Red Hat Display",
      variable: "--font-red-hat-display",
    },
    {
      name: "Cairo",
      variable: "--font-cairo",
    },
    {
      name: "Lora",
      variable: "--font-lora",
    },
    {
      name: "Source Sans Pro",
      variable: "--font-sans3",
    },
    {
      name: "Titillium Web",
      variable: "--font-titillium-web",
    },
    {
      name: "Bebas Neue",
      variable: "--font-bebas-neue",
    },
    {
      name: "Anton",
      variable: "--font-anton",
    },
    {
      name: "Zilla Slab",
      variable: "--font-zilla-slab",
    },
    {
      name: "Nunito Sans",
      variable: "--font-nunito-sans",
    },
    {
      name: "Roboto Slab",
      variable: "--font-roboto-slab",
    },
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
      variable: "--font-cal-sans",
    },
  ],
  secondaryFonts: [
    {
      name: "Roboto",
      variable: "--font-roboto",
    },
    {
      name: "Open Sans",
      variable: "--font-open-sans",
    },
    {
      name: "Montserrat",
      variable: "--font-montserrat",
    },
    {
      name: "Lato",
      variable: "--font-lato",
    },
    {
      name: "Oswald",
      variable: "--font-oswald",
    },
    {
      name: "Raleway",
      variable: "--font-raleway",
    },
    {
      name: "PT Sans",
      variable: "--font-pt-sans",
    },
    {
      name: "Merriweather",
      variable: "--font-merriweather",
    },
    {
      name: "Nunito",
      variable: "--font-nunito",
    },
    {
      name: "Playfair Display",
      variable: "--font-playfair-display",
    },
    {
      name: "Poppins",
      variable: "--font-poppins",
    },
    {
      name: "Ubuntu",
      variable: "--font-ubuntu",
    },
    {
      name: "Mukta",
      variable: "--font-mukta",
    },
    {
      name: "Rubik",
      variable: "--font-rubik",
    },
    {
      name: "Work Sans",
      variable: "--font-work-sans",
    },
    {
      name: "Roboto Condensed",
      variable: "--font-roboto-condensed",
    },
    {
      name: "Noto Sans",
      variable: "--font-noto-sans",
    },
    {
      name: "Fira Sans",
      variable: "--font-fira-sans",
    },
    {
      name: "Quicksand",
      variable: "--font-quicksand",
    },
    {
      name: "Karla",
      variable: "--font-karla",
    },
    {
      name: "Cabin",
      variable: "--font-cabin",
    },
    {
      name: "Barlow",
      variable: "--font-barlow",
    },
    {
      name: "Arimo",
      variable: "--font-arimo",
    },
    {
      name: "Teko",
      variable: "--font-teko",
    },
    {
      name: "Catamaran",
      variable: "--font-catamaran",
    },
    {
      name: "Libre Franklin",
      variable: "--font-libre-franklin",
    },
    {
      name: "Oxygen",
      variable: "--font-oxygen",
    },
    {
      name: "Heebo",
      variable: "--font-heebo",
    },
    {
      name: "Asap",
      variable: "--font-asap",
    },
    {
      name: "Bitter",
      variable: "--font-bitter",
    },
    {
      name: "IBM Plex Sans",
      variable: "--font-ibm-plex-sans",
    },
    {
      name: "Exo 2",
      variable: "--font-exo-2",
    },
    {
      name: "Dosis",
      variable: "--font-dosis",
    },
    {
      name: "PT Serif",
      variable: "--font-pt-serif",
    },
    {
      name: "Overpass",
      variable: "--font-overpass",
    },
    {
      name: "Varela Round",
      variable: "--font-varela-round",
    },
    {
      name: "Questrial",
      variable: "--font-questrial",
    },
    {
      name: "Inconsolata",
      variable: "--font-inconsolata",
    },
    {
      name: "Rokkitt",
      variable: "--font-rokkitt",
    },
    {
      name: "Red Hat Display",
      variable: "--font-red-hat-display",
    },
    {
      name: "Cairo",
      variable: "--font-cairo",
    },
    {
      name: "Lora",
      variable: "--font-lora",
    },
    {
      name: "Titillium Web",
      variable: "--font-titillium-web",
    },
    {
      name: "Bebas Neue",
      variable: "--font-bebas-neue",
    },
    {
      name: "Anton",
      variable: "--font-anton",
    },
    {
      name: "Zilla Slab",
      variable: "--font-zilla-slab",
    },
    {
      name: "Nunito Sans",
      variable: "--font-nunito-sans",
    },
    {
      name: "Roboto Slab",
      variable: "--font-roboto-slab",
    },
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
      variable: "--font-cal-sans",
    },
  ],
}
