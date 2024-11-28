'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { cn } from "@/lib/utils"
import { debounce } from 'lodash'
import "../styles/colorInput.css"
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { HexColorInput, HexColorPicker } from 'react-colorful'


interface ToolbarColorPickerProps {
    value: string
    onChange: (color: string) => void
    className?: string
}

export function ToolbarColorPicker({ value, onChange, className }: ToolbarColorPickerProps) {
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
        className="p-2 w-64 left-0" side="right">
          <HexColorPicker color={tempColor} onChange={handleColorChange}/>
          <HexColorInput
            prefixed
            color={tempColor} onChange={handleColorChange}
            className="w-full mt-2 border rounded text-center"/>
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
