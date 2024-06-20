import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { FONTS, PrimaryFontType, SecondaryFontType } from "./fonts"

export interface GlobalThemeState {
  mobileScreen: boolean;
  primaryFonts?: PrimaryFontType;
  secondaryFonts?: SecondaryFontType;
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
  defaultGeneral: {
    primaryColor: "#4050ff",
    secondaryColor: "#4050ff",
    backgroundColor: "rgba(255,255,255,.1)",
    backgroundImage: undefined,
  },
  general: {
    primaryColor: "#4050ff",
    secondaryColor: "#4050ff",
    backgroundColor: "rgba(255,255,255,.1)",
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
    setThemeStyles: (state, action: PayloadAction<GlobalThemeState>) => {
      state.general = { ...action.payload.general }
      state.text = { ...action.payload.text }
    },
    setPartialStyles: (
      state,
      action: PayloadAction<Partial<GlobalThemeState>>
    ) => {
      state.general = { ...state.general, ...action.payload.general }
      state.text = { ...state.text, ...action.payload.text }
    },
    setBackgroundColor: (state, action: PayloadAction<string>) => {
      if (state.general) {
        state.general.backgroundColor = action.payload
      }
    },
    setMobileScreen: (state, action: PayloadAction<boolean>) => {
      state.mobileScreen = action.payload;

    },
  },
})


export const {
  setThemeStyles,
  setPartialStyles,
  setBackgroundColor,
  setMobileScreen,
} = themeSlice.actions;

export default themeSlice.reducer
