import React, { useEffect, useRef } from "react"
import { Activity, Anchor, Aperture, ArrowRight, Disc, DollarSign, Mountain } from "lucide-react"
import { cn } from "@/lib/utils"
import styled from "styled-components"
import { useEditor, useNode } from "@/lib/craftjs"
import { Button as CustomButton } from "@/components/ui/button"
import { Controller } from "../settings/controller.component"
import { AvatarSettings } from './user-avatar.settings'
import { StyleProperty } from "../types/style.types"
import { useAppSelector, useAppDispatch } from "@/lib/state/flows-state/hooks"
import { getBackgroundForPreset, getHoverBackgroundForPreset } from "./useAvatarThemePresets"
import { useTranslations } from "next-intl";
import { RootState } from "@/lib/state/flows-state/store";
import AvatarPlaceholder from '@/assets/images/default-avatar.webp'
import classNames from 'classnames';
import './styles.css';

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

export const AvatarComponentGen = ({
  disabled,
  fontFamily,
  enableLink,
  size,
  buttonSize,
  color,
  text,
  marginLeft,
  width,
  w,
  h,
  height,
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
  align,
  justifyContent,
  cornRad,
  alt,
  bottom,
  left,
  right,
  src,
  gap,
  border,
  borderColor,
  borderHoverColor,
  nextScreen,
  ...props
}) => {
  const mobileScreen = useAppSelector((state) => state?.theme?.mobileScreen);
  const scrollY = useAppSelector((state) => state?.screen?.scrollY || 0);
  const hasComponentBeforeAvatar = useAppSelector((state) => state?.screen?.hasComponentBeforeAvatar)
  const avatarRef = useRef(null);
  const baseSize = 90; // Initial base size of the avatar
  const minimumSize = 48; // Minimum size of the avatar
  const sizeReductionFactor = 0.5; // Control the rate of size reduction
  const mobileBaseSize = 60

  let mobileDynamicSize = Math.max(mobileBaseSize - (scrollY * sizeReductionFactor), minimumSize);
  // Calculate dynamic size
  let dynamicSize = Math.max(baseSize - (scrollY * sizeReductionFactor), minimumSize);
  let translateYPercent = Math.max(0, 35 - (scrollY));
  const translateY = mobileScreen ? `calc(${translateYPercent}%)` : '0px';
  const avatarClass = `${hasComponentBeforeAvatar ? (scrollY && scrollY > 50 ? 'avatar-top' : 'avatar-half') : (!mobileScreen && (scrollY && scrollY > 50) ? 'avatar-none-scrolled' : mobileScreen && scrollY ? `transition-transform ease-in-out duration-300` : mobileScreen ? 'avatar-none-mobile' : 'avatar-none')}`;

  return (
    <div
      className=""
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        height: hasComponentBeforeAvatar ? '' : '50px',
      }}
    >
      <div
        className="relative w-full"
        style={{
          background: `${containerBackground}`,
          display: "inline-flex",
          justifyContent: "center",
          boxSizing: 'border-box',
          minWidth: '100%',
          maxWidth: '100%',
        }}
      >
        <div
          className={`relative flex flex-row justify-${align} w-full border border-transparent`}
        >
          <div
            ref={avatarRef}
            id="avatar-component"
            className={classNames(
              avatarClass,
              hasComponentBeforeAvatar ? 'absolute transition-transform translate-y-[-50%] ease-in-out duration-300' : ''
            )}
            style={{
              transform: `translateY(${translateY})`,
            }}
          >
            <img
              alt={alt}
              src={src}
              style={{
                width: mobileScreen ? `${mobileDynamicSize}px` : `${dynamicSize}px`,
                height: mobileScreen ? `${mobileDynamicSize}px` : `${dynamicSize}px`,
                borderRadius: `${cornRad}px`,
                backgroundColor: background,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

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
  cornRad,
  bottom,
  right,
  ...props
}) => {
  const mobileScreen = useAppSelector((state) => state?.theme?.mobileScreen);
  const scrollY = useAppSelector((state) => state?.screen?.scrollY);
  const hasComponentBeforeAvatar = useAppSelector((state) => state?.screen?.hasComponentBeforeAvatar)

  const avatarRef = useRef(null);

  const avatarClass = `${hasComponentBeforeAvatar ? (scrollY && scrollY > 50 ? 'avatar-top' : 'avatar-half') : (scrollY && scrollY > 50 ? 'avatar-none-scrolled' : mobileScreen ? 'avatar-none-mobile' : 'avatar-none')}`;
  return (
    <div
      id="avatar-component"
      ref={avatarRef}
      className={classNames(
        avatarClass,
        hasComponentBeforeAvatar ? 'absolute transition-transform translate-y-[-50%] ease-in-out duration-300' : ''
      )}
    >
      <img
        alt={alt}
        src={src}
        // className="rounded-full"
        style={{
          width: mobileScreen ? '60px' : (hasComponentBeforeAvatar && (scrollY && scrollY > 50) ? '80px' : (scrollY && scrollY > 50 ? '48px' : '90px')),
          height: mobileScreen ? '60px' : (hasComponentBeforeAvatar && (scrollY && scrollY > 50) ? '80px' : (scrollY && scrollY > 50 ? '48px' : '90px')),
          borderRadius: `${cornRad}px`,
          backgroundColor: background,
          objectFit: 'cover',
          transform: `translateY(${top}px)`,
          marginLeft: `${left}px`,
          marginRight: `${right}px`,
        }}
      />
    </div>
  )
}


export const AvatarComponent = ({
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
  uploadedImageUrl,
  uploadedImageMobileUrl,
  cornRad,
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

  const hasComponentBeforeAvatar = useAppSelector((state) => state?.screen?.hasComponentBeforeAvatar)
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
    if (mobileScreen && uploadedImageMobileUrl) {
      setProp((props) => (props.src = uploadedImageMobileUrl), 1000)
    } else if (!mobileScreen && uploadedImageUrl) {
      setProp((props) => (props.src = uploadedImageUrl), 1000)
    }
  }, [mobileScreen])

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
        height: hasComponentBeforeAvatar ? '' : '50px',
        justifyContent: "center",
      }}
      onMouseOver={() => setDisplayController(true)}
      onMouseOut={() => setDisplayController(false)}
    >
      {displayController && <Controller nameOfComponent={t("Avatar")} />}
      <div className="relative w-full"
        style={{
          // background: `${containerBackground}`,
          display: "inline-flex",
          justifyContent: "center",
          boxSizing: 'border-box',
          minWidth: '100%',
          maxWidth: '100%',
        }}>
        <div
          ref={(ref: any) => connect(drag(ref))}
          className={cn(
            `relative flex flex-row justify-${align} w-full border border-transparent`
          )}
        >
          {isHovered && <Controller nameOfComponent={t("Avatar")} />}
          {
            /* eslint-disable-next-line @next/next/no-img-element */
            <UserLogo
              alt={alt}
              marginTop={marginTop}
              marginBottom={marginBottom}
              cornRad={cornRad}
              marginLeft={marginLeft}
              marginRight={marginRight}
              top={top}
              bottom={bottom}
              left={left}
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
  uploadedImageUrl: string
  cornRad: number
  uploadedImageMobileUrl: string
}

export const AvatarDefaultProps: IconButtonProps = {
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
  src: `${AvatarPlaceholder.src}`,
  disabled: false,
  enableLink: false,
  w: 'auto',
  h: '60px',
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
  cornRad: 50,
  uploadedImageUrl: '',
  uploadedImageMobileUrl: ''
}

AvatarComponent.craft = {
  props: AvatarDefaultProps,
  related: {
    settings: AvatarSettings,
  },
}
