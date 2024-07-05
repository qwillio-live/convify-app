import { get } from "http"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { set } from "date-fns"
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
import { darken, rgba } from "polished";
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useEditor, useNode } from "@/lib/craftjs"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import { Checkbox as DefoCheckbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import { Checkbox } from "./checkbox-element"
import { UserInputCheckboxSettings } from "./user-input-checkbox-settings.component"

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
  full: "760px",
}

export type UserInputCheckboxProps = {
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
}
export const UserInputCheckboxDefaultProps: UserInputCheckboxProps = {
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
  placeholder: "Agreement",
  backgroundColor: "transparent",
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
  inputRequired: true,
  fullWidth: true,
  size: UserInputSizes.medium,
  label:
    "I agree with the terms and condition and I'm also happily subscribing to your newsletter.",
  fieldName: "Agreement",
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
}

interface StyledUserInputCheckboxProps {
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

const UserInputCheckboxStyled = styled.div<StyledUserInputCheckboxProps>`
  color: ${(props) => props.textColor};
  max-width: 100%;
  min-height: 39.44px;
  width: ${(props) => props.width}px;
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

export const UserInputCheckboxGen = ({ ...props }) => {
  const [inputValue, setInputValue] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  console.log(props.backgroundImage)

  const primaryTextColor = useAppSelector(
    (state) => state?.theme?.text?.primaryColor
  )

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

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
          <div className="field-container flex flex-row gap-0 items-center w-auto transition-all duration-200 focus-visible:ring-0 focus-visible:ring-transparent">
            <UserInputCheckboxStyled
              ref={inputRef}
              textColor={props.textColor}
              backgroundColor={props.backgroundColor}
              borderColor={
                props.isActive
                  ? props.activeBorderColor.value
                  : props.borderColor.value
              }
              error={props.error}
              primaryFont={props.primaryFont.value}
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
              className={cn(
                `font-normal px-3 py-2 text-base placeholder:text-gray-400 placeholder:font-light
                ring-0
                outline-none
                focus-visible:outline-none
                peer-focus-visible:outline-none
                focus-visible:ring-0
                ring-opacity-0/0
                transition-all
                duration-200
                ease-in-out
                focus-visible:ring-transparent focus-visible:ring-offset-0`
              )}
              // onChange={
              //   (e) => setProp((props) => (props.inputValue = e.target.value))
              //   // not to set input prop when editing
              //   // console.log("Input field value is: ", e.target.value)
              // }
            >
              <div
                className={`mb-1 relative text-[14.5px] text-ellipsis transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent`}
                style={{
                  fontFamily: `var(${props.primaryFont.value})`,
                  color: `${primaryTextColor}`,
                }}
              >
                <DefoCheckbox
                  className={cn(`h-4 w-4 mr-2 z-50 bg-white  rounded-[5px] `)}
                  checkmarkColor={primaryTextColor}
                  style={{
                    borderColor: `#dfdfdf`,
                  }}
                />

                {props.label}
              </div>
            </UserInputCheckboxStyled>
          </div>
          {/** End field container */}
        </div>
      </div>
    </div>
  )
}

export const UserInputCheckbox = ({ ...props }) => {
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
    query: { node },
  } = useEditor()

  const parentContainer = node(parent || "").get()
  const t = useTranslations("Components")
  const inputRef = useRef<HTMLInputElement>(null)
  const [hover, setHover] = useState(false)
  const [containerHover, setContainerHover] = useState(false)
  const [checkmarkColor, setCheckmarkColor] = useState("#748BA7")
  const [checkmarkBorder, setCheckmarkBorder] = useState("#dfdfdf")
  const [isChecked, setIsChecked] = useState(props.isActive)

  const primaryFont = useAppSelector((state) => state?.theme?.text?.primaryFont)
  const secondaryFont = useAppSelector(
    (state) => state?.theme?.text?.secondaryFont
  )
  const primaryColor = useAppSelector(
    (state) => state?.theme?.general?.primaryColor
  )

  const backgroundThemeColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )

  const primaryTextColor = useAppSelector(
    (state) => state?.theme?.text?.primaryColor
  )

  const secondaryColor = useAppSelector(
    (state) => state?.theme?.general?.secondaryColor
  )

  const handleCheckChange = (checked: boolean) => {
    setIsChecked(checked)
    setProp((props) => (props.isActive = checked))
  }

  useEffect(() => {
    if (
      parentContainer.id !== "ROOT" &&
      parentContainer.data.name === "CardContent"
    ) {
      setProp((props) => (props.size = "full"))
    }
  }, [parentContainer, props.size, setProp])

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
    setCheckmarkColor(primaryTextColor || "#748BA7") // update color when primaryTextColor changes, default to gray if undefined
  }, [primaryTextColor])

  useEffect(() => {
    setCheckmarkBorder(primaryColor || "#748BA7") // update color when primaryColor changes, default to gray if undefined
  }, [primaryColor])

  const getTextColor = () => {
    if (containerHover || props.isActive || isChecked) {
      return primaryTextColor
    }
    return `${primaryTextColor}`
  }

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const getHoverBackgroundForPreset= (color) => {

    return rgba(color, 0.1);
  
    }
    const darkenedBg = getHoverBackgroundForPreset(primaryColor)

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
      {hover && <Controller nameOfComponent={t("Checkbox")} />}
      <div
        className={cn(
          "relative w-full transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent",
          { "animate-shake": props.inputRequired }
        )}
        style={{
          display: "flex",
          backgroundColor: `${props.backgroundColor}`,
          justifyContent: "center",
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
            width: `${UserInputSizeValues[props.size]}`,
          }}
        >
          <div className="field-container flex flex-row gap-0 items-center w-full transition-all duration-200 focus-visible:ring-0 focus-visible:ring-transparent">
            <UserInputCheckboxStyled
              ref={inputRef}
              textColor={props.textColor}
              backgroundColor={props.backgroundColor}
              borderColor={
                props.isActive || containerHover || isChecked
                  ? props.activeBorderColor.value
                  : props.borderColor.value
              }
              error={props.error}
              primaryFont={props.primaryFont.value}
              borderWidth={props.borderWidth}
              borderTopWidth={props.borderTopWidth}
              borderBottomWidth={props.borderBottomWidth}
              borderLeftWidth={props.borderLeftWidth}
              borderRightWidth={props.borderRightWidth}
              borderRadius={props.borderRadius}
              topLeftRadius={props.topLeftRadius}
              topRightRadius={props.topRightRadius}
              bottomLeftRadius={props.bottomLeftRadius}
              bottomRightRadius={props.bottomRightRadius}
              width={props.width}
              size={props.size}
              onFocus={() => setProp((props) => (props.isActive = true))}
              className={cn(
                `p-2.5
                ring-0
                outline-none
                focus-visible:outline-none
                peer-focus-visible:outline-none
                focus-visible:ring-0
                ring-opacity-0/0
                transition-all
                duration-200
                ease-in-out
                max-h-fit
                focus-visible:ring-transparent 
                focus-visible:ring-offset-0 
                `
              )}
              onBlur={() => setProp((props) => (props.isActive = false))}
              autoFocus={props.isFocused}
              onMouseEnter={(e) => {
                e.stopPropagation()
                setContainerHover(true)
              }}
              onMouseLeave={(e) => {
                e.stopPropagation()
                setContainerHover(false)
                // setHover(false)
              }}
              style={{
                width: UserInputSizeValues[props.size],
                zIndex: 1,
                backgroundColor: containerHover ? darkenedBg : props.backgroundColor,
              }}
            >
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
                className={`pl-6 text-[14.4px] leading-[19.44px] border-none relative transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent`}
                style={{
                  fontFamily: `var(${props.primaryFont.value})`,
                  color: `${getTextColor()}`,
                  zIndex: 10,
                }}
              />

              {props.label.length === 0 ? null : (
                <Checkbox
                  className={cn(
                    `h-[18px] w-[18px] absolute rounded-[5px] left-3 bg-white top-[11px] z-50 `
                  )}
                  isActive={props.isActive}
                  isHovered={containerHover}
                  isChecked={isChecked}
                  onCheckedChange={handleCheckChange}
                  checkmarkColor={checkmarkColor}
                  checkmarkBorder={checkmarkBorder}
                  style={{
                    zIndex: 10,
                  }}
                />
              )}
            </UserInputCheckboxStyled>
          </div>
        </div>
      </div>
    </div>
  )
}

UserInputCheckbox.craft = {
  displayName: "User Checkbox",
  props: UserInputCheckboxDefaultProps,
  related: {
    settings: UserInputCheckboxSettings,
  },
}