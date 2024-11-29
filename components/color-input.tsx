import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import tinycolor from "tinycolor2"
import { useTranslations } from "next-intl"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { HexColorInput, HexColorPicker } from "react-colorful"
import { Separator } from "./ui/separator"
import { useMemo } from "react"

interface ColorInputProps {
  value?: string | undefined | null
  handleChange: (e: string) => void
  handleRemove?: () => void
  className?: string
}

export function ColorInput({
  value,
  handleChange,
  handleRemove,
  className,
}: ColorInputProps) {
  const t = useTranslations("Components")

  const generateSuggestions = (baseColor) => {
    const colorObj = tinycolor(baseColor)
    return [
      colorObj.darken(10).toHexString(),
      colorObj.desaturate(10).toHexString(),
      colorObj.lighten(5).toHexString(),
      colorObj.lighten(20).toHexString(),
      colorObj.lighten(10).toHexString(),
    ]
  }

  const suggestions = useMemo(() => generateSuggestions(value), [value])

  return (
    <Popover>
      <div className={cn("flex items-center gap-2", className)}>
        <PopoverTrigger asChild>
          <div
            style={{
              backgroundColor:
                typeof value === "string" && value[0] === "#"
                  ? value
                  : "transparent",
            }}
            className="relative h-[32px] w-[62px] overflow-hidden rounded-md"
          >
            {!(typeof value === "string"  && value[0] === "#") && (
              <div className="absolute inset-0 z-0 grid place-content-center rounded-md border bg-[#FAFAFA] text-xs text-[#7B7D80]">
                Choose
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-64 left-0" side="left">
          <HexColorPicker color={value ? value : undefined} onChange={handleChange}/>
          <HexColorInput
            prefixed
            color={value ? value : undefined} onChange={handleChange}
            className="w-full mt-2 border rounded text-center"/>
          <Separator className="!mt-3" />
          <span className="flex w-full justify-start text-xs font-normal text-[#7B7D80] mt-1">
            {t("suggestions")}
          </span>
          <div className="mt-2 grid grid-cols-5 gap-px">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="h-9 cursor-pointer rounded-sm"
                style={{ backgroundColor: suggestion }}
                onClick={() => handleChange(suggestion)}
              />
            ))}
          </div>
        </PopoverContent>
        {!!handleRemove
          ? typeof value === "string"  && value[0] === "#" && (
              <span onClick={() => handleRemove()}>
                <X size={16} className={"text-muted-foreground cursor-pointer"} />
              </span>
            )
          : null}
      </div>
    </Popover>
  )
}
