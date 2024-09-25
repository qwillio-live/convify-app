"use client"
import { setScreensData } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { setFlowSettings } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import React, { useCallback, useEffect, useState } from "react"
import Loading from "../loading"
import { useRouter } from "next/navigation"
import NotFound from "./not-found"

export const FlowsAutoSaveProvider = ({ children, flowId }) => {
  const autoSaveTime = Number(process.env.NEXT_PUBLIC_AUTOSAVE_TIME) || 5000
  const [isFlowLoaded, setIsFlowLoaded] = useState<null | Boolean>(null)
  const [updatedFlowData, setUpdatedFlowData] = useState<null | object>(null)

  const router = useRouter()

  const dispatch = useAppDispatch()

  const localFlowData = useAppSelector((state) => state?.screen)
  const localFlowSettings = useAppSelector((state) => state?.theme)

  const getFlowData = async () => {
    try {
      const response = await fetch(`/api/flows/${flowId}`)
      const flowData = await response.json()
      console.log("flowData", flowData)
      dispatch(setScreensData(flowData))
      dispatch(setFlowSettings(flowData.flowSettings ?? {}))

      setIsFlowLoaded(true)
      console.log("flowData", flowData)
    } catch (error) {
      setIsFlowLoaded(false)
    }
  }

  const updateFlowData = async (updatedFlowData) => {
    try {
      await fetch(`/api/flows/${flowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFlowData),
      })
    } catch (error) {}
  }

  useEffect(() => {
    let interval

    getFlowData().then(() => {
      interval = setInterval(() => {
        setUpdatedFlowData((updatedFlowData) => {
          if (updatedFlowData) {
            updateFlowData(updatedFlowData)
            return null
          }
          return updatedFlowData
        })
      }, autoSaveTime)
    })

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isFlowLoaded) return
    if (localFlowData?.screens.length === 0) return

    const steps = localFlowData?.screens
      ? Array.from(
          new Set(localFlowData.screens.map((step) => step.screenName))
        ).map((name) => {
          const step = localFlowData.screens.find((s) => s.screenName === name)
          return {
            id: step?.screenId,
            name: step?.screenName,
            content: JSON.parse(step?.screenData),
            link: step?.screenLink,
            order: step ? localFlowData.screens.indexOf(step) : 0,
            templateId: step?.screenTemplateId,
          }
        })
      : [] // Return an empty array if localFlowData or screens is undefined

    const data = {
      steps,
      headerData: localFlowData?.screensHeader,
      footerData: localFlowData?.screensFooter,
      flowSettings: {
        mobileScreen: localFlowSettings?.mobileScreen,
        header: localFlowSettings?.header,
        general: localFlowSettings?.general,
        text: localFlowSettings?.text,
      },
    }

    setUpdatedFlowData(data)
  }, [isFlowLoaded, localFlowData, localFlowSettings])

  if (isFlowLoaded === null) return <Loading />
  if (isFlowLoaded === false) return <NotFound />

  return children
}
