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
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, checkmarkColor, isActive, checkmarkBorder, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(false)

  const handleCheckChange = () => {
    setIsChecked(!isChecked)
  }

  const getBorderColor = () => {
    if (isChecked) return checkmarkColor
    if (isActive) return checkmarkBorder
    return "#dfdfdf"
  }

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={isChecked}
      onCheckedChange={handleCheckChange}
      className={cn(
        "peer h-5 w-5 shrink-0 border transition-all duration-200 ease-in-out ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary",
        className
      )}
      {...props}
      style={{
        borderColor: getBorderColor(),
        padding: 0, // Ensure no padding
      }}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center")}
        style={{
          padding: 0, // Ensure no padding
          width: "100%",
          height: "100%",
        }}
      >
        <Check
          className="h-full w-full rounded-[3px]" // Make sure it fits the parent perfectly
          style={{
            color: `${isChecked ? "#ffff" : checkmarkColor}`,
            backgroundColor: `${isChecked ? checkmarkColor : "inherit"}`,
          }}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
