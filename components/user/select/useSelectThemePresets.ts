import { SelectProps, SelectSizes } from "./user-select.component"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import hexoid from "hexoid"

const useSelectThemePresets = () => {
  const theme = useAppSelector((state) => state.theme)

  const selectPreset: SelectProps = {
    selectOptions: [
      { id: `select-option-item-${hexoid(4)()}`, value: "Option 1" },
      { id: `select-option-item-${hexoid(4)()}`, value: "Option 2" },
      { id: `select-option-item-${hexoid(4)()}`, value: "Option 3" },
    ],
    selectedOptionId: undefined,
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "transparent",
    borderColor: {
      value: "#eaeaeb",
      globalStyled: false,
      isCustomized: false,
    },
    borderHoverColor: {
      value: theme?.general?.primaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    selectedOptionTextColor: {
      value: theme?.general?.backgroundColor || "#ffffff",
      globalStyled: true,
      isCustomized: false,
    },
    selectedOptionBackgroundColor: {
      value: theme?.general?.primaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    disabled: false,
    required: false,
    sortAlphabetically: false,
    width: SelectSizes.medium,
    height: 50,
    size: SelectSizes.medium,
    fieldName: "Select",
    placeholder: "Please select an option",
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    paddingLeft: "16",
    paddingTop: "20",
    paddingRight: "16",
    paddingBottom: "20",
    border: 2,
    fullWidth: true,
    settingsTab: "content",
    tracking: false,
    trackingEvent: "select-" + hexoid(6)().toLowerCase(),
  }

  return { selectPreset }
}

export default useSelectThemePresets
