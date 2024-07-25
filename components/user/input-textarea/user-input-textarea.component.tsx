import React, { useEffect, useRef, useState } from "react"
import hexoid from "hexoid"
import {
  Activity,
  Anchor,
  Aperture,
  ArrowRight,
  Disc,
  DollarSign,
  Mountain,
  X,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { rgba } from "polished"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useEditor, useNode } from "@/lib/craftjs"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import { TextArea } from "@/components/textarea-custom"

import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import { UserInputTextareaSettings } from "./user-input-textarea-settings.component"

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
  x: <X className={cn(ICONSTYLES, "text-[#cc0000]")} />,
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

export type UserInputTextareaProps = {
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
  height: number
  id: string
}

export const UserInputTextareaDefaultProps: UserInputTextareaProps = {
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
  height: 100,
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
  label: "Label",
  fieldName: "Field name",
  floatingLabel: false,
  enableIcon: false,
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

export const UserInputTextareaGen = ({ ...props }) => {
  const [inputValue, setInputValue] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [error, setError] = useState(props.error)

  const primaryTextColor = useAppSelector(
    (state) => state?.theme?.text?.primaryColor
  )

  return (
    <div
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
          <div
            className={`mb-1 relative transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent`}
            style={{
              fontFamily: `var(${props.primaryFont.value})`,
              minWidth: `${UserInputSizeValues[props.size]}`,
              width: `${UserInputSizeValues[props.size]}`,
              color: `${primaryTextColor}`,
            }}
          >
            {props.label}
          </div>

          <div className="field-container flex flex-row gap-0 items-center w-auto transition-all duration-200 focus-visible:ring-0 focus-visible:ring-transparent">
            <UserInputTextareaStyled
              ref={textAreaRef}
              textColor={props.textColor}
              backgroundColor={props.backgroundColor}
              borderColor={
                isActive
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
              onFocus={() => setIsActive(true)}
              className={cn(
                {
                  "font-semibold pt-8 px-3 pb-4 text-base": props.floatingLabel,
                  "font-semibold px-3 py-2.5 text-base placeholder:text-gray-400 placeholder:font-light":
                    !props.floatingLabel,
                  "rounded-l-none": props.enableIcon,
                },
                `ring-0
                outline-none
                focus-visible:outline-none
                peer-focus-visible:outline-none
                focus-visible:ring-0
                ring-opacity-0/0
                bg-white
                transition-all
                duration-200
                ease-in-out
                focus-visible:ring-transparent focus-visible:ring-offset-0`
              )}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => setIsActive(false)}
              autoFocus={isFocused}
              height={props.height}
            />
          </div>
          {/** End field container */}

          {/** Error container */}
          {props.error && (
            <div
              className="error-container border flex flex-row items-center gap-0 mt-0"
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
              <div className="p-2">{props.errorText}</div>
            </div>
          )}
          {/** End error container */}
        </div>
      </div>
    </div>
  )
}

const UserInputTextareaStyled = styled(TextArea)<{
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
  height: number
}>`
  color: ${(props) => props.textColor};
  max-width: 100%;
  min-height: 50px;
  height: ${(props) => props.height}px; // Use height prop
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

export const UserInputTextarea = ({ ...props }) => {
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
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
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

  // useEffect(() => {
  //   if (
  //     parentContainer.id !== "ROOT" &&
  //     parentContainer.data.name === "CardContent"
  //   ) {
  //     setProp((props) => (props.size = "full"))
  //   }
  // }, [parentContainer, props.size, setProp])

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

  const focusInput = () => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
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
      {hover && <Controller nameOfComponent={t("TextArea")} />}
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
            width: `${mobileScreen ? UserInputMobileSizeValues[props.size] : UserInputSizeValues[props.size]}`,
          }}
        >
          <ContentEditable
            html={props.label}
            disabled={false}
            tagName="div"
            onChange={(e) =>
              setProp(
                (props) =>
                  (props.label = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")),
                500
              )
            }
            className={`mb-1 relative transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent`}
            style={{
              fontFamily: `var(${props.primaryFont.value})`,
              minWidth: `${UserInputSizeValues[props.size]}`,
              width: `${UserInputSizeValues[props.size]}`,
              color: `${primaryTextColor}`,
            }}
          />

          <div className="field-container flex flex-row gap-0 items-center w-auto transition-all duration-200 focus-visible:ring-0 focus-visible:ring-transparent">
            {/* {props.enableIcon && (
              <div
                className={cn(
                  "rounded-l-md shrink-0 flex items-center shadow-none justify-center bg-inherit min-h-[50px] min-w-[49px] transition-all duration-200"
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
                {IconsList[props.icon]}
              </div>
            )} */}
            <UserInputTextareaStyled
              data-answer={props.label}
              data-value={props.inputValue}
              id={props.id}
              ref={textAreaRef}
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
              height={props.height}
              onFocus={() => setProp((props) => (props.isActive = true))}
              className={cn(
                `font-semibold px-3 pt-3 pb-4 text-base placeholder:text-gray-400 placeholder:font-light ring-0
              outline-none
              focus-visible:outline-none
              peer-focus-visible:outline-none
              focus-visible:ring-0
              ring-opacity-0/0
              bg-white
              transition-all
              duration-200
              ease-in-out
              focus-visible:ring-transparent focus-visible:ring-offset-0
              send-response
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
              className="error-container border flex flex-row items-center gap-0 mt-0"
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

UserInputTextarea.craft = {
  displayName: "Textarea",
  props: UserInputTextareaDefaultProps,
  related: {
    settings: UserInputTextareaSettings,
  },
}