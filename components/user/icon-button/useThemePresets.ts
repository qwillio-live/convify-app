// useThemePresets.js
import { useSelector } from "react-redux";
import { GlobalThemeState } from "@/lib/state/flows-state/features/theme/globalThemeSlice";
import { IconButtonProps } from "./user-icon-button.component";
import { useAppSelector } from "@/lib/state/flows-state/hooks";

const useThemePresets = () => {
  const theme = useAppSelector((state) => state.theme);

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
      value: theme?.general?.secondaryColor || "#3182ce",
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
    width: "366",
    height: "auto",
    size: "small",
    text: "Get quote",
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    icon: "arrowright",
    paddingLeft: "16",
    paddingTop: "26",
    paddingRight: "16",
    paddingBottom: "26",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: 0,
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
      value: theme?.general?.secondaryColor || "#3180ca",
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
      value: theme?.general?.secondaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    justifyContent: "space-between",
    disabled: false,
    enableIcon: true,
    width: "366",
    height: "auto",
    size: "small",
    text: "Get quote",
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    icon: "arrowright",
    paddingLeft: "16",
    paddingTop: "26",
    paddingRight: "16",
    paddingBottom: "26",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: 2,
  };

  return { filledPreset, outLinePreset };
};

export default useThemePresets;
