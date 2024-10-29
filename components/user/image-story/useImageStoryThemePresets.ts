import { useAppSelector } from "@/lib/state/flows-state/hooks"
import hexoid from "hexoid"
import { useTranslations } from "next-intl"

export enum ImageStorySizes {
    small = "small",
    medium = "medium",
    large = "large",
    full = "full",
  }

  
export const useImageStoryThemePresets = () => {
    const theme = useAppSelector((state) => state.theme)
    const t = useTranslations("Components")
    const defaultItems = [
        {
          id: `logo-bar-item-${hexoid(6)()}`,
          src: ""
        },
    ]
    const defaultPreset = {
        size: ImageStorySizes.medium,
        containerBackground: "transparent",
        align: "center",
        gap: 30,
        paddingLeft: "16",
        paddingTop: "20",
        paddingRight: "16",
        paddingBottom: "20",
        marginLeft: 0,
        marginTop: 20,
        marginRight: 0,
        marginBottom: 20,
        settingTabs: ["content"],
        items: defaultItems,
      }

      return {
        defaultItems,
        defaultPreset
      }
}