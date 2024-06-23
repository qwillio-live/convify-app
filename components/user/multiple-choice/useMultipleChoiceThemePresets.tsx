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
import icons from "@/constant/streamline.json"

const useMultipleChoiceThemePresets = () => {
  const theme = useAppSelector((state) => state.theme)
  const t = useTranslations("Components")

  const previewSelections = ["input-4"]
  const previewChoices = [
    {
      id: `input-1`,
      picture:
        icons["programming-module-cube-code-module-programming-plugin"].body,
      pictureType: PictureTypes.ICON,
      value: `${t("Option")} 1`,
      buttonAction: null,
      nextScreen: null,
      trackingEvent: null,
    },
    {
      id: `input-2`,
      picture:
        icons[
          "programming-browser-check-checkmark-pass-window-app-code-programming-success-check-apps"
        ].body,
      pictureType: PictureTypes.ICON,
      value: `${t("Option")} 2`,
      buttonAction: null,
      nextScreen: null,
      trackingEvent: null,
    },
    {
      id: `input-3`,
      picture: icons["database"].body,
      pictureType: PictureTypes.ICON,
      value: `${t("Option")} 3`,
      buttonAction: null,
      nextScreen: null,
      trackingEvent: null,
    },
    {
      id: `input-4`,
      picture: icons["code-monitor-1"].body,
      pictureType: PictureTypes.ICON,
      value: `${t("Option")} 4`,
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
    label: `${t("Please select an option")}`,
    required: false,
    fieldName: `${t("Multiple Choice")
      .replace(" ", "-")
      .toLowerCase()}-${hexoid(6)()}`,
    layout: MultipleChoiceLayouts.collapsed,
    labelColor: "#000000",
    labelBorderColor: theme?.general?.primaryColor || "#3182ce",
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
    label: `${t("Please select an option")}`,
    required: false,
    fieldName: `${t("Multiple Choice")
      .replace(" ", "-")
      .toLowerCase()}-${hexoid(6)()}`,
    layout: MultipleChoiceLayouts.collapsed,
    labelColor: "#000000",
    labelBorderColor: theme?.general?.primaryColor || "#3182ce",
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
    label: `${t("Please select an option")}`,
    required: false,
    fieldName: `${t("Multiple Choice")
      .replace(" ", "-")
      .toLowerCase()}-${hexoid(6)()}`,
    layout: MultipleChoiceLayouts.collapsed,
    labelColor: "#000000",
    labelBorderColor: theme?.general?.primaryColor || "#3182ce",
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
