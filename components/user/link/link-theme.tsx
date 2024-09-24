import { useSelector } from "react-redux"
import { GlobalThemeState } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { IconButtonProps, IconButtonSizes } from "./link-component"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { darken, rgba } from "polished"
import { useTranslations } from "next-intl"
import hexoid from "hexoid"
import { PictureTypes } from "@/components/PicturePicker"

const useLinkThemePresets = () => {
  const APP_URL =
    process.env.NEXT_PUBLIC_DOMAIN_URL || "https://conv-hassan.picreel.bid"
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
  const linkFilledPreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "rgba(255,255,255,0)",
    background: {
      value: getBackgroundForPreset(
        theme?.general?.primaryColor || "#ffffff",
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
      value: theme?.general?.primaryColor || "#8097cd",
      globalStyled: true,
      isCustomized: false,
    },
    borderHoverColor: {
      value: darkenedPrimaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    justifyContent: "center",
    disabled: false,
    enableIcon: true,
    width: IconButtonSizes.small,
    height: "auto",
    size: IconButtonSizes.medium,
    text: t("Continue"),
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 0,
    marginRight: 0,
    icon: "",
    paddingLeft: "0",
    paddingTop: "14",
    paddingRight: "0",
    paddingBottom: "14",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: 2,
    fullWidth: false,
    preset: "filled",
    settingsTab: "content",
    buttonSize: "medium",
    tracking: false,
    trackingEvent: "button-" + hexoid(6)().toLowerCase(),
    nextScreen: {
      screenId: "",
      screenName: "",
    },
    buttonAction: "redirect",
    href: APP_URL,
    // iconType: PictureTypes.ICON,
  }

  const linkOutLinePreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "transparent",
    background: {
      value: getBackgroundForPreset(
        theme?.general?.primaryColor || "#eff1f9",
        "outline"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: theme?.general?.primaryColor || "#eff1f9",
      globalStyled: true,
      isCustomized: false,
    },
    backgroundHover: {
      value: getHoverBackgroundForPreset(
        theme?.general?.primaryColor || "#eff1f9",
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
      value: theme?.general?.primaryColor || "#eff1f9",
      globalStyled: true,
      isCustomized: false,
    },
    borderHoverColor: {
      value: darkenedPrimaryColor || "#eff1f9",
      globalStyled: true,
      isCustomized: false,
    },
    justifyContent: "center",
    disabled: false,
    enableIcon: true,
    width: IconButtonSizes.small,
    height: "auto",
    size: IconButtonSizes.medium,
    text: t("Link"),
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 0,
    marginRight: 0,
    icon: "",
    paddingLeft: "0",
    paddingTop: "14",
    paddingRight: "0",
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
    trackingEvent: "button-" + hexoid(6)().toLowerCase(),
    nextScreen: {
      screenId: "",
      screenName: "",
    },
    buttonAction: "redirect",
    href: APP_URL,
    // iconType: PictureTypes.ICON,
  }

  return { linkFilledPreset, linkOutLinePreset }
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

export default useLinkThemePresets
