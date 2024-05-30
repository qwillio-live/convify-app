import React, { useEffect, useRef, useState } from "react"
import { Settings } from "lucide-react"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { UserInputSettings } from "./user-input-settings.component"
import { cn } from "@/lib/utils"
import {
  Activity,
  Anchor,
  Aperture,
  ArrowRight,
  Disc,
  DollarSign,
  Mountain,
} from "lucide-react"

const ICONSTYLES = 'p-2 w-12 h-12 shrink-0';

const IconsList = {
  aperture: <Aperture className={ICONSTYLES} />,
  activity: <Activity  className={ICONSTYLES} />,
  dollarsign: <DollarSign  className={ICONSTYLES} />,
  anchor: <Anchor  className={ICONSTYLES} />,
  disc: <Disc className={ICONSTYLES} />,
  mountain: <Mountain  className={ICONSTYLES} />,
  arrowright: <ArrowRight  className={ICONSTYLES} />,
}

export enum UserInputSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

const UserInputSizeValues={
  small: "260px",
  medium: "376px",
  large: "576px",
  full: "100%",
}

export const UserInputGen = ({ ...props }) => {
  const [inputValue, setInputValue] = useState(props.inputValue)
  const [isActive, setIsActive] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div
      className="relative"
      {...props}
      style={{
        marginLeft: `${props.marginLeft}px`,
        marginRight: `${props.marginRight}px`,
        marginTop: `${props.marginTop}px`,
        marginBottom: `${props.marginBottom}px`,
        minWidth: UserInputSizeValues[props.size],
      }}
    >
      <div
        onClick={() => {
          setIsActive(true)
          setIsFocused(true)
          focusInput() // Focus the input when placeholder is clicked
        }}
        className={`hover:cursor-text absolute transition-all duration-200 ease-in-out ${
          isActive || inputValue.length > 0
            ? "top-0 text-sm pl-3 pt-0"
            : "top-0 left-0 pt-3 px-3 pb-1 text-sm"
        }`}
      >
        {props.placeholder}
      </div>
      <UserInputStyled
        ref={inputRef}
        textColor={props.textColor}
        backgroundColor={props.backgroundColor}
        borderColor={isActive ? props.activeBorderColor : props.borderColor}
        borderWidth={props.borderWidth}
        placeholder={!props.floatingLabel && props.placeholder}
        borderRadius={props.borderRadius}
        width={props.width}
        size={props.size}
        // {...props}
        onFocus={() => setIsActive(true)}
        // 1.9em .6em .7em
        className={` font-semibold pt-5 px-3 pb-1 text-sm
        ring-[${props.borderColor}]
        focus-visible:ring-[${props.activeBorderColor}]
        ring-opacity-/50
        focus-visible:ring-1 focus-visible:ring-offset-0
        `}
        // placeholder={props.placeholder}
        onChange={(e) => {setInputValue(e.target.value), console.log("INPUT VALUE: ", inputValue)}}
        // onFocus={() => setProp((props) => (props.borderColor = props.activeBorderColor))}
        onBlur={() => setIsActive(false)}
      />
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
  size: UserInputSizes
}>`
  color: ${(props) => props.textColor};
  max-width: 100%;
  background-color: '#fff';
  border-color: ${(props) => props.borderColor};
  border-width: ${(props) => props.borderWidth}px;

  align-self: center;
`

export const UserInput = ({ ...props }) => {
  const {
    connectors: { connect, drag },
    selected,
    isHovered,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
    isHovered: state.events.hovered,
  }))
  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div
      className="relative"
      ref={(ref: any) => ref && connect(drag(ref))}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {isHovered && <Controller nameOfComponent={"INPUT FIELD"} />}
      <div className="relative w-full"
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: `${props.backgroundColor}`,
        minWidth: '100%',
        paddingTop: `${props.marginTop}px`,
        paddingBottom: `${props.marginBottom}px`,
        paddingLeft: `${props.marginLeft}px`,
        paddingRight: `${props.marginRight}px`,
       }}
      >
      <div className="relative overflow-hidden"
      style={{
        width: `${UserInputSizeValues[props.size]}`,
       }}
      >
      {
        !props.floatingLabel && (
          <div
            onClick={() => {
              setProp((props) => (props.isActive = true)),
                setProp((props) => (props.isFocused = true)),
                focusInput()
            }}
            className={`mb-1 hover:cursor-text relative transition-all duration-200 ease-in-out`}
            style={{
              minWidth: `${UserInputSizeValues[props.size]}`,
              width: `${UserInputSizeValues[props.size]}`,
            }}
          >
            {props.label}
          </div>
        )
      }
      <div
        onClick={() => {
          setProp((props) => (props.isActive = true)),
            setProp((props) => (props.isFocused = true)),
            focusInput() // Focus the input when placeholder is clicked
        }}
        className={`hover:cursor-text absolute transition-all duration-200 ease-in-out ${
          props.isActive && props.floatingLabel || props.inputValue.length > 0 && props.floatingLabel
            ? "top-0 text-sm pl-3 pt-1"
            : "top-1 left-0 pt-3 px-3 pb-1 text-sm"
        } ${
          props.floatingLabel && props.enableIcon && "left-12"
        }

        `
      }
        style={{
          minWidth: `${UserInputSizeValues[props.size]}`,
          width: `${UserInputSizeValues[props.size]}`,
        }}
      >
        {props.floatingLabel && props.label}
      </div>

      <div className="field-container flex flex-row gap-0 items-center w-auto">
      {
        props.enableIcon && (
          <div
          className={cn(
            'rounded-l-md shrink-0 flex items-center justify-center bg-inherit border border-r-0 ',
          )}
          style={{
            borderColor: props.isActive ? props.activeBorderColor : props.borderColor,
           }}
          >
          {IconsList[props.icon]}
          </div>
        )
      }
      <UserInputStyled
        ref={inputRef}
        textColor={props.textColor}
        backgroundColor={props.backgroundColor}
        borderColor={
          props.isActive ? props.activeBorderColor : props.borderColor
        }
        placeholder={ !props.floatingLabel && props.placeholder}
        borderWidth={props.borderWidth}
        borderRadius={props.borderRadius}
        width={props.width}
        size={props.size}
        onFocus={() => setProp((props) => (props.isActive = true))}
        className={cn(
          {
            "font-semibold pt-8 px-3 pb-4 text-base": props.floatingLabel,
            "font-semibold px-3 py-6 text-base": !props.floatingLabel,
            "rounded-l-none" : props.enableIcon,
          },
          `ring-0
          focus-visible:ring-0
          ring-opacity-0
          bg-white
          peer
          focus-visible:ring-0 focus-visible:ring-offset-0`
        )}
        onChange={(e) =>
          setProp((props) => (props.inputValue = e.target.value))
        }
        onBlur={() => setProp((props) => (props.isActive = false))}
        autoFocus={props.isFocused}
      />
      </div>{/** End field container */}
      </div>
      </div>
    </div>
  )
}

export type UserInputProps = {
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
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
  activeBorderColor: string
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
}
export const UserInputDefaultProps: UserInputProps = {
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
  borderColor: "#eaeaeb",
  borderWidth: 1,
  borderRadius: 8,
  activeBorderColor: "#4050ff",
  isActive: false,
  inputRequired: false,
  fullWidth: true,
  size: UserInputSizes.medium,
  label: "Label",
  fieldName: "Field name",
  floatingLabel: false,
  enableIcon: false,
  icon: "arrowright",
}

UserInput.craft = {
  displayName: "User Input",
  props: UserInputDefaultProps,
  related: {
    settings: UserInputSettings,
  },
}
