"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import styled from "styled-components"

import { cn } from "@/lib/utils"

const ProgressPrimitiveStyled = styled(ProgressPrimitive.Indicator)<{
  indicatorColor: string
}>`
  background-color: ${(props) => props.indicatorColor};
`

interface CustomProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor: string
}
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CustomProgressProps
>(({ className, value, indicatorColor, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden  bg-[#eaeaeb]",
      className
    )}
    {...props}
  >
    <ProgressPrimitiveStyled
      indicatorColor={indicatorColor}
      className={`h-full w-full flex-1 transition-all`}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
