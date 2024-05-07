"use client"

import * as React from "react"

import { Progress } from "@/components/ui/progress"
import { useNode } from "@/lib/craftjs"
import { Controller } from "./user/settings/controller.component"
import { Settings } from "lucide-react"
import { ContainerDefaultProps, UserContainer } from "./user/container/user-container.component"

export function ProgressBar() {
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return(
  <UserContainer {...ContainerDefaultProps}>
  {isHovered && <Controller nameOfComponent={"Progress Bar"} />}
  <Progress
  ref={(ref: any) => connect(drag(ref))}
  value={progress} className="h-1 w-full min-w-[200px] text-[#4050ff]" />
  </UserContainer>
  )

}

const ProgressBarSettings = () => {
  const {
    actions: { setProp },
    progress,
  } = useNode((state) => ({
    progress: state.data.props.progress,
  }))

  return (
    <div className="flex flex-col gap-4">
      <Settings
        {...progress}
        name="progress"
        setProp={setProp}
        label="Progress"
        type="number"
      />
    </div>
  )
}

ProgressBar.craft = {
  displayName: "Progress Bar",
  related: {
    settings: ProgressBarSettings,
  },
}
