// hooks.ts
import { useAppSelector } from "../hooks"
import { selectScreenDetails, selectScreenNames } from "./screenSelectors"
import { RootState } from "../store"
import { createSelector } from "@reduxjs/toolkit"

const screenDetailsSelector = createSelector(
  [(state: RootState) => selectScreenDetails(state)],
  (data) => data
)

export const useScreenNames = () => {
  return useAppSelector(screenDetailsSelector)
}

export const useScreensLength = () => {
  return useAppSelector((state: RootState) => selectScreenNames(state)?.length)
}
