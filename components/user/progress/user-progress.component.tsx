import React from "react"
import Image from "next/image"
import firstLogo from "@/assets/images/first-logo.png"
import fourthLogo from "@/assets/images/fourth-logo.png"
import secondLogo from "@/assets/images/second-logo.png"
import thirdLogo from "@/assets/images/third-logo.png"
import styled from "styled-components"

import { Element, useNode } from "@/lib/craftjs"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress-custom"

import { Controller } from "../settings/controller.component"
import { ProgressBarSettings } from "./user-progress.settings"

export const ProgressBar = ({ color, maxWidth, fullWidth, ...props }) => {
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))

  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      className={cn(
        "border border-transparent",
        isHovered && "border border-blue-400 border-dotted",
        fullWidth && "w-full"
      )}
      {...props}
    >
      {isHovered && <Controller nameOfComponent={"Progress bar"} />}

      <Progress
        value={20}
        style={{ minWidth: `${maxWidth}px` }}
        className={`h-1 ${fullWidth ? "w-full" : ""}`}
        indicatorColor={`${color}`}
      />
    </div>
  )
}

export type ProgressBarProps = {
  color: string
  maxWidth: number | string
  fullWidth: boolean
}

export const ProgressBarDefaultProps: ProgressBarProps = {
  color: "#4050ff",
  maxWidth: 366,
  fullWidth: false,
}

ProgressBar.craft = {
  props: ProgressBarDefaultProps,
  related: {
    settings: ProgressBarSettings,
  },
}
