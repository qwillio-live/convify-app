import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import hexoid  from 'hexoid';
import buttonChoiceData from "@/components/user/screens/button-choice-screen.json";
import oneChoiceData from "@/components/user/screens/one-choice-screen.json";
import oneInputData from "@/components/user/screens/one-input-screen.json";
import footerScreenData from "@/components/user/screens/screen-footer.json";
import headerScreenData from "@/components/user/screens/screen-header.json";
import emptyScreenData from "@/components/user/screens/empty-screen.json";



export type ScreenFieldType = {
  fieldId: string;
  fieldName: string;
  fieldValue: string | number | boolean | any | null | undefined;
  fieldRequired: boolean;
  toggleError: boolean;
}

export type ScreenFieldsObject = {
  [key: string]: ScreenFieldType;
}

export type ScreenFieldsListType = {
  [key: string]: {
    [key: string] : ScreenFieldType;
  }

}

export type ScreenType = {
  screenId: string;
  screenName: string;
  screenData: any;
  screenFields: ScreenFieldsObject | {};
  screenValidated: boolean | null | undefined;
};

export interface ScreensState {
  selectedComponent: string;
  selectedScreen: number;
  headerId: string;
  headerMode: boolean;
  footerMode: boolean;
  renamingScreen: boolean;
  screensHeader: any;
  screensFooter: any;
  screens: ScreenType[];
  screensFieldsList: ScreenFieldsListType | {};
  screenRoller: any;
  editorLoad: any;
}

const initialState: ScreensState = {
  selectedComponent: "ROOT",
  headerId: "",
  selectedScreen: 0,
  screensHeader: JSON.stringify(headerScreenData),
  headerMode: false,
  screensFieldsList: {
    "1": {},
    "2": {},
    "3": {},
  },
  footerMode: false,
  renamingScreen: false,
  // screens: [JSON.stringify(buttonChoiceData), JSON.stringify(oneChoiceData), JSON.stringify(oneInputData)],
  screens: [
    {
      screenId: "1",
      screenName: "button-choice",
      screenData: JSON.stringify(buttonChoiceData),
      screenFields: {},
      screenValidated: false
    },
    {
      screenId: "2",
      screenName: "one-choice",
      screenData: JSON.stringify(oneChoiceData),
      screenFields: {},
      screenValidated: false
    },
    {
      screenId: "3",
      screenName: "one-input",
      screenData: JSON.stringify(oneInputData),
      screenFields: {},
      screenValidated: false
    },
  ],
  screensFooter: JSON.stringify(footerScreenData),
  editorLoad: buttonChoiceData,
  screenRoller: '',
};

export const screensSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    setSelectedComponent: (state, action: PayloadAction<string>) => {
      state.selectedComponent = action.payload;
    },
    updateHeaderPosition: (state, action: PayloadAction<string>) => {
      // const headerSlice = JSON.parse(state.screensHeader);
      // console.log("HEADER SLICE", headerSlice)
      // headerSlice.ROOT.props.style.position=action.payload;
      // state.screensHeader = JSON.stringify(headerSlice);
      return;
    },
    addField: (state, action: PayloadAction<ScreenFieldType>) => {
      // console.log("Add field");
      const selectedScreen = state.selectedScreen;
      const selectedId = state.screens[selectedScreen].screenId;
      const field = action.payload;
      const screenFields = state.screens[selectedScreen].screenFields;
      screenFields[field.fieldId] = field;
      state.screens[selectedScreen].screenFields = screenFields;
      state.screensFieldsList[selectedId] = screenFields;
    },
    removeField: (state,action: PayloadAction<string>) => {
      const selectedScreen = state.selectedScreen;
      const selectedScreenId = state.screens[selectedScreen].screenId;
      const fieldId = action.payload;
      const screenFields = state.screens[selectedScreen].screenFields;

      delete screenFields[fieldId];
      state.screens[selectedScreen].screenFields = screenFields;
      const screenFieldsList = state.screensFieldsList;
      const screenListItem = screenFieldsList[selectedScreenId];
      if(screenListItem) {
        delete screenListItem[fieldId];
        screenFieldsList[selectedScreenId] = screenListItem;
      }
      state.screensFieldsList = screenFieldsList;
    },
    setFieldProp: (state,action: PayloadAction<{fieldId: string, fieldName: string, fieldValue: any}>) => {
      const selectedScreen = state.selectedScreen;
      const { fieldId, fieldName, fieldValue } = action.payload;
      const screenFields = state.screens[selectedScreen].screenFields;
      const field = screenFields[fieldId];
      if (field) {
        field[fieldName] = fieldValue;
        screenFields[fieldId] = field;
        state.screens[selectedScreen].screenFields = screenFields;
      }
    },
    validateScreen: (state, action: PayloadAction<number>) => {
      const screen = state.screens[action.payload];
      const screenFields = screen.screenFields as ScreenFieldsObject;
      let screenValidated = true;
      Object.values(screenFields).forEach((field: ScreenFieldType) => {
        if (field.fieldRequired && !field.fieldValue) {
          field.toggleError = true;
          screenValidated = false;
        }
      });
      state.screens[action.payload].screenValidated = screenValidated;
      state.screens[action.payload].screenFields = screenFields;
    },
    resetScreensState: (state) => {
      state.selectedScreen = 0;
      state.headerId = "";
      state.headerMode = false;
      state.footerMode = false;
      state.screensHeader = headerScreenData;
      state.screensFooter = footerScreenData;
      // state.screens = [buttonChoiceData, oneChoiceData, oneInputData];
      state.editorLoad = state.screens[state.selectedScreen].screenData;
    },
    setEditorLoad: (state, action: PayloadAction<any>) => {
      state.editorLoad = action.payload;
      if (state.headerMode === true) {
        state.screensHeader = action.payload;

      } else if (state.footerMode === true) {
        state.screensFooter = action.payload;
      } else {
        state.screens[state.selectedScreen].screenData = action.payload ;
      }
    },
    setScreenHeader: (state, action: PayloadAction<any>) => {
      state.screensHeader = JSON.stringify(action.payload);
    },
    setScreenFooter: (state, action: PayloadAction<any>) => {
      state.screensFooter = JSON.stringify(action.payload);
    },
    setHeaderId: (state, action: PayloadAction<string>) => {
      state.headerId = action.payload;
    },
    setHeaderMode: (state, action: PayloadAction<boolean>) => {
      state.selectedComponent="ROOT";
      state.footerMode = false;
      state.headerMode = action.payload;
      state.editorLoad = state.screensHeader; // Ensure new reference
    },
    setFooterMode: (state, action: PayloadAction<boolean>) => {
      state.selectedComponent="ROOT";
      state.headerMode = false;
      state.footerMode = action.payload;
      state.editorLoad = state.screensFooter; // Ensure new reference
    },
    setHeaderFooterMode: (state, action: PayloadAction<boolean>) => {
      state.selectedComponent="ROOT";
      state.headerMode = action.payload;
      state.footerMode = action.payload;
    },
    setScreens: (state, action: PayloadAction<any[]>) => {
      state.screens = [...action.payload];
    },
    setSelectedScreen: (state, action: PayloadAction<number>) => {
      state.headerMode = false;
      state.footerMode = false;
      state.selectedScreen = action.payload;
      state.editorLoad = state.screens[action.payload].screenData; // Ensure new reference
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
      const newId = hexoid(8)();
      const newScreens = [...state.screens]; // Create new array
      const screenName = "screen-"+newId;
      state.screensFieldsList[newId] = {};
      newScreens.splice(action.payload + 1, 0,
        {screenId: newId,screenName:screenName,screenData:JSON.stringify(emptyScreenData),screenFields:{},screenValidated:false});
      state.screens = newScreens;
      state.selectedScreen = action.payload + 1;
      state.editorLoad = JSON.stringify(emptyScreenData) // Ensure new reference
    },
    duplicateScreen: (state, action: PayloadAction<number>) => {
      const newScreens = [...state.screens]; // Create new array
      const newId = hexoid(8)();
      const previousId = state.screens[action.payload].screenId;
      const newScreen = {
        screenId: newId,
        screenName: "",
        screenData: "",
        screenFields: {},
        screenValidated: false
      }
      state.screensFieldsList[newId] = state.screensFieldsList[previousId]
      newScreen.screenData = state.screens[action.payload].screenData; // Create new object
      newScreen.screenName = "screen-"+newScreen.screenId;
      newScreens.splice(action.payload + 1, 0, newScreen);
      state.screens = newScreens;
      state.selectedScreen = action.payload + 1;
      state.editorLoad = newScreen.screenData; // Ensure new reference
    },
    deleteScreen: (state, action: PayloadAction<number>) => {

      if(state.screens.length === 1) return;
      const screenToDelete = action.payload;
      const screenIdToDelete = state.screens[screenToDelete].screenId;
      delete state.screensFieldsList[screenIdToDelete];
      const newScreens = [...state.screens]; // Create new array
      newScreens.splice(screenToDelete, 1);
      state.screens = newScreens;

      // If 0th screen is deleted, move to the next screen; if > 0, move to the previous screen
      if (action.payload === 0) {
        state.selectedScreen = 0; // Move to the new first screen
      } else {
        state.selectedScreen = Math.max(0, action.payload - 1); // Move to the previous screen
      }

      state.editorLoad = state.screens[state.selectedScreen]; // Ensure new reference
    },
    setScreenName: (state, action: PayloadAction<{ screenId: string, screenName: string }>) => {
      const { screenId, screenName } = action.payload;
      const screen = state.screens.find(screen => screen.screenId === screenId);
      const duplicateName = state.screens.find(screen => screen.screenName === screenName);
      if(duplicateName) {
        return;
      }else if(screen) {
        screen.screenName = screenName;
      }
    },
    setRenamingScreen: (state, action: PayloadAction<boolean>) => {
      state.renamingScreen = action.payload;
    },
    navigateToScreen: (state, action: PayloadAction<string>) => {
      const screen = state.screens.find(screen => screen.screenName === action.payload);
      if(screen) {
        state.selectedScreen = state.screens.indexOf(screen);
        state.editorLoad = screen.screenData;
      }
    },
    rollScreens: (state, action:PayloadAction<string>) => {

          state.screenRoller = action.payload;


    },
  },
});


export const {
  setSelectedComponent,
  removeField,
  updateHeaderPosition,
  addField,
  validateScreen,
  setFieldProp,
  rollScreens,
  navigateToScreen,
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
  setScreenName,
  setRenamingScreen,
} = screensSlice.actions;

export default screensSlice.reducer;
