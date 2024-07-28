import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { FONTS, PrimaryFontType, SecondaryFontType } from "./fonts"

export interface GlobalThemeState {
  mobileScreen: boolean
  primaryFonts?: PrimaryFontType
  secondaryFonts?: SecondaryFontType
  defaultHeader?: {
    headerPosition: string
  }
  header: {
    headerPosition: string | undefined
  }
  defaultGeneral?: {
    primaryColor?: string
    secondaryColor?: string
    backgroundColor?: string
    backgroundImage?: string
  }
  general?: {
    primaryColor?: string | undefined
    secondaryColor?: string | undefined
    backgroundColor?: string | undefined
    backgroundImage?: string | undefined
  }
  defaultText?: {
    primaryFont?: string
    secondaryFont?: string
    primaryColor?: string
    secondaryColor?: string
  }
  text?: {
    primaryFont?: string | undefined
    secondaryFont?: string | undefined
    primaryColor?: string | undefined
    secondaryColor?: string | undefined
  }
}

const initialState: GlobalThemeState = {
  mobileScreen: false,
  primaryFonts: FONTS.primaryFonts,
  secondaryFonts: FONTS.secondaryFonts,
  defaultHeader: {
    headerPosition: "absolute",
  },
  header: {
    headerPosition: "absolute",
  },
  defaultGeneral: {
    primaryColor: "#4050ff",
    secondaryColor: "#4050ff",
    backgroundColor: "white",
    backgroundImage: undefined,
  },
  general: {
    primaryColor: "#4050ff",
    secondaryColor: "#4050ff",
    backgroundColor: "white",
    backgroundImage: undefined,
  },
  defaultText: {
    primaryFont: "--font-cal-sans",
    secondaryFont: "--font-inter",
    primaryColor: "#0e0e0e",
    secondaryColor: "#0e0e0e",
  },
  text: {
    primaryFont: "--font-cal-sans",
    secondaryFont: "--font-inter",
    primaryColor: "#0e0e0e",
    secondaryColor: "#0e0e0e",
  },
}

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setFlowSettings: (state, action: PayloadAction<GlobalThemeState>) => {
      state.mobileScreen = action.payload.mobileScreen
      state.header = { ...initialState.defaultHeader, ...action.payload.header }
      state.general = {
        ...initialState.defaultGeneral,
        ...action.payload.general,
      }
      state.text = { ...initialState.defaultText, ...action.payload.text }
    },
    setThemeStyles: (state, action: PayloadAction<GlobalThemeState>) => {
      console.log("setThemeStyles", action.payload)

      state.general = { ...action.payload.general }
      state.text = { ...action.payload.text }
    },
    setHeaderPosition: (state, action: PayloadAction<string>) => {
      state.header.headerPosition = action.payload
    },
    setPartialStyles: (
      state,
      action: PayloadAction<Partial<GlobalThemeState>>
    ) => {
      state.general = { ...state.general, ...action.payload.general }
      state.text = { ...state.text, ...action.payload.text }
    },
    setBackgroundColors: (state, action: PayloadAction<string>) => {
      if (state.general) {
        state.general.backgroundColor = action.payload
      }
    },
    setTextColors: (state, action: PayloadAction<string>) => {
      if (state.text) {
        state.text.primaryColor = action.payload
      }
    },
    setPrimaryColors: (state, action: PayloadAction<string>) => {
      if (state.general) {
        state.general.primaryColor = action.payload
      }
    },
    setMobileScreen: (state, action: PayloadAction<boolean>) => {
      state.mobileScreen = action.payload
    },
  },
})

export const {
  setFlowSettings,
  setThemeStyles,
  setHeaderPosition,
  setPartialStyles,
  setBackgroundColors,
  setMobileScreen,
  setPrimaryColors,
  setTextColors,
} = themeSlice.actions

export default themeSlice.reducer
