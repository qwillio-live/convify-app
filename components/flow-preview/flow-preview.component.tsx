"use client"
import React from 'react'
import { useAppSelector } from '@/lib/state/flows-state/hooks'
import ResolvedComponentsFromCraftState from '@/components/user/settings/resolved-components'

export default function FlowPreview() {
  const selectedScreen = useAppSelector((state) => state.screen.screens[state.screen.selectedScreen]);
  console.log("SELECTED SCREEN: ", selectedScreen)
  return(
    <>
      <ResolvedComponentsFromCraftState  />
    </>
  )

}
