import { useSelector } from "react-redux"
import { GlobalThemeState } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { IconButtonProps, IconButtonSizes } from "./back-component"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { darken, rgba } from "polished"
import { useTranslations } from "next-intl"
import hexoid from "hexoid"
import { PictureTypes } from "@/components/PicturePicker"

const useBackThemePresets = () => {
  const t = useTranslations("Components")
  const theme = useAppSelector((state) => state.theme)
  const darkenedPrimaryColor = darken(
    0.05,
    theme?.general?.primaryColor || "#3182ce"
  )
  const alphaBackgroundColor = rgba(
    theme?.general?.primaryColor || "#3182ce",
    0.1
  )

  const backFilledPreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "rgba(255,255,255,0)",
    background: {
      value: getBackgroundForPreset(
        "#f3f3f3", // Lighter gray color for filled preset
        "filled"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: "#6B7280", // Lighter text color for filled preset
      globalStyled: false,
      isCustomized: true,
    },
    backgroundHover: {
      value: getHoverBackgroundForPreset(
        "#f3f3f3", // Lighter gray color for filled preset hover
        "filled"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    colorHover: {
      value: "#6B7280", // Lighter text color for filled preset hover
      globalStyled: false,
      isCustomized: true,
    },
    radius: {
      value: "8",
      globalStyled: false,
      isCustomized: false,
    },
    borderColor: {
      value: "#a9a8a8", // Lighter gray color for filled preset border
      globalStyled: true,
      isCustomized: false,
    },
    borderHoverColor: {
      value: darken(0.05, "#a9a8a8"), // Slightly darker gray for hover state
      globalStyled: true,
      isCustomized: false,
    },
    justifyContent: "center",
    disabled: false,
    enableIcon: true,
    width: IconButtonSizes.small,
    height: "auto",
    size: IconButtonSizes.medium,
    text: t("Back"),
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    icon: "interface-arrows-bend-left-1-arrow-bend-curve-change-direction-up-to-left-back",
    paddingLeft: "16",
    paddingTop: "14",
    paddingRight: "16",
    paddingBottom: "14",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: 1.5, // Thinner border
    fullWidth: true,
    preset: "filled",
    settingsTab: "content",
    buttonSize: "medium",
    tracking: false,
    trackingEvent: "button-" + hexoid(6)().toLowerCase(),
    nextScreen: {
      screenId: "",
      screenName: "",
    },
    buttonAction: "next-screen",
    iconType: PictureTypes.ICON
  }

  const backOutLinePreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "rgba(255,255,255,0)",
    background: {
      value: getBackgroundForPreset(
        "#f3f3f3", // Lighter gray color for filled preset
        "filled"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: "#6B7280", // Lighter text color for filled preset
      globalStyled: false,
      isCustomized: true,
    },
    backgroundHover: {
      value: getHoverBackgroundForPreset(
        "#f3f3f3", // Lighter gray color for filled preset hover
        "filled"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    colorHover: {
      value: "#6B7280", // Lighter text color for filled preset hover
      globalStyled: false,
      isCustomized: true,
    },
    radius: {
      value: "8",
      globalStyled: false,
      isCustomized: false,
    },
    borderColor: {
      value: "#f3f3f3", // Lighter gray color for filled preset border
      globalStyled: true,
      isCustomized: false,
    },
    borderHoverColor: {
      value: darken(0.05, "#f3f3f3"), // Slightly darker gray for hover state
      globalStyled: true,
      isCustomized: false,
    },

    justifyContent: "center",
    disabled: false,
    enableIcon: true,
    width: IconButtonSizes.small,
    height: "auto",
    size: IconButtonSizes.medium,
    text: t("Back"),
    marginLeft: 20,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    icon: "interface-arrows-bend-left-1-arrow-bend-curve-change-direction-up-to-left-back",
    paddingLeft: "16",
    paddingTop: "14",
    paddingRight: "16",
    paddingBottom: "14",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: 1, // Thinner border
    fullWidth: true,
    preset: "outline",
    settingsTab: "content",
    buttonSize: "medium",
    tracking: false,
    trackingEvent: "button-" + hexoid(6)().toLowerCase(),
    nextScreen: {
      screenId: "",
      screenName: "",
    },
    buttonAction: "next-screen",
    iconType: PictureTypes.ICON,
  }

  return { backFilledPreset, backOutLinePreset }
}

export const getBackgroundForPreset = (color, preset) => {
  switch (preset) {
    case "filled":
      return color
    case "outline":
      return rgba(color, 0.1)
    default:
      return color
  }
}

export const getHoverBackgroundForPreset = (color, preset) => {
  switch (preset) {
    case "filled":
      return darken(0.03, color)
    case "outline":
      return rgba(color, 0.1)
    default:
      return color
  }
}

export default useBackThemePresets
