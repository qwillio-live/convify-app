"use client"
import {
  setScreensData,
  setTotalRequired,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { setFlowSettings } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { useSearchParams } from "next/navigation"
import React, { useEffect } from "react"

interface FlowStateSetterProps {
  flowData: any
  screenNames: string[]
}

const FlowStateSetter: React.FC<FlowStateSetterProps> = ({
  flowData,
  screenNames,
}) => {
  const searchParams = useSearchParams()
  const screen = searchParams?.get("screen") || ""
  const dispatch = useAppDispatch()
  const state = useAppSelector((state) => state.screen)

  console.log("entered seter", flowData, screen)

  useEffect(() => {
    console.log("entered seter useEffect")
    if (flowData) {
      dispatch(setScreensData(flowData))
      dispatch(setFlowSettings(flowData.flowSettings ?? {}))
      dispatch(setTotalRequired(true))
      console.log("flowData in store", flowData, state?.screens)
    }
  }, [])

  useEffect(() => {
    // If screen is an empty string, show only the first screen and hide others
    if (screen === "") {
      screenNames.forEach((name, index) => {
        const element = document.getElementById(name)
        if (element) {
          element.style.display = index === 0 ? "block" : "none"
        }
      })
    } else {
      // If screen is not an empty string, show the matching screen and hide others
      screenNames.forEach((name) => {
        const element = document.getElementById(name)
        if (element) {
          element.style.display = name === screen ? "block" : "none"
        }
      })
    }
  }, [screen])
  // useEffect(() => {
  //   console.log("dispatching in setter")
  //   dispatch(setTotalRequired(true))
  //   console.log(
  //     "afetr dispatchig",
  //     "totalFilled",
  //     state?.screens[state?.selectedScreen]?.totalFilled,
  //     "totalRequired",
  //     state?.screens[state?.selectedScreen]?.totalRequired
  //   )
  // }, [])

  return null // This component does not need to render anything
}

export default FlowStateSetter
