"use client"
import React, { useCallback, useEffect, useRef } from "react"
import ImagePlaceholder from "@/assets/images/default-image.webp"
import {
  Activity,
  Anchor,
  Aperture,
  ArrowRight,
  Disc,
  DollarSign,
  Mountain,
} from "lucide-react"
import { cn } from "@/lib/utils"
import styled from "styled-components"
import { throttle, debounce } from "lodash"
import { useEditor, useNode } from "@/lib/craftjs"
import { Button as CustomButton } from "@/components/ui/button"
import { Controller } from "../settings/controller.component"
import { TextImageSettings } from "./user-textImage.settings"
import { StyleProperty } from "../types/style.types"
import { useAppSelector, useAppDispatch } from "@/lib/state/flows-state/hooks"
import {
  getBackgroundForPreset,
  getHoverBackgroundForPreset,
} from "./useTextImageThemePresets"
import { useTranslations } from "next-intl"
import { RootState } from "@/lib/state/flows-state/store"
import Image from "next/image"
import ContentEditable from "react-contenteditable"

const IconsList = {
  aperture: (props) => <Aperture {...props} />,
  activity: (props) => <Activity {...props} />,
  dollarsign: (props) => <DollarSign {...props} />,
  anchor: (props) => <Anchor {...props} />,
  disc: (props) => <Disc {...props} />,
  mountain: (props) => <Mountain {...props} />,
  arrowright: (props) => <ArrowRight {...props} />,
}

const IconGenerator = ({ icon, size, className = "", ...rest }) => {
  const IconComponent = IconsList[icon]

  if (!IconComponent) {
    return null // or some default icon or error handling
  }

  return (
    <IconComponent className={`shrink-0 ${className}`} size={size} {...rest} />
  )
}

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

export const TextImageComponentPreview = ({
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
  secondaryFontFamily,
  titleFontWeight,
  textFontWeight,
  titleFontSize,
  textFontSize,
  title,
  textColor,
  secTextColor,
  ...props
}) => {
  const t = useTranslations("Components")
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  const secondaryTextColor = useAppSelector(
    (state) => state.theme?.text?.secondaryColor
  )
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const secondaryFont = useAppSelector(
    (state) => state.theme?.text?.secondaryFont
  )
  const handleNavigateToContent = () => {
    // router.push(currentUrlWithHash);
  }

  const fontWeightMap = {
    thin: 100,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  }

  return (
    <div className="flex w-full flex-col items-center justify-between ">
      <Image
        src={ImagePlaceholder.src}
        alt="Text+Image component"
        width={300}
        height={200}
        className="size-full"
      />
      <div className="mt-6 items-start self-start text-start">
        <p
          className="text-[37px] font-bold"
          style={{
            maxWidth: "100%",
            fontWeight: `${fontWeightMap[titleFontWeight]} !important`,
            fontFamily: `var(${primaryFont})`,
            color: textColor !== "#ffffff" ? textColor : primaryTextColor,
            fontSize: `${titleFontSize}px`,
            transitionProperty: "all",
            overflowX: "clip",
            textOverflow: "ellipsis",
          }}
        >
          {t("Title")}
        </p>
        <p
          className="mt-3 text-[17px] font-normal"
          style={{
            maxWidth: "100%",
            fontWeight: fontWeightMap[textFontWeight],
            color:
              secTextColor !== "#ffffff" ? secTextColor : secondaryTextColor,
            fontFamily: `var(${secondaryFont})`,
            fontSize: `${textFontSize}px`,
            transitionProperty: "all",
            overflowX: "clip",
            textOverflow: "ellipsis",
          }}
        >
          {t("This is the Text")}
        </p>
      </div>
    </div>
  )
}

export const TextImageComponentGen = ({
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
  secondaryFontFamily,
  titleFontWeight,
  textFontWeight,
  titleFontSize,
  textFontSize,
  title,
  align,
  verticalGap,
  horizontalGap,
  bothAlign,
  Top,
  Bottom,
  Left,
  Right,
  cornerRadius,
  split,
  position,
  src,
  alt,
  setProp,
  Text,
  textColor,
  secTextColor,
  ...props
}) => {
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  const secondaryTextColor = useAppSelector(
    (state) => state.theme?.text?.secondaryColor
  )
  const ref = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  const handleTextChange = useCallback(
    (e) => {
      const value = e.target.value
      if (typeof value === "string" && value.length) {
        setProp((props) => {
          props.Text = value
          return { ...props }
        })
      }
    },
    [setProp]
  )
  const handleTitleChange = useCallback(
    (e) => {
      const value = e.target.value
      if (typeof value === "string" && value.length) {
        setProp((props) => {
          props.title = value
          return { ...props }
        })
      }
    },
    [setProp]
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

  useEffect(() => {
    const currentRef = titleRef.current
    if (currentRef) {
      currentRef.addEventListener("input", handleTitleChange)
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("input", handleTitleChange)
      }
    }
  }, [handleTitleChange])

  const adjustedSplit = Math.max(1, Math.min(split, 11))
  const textSplit = 12 - adjustedSplit

  const fontWeightMap = {
    thin: 100,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  }

  const mobileVerticalGapStyle = {
    marginBottom: mobileScreen ? `${verticalGap}px` : "0",
  }

  const adjustedHorizontalGap = Math.min(horizontalGap, 100)
  const totalGap = adjustedHorizontalGap * (mobileScreen ? 0 : 1)

  return (
    <div
      style={{
        width:
          size == "small"
            ? "600px"
            : size == "medium"
            ? "800px"
            : size == "large"
            ? "1200px"
            : size == "full"
            ? "1400px"
            : "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
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
        <div
          className={cn(
            `relative flex flex-row justify-${align} w-full border border-transparent`
          )}
        >
          {
            /* eslint-disable-next-line @next/next/no-img-element */
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                gap: !mobileScreen
                  ? `${adjustedHorizontalGap}px`
                  : `${verticalGap}px`,
                marginLeft: `${Left}px`,
                marginRight: `${Right}px`,
                marginTop: `${Top}px`,
                marginBottom: `${Bottom}px`,
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              {position === "left" ? (
                <>
                  <div
                    style={{
                      flex: `0 0 calc(${(adjustedSplit / 12) * 100}% - ${
                        totalGap / 2
                      }px)`,
                      maxWidth: `calc(${(adjustedSplit / 12) * 100}% - ${
                        totalGap / 2
                      }px)`,
                      alignSelf: `${bothAlign}`,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      alt={alt}
                      src={src}
                      style={{
                        width: width === "medium" ? "90%" : width,
                        height: height,
                        borderRadius: `${cornerRadius}px`,
                        backgroundColor: background,
                      }}
                    />
                  </div>
                  <div
                    className={`items-center text-start`}
                    style={{
                      flex: `0 0 calc(${(textSplit / 12) * 100}% - ${
                        totalGap / 2
                      }px)`,
                      maxWidth: `calc(${(textSplit / 12) * 100}% - ${
                        totalGap / 2
                      }px)`,
                      marginTop: bothAlign == "start" ? "20px" : "",
                      alignSelf: `${bothAlign}`,
                    }}
                  >
                    {/** @ts-ignore */}
                    {/** @ts-ignore */}
                    <ContentEditable
                      html={title}
                      innerRef={titleRef}
                      disabled={true}
                      style={{
                        maxWidth: "100%",
                        fontWeight: `${fontWeightMap[titleFontWeight]}`,
                        fontFamily: `var(${fontFamily.value})`,
                        color:
                          textColor !== "#ffffff"
                            ? textColor
                            : primaryTextColor,
                        fontSize: `${titleFontSize}px`,
                        transitionProperty: "all",
                        overflowX: "clip",
                        textOverflow: "ellipsis",
                      }}
                      onChange={(e) => {
                        handleTitleChange(e)
                      }}
                      tagName="h1"
                    />
                    {/** @ts-ignore */}
                    {/** @ts-ignore */}
                    <ContentEditable
                      html={Text}
                      innerRef={ref}
                      disabled={true}
                      style={{
                        maxWidth: "100%",
                        fontWeight: fontWeightMap[textFontWeight],
                        color:
                          secTextColor !== "#ffffff"
                            ? secTextColor
                            : secondaryTextColor,
                        marginTop: "15px",
                        fontFamily: `var(${secondaryFontFamily.value})`,
                        fontSize: `${textFontSize}px`,
                        transitionProperty: "all",
                        overflowX: "clip",
                        textOverflow: "ellipsis",
                      }}
                      onChange={(e) => {
                        handleTextChange(e)
                      }}
                      tagName="div"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`items-start self-center text-start`}
                    style={{
                      flex: `0 0 calc(${(textSplit / 12) * 100}% - ${
                        totalGap / 2
                      }px)`,
                      maxWidth: `calc(${(textSplit / 12) * 100}% - ${
                        totalGap / 2
                      }px)`,
                      marginTop: bothAlign == "start" ? "20px" : "",
                      alignSelf: `${bothAlign}`,
                    }}
                  >
                    {/** @ts-ignore */}
                    {/** @ts-ignore */}
                    <ContentEditable
                      html={title}
                      innerRef={titleRef}
                      disabled={true}
                      style={{
                        maxWidth: "100%",
                        fontWeight: `${fontWeightMap[titleFontWeight]}`,
                        fontFamily: `var(${fontFamily.value})`,
                        color:
                          textColor !== "#ffffff"
                            ? textColor
                            : primaryTextColor,
                        fontSize: `${titleFontSize}px`,
                        transitionProperty: "all",
                        overflowX: "clip",
                        textOverflow: "ellipsis",
                      }}
                      onChange={(e) => {
                        handleTitleChange(e)
                      }}
                      tagName="h1"
                    />
                    {/** @ts-ignore */}
                    {/** @ts-ignore */}
                    <ContentEditable
                      html={Text}
                      innerRef={ref}
                      disabled={true}
                      style={{
                        maxWidth: "100%",
                        transitionProperty: "all",
                        marginTop: "15px",
                        fontSize: `${textFontSize}px`,
                        color:
                          secTextColor !== "#ffffff"
                            ? secTextColor
                            : secondaryTextColor,
                        fontWeight: fontWeightMap[textFontWeight],
                        fontFamily: `var(${secondaryFontFamily.value})`,
                        overflowX: "clip",
                        textOverflow: "ellipsis",
                      }}
                      onChange={(e) => {
                        handleTextChange(e)
                      }}
                      tagName="div"
                    />
                  </div>
                  <div
                    style={{
                      flex: `0 0 calc(${(adjustedSplit / 12) * 100}% - ${
                        totalGap / 2
                      }px)`,
                      maxWidth: `calc(${(adjustedSplit / 12) * 100}% - ${
                        totalGap / 2
                      }px)`,
                      alignSelf: `${bothAlign}`,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      alt={alt}
                      src={src}
                      style={{
                        width: width === "medium" ? "90%" : width,
                        height: height,
                        borderRadius: `${cornerRadius}px`,
                        backgroundColor: background,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
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
  cornerRadius,
  align,
  width = "85%",
  height,
  src,
  Top,
  Left,
  Bottom,
  split,
  setProp,
  size,
  Text,
  title,
  position,
  Right,
  fontFamily,
  color,
  bothAlign,
  disabled,
  horizontalGap,
  verticalGap,
  titleFontSize,
  textFontSize,
  titleFontWeight,
  textFontWeight,
  secondaryFontFamily,
  secTextColor,
  textColor,
  ...props
}) => {
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  const secondaryTextColor = useAppSelector(
    (state) => state.theme?.text?.secondaryColor
  )
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const secondaryFont = useAppSelector(
    (state) => state.theme?.text?.secondaryFont
  )
  const t = useTranslations("Components")
  const ref = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  const handleTextChange = useCallback(
    (e) => {
      const value = e.target.value
      if (typeof value === "string" && value.length) {
        setProp((props) => {
          props.Text = value
          return { ...props }
        })
      }
    },
    [setProp]
  )
  const handleTitleChange = useCallback(
    (e) => {
      const value = e.target.value
      if (typeof value === "string" && value.length) {
        setProp((props) => {
          props.title = value
          return { ...props }
        })
      }
    },
    [setProp]
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

  useEffect(() => {
    const currentRef = titleRef.current
    if (currentRef) {
      currentRef.addEventListener("input", handleTitleChange)
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("input", handleTitleChange)
      }
    }
  }, [handleTitleChange])

  useEffect(() => {
    if (fontFamily.globalStyled && !fontFamily.isCustomized) {
      setProp((props) => (props.fontFamily.value = primaryFont), 200)
    }
  }, [primaryFont])

  useEffect(() => {
    if (secondaryFontFamily.globalStyled && !secondaryFontFamily.isCustomized) {
      setProp((props) => (props.secondaryFontFamily.value = secondaryFont), 200)
    }
  }, [secondaryFont])

  const adjustedSplit = Math.max(1, Math.min(split, 11))
  const textSplit = 12 - adjustedSplit

  const fontWeightMap = {
    thin: 100,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  }

  const mobileVerticalGapStyle = {
    marginBottom: mobileScreen ? `${verticalGap}px` : "0",
  }

  const adjustedHorizontalGap = Math.min(horizontalGap, 100)
  const totalGap = adjustedHorizontalGap * (mobileScreen ? 0 : 1)
  const availableWidth = `calc(100% - ${totalGap}px)`

  return (
    <div
      style={{
        display: "flex",
        flexDirection: mobileScreen ? "column" : "row",
        width: "100%",
        gap: !mobileScreen ? `${adjustedHorizontalGap}px` : `${verticalGap}px`,
        marginLeft: `${Left}px`,
        marginRight: `${Right}px`,
        marginTop: `${Top}px`,
        marginBottom: `${Bottom}px`,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {!mobileScreen ? (
        position === "left" ? (
          <>
            <div
              style={{
                flex: `0 0 calc(${(adjustedSplit / 12) * 100}% - ${
                  totalGap / 2
                }px)`,
                maxWidth: `calc(${(adjustedSplit / 12) * 100}% - ${
                  totalGap / 2
                }px)`,
                alignSelf: `${bothAlign}`,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                alt={alt}
                src={src}
                style={{
                  width: width === "medium" ? "90%" : width,
                  height: height,
                  borderRadius: `${cornerRadius}px`,
                  backgroundColor: background,
                }}
              />
            </div>
            <div
              className={`items-center text-start`}
              style={{
                flex: `0 0 calc(${(textSplit / 12) * 100}% - ${
                  totalGap / 2
                }px)`,
                maxWidth: `calc(${(textSplit / 12) * 100}% - ${
                  totalGap / 2
                }px)`,
                alignSelf: `${bothAlign}`,
              }}
            >
              {/** @ts-ignore */}
              {/** @ts-ignore */}
              <ContentEditable
                html={title}
                innerRef={titleRef}
                style={{
                  maxWidth: "100%",
                  fontWeight: `${fontWeightMap[titleFontWeight]}`,
                  fontFamily: `var(${fontFamily.value})`,
                  color: textColor !== "#ffffff" ? textColor : primaryTextColor,
                  fontSize: `${titleFontSize}px`,
                  transitionProperty: "all",
                  overflowX: "clip",
                  textOverflow: "ellipsis",
                }}
                onChange={(e) => {
                  handleTitleChange(e)
                }}
                tagName="h1"
              />
              {/** @ts-ignore */}
              {/** @ts-ignore */}
              <ContentEditable
                html={Text}
                innerRef={ref}
                disabled={disabled}
                style={{
                  maxWidth: "100%",
                  fontWeight: fontWeightMap[textFontWeight],
                  color:
                    secTextColor !== "#ffffff"
                      ? secTextColor
                      : secondaryTextColor,
                  fontFamily: `var(${secondaryFontFamily.value})`,
                  fontSize: `${textFontSize}px`,
                  transitionProperty: "all",
                  overflowX: "clip",
                  textOverflow: "ellipsis",
                }}
                onChange={(e) => {
                  handleTextChange(e)
                }}
                tagName="div"
              />
            </div>
          </>
        ) : (
          <>
            <div
              className={`items-start self-center text-start`}
              style={{
                flex: `0 0 calc(${(textSplit / 12) * 100}% - ${
                  totalGap / 2
                }px)`,
                maxWidth: `calc(${(textSplit / 12) * 100}% - ${
                  totalGap / 2
                }px)`,
                alignSelf: `${bothAlign}`,
              }}
            >
              {/** @ts-ignore */}
              {/** @ts-ignore */}
              <ContentEditable
                html={title}
                innerRef={titleRef}
                disabled={disabled}
                style={{
                  maxWidth: "100%",
                  fontWeight: `${fontWeightMap[titleFontWeight]}`,
                  fontFamily: `var(${fontFamily.value})`,
                  color: textColor !== "#ffffff" ? textColor : primaryTextColor,
                  fontSize: `${titleFontSize}px`,
                  transitionProperty: "all",
                  overflowX: "clip",
                  textOverflow: "ellipsis",
                }}
                onChange={(e) => {
                  handleTitleChange(e)
                }}
                tagName="h1"
              />
              {/** @ts-ignore */}
              {/** @ts-ignore */}
              <ContentEditable
                html={Text}
                innerRef={ref}
                disabled={disabled}
                style={{
                  maxWidth: "100%",
                  transitionProperty: "all",
                  fontSize: `${textFontSize}px`,
                  color:
                    secTextColor !== "#ffffff"
                      ? secTextColor
                      : secondaryTextColor,
                  fontWeight: fontWeightMap[textFontWeight],
                  fontFamily: `var(${secondaryFontFamily.value})`,
                  overflowX: "clip",
                  textOverflow: "ellipsis",
                }}
                onChange={(e) => {
                  handleTextChange(e)
                }}
                tagName="div"
              />
            </div>
            <div
              style={{
                flex: `0 0 calc(${(adjustedSplit / 12) * 100}% - ${
                  totalGap / 2
                }px)`,
                maxWidth: `calc(${(adjustedSplit / 12) * 100}% - ${
                  totalGap / 2
                }px)`,
                alignSelf: `${bothAlign}`,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                alt={alt}
                src={src}
                style={{
                  width: width === "medium" ? "90%" : width,
                  height: height,
                  borderRadius: `${cornerRadius}px`,
                  backgroundColor: background,
                }}
              />
            </div>
          </>
        )
      ) : (
        <>
          <div style={{ ...mobileVerticalGapStyle }}>
            <img
              alt={alt}
              src={src}
              style={{
                width: width === "medium" ? "85%" : width,
                height: height,
                borderRadius: `${cornerRadius}px`,
                backgroundColor: background,
                marginLeft: `${Left}px`,
                marginRight: `${Right}px`,
                marginTop: `${Top}px`,
                marginBottom: `${Bottom}px`,
              }}
            />
          </div>
          <div className="m-auto w-[85%] items-start self-center text-start">
            {/** @ts-ignore */}
            {/** @ts-ignore */}
            <ContentEditable
              html={title}
              innerRef={titleRef}
              disabled={disabled}
              style={{
                maxWidth: "100%",
                fontSize: `${titleFontSize}px`,
                color: primaryTextColor,
                fontWeight: `${fontWeightMap[titleFontWeight]}`,
                fontFamily: `var(${fontFamily.value})`,
                transitionProperty: "all",
                overflowX: "clip",
                textOverflow: "ellipsis",
              }}
              onChange={(e) => {
                handleTitleChange(e)
              }}
              tagName="h1"
            />
            {/** @ts-ignore */}
            {/** @ts-ignore */}
            <ContentEditable
              html={Text}
              innerRef={ref}
              disabled={disabled}
              style={{
                maxWidth: "100%",
                fontSize: `${textFontSize}px`,
                color: secondaryTextColor,
                fontWeight: fontWeightMap[textFontWeight],
                fontFamily: `var(${secondaryFontFamily.value})`,
                transitionProperty: "all",
                overflowX: "clip",
                textOverflow: "ellipsis",
              }}
              className={`min-w-16 border-dotted border-transparent leading-relaxed hover:border-blue-500`}
              onChange={(e) => {
                handleTextChange(e)
              }}
              tagName="div"
            />
          </div>
        </>
      )}
    </div>
  )
}

export const TextImageComponent = ({
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
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  border,
  borderColor,
  buttonAction,
  position,
  split,
  nextScreen,
  bothAlign,
  title,
  horizontalGap,
  verticalGap,
  cornerRadius,
  titleFontSize,
  textFontSize,
  titleFontWeight,
  textFontWeight,
  uploadedImageUrl,
  uploadedImageMobileUrl,
  secondaryFontFamily,
  textColor,
  secTextColor,
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
  const screens = useAppSelector((state: RootState) => state?.screen?.screens)
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
    const handleResize = () => {
      if (mobileScreen && size == "small") {
        setProp(
          (props) => ((props.width = "85%"), (props.size = "small")),
          1000
        )
      } else if (mobileScreen && size == "medium") {
        setProp(
          (props) => ((props.width = "85%"), (props.size = "medium")),
          1000
        )
      } else if (mobileScreen && size == "large") {
        setProp(
          (props) => ((props.width = "85%"), (props.size = "large")),
          1000
        )
      } else if (mobileScreen && size == "full") {
        setProp((props) => ((props.width = "90%"), (props.size = "full")), 1000)
      } else if (!mobileScreen && size == "small") {
        setProp(
          (props) => ((props.width = "80%"), (props.size = "small")),
          1000
        )
      } else if (!mobileScreen && size == "medium") {
        setProp(
          (props) => ((props.width = "90%"), (props.size = "medium")),
          1000
        )
      } else if (!mobileScreen && size == "large") {
        setProp(
          (props) => ((props.width = "95%"), (props.size = "large")),
          1000
        )
      } else if (!mobileScreen && size == "full") {
        setProp(
          (props) => ((props.width = "100%"), (props.size = "full")),
          1000
        )
      }
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [mobileScreen, size])

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
    if (mobileScreen && uploadedImageMobileUrl) {
      setProp((props) => (props.src = uploadedImageMobileUrl), 1000)
    } else if (!mobileScreen && uploadedImageUrl) {
      setProp((props) => (props.src = uploadedImageUrl), 1000)
    }
  }, [mobileScreen])

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
    } else {
      if (ref.current) {
        e.target.innerText = text || ""
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(ref.current)
        range.collapse(false)
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
      onMouseOver={() => setDisplayController(true)}
      onMouseOut={() => setDisplayController(false)}
    >
      {displayController && <Controller nameOfComponent={t("Text & Image")} />}
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
        <div
          ref={(ref: any) => connect(drag(ref))}
          className={cn(
            `relative flex flex-row justify-${align} w-full border border-transparent`
          )}
        >
          {
            /* eslint-disable-next-line @next/next/no-img-element */
            <UserLogo
              fontFamily={fontFamily}
              color={color}
              setProp={setProp}
              size={size}
              Text={text}
              title={title}
              disabled={disabled}
              alt={alt}
              verticalGap={verticalGap}
              titleFontSize={titleFontSize}
              secondaryFontFamily={secondaryFontFamily}
              titleFontWeight={titleFontWeight}
              textFontWeight={textFontWeight}
              textFontSize={textFontSize}
              horizontalGap={horizontalGap}
              bothAlign={bothAlign}
              marginTop={marginTop}
              marginBottom={marginBottom}
              marginLeft={marginLeft}
              marginRight={marginRight}
              Top={Top}
              Bottom={Bottom}
              Left={Left}
              Right={Right}
              background={background}
              radius={radius}
              cornerRadius={cornerRadius}
              align={align}
              width={width}
              split={split}
              height={height}
              position={position}
              src={src}
              textColor={textColor}
              secTextColor={secTextColor}
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
  secondaryFontFamily: StyleProperty
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
  Top: number
  Bottom: number
  Left: number
  Right: number
  width: string | number
  height: string | number
  fullWidth: boolean
  preset: string
  imageSize: number
  settingsTab: string
  buttonSize: string
  cornerRadius: number
  split: number
  position: string
  tracking: boolean
  trackingEvent: string
  buttonAction: "next-screen" | "custom-action" | "none"
  nextScreen: string
  bothAlign: string
  verticalGap: number
  horizontalGap: number
  titleFontSize: number
  titleFontWeight: string
  textFontWeight: string
  textFontSize: number
  uploadedImageUrl: string
  uploadedImageMobileUrl: string
  textColor?: string
  secTextColor?: string
}

export const TextImageDefaultProps: IconButtonProps = {
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  secondaryFontFamily: {
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
  url: "https://convify.io",
  src: ImagePlaceholder.src,
  disabled: false,
  enableLink: false,
  width: "90%",
  height: "auto",
  size: IconButtonSizes.medium,
  imageSize: 90,
  cornerRadius: 10,
  buttonSize: "medium",
  time: 2,
  text: "Get quote",
  Top: 20,
  Bottom: 20,
  Left: 20,
  Right: 20,
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
  position: "left",
  gap: 4,
  border: 0,
  fullWidth: true,
  preset: "filled",
  settingsTab: "content",
  tracking: false,
  trackingEvent: "button_clicked",
  nextScreen: "",
  split: 6,
  buttonAction: "next-screen",
  bothAlign: "start",
  horizontalGap: 20,
  verticalGap: 10,
  titleFontSize: 32,
  titleFontWeight: "bold",
  textFontWeight: "normal",
  textFontSize: 17,
  uploadedImageUrl: "",
  uploadedImageMobileUrl: "",
  textColor: "#ffffff",
  secTextColor: "#ffffff",
}

TextImageComponent.craft = {
  props: TextImageDefaultProps,
  related: {
    settings: TextImageSettings,
  },
}
