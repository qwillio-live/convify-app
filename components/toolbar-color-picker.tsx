'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { cn } from "@/lib/utils"
import { debounce } from 'lodash'
import "../styles/colorInput.css"
import { ColorInput } from './color-input'


interface ToolbarColorPickerProps {
    value: string
    onChange: (color: string) => void
    className?: string
}

export function ToolbarColorPicker({ value, onChange, className }: ToolbarColorPickerProps) {
    const [tempColor, setTempColor] = useState(value)

    const debouncedOnChange = useCallback(
        debounce((color: string) => {
            onChange(color)
        }, 100),
        [onChange]
    )
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value
        setTempColor(newColor)
        debouncedOnChange(newColor)
    }

    return (
      <div id="swatch" className="relative mx-2">
        <ColorInput
          id="color"
          type="squared"
          inputSize="sm"
          value={tempColor}
          handleChange={handleColorChange}
        />
      </div>
    )
}
