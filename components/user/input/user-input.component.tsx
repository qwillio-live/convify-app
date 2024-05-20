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
      <UserInputSyled
        ref={inputRef}
        textColor={props.textColor}
        backgroundColor={props.backgroundColor}
        borderColor={isActive ? props.activeBorderColor : props.borderColor}
        borderWidth={props.borderWidth}
        borderRadius={props.borderRadius}
        width={props.width}
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

const UserInputSyled = styled(Input)<{
  textColor: string
  width: number
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
}>`
  color: ${(props) => props.textColor};
  width: ${(props) => props.width}px;
  background-color: ${(props) => props.backgroundColor};
  border-color: ${(props) => props.borderColor};
  border-width: ${(props) => props.borderWidth}px;
  border-radius: ${(props) => props.borderRadius}px;
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
      {...props}
      ref={(ref: any) => ref && connect(drag(ref))}
      style={{
        marginLeft: `${props.marginLeft}px`,
        marginRight: `${props.marginRight}px`,
        marginTop: `${props.marginTop}px`,
        marginBottom: `${props.marginBottom}px`,
      }}
    >
      {isHovered && <Controller nameOfComponent={"INPUT FIELD"} />}
      <div
        onClick={() => {
          setProp((props) => (props.isActive = true)),
            setProp((props) => (props.isFocused = true)),
            focusInput() // Focus the input when placeholder is clicked
        }}
        className={`hover:cursor-text absolute transition-all duration-200 ease-in-out ${
          props.isActive || props.inputValue.length > 0
            ? "top-0 text-sm pl-3 pt-0"
            : "top-0 left-0 pt-3 px-3 pb-1 text-sm"
        }`}
      >
        {props.placeholder}
      </div>
      {
        true && (
          <div className="relative top-0 left-0 pt-3 px-3 pb-1 text-sm">
            This is a icon
          </div>
        )
      }
      <UserInputSyled
        ref={inputRef}
        textColor={props.textColor}
        backgroundColor={props.backgroundColor}
        borderColor={
          props.isActive ? props.activeBorderColor : props.borderColor
        }
        borderWidth={props.borderWidth}
        borderRadius={props.borderRadius}
        width={props.width}
        // {...props}
        onFocus={() => setProp((props) => (props.isActive = true))}
        // 1.9em .6em .7em
        className={` font-semibold pt-6 px-3 pb-2 text-base
      ring-[${props.borderColor}]
      focus-visible:ring-[${props.activeBorderColor}]
      ring-opacity-/50
       focus-visible:ring-1 focus-visible:ring-offset-0
      `}
        // placeholder={props.placeholder}
        onChange={(e) =>
          setProp((props) => (props.inputValue = e.target.value))
        }
        // onFocus={() => setProp((props) => (props.borderColor = props.activeBorderColor))}
        onBlur={() => setProp((props) => (props.isActive = false))}
        autoFocus={props.isFocused}
      />
    </div>
  )
}

type UserInputProps = {
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
  placeholder: string
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
  activeBorderColor: string
  isActive: boolean
}
export const UserInputDefaultProps: UserInputProps = {
  inputValue: "",
  fontSize: 16,
  textColor: "#000",
  width: 366,
  fontWeight: "normal",
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  marginBottom: 0,
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
}

UserInput.craft = {
  displayName: "User Input",
  props: UserInputDefaultProps,
  related: {
    settings: UserInputSettings,
  },
}
