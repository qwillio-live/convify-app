import React, { useEffect, useState } from "react"
import ContentEditable from "react-contenteditable"

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
import { HeadlineTextSettings } from "./headline-text-settings"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { StyleProperty } from "../types/style.types"

export const HeadlineTextGen = ({
  text,
  fontSize,
  textAlign,
  fontWeight,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  textColor,
  fontFamily,
  tagType,
  ...props
}) => {
  return (
    <ContentEditable
      html={text}
      disabled={true}
      onChange={(e) => console.log("Headline Text: ", e.target.value)}
      tagName={tagType}
      style={{
        fontFamily: `var(${fontFamily?.value})`,
        fontSize: `${fontSize.value}px`,
        textAlign,
        fontWeight: `${fontWeight.value}`,
        marginLeft: `${marginLeft.value}px`,
        marginRight: `${marginRight.value}px`,
        marginTop: `${marginTop.value}px`,
        marginBottom: `${marginBottom.value}px`,
        color: `${textColor.value}`,
        lineHeight: `${fontSize.value}px`,
        minWidth: "max-content",
      }}
    />
  )
}

export const HeadlineText = ({
  text,
  fontSize,
  fontFamily,
  textAlign,
  fontWeight,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  textColor,
  tagType,
  ...props
}) => {
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
  const [editable, setEditable] = useState(false)
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const primaryTextColor = useAppSelector((state) => state.theme?.text?.primaryColor);

  useEffect(() => {
    setProp((props) => props.fontFamily.value = primaryFont, 200);
   },
  [primaryFont])

  useEffect(() => {
    setProp((props) => props.textColor.value = primaryTextColor, 200)
  },[primaryTextColor])

  useEffect(() => {
    if (selected) {
      return
    }

    setEditable(false)
  }, [selected])
  return (
    <div
      className="relative"
      {...props}
      ref={(ref: any) => ref && connect(drag(ref))}
      onClick={() => selected && setEditable(true)}
    >
      {isHovered && <Controller nameOfComponent={"HEADLINE"} />}
      <ContentEditable
        html={text}
        disabled={!editable}
        onChange={(e) =>
          setProp(
            (props) =>
              (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")),
            500
          )
        }
        tagName={tagType}
        style={{
          fontFamily: `var(${fontFamily?.value})`,
          fontSize: `${fontSize.value}px`,
          textAlign,
          fontWeight: `${fontWeight.value}`,
          marginLeft: `${marginLeft.value}px`,
          marginRight: `${marginRight.value}px`,
          marginTop: `${marginTop.value}px`,
          marginBottom: `${marginBottom.value}px`,
          color: `${textColor.value}`,
          // color: `${primaryTextColor}`
        }}
      />
    </div>
  )
}

interface HeadlineTextProps {
  text: string;
  fontSize: StyleProperty;
  fontFamily: StyleProperty;
  textColor: StyleProperty;
  fontWeight: StyleProperty;
  textAlign: StyleProperty;
  marginLeft: StyleProperty;
  marginRight: StyleProperty;
  marginTop: StyleProperty;
  marginBottom: StyleProperty;
  tagType: string;
}

export const HeadlineTextDefaultProps: HeadlineTextProps = {
  text: "Headlines for your business",
  fontSize: { value: 42, isCustomized: false, globalStyled: false },
  fontFamily: { value: "inherit", isCustomized: false, globalStyled: false },
  textColor: { value: "inherit", isCustomized: false, globalStyled: false },
  fontWeight: { value: "600", isCustomized: false, globalStyled: false },
  textAlign: { value: "left", isCustomized: false, globalStyled: false },
  marginLeft: { value: 0, isCustomized: false, globalStyled: false },
  marginRight: { value: 0, isCustomized: false, globalStyled: false },
  marginTop: { value: 0, isCustomized: false, globalStyled: false },
  marginBottom: { value: 0, isCustomized: false, globalStyled: false },
  tagType: "h1"
};


HeadlineText.craft = {
  props: HeadlineTextDefaultProps,
  related: {
    settings: HeadlineTextSettings,
  },
}
