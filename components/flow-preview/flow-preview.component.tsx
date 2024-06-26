"use client"

import React from "react"

import { useAppSelector } from "@/lib/state/flows-state/hooks"
import ResolvedComponentsFromCraftState from "@/components/user/settings/resolved-components"
type Position = 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';

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
  const screenHeader = useAppSelector((state) => state?.screen?.screensHeader)
  const headerPosition = useAppSelector((state) => state?.theme?.header?.headerPosition) || 'relative'

  const screenFooter = useAppSelector((state) => state?.screen?.screensFooter)
  React.useEffect(() => {
    console.log(selectedScreen)
  }, [selectedScreen])
  return (
    <>
    <div style={{
      position: headerPosition as Position,
      width: headerPosition === 'fixed' ? '53.5%' : '100%',
      top: headerPosition === 'fixed' ? '6px' : '0',
      zIndex: 20

      }}>
      <ResolvedComponentsFromCraftState screen={screenHeader} />
    </div>

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
      <ResolvedComponentsFromCraftState screen={screenFooter} />
    </>
  )
}
