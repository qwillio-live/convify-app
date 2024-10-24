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

const useFaqThemePresets = () => {
    const theme = useAppSelector((state) => state.theme)
    const t = useTranslations("Components")

    const defaultItems = [
      {
        id: hexoid(6)(),
        question: t("FAQ Q1"),
        answer: t("FAQ A1"),
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
        descriptionFontFamily: theme?.text?.secondaryFont || "inherit",
        textAlign: "start",
        verticalGap: 6,
        size: FAQSizes.small,
        iconColor: theme?.general?.primaryColor || "#3182ce",
        titleColor: theme?.text?.primaryColor || "#000000",
        contentColor: theme?.text?.secondaryColor || "#5a5a5a",
        containerBackground: "transparent",
        backgroundColor:  theme?.general?.backgroundColor || 'transparent',
        marginLeft: 0,
        marginTop: 20,
        marginRight: 0,
        marginBottom: 20,
        blockColor:'transparent',
        flexDirection: "row",
        settingTabs: ["content"],
        borderRadius: 0,
        borderWidth: 1.5,
        iconType: IconType.plus,
        items: defaultItems,
    }

    const blockedPreset = {
      ...preset,
      blockColor: "#f5f5f5",
      borderRadius: 4,
      borderWidth: 0
    }

    return {
        preset,
        defaultItems,
        blockedPreset,
    }
}

export default useFaqThemePresets