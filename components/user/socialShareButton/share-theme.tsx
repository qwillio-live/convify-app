import { useSelector } from "react-redux"
import { GlobalThemeState } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { IconButtonProps, IconButtonSizes } from "./share-component"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { darken, rgba } from "polished"
import { useTranslations } from "next-intl"
import hexoid from "hexoid"
import { PictureTypes } from "@/components/PicturePicker"

const useShareButtonTheme = () => {
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

  const SocialFilledPreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "rgba(255,255,255,0)",
    background: {
      value: getBackgroundForPreset(
        "#25d366", // Lighter gray color for filled preset
        "filled"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: "#ffffff", // Lighter text color for filled preset
      globalStyled: false,
      isCustomized: true,
    },
    backgroundHover: {
      value: getHoverBackgroundForPreset(
        "#63dd86", // Lighter gray color for filled preset hover
        "filled"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    colorHover: {
      value: "#ffffff", // Lighter text color for filled preset hover
      globalStyled: false,
      isCustomized: true,
    },
    radius: {
      value: "8",
      globalStyled: false,
      isCustomized: false,
    },
    borderColor: {
      value: "#25d366", // Lighter gray color for filled preset border
      globalStyled: true,
      isCustomized: false,
    },
    borderHoverColor: {
      value: darken(0.05, "#63dd86"), // Slightly darker gray for hover state
      globalStyled: true,
      isCustomized: false,
    },
    justifyContent: "center",
    disabled: false,
    enableIcon: true,
    width: IconButtonSizes.small,
    height: "auto",
    size: IconButtonSizes.medium,
    text: t("Chat on WhatsApp"),
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    icon: "whatsapp-solid",
    paddingLeft: "0",
    paddingTop: "14",
    paddingRight: "0",
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
    chatMessage: t("Hi!"),
  }

  return { SocialFilledPreset }
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

export default useShareButtonTheme
