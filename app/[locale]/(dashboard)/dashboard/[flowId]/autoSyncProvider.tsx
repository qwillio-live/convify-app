"use client"
import { setScreensData } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { setFlowSettings } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import React, { useEffect, useState, useRef } from "react"
import Loading from "../loading"
import { useRouter } from "next/navigation"
import NotFound from "./not-found"

export const FlowsAutoSaveProvider = ({ children, flowId }) => {
  const autoSaveTime = Number(process.env.NEXT_PUBLIC_AUTOSAVE_TIME) || 1000
  const [isFlowLoaded, setIsFlowLoaded] = useState<null | Boolean>(null)
  const [updatedFlowData, setUpdatedFlowData] = useState<null | object>(null)

  const [controller, setController] = useState<AbortController | null>(null) // Controller state
  const signal = useRef<AbortSignal | null>(null) // Signal ref to be used in fetch
  const [stateRefresh, setStateRefresh] = useState(true) // To trigger re-renders if needed
  const [cancelReq, setCancelReq] = useState(false) // Optional cancellation trigger

  const router = useRouter()
  const dispatch = useAppDispatch()

  const localFlowData = useAppSelector((state) => state?.screen)
  const localFlowSettings = useAppSelector((state) => state?.theme)

  const getFlowData = async () => {
    try {
      const response = await fetch(`/api/flows/${flowId}`)
      const flowData = await response.json()
      dispatch(setScreensData(flowData))
      dispatch(setFlowSettings(flowData.flowSettings ?? {}))

      setIsFlowLoaded(true)
    } catch (error) {
      setIsFlowLoaded(false)
    }
  }

  const startFetch = async (updatedFlowData) => {
    let newController = new AbortController()
    setController(newController)
    signal.current = newController.signal

    try {
      await fetch(`/api/flows/${flowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFlowData),
        signal: signal.current, // Pass the abort signal
      })
        .then((response) => {
          setStateRefresh(!stateRefresh) // Optionally refresh or handle response
          console.log("PUT request complete", response)
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            console.log("Request was aborted")
          } else {
            console.error("PUT request failed", error)
          }
        })
    } catch (error) {
      console.error(`Error during fetch: ${error.message}`)
    }
  }

  const stopFetch = () => {
    if (controller) {
      controller.abort() // Abort ongoing request
      setCancelReq(true)
    }
  }

  useEffect(() => {
    let interval

    getFlowData().then(() => {
      interval = setInterval(() => {
        setUpdatedFlowData((updatedFlowData) => {
          if (updatedFlowData) {
            startFetch(updatedFlowData) // Start the PUT request
            return null
          }
          return updatedFlowData
        })
      }, autoSaveTime)
    })

    return () => {
      clearInterval(interval)
      stopFetch() // Abort any pending requests on component unmount
    }
  }, [])

  useEffect(() => {
    if (!isFlowLoaded) return
    if (localFlowData?.screens.length === 0) return

    const steps = localFlowData?.screens.map((step, index) => ({
      id: step.screenId,
      name: step.screenName,
      content: JSON.parse(step.screenData),
      link: step.screenLink,
      order: index,
      templateId: step.screenTemplateId,
    }))

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
}
