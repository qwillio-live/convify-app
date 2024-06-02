import { useSelector } from "react-redux";
import { GlobalThemeState } from "@/lib/state/flows-state/features/theme/globalThemeSlice";
import { UserInputProps, UserInputSizes } from "./user-input.component";
import { useAppSelector } from "@/lib/state/flows-state/hooks";
import { darken } from "polished";

const useInputThemePresets = () => {
  const theme = useAppSelector((state) => state.theme);
  const darkenedPrimaryColor = darken(0.1, theme?.general?.primaryColor || "#3182ce");

  const outlinedPreset: UserInputProps = {
  inputValue: "",
  fontSize: 16,
  textColor: "#000",
  width: 366,
  fontWeight: "normal",
  marginLeft: 20,
  marginRight: 0,
  marginTop: 20,
  marginBottom: 20,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  placeholder: "Placeholder",
  backgroundColor: theme?.general?.backgroundColor || 'white',
  borderColor: {
    value: "#eaeaeb",
    globalStyled: false,
    isCustomized: false,
  },
  activeBorderColor: {
    value: theme?.general?.primaryColor || "#3182ce",
    globalStyled: true,
    isCustomized: false,
  },
  primaryFont: {
    value: theme?.text?.primaryFont || "--font-heading",
    globalStyled: true,
    isCustomized: false,
  },
  secondaryFont: {
    value: theme?.text?.secondaryFont || "--font-inter",
    globalStyled: true,
    isCustomized: false,
  },
  borderWidth: 1,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderLeftWidth: 1,
  borderRightWidth: 1,
  borderRadius: 8,
  topLeftRadius: 8,
  topRightRadius: 8,
  bottomLeftRadius: 8,
  bottomRightRadius: 8,
  isActive: false,
  inputRequired: false,
  fullWidth: true,
  size: UserInputSizes.medium,
  label: "Label",
  fieldName: "Field name",
  floatingLabel: false,
  enableIcon: false,
  icon: "arrowright",
  preset: "outlined",
  };

  const underlinedPreset: UserInputProps = {
  inputValue: "",
  fontSize: 16,
  textColor: "#000",
  width: 366,
  fontWeight: "normal",
  marginLeft: 0,
  marginRight: 0,
  marginTop: 20,
  marginBottom: 20,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  placeholder: "Placeholder",
  backgroundColor: "#fff",
  borderColor: {
    value: "#eaeaeb",
    globalStyled: false,
    isCustomized: false,
  },
  activeBorderColor: {
    value: theme?.general?.primaryColor || "#3182ce",
    globalStyled: true,
    isCustomized: false,
  },
  primaryFont: {
    value: theme?.text?.primaryFont || "--font-heading",
    globalStyled: true,
    isCustomized: false,
  },
  secondaryFont: {
    value: theme?.text?.secondaryFont || "--font-inter",
    globalStyled: true,
    isCustomized: false,
  },
  borderWidth: 0,
  borderTopWidth: 0,
  borderBottomWidth: 1,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderRadius: 0,
  topLeftRadius: 0,
  topRightRadius: 0,
  bottomLeftRadius: 0,
  bottomRightRadius: 0,
  isActive: false,
  inputRequired: false,
  fullWidth: true,
  size: UserInputSizes.medium,
  label: "Label",
  fieldName: "Field name",
  floatingLabel: false,
  enableIcon: false,
  icon: "arrowright",
  preset: "underlined",
  };


  return { outlinedPreset, underlinedPreset};
};

export default useInputThemePresets;
