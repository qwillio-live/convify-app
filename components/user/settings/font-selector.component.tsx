import { Button } from "@/components/ui/button"
import {
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverPortal,
} from "@radix-ui/react-popover"
import { ChevronsUpDown, Check, ChevronDown } from "lucide-react"

interface FontSelectorProps {
  fontList: { name: string; variable: string }[] | undefined
  selectedFont: string | undefined
  handleFontChange: (value: string) => void
  label: string
  open: boolean
  setOpen: (value: boolean) => void
  defaultFont?: string
}
const geist = localFont({
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
})

import {
  anton,
  arimo,
  asap,
  barlow,
  bebas_neue,
  bitter,
  cabin,
  cairo,
  catamaran,
  dosis,
  exo_2,
  fira_sans,
  fontHeading,
  fontSans,
  heebo,
  ibm_plex_sans,
  inconsolata,
  inter,
  karla,
  lato,
  libre_franklin,
  lora,
  merriweather,
  montserrat,
  mukta,
  noto_sans,
  nunito,
  nunito_sans,
  open_sans,
  oswald,
  overpass,
  oxygen,
  playfair_display,
  poppins,
  pt_sans,
  pt_serif,
  questrial,
  quicksand,
  raleway,
  red_hat_display,
  roboto,
  roboto_condensed,
  roboto_mono,
  roboto_slab,
  rokkitt,
  rubik,
  teko,
  titillium_web,
  ubuntu,
  varela_round,
  work_sans,
  zilla_slab,
  sans3,
} from "@/app/[locale]/fonts"
import { getTranslations } from "next-intl/server"
import localFont from "next/font/local"

const fontVariable = `
    ${roboto.variable}
    ${fontSans.variable}
    ${fontHeading.variable}
    ${inter.variable}
    ${roboto_mono.variable}
    ${geist.variable}
    ${open_sans.variable}
    ${montserrat.variable}
    ${lato.variable}
    ${oswald.variable}
    ${raleway.variable}
    ${pt_sans.variable}
    ${merriweather.variable}
    ${nunito.variable}
    ${playfair_display.variable}
    ${poppins.variable}
    ${ubuntu.variable}
    ${mukta.variable}
    ${rubik.variable}
    ${work_sans.variable}
    ${roboto_condensed.variable}
    ${noto_sans.variable}
    ${fira_sans.variable}
    ${quicksand.variable}
    ${karla.variable}
    ${cabin.variable}
    ${barlow.variable}
    ${arimo.variable}
    ${teko.variable}
    ${catamaran.variable}
    ${libre_franklin.variable}
    ${oxygen.variable}
    ${heebo.variable}
    ${asap.variable}
    ${bitter.variable}
    ${ibm_plex_sans.variable}
    ${exo_2.variable}
    ${dosis.variable}
    ${pt_serif.variable}
    ${overpass.variable}
    ${varela_round.variable}
    ${questrial.variable}
    ${inconsolata.variable}
    ${rokkitt.variable}
    ${red_hat_display.variable}
    ${cairo.variable}
    ${lora.variable}
    ${titillium_web.variable}
    ${bebas_neue.variable}
    ${anton.variable}
    ${zilla_slab.variable}
    ${nunito_sans.variable}
    ${roboto_slab.variable}
    ${sans3.variable}`
export const FontSelector = ({
  fontList,
  selectedFont,
  handleFontChange,
  label,
  open,
  setOpen,
  defaultFont,
}: FontSelectorProps) => (

  <div className="space-y-2">
    <Label htmlFor={label}>{label}</Label>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="bg-card flex h-9 w-full items-center justify-between border-inherit px-3 py-2 text-xs font-normal"
        >
          {selectedFont ? (
            <>
              {fontList?.find((font) => font.variable === selectedFont)?.name}
              <ChevronDown className="ml-2 size-4 shrink-0 text-[#7B7D80] opacity-50" />
            </>
          ) : defaultFont ? (
            defaultFont
          ) : (
            `Select ${label.toLowerCase()}`
          )}
        </Button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent className="z-10 w-[--radix-popover-trigger-width] p-0">
          <ScrollArea className={`${fontVariable}  h-72 rounded-md border `}>
            <Command>
              <CommandInput placeholder="Search font..." />
              <CommandEmpty>No font found.</CommandEmpty>
              <CommandGroup>
                {fontList?.map((font) => (
                  <CommandItem
                    key={font.variable}
                    value={font.variable}
                    onSelect={(currentValue) => {
                      handleFontChange(currentValue)
                      setOpen(false)
                    }}
                    style={{ fontFamily: `var(${font.variable})` }}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        selectedFont === font.variable
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {font.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </ScrollArea>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  </div>

)
