"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

type AdditionalProps = {
  background: string
  slideColor: string
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & AdditionalProps
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    defaultValue={props.defaultValue}
    min={props.min}
    max={props.max}
    step={props.step}
    onValueChange={props.onValueChange}
  >
    <SliderPrimitive.Track
      className="relative h-1 w-full grow rounded-full bg-white"
      // style={{ backgroundColor: props.background }}
    >
      <SliderPrimitive.Range
        className="bg-background absolute h-full rounded-full"
        style={{ backgroundColor: props.slideColor }}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="border-primary bg-background block h-5 w-5 rounded-full focus:outline-none"
      style={{ backgroundColor: props.slideColor }}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
