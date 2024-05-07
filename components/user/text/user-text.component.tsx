import React, { useEffect, useState } from "react"
import { useNode } from "@/lib/craftjs"
import ContentEditable from "react-contenteditable"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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

import { Input } from "@/components/ui/input"
import { Controller } from "../settings/controller.component"
import { UserTextSettings } from "./user-text-settings"

export const UserText = ({
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
      {isHovered && <Controller nameOfComponent={"TEXT"} />}
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

export const TextDefaultProps = {
  text: "Your text here",
  fontSize: 24,
  textColor: "inherit",
  fontWeight: "400",
  textAlign: "left",
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  marginBottom: 0,
  tagType: "p",
}

UserText.craft = {
  props: TextDefaultProps,
  related: {
    settings: UserTextSettings,
  },
}
