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
  marginRight: 20,
  marginTop: 20,
  marginBottom: 20,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  placeholder: "Placeholder",
  backgroundColor: theme?.general?.backgroundColor || 'white',
  borderColor: "#eaeaeb",
  borderWidth: 1,
  borderRadius: 8,
  activeBorderColor: "#4050ff",
  isActive: false,
  inputRequired: false,
  fullWidth: true,
  size: UserInputSizes.medium,
  label: "Label",
  fieldName: "Field name",
  floatingLabel: false,
  enableIcon: false,
  icon: "arrowright",
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
  borderColor: "#eaeaeb",
  borderWidth: 1,
  borderRadius: 8,
  activeBorderColor: "#4050ff",
  isActive: false,
  inputRequired: false,
  fullWidth: true,
  size: UserInputSizes.medium,
  label: "Label",
  fieldName: "Field name",
  floatingLabel: false,
  enableIcon: false,
  icon: "arrowright",
  };


  return { outlinedPreset, underlinedPreset};
};

export default useInputThemePresets;
