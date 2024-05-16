"use client"
import React from 'react'
import ResolvedComponentsFromCraftState from '@/components/user/settings/resolved-components'
import { useAppSelector } from '@/lib/state/flows-state/hooks'

export default function FlowPreview() {
  const selectedScreenIdex = useAppSelector((state) => state.screen.selectedScreen);
  const selectedScreen = useAppSelector((state) => state.screen.screens[selectedScreenIdex]);
  const screens = useAppSelector((state) => state.screen.screens);
  React.useEffect(() => {
    console.log(selectedScreen)
  }, [selectedScreen])
  return(
    <>
    {
      screens.map((screen, index) => {
        return(
          <div className="my-14 min-h-screen">
          <ResolvedComponentsFromCraftState key={index} screen={screen}  />
          </div>
        )
      })
    }
    </>
  )
}
