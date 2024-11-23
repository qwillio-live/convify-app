"use client"
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { debounce, throttle } from "lodash"
import { useTranslations } from "next-intl"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useEditor, useNode } from "@/lib/craftjs"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"

import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import { HeadlineTextSettings } from "./headline-text-settings"
import { cn, deserialize, serialize } from "@/lib/utils"
import { TextEditor } from "@/components/TextEditor"

const ContainerWidthValues = {
  small: "520px",
  medium: "647px",
  large: "770px",
  full: "100%",
}

const MobileContainerWidthValues = {
  small: "300px",
  medium: "354px",
  large: "376px",
  full: "100%",
}

const headlineFontSize = {
  mobile: 24,
  desktop: 32,
}

const maxLength = 850

interface StyledCustomHeadlineInput {
  fontFamily?: string
  textColor?: string
  color?: string
  background?: string
  backgroundHover?: string
  text: string
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
  flexDirection?: string
  alignItems?: string
  justifyContent?: string
  border?: number
  borderColor?: string
  borderHoverColor?: string
  mobileScreen: boolean
  fontSize?: string
  fontWeight?: number
  borderRadius?: string
  padding?: string
  preset?: string
  settingsTab?: string
}
// const StyledCustomHeadlineInput = styled.div<StyledCustomHeadlineInput>`
//   font-family: ${(props) => `var(${props?.fontFamily})`};
//   background: ${(props) => `var(${props?.background})`};
//   display: flex;
//   flex-direction: row;
//   position: relative;
//   font-size: ${(props) => `${props?.fontSize}`}px;
//   font-weight: ${(props) => `${props?.fontWeight}`};
//   border: 1px dashed transparent;
//   transition: all 0.2s ease;

//   &:focus {
//     border-color: ${(props) =>
//       props.borderHoverColor}; /* Change to your desired focus border color */
//   }

//   color: ${(props) => `var(${props?.color})`};

//   max-width: ${(props) =>
//     props.mobileScreen
//       ? MobileContainerWidthValues[props.size || "medium"]
//       : ContainerWidthValues[props.size || "medium"]};
//   width: 100%;
//   box-sizing: border-box;
//   height: ${(props) => props.height}px;
//   margin-top: ${(props) => props.marginTop}px;
//   margin-left: ${(props) => props.marginLeft}px;
//   margin-right: ${(props) => props.marginRight}px;
//   margin-bottom: ${(props) => props.marginBottom}px;
//   flex-direction: ${(props) => props.flexDirection};
//   align-items: ${(props) => props.alignItems};
//   justify-content: ${(props) => props.justifyContent};
//   border: ${(props) => props.border}px solid ${(props) => props.borderColor};
//   @media (max-width: 760px) {
//     width: 100%; /* Make the container take the full width on smaller screens */
//     max-width: 600px;
//   }
//   @media (max-width: 660px) {
//     width: 100%; /* Make the container take the full width on smaller screens */
//     max-width: calc(100% - 20px);
//   }
// `

const StyledCustomHeadlineInput = ({
  fontFamily,
  borderHoverColor,
  colorHover,
  background,
  color,
  height,
  marginTop,
  marginLeft,
  marginRight,
  marginBottom,
  fontSize,
  fontWeight,
  flexDirection,
  alignItems,
  justifyContent,
  borderColor,
  border,
  mobileScreen,
  size,
  className,
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLDivElement> & StyledCustomHeadlineInput) => {
  const customStyles: CSSProperties = {
    fontFamily: `var(${fontFamily})`,
    "--user-headline-background": background,
    "--user-headline-size": fontSize,
    fontWeight,
    "--user-headline-border-color": borderColor,
    "--user-headline-border-hover-color": borderHoverColor,
    color,
    "--user-headline-max-width": mobileScreen
      ? MobileContainerWidthValues[size || "medium"]
      : ContainerWidthValues[size || "medium"],
    "--user-headline-height": height === "auto" ? "auto" : `${height}px`,
    "--user-headline-margin-top": `${marginTop}px`,
    "--user-headline-margin-left": `${marginLeft}px`,
    "--user-headline-margin-right": `${marginRight}px`,
    "--user-headline-margin-bottom": `${marginBottom}px`,
    alignItems,
    justifyContent,
    borderWidth: border,
    ...style,
  } as CSSProperties

  return (
    <div
      className={cn(
        "relative box-border flex w-full overflow-hidden border-solid transition-all max-[760px]:max-w-[600px] max-[660px]:max-w-[calc(100%-20px)]",
        fontSize && "text-[var(--user-headline-size)]",
        "max-w-[var(--user-headline-max-width)]",
        background && "bg-[var(--user-headline-background)]",
        marginTop && "mt-[var(--user-headline-margin-top)]",
        marginLeft && "ml-[var(--user-headline-margin-left)]",
        marginRight && "mr-[var(--user-headline-margin-right)]",
        marginBottom && "mb-[var(--user-headline-margin-bottom)]",
        "h-[var(--user-headline-height)]",
        borderColor && "border-[var(--user-headline-border-color)]",
        borderHoverColor &&
          "focus:border-[var(--user-headline-border-hover-color)]",
        `flex-${flexDirection || "row"}`,
        className
      )}
      {...props}
      style={customStyles}
    />
  )
}

export const HeadlineTextGen = ({
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
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  flexDirection,
  alignItems,
  justifyContent,
  fontSize: fontSize,
  fontWeight: fontWeight,
  border,
  borderColor,
  borderHoverColor,
  textColor,
  ...props
}) => {
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const t = useTranslations("Components")

  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )

  const primarycolor = useAppSelector(
    (state) => state.theme?.general?.primaryColor
  )
  const processedText = text
    .replace(/<div><br><\/div>/g, "\n")
    .replace(/<\/?div>/g, "\n") // Replace remaining <div> tags with new lines
    .replace(/<br>/g, "\n") // Replace <br> tags with new lines

  let val
  let computedValue = [
    {
      type: "paragraph",
      children: [{ text: text }],
    },
  ]
  try {
    val = deserialize(text)
    if (Array.isArray(val)) {
      console.log(val, "check")
      computedValue = val
    }
  } catch (e) {
    console.log(e)
  }

  // console.log("container | bg", containerBackground, borderColor)
  return (
    <div
      className="heading-text-comp relative mt-7 w-full"
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
      <StyledCustomHeadlineInput
        fontFamily={primaryFont}
        color={color?.value}
        background={containerBackground}
        backgroundHover={backgroundHover?.value}
        borderHoverColor={borderHoverColor?.value}
        colorHover={colorHover?.value}
        flexDirection={flexDirection}
        fontSize={fontSize}
        fontWeight={fontWeight}
        // textAlign={textAlign?.value}
        justifyContent={justifyContent}
        borderColor={primarycolor}
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
        text={t("HeadlineDescription")}
        {...props}
        className={`!text-[24px] md:text-[${fontSize}px] user-headline-comp items-center`}
        onClick={() => console.log(text)}
      >
        <h1
          style={{
            maxWidth: "100%",
            transitionProperty: "all",
            overflowX: "clip",
            textOverflow: "ellipsis",
            color: `${textColor !== "#ffffff" ? textColor : primaryTextColor}`,
            fontWeight: `${fontWeight.value}`,
            height: "fit-content",
            wordWrap: "break-word",
            lineHeight: `${lineHeight}px`,
          }}
        >
          <TextEditor isReadOnly initValue={computedValue} />
        </h1>
      </StyledCustomHeadlineInput>
    </div>
  )
}

export const HeadlineText = ({
  fontFamily,
  textColor,
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
  containerBackground,
  background,
  backgroundHover,
  colorHover,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  flexDirection,
  alignItems,
  justifyContent,
  border,
  borderColor,
  mobileFontSize,
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
  const t = useTranslations("Components")
  const ref = useRef<HTMLDivElement>(null)
  // const [displayController, setDisplayController] = React.useState(false)
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  // const secondaryTextColor = useAppSelector(
  //   (state) => state.theme?.text?.secondaryColor
  // )
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  // const primaryColor = useAppSelector(
  //   (state) => state.theme?.general?.primaryColor
  // )
  // const secondaryColor = useAppSelector(
  //   (state) => state.theme?.general?.secondaryColor
  // )
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)
  // const screens = useAppSelector((state: RootState) => state?.screen?.screens)
  // const screensLength = useAppSelector(
  //   (state: RootState) => state?.screen?.screens?.length ?? 0
  // )
  // const selectedScreen = useAppSelector(
  //   (state: RootState) => state.screen?.selectedScreen ?? 0
  // )

  // useEffect(() => {
  //   if (fontFamily.globalStyled && !fontFamily.isCustomized) {
  //     setProp((props) => (props.fontFamily.value = primaryFont), 200)
  //   }
  // }, [primaryFont, fontFamily.globalStyled, fontFamily.isCustomized, setProp])

  // useEffect(() => {
  //   if (primaryColor) {
  //     const backgroundPrimaryColor = getBackgroundForPreset(
  //       primaryColor,
  //       props.preset
  //     )
  //     const hoverBackgroundPrimaryColor = getHoverBackgroundForPreset(
  //       primaryColor,
  //       props.preset
  //     )

  //     if (background.globalStyled && !background.isCustomized) {
  //       setProp(
  //         (props) => (props.background.value = backgroundPrimaryColor),
  //         200
  //       )
  //     }
  //     if (color.globalStyled && !color.isCustomized) {
  //       setProp((props) => (props.color.value = primaryTextColor), 200)
  //     }
  //     if (borderColor.globalStyled && !borderColor.isCustomized) {
  //       setProp((props) => (props.borderColor.value = primaryColor), 200)
  //     }

  //     // hover colors

  //     if (backgroundHover.globalStyled && !backgroundHover.isCustomized) {
  //       setProp(
  //         (props) =>
  //           (props.backgroundHover.value = hoverBackgroundPrimaryColor),
  //         200
  //       )
  //     }
  //     if (borderHoverColor.globalStyled && !borderHoverColor.isCustomized) {
  //       setProp((props) => (props.borderHoverColor.value = primaryColor), 200)
  //     }
  //     if (colorHover.globalStyled && !colorHover.isCustomized) {
  //       setProp((props) => (props.colorHover.value = primaryColor), 200)
  //     }
  //   }
  // }, [
  //   primaryColor,
  //   primaryTextColor,
  //   setProp,
  //   background.globalStyled,
  //   background.isCustomized,
  //   backgroundHover.globalStyled,
  //   backgroundHover.isCustomized,
  //   borderColor.globalStyled,
  //   borderColor.isCustomized,
  //   borderHoverColor.globalStyled,
  //   borderHoverColor.isCustomized,
  //   color.globalStyled,
  //   color.isCustomized,
  //   colorHover.globalStyled,
  //   colorHover.isCustomized,
  //   props.preset,
  // ])

  const handleTextChange = (value) => {
    if (typeof value === "string" && value.length) {
      setProp((props) => {
        props.text = value
        console.log("saving text", value)
        return { ...props }
      })
    }
  }

  // const throttledSetProp = useCallback(
  //   throttle((property, value) => {
  //     setProp((prop) => {
  //       prop[property] = value
  //     }, 0)
  //   }, 200), // Throttle to 50ms to 200ms
  //   [setProp]
  // )

  // const handlePropChangeThrottled = (property, value) => {
  //   throttledSetProp(property, value)
  // }

  // const debouncedSetProp = useCallback(
  //   debounce((property, value) => {
  //     setProp((prop) => {
  //       prop[property] = value
  //     }, 0)
  //   }),
  //   [setProp]
  // )

  // const handlePropChangeDebounced = (property, value) => {
  //   debouncedSetProp(property, value)
  // }

  let val
  let finalValue = [
    {
      type: "paragraph",
      children: [{ text: text }],
    },
  ]
  try {
    val = deserialize(text)
    if (Array.isArray(val)) {
      finalValue = val
    }
  } catch (e) {
    console.log(e)
  }
  return (
    <div
      ref={(el: any) => connect(drag(el))}
      className="group/headline flex w-full justify-center"
    >
      <Controller
        className="invisible group-hover/headline:visible"
        nameOfComponent={t("Headline")}
      />
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
        <StyledCustomHeadlineInput
          fontFamily={primaryFont}
          fontSize={`${mobileScreen ? mobileFontSize : fontSize}px`}
          color={color.value}
          colorHover={colorHover.value}
          flexDirection={flexDirection}
          fontWeight={fontWeight.value}
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
          size={size}
          buttonSize={buttonSize}
          {...props}
          text={t("HeadlineDescription")}
        >
          <div className="flex min-h-4 min-w-8 max-w-full flex-col overflow-x-clip">
            {/** @ts-ignore */}
            {/* <ContentEditable
              html={text.replace(/\n/g, "<br>")}
              innerRef={ref}
              style={{
                maxWidth: "960px",
                transitionProperty: "all",
                overflowX: "clip",
                textOverflow: "ellipsis",
                color: `${
                  textColor !== "#ffffff" ? textColor : primaryTextColor
                }`,
                fontSize: `${mobileScreen ? mobileFontSize : fontSize}px`,
                fontWeight: `${fontWeight}`,
              }}
              className="min-w-16 border-dotted border-transparent leading-relaxed hover:border-blue-500"
              onChange={(e) => {
                handleTextChange(e)
              }}
              tagName="h1"
            /> */}
            <div
              style={{
                maxWidth: "960px",
                transitionProperty: "all",
                overflowX: "clip",
                textOverflow: "ellipsis",
                color: `${
                  textColor !== "#ffffff" ? textColor : primaryTextColor
                }`,
                fontSize: `${mobileScreen ? mobileFontSize : fontSize}px`,
                fontWeight: `${fontWeight}`,
              }}
              className="min-w-16 border-dotted border-transparent leading-relaxed hover:border-blue-500"
            >
              <TextEditor
                initValue={finalValue}
                onChange={(val) => {
                  //@ts-ignore
                  handleTextChange(serialize(val))
                }}
              />
            </div>
          </div>
        </StyledCustomHeadlineInput>
      </div>
    </div>
  )
}

export type HeadlineTextProps = {
  fontFamily: StyleProperty
  size: TextContainerSize
  fontSize: number
  fontWeight: string | number
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
  buttonSize: string
  tagType: string
  preset: string
  lineHeight: string | number
  mobileFontSize: number
  textColor?: string
}
export enum TextContainerSize {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

export const HeadlineTextDefaultProps: HeadlineTextProps = {
  lineHeight: 38,
  text: serialize([
    {
      type: "paragraph",
      children: [{ text: "HeadlineDescription" }],
    },
  ]),

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
  marginLeft: 0,
  marginTop: 20,
  marginRight: 0,
  marginBottom: 20,
  fontSize: headlineFontSize.desktop,
  fontWeight: "700",
  paddingLeft: 12,
  paddingTop: "0",
  paddingRight: 12,
  paddingBottom: "0",
  flexDirection: "row",
  alignItems: "center",
  border: 0,
  fullWidth: true,
  tagType: "h1",
  preset: "h2",
  mobileFontSize: 24,
  textColor: "#ffffff",
}

HeadlineText.craft = {
  props: HeadlineTextDefaultProps,
  related: {
    settings: HeadlineTextSettings,
  },
}
