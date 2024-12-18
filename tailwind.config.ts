const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        xs: ["0.75rem", "1.05rem"],
      },
      height: {
        "8.5": "2.125rem",
        "9.5": "2.375rem",
      },
      fontFamily: {
        geist: ["var(--font-geist)"],
        sans: ["var(--font-sans)"],
        inter: ["var(--font-inter)"],
        roboto: ["var(--font-roboto)"],
        heading: ["var(--font-cal-sans)"],
        roboto_mono: ["var(--font-roboto-mono)"],
        open_sans: ["var(--font-open-sans)"],
        montserrat: ["var(--font-montserrat)"],
        lato: ["var(--font-lato)"],
        oswald: ["var(--font-oswald)"],
        raleway: ["var(--font-raleway)"],
        pt_sans: ["var(--font-pt-sans)"],
        merriweather: ["var(--font-merriweather)"],
        nunito: ["var(--font-nunito)"],
        playfair_display: ["var(--font-playfair-display)"],
        poppins: ["var(--font-poppins)"],
        ubuntu: ["var(--font-ubuntu)"],
        mukta: ["var(--font-mukta)"],
        rubik: ["var(--font-rubik)"],
        work_sans: ["var(--font-work-sans)"],
        roboto_condensed: ["var(--font-roboto-condensed)"],
        noto_sans: ["var(--font-noto-sans)"],
        fira_sans: ["var(--font-fira-sans)"],
        quicksand: ["var(--font-quicksand)"],
        karla: ["var(--font-karla)"],
        cabin: ["var(--font-cabin)"],
        barlow: ["var(--font-barlow)"],
        arimo: ["var(--font-arimo)"],
        teko: ["var(--font-teko)"],
        catamaran: ["var(--font-catamaran)"],
        libre_franklin: ["var(--font-libre-franklin)"],
        oxygen: ["var(--font-oxygen)"],
        heebo: ["var(--font-heebo)"],
        asap: ["var(--font-asap)"],
        bitter: ["var(--font-bitter)"],
        ibm_plex_sans: ["var(--font-ibm-plex-sans)"],
        exo_2: ["var(--font-exo-2)"],
        dosis: ["var(--font-dosis)"],
        pt_serif: ["var(--font-pt-serif)"],
        overpass: ["var(--font-overpass)"],
        varela_round: ["var(--font-varela-round)"],
        questrial: ["var(--font-questrial)"],
        inconsolata: ["var(--font-inconsolata)"],
        rokkitt: ["var(--font-rokkitt)"],
        red_hat_display: ["var(--font-red-hat-display)"],
        cairo: ["var(--font-cairo)"],
        lora: ["var(--font-lora)"],
        titillium_web: ["var(--font-titillium-web)"],
        bebas_neue: ["var(--font-bebas-neue)"],
        anton: ["var(--font-anton)"],
        zilla_slab: ["var(--font-zilla-slab)"],
        nunito_sans: ["var(--font-nunito-sans)"],
        roboto_slab: ["var(--font-roboto-slab)"],
        sans3: ["var(--font-sans3)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shake: {
          "10%, 90%": {
            transform: "translate3d(-1px, 0, 0)",
          },
          "20%, 80%": {
            transform: "translate3d(2px, 0, 0)",
          },
          "30%, 50%, 70%": {
            transform: "translate3d(-4px, 0, 0)",
          },
          "40%, 60%": {
            transform: "translate3d(4px, 0, 0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/line-clamp")],
}
// satisfies Config

export default config