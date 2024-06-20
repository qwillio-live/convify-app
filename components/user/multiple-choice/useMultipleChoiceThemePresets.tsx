import {
  MultipleChoiceLayouts,
  MultipleChoicePresets,
  MultipleChoiceProps,
  MultipleChoiceSizes,
} from "./user-multiple-choice.component"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import hexoid from "hexoid"
import { rgba } from "polished"
import { useTranslations } from "next-intl"
import { PictureTypes } from "@/components/PicturePicker"

const useMultipleChoiceThemePresets = () => {
  const theme = useAppSelector((state) => state.theme)
  const t = useTranslations("Components")

  const previewSelections = ["input-2"]
  const previewChoices = [
    {
      id: `input-1`,
      picture:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="20px" height="20px"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="7" cy="3" rx="6.5" ry="2.5"/><path d="M.5 3v8c0 1.38 2.91 2.5 6.5 2.5s6.5-1.12 6.5-2.5V3"/><path d="M13.5 7c0 1.38-2.91 2.5-6.5 2.5S.5 8.38.5 7"/></g></svg>',
      pictureType: PictureTypes.ICON,
      value: `Idle`,
      buttonAction: null,
      nextScreen: null,
      trackingEvent: null,
    },
    {
      id: `input-2`,
      picture:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="20px" height="20px"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H1a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 13 2m-7 9l-1 2.5M8 11l1 2.5m-5 0h6"/><path d="m4.5 5.25l-1.75 1.5L4.25 8m5.5-2.5l1.5 1.25l-1.75 1.5m-3.25.5l1.5-4.5"/></g></svg>',
      pictureType: PictureTypes.ICON,
      value: `Selected`,
      buttonAction: null,
      nextScreen: null,
      trackingEvent: null,
    },
  ]
  const defaultChoices = [
    {
      id: `input-${hexoid(6)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      value: `${t("Option")} 1`,
      buttonAction: null,
      nextScreen: null,
      trackingEvent: null,
    },
    {
      id: `input-${hexoid(6)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      value: `${t("Option")} 2`,
      buttonAction: null,
      nextScreen: null,
      trackingEvent: null,
    },
    {
      id: `input-${hexoid(6)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      value: `${t("Option")} 3`,
      buttonAction: null,
      nextScreen: null,
      trackingEvent: null,
    },
    {
      id: `input-${hexoid(6)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      value: `${t("Option")} 4`,
      buttonAction: null,
      nextScreen: null,
      trackingEvent: null,
    },
  ]

  const filledPreset: MultipleChoiceProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    size: MultipleChoiceSizes.medium,
    required: false,
    fieldName: `${t("Multiple Choice").replace(" ", "-").toLowerCase()}-${hexoid(6)()}`,
    layout: MultipleChoiceLayouts.collapsed,
    containerBackground: "transparent",
    paddingLeft: "16",
    paddingTop: "20",
    paddingRight: "16",
    paddingBottom: "20",
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    fullWidth: true,
    settingTabs: ["content"],
    multiSelect: false,
    checkboxVisible: false,
    contentReversed: false,
    preset: MultipleChoicePresets.filled,
    defaultStyles: {
      checkBoxIconColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      checkboxBorderColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      checkBoxBackgroundColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      iconColor: {
        value: "#000000",
        globalStyled: false,
        isCustomized: false,
      },
      textColor: {
        value: "#000000",
        globalStyled: false,
        isCustomized: false,
      },
      borderColor: {
        value: "#eaeaeb",
        globalStyled: false,
        isCustomized: false,
      },
      backgroundColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
    },
    hoverStyles: {
      checkBoxIconColor: {
        value: "#ffffff",
        globalStyled: false,
        isCustomized: false,
      },
      checkboxBorderColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      checkBoxBackgroundColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      iconColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: false,
        isCustomized: false,
      },
      textColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: false,
        isCustomized: false,
      },
      borderColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      backgroundColor: {
        value: "transparent",
        globalStyled: true,
        isCustomized: false,
      },
    },
    selectedStyles: {
      checkBoxIconColor: {
        value: "#ffffff",
        globalStyled: false,
        isCustomized: false,
      },
      checkboxBorderColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      checkBoxBackgroundColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      iconColor: {
        value: "#ffffff",
        globalStyled: false,
        isCustomized: false,
      },
      textColor: {
        value: "#ffffff",
        globalStyled: false,
        isCustomized: false,
      },
      borderColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      backgroundColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
    },
    selections: [],
    choices: defaultChoices,
    tracking: false,
  }

  const semifilledPreset: MultipleChoiceProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    size: MultipleChoiceSizes.medium,
    required: false,
    fieldName: `${t("Multiple Choice").replace(" ", "-").toLowerCase()}-${hexoid(6)()}`,
    layout: MultipleChoiceLayouts.collapsed,
    containerBackground: "transparent",
    paddingLeft: "16",
    paddingTop: "20",
    paddingRight: "16",
    paddingBottom: "20",
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    fullWidth: true,
    settingTabs: ["content"],
    multiSelect: false,
    checkboxVisible: true,
    contentReversed: true,
    preset: MultipleChoicePresets.semifilled,
    defaultStyles: {
      checkBoxIconColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      checkboxBorderColor: {
        value: "#eaeaeb",
        globalStyled: false,
        isCustomized: false,
      },
      checkBoxBackgroundColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      iconColor: {
        value: "#5a5a5a",
        globalStyled: false,
        isCustomized: false,
      },
      textColor: {
        value: "#000000",
        globalStyled: false,
        isCustomized: false,
      },
      borderColor: {
        value: "#eaeaeb",
        globalStyled: false,
        isCustomized: false,
      },
      backgroundColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
    },
    hoverStyles: {
      checkBoxIconColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      checkboxBorderColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      checkBoxBackgroundColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      iconColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      textColor: {
        value: "#000000",
        globalStyled: false,
        isCustomized: false,
      },
      borderColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      backgroundColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
    },
    selectedStyles: {
      checkBoxIconColor: {
        value: "#ffffff",
        globalStyled: false,
        isCustomized: false,
      },
      checkboxBorderColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      checkBoxBackgroundColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      iconColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      textColor: {
        value: "#000000",
        globalStyled: true,
        isCustomized: false,
      },
      borderColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      backgroundColor: {
        value: rgba(theme?.general?.primaryColor || "#3182ce", 0.1),
        globalStyled: true,
        isCustomized: false,
      },
    },
    selections: [],
    choices: defaultChoices,
    tracking: false,
  }

  const outlinedPreset: MultipleChoiceProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    size: MultipleChoiceSizes.medium,
    required: false,
    fieldName: `${t("Multiple Choice").replace(" ", "-").toLowerCase()}-${hexoid(6)()}`,
    layout: MultipleChoiceLayouts.collapsed,
    containerBackground: "transparent",
    paddingLeft: "16",
    paddingTop: "20",
    paddingRight: "16",
    paddingBottom: "20",
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    fullWidth: true,
    settingTabs: ["content"],
    multiSelect: false,
    checkboxVisible: true,
    contentReversed: false,
    preset: MultipleChoicePresets.outlined,
    defaultStyles: {
      checkBoxIconColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      checkboxBorderColor: {
        value: "#eaeaeb",
        globalStyled: false,
        isCustomized: false,
      },
      checkBoxBackgroundColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      iconColor: {
        value: "#5a5a5a",
        globalStyled: false,
        isCustomized: false,
      },
      textColor: {
        value: "#000000",
        globalStyled: false,
        isCustomized: false,
      },
      borderColor: {
        value: "#eaeaeb",
        globalStyled: false,
        isCustomized: false,
      },
      backgroundColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
    },
    hoverStyles: {
      checkBoxIconColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      checkboxBorderColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      checkBoxBackgroundColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
      iconColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      textColor: {
        value: "#000000",
        globalStyled: false,
        isCustomized: false,
      },
      borderColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      backgroundColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
    },
    selectedStyles: {
      checkBoxIconColor: {
        value: "#ffffff",
        globalStyled: false,
        isCustomized: false,
      },
      checkboxBorderColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      checkBoxBackgroundColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      iconColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      textColor: {
        value: "#000000",
        globalStyled: true,
        isCustomized: false,
      },
      borderColor: {
        value: theme?.general?.primaryColor || "#3182ce",
        globalStyled: true,
        isCustomized: false,
      },
      backgroundColor: {
        value: "transparent",
        globalStyled: false,
        isCustomized: false,
      },
    },
    selections: [],
    choices: defaultChoices,
    tracking: false,
  }

  return {
    filledPreset,
    semifilledPreset,
    outlinedPreset,
    previewSelections,
    previewChoices,
  }
}

export default useMultipleChoiceThemePresets