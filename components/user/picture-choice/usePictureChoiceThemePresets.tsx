import {
  PictureChoicePresets,
  PictureChoiceProps,
  PictureChoiceSizes,
} from "./user-picture-choice.component"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import hexoid from "hexoid"
import { rgba } from "polished"
import { useTranslations } from "next-intl"
import { PictureTypes } from "@/components/PicturePicker"

const usePictureChoiceThemePresets = () => {
  const theme = useAppSelector((state) => state.theme)
  const t = useTranslations("Components")

  const defaultIcon = "add-circle"

  const defaultChoices = [
    {
      id: `input-${hexoid(6)()}`,
      picture: "ai-generate-music-spark",
      pictureType: PictureTypes.ICON,
      value: t("Music"),
      buttonAction: "custom-action",
      nextScreen: "none",
      trackingEvent: null,
    },
    {
      id: `input-${hexoid(6)()}`,
      picture: "ai-generate-landscape-image-spark",
      pictureType: PictureTypes.ICON,
      value: t("Image"),
      buttonAction: "custom-action",
      nextScreen: "none",
      trackingEvent: null,
    },
    {
      id: `input-${hexoid(6)()}`,
      picture: "camera-video",
      pictureType: PictureTypes.ICON,
      value: t("Video"),
      buttonAction: "custom-action",
      nextScreen: "none",
      trackingEvent: null,
    },
    {
      id: `input-${hexoid(6)()}`,
      picture:
        "image-photo-four-photos-camera-picture-photography-pictures-four-photo",
      pictureType: PictureTypes.ICON,
      value: t("Gallery"),
      buttonAction: "custom-action",
      nextScreen: "none",
      trackingEvent: null,
    },
  ]

  const defaultSelections = [defaultChoices[1].id]

  const outlinedPreset: PictureChoiceProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    size: PictureChoiceSizes.medium,
    label: t("Please select an option"),
    required: false,
    fieldName: `${t("Picture Choice")
      .replaceAll(" ", "-")
      .toLowerCase()}-${hexoid(6)()}`,
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
    preset: PictureChoicePresets.outlined,
    defaultStyles: {
      checkBoxIconColor: "transparent",
      checkboxBorderColor: "#eaeaeb",
      checkBoxBackgroundColor: "transparent",
      iconColor: theme?.general?.primaryColor || "#3182ce",
      textColor: "#000000",
      textTopBorderColor: "transparent",
      textBackgroundColor: "transparent",
      borderColor: "#eaeaeb",
      backgroundColor: "transparent",
    },
    hoverStyles: {
      checkBoxIconColor: "transparent",
      checkboxBorderColor: "transparent",
      checkBoxBackgroundColor: "transparent",
      iconColor: theme?.general?.primaryColor || "#3182ce",
      textColor: "#000000",
      textTopBorderColor: "transparent",
      textBackgroundColor: "transparent",
      borderColor: theme?.general?.primaryColor || "#3182ce",
      backgroundColor: rgba(theme?.general?.primaryColor || "#3182ce", 0.05),
    },
    selectedStyles: {
      checkBoxIconColor: "transparent",
      checkboxBorderColor: "transparent",
      checkBoxBackgroundColor: "transparent",
      iconColor: theme?.general?.primaryColor || "#3182ce",
      textColor: "#000000",
      textTopBorderColor: "transparent",
      textBackgroundColor: "transparent",
      borderColor: theme?.general?.primaryColor || "#3182ce",
      backgroundColor: rgba(theme?.general?.primaryColor || "#3182ce", 0.1),
    },
    selections: [],
    choices: defaultChoices,
    tracking: false,
  }

  const semifilledPreset: PictureChoiceProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    size: PictureChoiceSizes.medium,
    label: t("Please select an option"),
    required: false,
    fieldName: `${t("Picture Choice")
      .replaceAll(" ", "-")
      .toLowerCase()}-${hexoid(6)()}`,
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
    preset: PictureChoicePresets.semifilled,
    defaultStyles: {
      checkBoxIconColor: "transparent",
      checkboxBorderColor: "#eaeaeb",
      checkBoxBackgroundColor: "#ffffff",
      iconColor: "#000000",
      textColor: "#000000",
      textTopBorderColor: "#eaeaeb",
      textBackgroundColor: "transparent",
      borderColor: "#eaeaeb",
      backgroundColor: "transparent",
    },
    hoverStyles: {
      checkBoxIconColor: theme?.general?.primaryColor || "#3182ce",
      checkboxBorderColor: theme?.general?.primaryColor || "#3182ce",
      checkBoxBackgroundColor: "#ffffff",
      iconColor: theme?.general?.primaryColor || "#3182ce",
      textColor: "#ffffff",
      textTopBorderColor: theme?.general?.primaryColor || "#3182ce",
      textBackgroundColor: theme?.general?.primaryColor || "#3182ce",
      borderColor: theme?.general?.primaryColor || "#3182ce",
      backgroundColor: "transparent",
    },
    selectedStyles: {
      checkBoxIconColor: "#ffffff",
      checkboxBorderColor: theme?.general?.primaryColor || "#3182ce",
      checkBoxBackgroundColor: theme?.general?.primaryColor || "#3182ce",
      iconColor: theme?.general?.primaryColor || "#3182ce",
      textColor: "#ffffff",
      textTopBorderColor: theme?.general?.primaryColor || "#3182ce",
      textBackgroundColor: theme?.general?.primaryColor || "#3182ce",
      borderColor: theme?.general?.primaryColor || "#3182ce",
      backgroundColor: "transparent",
    },
    selections: [],
    choices: defaultChoices,
    tracking: false,
  }

  const filledPreset: PictureChoiceProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    size: PictureChoiceSizes.medium,
    label: t("Please select an option"),
    required: false,
    fieldName: `${t("Picture Choice")
      .replaceAll(" ", "-")
      .toLowerCase()}-${hexoid(6)()}`,
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
    preset: PictureChoicePresets.filled,
    defaultStyles: {
      checkBoxIconColor: "transparent",
      checkboxBorderColor: "transparent",
      checkBoxBackgroundColor: "transparent",
      iconColor: theme?.general?.primaryColor || "#3182ce",
      textColor: "#000000",
      textTopBorderColor: "transparent",
      textBackgroundColor: "transparent",
      borderColor: "#eaeaeb",
      backgroundColor: "transparent",
    },
    hoverStyles: {
      checkBoxIconColor: "transparent",
      checkboxBorderColor: "transparent",
      checkBoxBackgroundColor: "transparent",
      iconColor: "#ffffff",
      textColor: "#ffffff",
      textTopBorderColor: "transparent",
      textBackgroundColor: "transparent",
      borderColor: theme?.general?.primaryColor || "#3182ce",
      backgroundColor: theme?.general?.primaryColor || "#3182ce",
    },
    selectedStyles: {
      checkBoxIconColor: "transparent",
      checkboxBorderColor: "transparent",
      checkBoxBackgroundColor: "transparent",
      iconColor: "#ffffff",
      textColor: "#ffffff",
      textTopBorderColor: "transparent",
      textBackgroundColor: "transparent",
      borderColor: theme?.general?.primaryColor || "#3182ce",
      backgroundColor: theme?.general?.primaryColor || "#3182ce",
    },
    selections: [],
    choices: defaultChoices,
    tracking: false,
  }

  return {
    outlinedPreset,
    semifilledPreset,
    filledPreset,
    defaultIcon,
    defaultSelections,
    defaultChoices,
  }
}

export default usePictureChoiceThemePresets
