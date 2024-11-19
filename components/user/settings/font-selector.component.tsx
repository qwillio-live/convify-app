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
import { Check, ChevronDown } from "lucide-react"

interface FontSelectorProps {
  fontList: { name: string; variable: string }[] | undefined
  selectedFont: string | undefined
  handleFontChange: (value: string) => void
  label: string
  open: boolean
  setOpen: (value: boolean) => void
  defaultFont?: string
}
import { fontHeading } from "@/app/[locale]/fonts/fontHeading"
import { fontSans } from "@/app/[locale]/fonts/fontSans"
import { roboto_slab } from "@/app/[locale]/fonts/roboto_slab"
import { nunito_sans } from "@/app/[locale]/fonts/nunito_sans"
import { zilla_slab } from "@/app/[locale]/fonts/zilla_slab"
import { anton } from "@/app/[locale]/fonts/anton"
import { bebas_neue } from "@/app/[locale]/fonts/bebas_neue"
import { titillium_web } from "@/app/[locale]/fonts/titillium_web"
import { lora } from "@/app/[locale]/fonts/lora"
import { cairo } from "@/app/[locale]/fonts/cairo"
import { red_hat_display } from "@/app/[locale]/fonts/red_hat_display"
import { rokkitt } from "@/app/[locale]/fonts/rokkitt"
import { inconsolata } from "@/app/[locale]/fonts/inconsolata"
import { questrial } from "@/app/[locale]/fonts/questrial"
import { varela_round } from "@/app/[locale]/fonts/varela_round"
import { overpass } from "@/app/[locale]/fonts/overpass"
import { pt_serif } from "@/app/[locale]/fonts/pt_serif"
import { dosis } from "@/app/[locale]/fonts/dosis"
import { exo_2 } from "@/app/[locale]/fonts/exo_2"
import { ibm_plex_sans } from "@/app/[locale]/fonts/ibm_plex_sans"
import { bitter } from "@/app/[locale]/fonts/bitter"
import { asap } from "@/app/[locale]/fonts/asap"
import { heebo } from "@/app/[locale]/fonts/heebo"
import { oxygen } from "@/app/[locale]/fonts/oxygen"
import { libre_franklin } from "@/app/[locale]/fonts/libre_franklin"
import { catamaran } from "@/app/[locale]/fonts/catamaran"
import { teko } from "@/app/[locale]/fonts/teko"
import { arimo } from "@/app/[locale]/fonts/arimo"
import { barlow } from "@/app/[locale]/fonts/barlow"
import { cabin } from "@/app/[locale]/fonts/cabin"
import { karla } from "@/app/[locale]/fonts/karla"
import { quicksand } from "@/app/[locale]/fonts/quicksand"
import { fira_sans } from "@/app/[locale]/fonts/fira_sans"
import { noto_sans } from "@/app/[locale]/fonts/noto_sans"
import { roboto_condensed } from "@/app/[locale]/fonts/roboto_condensed"
import { work_sans } from "@/app/[locale]/fonts/work_sans"
import { rubik } from "@/app/[locale]/fonts/rubik"
import { mukta } from "@/app/[locale]/fonts/mukta"
import { ubuntu } from "@/app/[locale]/fonts/ubuntu"
import { poppins } from "@/app/[locale]/fonts/poppins"
import { playfair_display } from "@/app/[locale]/fonts/playfair_display"
import { nunito } from "@/app/[locale]/fonts/nunito"
import { merriweather } from "@/app/[locale]/fonts/merriweather"
import { pt_sans } from "@/app/[locale]/fonts/pt_sans"
import { raleway } from "@/app/[locale]/fonts/raleway"
import { lato } from "@/app/[locale]/fonts/lato"
import { montserrat } from "@/app/[locale]/fonts/montserrat"
import { open_sans } from "@/app/[locale]/fonts/open_sans"
import { roboto_mono } from "@/app/[locale]/fonts/roboto_mono"
import { oswald } from "@/app/[locale]/fonts/oswald"
import { inter } from "@/app/[locale]/fonts/inter"
import { roboto } from "@/app/[locale]/fonts/roboto"
import { sans3 } from "@/app/[locale]/fonts/sans3"
import { geist } from "../../../app/[locale]/fonts/geist"

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
