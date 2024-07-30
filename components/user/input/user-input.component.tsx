"use client"
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
import { useForm, useFormContext } from "react-hook-form"
import styled from "styled-components"

import { useEditor, useNode } from "@/lib/craftjs"
import {
  setFieldProp,
  setValidateScreen,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { cn } from "@/lib/utils"
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
import {
  ImagePictureTypes,
  PictureTypes,
  SvgRenderer,
} from "@/components/PicturePicker"
import { Input } from "@/components/input-custom"

import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import { UserInputSettings } from "./user-input-settings.component"
import { InputIconRenderer } from "./user-input-icon-picker"

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

export const UserInputGen = ({ ...props }) => {
  const icon = props.icon
  const dispatch = useAppDispatch()
  const [inputValue, setInputValue] = useState("")
  useEffect(() => {
    setInputValue(fieldValue)
    dispatch(
      setFieldProp({
        screenId: props.parentScreenId,
        fieldId: props.compId,
        fieldName: "fieldValue",
        fieldValue: null,
      })
    )
    dispatch(
      setFieldProp({
        screenId: props.parentScreenId,
        fieldId: props.compId,
        fieldName: "fieldRequired",
        fieldValue: props.inputRequired,
      })
    )
  }, [])
  // const selectedScreen = useAppSelector((state) => state?.screen?.selectedScreen || 0)
  const currentScreenName =
    useAppSelector((state) => state?.screen?.currentScreenName) || ""
  const selectedScreen = useAppSelector(
    (state) =>
      state?.screen?.screens.findIndex(
        (screen) => screen.screenName === currentScreenName
      ) || 0
  )
  //  const currentScreenName = useAppSelector((state) => state?.screen?.currentScreenName) || "";
  const screenValidated =
    useAppSelector(
      (state: RootState) =>
        state.screen?.screens[selectedScreen]?.screenValidated
    ) || false
  const selectedScreenId =
    useAppSelector(
      (state) => state?.screen?.screens[selectedScreen]?.screenId
    ) || ""
  // const selectedScreenId = useAppSelector((state) => state?.screen?.screens[selectedScreen]?.screenId) || ""
  // const screenValidated = useAppSelector((state) => state.screen?.screens[selectedScreen]?.screenValidated || false)
  const selectedField = useAppSelector(
    (state) =>
      state.screen?.screensFieldsList[props.parentScreenId]?.[props.compId]
  )
  const fieldValue = useAppSelector(
    (state) =>
      state.screen?.screensFieldsList[props.parentScreenId]?.[props.compId]
        ?.fieldValue
  )
  const fieldRequired =
    useAppSelector(
      (state) =>
        state.screen?.screensFieldsList[props.parentScreenId]?.[props.compId]
          ?.fieldRequired
    ) || false
  const fieldInScreen = useAppSelector(
    (state) =>
      state.screen?.screensFieldsList[props.parentScreenId]?.[props.compId]
  )
  const toggleError =
    useAppSelector(
      (state) =>
        state.screen?.screensFieldsList[props.parentScreenId]?.[props.compId]
          ?.toggleError
    ) || false
  const fieldError =
    (props.inputRequired &&
      (!fieldValue || fieldValue == null) &&
      screenValidated &&
      fieldInScreen &&
      toggleError) ||
    false

  const [isActive, setIsActive] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(props.error)

  // useEffect(() => {
  //   setInputValue(fieldValue)
  //   dispatch(setFieldProp({screenId: props.parentScreenId,fieldId: props.compId, fieldName: 'fieldValue', fieldValue: null}))
  //   dispatch(setFieldProp({screenId: props.parentScreenId,fieldId: props.compId, fieldName: 'fieldRequired', fieldValue: props.inputRequired}))
  // },[])

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // useEffect(() => {
  //   if(inputField){
  //     if(inputField.fieldValue==0){
  //       dispatch(setFieldProp({fieldId: props.nodeId, fieldName: 'toggleError', fieldValue: true}))
  //     }else{
  //       dispatch(setFieldProp({fieldId: props.nodeId, fieldName: 'toggleError', fieldValue: false}))
  //     }
  //   }

  // },[inputField])

  return (
    <div
      className={cn(
        "relative focus-visible:ring-0 focus-visible:ring-transparent"
      )}
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
          className={cn(
            "relative overflow-hidden focus-visible:ring-0 focus-visible:ring-transparent",
            {
              "animate-shake": fieldError,
            }
          )}
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
                  backgroundColor: "transparent",
                  borderColor: fieldError
                    ? "#cc0000"
                    : isActive
                    ? props.activeBorderColor.value
                    : props.borderColor.value,
                  borderBottomLeftRadius: fieldError
                    ? 0
                    : props.bottomLeftRadius,
                  borderTopLeftRadius: props.topLeftRadius,
                  borderTopWidth: props.borderTopWidth,
                  borderBottomWidth: props.borderBottomWidth,
                  borderLeftWidth: props.borderLeftWidth,
                  borderRightWidth: 0,
                }}
              >
                <InputIconRenderer
                  iconName={icon}
                  style={{
                    width: `${21}px`,
                    height: `${21}px`,
                    color: "#505051",
                  }}
                />
              </div>
            )}
            <UserInputStyled
              // ref={inputRef}
              textColor={props.textColor}
              backgroundColor={props.backgroundColor}
              borderColor={
                isActive
                  ? props.activeBorderColor.value
                  : props.borderColor.value
              }
              // error={props.error}
              error={fieldError}
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
                  "px-3 pb-4 pt-8 text-base font-semibold": props.floatingLabel,
                  "px-3 py-6 text-base font-semibold placeholder:font-light placeholder:text-gray-400":
                    !props.floatingLabel,
                  "rounded-l-none": props.enableIcon,
                },
                `outline-none
          ring-0
          ring-opacity-0
          transition-all
          duration-200
          ease-in-out
          focus-visible:outline-none
          focus-visible:ring-0
          focus-visible:ring-transparent
          focus-visible:ring-offset-0 peer-focus-visible:outline-none`
              )}
              onChange={(e) => {
                setInputValue(e.target.value),
                  dispatch(
                    setFieldProp({
                      screenId: props.parentScreenId,
                      fieldId: props.nodeId,
                      fieldName: "fieldValue",
                      fieldValue: e.target.value,
                    })
                  )
              }}
              onBlur={() => {
                setIsActive(false)
              }}
              autoFocus={isFocused}
            />
          </div>
          {/** End field container */}

          {/** Error container */}
          {fieldError && (
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

const UserInputStyled = styled(Input)<{
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
}>`
  color: ${(props) => props.textColor};
  max-width: 100%;
  min-height: 50px;
  background-color: "transparent";
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

export const UserInput = ({ ...props }) => {
  const {
    connectors: { connect, drag },
    compId,
    parent,
    selected,
    isHovered,
    actions: { setProp },
    props: { icon },
  } = useNode((state) => ({
    compId: state.id,
    props: state.data.props,
    parent: state.data.parent,
    selected: state.events.selected,
    dragged: state.events.dragged,
    isHovered: state.events.hovered,
  }))
  const {
    // query,
    query: { node },
  } = useEditor()
  const dispatch = useAppDispatch()

  // const isRoot = node(id).Root(),
  //       isDraggable = node(id).Draggable();
  const parentContainer = node(parent || "").get()
  const [hover, setHover] = useState(false)

  const t = useTranslations("Components")
  const inputRef = useRef<HTMLInputElement>(null)
  const primaryFont = useAppSelector((state) => state?.theme?.text?.primaryFont)
  const selectedScreen = useAppSelector(
    (state) => state?.screen?.selectedScreen || 0
  )
  // const selectedScreenId = useAppSelector((state) => state?.screen?.screens[selectedScreen]?.screenId) || ""
  const screenValidated = useAppSelector(
    (state) => state.screen?.screens[selectedScreen]?.screenValidated || false
  )
  const selectedField = useAppSelector(
    (state) => state.screen?.screensFieldsList[props.parentScreenId]?.[compId]
  )
  const fieldValue = useAppSelector(
    (state) =>
      state.screen?.screensFieldsList[props.parentScreenId]?.[compId]
        ?.fieldValue
  )
  // const fieldToggleError = useAppSelector((state) => state.screen?.screensFieldsList[selectedScreenId]?.[compId]?.toggleError) || false
  const fieldRequired =
    useAppSelector(
      (state) =>
        state.screen?.screensFieldsList[props.parentScreenId]?.[compId]
          ?.fieldRequired
    ) || false
  // const fieldError = useAppSelector((state) => state.screen?.screens[selectedScreen]?.screenFields[compId]?.toggleError && props.inputRequired && !props?.inputValue && !screenValidated)
  const fieldError =
    props.inputRequired &&
    (!fieldValue || fieldValue == null) &&
    screenValidated

  const secondaryFont = useAppSelector(
    (state) => state?.theme?.text?.secondaryFont
  )
  const primaryColor = useAppSelector(
    (state) => state?.theme?.general?.primaryColor
  )

  useEffect(() => {
    // dispatch(setFieldProp({fieldId: selectedField?.fieldId, fieldName: 'toggleError', fieldValue: false}))
    dispatch(
      setFieldProp({
        screenId: props.parentScreenId,
        fieldId: selectedField?.fieldId,
        fieldName: "fieldValue",
        fieldValue: null,
      })
    )
    dispatch(
      setFieldProp({
        screenId: props.parentScreenId,
        fieldId: selectedField?.fieldId,
        fieldName: "fieldRequired",
        fieldValue: props.inputRequired,
      })
    )
    dispatch(
      setValidateScreen({
        screenId: props.parentScreenId,
        screenValidated: false,
        screenToggleError: false,
      })
    )
    setProp((props) => (props.compId = compId))
  }, [])
  // useEffect(() => {
  //   console.log("FIELD ERROR", JSON.stringify({
  //     compId,
  //     fieldError,
  //     fieldValue,
  //     fieldRequired,
  //     screenValidated,
  //     inputRequired: props.inputRequired
  //   }))
  // } ,[selectedField,fieldError,screenValidated])
  useEffect(() => {
    if (
      parentContainer.id !== "ROOT" &&
      parentContainer.data.name === "CardContent"
    ) {
      setProp((props) => (props.size = "full"))
    }
  }, [parentContainer])

  useEffect(() => {
    if (props.primaryFont.globalStyled && !props.primaryFont.isCustomized) {
      setProp((props) => (props.primaryFont.value = primaryFont), 200)
    }
  }, [primaryFont])

  useEffect(() => {
    if (props.secondaryFont.globalStyled && !props.secondaryFont.isCustomized) {
      setProp((props) => (props.secondaryFont.value = secondaryFont), 200)
    }
  }, [secondaryFont])

  useEffect(() => {
    if (
      props.activeBorderColor.globalStyled &&
      !props.activeBorderColor.isCustomized
    ) {
      setProp((props) => (props.activeBorderColor.value = primaryColor), 200)
    }
  }, [primaryColor])

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }
  return (
    <div
      className={cn(
        "relative focus-visible:ring-0 focus-visible:ring-transparent",
        {
          "animate-shake": fieldError,
        }
      )}
      ref={(ref: any) => ref && connect(drag(ref))}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      {hover && <Controller nameOfComponent={t("Input Field")} />}
      <div
        className={cn(
          "relative w-full transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent"
          // { "animate-shake": props.inputRequired }
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
            width: `${UserInputSizeValues[props.size]}`,
          }}
        >
          {!props.floatingLabel && (
            <>
              {/** @ts-ignore */}
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
                (props.inputValue.length > 0 && props.floatingLabel)
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
                  backgroundColor: "transparent",
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
                <InputIconRenderer
                  iconName={icon}
                  style={{
                    width: `${21}px`,
                    height: `${21}px`,
                    color: "#505051",
                  }}
                />
              </div>
            )}
            <UserInputStyled
              data-answer={props.label}
              data-value={props.inputValue}
              id={props.id}
              ref={inputRef}
              textColor={props.textColor}
              backgroundColor={props.backgroundColor}
              borderColor={
                props.isActive
                  ? props.activeBorderColor.value
                  : props.borderColor.value
              }
              // error={props.error}
              error={fieldError}
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
          outline-none
          ring-0
          transition-all
          duration-200
          ease-in-out focus-visible:ring-transparent
          focus-visible:ring-offset-0
          `
                // focus-visible:outline-none
                // focus-visible:ring-0
                // focus-visible:ring-transparent
                // focus-visible:ring-offset-0 peer-focus-visible:outline-none`
              )}
              onChange={
                (e) => {
                  setProp((props) => (props.inputValue = e.target.value)),
                    dispatch(
                      setFieldProp({
                        screenId: props.parentScreenId,
                        fieldId: compId,
                        fieldName: "fieldValue",
                        fieldValue: e.target.value,
                      })
                    )
                }
                // not to set input prop when editing
                // console.log("Input field value is: ", e.target.value)
              }
              onBlur={() => {
                setProp((props) => (props.isActive = false))
              }}
              autoFocus={props.isFocused}
            />
          </div>
          {/** End field container */}

          {/** Error container */}
          {fieldError && (
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

export type UserInputProps = {
  compId: string
  inputValue: string
  fieldType: "data" | "action" | "design"
  required: boolean
  fontSize: number
  textColor: string
  parentScreenId: string
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
export const UserInputDefaultProps: UserInputProps = {
  compId: "",
  inputValue: "",
  parentScreenId: "",
  fieldType: "data",
  required: false,
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
  inputRequired: false,
  fullWidth: true,
  size: UserInputSizes.medium,
  label: "Label",
  fieldName: "Field name",
  floatingLabel: false,
  enableIcon: false,
  icon: "interface-arrows-right-arrow-right-keyboard",
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

UserInput.craft = {
  displayName: "User Input",
  props: UserInputDefaultProps,
  related: {
    settings: UserInputSettings,
  },
}
