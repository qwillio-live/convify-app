"use client"
import {
  getAllFilledAnswers,
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
  const totalFilled =
    useAppSelector((state) => state.screen?.filledContent) || []
  const index = screenNames.findIndex((screenn) => screenn === screen)
  const VISITED_STORAGE_PREFIX = "visited-"
  const RESPONSE_BUTTON_CLASS = "send-response"
  const RESPONSES_STORAGE_PREFIX = "responses-"

  const RESPONSE_EXPIRY_MINUTES = 30 // 3
  let storage = {}

  async function sendResponseEvent(stepId, responseId) {
    console.log("entered sendResponseEvent", responseId)

    setTimeout(async () => {
      const method = responseId ? "PUT" : "POST"
      const url = responseId
        ? `/api/flows/${flowData.id}/responses/${responseId}`
        : `/api/flows/${flowData.id}/responses`

      // Use the updated totalFilled from Redux state
      const data = {
        ...storage,
        ...totalFilled, // Use the latest value of totalFilled
      }

      console.log("Sending response event", method, url, "data", data)
      storage = data

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: { ...totalFilled } }),
        })

        const responseData = await response.json()
        console.log("Response event sent:", responseData)

        if (!responseId) {
          localStorage.setItem(
            `${RESPONSE_BUTTON_CLASS}${flowData.id}`,
            JSON.stringify({
              responseId: responseData.id,
              expiry: Date.now() + RESPONSE_EXPIRY_MINUTES * 60 * 1000,
            })
          ) // 30 minutes
        }
      } catch (error) {
        console.error("Error sending response event:", error)
      }
    }, 3000)
  }

  async function sendVisitEvent(stepId) {
    console.log("entered sendVisitEvent", stepId, flowData.id)
    await fetch(`/api/flows/${flowData.id}/visits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stepId }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Visit event sent:", data))
      .catch((error) => console.error("Error sending visit event:", error))
  }
  function getLocalStorageItem(name) {
    const item = localStorage.getItem(name)
    return item
  }
  function wasVisitedInLast24Hours(stepId) {
    console.log("entered wasVisitedInLast24Hours", stepId)
    const visitedTime = getLocalStorageItem(
      `${VISITED_STORAGE_PREFIX}${stepId}`
    )
    console.log("entered wasVisitedInLast24Hours", visitedTime)
    if (visitedTime) {
      // Assuming visitedTime is a valid date string or timestamp
      const visitedTime: string = "2024-08-20T10:00:00Z" // Example value
      const lastVisitedDate = new Date(visitedTime)
      const currentDate = new Date()

      // Subtract dates to get milliseconds difference, then convert to hours
      const millisecondsDifference =
        currentDate.getTime() - lastVisitedDate.getTime()
      const hoursDifference = millisecondsDifference / (1000 * 60 * 60)

      console.log(`Hours difference: ${hoursDifference}`)

      return hoursDifference < 24
    }
    return false
  }
  function handleStepVisit(stepId) {
    console.log("entered handleStepVisit", stepId)
    if (!wasVisitedInLast24Hours(stepId)) {
      sendVisitEvent(stepId)
      localStorage.setItem(
        `${VISITED_STORAGE_PREFIX}${stepId}`,
        new Date().toISOString()
      ) // 1440 minutes = 24 hours
    }
  }
  function handleSendResponse(stepId) {
    console.log("entered handleSendResponse", stepId)

    const name = `${RESPONSES_STORAGE_PREFIX}${flowData.id}`
    console.log("entered handleSendResponse", totalFilled, name)
    // Get the responseLocal item from local storage
    const responseLocal = getLocalStorageItem(name)
    let responseId: string | null = null // Ensure responseId can be null
    console.log("entered handleSendResponse", responseLocal)
    try {
      // Check if responseLocal is a string before parsing
      if (responseLocal) {
        const data = JSON.parse(responseLocal)
        if (data.expiry && Date.now() > data.expiry) {
          localStorage.removeItem(name)
        } else {
          responseId = data.responseId || null // Assign responseId or null
        }
      } else {
        localStorage.removeItem(name) // Remove item if responseLocal is null
      }
    } catch (e) {
      localStorage.removeItem(name) // Remove item if parsing fails
    }
    console.log("responseId", responseId)
    sendResponseEvent(stepId, responseId)
  }

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
    const stepId = screen
    console.log("StepIDddd", stepId)
    if (stepId) {
      handleStepVisit(stepId)
    }
  }, [screen])
  useEffect(() => {
    console.log("entered in send response", totalFilled, typeof totalFilled)
    const stepId = screen
    if (Object.keys(totalFilled).length > 0) {
      console.log("enreteing handlesendresponse")
      handleSendResponse(stepId)
    }
  }, [totalFilled])

  return null // This component does not need to render anything
}

export default FlowStateSetter
