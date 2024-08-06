import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import hexoid from "hexoid"
// import buttonChoiceData from "@/components/user/screens/button-choice-screen.json";
// import oneChoiceData from "@/components/user/screens/one-choice-screen.json";
// import oneInputData from "@/components/user/screens/one-input-screen.json";
import footerScreenData from "@/components/user/screens/screen-footer.json"
import headerScreenData from "@/components/user/screens/screen-header.json"
import emptyScreenData from "@/components/user/screens/empty-screen.json"

export type ScreenFieldType = {
  fieldId: string
  fieldName: string
  fieldValue: string | number | boolean | any | null | undefined
  fieldRequired: boolean
  toggleError: boolean
}

export type ScreenFieldsObject = {
  [key: string]: ScreenFieldType
}

export type ScreenFieldsListType = {
  [key: string]: {
    [key: string]: ScreenFieldType
  }
}

export type ScreenType = {
  screenId: string
  screenName: string
  screenData: any
  screenLink: string
  screenTemplateId: string
  screenFields: ScreenFieldsObject | {}
  screenValidated: boolean | null | undefined
  screenToggleError: boolean
}

export interface ScreensState {
  flowName: string
  selectedComponent: string
  selectedScreen: number
  firstScreenName: string
  currentScreenName: string
  screenNameToId:
    | {
        [screenName: string]: string
      }
    | {}
  headerId: string
  headerMode: boolean
  avatarComponentId: string | null
  footerMode: boolean
  renamingScreen: boolean
  previousAvatarComponentId: string | null
  avatarComponentIds: string[]
  screensHeader: any
  screensFooter: any
  screens: ScreenType[]
  screensFieldsList: ScreenFieldsListType | {}
  screenRoller: any
  editorLoad: any
  scrollY: number
  hasComponentBeforeAvatar: boolean
  avatarBackgroundColor: string | undefined
}

const initialState: ScreensState = {
  flowName: "",
  selectedComponent: "ROOT",
  firstScreenName: "",
  currentScreenName: "",
  screenNameToId: {},
  headerId: "",
  selectedScreen: 0,
  avatarComponentIds: [],
  avatarComponentId: null,
  previousAvatarComponentId: null,
  screensHeader: JSON.stringify(headerScreenData),
  headerMode: false,
  hasComponentBeforeAvatar: false,
  avatarBackgroundColor: "rgba(255,255,255,.1)",
  screensFieldsList: {
    // "1": {},
    // "2": {},
    // "3": {},
  },
  footerMode: false,
  renamingScreen: false,
  // screens: [JSON.stringify(buttonChoiceData), JSON.stringify(oneChoiceData), JSON.stringify(oneInputData)],
  screens: [
    // {
    //   screenId: "1",
    //   screenName: "button-choice",
    //   screenData: JSON.stringify(buttonChoiceData),
    //   screenFields: {},
    //   screenLink: "",
    //   screenTemplateId: "",
    //   screenValidated: false,
    //   screenToggleError: false,
    // },
    // {
    //   screenId: "2",
    //   screenName: "one-choice",
    //   screenData: JSON.stringify(oneChoiceData),
    //   screenFields: {},
    //   screenLink: "",
    //   screenTemplateId: "",
    //   screenValidated: false,
    //   screenToggleError: false,
    // },
    // {
    //   screenId: "3",
    //   screenName: "one-input",
    //   screenData: JSON.stringify(oneInputData),
    //   screenFields: {},
    //   screenLink: "",
    //   screenTemplateId: "",
    //   screenValidated: false,
    //   screenToggleError: false,
    // },
  ],
  screensFooter: JSON.stringify(footerScreenData),
  editorLoad: {},
  screenRoller: "",
  scrollY: 0,
}

export const newScreensSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    resetScreens: () => initialState,
    setNewScreensData: (state, action: PayloadAction<any>) => {
      state.flowName = action.payload.name
      state.firstScreenName = action.payload.steps[0].name
      state.currentScreenName = action.payload.steps[0].name

      const screensFieldsList = {}

      action.payload.steps.forEach((screen: any) => {
        screensFieldsList[screen.id] = {}
      })

      state.screensFieldsList = screensFieldsList
      state.screensHeader = action.payload.headerData ?? state.screensHeader
      state.screensFooter = action.payload.footerData ?? state.screensFooter
      state.selectedScreen = 0
      state.screens = action.payload.steps.map((screen: any) => ({
        screenId: screen.id,
        screenName: screen.name,
        screenData: JSON.stringify(screen.content),
        screenLink: screen.link,
        screenFields: {},
        screenValidated: false,
        screenToggleError: false,
      }))

      state.editorLoad = state.screens[state.selectedScreen].screenData
    },
    setSelectedComponent: (state, action: PayloadAction<string>) => {
      state.selectedComponent = action.payload
    },
    updateHeaderPosition: (state, action: PayloadAction<string>) => {
      // const headerSlice = JSON.parse(state.screensHeader);
      // console.log("HEADER SLICE", headerSlice)
      // headerSlice.ROOT.props.style.position=action.payload;
      // state.screensHeader = JSON.stringify(headerSlice);
      return
    },
    addField: (state, action: PayloadAction<ScreenFieldType>) => {
      const selectedScreen = state.selectedScreen
      const selectedScreenObj = state.screens[selectedScreen]
      const field = action.payload

      if (!selectedScreenObj) {
        // Handle case where selected screen is not found
        console.error(`Selected screen (${selectedScreen}) not found in state.`)
        return
      }

      // Clone the existing screenFields to avoid mutating state directly
      const screenFields = { ...selectedScreenObj.screenFields }

      // Update the screenFields with the new field
      screenFields[field.fieldId] = field

      // Update state with the modified screenFields
      state.screens[selectedScreen].screenFields = screenFields

      // Update screensFieldsList with the modified screenFields
      const selectedId = selectedScreenObj.screenId
      state.screensFieldsList[selectedId] = screenFields
    },
    removeField: (state, action: PayloadAction<string>) => {
      const selectedScreen = state.selectedScreen
      const selectedScreenId = state.screens[selectedScreen].screenId
      const fieldId = action.payload
      const screenFields = state.screens[selectedScreen]?.screenFields

      delete screenFields[fieldId]
      state.screens[selectedScreen].screenFields = screenFields
      const screenFieldsList = state.screensFieldsList
      const screenListItem = screenFieldsList[selectedScreenId]
      if (screenListItem) {
        delete screenListItem[fieldId]
        screenFieldsList[selectedScreenId] = screenListItem
      }
      state.screensFieldsList = screenFieldsList
    },
    setFieldProp: (
      state,
      action: PayloadAction<{
        screenId: string
        fieldId: string
        fieldName: string
        fieldValue: any
      }>
    ) => {
      // const selectedScreenId= state.screens[state.selectedScreen].screenId;
      const selectedScreen = state.selectedScreen
      const selectedScreenId = action.payload.screenId
      const { fieldId, fieldName, fieldValue } = action.payload
      const screenFields = state.screens[selectedScreen]?.screenFields
      const field = screenFields ? screenFields[fieldId] : null
      if (field) {
        field[fieldName] = fieldValue
        screenFields[fieldId] = field
        state.screens[selectedScreen].screenFields = screenFields
      }
      const screenFieldsList = state.screensFieldsList
      console.log("SCREEN FIELDS LIST IS: ", screenFieldsList)
      const screenListItem = screenFieldsList[selectedScreenId]
      if (screenListItem) {
        const field = screenListItem[fieldId]
        if (field) {
          field[fieldName] = fieldValue
          screenListItem[fieldId] = field
          screenFieldsList[selectedScreenId] = screenListItem
        }
      }
      state.screensFieldsList = screenFieldsList
    },
    // validateScreens: (
    //   state,
    //   action: PayloadAction<{ current: number | string; next: string }>
    // ) => {
    //   // const screenName = state.screens[action.payload];
    //   console.log("SCREEN NAMES ENTRY: ", action.payload)
    //   let screenName = ""
    //   if (typeof action.payload.current === "number") {
    //     screenName = state.screens[action.payload.current].screenName
    //   } else {
    //     screenName = action.payload.current
    //   }

    //   let screenId = ""
    //   let screenIndex = 0
    //   state.screens.map((screen, index) => {
    //     console.log("SCREEN NAMES ARE: ", screen.screenName)
    //     if (screen.screenName === screenName) {
    //       screenId = screen.screenId
    //       screenIndex = index
    //     }
    //   })
    //   console.log("SCREEN ID GOT: ", screenId)
    //   // const screenFields = screen.screenFields as ScreenFieldsObject;
    //   const screenFields = state.screensFieldsList[screenId]

    //   let errors = false
    //   Object.values(screenFields).forEach((field: ScreenFieldType) => {
    //     if (field.fieldRequired && !field.fieldValue) {
    //       field.toggleError = true
    //       state.screens[screenIndex].screenValidated = true
    //       errors = true
    //     } else {
    //       field.toggleError = false
    //       state.screens[screenIndex].screenValidated = true
    //       // state.screens[screenIndex].screenToggleError = false;
    //     }
    //   })
    //   state.screens[screenIndex].screenToggleError = errors
    //   if (
    //     errors === false &&
    //     action.payload.next !== state.currentScreenName &&
    //     action.payload.next
    //   ) {
    //     state.currentScreenName = action.payload.next
    //   }
    //   state.screens[screenIndex].screenFields = screenFields
    //   state.screensFieldsList[screenId] = screenFields
    // },
    setNewValidateScreen: (
      state,
      action: PayloadAction<{
        screenId: string
        screenValidated: boolean
        screenToggleError: boolean
      }>
    ) => {
      const { screenId, screenValidated, screenToggleError } = action.payload
      const screen = state.screens.find(
        (screen) => screen.screenId === screenId
      )
      if (screen) {
        screen.screenValidated = screenValidated
        screen.screenToggleError = screenToggleError
      }
    },
    resetScreensState: (state) => {
      state.selectedScreen = 0
      state.headerId = ""
      state.headerMode = false
      state.footerMode = false
      state.screensHeader = headerScreenData
      state.screensFooter = footerScreenData
      // state.screens = [buttonChoiceData, oneChoiceData, oneInputData];
      state.editorLoad = state.screens[state.selectedScreen].screenData
    },
    setEditorLoad: (state, action: PayloadAction<any>) => {
      state.editorLoad = action.payload

      if (state.headerMode === true) {
        state.screensHeader = action.payload
      } else if (state.footerMode === true) {
        state.screensFooter = action.payload
      } else {
        const selectedScreen = state.screens[state.selectedScreen]

        if (!selectedScreen) {
          // Handle case where selected screen is not found
          console.error(
            `Selected screen (${state.selectedScreen}) not found in state.`
          )
          return
        }

        // Update screenData of the selected screen
        selectedScreen.screenData = action.payload
      }
    },

    setScreenHeader: (state, action: PayloadAction<any>) => {
      state.screensHeader = JSON.stringify(action.payload)
    },
    setScrollY: (state, action: PayloadAction<number>) => {
      state.scrollY = action.payload
    },
    setScreenFooter: (state, action: PayloadAction<any>) => {
      state.screensFooter = JSON.stringify(action.payload)
    },
    setHeaderId: (state, action: PayloadAction<string>) => {
      state.headerId = action.payload
    },
    setHeaderMode: (state, action: PayloadAction<boolean>) => {
      state.selectedComponent = "ROOT"
      state.footerMode = false
      state.headerMode = action.payload
      state.editorLoad = state.screensHeader // Ensure new reference
    },
    setFooterMode: (state, action: PayloadAction<boolean>) => {
      state.selectedComponent = "ROOT"
      state.headerMode = false
      state.footerMode = action.payload
      state.editorLoad = state.screensFooter // Ensure new reference
    },
    setHeaderFooterMode: (state, action: PayloadAction<boolean>) => {
      state.selectedComponent = "ROOT"
      state.headerMode = action.payload
      state.footerMode = action.payload
    },
    setScreens: (state, action: PayloadAction<any[]>) => {
      state.screens = [...action.payload]
      state.firstScreenName = state.screens[0].screenName
    },
    setSelectedScreen: (state, action: PayloadAction<number>) => {
      state.headerMode = false
      state.footerMode = false
      state.selectedScreen = action.payload
      state.editorLoad = state.screens[action.payload]?.screenData // Ensure new reference
    },
    addAvatarComponentId(state, action) {
      if (!state.avatarComponentIds) {
        state.avatarComponentIds = []
      }
      state.avatarComponentIds.push(action.payload)
      state.previousAvatarComponentId = state.avatarComponentId
      state.avatarComponentId = action.payload
    },
    removeAvatarComponentId(state, action) {
      if (state.avatarComponentIds) {
        state.avatarComponentIds = state.avatarComponentIds.filter(
          (id) => id !== action.payload
        )
        state.previousAvatarComponentId = state.avatarComponentId
        state.avatarComponentId =
          state.avatarComponentIds[state.avatarComponentIds.length - 1] || null
      }
    },
    reorderScreens: (
      state,
      action: PayloadAction<{ startIndex: number; endIndex: number }>
    ) => {
      const { startIndex, endIndex } = action.payload
      const result = [...state.screens] // Create new array
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      state.screens = result
      state.firstScreenName = state.screens[0].screenName
    },
    addScreen: (state, action: PayloadAction<number>) => {
      const newId = hexoid(8)()
      const newScreens = [...state.screens] // Create new array
      const screenName = "screen-" + newId
      state.screensFieldsList[newId] = {}
      newScreens.splice(action.payload + 1, 0, {
        screenId: newId,
        screenName: screenName,
        screenData: JSON.stringify(emptyScreenData),
        screenLink: "",
        screenTemplateId: "",
        screenFields: {},
        screenValidated: false,
        screenToggleError: false,
      })
      state.screens = newScreens
      state.selectedScreen = action.payload + 1
      state.editorLoad = JSON.stringify(emptyScreenData) // Ensure new reference
      state.firstScreenName = state.screens[0].screenName
    },
    setNewCurrentScreenName: (state, action: PayloadAction<string>) => {
      state.currentScreenName = action.payload
    },
    setFirstScreenName: (state, action: PayloadAction<string>) => {
      state.firstScreenName = action.payload
    },
    duplicateScreens: (state, action: PayloadAction<number>) => {
      console.log("entered")
      const newScreens = [...state.screens] // Create new array
      const newId = hexoid(8)()
      const previousId = state.screens[action.payload]?.screenId
      const newScreen = {
        screenId: newId,
        screenName: "",
        screenData: "",
        screenLink: "",
        screenTemplateId: "",
        screenFields: {},
        screenValidated: false,
        screenToggleError: false,
      }
      state.screensFieldsList[newId] = state.screensFieldsList[previousId]
      newScreen.screenData = state.screens[action.payload].screenData // Create new object
      newScreen.screenName = "screen-" + newScreen.screenId
      newScreens.splice(action.payload + 1, 0, newScreen)
      state.screens = newScreens
      state.selectedScreen = action.payload + 1
      state.editorLoad = newScreen.screenData // Ensure new reference
      state.firstScreenName = state.screens[0].screenName
    },
    deleteScreen: (state, action: PayloadAction<number>) => {
      const screenToDelete = action.payload

      // Ensure state.screens is defined and is an array
      if (!Array.isArray(state.screens) || state.screens.length === 0) return

      // Ensure the index is valid
      if (screenToDelete < 0 || screenToDelete >= state.screens.length) return

      const screenToDeleteObject = state.screens[screenToDelete]

      // Check if the screen object exists and has the screenId property
      if (
        !screenToDeleteObject ||
        typeof screenToDeleteObject?.screenId === "undefined"
      )
        return

      const screenIdToDelete = screenToDeleteObject?.screenId

      // Safeguard: Check if screenIdToDelete exists in state.screensFieldsList
      if (screenIdToDelete in state.screensFieldsList) {
        delete state.screensFieldsList[screenIdToDelete]
      }

      // Create a new array without mutating the existing state directly
      state.screens = state.screens.filter(
        (_, index) => index !== screenToDelete
      )

      // Adjust selectedScreen based on the index of deleted screen
      if (state.screens.length === 0) {
        // No screens left after deletion
        state.selectedScreen = 0
        state.editorLoad = null
        state.firstScreenName = ""
      } else {
        // Set selectedScreen to the previous one or the first screen
        if (screenToDelete === 0) {
          state.selectedScreen = 0 // Move to the new first screen
        } else {
          state.selectedScreen = Math.max(0, screenToDelete - 1) // Move to the previous screen
        }

        // Ensure that the selectedScreen is within bounds
        state.editorLoad = state.screens[state.selectedScreen] || null
        state.firstScreenName = state.screens[0]?.screenName || ""
      }
    },
    setScreenName: (
      state,
      action: PayloadAction<{ screenId: string; screenName: string }>
    ) => {
      const { screenId, screenName } = action.payload
      const screen = state.screens.find(
        (screen) => screen.screenId === screenId
      )
      const duplicateName = state.screens.find(
        (screen) => screen.screenName === screenName
      )
      if (duplicateName) {
        return
      } else if (screen) {
        screen.screenName = screenName
      }
      state.firstScreenName = state.screens[0].screenName
    },
    setRenamingScreen: (state, action: PayloadAction<boolean>) => {
      state.renamingScreen = action.payload
    },
    navigateToScreen: (state, action: PayloadAction<string>) => {
      const screen = state.screens.find(
        (screen) => screen.screenName === action.payload
      )
      if (screen) {
        state.selectedScreen = state.screens.indexOf(screen)
        state.editorLoad = screen.screenData
      }
    },
    rollScreens: (state, action: PayloadAction<string>) => {
      state.screenRoller = action.payload
    },
    setComponentBeforeAvatar: (state, action: PayloadAction<boolean>) => {
      // Action payload is the container component ID
      state.hasComponentBeforeAvatar = action.payload
    },
    setAvatarBackgroundColor: (state, action: PayloadAction<string>) => {
      state.avatarBackgroundColor = action.payload
    },
  },
})

export const {
  setNewScreensData,
  setNewCurrentScreenName,
  setNewValidateScreen,
  resetScreens,
} = newScreensSlice.actions

export default newScreensSlice.reducer
