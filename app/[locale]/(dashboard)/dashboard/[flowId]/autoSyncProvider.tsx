"use client"
import { setScreensData } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { setFlowSettings } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import React, { useEffect } from "react"
import Loading from "../loading"
import NotFound from "./not-found"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// API to fetch flow data
const fetchFlowData = async (flowId) => {
  const response = await fetch(`/api/flows/${flowId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch flow data")
  }
  const data = await response.json()
  return data
}

// API to update flow data
const updateFlowData = async ({ flowId, data }) => {
  const response = await fetch(`/api/flows/${flowId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to update flow data")
  }
  const updatedData = await response.json()
  return updatedData
}

export const FlowsAutoSaveProvider = ({ children, flowId }) => {
  console.log("this is latest deployment check")
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const localFlowData = useAppSelector((state) => state?.screen)
  const localFlowSettings = useAppSelector((state) => state?.theme)

  // Fetch the flow data using react-query
  const {
    data: flowData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["flowData", flowId],
    queryFn: () => fetchFlowData(flowId),
  })

  // Sync fetched data to Redux when fetched data changes
  useEffect(() => {
    if (flowData) {
      dispatch(setScreensData(flowData))
      dispatch(setFlowSettings(flowData.flowSettings ?? {}))
    }
  }, [dispatch, flowData])

  // Mutation for updating flow data
  const { mutate: saveFlowData } = useMutation({
    mutationKey: ["lessonResponse"],
    mutationFn: (newFlowData: any) =>
      updateFlowData({ flowId, data: newFlowData }),

    onSuccess: () => {
      // Optionally invalidate and refetch the flowData
      queryClient.invalidateQueries({ queryKey: ["flowData", flowId] })
      queryClient.refetchQueries({ queryKey: ["flowData", flowId] })
    },
  })

  // Handle Redux state changes and trigger a save when it changes
  useEffect(() => {
    if (!localFlowData || localFlowData?.screens.length === 0) return

    const steps = localFlowData.screens.map((step, index) => ({
      id: step.screenId,
      name: step.screenName,
      content: JSON.parse(step.screenData),
      link: step.screenLink,
      order: index,
      templateId: step.screenTemplateId,
    }))

    const newFlowData = {
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
    queryClient.cancelQueries({ queryKey: ["lessonResponse"] })
    // Trigger save (PUT request) whenever the Redux state changes
    saveFlowData(newFlowData)
  }, [localFlowData, localFlowSettings, saveFlowData])

  if (isLoading) return <Loading />
  if (isError) return <NotFound />

  return children
}
