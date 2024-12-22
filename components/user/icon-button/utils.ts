import { makeStore } from "@/lib/state/flows-state/store"
import { useParams } from "next/navigation"

// still handling
export const getNextScreenInfoFromStore = () => {
  const { flowId = "" } = useParams<{ flowId: string }>() ?? {}
  const state = makeStore().store.getState()
  const screens = state?.screen?.flows[flowId]?.screens
  const screensLength = screens?.length || 0
  const selectedScreen = state.screen?.flows[flowId]?.selectedScreen ?? 0
  console.log(state?.screen?.flows[flowId]?.screens)
  return {
    screenId:
      state?.screen?.flows[flowId]?.screens[
        selectedScreen + 1 < screensLength ? selectedScreen + 1 : 0
      ]?.screenId || "",
    screenName:
      state?.screen?.flows[flowId]?.screens[
        selectedScreen + 1 < screensLength ? selectedScreen + 1 : 0
      ]?.screenName || "",
  }
}
