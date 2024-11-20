'use client'

import React, { useState, useCallback } from 'react'
import { debounce } from 'lodash'
import "../styles/colorInput.css"
import { ColorInput } from './color-input'


interface ToolbarColorPickerProps {
    value: string
    onChange: (color: string) => void
    className?: string
}

export function ToolbarColorPicker({ value, onChange }: ToolbarColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false)
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
        <div id="swatch" className='mx-2'>
        
            <ColorInput
                id="backgroundcolor"
                value={tempColor}
                handleChange={(e) => {
                    handleColorChange(e)
                }}
            
              />
        </div>
    )

}