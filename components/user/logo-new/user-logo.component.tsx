import React, { useCallback, useEffect, useRef } from "react"
import ImagePlaceholder from "@/assets/images/default-image.webp"
import { Activity, Anchor, Aperture, ArrowRight, Disc, DollarSign, Mountain } from "lucide-react"
import { cn } from "@/lib/utils"
import styled from "styled-components"
import { throttle, debounce } from 'lodash';
import { useEditor, useNode } from "@/lib/craftjs"
import { Button as CustomButton } from "@/components/ui/button"
import { Controller } from "../settings/controller.component"
import { LogoSettings } from "./user-logo.settings"
import { StyleProperty } from "../types/style.types"
import { useAppSelector, useAppDispatch } from "@/lib/state/flows-state/hooks"
import { getBackgroundForPreset, getHoverBackgroundForPreset } from "./useLogoThemePresets"
import { useTranslations } from "next-intl";
import { RootState } from "@/lib/state/flows-state/store";
import { navigateToScreen } from "@/lib/state/flows-state/features/placeholderScreensSlice";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ConvifyLogo from "@/assets/convify_logo_black.png"

const IconsList = {
  aperture: (props) => <Aperture {...props} />,
  activity: (props) => <Activity {...props} />,
  dollarsign: (props) => <DollarSign {...props} />,
  anchor: (props) => <Anchor {...props} />,
  disc: (props) => <Disc {...props} />,
  mountain: (props) => <Mountain {...props} />,
  arrowright: (props) => <ArrowRight {...props} />,
};

const IconGenerator = ({ icon, size, className = '', ...rest }) => {
  const IconComponent = IconsList[icon];

  if (!IconComponent) {
    return null; // or some default icon or error handling
  }

  return <IconComponent className={`shrink-0 ${className}`} size={size} {...rest} />;
};


const IconButtonSizeValues = {
  small: "300px",
  medium: "376px",
  large: "576px",
  full: "100%",
}

const ButtonSizeValues = {
  small: ".8rem",
  medium: "1rem",
  large: "1.2rem",
}
const IconSizeValues = {
  small: 18,
  medium: 22,
  large: 26,
}

const IconButtonMobileSizeValues = {
  small: "300px",
  medium: "330px",
  large: "360px",
  full: "100%",
}

const ButtonTextLimit = {
  small: 100,
  // small: 22,
  // medium: 30,
  // large: 40,
  // full: 82,

  medium: 100,
  large: 100,
  full: 100,
}
export const LogoComponentGen = ({
  disabled,
  fontFamily,
  enableLink,
  size,
  buttonSize,
  color,
  text,
  marginLeft,
  width: width,
  w,
  h,
  height: height,
  marginRight,
  marginTop,
  containerBackground,
  marginBottom,
  background,
  backgroundHover,
  colorHover,
  icon,
  paddingLeft,
  align,
  src,
  alt,
  bottom,
  left,
  right,
  borderRad,
  paddingTop,
  paddingRight,
  paddingBottom,
  radius,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  border,
  borderColor,
  borderHoverColor,
  nextScreen,
  ...props
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const handleNavigateToContent = () => {
    // router.push(currentUrlWithHash);
  };
  return (
    <div
      className=""
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="relative w-full"
        style={{
          background: `${containerBackground}`,
          display: "inline-flex",
          justifyContent: "center",
          boxSizing: 'border-box',
          minWidth: '100%',
          maxWidth: '100%',
          paddingTop: `${props.marginTop}px`,
          paddingBottom: `${props.marginBottom}px`,
          paddingLeft: `${props.marginLeft}px`,
          paddingRight: `${props.marginRight}px`,
        }}>
        <div
          className={cn(
            `relative flex flex-row justify-${align} w-full border border-transparent`
          )}
        >
          {
            /* eslint-disable-next-line @next/next/no-img-element */
            <UserLogo
              alt={alt}
              marginTop={marginTop}
              marginBottom={marginBottom}
              marginLeft={marginLeft}
              marginRight={marginRight}
              top={top}
              bottom={bottom}
              left={left}
              borderRad={borderRad}
              right={right}
              background={background}
              radius={radius}
              align={align}
              width={width}
              height={height}
              w={w}
              h={h}
              src={src}
              {...props}
            />
          }
        </div>
      </div>
    </div>
  )
}
interface StyledCustomButtonProps {
  fontFamily?: string
  color?: string
  background?: string
  backgroundHover?: string
  colorHover?: string
  size?: string
  buttonSize?: string
  marginLeft?: string | number
  width?: string | number
  height?: string | number
  marginRight?: string | number
  marginTop?: string | number
  marginBottom?: string | number
  paddingLeft?: string | number
  paddingTop?: string | number
  paddingRight?: string | number
  paddingBottom?: string | number
  radius?: number
  flexDirection?: string
  alignItems?: string
  justifyContent?: string
  gap?: number
  border?: number
  borderColor?: string
  borderHoverColor?: string
  mobileScreen: boolean
}
const StyledCustomButton = styled(CustomButton) <StyledCustomButtonProps>`
  font-family: ${(props) => `var(${props?.fontFamily})`};
  display: flex;
  flex-direction: row;
  position: relative;
  gap: 6px;
  font-size: ${(props) => ButtonSizeValues[props.buttonSize || "medium"]};
  font-weight: 400;
  border: 1px dashed transparent;
  transition: all 0.2s ease;

  &:hover {
    border-style: solid;
    border-color: ${(props) => props.borderHoverColor}; /* Change to your desired hover border color */
    background: ${(props) => props.backgroundHover};
    color: ${(props) => props.colorHover};
  }

  &:focus {
    border-color: ${(props) => props.borderHoverColor}; /* Change to your desired focus border color */
  }

  background: ${(props) => props.background};
  color: ${(props) => props.color};
  overflow: hidden;
  max-width: ${(props) => props.mobileScreen ? IconButtonMobileSizeValues[props.size || "medium"] : IconButtonSizeValues[props.size || "medium"]};
  width: 100%;
  box-sizing: border-box;
  height: ${(props) => props.height}px;
  margin-top: ${(props) => props.marginTop}px;
  margin-left: ${(props) => props.marginLeft}px;
  margin-right: ${(props) => props.marginRight}px;
  margin-bottom: ${(props) => props.marginBottom}px;
  padding-left: ${(props) => props.paddingLeft}px;
  padding-top: ${(props) => ButtonSizeValues[props.buttonSize || "medium"]};
  padding-right: ${(props) => props.paddingRight}px;
  padding-bottom: ${(props) => ButtonSizeValues[props.buttonSize || "medium"]};
  border-radius: ${(props) => props.radius}px;
  flex-direction: ${(props) => props.flexDirection};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  gap: ${(props) => props.gap}px;
  border: ${(props) => props.border}px solid ${(props) => props.borderColor};
  @media (max-width: 760px) {
    width: 100%; /* Make the button take the full width on smaller screens */
    max-width: 600px;
  }
  @media (max-width: 660px) {
    width: 100%; /* Make the button take the full width on smaller screens */
    max-width: 400px;
  }
`;

export const UserLogo = ({
  alt,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  background,
  radius,
  align,
  width,
  height,
  w,
  h,
  src,
  top,
  left,
  bottom,
  right,
  borderRad,
  ...props
}) => {
  return (
    <div style={{ height: h, width: w, overflow: 'hidden', position: 'relative' }}>
      <img
        alt={alt}
        src={src}
        style={{
          width: w,
          height: `calc(${80}px - ${top}px - ${bottom}px)`, // Adjust height based on top and bottom
          borderRadius: `${borderRad}px`,
          backgroundColor: background,
          objectFit: 'cover',
          transform: `translateY(${top}px)`, // Move image down by top value
          marginLeft: `${left}px`,
          marginRight: `${right}px`,
        }}
      />
    </div>
  )
}


export const LogoComponent = ({
  alt,
  align,
  src,
  fontFamily,
  disabled,
  borderHoverColor,
  enableLink,
  size,
  buttonSize,
  color,
  text,
  marginLeft,
  w,
  h,
  width,
  height: height,
  marginRight,
  marginTop,
  marginBottom,
  top,
  bottom,
  left,
  right,
  containerBackground,
  background,
  backgroundHover,
  colorHover,
  icon,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  radius,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  border,
  borderColor,
  buttonAction,
  nextScreen,
  borderRad,
  ...props
}) => {
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))
  const { actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
  }))
  const t = useTranslations("Components")
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [displayController, setDisplayController] = React.useState(false);
  const [buttonFullWidth, setButtonFullWidth] = React.useState(size === "full");
  const primaryTextColor = useAppSelector((state) => state.theme?.text?.primaryColor)
  const secondaryTextColor = useAppSelector((state) => state.theme?.text?.secondaryColor)
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont);
  const primaryColor = useAppSelector((state) => state.theme?.general?.primaryColor);
  const secondaryColor = useAppSelector((state) => state.theme?.general?.secondaryColor);
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen);
  const screens = useAppSelector((state: RootState) => state?.screen?.screens);
  const screensLength = useAppSelector((state: RootState) => state?.screen?.screens?.length ?? 0);
  const selectedScreen = useAppSelector((state: RootState) => state.screen?.selectedScreen ?? 0)

  const nextScreenName = useAppSelector((state: RootState) => state?.screen?.screens[((selectedScreen + 1 < screensLength) ? selectedScreen + 1 : 0)]?.screenName) || "";

  useEffect(() => {
    if (buttonAction === "next-screen") {
      setProp((props) => (props.nextScreen = nextScreenName), 1000)
    }
  }, [nextScreenName, buttonAction])

  useEffect(() => {
    if (fontFamily.globalStyled && !fontFamily.isCustomized) {
      setProp((props) => props.fontFamily.value = primaryFont, 200);
    }
  },
    [primaryFont])

  useEffect(() => {

    if (primaryColor) {
      const backgroundPrimaryColor = getBackgroundForPreset(primaryColor, props.preset);
      const hoverBackgroundPrimaryColor = getHoverBackgroundForPreset(primaryColor, props.preset);

      if (background.globalStyled && !background.isCustomized) {
        setProp((props) => props.background.value = backgroundPrimaryColor, 200)
      }
      if (color.globalStyled && !color.isCustomized) {
        setProp((props) => props.color.value = primaryColor, 200)
      }
      if (borderColor.globalStyled && !borderColor.isCustomized) {
        setProp((props) => props.borderColor.value = primaryColor, 200)
      }

      // hover colors

      if (backgroundHover.globalStyled && !backgroundHover.isCustomized) {
        setProp((props) => props.backgroundHover.value = hoverBackgroundPrimaryColor, 200)
      }
      if (borderHoverColor.globalStyled && !borderHoverColor.isCustomized) {
        setProp((props) => props.borderHoverColor.value = primaryColor, 200)
      }
      if (colorHover.globalStyled && !colorHover.isCustomized) {
        setProp((props) => props.colorHover.value = primaryColor, 200)
      }
    }

  }, [primaryColor])
  const maxLength = ButtonTextLimit[size];
  const handleTextChange = (e) => {

    const value = e.target.innerText;
    if (value.length <= maxLength) {
      setProp((props) => props.text = value);
      // handlePropChangeDebounced('text',value);
      // handlePropChangeThrottled('text',value)
    } else {
      if (ref.current) {
        e.target.innerText = text || ''; // Restore the previous text
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        range.collapse(false); // Move cursor to the end
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  useEffect(() => {

    const currentRef = ref.current;
    if (currentRef) {
      currentRef.addEventListener('input', handleTextChange);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('input', handleTextChange);
      }
    };

  }, [text, maxLength]);

  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      className=""
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
      onMouseOver={() => setDisplayController(true)}
      onMouseOut={() => setDisplayController(false)}
    >
      {displayController && <Controller nameOfComponent={t("Logo")} />}
      <div className="relative w-full"
        style={{
          background: `${containerBackground}`,
          display: "inline-flex",
          justifyContent: "center",
          boxSizing: 'border-box',
          minWidth: '100%',
          maxWidth: '100%',
          paddingTop: `${props.marginTop}px`,
          paddingBottom: `${props.marginBottom}px`,
          paddingLeft: `${props.marginLeft}px`,
          paddingRight: `${props.marginRight}px`,
        }}>
        <div
          ref={(ref: any) => connect(drag(ref))}
          className={cn(
            `relative flex flex-row justify-${align} w-full border border-transparent`
          )}
        >
          {isHovered && <Controller nameOfComponent={t("Logo")} />}
          {
            /* eslint-disable-next-line @next/next/no-img-element */
            <UserLogo
              alt={alt}
              marginTop={marginTop}
              marginBottom={marginBottom}
              marginLeft={marginLeft}
              marginRight={marginRight}
              top={top}
              bottom={bottom}
              left={left}
              borderRad={borderRad}
              right={right}
              background={background}
              radius={radius}
              align={align}
              width={width}
              height={height}
              w={w}
              h={h}
              src={src}
              {...props}
            />
          }
        </div>
      </div>
    </div>
  )
}


export enum IconButtonSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}



export type IconButtonProps = {
  alt: string
  align: string
  src: string
  url: string
  fontFamily: StyleProperty
  disabled: boolean
  enableLink: boolean
  size: IconButtonSizes
  containerBackground: string
  background: StyleProperty
  backgroundHover: StyleProperty
  color: StyleProperty
  colorHover: StyleProperty
  text: string
  icon: string
  paddingLeft: string | number
  paddingTop: string | number
  paddingRight: string | number
  paddingBottom: string | number
  radius: StyleProperty
  flexDirection: string
  alignItems: string
  justifyContent: string
  gap: number
  border: number
  time: number
  borderColor: StyleProperty
  borderHoverColor: StyleProperty
  marginLeft: number | number
  marginTop: number | number
  marginRight: number | number
  marginBottom: number | number
  w: string | number
  h: string | number
  left: number
  top: number
  right: number
  minWidth: string
  bottom: number
  width: string | number
  height: string | number
  fullWidth: boolean
  preset: string
  imageSize: number
  settingsTab: string
  buttonSize: string
  tracking: boolean
  trackingEvent: string
  buttonAction: "next-screen" | "custom-action" | "none"
  nextScreen: string
  borderRad: number
}

export const LogoDefaultProps: IconButtonProps = {
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  containerBackground: "#ffffff",
  background: {
    value: "#4050ff",
    globalStyled: false,
    isCustomized: false,
  },
  color: {
    value: "#ffffff",
    globalStyled: false,
    isCustomized: false,
  },
  backgroundHover: {
    value: "#3182ce",
    globalStyled: false,
    isCustomized: false,
  },
  colorHover: {
    value: "#ffffff",
    globalStyled: false,
    isCustomized: false,

  },
  radius: {
    value: "0",
    globalStyled: false,
    isCustomized: false,
  },
  justifyContent: "center",
  borderColor: {
    value: "inherit",
    globalStyled: false,
    isCustomized: false,
  },
  borderHoverColor: {
    value: "inherit",
    globalStyled: false,
    isCustomized: false,
  },
  alt: "Image",
  align: "center",
  url: 'https://convify.io',
  src: `${ConvifyLogo.src}`,
  disabled: false,
  enableLink: false,
  minWidth: '120px',
  w: 'auto',
  h: '80px',
  width: "85%",
  height: "auto",
  size: IconButtonSizes.medium,
  imageSize: 90,
  buttonSize: "medium",
  time: 2,
  text: "Get quote",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
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
  fullWidth: true,
  preset: 'filled',
  settingsTab: 'content',
  tracking: false,
  trackingEvent: 'button_clicked',
  nextScreen: '',
  buttonAction: "next-screen",
  borderRad: 0
}

LogoComponent.craft = {
  props: LogoDefaultProps,
  related: {
    settings: LogoSettings,
  },
}
