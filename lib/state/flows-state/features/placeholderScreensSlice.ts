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
  selectedData: string[]
  alarm: boolean
  totalRequired: number
  totalFilled: number
  errorCount: number
  isVisible: boolean
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
  filledContent: []
  isUpdating?: boolean
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
  filledContent: [],
  isUpdating: false,
}

export const screensSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    resetScreen: (state) => initialState,
    setScreensData: (state, action: PayloadAction<any>) => {
      state.flowName = action.payload.name
      state.firstScreenName = action.payload.steps[0]?.name
      state.currentScreenName = action.payload.steps[0]?.name
      const screensFieldsList = {}
      const screenNames: string[] = []

      // Step 1: Build screensFieldsList and check for unique screen names
      const uniqueSteps = action.payload.steps.filter((screen: any) => {
        if (screenNames.includes(screen.name)) {
          console.warn(`Duplicate screen name detected: ${screen.name}`)
          return false // Skip duplicate screen
        }
        screenNames.push(screen.name) // Track this name
        screensFieldsList[screen.id] = {} // Add to the fields list
        return true
      })

      // Step 2: Set the rest of the state using the unique steps
      state.screensFieldsList = screensFieldsList
      state.screensHeader = action.payload.headerData ?? state.screensHeader
      state.screensFooter = action.payload.footerData ?? state.screensFooter
      state.selectedScreen = 0
      state.screens = uniqueSteps.map((screen: any) => ({
        screenId: screen.id,
        screenName: screen.name,
        screenData: JSON.stringify(screen.content),
        screenLink: screen.link,
        screenFields: {},
        screenValidated: false,
        screenToggleError: false,
        selectedData: [],
        alarm: false,
        errorCount: 0,
        isVisible: false,
      }))

      // Set the first screen to visible if applicable
      if (state.screens[state.selectedScreen]?.isVisible) {
        state.screens[state.selectedScreen].isVisible = true
      }

      // Load the editor with the selected screen's data
      state.editorLoad = state.screens[state.selectedScreen]?.screenData
    },
    setIsUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload
    },
    setSelectedData: (state, action: PayloadAction<string[]>) => {
      const screens = JSON.parse(JSON.stringify(state.screens[0]))
      console.log(
        "changing selected data",
        action.payload,
        screens,
        state.selectedScreen
      )
      state.screens[state.selectedScreen] = {
        ...state.screens[state.selectedScreen],
        selectedData: action.payload,
      }
    },
    setPreviewScreenData: (
      state,
      action: PayloadAction<{
        nodeId: number
        entity: string
        isArray: boolean
        newSelections: string[]
      }>
    ) => {
      // Clone the current screen data
      let prevScreenData = JSON.parse(
        JSON.stringify(state.screens[state.selectedScreen])
      )

      // Parse the screenData to access the individual nodes
      let screenData = JSON.parse(prevScreenData.screenData)

      // Update the selections for the specified nodeId
      if (screenData[action.payload.nodeId]) {
        screenData[action.payload.nodeId].props[action.payload.entity] = action
          .payload.isArray
          ? action.payload.newSelections
          : action.payload.newSelections[0]
      }

      // Convert the updated screenData back to a string
      prevScreenData.screenData = JSON.stringify(screenData)

      // Update the state with the modified screen data
      state.screens[state.selectedScreen] = {
        ...prevScreenData,
      }
      let newScreenData = JSON.parse(
        JSON.stringify(state.screens[state.selectedScreen])
      )
      console.log("newScreenData", JSON.parse(newScreenData.screenData))
    },
    setAlarm: (state, action: PayloadAction<boolean>) => {
      state.screens[state.selectedScreen].alarm = action.payload
    },
    setErrorCount: (state, action: PayloadAction<number>) => {
      state.screens[state.selectedScreen].errorCount = action.payload
    },
    setTotalRequired: (state, action: PayloadAction<boolean>) => {
      state.screens.map((screen, index) => {
        let eachScreen = JSON.parse(JSON.stringify(screen))
        let screenData = JSON.parse(eachScreen.screenData)
        console.log(
          "------eachSCreen, screenData ------",
          eachScreen,
          screenData
        )
        let count = Object.values(screenData).filter(
          (node: any) =>
            node.type !== "UserContainer" &&
            (node.props?.required === true ||
              node.props?.inputRequired === true)
        )
        let count2 = Object.values(screenData).filter(
          (node: any) =>
            node.type !== "UserContainer" &&
            (node.props?.required === true ||
              node.props?.inputRequired === true) &&
            ((node.props?.selections && node.props?.selections?.length > 0) ||
              (node.props?.inputValue &&
                node.props.inputValue.trim() !== "" &&
                node.props.inputValue !== "Components.Text Area") ||
              (node.props?.selectedOptionId &&
                node.props.selectedOptionId.trim() !== "") ||
              (node.props?.input && node.props.input.trim() !== ""))
        )

        console.log("count", count, count2)
        screen.totalRequired = count.length
        screen.totalFilled = count2.length
        screen.errorCount = 0
      })
      if (state.screens[state.selectedScreen]?.isVisible)
        state.screens[state.selectedScreen].isVisible = true
    },
    getAllFilledAnswers: (state, action: PayloadAction<boolean>) => {
      // Initialize an array to hold the filled data for each screen
      let totalFilled: any = [] // Adjust type as needed

      // Deep clone screen and parse screenData
      const screen = state.screens[state.selectedScreen]
      console.log("curret screen while getting answers", state.selectedScreen)
      let eachScreen = JSON.parse(JSON.stringify(screen))
      let screenData = JSON.parse(eachScreen.screenData)
      state.filledContent = []
      Object.entries(screenData).forEach(([key, node]: [string, any]) => {
        const dataLabel =
          node.props?.fieldName ||
          node.props?.label ||
          node?.displayName ||
          node.props?.id
        const dataId = node.props?.id || key || node?.displayName
        console.log("node", node, "data-label", dataLabel, "key", key)
        if (
          node.type !== "UserContainer" &&
          ((node.props?.selections && node.props?.selections.length > 0) ||
            (node.props?.inputValue &&
              node.props.inputValue !== "Components.Text Area") ||
            node.props?.input ||
            node.props?.selectedOptionId)
        ) {
          // Extract one of the values that meet the conditions
          if (node.props?.selections && node.props.selections.length > 0) {
            //node.props.fieldName || node.props.label node.displayName || node.props.id
            const options = node.props?.choices
            //
            const result = options
              .filter((choice) => node.props?.selections?.includes(choice.id))
              .map((choice) => ({ id: choice.id, value: choice.value }))
            totalFilled[dataId] = {
              label: dataLabel,
              value: node.props?.selections?.length > 1 ? result : result[0],
              type:
                node.props?.selections?.length > 1 ? "m-choice" : "s-choice",
            }
          } else if (
            node.props?.inputValue &&
            node.props.inputValue !== "Components.Text Area"
          ) {
            totalFilled[dataId] = {
              label: dataLabel,
              value: node.props.inputValue,
            }
          } else if (node.props?.selectedOptionId) {
            totalFilled[dataId] = {
              label: dataLabel,
              value: node.props.selectedOptionId,
            }
          } else if (node.props?.input) {
            totalFilled[dataId] = {
              label: dataLabel,
              value: node.props.input,
            }
          }
        }
      })

      // Convert totalFilled to a JSON string
      const totalFilledJson = JSON.stringify(totalFilled)

      // For demonstration purposes, log the totalFilled array
      console.log(
        "Total Filled Answers by Screen:",
        totalFilled,
        totalFilled.length
      )
      state.filledContent = totalFilled
      // Optionally, update the state with the totalFilled array if needed
      // state.filledAnswers = totalFilled; // Adjust according to your state shape
    },
    setResetTotalFilled: (state, action: PayloadAction<boolean>) => {
      state.screens.forEach((screen) => {
        // Changed map to forEach
        let eachScreen = JSON.parse(JSON.stringify(screen))
        let screenData = JSON.parse(eachScreen.screenData)
        console.log(
          "------eachScreen, screenData for resetting ------",
          eachScreen,
          screenData
        )

        // Reset fields to empty strings for non-UserContainer nodes
        Object.values(screenData).forEach((node: any) => {
          if (node.type !== "UserContainer") {
            if (node.props?.inputValue) {
              node.props.inputValue = ""
            }
            if (node.props?.selectedOptionId) {
              node.props.selectedOptionId = ""
            }
            if (node.props?.input) {
              node.props.input = ""
            }
            if (node.props?.selections) {
              node.props.selections = []
            }
          }
        })

        // Update totalFilled and reset other properties
        screen.totalFilled = 0 // Set totalFilled to 0
        screen.alarm = false // Reset alarm
        screen.errorCount = 0 // Reset error count
      })
    },

    setSelectedComponent: (state, action: PayloadAction<string>) => {
      state.selectedComponent = action.payload
    },
    setUpdateFilledCount: (state, action: PayloadAction<number>) => {
      if (action.payload) {
        state.screens[state.selectedScreen].totalFilled =
          state.screens[state.selectedScreen].totalFilled + action.payload
      }
    },
    updateHeaderPosition: (state, action: PayloadAction<string>) => {
      // const headerSlice = JSON.parse(state.screensHeader);
      // console.log("HEADER SLICE", headerSlice)
      // headerSlice.ROOT.props.style.position=action.payload;
      // state.screensHeader = JSON.stringify(headerSlice);
      return
    },
    addField: (state, action: PayloadAction<ScreenFieldType>) => {
      // console.log("Add field");
      const selectedScreen = state.selectedScreen
      const selectedId = state.screens[selectedScreen].screenId
      const field = action.payload
      const screenFields = state.screens[selectedScreen]?.screenFields
      screenFields[field.fieldId] = field
      state.screens[selectedScreen].screenFields = screenFields
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
      const { screenId, fieldId, fieldName, fieldValue } = action.payload

      // Update screenFields in selected screen
      const selectedScreen = state.selectedScreen
      const screenFields = state.screens[selectedScreen]?.screenFields

      if (!screenFields || !screenFields[fieldId]) {
        console.error(
          `Field with fieldId ${fieldId} not found in screenFields.`
        )
        return
      }

      const updatedField = {
        ...screenFields[fieldId], // Clone the original field object
        [fieldName]: fieldValue, // Update the specified field property
      }

      // Update state with updated screenFields for selected screen
      state.screens[selectedScreen].screenFields = {
        ...screenFields,
        [fieldId]: updatedField,
      }

      // Update screenFieldsList
      const screenFieldsList = state.screensFieldsList
      const screenListItem = screenFieldsList[screenId]

      if (screenListItem && screenListItem[fieldId]) {
        const updatedListItem = {
          ...screenListItem,
          [fieldId]: {
            ...screenListItem[fieldId],
            [fieldName]: fieldValue,
          },
        }

        state.screensFieldsList = {
          ...screenFieldsList,
          [screenId]: updatedListItem,
        }
      } else {
        console.error(
          `Field with fieldId ${fieldId} not found in screenFieldsList[${screenId}].`
        )
      }
    },

    validateScreen: (
      state,
      action: PayloadAction<{ current: number | string; next: string }>
    ) => {
      console.log("SCREEN NAMES ENTRY: ", action.payload)

      let screenName = ""
      if (typeof action.payload.current === "number") {
        screenName = state.screens[action.payload.current].screenName
      } else {
        screenName = action.payload.current
      }

      let screenId = ""
      let screenIndex = -1 // Initialize to -1 for easier error checking

      state.screens.forEach((screen, index) => {
        console.log("SCREEN NAMES ARE: ", screen.screenName)
        if (screen.screenName === screenName) {
          screenId = screen.screenId
          screenIndex = index
        }
      })

      if (screenIndex === -1) {
        console.error("Screen not found!")
        return
      }

      console.log("SCREEN ID GOT: ", screenId)

      // Get the fields for the found screen
      const screenFields = state.screensFieldsList[screenId] || {}

      let errors = false

      // Validate each field in screenFields
      Object.values(screenFields).forEach((field: ScreenFieldType) => {
        if (field.fieldRequired && !field.fieldValue) {
          field.toggleError = true
          errors = true
        } else {
          field.toggleError = false
        }
      })

      // Update screen validation status
      state.screens[screenIndex].screenValidated = true
      state.screens[screenIndex].screenToggleError = errors

      // Update current screen name if there are no errors and the next screen is different
      if (
        !errors &&
        action.payload.next !== state.currentScreenName &&
        action.payload.next
      ) {
        state.currentScreenName = action.payload.next
      }

      // Update the fields and fields list in the state
      state.screens[screenIndex].screenFields = screenFields
      state.screensFieldsList[screenId] = screenFields
    },
    setValidateScreen: (
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
      state.editorLoad = state.screens[state.selectedScreen]?.screenData
    },
    setEditorLoad: (state, action: PayloadAction<any>) => {
      const newEditorLoad = action.payload

      // Depending on mode, update the appropriate part of the state
      if (state.headerMode === true) {
        state.screensHeader = newEditorLoad
      } else if (state.footerMode === true) {
        state.screensFooter = newEditorLoad
      } else {
        state.screens[state.selectedScreen].screenData = newEditorLoad
      }
    },
    setEditorSelectedComponent: (state, action: PayloadAction<any>) => {
      const newEditorLoad = action.payload

      // Function to find the first non-matching key in new vs. old objects
      function filterCommonKeys(newObj, oldObj) {
        for (const key in newObj) {
          if (!(key in oldObj)) {
            return key // Return the first non-matching key.
          }
        }
        return null // Return null if all keys match.
      }

      try {
        const oldEditorLoad = JSON.parse(
          state.screens[state.selectedScreen].screenData
        )

        if (
          newEditorLoad?.ROOT?.nodes?.length >
          oldEditorLoad?.ROOT?.nodes?.length
        ) {
          const filteredNewEditorLoad = filterCommonKeys(
            newEditorLoad,
            oldEditorLoad
          )

          if (filteredNewEditorLoad) {
            state.selectedComponent = filteredNewEditorLoad
          }
        } else {
          // for (const key in oldEditorLoad) {
          //   const oldValue = oldEditorLoad[key]
          //   if (oldValue.displayName === "Form Content") {
          //     const newValue = newEditorLoad[key]
          //     if (newValue && newValue.nodes.length > oldValue.nodes.length) {
          //       state.selectedComponent = key // Early return
          //       break // Stop the loop
          //     }
          //   }
          // }
        }
      } catch (err) {
        console.error("Error in setEditorData:", err)
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
      // state.firstScreenName = state.screens[0].screenName
    },
    setSelectedScreen: (state, action: PayloadAction<number>) => {
      state.headerMode = false
      state.footerMode = false
      if (state.screens[state.selectedScreen]?.isVisible)
        state.screens[state.selectedScreen].isVisible = false
      state.selectedScreen = action.payload
      if (state.screens[action.payload]?.isVisible)
        state.screens[action.payload].isVisible = true
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
        selectedData: [],
        alarm: false,
        totalRequired: 0,
        totalFilled: 0,
        errorCount: 0,
        isVisible: true,
      })
      state.screens = newScreens
      state.screens[state.selectedScreen].isVisible = false
      state.selectedScreen = action.payload + 1
      state.screens[action.payload + 1].isVisible = true
      state.editorLoad = JSON.stringify(emptyScreenData) // Ensure new reference
      state.firstScreenName = state.screens[0].screenName
    },
    setCurrentScreenName: (state, action: PayloadAction<string>) => {
      state.currentScreenName = action.payload
    },
    setFirstScreenName: (state, action: PayloadAction<string>) => {
      state.firstScreenName = action.payload
    },
    duplicateScreen: (state, action: PayloadAction<number>) => {
      console.log("entered placeholders")

      // Create a copy of the current screens array
      const newScreens = [...state.screens]

      // Generate a new unique ID
      const newId = hexoid(8)()

      // Get the index of the screen to duplicate
      const indexToDuplicate = action.payload

      // Get the screen data to duplicate
      const screenToDuplicate = state.screens[indexToDuplicate]

      // Create a new screen object, copying all properties except the ID
      const newScreen = {
        screenId: newId,
        screenName: "screen-" + newId,
        screenData: screenToDuplicate.screenData,
        screenLink: screenToDuplicate.screenLink,
        screenTemplateId: screenToDuplicate.screenTemplateId,
        screenFields: { ...screenToDuplicate.screenFields }, // Deep copy if necessary
        screenValidated: screenToDuplicate.screenValidated,
        screenToggleError: screenToDuplicate.screenToggleError,
        selectedData: [...screenToDuplicate.selectedData],
        alarm: screenToDuplicate.alarm,
        totalRequired: screenToDuplicate.totalRequired,
        totalFilled: screenToDuplicate.totalFilled,
        errorCount: 0,
        isVisible: true,
      }

      // Add the new screen right after the original
      newScreens.splice(indexToDuplicate + 1, 0, newScreen)

      // Update the screens array in the state
      state.screens = newScreens

      // Ensure the new screen data is loaded in the editor
      state.editorLoad = newScreen.screenData

      // Update selectedScreen to point to the newly duplicated screen
      state.screens[state.selectedScreen].isVisible = false
      state.selectedScreen = indexToDuplicate + 1
      state.screens[indexToDuplicate + 1].isVisible = true
      // Update the screensFieldsList if necessary
      state.screensFieldsList[newId] =
        state.screensFieldsList[screenToDuplicate.screenId]

      // Update the first screen name if necessary
      state.firstScreenName = state.screens[0].screenName
    },

    deleteScreen: (state, action: PayloadAction<number>) => {
      if (state.screens.length === 1) return
      const screenToDelete = action.payload
      const screenIdToDelete = state.screens[screenToDelete].screenId
      delete state.screensFieldsList[screenIdToDelete]
      const newScreens = [...state.screens] // Create new array
      newScreens.splice(screenToDelete, 1)
      state.screens = newScreens

      // If 0th screen is deleted, move to the next screen; if > 0, move to the previous screen
      if (action.payload === 0) {
        state.selectedScreen = 0 // Move to the new first screen
      } else {
        state.selectedScreen = Math.max(0, action.payload - 1) // Move to the previous screen
      }

      state.editorLoad = state.screens[state.selectedScreen] // Ensure new reference
      state.firstScreenName = state.screens[0].screenName
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
  setScreensData,
  setSelectedComponent,
  setCurrentScreenName,
  setFirstScreenName,
  removeField,
  setValidateScreen,
  updateHeaderPosition,
  addField,
  validateScreen,
  setFieldProp,
  rollScreens,
  addAvatarComponentId,
  navigateToScreen,
  setHeaderMode,
  resetScreensState,
  setScreenHeader,
  setScreenFooter,
  setFooterMode,
  setHeaderFooterMode,
  setScrollY,
  setSelectedScreen,
  reorderScreens,
  removeAvatarComponentId,
  addScreen,
  setEditorLoad,
  setComponentBeforeAvatar,
  setAvatarBackgroundColor,
  duplicateScreen,
  setScreens,
  deleteScreen,
  setHeaderId,
  setScreenName,
  setRenamingScreen,
  setSelectedData,
  setPreviewScreenData,
  setAlarm,
  setErrorCount,
  setTotalRequired,
  setUpdateFilledCount,
  setResetTotalFilled,
  resetScreen,
  getAllFilledAnswers,
  setEditorSelectedComponent,
  setIsUpdating,
} = screensSlice.actions

export default screensSlice.reducer
