import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import buttonChoiceData from "@/components/user/screens/button-choice-screen.json"
import emptyScreenData from "@/components/user/screens/empty-screen.json"
import oneChoiceData from "@/components/user/screens/one-choice-screen.json"
import oneInputData from "@/components/user/screens/one-input-screen.json"
import footerScreenData from "@/components/user/screens/screen-footer.json"
import headerScreenData from "@/components/user/screens/screen-header.json"
export interface ScreensState {
  selectedScreen: number
  headerId: string
  headerFooterMode: boolean
  screensHeader: any
  screensFooter: any
  screens: any[]
}

const initialState: ScreensState = {
  headerId: "",
  selectedScreen: 0,
  screensHeader: headerScreenData,
  headerFooterMode: false,
  /**Ignoring ts checks as this is placeholder solution for now */
  /** @ts-ignore */
  screens: [buttonChoiceData, oneChoiceData, oneInputData],
  screensFooter: footerScreenData,
}

export const screensSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    setHeaderId: (state, action: PayloadAction<string>) => {
      state.headerId = action.payload
    },
    setHeaderFooterMode: (state, action: PayloadAction<boolean>) => {
      state.headerFooterMode = action.payload
    },
    setScreens: (state, action: PayloadAction<any[]>) => {
      console.log("Payload", action.payload)
      state.screens = [...action.payload]
    },
    setSelectedScreen: (state, action: PayloadAction<number>) => {
      state.selectedScreen = action.payload
    },
    reorderScreens: (
      state,
      action: PayloadAction<{ startIndex: number; endIndex: number }>
    ) => {
      const { startIndex, endIndex } = action.payload
      const result = state.screens
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)

      state.screens = result
    },
    addScreen: (state, action: PayloadAction<number>) => {
      //add screen after selectedScreen index
      state.screens.splice(action.payload + 1, 0, emptyScreenData)
      state.selectedScreen = action.payload + 1
    },
    duplicateScreen: (state, action: PayloadAction<number>) => {
      //duplicate screen after selectedScreen index
      const newScreen = state.screens[action.payload];
      state.screens.splice(action.payload + 1, 0, newScreen);
      state.selectedScreen = action.payload + 1;
    },
    deleteScreen: (state, action: PayloadAction<number>) => {
      //delete screen at index
      state.screens.splice(action.payload, 1);
      state.selectedScreen = Math.min(action.payload, state.screens.length - 1);
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setSelectedScreen,
  setHeaderFooterMode,
  reorderScreens,
  addScreen,
  duplicateScreen,
  setScreens,
  deleteScreen,
  setHeaderId,
} = screensSlice.actions

export default screensSlice.reducer
