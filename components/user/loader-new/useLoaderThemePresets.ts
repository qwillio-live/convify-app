import { IconButtonProps, IconButtonSizes } from "./user-loader.component"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { darken, rgba } from "polished"
import { useTranslations } from "next-intl"
import hexoid from "hexoid"
import ImagePlaceholder from "@/assets/images/default-image.webp"

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
    enableRedirect: true,
    width: "85%",
    height: "auto",
    time: 2,
    size: IconButtonSizes.medium,
    text: t("Continue"),
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    icon: "arrowright",
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
    settingsTab: "general",
    buttonSize: "medium",
    tracking: false,
    trackingEvent: "button-" + hexoid(6)().toLowerCase(),
    nextScreen: "",
    buttonAction: "custom-action",
    alt: "Image",
    align: "center",
    src: "",
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
    enableRedirect: true,
    time: 2,
    width: "85%",
    height: "auto",
    size: IconButtonSizes.medium,
    text: t("Continue"),
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    icon: "arrowright",
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
    settingsTab: "general",
    buttonSize: "medium",
    tracking: false,
    trackingEvent: "button-" + hexoid(6)().toLowerCase(),
    nextScreen: "",
    buttonAction: "custom-action",
    alt: "Image",
    align: "center",
    src: ImagePlaceholder.src,
  }

  return { filledPreset, outLinePreset }
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
