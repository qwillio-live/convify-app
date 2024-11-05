import { useAppSelector } from "@/lib/state/flows-state/hooks"
import hexoid from "hexoid"
import { useTranslations } from "next-intl"
import { FAQSizes } from "./user-faq.component"

export enum IconType  {
  chevron= "chevron",
  plus= "plus",
}

export enum RequiredRotation  {
  plus= 45,
  chevron= 180,
}

export enum FAQPresetType {
  default = "default",
  blocked = "blocked",
}

const useFaqThemePresets = () => {
    const theme = useAppSelector((state) => state.theme)
    const t = useTranslations("Components")

    const defaultItems = [
      {
        id: hexoid(6)(),
        question: t("FAQ Q1"),
        answer: t("FAQ A1"),
        defaultOpen: true,
      },
      {
        id: hexoid(6)(),
        question : t("FAQ Q2"),
        answer: t("FAQ A2"),
      },
      {
        id: hexoid(6)(),
        question : t("FAQ Q3"),
        answer: t("FAQ A3"),
      },
    ]
    console.log(theme)
  
    const preset = {
        titleFontFamily: theme?.text?.primaryFont || "inherit",
        contentFontFamily: theme?.text?.secondaryFont || "inherit",
        textAlign: "start",
        verticalGap: 16,
        size: FAQSizes.medium,
        iconColor: theme?.general?.primaryColor || "#3182ce",
        titleColor: theme?.text?.primaryColor || "#23262C",
        contentColor: theme?.text?.secondaryColor || "#23262CCC",
        containerBackground: "transparent",
        backgroundColor:  theme?.general?.backgroundColor || 'transparent',
        marginLeft: 0,
        marginTop: 20,
        marginRight: 0,
        marginBottom: 20,
        fullWidth: true,
        blockColor:'transparent',
        flexDirection: "row",
        settingTabs: ["content"],
        borderRadius: 0,
        borderWidth: 1.5,
        iconType: IconType.chevron,
        items: defaultItems,
        presetType: FAQPresetType.default,
    }

    const blockedPreset = {
      ...preset,
      blockColor: "#EFEDEB",
      borderRadius: 8,
      borderWidth: 0,
      presetType: FAQPresetType.blocked,
    }

    return {
        preset,
        defaultItems,
        blockedPreset,
    }
}

export default useFaqThemePresets