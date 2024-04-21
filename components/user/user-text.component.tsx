import React, { useEffect, useState } from "react"
import { useNode } from "@craftjs/core"
import ContentEditable from "react-contenteditable"

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
import { Controller } from "./settings/controller.component"

export const UserText = ({
  text = "",
  fontSize = 20,
  textAlign = "left",
  fontWeight = "font-normal",
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
      className="relative border border-dashed border-transparent transition-all duration-200 hover:border-blue-400 focus:border-blue-400"
      {...props}
      ref={(ref: HTMLElement | null) => ref && connect(drag(ref))}
      onClick={() => selected && setEditable(true)}
    >
      {isHovered && <Controller nameOfComponent={"TEXT"}/>}
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
        tagName="p"
        className={`${fontWeight}`}
        style={{ fontSize: `${fontSize}px`, textAlign }}
      />
    </div>
  )
}

export const UserTextSettings = () => {
  const {
    actions: { setProp },
    fontSize,
  } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    fontWeight: node.dom?.style.fontWeight,
  }))

  return (
    <>
      <div className="flex basis-full flex-col justify-between gap-4">
        <div className="style-control flex flex-col gap-2 border-b pb-4 pt-2">
          <p className="text-md text-muted-foreground">Font Size</p>
          <Slider
            defaultValue={[33]}
            max={100}
            min={12}
            step={1}
            onValueChange={(value) => {
              setProp((props) => (props.fontSize = value), 1000)
            }}
          />
        </div>
        <div className="style-control flex flex-col gap-2 border-b pb-4 pt-2">
          <p className="text-md text-muted-foreground">Font Weight</p>
          <Select
            onValueChange={(e) => {
              setProp((props) => (props.fontWeight = e), 1000)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select font weight" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Font Weight</SelectLabel>
                <SelectItem value="font-light">Light</SelectItem>
                <SelectItem value="font-normal">Normal</SelectItem>
                <SelectItem value="font-medium">Medium</SelectItem>
                <SelectItem value=" font-semibold">Semi-bold</SelectItem>
                <SelectItem value="font-bold">Bold</SelectItem>
                <SelectItem value="font-extrabold">Extra bold</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )
}

export const TextDefaultProps = {
  text: "Your text here",
  fontSize: 20,
}

UserText.craft = {
  props: TextDefaultProps,
  related: {
    settings: UserTextSettings,
  },
}
