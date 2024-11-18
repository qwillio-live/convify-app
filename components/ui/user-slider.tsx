"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, color, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center py-2",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="bg-[#EAEAEB] relative h-1 w-full grow overflow-hidden rounded-full">
      <SliderPrimitive.Range className="absolute h-full" style={{ background: color }} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 hover:cursor-grab active:cursor-grabbing w-4 rounded-full transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" style={{ background: color }} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider as UserSlider }
