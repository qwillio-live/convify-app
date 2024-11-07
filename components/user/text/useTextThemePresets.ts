import hexoid from "hexoid"
import { useTranslations } from "next-intl"
import { darken, rgba } from "polished"
import { useSelector } from "react-redux"

import { GlobalThemeState } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppSelector } from "@/lib/state/flows-state/hooks"

import { TextContainerSize, TextInputProps } from "./user-text.component"

const useTextThemePresets = () => {
  const t = useTranslations("Components")
  const theme = useAppSelector((state) => state.theme)

  const secondaryFont = theme?.text?.secondaryFont || "inherit"

  const darkenedPrimaryColor = darken(
    0.05,
    theme?.general?.primaryColor || "#3182ce"
  )
  const alphaBackgroundColor = rgba(
    theme?.general?.primaryColor || "#3182ce",
    0.1
  )
  const parapgraphPreset: TextInputProps = {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "400",
    textAlign: "center",
    fontFamily: {
      value: theme?.text?.secondaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "transparent",
    background: {
      value: getBackgroundForPreset(
        theme?.general?.backgroundColor || "#3182ce",
        "filled"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: theme?.text?.secondaryColor || "#3182ce",
      globalStyled: true,
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
      value: "3",
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
    justifyContent: "center",
    width: TextContainerSize.medium,
    height: "auto",
    size: TextContainerSize.medium,
    text: t("TextDescription"),
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    paddingLeft: "16",
    paddingTop: "14",
    paddingRight: "16",
    paddingBottom: "14",
    flexDirection: "row",
    alignItems: "center",
    border: 2,
    fullWidth: true,
    preset: "filled",
    buttonSize: "medium",
  }

  const spanPreset: TextInputProps = {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "400",
    textAlign: "center",
    fontFamily: {
      value: theme?.text?.secondaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "transparent",
    background: {
      value: getBackgroundForPreset(
        theme?.general?.backgroundColor || "#3182ce",
        "filled"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: theme?.text?.secondaryColor || "#3182ce",
      globalStyled: true,
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
      value: "3",
      globalStyled: false,
      isCustomized: false,
    },
    borderColor: {
      value: "#ffffff",
      globalStyled: true,
      isCustomized: false,
    },
    borderHoverColor: {
      value: darkenedPrimaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    justifyContent: "center",
    width: TextContainerSize.medium,
    height: "50",
    size: TextContainerSize.medium,
    text: t("TextDescription"),
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    paddingLeft: "16",
    paddingTop: "14",
    paddingRight: "16",
    paddingBottom: "14",
    flexDirection: "row",
    alignItems: "center",
    border: 2,
    fullWidth: true,
    preset: "filled",
    buttonSize: "medium",
  }

  return { parapgraphPreset, spanPreset }
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

export default useTextThemePresets
