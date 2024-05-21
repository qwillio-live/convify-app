import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FONTS, PrimaryFontType, SecondaryFontType } from "./fonts";

export interface GlobalThemeState {
  primaryFonts?: PrimaryFontType;
  secondaryFonts?: SecondaryFontType
  general?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    backgroundImage?: string;
  },
  text?: {
    primaryFont?: string;
    secondaryFont?: string;
    primaryColor?: string;
    secondaryColor?: string;
  }
}

const initialState: GlobalThemeState = {
  primaryFonts: FONTS.primaryFonts,
  secondaryFonts: FONTS.secondaryFonts,
  general: {
    primaryColor: "white",
    secondaryColor: "black",
    backgroundColor: "white",
    backgroundImage: "",
  },
  text: {
    primaryFont: "--font-heading",
    secondaryFont: "--font-inter",
    primaryColor: "black",
    secondaryColor: "grey",
  }
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeStyles: (state,action: PayloadAction<GlobalThemeState>) => {
      state.general = action.payload.general;
      state.text = action.payload.text;
    },
    setPartialStyles: (state,action: PayloadAction<GlobalThemeState>) => {
      state.general = {...state.general, ...action.payload.general};
      state.text = {...state.text, ...action.payload.text};
    }
  },
});

export const {
  setThemeStyles,
  setPartialStyles,
} = themeSlice.actions;

export default themeSlice.reducer;
