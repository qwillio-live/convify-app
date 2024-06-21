import hexoid from "hexoid"
import { useTranslations } from "next-intl"
import { darken } from "polished"

import { useAppSelector } from "@/lib/state/flows-state/hooks"

import { IconButtonProps, IconButtonSizes } from "./back-button.component"

const useBackButtonThemePresets = () => {
  const t = useTranslations("Components")
  const theme = useAppSelector((state) => state.theme)

  const filledPreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "transparent",
    background: {
      value: "#6b6b6b",
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: "#ffffff",
      globalStyled: false,
      isCustomized: true,
    },
    backgroundHover: {
      value: darken(0.03, "#6b6b6b"),
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
      value: "#6b6b6b",
      globalStyled: true,
      isCustomized: false,
    },
    borderHoverColor: {
      value: darken(0.03, "#6b6b6b"),
      globalStyled: true,
      isCustomized: false,
    },
    justifyContent: "center",
    disabled: false,
    enableIcon: true,
    width: IconButtonSizes.medium,
    height: "auto",
    size: IconButtonSizes.small,
    text: t("Back"),
    marginLeft: 20,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    icon: "arrowleft",
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
    settingsTab: "content",
    buttonSize: "medium",
    tracking: false,
    trackingEvent: "button-" + hexoid(6)().toLowerCase(),
    prevScreen: {
      screenId: "",
      screenName: "",
    },
    buttonAction: "prev-screen",
  }

  const outLinePreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "transparent",
    background: {
      value: "#ebebeb",
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: "#6b6b6b",
      globalStyled: true,
      isCustomized: false,
    },
    backgroundHover: {
      value: darken(0.03, "#ebebeb"),
      globalStyled: true,
      isCustomized: false,
    },
    colorHover: {
      value: "#6b6b6b",
      globalStyled: true,
      isCustomized: false,
    },
    radius: {
      value: "8",
      globalStyled: false,
      isCustomized: false,
    },
    borderColor: {
      value: "#6b6b6b",
      globalStyled: true,
      isCustomized: false,
    },
    borderHoverColor: {
      value: darken(0.03, "#6b6b6b"),
      globalStyled: true,
      isCustomized: false,
    },
    justifyContent: "center",
    disabled: false,
    enableIcon: true,
    width: IconButtonSizes.medium,
    height: "auto",
    size: IconButtonSizes.small,
    text: t("Back"),
    marginLeft: 20,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    icon: "arrowleft",
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
    settingsTab: "content",
    buttonSize: "medium",
    tracking: false,
    trackingEvent: "back-button-" + hexoid(6)().toLowerCase(),
    prevScreen: {
      screenId: "",
      screenName: "",
    },
    buttonAction: "prev-screen",
  }

  return { filledPreset, outLinePreset }
}

export const getBackgroundForPreset = (preset) => {
  switch (preset) {
    case "filled":
      return "#6b6b6b"
    case "outline":
      return "#ebebeb"
    default:
      return "#6b6b6b"
  }
}

export const getHoverBackgroundForPreset = (preset) => {
  switch (preset) {
    case "filled":
      return darken(0.03, "#6b6b6b")
    case "outline":
      return darken(0.03, "#ebebeb")
    default:
      return darken(0.03, "#6b6b6b")
  }
}

export default useBackButtonThemePresets
