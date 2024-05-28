import { useSelector } from "react-redux";
import { GlobalThemeState } from "@/lib/state/flows-state/features/theme/globalThemeSlice";
import { IconButtonProps, IconButtonSizes } from "./user-icon-button.component";
import { useAppSelector } from "@/lib/state/flows-state/hooks";
import { darken } from "polished";

const useButtonThemePresets = () => {
  const theme = useAppSelector((state) => state.theme);
  const darkenedPrimaryColor = darken(0.1, theme?.general?.primaryColor || "#3182ce");
  const filledPreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    background: {
      value: theme?.general?.primaryColor || "#4050ff",
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: "#ffffff",
      globalStyled: false,
      isCustomized: true,
    },
    backgroundHover: {
      value: darkenedPrimaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    colorHover: {
      value: "#ffffff",
      globalStyled: false,
      isCustomized: true,
    },
    radius:{
      value: "0",
      globalStyled: false,
      isCustomized: false,
    },
    borderColor: {
      value: "#00FF00",
      globalStyled: true,
      isCustomized: false,
    },
    borderHoverColor: {
      value: "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    justifyContent: "space-between",
    disabled: false,
    enableIcon: true,
    width: IconButtonSizes.medium,
    height: "auto",
    size: IconButtonSizes.medium,
    text: "Get quote",
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    icon: "arrowright",
    paddingLeft: "16",
    paddingTop: "26",
    paddingRight: "16",
    paddingBottom: "26",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: 0,
    fullWidth: false,
  };

  const outLinePreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    background: {
      value: "#ffffff",
      globalStyled: false,
      isCustomized: true,
    },
    color: {
      value: theme?.general?.primaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    backgroundHover: {
      value: "#fefefe",
      globalStyled: false,
      isCustomized: true,
    },
    colorHover: {
      value: darkenedPrimaryColor || "#3180ca",
      globalStyled: true,
      isCustomized: false,
    },
    radius:{
      value: "8",
      globalStyled: false,
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
    justifyContent: "space-between",
    disabled: false,
    enableIcon: true,
    width: IconButtonSizes.medium,
    height: "auto",
    size: IconButtonSizes.medium,
    text: "Get quote",
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    icon: "arrowright",
    paddingLeft: "16",
    paddingTop: "26",
    paddingRight: "16",
    paddingBottom: "26",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: 2,
    fullWidth: false,
  };

  return { filledPreset, outLinePreset };
};

export default useButtonThemePresets;
