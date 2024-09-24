import { useAppDispatch } from "@/lib/state/flows-state/hooks"
import React, { useState, useCallback, useEffect } from "react"
import ColorPicker from "react-pick-color"
import { X } from "lucide-react"
import { debounce } from "lodash"
import { setPartialStyles } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useTranslations } from "next-intl"

const ColorButton = ({
  label,
  currentValue,
  styleKey,
  setProp,
}: {
  label: string
  currentValue: string
  styleKey: string
  setProp?: Function
}) => {
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const t = useTranslations("Components")

  const debouncedDispatch = useCallback(
    debounce(
      (value) => {
        dispatch(setPartialStyles(value))
      },
      200,
      {
        maxWait: 400,
      }
    ),
    [dispatch]
  )

  const handleStyleChangeDebounced = (style) => {
    debouncedDispatch(style)
  }

  const handleClickOutside = (event: MouseEvent) => {
    // Check if the click is outside the color picker
    const colorPickerElement = document.getElementById("color-picker")
    if (
      colorPickerElement &&
      !colorPickerElement.contains(event.target as Node)
    ) {
      setPickerVisible(false)
    }
  }

  useEffect(() => {
    if (isPickerVisible) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPickerVisible])

  return (
    <div className="col-span-2 flex flex-row items-center space-x-2">
      <label className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {t(label)}
      </label>

      {/* Display the color picker or the chosen color */}
      {currentValue === "#ffffff" ? (
        <button
          onClick={() => setPickerVisible(!isPickerVisible)}
          className="h-9 w-20 rounded-xl border border-gray-300 text-sm text-gray-500"
        >
          Choose
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <div
            className="h-9 w-10 rounded-lg"
            style={{ backgroundColor: currentValue }}
            onClick={() => setPickerVisible(!isPickerVisible)}
          />
          <button
            onClick={() => {
              if (setProp) {
                setProp([styleKey], "#ffffff")
              } else {
                handleStyleChangeDebounced({
                  general: { [styleKey]: "#ffffff" },
                })
              }
            }}
          >
            <X
              size={15}
              onClick={() => {
                if (setProp) {
                  setProp([styleKey], "#ffffff")
                } else {
                  handleStyleChangeDebounced({
                    general: { [styleKey]: "#ffffff" },
                  })
                }
              }}
            />
          </button>
        </div>
      )}

      {/* Display ColorPicker when button is clicked */}
      {isPickerVisible && (
        <div id="color-picker" className="  !absolute mt-[350px]  !bg-white">
          <ColorPicker
            className="relative z-10"
            color={currentValue}
            onChange={(e) => {
              if (setProp) {
                setProp([styleKey], e.hex)
              } else {
                handleStyleChangeDebounced({
                  general: { [styleKey]: e.hex },
                })
              }
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ColorButton
