"use client"
import React, { useCallback, useEffect, useRef } from "react"
import {
  Activity,
  Anchor,
  Aperture,
  ArrowLeft,
  ArrowRight,
  Disc,
  DollarSign,
  Mountain,
} from "lucide-react"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"
import { throttle, debounce } from "lodash"

import { useEditor, useNode } from "@/lib/craftjs"
import { darken, rgba } from "polished"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button as CustomButton } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

import { Controller } from "../settings/controller.component"
import { SocialShareButtonSettings } from "./share-button.settings"
import { StyleProperty } from "../types/style.types"
import { useAppSelector, useAppDispatch } from "@/lib/state/flows-state/hooks"
import {
  getBackgroundForPreset,
  getHoverBackgroundForPreset,
} from "./share-theme"
import { useTranslations } from "next-intl"
import { track } from "@vercel/analytics/react"
import { RootState } from "@/lib/state/flows-state/store"
import { navigateToScreen } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useScreenNames } from "@/lib/state/flows-state/features/screenHooks"
import { LineSelectorSettings } from "../lineSeperator/line-seperator-settings"
import {
  ImagePictureTypes,
  PictureTypes,
  SvgRenderer,
} from "@/components/PicturePicker"

const IconsList = {
  aperture: (props) => <Aperture {...props} />,
  activity: (props) => <Activity {...props} />,
  dollarsign: (props) => <DollarSign {...props} />,
  anchor: (props) => <Anchor {...props} />,
  disc: (props) => <Disc {...props} />,
  mountain: (props) => <Mountain {...props} />,
  arrowright: (props) => <ArrowRight {...props} />,
  arrowleft: (props) => <ArrowLeft {...props} />,
}

const IconGenerator = ({ icon, size, className = "", ...rest }) => {
  console.log("icon", icon)
  const IconComponent = IconsList[icon]

  if (!IconComponent) {
    return null // or some default icon or error handling
  }

  return (
    <IconComponent className={`shrink-0 ${className}`} size={size} {...rest} />
  )
}

const ButtonSizeValues = {
  small: ".83rem",
  medium: "1.032rem",
  large: "1.23rem",
}
const IconSizeValues = {
  small: 18,
  medium: 22,
  large: 26,
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

export const SocialShareButtonGen = ({
  disabled,
  fontFamily,
  enableIcon,
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
  iconType,
  chatMessage,
  phoneNumber,
  preview,
  ...props
}) => {
  const router = useRouter()
  const pathName = usePathname()
  const handleNavigateToContent = () => {
    // router.push(currentUrlWithHash);
  }

  return (
    <div
      className="relative w-full max-w-[calc(100%-20px)]"
      style={{
        width: "100%",
        background: `${containerBackground}`,
        display: "flex",
        justifyContent: "center",
        // minWidth: "100%",
        paddingTop: `${props.marginTop}px`,
        paddingBottom: `${props.marginBottom}px`,
        paddingLeft: `${props.marginLeft}px`,
        paddingRight: `${props.marginRight}px`,
      }}
    >
      {preview ? (
        <Link
          href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            chatMessage
          )}`}
          className="contents"
          target="_blank"
        >
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
            className="transform text-[1rem] transition-transform ease-in-out hover:-translate-y-1"
            onClick={() => console.log("Button clicked", text)}
          >
            {iconType !== PictureTypes.NULL && enableIcon && (
              <div className="flex items-center justify-center">
                {iconType === PictureTypes.ICON ? (
                  <SvgRenderer iconName={icon} width="1em" height="1em" />
                ) : iconType === PictureTypes.EMOJI ? (
                  <span className="text-[1em] leading-[1em]">{icon}</span>
                ) : (
                  <picture key={(icon as ImagePictureTypes).desktop}>
                    <source
                      media="(min-width:560px)"
                      srcSet={(icon as ImagePictureTypes).mobile}
                    />
                    <img
                      src={(icon as ImagePictureTypes).desktop}
                      className="h-auto w-auto overflow-hidden rounded-t-[13px] object-cover"
                      style={{ height: "1em", width: "auto" }}
                      loading="lazy"
                    />
                  </picture>
                )}
              </div>
            )}
            <span className="text-md ml-2">
              {" "}
              <div dangerouslySetInnerHTML={{ __html: text }} />
            </span>
          </StyledCustomButton>
        </Link>
      ) : (
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
          className=" text-[1rem]"
          onClick={() => console.log("Button clicked", text)}
        >
          {iconType !== PictureTypes.NULL && enableIcon && (
            <div className="flex items-center justify-center">
              {iconType === PictureTypes.ICON ? (
                <SvgRenderer iconName={icon} width="1em" height="1em" />
              ) : iconType === PictureTypes.EMOJI ? (
                <span className="text-[1em] leading-[1em]">{icon}</span>
              ) : (
                <picture key={(icon as ImagePictureTypes).desktop}>
                  <source
                    media="(min-width:560px)"
                    srcSet={(icon as ImagePictureTypes).mobile}
                  />
                  <img
                    src={(icon as ImagePictureTypes).desktop}
                    className="h-auto w-auto overflow-hidden rounded-t-[13px] object-cover"
                    style={{ height: "1em", width: "auto" }}
                    loading="lazy"
                  />
                </picture>
              )}
            </div>
          )}
          <span className="ml-2 text-sm">{text}</span>
        </StyledCustomButton>
      )}
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
const StyledCustomButton = styled(CustomButton)<StyledCustomButtonProps>`
  font-family: ${(props) => `var(${props?.fontFamily})`};
  display: flex;
  border
  flex-direction: row;
  position: relative;
  overflow: hidden;
  gap: 6px;
  font-size: ${(props) => ButtonSizeValues[props.buttonSize || "medium"]};
  font-weight: 400;
  border: 1px dashed transparent;

  &:hover {
    border-style: solid;
    border-color: ${(props) =>
      props.borderHoverColor}; /* Change to your desired hover border color */
    background: ${(props) => props.backgroundHover};
    color: ${(props) => props.colorHover};
  }

  &:focus {
    border-color: ${(props) =>
      props.borderHoverColor}; /* Change to your desired focus border color */
  }

  background: ${(props) => props.background};
  color: ${(props) => props.color};
  overflow: hidden;
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

  ${({ size, mobileScreen }) => {
    if (size === IconButtonSizes.small) {
      return { width: "250px" }
    } else if (size === IconButtonSizes.medium) {
      if (mobileScreen) {
        return { width: "calc(100% - 22px)" }
      } else {
        return { width: "376px" }
      }
    } else if (size === IconButtonSizes.large) {
      if (mobileScreen) {
        return { width: "calc(100% - 22px)" }
      } else {
        return { width: "576px" }
      }
    } else {
      return {
        width: "calc(100% - 22px)",
      }
    }
  }};

  @media (max-width: 600px) {
    ${({ size }) => {
      if (size === IconButtonSizes.large) {
        return { width: "calc(100% - 22px)" }
      }
    }}
  }

  @media (max-width: 390px) {
    ${({ size }) => {
      if (size === IconButtonSizes.medium) {
        return { width: "calc(100% - 22px)" }
      }
    }}
  }
`

export const SocialShareButton = ({
  fontFamily,
  disabled,
  borderHoverColor,
  enableIcon,
  size,
  buttonSize,
  color,
  text,
  marginLeft,
  width: width,
  height: height,
  marginRight,
  marginTop,
  marginBottom,
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
  iconType,
  chatMessage,
  phoneNumber,
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
  const [hover, setHover] = React.useState(false)
  const t = useTranslations("Components")
  const dispatch = useAppDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const [buttonFullWidth, setButtonFullWidth] = React.useState(size === "full")
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  const secondaryTextColor = useAppSelector(
    (state) => state.theme?.text?.secondaryColor
  )
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const primaryColor = useAppSelector(
    (state) => state.theme?.general?.primaryColor
  )
  const secondaryColor = useAppSelector(
    (state) => state.theme?.general?.secondaryColor
  )
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)
  const screens = useAppSelector((state) => state?.screen?.screens)
  const screensLength = useAppSelector(
    (state: RootState) => state?.screen?.screens?.length ?? 0
  )
  const selectedScreen = useAppSelector(
    (state: RootState) => state.screen?.selectedScreen ?? 0
  )

  const nextScreenName =
    useAppSelector(
      (state: RootState) =>
        state?.screen?.screens[
          selectedScreen + 1 < screensLength ? selectedScreen + 1 : 0
        ]?.screenName
    ) || ""
  const nextScreenId =
    useAppSelector(
      (state: RootState) =>
        state?.screen?.screens[
          selectedScreen + 1 < screensLength ? selectedScreen + 1 : 0
        ]?.screenId
    ) || ""
  const screenNames = useScreenNames()

  //editor load needs to be refreshed so that screenName value is re-populated but
  // it is working now because it refers screenId rather then screenName
  useEffect(() => {
    let screenNameChanged = false
    if (buttonAction === "next-screen") {
      setProp(
        (props) =>
          (props.nextScreen = {
            screenName: nextScreenName,
            screenId: nextScreenId,
          }),
        200
      )
    } else if (buttonAction === "custom-action") {
      screenNames?.map((screen) => {
        if (screen.screenId === nextScreen.screenId) {
          setProp(
            (props) =>
              (props.nextScreen = {
                screenName: screen.screenName,
                screenId: screen.screenId,
              }),
            200
          )
          screenNameChanged = true
        }
      })
      if (!screenNameChanged) {
        setProp((props) => (props.buttonAction = "next-screen"), 200)
        setProp(
          (props) =>
            (props.nextScreen = {
              screenId: nextScreenId,
              screenName: nextScreenName,
            })
        )
      }
    }
  }, [nextScreenName, buttonAction])

  useEffect(() => {
    if (fontFamily.globalStyled && !fontFamily.isCustomized) {
      setProp((props) => (props.fontFamily.value = primaryFont), 200)
    }
  }, [primaryFont])

  const maxLength = ButtonTextLimit[size]
  const handleTextChange = (e) => {
    const value = e.target.innerText
    if (value?.length <= maxLength) {
      setProp((props) => (props.text = value))
      // handlePropChangeDebounced('text',value);
      // handlePropChangeThrottled('text',value)
    } else {
      if (ref.current) {
        e.target.innerText = text || "" // Restore the previous text
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(ref.current)
        range.collapse(false) // Move cursor to the end
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }
  }

  useEffect(() => {
    const currentRef = ref.current
    if (currentRef) {
      currentRef.addEventListener("input", handleTextChange)
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("input", handleTextChange)
      }
    }
  }, [text, maxLength])
  const throttledSetProp = useCallback(
    throttle((property, value) => {
      setProp((prop) => {
        prop[property] = value
      }, 0)
    }, 200), // Throttle to 50ms to 200ms
    [setProp]
  )

  const handlePropChangeThrottled = (property, value) => {
    throttledSetProp(property, value)
  }

  const debouncedSetProp = useCallback(
    debounce((property, value) => {
      setProp((prop) => {
        prop[property] = value
      }, 0)
    }),
    [setProp]
  )

  const handlePropChangeDebounced = (property, value) => {
    debouncedSetProp(property, value)
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
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      {hover && <Controller nameOfComponent={t("WhatsApp Button")} />}

      <div
        className="relative w-full "
        style={{
          background: `${containerBackground}`,
          display: "inline-flex",
          justifyContent: "center",
          boxSizing: "border-box",
          minWidth: "100%",
          maxWidth: "100%",
          paddingTop: `${props.marginTop}px`,
          paddingBottom: `${props.marginBottom}px`,
          paddingLeft: `${props.marginLeft}px`,
          paddingRight: `${props.marginRight}px`,
        }}
      >
        <StyledCustomButton
          fontFamily={fontFamily.value}
          color={color.value}
          background={background.value}
          backgroundHover={backgroundHover.value}
          colorHover={colorHover.value}
          radius={radius.value}
          flexDirection={flexDirection}
          justifyContent={justifyContent}
          borderColor={borderColor.value}
          borderHoverColor={borderHoverColor.value}
          border={border}
          marginLeft={marginLeft}
          mobileScreen={mobileScreen || false}
          width={width}
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
          size={size}
          buttonSize={buttonSize}
          className="custom-button"
          {...props}
        >
          {iconType !== PictureTypes.NULL &&
            enableIcon &&
            (icon !== "" || null) && (
              <div className=" flex items-center justify-center">
                {iconType === PictureTypes.ICON ? (
                  <SvgRenderer iconName={icon} width="1.5em" height="1.2em" />
                ) : iconType === PictureTypes.EMOJI ? (
                  <span className="text-[1em] leading-[1em]">{icon}</span>
                ) : (
                  <picture key={(icon as ImagePictureTypes).desktop}>
                    <source
                      media="(min-width:560px)"
                      srcSet={(icon as ImagePictureTypes).mobile}
                    />
                    <img
                      src={(icon as ImagePictureTypes).desktop}
                      className="h-auto w-auto overflow-hidden rounded-t-[13px] object-cover"
                      style={{ height: "1em", width: "auto" }}
                      loading="lazy"
                    />
                  </picture>
                )}
              </div>
            )}
          <div
            className={`relative flex min-h-[16px]  min-w-[32px] max-w-[100%]  items-center justify-center overflow-hidden overflow-x-clip ${
              enableIcon && (icon !== "" || null) ? "ml-1" : ""
            }`}
          >
            {/** @ts-ignore */}
            <ContentEditable
              html={text.substring(0, maxLength)} // innerHTML of the editable div
              innerRef={ref}
              disabled={disabled}
              style={{
                fontSize: "16px",
                maxWidth: "100%",
                position: "relative",
                border: text?.length <= 0 && "1px dotted white",
                transitionProperty: "all",
                overflowX: "clip",
                textOverflow: "ellipsis",
              }}
              className="border-dotted border-transparent leading-relaxed hover:border-blue-500"
              onChange={(e) => {
                handleTextChange(e)
                // handlePropChangeThrottled('text',e.target.value.substring(0,maxLength))
              }}
              tagName="div"
            />
          </div>
        </StyledCustomButton>
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
  fontFamily: StyleProperty
  disabled: boolean
  enableIcon: boolean
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
  borderColor: StyleProperty
  borderHoverColor: StyleProperty
  marginLeft: number | number
  marginTop: number | number
  marginRight: number | number
  marginBottom: number | number
  width: string | number
  height: string | number
  fullWidth: boolean
  preset: string
  settingsTab: string
  buttonSize: string
  tracking: boolean
  trackingEvent: string
  buttonAction: "next-screen" | "custom-action" | "none" | "back-screen"
  nextScreen: {
    screenId: string
    screenName: string
  }
  iconType?: PictureTypes
  phoneNumber?: string
  chatMessage: string
  preview: boolean
}

export const IconButtonDefaultProps: IconButtonProps = {
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  containerBackground: "rgba(255, 255, 255, 0.886)",
  background: {
    value: "##5a5a5a",
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
  disabled: false,
  enableIcon: true,
  width: "366",
  height: "auto",
  size: IconButtonSizes.medium,
  buttonSize: "medium",
  text: "Get quote",
  marginLeft: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  icon: "interface-arrows-bend-left-1-arrow-bend-curve-change-direction-up-to-left-back",
  paddingLeft: "16",
  paddingTop: "26",
  paddingRight: "16",
  paddingBottom: "26",
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
  border: 0,
  fullWidth: true,
  preset: "filled",
  settingsTab: "content",
  tracking: false,
  trackingEvent: "button_clicked",
  nextScreen: {
    screenId: "",
    screenName: "",
  },
  buttonAction: "next-screen",
  chatMessage: "Hi!",
  preview: true,
}

SocialShareButton.craft = {
  props: IconButtonDefaultProps,
  related: {
    settings: SocialShareButtonSettings,
  },
}
