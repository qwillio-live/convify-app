"use client"

import React, { useEffect, useRef } from "react"
import ConvifyLogo from "@/assets/convify_logo_black.png"
import { useTranslations } from "next-intl"
import { ComponentProps, Data } from "@/types"

import { env } from "@/env.mjs"
import { useNode } from "@/lib/craftjs"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { cn } from "@/lib/utils"

import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import {
  getBackgroundForPreset,
  getHoverBackgroundForPreset,
} from "./useLogoThemePresets"
import { LogoSettings } from "./user-logo.settings"

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
  top,

  ...props
}) => {
  const headerData = useAppSelector((state) => state.screen?.screensHeader)
  const avatarContainerColor: Data = JSON.parse(headerData)

  // Loop through the data and find the first AvatarComponent
  const avatarComponent = Object.values(avatarContainerColor).find(
    (item) => item.displayName === "AvatarComponent"
  )

  // Check if the component is found and return its containerBackground
  const avatarContainerBackground = avatarComponent
    ? avatarComponent.props.containerBackground
    : null

  return (
    <div
      className=""
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="relative w-full"
        style={{
          background: `${
            avatarContainerBackground !== "transparent"
              ? avatarContainerBackground
              : containerBackground
          }`,
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
    <div
      style={{
        height: "58px",
        width: w,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        alt={alt}
        src={src}
        style={{
          width: w,
          height: `calc(${60}px - ${top}px - ${bottom}px)`,
          borderRadius: `${borderRad}px`,
          backgroundColor: background,
          objectFit: "cover",
          transform: `translateY(${top}px)`,
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
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))
  const t = useTranslations("Components")
  const ref = useRef<HTMLDivElement>(null)
  const [displayController, setDisplayController] = React.useState(false)
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const primaryColor = useAppSelector(
    (state) => state.theme?.general?.primaryColor
  )
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

  useEffect(() => {
    if (buttonAction === "next-screen") {
      setProp((props) => (props.nextScreen = nextScreenName), 1000)
    }
  }, [nextScreenName, buttonAction])

  useEffect(() => {
    if (fontFamily.globalStyled && !fontFamily.isCustomized) {
      setProp((props) => (props.fontFamily.value = primaryFont), 200)
    }
  }, [primaryFont])

  useEffect(() => {
    if (primaryColor) {
      const backgroundPrimaryColor = getBackgroundForPreset(
        primaryColor,
        props.preset
      )
      const hoverBackgroundPrimaryColor = getHoverBackgroundForPreset(
        primaryColor,
        props.preset
      )

      if (background.globalStyled && !background.isCustomized) {
        setProp(
          (props) => (props.background.value = backgroundPrimaryColor),
          200
        )
      }
      if (color.globalStyled && !color.isCustomized) {
        setProp((props) => (props.color.value = primaryColor), 200)
      }
      if (borderColor.globalStyled && !borderColor.isCustomized) {
        setProp((props) => (props.borderColor.value = primaryColor), 200)
      }

      // hover colors

      if (backgroundHover.globalStyled && !backgroundHover.isCustomized) {
        setProp(
          (props) =>
            (props.backgroundHover.value = hoverBackgroundPrimaryColor),
          200
        )
      }
      if (borderHoverColor.globalStyled && !borderHoverColor.isCustomized) {
        setProp((props) => (props.borderHoverColor.value = primaryColor), 200)
      }
      if (colorHover.globalStyled && !colorHover.isCustomized) {
        setProp((props) => (props.colorHover.value = primaryColor), 200)
      }
    }
  }, [primaryColor])
  const maxLength = ButtonTextLimit[size]
  const handleTextChange = (e) => {
    const value = e.target.innerText
    if (value.length <= maxLength) {
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
  const headerData = useAppSelector((state) => state.screen?.screensHeader)
  const avatarContainerColor: Data = JSON.parse(headerData)

  // Loop through the data and find the first AvatarComponent
  const avatarComponent = Object.values(avatarContainerColor).find(
    (item) => item.displayName === "AvatarComponent"
  )

  // Check if the component is found and return its containerBackground
  const avatarContainerBackground = avatarComponent
    ? avatarComponent.props.containerBackground
    : null

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
      <div
        className="relative w-full"
        style={{
          background: `${
            avatarContainerBackground !== "transparent"
              ? avatarContainerBackground
              : containerBackground
          }`,
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
        <div
          ref={(ref: any) => connect(drag(ref))}
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
  url: env.NEXT_PUBLIC_APP_URL,
  src: `${ConvifyLogo.src}`,
  disabled: false,
  enableLink: false,
  minWidth: "120px",
  w: "auto",
  h: "60px",
  width: "85%",
  height: "auto",
  size: IconButtonSizes.medium,
  imageSize: 90,
  buttonSize: "medium",
  time: 2,
  text: "Get quote",
  top: 10,
  bottom: 10,
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
  preset: "filled",
  settingsTab: "content",
  tracking: false,
  trackingEvent: "button_clicked",
  nextScreen: "",
  buttonAction: "next-screen",
  borderRad: 0,
}

LogoComponent.craft = {
  props: LogoDefaultProps,
  related: {
    settings: LogoSettings,
  },
}
