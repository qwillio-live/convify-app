'use client'

import React, { useState, useCallback, useMemo } from 'react'
import tinycolor from "tinycolor2"
import { debounce } from 'lodash'
import "../styles/colorInput.css"
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import { useTranslations } from 'next-intl'
import { Separator } from './ui/separator'


interface ToolbarColorPickerProps {
    value: string
    onChange: (color: string) => void
    className?: string
}

export function ToolbarColorPicker({ value, onChange, className }: ToolbarColorPickerProps) {
  const t = useTranslations("Components")

    const [isOpen, setIsOpen] = useState(false)
    const [tempColor, setTempColor] = useState(value)

    const debouncedOnChange = useCallback(
        debounce((color: string) => {
            onChange(color)
        }, 100),
        [onChange]
    )
    const handleColorChange = (value: string) => {
        const newColor = value
        setTempColor(newColor)
        debouncedOnChange(newColor)
    }

    const toggleColorPicker = () => {
        setIsOpen(!isOpen)
        if (!isOpen) {
            setTempColor(value)
        }
    }


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
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild >
          <button className='mx-2' onClick={(e) => {
            e.preventDefault()
            toggleColorPicker()
          }}>
            <div
            style={{
              backgroundColor: value
            }}
            className="border-input size-6 rounded-md">
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
        onOpenAutoFocus={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}
        onMouseUp={() => setIsOpen(false)}
        className="p-2 w-64 left-0" side="right">
          <HexColorPicker color={tempColor} onChange={handleColorChange}/>
          <HexColorInput
            prefixed
            color={tempColor} onChange={handleColorChange}
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
                onClick={() => handleColorChange(suggestion)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

    )

    // return (
    //     <div className={cn("relative", className)}>
    //         <Button
    //             variant="ghost"
    //             size="icon"
    //             className={cn("p-0 w-6 h-6 rounded-sm", className)}
    //             style={{ backgroundColor: value }}
    //             onClick={toggleColorPicker}
    //             aria-label="Select text color"
    //         />
    //         {isOpen && (
    //             <div className="absolute top-full mt-1 left-0 bg-popover p-2 rounded-md shadow-md z-50">
    //                 <div className="flex flex-col space-y-2">
    //                     <div className="flex items-center justify-between">
    //                         <Label htmlFor="color-input" className="text-xs">Color</Label>
    //                         <div
    //                             className="w-4 h-4 rounded-sm border border-border"
    //                             style={{ backgroundColor: tempColor }}
    //                         />
    //                     </div>
    //                     <div className="flex items-center space-x-2">
    //                         <Input
    //                             ref={inputRef}
    //                             id="color-input"
    //                             type="color"
    //                             value={tempColor}
    //                             onChange={handleColorChange}
    //                             className="h-8 w-8 p-0 border-0"
    //                         />
    //                         <Input
    //                             type="text"
    //                             value={tempColor}
    //                             onChange={(e) => {
    //                                 setTempColor(e.target.value)
    //                                 onChange(e.target.value)
    //                             }}
    //                             className="flex-grow h-8 text-xs"
    //                         />
    //                     </div>
    //                 </div>
    //             </div>
    //         )}
    //     </div>
    // )
}
