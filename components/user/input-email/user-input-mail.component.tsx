"use client"
import React, { useEffect, useRef, useState } from "react"
import icons from "@/constant/streamline.json"
import {
  Activity,
  Anchor,
  Aperture,
  ArrowRight,
  Disc,
  DollarSign,
  Mail,
  Mountain,
  Phone,
  X,
} from "lucide-react"
import hexoid from "hexoid"
import { useTranslations } from "next-intl"
import { rgba } from "polished"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useEditor, useNode } from "@/lib/craftjs"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import { Input } from "@/components/input-custom"

import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import { UserInputMailSettings } from "./user-input-mail-settings.component"
import {
  setPreviewScreenData,
  setUpdateFilledCount,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"

const ICONSTYLES =
  "p-2 w-9 text-gray-400 h-9 shrink-0 focus-visible:ring-0 focus-visible:ring-transparent"

const IconsList = {
  aperture: <Aperture className={ICONSTYLES} />,
  activity: <Activity className={ICONSTYLES} />,
  dollarsign: <DollarSign className={ICONSTYLES} />,
  anchor: <Anchor className={ICONSTYLES} />,
  disc: <Disc className={ICONSTYLES} />,
  mountain: <Mountain className={ICONSTYLES} />,
  arrowright: <ArrowRight className={ICONSTYLES} />,
  phone: <Phone className={ICONSTYLES} />,
  x: <X className={cn(ICONSTYLES, "text-[#cc0000]")} />,
  mail: <Mail className={ICONSTYLES} />,
}

export enum UserInputSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

const UserInputSizeValues = {
  small: "260px",
  medium: "376px",
  large: "576px",
  full: "100%",
}

const UserInputMobileSizeValues = {
  small: "300px",
  medium: "354px",
  large: "376px",
  full: "100%",
}

export type UserInputMailProps = {
  inputValue: string
  fontSize: number
  textColor: string
  fontWeight: string
  marginLeft: number
  marginRight: number
  marginTop: number
  width: number
  marginBottom: number
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  paddingBottom: number
  backgroundColor?: string
  backgroundImage?: string
  backgroundRepeat?: string
  backgroundPosition?: string
  backgroundSize?: string
  borderColor: StyleProperty
  activeBorderColor: StyleProperty
  primaryFont: StyleProperty
  secondaryFont: StyleProperty
  borderWidth: number
  borderTopWidth: number
  borderBottomWidth: number
  borderLeftWidth: number
  borderRightWidth: number
  borderRadius: number
  topLeftRadius: number
  topRightRadius: number
  bottomLeftRadius: number
  bottomRightRadius: number
  isActive: boolean
  fullWidth: boolean
  size: UserInputSizes
  inputRequired: boolean
  label: string
  placeholder: string
  fieldName: string
  floatingLabel: boolean
  enableIcon: boolean
  icon: string
  preset: string
  error: boolean
  errorText: string
  errorIcon: string
  errorStyles: {
    borderColor: string
    backgroundColor: string
    textColor: string
    topLeftRadius: number
    topRightRadius: number
    bottomLeftRadius: number
    bottomRightRadius: number
  }
  settingsTab: string
  id: string
}
export const UserInputMailDefaultProps: UserInputMailProps = {
  inputValue: "",
  fontSize: 16,
  textColor: "#000",
  width: 366,
  fontWeight: "normal",
  marginLeft: 0,
  marginRight: 0,
  marginTop: 20,
  marginBottom: 20,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  placeholder: "Placeholder",
  backgroundColor: "#fff",
  borderColor: {
    value: "#eaeaeb",
    globalStyled: false,
    isCustomized: false,
  },
  activeBorderColor: {
    value: "#4050ff",
    globalStyled: true,
    isCustomized: false,
  },
  primaryFont: {
    value: "--font-heading",
    globalStyled: true,
    isCustomized: false,
  },
  secondaryFont: {
    value: "--font-inter",
    globalStyled: true,
    isCustomized: false,
  },
  borderWidth: 1,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderLeftWidth: 1,
  borderRightWidth: 1,
  borderRadius: 8,
  topLeftRadius: 8,
  topRightRadius: 8,
  bottomLeftRadius: 8,
  bottomRightRadius: 8,
  isActive: false,
  inputRequired: false,
  fullWidth: true,
  size: UserInputSizes.medium,
  label: "Email",
  fieldName: "Email",
  floatingLabel: false,
  enableIcon: true,
  icon: "arrowright",
  preset: "outlined",
  error: false,
  errorText: "Please specify an answer",
  errorIcon: "x",
  errorStyles: {
    borderColor: "#cc0000",
    textColor: "#cc0000",
    backgroundColor: rgba("#cc0000", 0.1),
    topLeftRadius: 0,
    topRightRadius: 0,
    bottomLeftRadius: 8,
    bottomRightRadius: 8,
  },
  settingsTab: "content",
  id: `input-${hexoid(6)()}`,
}

interface StyledUserInputMailProps {
  textColor: string
  width: number
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
  topLeftRadius: number
  topRightRadius: number
  bottomLeftRadius: number
  bottomRightRadius: number
  borderTopWidth: number
  borderBottomWidth: number
  borderLeftWidth: number
  borderRightWidth: number
  primaryFont: string
  size: UserInputSizes
  error: boolean
}

const UserInputMailStyled = styled(Input)<StyledUserInputMailProps>`
  color: ${(props) => props.textColor};
  max-width: 100%;
  min-height: 50px;
  background-color: "#fff";
  font-family: ${(props) => `var(${props?.primaryFont})`};
  border-top-right-radius: ${(props) => props.topRightRadius}px;
  border-top-left-radius: ${(props) => props.topLeftRadius}px;
  border-bottom-right-radius: ${(props) =>
    props.error ? 0 : props.bottomRightRadius}px;
  border-bottom-left-radius: ${(props) =>
    props.error ? 0 : props.bottomLeftRadius}px;
  border-color: ${(props) => (props.error ? "#cc0000" : props.borderColor)};
  border-top-width: ${(props) => props.borderTopWidth}px;
  border-bottom-width: ${(props) => props.borderBottomWidth}px;
  border-left-width: ${(props) => props.borderLeftWidth}px;
  border-right-width: ${(props) => props.borderRightWidth}px;
  align-self: center;
`

const convertToSvg = (svgBody) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20"viewBox="-4.5 -5.5 24 24" width="33.5"
  height="33.5">${svgBody}</svg>`
}

export const UserInputMailGen = ({ ...props }) => {
  const [inputValue, setInputValue] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(props.error)
  const t = useTranslations("Components")
  const [isFilled, setIsFilled] = useState(false)
  const dispatch = useAppDispatch()
  const fullScreenData = useAppSelector((state) => {
    const screenData =
      state.screen?.screens[state.screen?.selectedScreen]?.screenData

    // Check if screenData is a string before parsing
    return screenData ? JSON.parse(screenData) : {}
  })

  const alarm = useAppSelector(
    (state) => state.screen?.screens[state?.screen?.selectedScreen]?.alarm
  )
  const requ = useAppSelector((state) => {
    const screenData =
      state.screen?.screens[state.screen?.selectedScreen]?.screenData

    // Check if screenData is a string before parsing
    return screenData ? JSON.parse(screenData) : {}
  })

  const isRequired =
    (requ[props.nodeId] && requ[props.nodeId]?.props?.inputRequired) || false
  const screenData = fullScreenData[props.nodeId]?.props.inputValue
  useEffect(() => {
    setInputValue(screenData)
    if (inputRef.current) {
      inputRef.current.value = screenData
    }
    if (screenData !== "") {
      setIsFilled(true)
    }
  }, [screenData])
  console.log("iin user email", typeof screenData, screenData, isFilled)
  const primaryTextColor = useAppSelector(
    (state) => state?.theme?.text?.primaryColor
  )

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }
  const counttt = useAppSelector(
    (state) =>
      state.screen?.screens[state.screen.selectedScreen]?.errorCount || 0
  )
  const itemRefNew = useRef<HTMLDivElement | null>(null)
  const shakeItem = () => {
    const currentItem = itemRefNew.current // Store the current reference for null check
    if (currentItem) {
      currentItem.classList.add("shake")
      // Remove the class after animation ends
      const removeShake = () => {
        currentItem.classList.remove("shake")
        currentItem.removeEventListener("animationend", removeShake)
      }
      currentItem.addEventListener("animationend", removeShake)
    }
  }
  useEffect(() => {
    if (alarm && !isFilled && isRequired) {
      shakeItem() // Call shake function when alarm is updated
    }
  }, [counttt]) // Depend on alarm state
  return (
    <div
      ref={itemRefNew}
      className="relative focus-visible:ring-0 focus-visible:ring-transparent"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="relative w-full transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent"
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: `${
            props.backgroundImage ? "transparent" : props.backgroundColor
          }`,
          minWidth: "100%",
          paddingTop: `${props.marginTop}px`,
          paddingBottom: `${props.marginBottom}px`,
          paddingLeft: `${props.marginLeft}px`,
          paddingRight: `${props.marginRight}px`,
        }}
      >
        <div
          className="relative overflow-hidden focus-visible:ring-0 focus-visible:ring-transparent"
          style={{
            width: `${UserInputSizeValues[props.size]}`,
          }}
        >
          {!props.floatingLabel && (
            <>
              <div
                className={`relative mb-1 transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent`}
                style={{
                  fontFamily: `var(${props.primaryFont.value})`,
                  color: `${primaryTextColor}`,
                  minWidth: `${UserInputSizeValues[props.size]}`,
                  width: `${UserInputSizeValues[props.size]}`,
                }}
              >
                {props.label}
              </div>
            </>
          )}
          {props.floatingLabel && (
            <div
              onClick={() => {
                if (props.floatingLabel) {
                  setIsActive(true)
                  setIsFocused(true)
                  focusInput() // Focus the input when placeholder is clicked
                }
              }}
              className={`absolute line-clamp-1  text-ellipsis transition-all duration-200 ease-in-out hover:cursor-text focus-visible:ring-0 focus-visible:ring-transparent ${
                (isActive && props.floatingLabel) ||
                (inputValue?.length > 0 && props.floatingLabel)
                  ? "top-0 pl-3 pt-1 text-sm text-gray-400"
                  : "left-0 top-1 px-3 pb-1 pt-3 text-sm text-gray-400"
              } ${
                props.floatingLabel &&
                props.enableIcon &&
                "left-[49px]" /**was left-12 but care for a single pixel */
              }

      `}
              style={{
                fontFamily: `var(${props.primaryFont.value})`,
                color: `#9CA3AF`,
                // minWidth: `${UserInputSizeValues[props.size]}`,
                // width: `${UserInputSizeValues[props.size]}`,
              }}
            >
              {props.floatingLabel && props.label}
            </div>
          )}

          <div className="field-container flex w-auto flex-row items-center gap-0 transition-all duration-200 focus-visible:ring-0 focus-visible:ring-transparent">
            {props.enableIcon && (
              <div
                className={cn(
                  `flex min-h-[50px] min-w-[49px] shrink-0 items-center justify-center rounded-l-md bg-inherit shadow-none transition-all duration-200
                  ${!isFilled && alarm && isRequired && "!border-red-600"}
                  `
                )}
                style={{
                  backgroundColor: "#fff",
                  borderColor:
                    !isFilled && alarm && isRequired
                      ? "#cc0000"
                      : isActive
                      ? props.activeBorderColor.value
                      : props.borderColor.value,
                  borderBottomLeftRadius:
                    !isFilled && alarm && isRequired
                      ? 0
                      : props.bottomLeftRadius,
                  borderTopLeftRadius: props.topLeftRadius,
                  borderTopWidth: props.borderTopWidth,
                  borderBottomWidth: props.borderBottomWidth,
                  borderLeftWidth: props.borderLeftWidth,
                  borderRightWidth: 0,
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: convertToSvg(icons[props.icon]?.body),
                  }}
                  style={{
                    color: `#505051`,
                  }}
                />
              </div>
            )}
            <UserInputMailStyled
              // ref={inputRef}
              value={inputValue}
              textColor={props.textColor}
              backgroundColor={props.backgroundColor}
              borderColor={
                isActive
                  ? props.activeBorderColor.value
                  : props.borderColor.value
              }
              error={!isFilled && alarm && isRequired}
              primaryFont={props.primaryFont.value}
              placeholder={!props.floatingLabel && props.placeholder}
              borderWidth={props.borderWidth}
              borderTopWidth={props.borderTopWidth}
              borderBottomWidth={props.borderBottomWidth}
              borderLeftWidth={props.borderLeftWidth}
              borderRightWidth={props.borderRightWidth}
              borderRadius={props.borderRadius}
              topLeftRadius={props.enableIcon ? 0 : props.topLeftRadius}
              topRightRadius={props.topRightRadius}
              bottomLeftRadius={props.enableIcon ? 0 : props.bottomLeftRadius}
              bottomRightRadius={props.bottomRightRadius}
              width={props.width}
              size={props.size}
              onFocus={() => setIsActive(true)}
              className={cn(
                {
                  "px-3 pb-4 pt-8 text-base font-semibold placeholder:font-light placeholder:text-gray-400":
                    props.floatingLabel,
                  "px-3 py-6 text-base font-semibold placeholder:font-light placeholder:text-gray-400":
                    !props.floatingLabel,
                  "rounded-l-none": props.enableIcon,
                },
                `ring-opacity-0/0
                bg-white
                outline-none
                ring-0
                transition-all
                duration-200
                ease-in-out
                focus-visible:outline-none
                focus-visible:ring-0
                focus-visible:ring-transparent
                focus-visible:ring-offset-0 peer-focus-visible:outline-none
                ${!isFilled && alarm && isRequired && "!border-red-600"}
                `
              )}
              onChange={(e) => {
                if (isRequired) {
                  if (isFilled && e.target.value === "") {
                    dispatch(setUpdateFilledCount(-1))
                    setIsFilled(false)
                    setInputValue(e.target.value)
                  } else {
                    if (!isFilled) dispatch(setUpdateFilledCount(1))
                    setInputValue(e.target.value),
                      dispatch(
                        setPreviewScreenData({
                          nodeId: props.nodeId,
                          isArray: false,
                          entity: "inputValue",
                          newSelections: [e.target.value],
                        })
                      ),
                      setIsFilled(true)
                  }
                } else {
                  setInputValue(e.target.value),
                    dispatch(
                      setPreviewScreenData({
                        nodeId: props.nodeId,
                        isArray: false,
                        entity: "inputValue",
                        newSelections: [e.target.value],
                      })
                    )
                }
              }}
              onBlur={() => setIsActive(false)}
              autoFocus={isFocused}
            />
          </div>
          {/** End field container */}

          {/** Error container */}
          {alarm && !isFilled && isRequired && (
            <div
              className="error-container shake mt-0 flex flex-row items-center gap-0 border"
              style={{
                fontFamily: `var(${props.secondaryFont.value})`,
                borderColor: props.errorStyles.borderColor,
                backgroundColor: props.errorStyles.backgroundColor,
                color: props.errorStyles.textColor,
                borderTopWidth: 0,
                borderTopLeftRadius: props.errorStyles.topLeftRadius,
                borderTopRightRadius: props.errorStyles.topRightRadius,
                borderBottomLeftRadius: props.errorStyles.bottomLeftRadius,
                borderBottomRightRadius: props.errorStyles.bottomRightRadius,
              }}
            >
              <div className="p-2">{IconsList[props.errorIcon]}</div>
              <div className="p-2">
                {t("Please enter a valid email address")}
              </div>
            </div>
          )}
          {/** End error container */}
        </div>
      </div>
    </div>
  )
}

export const UserInputMail = ({ ...props }) => {
  const {
    connectors: { connect, drag },
    parent,
    selected,
    isHovered,
    actions: { setProp },
  } = useNode((state) => ({
    parent: state.data.parent,
    selected: state.events.selected,
    dragged: state.events.dragged,
    isHovered: state.events.hovered,
  }))
  const {
    // query,
    query: { node },
  } = useEditor()

  // const isRoot = node(id).Root(),
  //       isDraggable = node(id).Draggable();
  const parentContainer = node(parent || "").get()
  const [hover, setHover] = useState(false)

  const t = useTranslations("Components")
  const inputRef = useRef<HTMLInputElement>(null)
  const primaryFont = useAppSelector((state) => state?.theme?.text?.primaryFont)
  const secondaryFont = useAppSelector(
    (state) => state?.theme?.text?.secondaryFont
  )
  const primaryColor = useAppSelector(
    (state) => state?.theme?.general?.primaryColor
  )

  const primaryTextColor = useAppSelector(
    (state) => state?.theme?.text?.primaryColor
  )

  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)

  useEffect(() => {
    if (
      parentContainer.id !== "ROOT" &&
      parentContainer.data.name === "CardContent"
    ) {
      setProp((props) => (props.size = "full"))
    }
  }, [parentContainer, setProp])

  useEffect(() => {
    if (props.primaryFont.globalStyled && !props.primaryFont.isCustomized) {
      setProp((props) => (props.primaryFont.value = primaryFont), 200)
    }
  }, [primaryFont, props.primaryFont, setProp])

  useEffect(() => {
    if (props.secondaryFont.globalStyled && !props.secondaryFont.isCustomized) {
      setProp((props) => (props.secondaryFont.value = secondaryFont), 200)
    }
  }, [secondaryFont, props.secondaryFont, setProp])

  useEffect(() => {
    if (
      props.activeBorderColor.globalStyled &&
      !props.activeBorderColor.isCustomized
    ) {
      setProp((props) => (props.activeBorderColor.value = primaryColor), 200)
    }
  }, [primaryColor, props.activeBorderColor, setProp])

  useEffect(() => {
    if (props.textColor.globalStyled && !props.textColor.isCustomized) {
      setProp((props) => (props.textColor.value = primaryTextColor), 200)
    }
  }, [primaryTextColor, props.textColor, setProp])

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div
      className="relative focus-visible:ring-0 focus-visible:ring-transparent"
      ref={(ref: any) => ref && connect(drag(ref))}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && <Controller nameOfComponent={t("InputMail")} />}
      <div
        className={cn(
          "relative w-full transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent",
          { "animate-shake": props.inputRequired }
        )}
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: `${props.backgroundColor}`,
          backgroundImage: `${props.backgroundImage}`,
          minWidth: "100%",
          paddingTop: `${props.marginTop}px`,
          paddingBottom: `${props.marginBottom}px`,
          paddingLeft: `${props.marginLeft}px`,
          paddingRight: `${props.marginRight}px`,
        }}
      >
        <div
          className="relative overflow-hidden focus-visible:ring-0 focus-visible:ring-transparent"
          style={{
            width: `${
              mobileScreen
                ? UserInputMobileSizeValues[props.size]
                : UserInputSizeValues[props.size]
            }`,
          }}
        >
          {!props.floatingLabel && (
            <>
              <ContentEditable
                html={props.label}
                disabled={false}
                tagName="div"
                onChange={(e) =>
                  setProp(
                    (props) =>
                      (props.label = e.target.value.replace(
                        /<\/?[^>]+(>|$)/g,
                        ""
                      )),
                    500
                  )
                }
                className={`relative mb-1 transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent`}
                style={{
                  fontFamily: `var(${props.primaryFont.value})`,
                  minWidth: `${UserInputSizeValues[props.size]}`,
                  width: `${UserInputSizeValues[props.size]}`,
                  color: `${primaryTextColor}`,
                }}
              />
            </>
          )}
          {props.floatingLabel && (
            <div
              onClick={() => {
                if (props.floatingLabel) {
                  setProp((props) => (props.isActive = true)),
                    setProp((props) => (props.isFocused = true)),
                    focusInput() // Focus the input when placeholder is clicked
                }
              }}
              className={`absolute line-clamp-1  text-ellipsis transition-all duration-200 ease-in-out hover:cursor-text focus-visible:ring-0 focus-visible:ring-transparent ${
                (props.isActive && props.floatingLabel) ||
                (props.inputValue?.length > 0 && props.floatingLabel)
                  ? "top-0 pl-3 pt-1 text-sm text-gray-400"
                  : "left-0 top-1 px-3 pb-1 pt-3 text-sm text-gray-400"
              } ${
                props.floatingLabel &&
                props.enableIcon &&
                "left-[49px]" /**was left-12 but care for a single pixel */
              }

      `}
              style={{
                fontFamily: `var(${props.primaryFont.value})`,
                color: `#9CA3AF`,
                // minWidth: `${UserInputSizeValues[props.size]}`,
                // width: `${UserInputSizeValues[props.size]}`,
              }}
            >
              {props.floatingLabel && props.label}
            </div>
          )}

          <div className="field-container flex w-auto flex-row items-center gap-0 transition-all duration-200 focus-visible:ring-0 focus-visible:ring-transparent">
            {props.enableIcon && (
              <div
                className={cn(
                  "flex min-h-[50px] min-w-[49px] shrink-0 items-center justify-center rounded-l-md bg-inherit shadow-none transition-all duration-200"
                )}
                style={{
                  backgroundColor: "#fff",
                  borderColor: props.error
                    ? "#cc0000"
                    : props.isActive
                    ? props.activeBorderColor.value
                    : props.borderColor.value,
                  borderBottomLeftRadius: props.error
                    ? 0
                    : props.bottomLeftRadius,
                  borderTopLeftRadius: props.topLeftRadius,
                  borderTopWidth: props.borderTopWidth,
                  borderBottomWidth: props.borderBottomWidth,
                  borderLeftWidth: props.borderLeftWidth,
                  borderRightWidth: 0,
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: convertToSvg(icons[props.icon]?.body),
                  }}
                  style={{
                    color: `#505051`,
                  }}
                />
              </div>
            )}
            <UserInputMailStyled
              data-answer={props.label}
              data-value={props.inputValue}
              id={props.id}
              ref={inputRef}
              textColor={`${primaryTextColor}`}
              backgroundColor={props.backgroundColor}
              borderColor={
                props.isActive
                  ? props.activeBorderColor.value
                  : props.borderColor.value
              }
              error={props.error}
              primaryFont={props.primaryFont.value}
              placeholder={!props.floatingLabel && props.placeholder}
              borderWidth={props.borderWidth}
              borderTopWidth={props.borderTopWidth}
              borderBottomWidth={props.borderBottomWidth}
              borderLeftWidth={props.borderLeftWidth}
              borderRightWidth={props.borderRightWidth}
              borderRadius={props.borderRadius}
              topLeftRadius={props.enableIcon ? 0 : props.topLeftRadius}
              topRightRadius={props.topRightRadius}
              bottomLeftRadius={props.enableIcon ? 0 : props.bottomLeftRadius}
              bottomRightRadius={props.bottomRightRadius}
              width={props.width}
              size={props.size}
              onFocus={() => setProp((props) => (props.isActive = true))}
              className={cn(
                {
                  "px-3 pb-4 pt-8 text-base font-semibold": props.floatingLabel,
                  "px-3 py-6 text-base font-semibold placeholder:font-light placeholder:text-gray-400":
                    !props.floatingLabel,
                  "rounded-l-none": props.enableIcon,
                },
                `ring-opacity-0/0
          send-response
          bg-white
          outline-none
          ring-0
          transition-all
          duration-200
          ease-in-out
          focus-visible:outline-none
          focus-visible:ring-0
          focus-visible:ring-transparent focus-visible:ring-offset-0
          peer-focus-visible:outline-none
          `
              )}
              onChange={
                (e) => setProp((props) => (props.inputValue = e.target.value))
                // not to set input prop when editing
                // console.log("Input field value is: ", e.target.value)
              }
              onBlur={() => setProp((props) => (props.isActive = false))}
              autoFocus={props.isFocused}
            />
          </div>
          {/** End field container */}

          {/** Error container */}
          {props.error && (
            <div
              className="error-container mt-0 flex flex-row items-center gap-0 border"
              style={{
                fontFamily: `var(${props.secondaryFont.value})`,
                borderColor: props.errorStyles.borderColor,
                backgroundColor: props.errorStyles.backgroundColor,
                color: props.errorStyles.textColor,
                borderTopWidth: 0,
                borderTopLeftRadius: props.errorStyles.topLeftRadius,
                borderTopRightRadius: props.errorStyles.topRightRadius,
                borderBottomLeftRadius: props.errorStyles.bottomLeftRadius,
                borderBottomRightRadius: props.errorStyles.bottomRightRadius,
              }}
            >
              <div className="p-2">{IconsList[props.errorIcon]}</div>
              <div className="p-2">{props.errorText}</div>
            </div>
          )}
          {/** End error container */}
        </div>
      </div>
    </div>
  )
}

UserInputMail.craft = {
  displayName: "User Input Mail",
  props: UserInputMailDefaultProps,
  related: {
    settings: UserInputMailSettings,
  },
}
