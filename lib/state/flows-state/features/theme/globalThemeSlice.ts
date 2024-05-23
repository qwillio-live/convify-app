import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FONTS, PrimaryFontType, SecondaryFontType } from "./fonts";

export interface GlobalThemeState {
  primaryFonts?: PrimaryFontType;
  secondaryFonts?: SecondaryFontType;
  defaultGeneral?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    backgroundImage?: string;
  },
  general?: {
    primaryColor?: string | null;
    secondaryColor?: string | null;
    backgroundColor?: string | null;
    backgroundImage?: string | null;
  },
  defaultText? :{
    primaryFont?: string;
    secondaryFont?: string;
    primaryColor?: string;
    secondaryColor?: string;
  },
  text?: {
    primaryFont?: string | null;
    secondaryFont?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
  }
}

const initialState: GlobalThemeState = {
  primaryFonts: FONTS.primaryFonts,
  secondaryFonts: FONTS.secondaryFonts,
  defaultGeneral: {
    primaryColor: "#892A5F",
    secondaryColor: "#7f114e",
    backgroundColor: "#0e0e0e",
    backgroundImage: "",
  },
  general: {
    primaryColor: "#892A5F",
    secondaryColor: "#7f114e",
    backgroundColor: "#0e0e0e",
    backgroundImage: "",
  },
  defaultText: {
    primaryFont: "--font-heading",
    secondaryFont: "--font-inter",
    primaryColor: "#0e0e0e",
    secondaryColor: "#0e0e0e",
  },
  text: {
    primaryFont: "--font-heading",
    secondaryFont: "--font-inter",
    primaryColor: "#0e0e0e",
    secondaryColor: "#0e0e0e",
  },
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeStyles: (state,action: PayloadAction<GlobalThemeState>) => {
      state.general = { ...action.payload.general };
      state.text = { ...action.payload.text };
    },
    setPartialStyles: (state, action: PayloadAction<Partial<GlobalThemeState>>) => {
      state.general = { ...state.general, ...action.payload.general };
      state.text = { ...state.text, ...action.payload.text };
    }
  },
});

export const {
  setThemeStyles,
  setPartialStyles,
} = themeSlice.actions;

export default themeSlice.reducer;
