"use client"
import React, { useCallback, useEffect, useRef, useState } from "react"
import local from "next/font/local"
import { usePathname, useRouter } from "next/navigation"
import { track } from "@vercel/analytics/react"
import { set } from "date-fns"
import { debounce, throttle } from "lodash"
import { useTranslations } from "next-intl"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useEditor, useNode } from "@/lib/craftjs"
import { navigateToScreen } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"

import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import {
  getBackgroundForPreset,
  getHoverBackgroundForPreset,
} from "./useTextThemePresets"
import { UserTextInputSettings } from "./user-text-settings"
import { UserInputSizes } from "../input/user-input.component"

export enum TextContainerSize {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

interface StyleCustomTextContainerProps {
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
  border?: number
  borderColor?: string
  borderHoverColor?: string
  mobileScreen: boolean
  fontSize?: string
  fontWeight?: number
  textAlign?: string
  borderRadius?: string
  padding?: string
  preset?: string
  lineHeight?: string | number
}

export type TextInputProps = {
  fontFamily: StyleProperty
  size: TextContainerSize
  fontSize: number
  fontWeight: string | number
  textAlign: string
  containerBackground: string
  background: StyleProperty
  backgroundHover: StyleProperty
  color: StyleProperty
  colorHover: StyleProperty
  text: string
  textColor?: string
  paddingLeft: string | number
  paddingTop: string | number
  paddingRight: string | number
  paddingBottom: string | number
  radius: StyleProperty
  flexDirection: string
  alignItems: string
  justifyContent: string
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
  buttonSize: string
  lineHeight: string | number
}

export const TextInputDefaultProps: TextInputProps = {
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  containerBackground: "transparent",
  background: {
    value: "#4050ff",
    globalStyled: false,
    isCustomized: false,
  },
  color: {
    value: "#000",
    globalStyled: true,
    isCustomized: false,
  },
  backgroundHover: {
    value: "transparent",
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
    value: "transparent",
    globalStyled: false,
    isCustomized: false,
  },
  width: "366",
  height: "40",
  size: TextContainerSize.medium,
  buttonSize: "medium",
  text: "Text Description",
  marginLeft: 0,
  marginTop: 20,
  marginRight: 0,
  marginBottom: 20,
  fontSize: 18,
  lineHeight: 24,
  fontWeight: "400",
  textAlign: "center",
  paddingLeft: "12",
  paddingTop: "0",
  paddingRight: "12",
  paddingBottom: "0",
  flexDirection: "row",
  alignItems: "center",
  border: 2,
  fullWidth: true,
  preset: "paragraph",
}

const StyledCustomTextInput = styled.div<StyleCustomTextContainerProps>`
  font-family: ${(props) => `var(${props?.fontFamily})`};
  background: ${(props) => `${props?.background}`};
  display: flex;
  flex-direction: row;
  position: relative;
  font-size: ${(props) => `${props?.fontSize}`}px;
  font-weight: ${(props) => `${props?.fontWeight}`};
  border: 1px dashed transparent;
  text-align: ${(props) => `${props?.textAlign}`};

  &:focus {
    border-color: ${(props) =>
      props.borderHoverColor}; /* Change to your desired focus border color */
  }

  color: ${(props) => `${props?.color}`};
  overflow: hidden;
  box-sizing: border-box;
  height: ${(props) => props.height};
  margin-top: ${(props) => props.marginTop}px;
  margin-left: ${(props) => props.marginLeft}px;
  margin-right: ${(props) => props.marginRight}px;
  margin-bottom: ${(props) => props.marginBottom}px;
  border-radius: ${(props) => props.radius}px;
  flex-direction: ${(props) => props.flexDirection};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  border: ${(props) => props.border}px solid ${(props) => props.borderColor};
  line-height: ${(props) => props.lineHeight}px;
  margin-left: auto;
  margin-right: auto;

  ${({ size, mobileScreen }) => {
    if (mobileScreen) {
      return { width: "calc(100% - 20px)" }
    } else {
      if (size === UserInputSizes.small) {
        return { width: "520px" }
      } else if (size === UserInputSizes.medium) {
        return { width: "650px" }
      } else if (size === UserInputSizes.large) {
        return { width: "770px" }
      } else {
        return { width: "calc(100% - 20px)" }
      }
    }
  }};

  @media (max-width: 520px) {
    width: calc(100% - 20px);
  }
`

export const UserTextInputGen = ({
  fontFamily,
  size,
  buttonSize,
  color,
  text,
  textColor,
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
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  radius,
  flexDirection,
  alignItems,
  justifyContent,
  fontSize: fontSize,
  fontWeight: fontWeight,
  textAlign,
  border,
  borderColor,
  borderHoverColor,
  lineHeight,
  ...props
}) => {
  const secondaryTextColor = useAppSelector(
    (state) => state.theme?.text?.secondaryColor
  )

  const primaryFont = useAppSelector(
    (state) => state.theme?.text?.secondaryFont
  )
  const sanitizedText = text
    .replace(/<br>/g, "\n")
    .replace(/<\/?div>/g, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "") // Removes all other HTML tags

  return (
    <div
      className="relative w-full"
      style={{
        width: "100%",
        background: `${containerBackground}`,
        display: "flex",
        justifyContent: "center",
        minWidth: "100%",
        paddingTop: `${props.marginTop}px`,
        paddingBottom: `${props.marginBottom}px`,
        paddingLeft: `${props.marginLeft}px`,
        paddingRight: `${props.marginRight}px`,
      }}
    >
      <StyledCustomTextInput
        fontFamily={primaryFont}
        color={color?.value}
        background={containerBackground}
        fontSize={fontSize}
        fontWeight={fontWeight}
        backgroundHover={backgroundHover?.value}
        borderHoverColor={borderHoverColor?.value}
        colorHover={colorHover?.value}
        radius={radius?.value}
        flexDirection={flexDirection}
        justifyContent={justifyContent}
        borderColor={borderColor?.value}
        border={0}
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
        mobileScreen={false}
        textAlign={textAlign}
        lineHeight={lineHeight}
        {...props}
        className="user-text-comp text-[1rem]"
      >
        <div
          style={{
            maxWidth: "100%",
            transitionProperty: "all",
            overflowX: "clip",
            textOverflow: "ellipsis",
            color: `${
              textColor !== "#ffffff" ? textColor : secondaryTextColor
            }`,
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      </StyledCustomTextInput>
    </div>
  )
}

export const UserText = ({
  fontFamily,
  borderHoverColor,
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
  fontSize,
  fontWeight,
  textAlign,
  containerBackground,
  background,
  backgroundHover,
  colorHover,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  radius,
  flexDirection,
  alignItems,
  justifyContent,
  border,
  borderColor,
  textColor,
  lineHeight,
  ...props
}) => {
  paddingLeft = 16
  paddingRight = 16
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
  const dispatch = useAppDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const [displayController, setDisplayController] = React.useState(false)
  const [localText, setLocalText] = useState(text)

  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  const secondaryTextColor = useAppSelector(
    (state) => state.theme?.text?.secondaryColor
  )
  const primaryFont = useAppSelector(
    (state) => state.theme?.text?.secondaryFont
  )
  const primaryColor = useAppSelector(
    (state) => state.theme?.general?.primaryColor
  )
  const secondaryColor = useAppSelector(
    (state) => state.theme?.general?.secondaryColor
  )
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)
  const screens = useAppSelector((state: RootState) => state?.screen?.screens)
  const screensLength = useAppSelector(
    (state: RootState) => state?.screen?.screens?.length ?? 0
  )
  const selectedScreen = useAppSelector(
    (state: RootState) => state.screen?.selectedScreen ?? 0
  )

  useEffect(() => {
    if (fontFamily.globalStyled && !fontFamily.isCustomized) {
      setProp((props) => (props.fontFamily.value = primaryFont), 200)
    }
  }, [primaryFont, fontFamily.globalStyled, fontFamily.isCustomized, setProp])

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
        setProp((props) => (props.color.value = secondaryTextColor), 200)
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
  }, [
    primaryColor,
    secondaryTextColor,
    setProp,
    background.globalStyled,
    background.isCustomized,
    backgroundHover.globalStyled,
    backgroundHover.isCustomized,
    borderColor.globalStyled,
    borderColor.isCustomized,
    borderHoverColor.globalStyled,
    borderHoverColor.isCustomized,
    color.globalStyled,
    color.isCustomized,
    colorHover.globalStyled,
    colorHover.isCustomized,
    props.preset,
  ])

  // useEffect(() => {
  //   const currentRef = ref.current
  //   if (currentRef) {
  //     currentRef.addEventListener("input", handleTextChange)
  //   }
  //   return () => {
  //     if (currentRef) {
  //       currentRef.removeEventListener("input", handleTextChange)
  //     }
  //   }
  // }, [handleTextChange])

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

  const handlePropChangeDebounced = useCallback(
    (property, value) => {
      debouncedSetProp(property, value)
    },
    [debouncedSetProp]
  )

  const handleTextChange = useCallback(
    (e) => {
      const value = e.target.value
      if (typeof value === "string") {
        // setLocalText(value)
        handlePropChangeDebounced("text", value)
      }
    },
    [handlePropChangeDebounced]
  )

  return (
    <div
      ref={(el: any) => connect(drag(el))}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
      onMouseOver={() => setDisplayController(true)}
      onMouseOut={() => setDisplayController(false)}
    >
      {displayController && <Controller nameOfComponent={t("Text")} />}
      <div
        className="relative w-full"
        style={{
          background: `${containerBackground}`,
          display: "inline-flex",
          justifyContent: `${justifyContent}`,
          boxSizing: "border-box",
          minWidth: "100%",
          maxWidth: "100%",
          paddingTop: `${props.marginTop}px`,
          paddingBottom: `${props.marginBottom}px`,
          paddingLeft: `${props.marginLeft}px`,
          paddingRight: `${props.marginRight}px`,
        }}
      >
        <StyledCustomTextInput
          fontFamily={primaryFont}
          fontSize={`${fontSize}px`}
          color={color?.value}
          colorHover={colorHover.value}
          radius={radius.value}
          flexDirection={flexDirection}
          fontWeight={fontWeight.value}
          textAlign={textAlign}
          justifyContent={justifyContent}
          borderColor={borderColor.value}
          borderHoverColor={borderHoverColor.value}
          border={0}
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
          size={size}
          buttonSize={buttonSize}
          lineHeight={lineHeight}
          className="user-text-comp"
          {...props}
        >
          <div className="flex flex-col overflow-x-clip">
            {/** @ts-ignore */}
            <ContentEditable
              html={text}
              innerRef={ref}
              style={{
                maxWidth: "787px",
                transitionProperty: "all",
                overflowX: "clip",
                textOverflow: "ellipsis",
                color: `${
                  textColor !== "#ffffff" ? textColor : secondaryTextColor
                }`,
                fontSize: `${fontSize}px`,
                fontWeight: `${fontWeight}`,
                lineHeight: `${lineHeight}px`,
              }}
              className="min-w-16 border-dotted border-transparent leading-relaxed hover:border-blue-500"
              onChange={(e) => {
                handleTextChange(e)
              }}
              tagName="p"
            />
          </div>
        </StyledCustomTextInput>
      </div>
    </div>
  )
}

UserText.craft = {
  props: TextInputDefaultProps,
  related: {
    settings: UserTextInputSettings,
  },
}
