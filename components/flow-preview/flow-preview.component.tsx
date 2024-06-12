"use client"

import React from "react"

import { useAppSelector } from "@/lib/state/flows-state/hooks"
import ResolvedComponentsFromCraftState from "@/components/user/settings/resolved-components"

export default function FlowPreview() {
  const selectedScreenIdex = useAppSelector(
    (state) => state?.screen?.selectedScreen
  )
  const selectedScreen = useAppSelector(
    (state) => state?.screen?.screens[selectedScreenIdex || 0]
  )
  const screens = useAppSelector((state) => state?.screen?.screens)
  const backgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )
  React.useEffect(() => {
    console.log(selectedScreen)
  }, [selectedScreen])
  return (
    <>
      {screens?.map((screen, index) => {
        return (
          <div
            key={index}
            id={screen?.screenName}
            style={{ backgroundColor: backgroundColor }}
            className="my-14 min-h-screen
          shrink-0
          basis-full
          min-w-full"
          >
            <ResolvedComponentsFromCraftState
              key={index}
              screen={screen.screenData}
            />
          </div>
        )
      })}
    </>
  )
}
