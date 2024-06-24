import { ListPresets, ListProps, ListSizes } from "./user-list.component"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import hexoid from "hexoid"
import { rgba } from "polished"
import { useTranslations } from "next-intl"
import { PictureTypes } from "@/components/PicturePicker"
import icons from "@/constant/streamline.json"

const useListThemePresets = () => {
  const theme = useAppSelector((state) => state.theme)
  const t = useTranslations("Components")

  const defaultIcon = icons["add-circle"].body

  const defaultItems = [
    {
      id: `list-item-${hexoid(6)()}`,
      picture: icons["startup"].body,
      pictureType: PictureTypes.ICON,
      title: `${t("Title")} 1`,
      description: `${t("Description")}`,
    },
    {
      id: `list-item-${hexoid(6)()}`,
      picture:
        icons["interface-edit-brush-2-brush-color-colors-design-paint-painting"]
          .body,
      pictureType: PictureTypes.ICON,
      title: `${t("Title")} 2`,
      description: `${t("Description")}`,
    },
    {
      id: `list-item-${hexoid(6)()}`,
      picture: icons["graph-arrow-increase"].body,
      pictureType: PictureTypes.ICON,
      title: `${t("Title")} 3`,
      description: `${t("Description")}`,
    },
    {
      id: `list-item-${hexoid(6)()}`,
      picture:
        icons[
          "interface-pad-lock-shield-combination-combo-lock-locked-padlock-secure-security-shield-square"
        ].body,
      pictureType: PictureTypes.ICON,
      title: `${t("Title")} 4`,
      description: `${t("Description")}`,
    },
  ]

  const horizontalPreset: ListProps = {
    titleFontFamily: theme?.text?.primaryFont || "inherit",
    descriptionFontFamily: theme?.text?.secondaryFont || "inherit",
    textAlign: "start",
    size: ListSizes.medium,
    iconColor: theme?.general?.primaryColor || "#3182ce",
    titleColor: theme?.text?.primaryColor || "#000000",
    descriptionColor: theme?.text?.secondaryColor || "#5a5a5a",
    containerBackground: "transparent",
    paddingLeft: "16",
    paddingTop: "20",
    paddingRight: "16",
    paddingBottom: "20",
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    columnsMobile: 1,
    columnsDesktop: 2,
    fullWidth: true,
    flexDirection: "row",
    settingTabs: ["content"],
    preset: ListPresets.horizontal,
    items: defaultItems,
  }

  const verticalPreset: ListProps = {
    titleFontFamily: theme?.text?.primaryFont || "inherit",
    descriptionFontFamily: theme?.text?.secondaryFont || "inherit",
    textAlign: "center",
    size: ListSizes.medium,
    iconColor: theme?.general?.primaryColor || "#3182ce",
    titleColor: theme?.text?.primaryColor || "#000000",
    descriptionColor: theme?.text?.secondaryColor || "#5a5a5a",
    containerBackground: "transparent",
    paddingLeft: "16",
    paddingTop: "20",
    paddingRight: "16",
    paddingBottom: "20",
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    columnsMobile: 1,
    columnsDesktop: 2,
    fullWidth: true,
    flexDirection: "column",
    settingTabs: ["content"],
    preset: ListPresets.vertical,
    items: defaultItems,
  }

  return {
    horizontalPreset,
    verticalPreset,
    defaultIcon,
    defaultItems,
  }
}

export default useListThemePresets
