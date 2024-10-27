import { useAppSelector } from "@/lib/state/flows-state/hooks"
import hexoid from "hexoid"
import { useTranslations } from "next-intl"
import { LinksSizes } from "./user-links.component"
import { PRIVACY_URL, TERMS_URL } from "@/constant"

export const enum LinksPreset {
  default = "default",
  bold = "bold",
}
export const useLinksThemePresets = () => {
  const theme = useAppSelector((state) => state.theme)
  const t = useTranslations("Components")
  const links = [
    {
      id: `input-${hexoid(6)()}`,
      value: t("Terms"),
      buttonAction: "redirect",
      trackingEvent: null,
      href: TERMS_URL,
      windowTarget: true,
      nextScreen: {
        screenId: "",
        screenName: "",
      },
    },
    {
      id: `input-${hexoid(6)()}`,
      value: t("Privacy"),
      buttonAction: "redirect",
      trackingEvent: null,
      href: PRIVACY_URL,
      windowTarget: true,
      nextScreen: {
        screenId: "",
        screenName: "",
      },
    }
  ]

  const defaultPresets = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    showDots: true,
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
    size: LinksSizes.medium,
    textColor: theme?.text?.secondaryColor || "#5a5a5a",
    fontSize: 10,
    fontWeight: 400,
    links: links,
    preset: LinksPreset.default,
    tracking: false,
  }

  const boldPreset = {
    ...defaultPresets,
    fontSize: 12,
    fontWeight: 500,
    preset: LinksPreset.bold,
    textColor: "#23262C"
}

  return {
    defaultPresets,
    boldPreset,
    defaultItems: links,
  }


}  