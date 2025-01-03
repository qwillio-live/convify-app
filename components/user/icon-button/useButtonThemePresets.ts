import hexoid from "hexoid"
import { useTranslations } from "next-intl"
import { darken, rgba } from "polished"
import { useSelector } from "react-redux"

import { GlobalThemeState } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { PictureTypes } from "@/components/PicturePicker"

import { IconButtonProps, IconButtonSizes } from "./user-icon-button.component"

const useButtonThemePresets = () => {
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
  const filledPreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "transparent",
    background: {
      value: getBackgroundForPreset(
        theme?.general?.primaryColor || "#3182ce",
        "filled"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: "#ffffff",
      globalStyled: false,
      isCustomized: true,
    },
    backgroundHover: {
      value: getHoverBackgroundForPreset(
        theme?.general?.primaryColor || "#3182ce",
        "filled"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    colorHover: {
      value: "#ffffff",
      globalStyled: false,
      isCustomized: true,
    },
    radius: {
      value: "8",
      globalStyled: false,
      isCustomized: false,
    },
    borderColor: {
      value: theme?.general?.primaryColor || "#4050ff",
      globalStyled: true,
      isCustomized: false,
    },
    borderHoverColor: {
      value: darkenedPrimaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    justifyContent: "space-between",
    disabled: false,
    enableIcon: true,
    width: IconButtonSizes.medium,
    height: "auto",
    size: IconButtonSizes.medium,
    text: t("Continue"),
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    icon: {
      picture: "interface-arrows-right-arrow-right-keyboard",
      pictureType: PictureTypes.ICON,
    },
    paddingLeft: "16",
    paddingTop: "14",
    paddingRight: "16",
    paddingBottom: "14",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: 2,
    fullWidth: true,
    preset: "filled",
    settingsTab: ["content"],
    buttonSize: "medium",
    tracking: false,
    trackingEvent: "button-" + hexoid(6)().toLowerCase(),
    nextScreen: {
      screenId: "",
      screenName: "",
    },
    buttonAction: "next-screen",
    id: `input-${hexoid(6)()}`,
  }

  const outLinePreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "transparent",
    background: {
      value: getBackgroundForPreset(
        theme?.general?.primaryColor || "#3182ce",
        "outline"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: theme?.general?.primaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    backgroundHover: {
      value: getHoverBackgroundForPreset(
        theme?.general?.primaryColor || "#3182ce",
        "outline"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    colorHover: {
      value: darkenedPrimaryColor || "#3180ca",
      globalStyled: true,
      isCustomized: false,
    },
    radius: {
      value: "8",
      globalStyled: false,
      isCustomized: false,
    },
    borderColor: {
      value: theme?.general?.primaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    borderHoverColor: {
      value: darkenedPrimaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    justifyContent: "space-between",
    disabled: false,
    enableIcon: true,
    width: IconButtonSizes.medium,
    height: "auto",
    size: IconButtonSizes.medium,
    text: t("Continue"),
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    icon: {
      picture: "interface-arrows-right-arrow-right-keyboard",
      pictureType: PictureTypes.ICON,
    },
    paddingLeft: "16",
    paddingTop: "14",
    paddingRight: "16",
    paddingBottom: "14",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: 2,
    fullWidth: true,
    preset: "outline",
    settingsTab: ["content"],
    buttonSize: "medium",
    tracking: false,
    trackingEvent: "button-" + hexoid(6)().toLowerCase(),
    nextScreen: {
      screenId: "",
      screenName: "",
    },
    buttonAction: "next-screen",
    id: `input-${hexoid(6)()}`,
  }
  const formPreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "transparent",
    background: {
      value: getBackgroundForPreset(
        theme?.general?.primaryColor || "#3182ce",
        "filled"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: "#ffffff",
      globalStyled: false,
      isCustomized: true,
    },
    backgroundHover: {
      value: getHoverBackgroundForPreset(
        theme?.general?.primaryColor || "#3182ce",
        "filled"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    colorHover: {
      value: "#ffffff",
      globalStyled: false,
      isCustomized: true,
    },
    radius: {
      value: "8",
      globalStyled: false,
      isCustomized: false,
    },
    borderColor: {
      value: theme?.general?.primaryColor || "#4050ff",
      globalStyled: true,
      isCustomized: false,
    },
    borderHoverColor: {
      value: darkenedPrimaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    justifyContent: "space-between",
    disabled: false,
    enableIcon: true,
    width: IconButtonSizes.medium,
    height: "auto",
    size: IconButtonSizes.medium,
    text: t("Submit"),
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    icon: {
      picture: "interface-arrows-right-arrow-right-keyboard",
      pictureType: PictureTypes.ICON,
    },
    paddingLeft: "16",
    paddingTop: "14",
    paddingRight: "16",
    paddingBottom: "14",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: 2,
    fullWidth: true,
    preset: "filled",
    settingsTab: ["content"],
    buttonSize: "medium",
    tracking: false,
    trackingEvent: "button-" + hexoid(6)().toLowerCase(),
    nextScreen: {
      screenId: "",
      screenName: "",
    },
    buttonAction: "next-screen",
    id: `input-${hexoid(6)()}`,
  }

  return { filledPreset, outLinePreset, formPreset }
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

export default useButtonThemePresets
