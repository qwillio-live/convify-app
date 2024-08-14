"use client"
import {
  resetScreen,
  resetScreensState,
  setResetTotalFilled,
  setScreensData,
  setSelectedScreen,
  setTotalRequired,
  validateScreen,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { setFlowSettings } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { useSearchParams } from "next/navigation"
import React, { useEffect } from "react"
import GoogleTagManager from "../../../components/googleMetaAnalytics"
import { resetScreens } from "@/lib/state/flows-state/features/newScreens"
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
  const index = screenNames.findIndex((screenn) => screenn === screen)
  console.log("entered setter", flowData, screen, index)

  useEffect(() => {
    console.log("entered setter useEffect")
    // // Handle flow data dispatch
    if (flowData) {
      dispatch(setScreensData(flowData))
      dispatch(setFlowSettings(flowData.flowSettings ?? {}))
      // dispatch(setTotalRequired(true))
      //   console.log("flowData in store", flowData, state?.screens)
    }
  }, []) // Add dependencies
  useEffect(() => {
    console.log("Selected screen called", index !== -1 ? index : 1)
    dispatch(setSelectedScreen(index))
  }, [screen])

  return null // This component does not need to render anything
}

export default FlowStateSetter
