import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import buttonChoiceData from '@/components/user/screens/button-choice-screen.json'
import oneChoiceData from '@/components/user/screens/one-choice-screen.json'
import oneInputData from '@/components/user/screens/one-input-screen.json'
import emptyScreenData from '@/components/user/screens/empty-screen.json'
export interface ScreensState {
  selectedScreen:number;
  screens: string[];
}

const initialState: ScreensState = {
  selectedScreen: 0,
  /**Ignoring ts checks as this is placeholder solution for now */
  /** @ts-ignore */
  screens: [buttonChoiceData, oneChoiceData, oneInputData],
}

export const screensSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    // increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      // state.value += 1
    // },
    // decrement: (state) => {
      // state.value -= 1
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
      // state.value += action.payload
    // },
    setSelectedScreen: (state, action: PayloadAction<number>) => {
      state.selectedScreen = action.payload
    },
    reorderScreens: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
      console.log("REORDER CALLED: ", action.payload)
      const { startIndex, endIndex } = action.payload;
      const result = state.screens;
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      state.screens = result;
    },
    addScreen: (state, action: PayloadAction<string>) => {
      //add screen after selectedScreen index
      state.screens.splice(state.selectedScreen + 1, 0, emptyScreenData)
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSelectedScreen,reorderScreens,addScreen } = screensSlice.actions

export default screensSlice.reducer
