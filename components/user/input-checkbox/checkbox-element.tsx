"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  checkmarkColor?: string
  checkmarkBorder?: string
  isActive?: boolean
  isHovered?: boolean
  isChecked: boolean
  onCheckedChange: (checked: boolean) => void

}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, checkmarkColor, isActive, isHovered, checkmarkBorder,isChecked, onCheckedChange, ...props }, ref) => {


  const getBorderColor = () => {
    if (isChecked) return checkmarkBorder
    if (isActive || isHovered) return checkmarkBorder
    return "#dfdfdf"
  }

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={isChecked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "peer h-[18px] w-[18px] shrink-0 border transition-all duration-200 ease-in-out ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary",
        className
      )}
      {...props}
      style={{
        borderColor: getBorderColor(),
        padding: 0, 
      }}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center")}
        style={{
          padding: 0, 
          width: "100%",
          height: "100%",
        }}
      >
        <Check
          className="h-full w-full rounded-[3px]" // Make sure it fits the parent perfectly
          style={{
            color: `${isChecked ? "#ffff" : checkmarkColor}`,
            backgroundColor: `${isChecked ? checkmarkBorder : "inherit"}`,
          }}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
