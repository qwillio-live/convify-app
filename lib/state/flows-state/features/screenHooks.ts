// hooks.ts
import { useAppSelector } from "../hooks"
import { selectScreenDetails, selectScreenNames } from "./screenSelectors"
import { RootState } from "../store"
import { createSelector } from "@reduxjs/toolkit"

const screenDetailsSelector = (flowId: string) => createSelector(
  [(state: RootState) => selectScreenDetails(flowId)(state)],
  (data) => data
)

export const useScreenNames = (flowId: string) => {
  return useAppSelector(screenDetailsSelector(flowId))
}

export const useScreensLength = (flowId: string) => {
  return useAppSelector((state: RootState) => selectScreenNames(flowId)(state)?.length)
}
