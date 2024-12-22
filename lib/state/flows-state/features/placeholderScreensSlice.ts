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

export interface FlowState {
  flowName: string
  selectedComponent: string
  selectedScreen: number
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
  filledContent: any[]
  isUpdating?: boolean
}

const initialFlowState = {
  flowName: "",
  selectedComponent: "ROOT",
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
  screensFieldsList: {},
  footerMode: false,
  renamingScreen: false,
  screens: [],
  screensFooter: JSON.stringify(footerScreenData),
  editorLoad: {},
  screenRoller: "",
  scrollY: 0,
  filledContent: [],
  isUpdating: false,
}

export interface ScreensState {
  flows: Record<string, FlowState>
  firstScreenName: string
  currentScreenName: string
}

const initialState: ScreensState = {
  flows: {},
  firstScreenName: "",
  currentScreenName: "",
}

const validateInitialFlow = (state, flowId) => {
  if (!flowId) {
    throw new Error("Flow ID is required to set screens data.")
  }
  if (!state.flows[flowId]) {
    state.flows[flowId] = initialFlowState
  }
}

export const screensSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    resetScreen: () => {},
    setScreensData: (state, action: PayloadAction<any>) => {
      validateInitialFlow(state, action.payload.flowId)
      state.flows[action.payload.flowId].flowName = action.payload.name
      state.firstScreenName =
        action.payload.steps[0]?.name
      state.currentScreenName =
        action.payload.steps[0]?.name
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
      state.flows[action.payload.flowId].screensFieldsList = screensFieldsList
      state.flows[action.payload.flowId].screensHeader =
        action.payload.headerData ?? state.flows[action.payload.flowId].screensHeader
      state.flows[action.payload.flowId].screensFooter =
        action.payload.footerData ?? state.flows[action.payload.flowId].screensFooter
      state.flows[action.payload.flowId].selectedScreen = 0
      state.flows[action.payload.flowId].screens = uniqueSteps.map((screen: any) => ({
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
      if (
        state.flows[action.payload.flowId].screens[
          state.flows[action.payload.flowId].selectedScreen
        ]?.isVisible
      ) {
        state.flows[action.payload.flowId].screens[
          state.flows[action.payload.flowId].selectedScreen
        ].isVisible = true
      }

      // Load the editor with the selected screen's data
      state.flows[action.payload.flowId].editorLoad =
        state.flows[action.payload.flowId].screens[
          state.flows[action.payload.flowId].selectedScreen
        ]?.screenData
    },
    setIsUpdating: (
      state,
      action: PayloadAction<{ flowId: string; value: boolean }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      state.flows[action.payload.flowId].isUpdating = action.payload.value
    },
    setSelectedData: (
      state,
      action: PayloadAction<{ flowId: string; value: string[] }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)

      state.flows[action.payload.flowId].screens[
        state.flows[action.payload.flowId].selectedScreen
      ] = {
        ...state.flows[action.payload.flowId].screens[
          state.flows[action.payload.flowId].selectedScreen
        ],
        selectedData: action.payload.value,
      }
    },
    setPreviewScreenData: (
      state,
      action: PayloadAction<{
        flowId: string
        nodeId: number
        entity: string
        isArray: boolean
        newSelections: string[]
      }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      // Clone the current screen data
      let prevScreenData = JSON.parse(
        JSON.stringify(state.flows[flowId].screens[state.flows[flowId].selectedScreen])
      )
      console.log(
        "inside setPreviewScreenData",
        action.payload.nodeId,
        action.payload.entity,
        action.payload.isArray,
        action.payload.newSelections
      )
      // Parse the screenData to access the individual nodes
      let screenData = JSON.parse(prevScreenData.screenData)

      // Update the selections for the specified nodeId
      if (screenData[action.payload.nodeId]) {
        console.log(
          "if true",
          screenData[action.payload.nodeId].props[action.payload.entity]
        )
        screenData[action.payload.nodeId].props[action.payload.entity] = action
          .payload.isArray
          ? action.payload.newSelections
          : action.payload.newSelections[0]
      }

      // Convert the updated screenData back to a string
      prevScreenData.screenData = JSON.stringify(screenData)

      // Update the state with the modified screen data
      state.flows[flowId].screens[state.flows[flowId].selectedScreen] = {
        ...prevScreenData,
      }
      let newScreenData = JSON.parse(
        JSON.stringify(state.flows[flowId].screens[state.flows[flowId].selectedScreen])
      )
      console.log("newScreenData", JSON.parse(newScreenData.screenData))
    },
    setAlarm: (
      state,
      action: PayloadAction<{ flowId: string; value: boolean }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].screens[state.flows[flowId].selectedScreen].alarm =
        action.payload.value
    },
    setErrorCount: (
      state,
      action: PayloadAction<{ flowId: string; value: number }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].screens[state.flows[flowId].selectedScreen].errorCount =
        action.payload.value
    },
    setTotalRequired: (
      state,
      action: PayloadAction<{ flowId: string; value: boolean }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].screens.map((screen, index) => {
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
      if (state.flows[flowId].screens[state.flows[flowId].selectedScreen]?.isVisible)
        state.flows[flowId].screens[state.flows[flowId].selectedScreen].isVisible = true
    },
    getAllFilledAnswers: (
      state,
      action: PayloadAction<{ flowId: string; value: boolean }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      // Initialize an array to hold the filled data for each screen
      let totalFilled: any = [] // Adjust type as needed

      // Deep clone screen and parse screenData
      const screen = state.flows[flowId].screens[state.flows[flowId].selectedScreen]
      console.log(
        "curret screen while getting answers",
        state.flows[flowId].selectedScreen
      )
      let eachScreen = JSON.parse(JSON.stringify(screen))
      let screenData = JSON.parse(eachScreen.screenData)
      console.log("sccccc", screenData)
      state.flows[flowId].filledContent = []
      Object.entries(screenData).forEach(([key, node]: [string, any]) => {
        const dataLabel =
          node.props?.fieldName ||
          node.props?.label ||
          node?.displayName ||
          node.props?.id
        const dataId = key || node.props?.id || node?.displayName
        console.log(
          "node",
          node,
          "data-label",
          dataLabel,
          "key",
          key,
          "dataId",
          dataId
        )
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
              order: state.flows[flowId].selectedScreen,
              screenId:
                state.flows[flowId].screens[state.flows[flowId].selectedScreen].screenId,
            }
          } else if (
            node.props?.inputValue &&
            node.props.inputValue !== "Components.Text Area"
          ) {
            totalFilled[dataId] = {
              label: dataLabel,
              value: node.props.inputValue,
              order: state.flows[flowId].selectedScreen,
              screenId:
                state.flows[flowId].screens[state.flows[flowId].selectedScreen].screenId,
            }
          } else if (node.props?.selectedOptionId) {
            const selectResult = node.props?.selectOptions?.find(
              (option) => option.id === node.props?.selectedOptionId
            )
            const matchedValue = selectResult ? selectResult.value : null
            totalFilled[dataId] = {
              label: dataLabel,
              value: matchedValue,
              order: state.flows[flowId].selectedScreen,
              screenId:
                state.flows[flowId].screens[state.flows[flowId].selectedScreen].screenId,
            }
          } else if (node.props?.input) {
            totalFilled[dataId] = {
              label: dataLabel,
              value: node.props.input,
              order: state.flows[flowId].selectedScreen,
              screenId:
                state.flows[flowId].screens[state.flows[flowId].selectedScreen].screenId,
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
      state.flows[flowId].filledContent = totalFilled
      // Optionally, update the state with the totalFilled array if needed
      // state.filledAnswers = totalFilled; // Adjust according to your state shape
    },
    setResetTotalFilled: (
      state,
      action: PayloadAction<{ flowId: string; value: boolean }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].screens.forEach((screen) => {
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

    setSelectedComponent: (
      state,
      action: PayloadAction<{ flowId: string; value: string }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].selectedComponent = action.payload.value
    },
    setUpdateFilledCount: (
      state,
      action: PayloadAction<{ flowId: string; value: number }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      if (action.payload) {
        state.flows[flowId].screens[state.flows[flowId].selectedScreen].totalFilled =
          state.flows[flowId].screens[state.flows[flowId].selectedScreen].totalFilled +
          action.payload.value
      }
    },
    updateHeaderPosition: (state, action: PayloadAction<string>) => {
      // const headerSlice = JSON.parse(state.screensHeader);
      // console.log("HEADER SLICE", headerSlice)
      // headerSlice.ROOT.props.style.position=action.payload;
      // state.screensHeader = JSON.stringify(headerSlice);
      return
    },
    addField: (
      state,
      action: PayloadAction<{ flowId: string; value: ScreenFieldType }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      // console.log("Add field");
      const selectedScreen = state.flows[flowId].selectedScreen
      const selectedId = state.flows[flowId].screens[selectedScreen].screenId
      const field = action.payload.value
      const screenFields = state.flows[flowId].screens[selectedScreen]?.screenFields
      screenFields[field.fieldId] = field
      state.flows[flowId].screens[selectedScreen].screenFields = screenFields
      state.flows[flowId].screensFieldsList[selectedId] = screenFields
    },
    removeField: (
      state,
      action: PayloadAction<{ flowId: string; value: string }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      const selectedScreen = state.flows[flowId].selectedScreen
      const selectedScreenId = state.flows[flowId].screens[selectedScreen].screenId
      const fieldId = action.payload.value
      const screenFields = state.flows[flowId].screens[selectedScreen]?.screenFields

      delete screenFields[fieldId]
      state.flows[flowId].screens[selectedScreen].screenFields = screenFields
      const screenFieldsList = state.flows[flowId].screensFieldsList
      const screenListItem = screenFieldsList[selectedScreenId]
      if (screenListItem) {
        delete screenListItem[fieldId]
        screenFieldsList[selectedScreenId] = screenListItem
      }
      state.flows[flowId].screensFieldsList = screenFieldsList
    },
    setFieldProp: (
      state,
      action: PayloadAction<{
        flowId: string
        screenId: string
        fieldId: string
        fieldName: string
        fieldValue: any
      }>
    ) => {
      const { screenId, fieldId, fieldName, fieldValue, flowId } =
        action.payload
      validateInitialFlow(state, flowId)

      // Update screenFields in selected screen
      const selectedScreen = state.flows[flowId].selectedScreen
      const screenFields = state.flows[flowId].screens[selectedScreen]?.screenFields

      if (!screenFields || !screenFields[fieldId]) {
        // console.error(
        //   `Field with fieldId ${fieldId} not found in screenFields.`
        // )
        return
      }

      const updatedField = {
        ...screenFields[fieldId], // Clone the original field object
        [fieldName]: fieldValue, // Update the specified field property
      }

      // Update state with updated screenFields for selected screen
      state.flows[flowId].screens[selectedScreen].screenFields = {
        ...screenFields,
        [fieldId]: updatedField,
      }

      // Update screenFieldsList
      const screenFieldsList = state.flows[flowId].screensFieldsList
      const screenListItem = screenFieldsList[screenId]

      if (screenListItem && screenListItem[fieldId]) {
        const updatedListItem = {
          ...screenListItem,
          [fieldId]: {
            ...screenListItem[fieldId],
            [fieldName]: fieldValue,
          },
        }

        state.flows[flowId].screensFieldsList = {
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
      action: PayloadAction<{
        flowId: string
        current: number | string
        next: string
      }>
    ) => {
      console.log("SCREEN NAMES ENTRY: ", action.payload)
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId

      let screenName = ""
      if (typeof action.payload.current === "number") {
        screenName = state.flows[flowId].screens[action.payload.current].screenName
      } else {
        screenName = action.payload.current
      }

      let screenId = ""
      let screenIndex = -1 // Initialize to -1 for easier error checking

      state.flows[flowId].screens.forEach((screen, index) => {
        // console.log("SCREEN NAMES ARE: ", screen.screenName)
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
      const screenFields = state.flows[flowId].screensFieldsList[screenId] || {}

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
      state.flows[flowId].screens[screenIndex].screenValidated = true
      state.flows[flowId].screens[screenIndex].screenToggleError = errors

      // Update current screen name if there are no errors and the next screen is different
      if (
        !errors &&
        action.payload.next !== state.currentScreenName &&
        action.payload.next
      ) {
        state.currentScreenName = action.payload.next
      }

      // Update the fields and fields list in the state
      state.flows[flowId].screens[screenIndex].screenFields = screenFields
      state.flows[flowId].screensFieldsList[screenId] = screenFields
    },
    setValidateScreen: (
      state,
      action: PayloadAction<{
        flowId: string
        screenId: string
        screenValidated: boolean
        screenToggleError: boolean
      }>
    ) => {
      const { flowId, screenId, screenValidated, screenToggleError } =
        action.payload
      validateInitialFlow(state, flowId)
      const screen = state.flows[flowId].screens.find(
        (screen) => screen.screenId === screenId
      )
      if (screen) {
        screen.screenValidated = screenValidated
        screen.screenToggleError = screenToggleError
      }
    },
    resetScreensState: (state, action: PayloadAction<{ flowId: string }>) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].selectedScreen = 0
      state.flows[flowId].headerId = ""
      state.flows[flowId].headerMode = false
      state.flows[flowId].footerMode = false
      state.flows[flowId].screensHeader = headerScreenData
      state.flows[flowId].screensFooter = footerScreenData
      // state.flows[flowId].screens = [buttonChoiceData, oneChoiceData, oneInputData];
      state.flows[flowId].editorLoad =
        state.flows[flowId].screens[state.flows[flowId].selectedScreen]?.screenData
    },
    setEditorLoad: (state, action: PayloadAction<any>) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      const newEditorLoad = action.payload

      // Depending on mode, update the appropriate part of the state
      if (state.flows[flowId].headerMode === true) {
        state.flows[flowId].screensHeader = newEditorLoad
      } else if (state.flows[flowId].footerMode === true) {
        state.flows[flowId].screensFooter = newEditorLoad
      } else {
        state.flows[flowId].screens[state.flows[flowId].selectedScreen].screenData =
          newEditorLoad
      }
    },
    setEditorSelectedComponent: (state, action: PayloadAction<any>) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
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
          state.flows[flowId].screens[state.flows[flowId].selectedScreen].screenData
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
            state.flows[flowId].selectedComponent = filteredNewEditorLoad
          }
        } else {
          // for (const key in oldEditorLoad) {
          //   const oldValue = oldEditorLoad[key]
          //   if (oldValue.displayName === "Form Content") {
          //     const newValue = newEditorLoad[key]
          //     if (newValue && newValue.nodes.length > oldValue.nodes.length) {
          //       state.flows[flowId].selectedComponent = key // Early return
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
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].screensHeader = JSON.stringify(action.payload)
    },
    setScrollY: (
      state,
      action: PayloadAction<{ flowId: string; value: number }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].scrollY = action.payload.value
    },
    setScreenFooter: (state, action: PayloadAction<any>) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].screensFooter = JSON.stringify(action.payload)
    },
    setHeaderId: (
      state,
      action: PayloadAction<{ flowId: string; value: string }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].headerId = action.payload.value
    },
    setHeaderMode: (
      state,
      action: PayloadAction<{ flowId: string; value: boolean }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].selectedComponent = "ROOT"
      state.flows[flowId].footerMode = false
      state.flows[flowId].headerMode = action.payload.value
      state.flows[flowId].editorLoad = state.flows[flowId].screensHeader // Ensure new reference
    },
    setFooterMode: (
      state,
      action: PayloadAction<{ flowId: string; value: boolean }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].selectedComponent = "ROOT"
      state.flows[flowId].headerMode = false
      state.flows[flowId].footerMode = action.payload.value
      state.flows[flowId].editorLoad = state.flows[flowId].screensFooter // Ensure new reference
    },
    setHeaderFooterMode: (
      state,
      action: PayloadAction<{ flowId: string; value: boolean }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].selectedComponent = "ROOT"
      state.flows[flowId].headerMode = action.payload.value
      state.flows[flowId].footerMode = action.payload.value
    },
    setScreens: (
      state,
      action: PayloadAction<{ flowId: string; value: any[] }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].screens = [...action.payload.value]
      // state.firstScreenName = state.screens[0].screenName
    },
    setSelectedScreen: (
      state,
      action: PayloadAction<{ flowId: string; value: number }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].headerMode = false
      state.flows[flowId].footerMode = false
      if (state.flows[flowId].screens[state.flows[flowId].selectedScreen]?.isVisible)
        state.flows[flowId].screens[state.flows[flowId].selectedScreen].isVisible = false
      state.flows[flowId].selectedScreen = action.payload.value
      if (state.flows[flowId].screens[action.payload.value]?.isVisible)
        state.flows[flowId].screens[action.payload.value].isVisible = true
      state.flows[flowId].editorLoad =
        state.flows[flowId].screens[action.payload.value]?.screenData // Ensure new reference
    },
    addAvatarComponentId(
      state,
      action: PayloadAction<{ flowId: string; value: string }>
    ) {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId

      if (!state.flows[flowId].avatarComponentIds) {
        state.flows[flowId].avatarComponentIds = []
      }
      state.flows[flowId].avatarComponentIds.push(action.payload.value)
      state.flows[flowId].previousAvatarComponentId = state.flows[flowId].avatarComponentId
      state.flows[flowId].avatarComponentId = action.payload.value
    },
    removeAvatarComponentId(
      state,
      action: PayloadAction<{ flowId: string; value: string }>
    ) {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId

      if (state.flows[flowId].avatarComponentIds) {
        state.flows[flowId].avatarComponentIds = state.flows[
          flowId
        ].avatarComponentIds.filter((id) => id !== action.payload.value)
        state.flows[flowId].previousAvatarComponentId =
          state.flows[flowId].avatarComponentId
        state.flows[flowId].avatarComponentId =
          state.flows[flowId].avatarComponentIds[
            state.flows[flowId].avatarComponentIds.length - 1
          ] || null
      }
    },
    reorderScreens: (
      state,
      action: PayloadAction<{
        flowId: string
        startIndex: number
        endIndex: number
      }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const { flowId, startIndex, endIndex } = action.payload
      const result = [...state.flows[flowId].screens] // Create new array
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      state.flows[flowId].screens = result
      state.firstScreenName = state.flows[flowId].screens[0].screenName
    },
    addScreen: (
      state,
      action: PayloadAction<{ flowId: string; value: number }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId

      const newId = hexoid(8)()
      const newScreens = [...state.flows[flowId].screens] // Create new array
      const screenName = "screen-" + newId
      state.flows[flowId].screensFieldsList[newId] = {}
      newScreens.splice(action.payload.value + 1, 0, {
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
      state.flows[flowId].screens = newScreens
      state.flows[flowId].screens[state.flows[flowId].selectedScreen].isVisible = false
      state.flows[flowId].selectedScreen = action.payload.value + 1
      state.flows[flowId].screens[action.payload.value + 1].isVisible = true
      state.flows[flowId].editorLoad = JSON.stringify(emptyScreenData) // Ensure new reference
      state.firstScreenName = state.flows[flowId].screens[0].screenName
    },
    setCurrentScreenName: (
      state,
      action: PayloadAction<string>
    ) => {
      state.currentScreenName = action.payload
    },
    setFirstScreenName: (
      state,
      action: PayloadAction<string>
    ) => {
      state.firstScreenName = action.payload
    },
    duplicateScreen: (
      state,
      action: PayloadAction<{ flowId: string; value: number }>
    ) => {
      console.log("entered placeholders")
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId

      // Create a copy of the current screens array
      const newScreens = [...state.flows[flowId].screens]

      // Generate a new unique ID
      const newId = hexoid(8)()

      // Get the index of the screen to duplicate
      const indexToDuplicate = action.payload.value

      // Get the screen data to duplicate
      const screenToDuplicate = state.flows[flowId].screens[indexToDuplicate]

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
      state.flows[flowId].screens = newScreens

      // Ensure the new screen data is loaded in the editor
      state.flows[flowId].editorLoad = newScreen.screenData

      // Update selectedScreen to point to the newly duplicated screen
      state.flows[flowId].screens[state.flows[flowId].selectedScreen].isVisible = false
      state.flows[flowId].selectedScreen = indexToDuplicate + 1
      state.flows[flowId].screens[indexToDuplicate + 1].isVisible = true
      // Update the screensFieldsList if necessary
      state.flows[flowId].screensFieldsList[newId] =
        state.flows[flowId].screensFieldsList[screenToDuplicate.screenId]

      // Update the first screen name if necessary
      state.firstScreenName = state.flows[flowId].screens[0].screenName
    },

    deleteScreen: (
      state,
      action: PayloadAction<{ flowId: string; value: number }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      if (state.flows[flowId].screens.length === 1) return
      const screenToDelete = action.payload.value
      const screenIdToDelete = state.flows[flowId].screens[screenToDelete].screenId
      delete state.flows[flowId].screensFieldsList[screenIdToDelete]
      const newScreens = [...state.flows[flowId].screens] // Create new array
      newScreens.splice(screenToDelete, 1)
      state.flows[flowId].screens = newScreens

      // If 0th screen is deleted, move to the next screen; if > 0, move to the previous screen
      if (action.payload.value === 0) {
        state.flows[flowId].selectedScreen = 0 // Move to the new first screen
      } else {
        state.flows[flowId].selectedScreen = Math.max(0, action.payload.value - 1) // Move to the previous screen
      }

      state.flows[flowId].editorLoad =
        state.flows[flowId].screens[state.flows[flowId].selectedScreen] // Ensure new reference
      state.firstScreenName = state.flows[flowId].screens[0].screenName
    },
    setScreenName: (
      state,
      action: PayloadAction<{
        flowId: string
        screenId: string
        screenName: string
      }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const { flowId, screenId, screenName } = action.payload

      const screen = state.flows[flowId].screens.find(
        (screen) => screen.screenId === screenId
      )
      const duplicateName = state.flows[flowId].screens.find(
        (screen) => screen.screenName === screenName
      )
      if (duplicateName) {
        return
      } else if (screen) {
        screen.screenName = screenName
      }
      state.firstScreenName = state.flows[flowId].screens[0].screenName
    },
    setRenamingScreen: (
      state,
      action: PayloadAction<{ flowId: string; value: boolean }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].renamingScreen = action.payload.value
    },
    navigateToScreen: (
      state,
      action: PayloadAction<{ flowId: string; value: string }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      const screen = state.flows[flowId].screens.find(
        (screen) => screen.screenName === action.payload.value
      )
      if (screen) {
        state.flows[flowId].selectedScreen = state.flows[flowId].screens.indexOf(screen)
        state.flows[flowId].editorLoad = screen.screenData
      }
    },
    rollScreens: (
      state,
      action: PayloadAction<{ flowId: string; value: string }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].screenRoller = action.payload.value
    },
    setComponentBeforeAvatar: (
      state,
      action: PayloadAction<{ flowId: string; value: boolean }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      // Action payload is the container component ID
      state.flows[flowId].hasComponentBeforeAvatar = action.payload.value
    },
    setAvatarBackgroundColor: (
      state,
      action: PayloadAction<{ flowId: string; value: string }>
    ) => {
      validateInitialFlow(state, action.payload.flowId)
      const flowId = action.payload.flowId
      state.flows[flowId].avatarBackgroundColor = action.payload.value
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
