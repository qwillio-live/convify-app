'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { cn } from "@/lib/utils"
import { debounce } from 'lodash'
import "../styles/colorInput.css"


interface ToolbarColorPickerProps {
    value: string
    onChange: (color: string) => void
    className?: string
}

export function ToolbarColorPicker({ value, onChange, className }: ToolbarColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [tempColor, setTempColor] = useState(value)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

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

    const toggleColorPicker = () => {
        setIsOpen(!isOpen)
        if (!isOpen) {
            setTempColor(value)
        }
    }
    return (
        <div id="swatch" className='mx-2'>
            <Input
                ref={inputRef}
                type="color"
                value={tempColor}
                onChange={handleColorChange}
                // style={{
                //     borderRadius: '2px', height: '2rem', width: '2rem', padding: '0', border: '0'
                // }}
                id="color" name="color" 
                // className="h-8 w-8 p-0 border-0 outline-none rounded-sm overflow-hidden"
            />
        </div>
    )

    return (
        <div className={cn("relative", className)}>
            <Button
                variant="ghost"
                size="icon"
                className={cn("p-0 w-6 h-6 rounded-sm", className)}
                style={{ backgroundColor: value }}
                onClick={toggleColorPicker}
                aria-label="Select text color"
            />
            {isOpen && (
                <div className="absolute top-full mt-1 left-0 bg-popover p-2 rounded-md shadow-md z-50">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="color-input" className="text-xs">Color</Label>
                            <div
                                className="w-4 h-4 rounded-sm border border-border"
                                style={{ backgroundColor: tempColor }}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Input
                                ref={inputRef}
                                id="color-input"
                                type="color"
                                value={tempColor}
                                onChange={handleColorChange}
                                className="h-8 w-8 p-0 border-0"
                            />
                            <Input
                                type="text"
                                value={tempColor}
                                onChange={(e) => {
                                    setTempColor(e.target.value)
                                    onChange(e.target.value)
                                }}
                                className="flex-grow h-8 text-xs"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}