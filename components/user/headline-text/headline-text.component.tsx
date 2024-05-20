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
  tagType,
  ...props
}) => {
  return (
    <ContentEditable
      html={text}
      disabled={true}
      onChange={(e) => console.log("Headline Text: ", e.target.value)}
      tagName={tagType}
      className={`font-[${fontWeight}]`}
      style={{
        fontSize: `${fontSize}px`,
        textAlign,
        fontWeight: `${fontWeight}`,
        marginLeft: `${marginLeft}px`,
        marginRight: `${marginRight}px`,
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        color: `${textColor}`,
        lineHeight: `${fontSize}px`,
        minWidth: "max-content",
      }}
    />
  )
}

export const HeadlineText = ({
  text,
  fontSize,
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
        className={`font-[${fontWeight}]`}
        style={{
          fontSize: `${fontSize}px`,
          textAlign,
          fontWeight: `${fontWeight}`,
          marginLeft: `${marginLeft}px`,
          marginRight: `${marginRight}px`,
          marginTop: `${marginTop}px`,
          marginBottom: `${marginBottom}px`,
          color: `${textColor}`,
        }}
      />
    </div>
  )
}

export const HeadlineTextDefaultProps = {
  text: "Headlines for your business",
  fontSize: 42,
  textColor: "inherit",
  fontWeight: "600",
  textAlign: "left",
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  marginBottom: 0,
  tagType: "h1",
}

HeadlineText.craft = {
  props: HeadlineTextDefaultProps,
  related: {
    settings: HeadlineTextSettings,
  },
}
