import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import hexoid from "hexoid";



import emptyScreenData from "@/components/user/screens/empty-screen.json";
import footerScreenData from "@/components/user/screens/screen-footer.json";
import headerScreenData from "@/components/user/screens/screen-header.json";





export type ScreenFieldType = {
  fieldId: string
  fieldName: string
  fieldValue: string | number | boolean | null
  fieldRequired: boolean
  toggleError: boolean
}

export type ScreenFieldsObject = Record<string, ScreenFieldType>

export type ScreenFieldsListType = Record<string, ScreenFieldsObject>

export type ScreenDataType = Record<string, any>

export type ScreenType = {
  screenId: string
  screenName: string
  screenData: string
  screenLink: string
  screenTemplateId: string
  screenFields: ScreenFieldsObject
  screenValidated: boolean
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
  screenNameToId: Record<string, string>
  headerId: string
  headerMode: boolean
  avatarComponentId: string | null
  footerMode: boolean
  renamingScreen: boolean
  previousAvatarComponentId: string | null
  avatarComponentIds: string[]
  screensHeader: string
  screensFooter: string
  screens: ScreenType[]
  screensFieldsList: ScreenFieldsListType
  screenRoller: string
  editorLoad: string
  scrollY: number
  hasComponentBeforeAvatar: boolean
  avatarBackgroundColor: string
  filledContent: Record<string, any>[]
  isUpdating: boolean
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
  screensFieldsList: {},
  footerMode: false,
  renamingScreen: false,
  screens: [],
  screensFooter: JSON.stringify(footerScreenData),
  editorLoad: "",
  screenRoller: "",
  scrollY: 0,
  filledContent: [],
  isUpdating: false,
}

export const screensSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    resetScreen: () => initialState,
    setScreensData: (state, action: PayloadAction<any>) => {
      state.flowName = action.payload.name
      if (action.payload.steps[0]) {
        state.firstScreenName = action.payload.steps[0].name
        state.currentScreenName = action.payload.steps[0].name
      }

      const screensFieldsList: ScreenFieldsListType = {}
      const screenNames = new Set<string>()

      const uniqueSteps = action.payload.steps.filter((screen: any) => {
        if (screenNames.has(screen.name)) {
          console.warn(`Duplicate screen name detected: ${screen.name}`)
          return false
        }
        screenNames.add(screen.name)
        screensFieldsList[screen.id] = {}
        return true
      })

      state.screensFieldsList = screensFieldsList
      state.screensHeader = action.payload.headerData ?? state.screensHeader
      state.screensFooter = action.payload.footerData ?? state.screensFooter
      state.selectedScreen = 0
      state.screens = uniqueSteps.map((screen: any) => ({
        screenId: screen.id,
        screenName: screen.name,
        screenData: JSON.stringify(screen.content),
        screenLink: screen.link,
        screenTemplateId: "",
        screenFields: {},
        screenValidated: false,
        screenToggleError: false,
        selectedData: [],
        alarm: false,
        totalRequired: 0,
        totalFilled: 0,
        errorCount: 0,
        isVisible: false,
      }))

      if (state.screens[state.selectedScreen]) {
        state.screens[state.selectedScreen].isVisible = true
        state.editorLoad = state.screens[state.selectedScreen].screenData
      }
    },
    setIsUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload
    },
    setSelectedData: (state, action: PayloadAction<string[]>) => {
      state.screens[state.selectedScreen] = {
        ...state.screens[state.selectedScreen],
        selectedData: action.payload,
      }
    },
    setPreviewScreenData: (
      state,
      action: PayloadAction<{
        nodeId: string
        entity: string
        isArray: boolean
        newSelections: string[]
      }>
    ) => {
      const prevScreenData = JSON.parse(
        state.screens[state.selectedScreen].screenData
      )

      if (prevScreenData[action.payload.nodeId]) {
        prevScreenData[action.payload.nodeId].props[action.payload.entity] =
          action.payload.isArray
            ? action.payload.newSelections
            : action.payload.newSelections[0]
      }

      state.screens[state.selectedScreen].screenData =
        JSON.stringify(prevScreenData)
    },
    setAlarm: (state, action: PayloadAction<boolean>) => {
      state.screens[state.selectedScreen].alarm = action.payload
    },
    setErrorCount: (state, action: PayloadAction<number>) => {
      state.screens[state.selectedScreen].errorCount = action.payload
    },
    setTotalRequired: (state) => {
      state.screens.forEach((screen) => {
        const screenData = JSON.parse(screen.screenData)
        const nodes = Object.values(screenData)

        const requiredNodes = nodes.filter(
          (node: any) =>
            node.type !== "UserContainer" &&
            (node.props?.required || node.props?.inputRequired)
        )

        const filledNodes = requiredNodes.filter(
          (node: any) =>
            node.props?.selections?.length > 0 ||
            (node.props?.inputValue && node.props.inputValue.trim() !== "") ||
            (node.props?.selectedOptionId &&
              node.props.selectedOptionId.trim() !== "") ||
            (node.props?.input && node.props.input.trim() !== "")
        )

        screen.totalRequired = requiredNodes.length
        screen.totalFilled = filledNodes.length
        screen.errorCount = 0
      })

      if (state.screens[state.selectedScreen]) {
        state.screens[state.selectedScreen].isVisible = true
      }
    },
    getAllFilledAnswers: (state) => {
      const totalFilled: Record<string, any> = {}
      const screen = state.screens[state.selectedScreen]
      const screenData = JSON.parse(screen.screenData)

      Object.entries(screenData).forEach(([key, node]: [string, any]) => {
        const dataLabel =
          node.props?.fieldName ||
          node.props?.label ||
          node.displayName ||
          node.props?.id
        const dataId = key || node.props?.id || node.displayName

        if (
          node.type !== "UserContainer" &&
          (node.props?.selections?.length > 0 ||
            (node.props?.inputValue &&
              node.props.inputValue !== "Components.Text Area") ||
            node.props?.input ||
            node.props?.selectedOptionId)
        ) {
          if (node.props?.selections?.length > 0) {
            const options = node.props?.choices || []
            const result = options
              .filter((choice: any) =>
                node.props.selections.includes(choice.id)
              )
              .map((choice: any) => ({ id: choice.id, value: choice.value }))

            totalFilled[dataId] = {
              label: dataLabel,
              value: node.props.selections.length > 1 ? result : result[0],
              type: node.props.selections.length > 1 ? "m-choice" : "s-choice",
              order: state.selectedScreen,
              screenId: screen.screenId,
            }
          } else if (
            node.props?.inputValue &&
            node.props.inputValue !== "Components.Text Area"
          ) {
            totalFilled[dataId] = {
              label: dataLabel,
              value: node.props.inputValue,
              order: state.selectedScreen,
              screenId: screen.screenId,
            }
          } else if (node.props?.selectedOptionId) {
            const selectResult = node.props.selectOptions?.find(
              (option: any) => option.id === node.props.selectedOptionId
            )
            const matchedValue = selectResult ? selectResult.value : null
            totalFilled[dataId] = {
              label: dataLabel,
              value: matchedValue,
              order: state.selectedScreen,
              screenId: screen.screenId,
            }
          } else if (node.props?.input) {
            totalFilled[dataId] = {
              label: dataLabel,
              value: node.props.input,
              order: state.selectedScreen,
              screenId: screen.screenId,
            }
          }
        }
      })

      state.filledContent = Object.values(totalFilled)
    },
    setResetTotalFilled: (state) => {
      state.screens.forEach((screen) => {
        const screenData = JSON.parse(screen.screenData)

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

        screen.totalFilled = 0
        screen.alarm = false
        screen.errorCount = 0
      })
    },
    setSelectedComponent: (state, action: PayloadAction<string>) => {
      state.selectedComponent = action.payload
    },
    setUpdateFilledCount: (state, action: PayloadAction<number>) => {
      if (action.payload) {
        state.screens[state.selectedScreen].totalFilled += action.payload
      }
    },
    addField: (state, action: PayloadAction<ScreenFieldType>) => {
      const selectedScreen = state.selectedScreen
      const selectedId = state.screens[selectedScreen].screenId
      const field = action.payload
      const screenFields = state.screens[selectedScreen].screenFields

      screenFields[field.fieldId] = field
      state.screens[selectedScreen].screenFields = screenFields
      state.screensFieldsList[selectedId] = screenFields
    },
    removeField: (state, action: PayloadAction<string>) => {
      const selectedScreen = state.selectedScreen
      const selectedScreenId = state.screens[selectedScreen].screenId
      const fieldId = action.payload
      const screenFields = state.screens[selectedScreen].screenFields

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
      const selectedScreen = state.selectedScreen
      const screenFields = state.screens[selectedScreen].screenFields

      if (!screenFields || !screenFields[fieldId]) {
        return
      }

      screenFields[fieldId] = {
        ...screenFields[fieldId],
        [fieldName]: fieldValue,
      }

      state.screens[selectedScreen].screenFields = screenFields

      if (
        state.screensFieldsList[screenId] &&
        state.screensFieldsList[screenId][fieldId]
      ) {
        state.screensFieldsList[screenId][fieldId][fieldName] = fieldValue
      }
    },
    validateScreen: (
      state,
      action: PayloadAction<{ current: number | string; next: string }>
    ) => {
      let screenName = ""
      if (typeof action.payload.current === "number") {
        screenName = state.screens[action.payload.current]?.screenName || ""
      } else {
        screenName = action.payload.current
      }

      let screenId = ""
      let screenIndex = -1

      state.screens.forEach((screen, index) => {
        if (screen.screenName === screenName) {
          screenId = screen.screenId
          screenIndex = index
        }
      })

      if (screenIndex === -1) {
        console.error("Screen not found!")
        return
      }

      const screenFields = state.screensFieldsList[screenId] || {}
      let errors = false

      Object.values(screenFields).forEach((field: ScreenFieldType) => {
        if (field.fieldRequired && !field.fieldValue) {
          field.toggleError = true
          errors = true
        } else {
          field.toggleError = false
        }
      })

      state.screens[screenIndex].screenValidated = true
      state.screens[screenIndex].screenToggleError = errors

      if (
        !errors &&
        action.payload.next !== state.currentScreenName &&
        action.payload.next
      ) {
        state.currentScreenName = action.payload.next
      }

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
      state.screensHeader = JSON.stringify(headerScreenData)
      state.screensFooter = JSON.stringify(footerScreenData)
      if (state.screens[state.selectedScreen]) {
        state.editorLoad = state.screens[state.selectedScreen].screenData
      }
    },
    setEditorLoad: (state, action: PayloadAction<string>) => {
      if (state.headerMode) {
        state.screensHeader = action.payload
      } else if (state.footerMode) {
        state.screensFooter = action.payload
      } else {
        state.screens[state.selectedScreen].screenData = action.payload
      }
    },
    setEditorSelectedComponent: (state, action: PayloadAction<any>) => {
      function filterCommonKeys(newObj: any, oldObj: any) {
        for (const key in newObj) {
          if (!(key in oldObj)) {
            return key
          }
        }
        return null
      }

      try {
        const oldEditorLoad = JSON.parse(
          state.screens[state.selectedScreen].screenData
        )

        const newEditorLoad = action.payload
        if (
          newEditorLoad?.ROOT?.nodes?.length >
          oldEditorLoad?.ROOT?.nodes?.length
        ) {
          const filteredKey = filterCommonKeys(newEditorLoad, oldEditorLoad)
          if (filteredKey) {
            state.selectedComponent = filteredKey
          }
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
      state.editorLoad = state.screensHeader
    },
    setFooterMode: (state, action: PayloadAction<boolean>) => {
      state.selectedComponent = "ROOT"
      state.headerMode = false
      state.footerMode = action.payload
      state.editorLoad = state.screensFooter
    },
    setHeaderFooterMode: (state, action: PayloadAction<boolean>) => {
      state.selectedComponent = "ROOT"
      state.headerMode = action.payload
      state.footerMode = action.payload
    },
    setScreens: (state, action: PayloadAction<ScreenType[]>) => {
      state.screens = [...action.payload]
    },
    setSelectedScreen: (state, action: PayloadAction<number>) => {
      state.headerMode = false
      state.footerMode = false
      if (state.screens[state.selectedScreen]) {
        state.screens[state.selectedScreen].isVisible = false
      }
      state.selectedScreen = action.payload
      if (state.screens[action.payload]) {
        state.screens[action.payload].isVisible = true
        state.editorLoad = state.screens[action.payload].screenData
      }
    },
    addAvatarComponentId: (state, action: PayloadAction<string>) => {
      state.avatarComponentIds.push(action.payload)
      state.previousAvatarComponentId = state.avatarComponentId
      state.avatarComponentId = action.payload
    },
    removeAvatarComponentId: (state, action: PayloadAction<string>) => {
      state.avatarComponentIds = state.avatarComponentIds.filter(
        (id) => id !== action.payload
      )
      state.previousAvatarComponentId = state.avatarComponentId
      state.avatarComponentId =
        state.avatarComponentIds[state.avatarComponentIds.length - 1] || null
    },
    reorderScreens: (
      state,
      action: PayloadAction<{ startIndex: number; endIndex: number }>
    ) => {
      const { startIndex, endIndex } = action.payload
      const result = [...state.screens]
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      state.screens = result
      state.firstScreenName = state.screens[0]?.screenName || ""
    },
    addScreen: (state, action: PayloadAction<number>) => {
      const newId = hexoid(8)()
      const newScreen: ScreenType = {
        screenId: newId,
        screenName: "screen-" + newId,
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
      }
      state.screensFieldsList[newId] = {}

      state.screens.splice(action.payload + 1, 0, newScreen)
      if (state.screens[state.selectedScreen]) {
        state.screens[state.selectedScreen].isVisible = false
      }
      state.selectedScreen = action.payload + 1
      state.screens[state.selectedScreen].isVisible = true
      state.editorLoad = newScreen.screenData
      state.firstScreenName = state.screens[0]?.screenName || ""
    },
    setCurrentScreenName: (state, action: PayloadAction<string>) => {
      state.currentScreenName = action.payload
    },
    setFirstScreenName: (state, action: PayloadAction<string>) => {
      state.firstScreenName = action.payload
    },
    duplicateScreen: (state, action: PayloadAction<number>) => {
      const newId = hexoid(8)()
      const indexToDuplicate = action.payload
      const screenToDuplicate = state.screens[indexToDuplicate]
      const newScreen: ScreenType = {
        ...screenToDuplicate,
        screenId: newId,
        screenName: "screen-" + newId,
        errorCount: 0,
        isVisible: true,
      }

      state.screensFieldsList[newId] = {
        ...state.screensFieldsList[screenToDuplicate.screenId],
      }
      state.screens.splice(indexToDuplicate + 1, 0, newScreen)
      if (state.screens[state.selectedScreen]) {
        state.screens[state.selectedScreen].isVisible = false
      }
      state.selectedScreen = indexToDuplicate + 1
      state.screens[state.selectedScreen].isVisible = true
      state.editorLoad = newScreen.screenData
      state.firstScreenName = state.screens[0]?.screenName || ""
    },
    deleteScreen: (state, action: PayloadAction<number>) => {
      if (state.screens.length <= 1) return
      const screenToDelete = action.payload
      const screenIdToDelete = state.screens[screenToDelete].screenId
      delete state.screensFieldsList[screenIdToDelete]
      state.screens.splice(screenToDelete, 1)

      if (state.selectedScreen >= state.screens.length) {
        state.selectedScreen = state.screens.length - 1
      }
      if (state.screens[state.selectedScreen]) {
        state.editorLoad = state.screens[state.selectedScreen].screenData
      }
      state.firstScreenName = state.screens[0]?.screenName || ""
    },
    setScreenName: (
      state,
      action: PayloadAction<{ screenId: string; screenName: string }>
    ) => {
      const { screenId, screenName } = action.payload
      const duplicateName = state.screens.find(
        (screen) => screen.screenName === screenName
      )
      if (duplicateName) return

      const screen = state.screens.find(
        (screen) => screen.screenId === screenId
      )
      if (screen) {
        screen.screenName = screenName
      }
      state.firstScreenName = state.screens[0]?.screenName || ""
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
