import hexoid from "hexoid"
import { useTranslations } from "next-intl"

import { useAppSelector } from "@/lib/state/flows-state/hooks"

import {
  ChecklistLayouts,
  ChecklistPresets,
  ChecklistProps,
  ChecklistSizes,
} from "./user-checklist.component"

const useChecklistThemePresets = () => {
  const theme = useAppSelector((state) => state.theme)
  const t = useTranslations("Components")

  const normalPreset: ChecklistProps = {
    checklistItems: [
      { id: `checklist-item-${hexoid(4)()}`, value: `${t("Item")} 1` },
      { id: `checklist-item-${hexoid(4)()}`, value: `${t("Item")} 2` },
      { id: `checklist-item-${hexoid(4)()}`, value: `${t("Item")} 3` },
      { id: `checklist-item-${hexoid(4)()}`, value: `${t("Item")} 4` },
    ],
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    fontWeight: "normal",
    fontSize: 16,
    icon: "interface-validation-check-circle-checkmark-addition-circle-success-check-validation-add-form",
    layout: ChecklistLayouts.column,
    borderColor: theme?.general?.primaryColor || "#3182ce",
    containerBackground: "transparent",
    iconColor: "#30AB66",
    width: ChecklistSizes.small,
    height: 50,
    size: ChecklistSizes.medium,
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    paddingLeft: "16",
    paddingTop: "20",
    paddingRight: "16",
    paddingBottom: "20",
    fullWidth: true,
    settingTabs: ["content"],
    preset: ChecklistPresets.normal,
    column: 2
  }

  const boldPreset: ChecklistProps = {
    checklistItems: [
      { id: `checklist-item-${hexoid(4)()}`, value: `${t("Item")} 1` },
      { id: `checklist-item-${hexoid(4)()}`, value: `${t("Item")} 2` },
      { id: `checklist-item-${hexoid(4)()}`, value: `${t("Item")} 3` },
      { id: `checklist-item-${hexoid(4)()}`, value: `${t("Item")} 4` },
    ],
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    fontWeight: "600",
    fontSize: 18,
    icon: "interface-validation-check-circle-checkmark-addition-circle-success-check-validation-add-form",
    layout: ChecklistLayouts.column,
    borderColor: theme?.general?.primaryColor || "#3182ce",
    containerBackground: "transparent",
    iconColor: "#30AB66",
    width: ChecklistSizes.medium,
    height: 50,
    size: ChecklistSizes.medium,
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    paddingLeft: "16",
    paddingTop: "20",
    paddingRight: "16",
    paddingBottom: "20",
    fullWidth: true,
    settingTabs: ["content"],
    preset: ChecklistPresets.bold,
    column: 2
  }

  return { normalPreset, boldPreset }
}

export default useChecklistThemePresets
