import React, { useCallback, useEffect, useRef } from "react"
import ImagePlaceholder from "@/assets/images/default-image.webp"
import { Activity, Anchor, Aperture, ArrowRight, Disc, DollarSign, Mountain } from "lucide-react"
import { cn } from "@/lib/utils"
import styled from "styled-components"
import { throttle, debounce } from 'lodash';
import { useEditor, useNode } from "@/lib/craftjs"
import { Button as CustomButton } from "@/components/ui/button"
import { Controller } from "../settings/controller.component"
import { ImageSettings } from "./user-image.settings"
import { StyleProperty } from "../types/style.types"
import { useAppSelector, useAppDispatch } from "@/lib/state/flows-state/hooks"
import { getBackgroundForPreset, getHoverBackgroundForPreset } from "./useButtonThemePresets"
import { useTranslations } from "next-intl";
import { RootState } from "@/lib/state/flows-state/store";
import { navigateToScreen } from "@/lib/state/flows-state/features/placeholderScreensSlice";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
export const ImageComponentGen = ({
  disabled,
  fontFamily,
  enableLink,
  size,
  buttonSize,
  color,
  text,
  marginLeft,
  width: width,
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
    <div className="w-full relative" style={{
      width: "100%",
      background: `${containerBackground}`,
      display: "flex",
      justifyContent: "center",
      minWidth: '100%',
      paddingTop: `${props.marginTop}px`,
      paddingBottom: `${props.marginBottom}px`,
      paddingLeft: `${props.marginLeft}px`,
      paddingRight: `${props.marginRight}px`,
    }}>
      <Link href={`${pathName}#${nextScreen}`} className="contents">
        <StyledCustomButton
          fontFamily={fontFamily?.value}
          color={color.value}
          background={background.value}
          backgroundHover={backgroundHover.value}
          borderHoverColor={borderHoverColor?.value}
          colorHover={colorHover.value}
          radius={radius.value}
          flexDirection={flexDirection}
          justifyContent={justifyContent}
          borderColor={borderColor.value}
          border={border}
          marginLeft={marginLeft}
          width={width}
          size={size}
          buttonSize={buttonSize}
          height={height}
          marginRight={marginRight}
          marginTop={marginTop}
          marginBottom={marginBottom}
          paddingLeft={paddingLeft}
          paddingTop={paddingTop}
          paddingRight={paddingRight}
          paddingBottom={paddingBottom}
          alignItems={alignItems}
          gap={gap}
          mobileScreen={false}
          {...props}
          className="text-[1rem]"
          onClick={() => console.log("Button clicked", text)}
        >
          <div style={{
            maxWidth: '100%',
            transitionProperty: 'all',
            overflowX: 'clip',
            textOverflow: 'ellipsis',
          }}>{text}</div>
          {enableLink && <IconGenerator icon={icon} size={IconSizeValues[buttonSize]} />}
        </StyledCustomButton>
      </Link>
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
  radiusCorner,
  align,
  width,
  height,
  src,
  Top,
  Left,
  Bottom,
  maxWidth,
  Right,
  ...props
}) => {
  console.log('max width in the image is: ', maxWidth, width)
  return (
    <>
      <img
        alt={alt}
        src={src}
        style={{
          width: width,
          maxWidth: maxWidth,
          height: height,
          borderRadius: `${radiusCorner}px`,
          backgroundColor: background,
          marginLeft: `${Left}px`,
          marginRight: `${Right}px`,
          marginTop: `${Top}px`,
          marginBottom: `${Bottom}px`,
        }}
      />
    </>
  )
}


export const ImageComponent = ({
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
  width,
  height: height,
  marginRight,
  marginTop,
  marginBottom,
  Top,
  Left,
  Bottom,
  Right,
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
  radiusCorner,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  border,
  borderColor,
  buttonAction,
  nextScreen,
  uploadedImageMobileUrl,
  uploadedImageUrl,
  maxWidth,
  imageSize,
  picSize,
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

  console.log('the value of size is: ', size)
  const nextScreenName = useAppSelector((state: RootState) => state?.screen?.screens[((selectedScreen + 1 < screensLength) ? selectedScreen + 1 : 0)]?.screenName) || "";


  useEffect(() => {
    const handleResize = () => {
      if (mobileScreen && picSize == 'small') {
        setProp((props) => (props.maxWidth = '300px', props.picSize = 'small', props.width = `${props.imageSize}%`), 1000);
      } else if (mobileScreen && picSize == 'medium') {
        setProp((props) => (props.maxWidth = '300px', props.picSize = 'medium', props.width = `${props.imageSize}%`), 1000);
      } else if (mobileScreen && picSize == 'large') {
        setProp((props) => (props.maxWidth = '300px', props.picSize = 'large', props.width = `${props.imageSize}%`), 1000);
      } else if (mobileScreen && picSize == 'full') {
        setProp((props) => (props.maxWidth = '330px', props.picSize = 'full', props.width = `${props.imageSize}%`), 1000);
      } else if (!mobileScreen && picSize == 'small') {
        setProp((props) => (props.maxWidth = '400px', props.picSize = 'small', props.width = `${props.imageSize}%`), 1000);
      } else if (!mobileScreen && picSize == 'medium') {
        setProp((props) => (props.maxWidth = '800px', props.picSize = 'medium', props.width = `${props.imageSize}%`), 1000);
      } else if (!mobileScreen && picSize == 'large') {
        setProp((props) => (props.maxWidth = '850px', props.picSize = 'large', props.width = `${props.imageSize}%`), 1000);
      } else if (!mobileScreen && picSize == 'full') {
        setProp((props) => (props.maxWidth = '870px', props.picSize = 'full', props.width = `${props.imageSize}%`), 1000);
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileScreen, picSize]);

  useEffect(() => {
    if (mobileScreen && uploadedImageMobileUrl) {
      setProp((props) => (props.src = uploadedImageMobileUrl), 1000)
    } else if (!mobileScreen && uploadedImageUrl) {
      setProp((props) => (props.src = uploadedImageUrl), 1000)
    }
  }, [mobileScreen])

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
  const throttledSetProp = useCallback(
    throttle((property, value) => {
      setProp((prop) => { prop[property] = value }, 0);
    }, 200), // Throttle to 50ms to 200ms
    [setProp]
  );

  const handlePropChangeThrottled = (property, value) => {
    throttledSetProp(property, value);
  };
  const handleNavigateToScreen = async () => {
    dispatch(navigateToScreen(nextScreen));
    if (screens) {
      const screen = screens.find(screen => screen.screenName === nextScreen);
      if (screen) {
        const screenData = screen.screenData;
        actions.deserialize(screenData);
      }
    }
  }

  const debouncedSetProp = useCallback(
    debounce((property, value) => {
      setProp((prop) => { prop[property] = value }, 0);
    }), [setProp])

  const handlePropChangeDebounced = (property, value) => {
    debouncedSetProp(property, value);
  }

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
      {displayController && <Controller nameOfComponent={t("Image")} />}
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
          {isHovered && <Controller nameOfComponent={t("Image")} />}
          {
            /* eslint-disable-next-line @next/next/no-img-element */
            <UserLogo
              alt={alt}
              marginTop={marginTop}
              maxWidth={maxWidth}
              marginBottom={marginBottom}
              marginLeft={marginLeft}
              marginRight={marginRight}
              Top={Top}
              Bottom={Bottom}
              Left={Left}
              Right={Right}
              background={background}
              radius={radius}
              radiusCorner={radiusCorner}
              align={align}
              width={width}
              height={height}
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
  picSize: IconButtonSizes
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
  Top: number
  Bottom: number
  Left: number
  Right: number
  width: string | number
  height: string | number
  fullWidth: boolean
  maxWidth: string
  preset: string
  imageSize: number
  settingsTab: string
  buttonSize: string
  tracking: boolean
  trackingEvent: string
  buttonAction: "next-screen" | "custom-action" | "none"
  nextScreen: string
  uploadedImageUrl: string
  radiusCorner: number
  uploadedImageMobileUrl: string
}

export const ImageDefaultProps: IconButtonProps = {
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
  src: ImagePlaceholder.src,
  radiusCorner: 0,
  disabled: false,
  enableLink: false,
  width: "100%",
  maxWidth: '400px',
  height: "auto",
  size: IconButtonSizes.small,
  picSize: IconButtonSizes.small,
  imageSize: 100,
  buttonSize: "small",
  time: 2,
  text: "Get quote",
  Top: 0,
  Bottom: 0,
  Left: 0,
  Right: 0,
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
  uploadedImageUrl: '',
  uploadedImageMobileUrl: ''
}

ImageComponent.craft = {
  props: ImageDefaultProps,
  related: {
    settings: ImageSettings,
  },
}