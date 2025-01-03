import { useSelector } from "react-redux";
import { GlobalThemeState } from "@/lib/state/flows-state/features/theme/globalThemeSlice";
import { IconButtonProps, IconButtonSizes } from "./user-image.component";
import { useAppSelector } from "@/lib/state/flows-state/hooks";
import { darken, rgba } from "polished";
import { useTranslations } from "next-intl";
import hexoid from "hexoid";
import ImagePlaceholder from "@/assets/images/default-image.webp"

const useButtonThemePresets = () => {
  const t = useTranslations("Components")
  const theme = useAppSelector((state) => state.theme);
  const darkenedPrimaryColor = darken(0.05, theme?.general?.primaryColor || "#3182ce");
  const alphaBackgroundColor = rgba(theme?.general?.primaryColor || "#3182ce", 0.1);
  const filledPreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: "transparent",
    background: {
      value: getBackgroundForPreset(theme?.general?.primaryColor || "#3182ce", "filled"),
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: "#ffffff",
      globalStyled: false,
      isCustomized: true,
    },
    backgroundHover: {
      value: getHoverBackgroundForPreset(theme?.general?.primaryColor || "#3182ce", "filled"),
      globalStyled: true,
      isCustomized: false,
    },
    colorHover: {
      value: "#ffffff",
      globalStyled: false,
      isCustomized: true,
    },
    radius: {
      value: "8",
      globalStyled: false,
      isCustomized: false,
    },
    borderColor: {
      value: theme?.general?.primaryColor || "#4050ff",
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
    enableLink: false,
    width: '85%',
    height: "auto",
    size: IconButtonSizes.medium,
    text: t("Continue"),
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    radiusCorner: 0,
    marginBottom: 20,
    icon: "arrowright",
    paddingLeft: "16",
    paddingTop: "14",
    paddingRight: "16",
    paddingBottom: "14",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: 2,
    fullWidth: true,
    preset: 'filled',
    settingsTab: 'content',
    buttonSize: 'medium',
    tracking: false,
    trackingEvent: "button-" + hexoid(6)().toLowerCase(),
    nextScreen: '',
    buttonAction: "next-screen",
    alt: "Image",
    align: "center",
    src: "",
    url: "",
    time: 0,
    Top: 0,
    Bottom: 0,
    Left: 0,
    Right: 0,
    uploadedImageUrl: '',
    uploadedImageMobileUrl: '',
    imageSize: "0px",
    picSize: IconButtonSizes.small,
    maxWidth: '800px',
  };

  const outLinePreset: IconButtonProps = {
    fontFamily: {
      value: theme?.text?.primaryFont || "inherit",
      globalStyled: true,
      isCustomized: false,
    },
    containerBackground: 'transparent',
    background: {
      value: getBackgroundForPreset(theme?.general?.primaryColor || "#3182ce", "outline"),
      globalStyled: true,
      isCustomized: false,
    },
    color: {
      value: theme?.general?.primaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    backgroundHover: {
      value: getHoverBackgroundForPreset(theme?.general?.primaryColor || "#3182ce", "outline"),
      globalStyled: true,
      isCustomized: false,
    },
    colorHover: {
      value: darkenedPrimaryColor || "#3180ca",
      globalStyled: true,
      isCustomized: false,
    },
    radius: {
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
    enableLink: false,
    width: '85%',
    height: "auto",
    size: IconButtonSizes.medium,
    text: t("Continue"),
    marginLeft: 20,
    maxWidth: '800px',
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    icon: "arrowright",
    uploadedImageUrl: '',
    uploadedImageMobileUrl: '',
    radiusCorner: 0,
    paddingLeft: "16",
    paddingTop: "14",
    paddingRight: "16",
    paddingBottom: "14",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: 2,
    fullWidth: true,
    preset: 'outline',
    settingsTab: 'content',
    buttonSize: 'medium',
    picSize: IconButtonSizes.small,
    tracking: false,
    trackingEvent: "button-" + hexoid(6)().toLowerCase(),
    nextScreen: '',
    buttonAction: "next-screen",
    alt: "Image",
    align: "center",
    src: ImagePlaceholder.src,
    url: "",
    time: 2,
    Top: 0,
    Bottom: 0,
    Left: 0,
    Right: 0,
    imageSize: "0px"
  };

  return { filledPreset, outLinePreset };
};

export const getBackgroundForPreset = (color, preset) => {
  switch (preset) {
    case "filled":
      return color;
    case "outline":
      return rgba(color, 0.1);
    default:
      return color;

  }
}

export const getHoverBackgroundForPreset = (color, preset) => {

  switch (preset) {
    case "filled":
      return darken(0.03, color);
    case "outline":
      return rgba(color, 0.1);
    default:
      return color;

  }
}

export default useButtonThemePresets;
