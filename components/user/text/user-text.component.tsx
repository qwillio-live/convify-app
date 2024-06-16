import React, { useCallback, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { track } from "@vercel/analytics/react"
import { set } from "date-fns"
import { debounce, throttle } from "lodash"
import { useTranslations } from "next-intl"
import { darken, rgba } from "polished"
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

const IconButtonMobileSizeValues = {
  small: "300px",
  medium: "330px",
  large: "360px",
  full: "100%",
}

export const UserTextInputGen = ({
  fontFamily,
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
  fontSize: fontSize,
  fontWeight: fontWeight,
  textAlign,
  border,
  borderColor,
  borderHoverColor,
  ...props
}) => {
  return (
    <div
      className="w-full relative"
      style={{
        width: "100%",
        background: `${containerBackground}`,
        display: "flex",
        justifyContent: "center",
        minWidth: "100%",
        maxWidth: "1400px",
        paddingTop: `${props.marginTop}px`,
        paddingBottom: `${props.marginBottom}px`,
        paddingLeft: `${props.marginLeft}px`,
        paddingRight: `${props.marginRight}px`,
      }}
    >
      <StyledCustomTextInput
        fontFamily={fontFamily?.value}
        color={color?.value}
        background={background?.value}
        backgroundHover={backgroundHover?.value}
        borderHoverColor={borderHoverColor?.value}
        colorHover={colorHover?.value}
        flexDirection={flexDirection}
        fontSize={fontSize?.value}
        fontWeight={fontWeight?.value}
        textAlign={textAlign?.value}
        justifyContent={justifyContent}
        borderColor={borderColor?.value}
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
        mobileScreen={false}
        {...props}
        className="text-[1rem]"
        onClick={() => console.log(text)}
      >
        <p
          style={{
            maxWidth: "100%",
            transitionProperty: "all",
            overflowX: "clip",
            textOverflow: "ellipsis",
            color: `${color?.value}`,
            fontSize: `${fontSize}px`,
            fontWeight: `${fontWeight}`,
            fontFamily: `${fontFamily?.value}`,
            height: "fit-content",
            wordWrap: "break-word",
          }}
        >
          {text}
        </p>
      </StyledCustomTextInput>
    </div>
  )
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
  gap?: number
  border?: number
  borderColor?: string
  borderHoverColor?: string
  mobileScreen: boolean
  fontSize?: string
  fontWeight?: string
  textAlign?: string
  borderRadius?: string
  padding?: string
  preset?: string
  settingsTab?: string
}
const StyledCustomTextInput = styled.div<StyleCustomTextContainerProps>`
  font-family: ${(props) => `var(${props?.fontFamily})`};
  background: ${(props) => `var(${props?.background})`};
  display: flex;
  flex-direction: row;
  position: relative;
  gap: 6px;
  font-size: ${(props) => ButtonSizeValues[props.buttonSize || "18px"]};
  font-weight: 400;
  border: 1px dashed transparent;
  transition: all 0.2s ease;

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

  color: ${(props) => `var(${props?.color})`};
  overflow: hidden;
  max-width: ${(props) =>
    props.mobileScreen
      ? IconButtonMobileSizeValues[props.size || "medium"]
      : IconButtonSizeValues[props.size || "medium"]};
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
    width: 100%; /* Make the container take the full width on smaller screens */
    max-width: 600px;
  }
  @media (max-width: 660px) {
    width: 100%; /* Make the container take the full width on smaller screens */
    max-width: 400px;
  }
`

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
  gap,
  border,
  borderColor,
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
  const dispatch = useAppDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const [displayController, setDisplayController] = React.useState(false)
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

  const handleTextChange = useCallback(
    (e) => {
      const value = e.target.innerText
      if (value.length) {
        setProp((props) => (props.text = value))
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
    },
    [text, setProp]
  )

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
  }, [handleTextChange])

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
        <StyledCustomTextInput
          fontFamily={primaryFont}
          fontSize={`${fontSize}px`}
          color={secondaryTextColor}
          colorHover={colorHover.value}
          radius={radius.value}
          flexDirection={flexDirection}
          fontWeight={fontWeight.value}
          textAlign={textAlign}
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
          {...props}
        >
          <div className="flex flex-col max-w-[100%] min-h-[16px] min-w-[32px] overflow-x-clip">
            <ContentEditable
              html={text}
              innerRef={ref}
              style={{
                maxWidth: "783px",
                transitionProperty: "all",
                overflowX: "clip",
                textOverflow: "ellipsis",
                color: `${color?.value}`,
                fontSize: `${fontSize}px`,
                fontWeight: `${fontWeight}`,
              }}
              className="min-w-16 border-transparent leading-relaxed border-dotted hover:border-blue-500"
              onChange={(e) => {
                handleTextChange(e)
              }}
              tagName="div"
            />
          </div>
        </StyledCustomTextInput>
      </div>
    </div>
  )
}

export enum TextContainerSize {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

export type TextInputProps = {
  fontFamily: string
  size: TextContainerSize
  fontSize: number
  fontWeight: StyleProperty
  textAlign: StyleProperty
  containerBackground: string
  background: StyleProperty
  backgroundHover: StyleProperty
  color: StyleProperty
  colorHover: StyleProperty
  text: string
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
  settingsTab: string
  buttonSize: string
}

export const TextInputDefaultProps: TextInputProps = {
  fontFamily: "inherit",
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
  height: "auto",
  size: TextContainerSize.medium,
  buttonSize: "medium",
  text: "Text Content",
  marginLeft: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  fontSize: 18,
  fontWeight: {
    value: "400",
    globalStyled: false,
    isCustomized: false,
  },
  textAlign: {
    value: "left",
    globalStyled: false,
    isCustomized: false,
  },
  paddingLeft: "0",
  paddingTop: "0",
  paddingRight: "0",
  paddingBottom: "0",
  flexDirection: "row",
  alignItems: "center",
  border: 0,
  fullWidth: true,
  preset: "paragraph",
  settingsTab: "design",
}

UserText.craft = {
  props: TextInputDefaultProps,
  related: {
    settings: UserTextInputSettings,
  },
}
