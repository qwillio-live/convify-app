import { makeStore } from "@/lib/state/flows-state/store"

// still handling
export const getNextScreenInfoFromStore = () => {
  const state = makeStore().store.getState()
  const screens = state?.screen?.screens
  const screensLength = screens?.length || 0
  const selectedScreen = state.screen?.selectedScreen ?? 0
  console.log(state?.screen?.screens)
  return {
    screenId:
      state?.screen?.screens[
        selectedScreen + 1 < screensLength ? selectedScreen + 1 : 0
      ]?.screenId || "",
    screenName:
      state?.screen?.screens[
        selectedScreen + 1 < screensLength ? selectedScreen + 1 : 0
      ]?.screenName || "",
  }
}
