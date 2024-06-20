import hexoid from "hexoid"
import { useTranslations } from "next-intl"
import { darken, rgba } from "polished"
import { useSelector } from "react-redux"

import { GlobalThemeState } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppSelector } from "@/lib/state/flows-state/hooks"

import { TextContainerSize, HeadlineTextProps } from "./headline-text.component"

const useHeadlineThemePresets = () => {
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


  

  const h1Preset: HeadlineTextProps = {
    fontSize: 42,
    fontWeight: "700",
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
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
    text: t("Text"),
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
    buttonSize: "medium",
    tagType: "h1"
  }

  const h2Preset: HeadlineTextProps = {
    fontSize: 42,
    fontWeight: "700",
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "transparent",
    background: {
      value: getBackgroundForPreset(
        theme?.general?.backgroundColor || "#3182ce",
        "ghost"
      ),
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: theme?.general?.secondaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    backgroundHover: {
      value: getHoverBackgroundForPreset(
        theme?.general?.primaryColor || "#ffffff",
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
    justifyContent: "center",
    width: TextContainerSize.medium,
    height: "auto",
    size: TextContainerSize.medium,
    text: t("Text"),
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
    buttonSize: "medium",
    tagType: "h1"
  }

  return { h1Preset, h2Preset }
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

export default useHeadlineThemePresets
