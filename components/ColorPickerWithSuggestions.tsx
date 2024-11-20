import { Separator } from "@radix-ui/react-select"
import { useTranslations } from "next-intl"
import { HexColorPicker } from "react-colorful"
import tinycolor from "tinycolor2"

const ColorPicker = ({ color, onChange }) => {
    const t = useTranslations("Components")
    return (
      <div className="space-y-2">
        <HexColorPicker color={color} onChange={onChange} />
        <div className="color-text-container">
          <input
            type="text"
            value={color||'#ffffff'}
            onChange={(e) => onChange(e.target.value)}
            className="focus:border-primary h-6 w-full rounded-sm border bg-white px-3 py-1 text-center text-xs font-normal leading-none focus:outline-none"
          />
        </div>
        <Separator className="!mt-3" />
        <span className="flex w-full justify-start text-xs font-normal text-[#7B7D80]">
          {t("suggestions")}
        </span>
      </div>
    )
  }
  
  export const ColorPickerWithSuggestions = ({ color, onChange }) => {
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
  
    const suggestions = generateSuggestions(color)
  
    return (
      <div className="rounded-lg border bg-white p-2">
        <ColorPicker color={color||'#ffffff'} onChange={onChange} />
        <div className="mt-2 grid grid-cols-5 gap-px">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="h-9 cursor-pointer rounded-sm"
              style={{ backgroundColor: suggestion }}
              onClick={() => onChange(suggestion)}
            />
          ))}
        </div>
      </div>
    )
  }
  