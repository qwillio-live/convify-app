import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import buttonChoiceData from "@/components/user/screens/button-choice-screen.json";
import oneChoiceData from "@/components/user/screens/one-choice-screen.json";
import oneInputData from "@/components/user/screens/one-input-screen.json";
import footerScreenData from "@/components/user/screens/screen-footer.json";
import headerScreenData from "@/components/user/screens/screen-header.json";
import emptyScreenData from "@/components/user/screens/empty-screen.json";

export interface ScreensState {
  selectedScreen: number;
  headerId: string;
  headerMode: boolean;
  footerMode: boolean;
  screensHeader: any;
  screensFooter: any;
  screens: any[];
  editorLoad: any;
}

const initialState: ScreensState = {
  headerId: "",
  selectedScreen: 0,
  screensHeader: headerScreenData,
  headerMode: false,
  footerMode: false,
  screens: [buttonChoiceData, oneChoiceData, oneInputData],
  screensFooter: footerScreenData,
  editorLoad: null,
};

export const screensSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    resetScreensState: (state) => {
      state.selectedScreen = 0;
      state.headerId = "";
      state.headerMode = false;
      state.footerMode = false;
      state.screensHeader = headerScreenData;
      state.screensFooter = footerScreenData;
      state.screens = [buttonChoiceData, oneChoiceData, oneInputData];
      state.editorLoad = state.screens[state.selectedScreen];
    },
    setEditorLoad: (state, action: PayloadAction<any>) => {
      state.editorLoad = { ...action.payload };
      if (state.headerMode === true) {
        state.screensHeader = { ...action.payload };
      } else if (state.footerMode === true) {
        state.screensFooter = { ...action.payload };
      } else {
        state.screens[state.selectedScreen] = { ...action.payload };
      }
    },
    setScreenHeader: (state, action: PayloadAction<any>) => {
      state.screensHeader = action.payload;
    },
    setScreenFooter: (state, action: PayloadAction<any>) => {
      state.screensFooter = action.payload;
    },
    setHeaderId: (state, action: PayloadAction<string>) => {
      state.headerId = action.payload;
    },
    setHeaderMode: (state, action: PayloadAction<boolean>) => {
      state.headerMode = action.payload;
    },
    setFooterMode: (state, action: PayloadAction<boolean>) => {
      state.footerMode = action.payload;
    },
    setHeaderFooterMode: (state, action: PayloadAction<boolean>) => {
      state.headerMode = action.payload;
      state.footerMode = action.payload;
    },
    setScreens: (state, action: PayloadAction<any[]>) => {
      state.screens = [...action.payload];
    },
    setSelectedScreen: (state, action: PayloadAction<number>) => {
      state.selectedScreen = action.payload;
      state.editorLoad = { ...state.screens[action.payload] }; // Ensure new reference
    },
    reorderScreens: (
      state,
      action: PayloadAction<{ startIndex: number; endIndex: number }>
    ) => {
      const { startIndex, endIndex } = action.payload;
      const result = [...state.screens]; // Create new array
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      state.screens = result;
    },
    addScreen: (state, action: PayloadAction<number>) => {
      const newScreens = [...state.screens]; // Create new array
      newScreens.splice(action.payload + 1, 0, emptyScreenData);
      state.screens = newScreens;
      state.selectedScreen = action.payload + 1;
    },
    duplicateScreen: (state, action: PayloadAction<number>) => {
      const newScreens = [...state.screens]; // Create new array
      const newScreen = { ...state.screens[action.payload] }; // Create new object
      newScreens.splice(action.payload + 1, 0, newScreen);
      state.screens = newScreens;
      state.selectedScreen = action.payload + 1;
    },
    deleteScreen: (state, action: PayloadAction<number>) => {
      const newScreens = [...state.screens]; // Create new array
      newScreens.splice(action.payload, 1);
      state.screens = newScreens;
      state.selectedScreen = Math.min(action.payload, state.screens.length - 1);
    },
  },
});

export const {
  setHeaderMode,
  resetScreensState,
  setScreenHeader,
  setScreenFooter,
  setFooterMode,
  setHeaderFooterMode,
  setSelectedScreen,
  reorderScreens,
  addScreen,
  setEditorLoad,
  duplicateScreen,
  setScreens,
  deleteScreen,
  setHeaderId,
} = screensSlice.actions;

export default screensSlice.reducer;
