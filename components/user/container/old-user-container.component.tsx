import React from "react"
import { Element, useNode } from "@craftjs/core"
import ContentEditable from "react-contenteditable"

import { Button as CustomButton } from "@/components/ui/button"
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

interface containerProps {
  // width?: string
  // height?: string
  // colorBg?: string
  // colorText?: string
  ml?: string
  mt?: string
  mr?: string
  mb?: string
  pl?: string
  pt?: string
  pr?: string
  pb?: string
  radius?: string
  shadow?: string
  flexDirection?: string
  fillSpace?: string
  alignItems?: string
  justifyContent?: string
  flexWrap?: string
}

export const Container = ({
  ContainerDefaultProps: containerProps,
  children,
  ...props
}) => {
  const style = {
    width: `${ContainerDefaultProps.width}`,
    height: `${ContainerDefaultProps.height}`,
    backgroundColor: `${ContainerDefaultProps.colorBg}`,
    color: `${ContainerDefaultProps.colorText}`,
    marginLeft: `${ContainerDefaultProps.ml}px`,
    marginTop: `${ContainerDefaultProps.mt}px`,
    marginRight: `${ContainerDefaultProps.mr}px`,
    marginBottom: `${ContainerDefaultProps.mb}px`,
    paddingLeft: `${ContainerDefaultProps.pl}px`,
    paddingTop: `${ContainerDefaultProps.pt}px`,
    paddingRight: `${ContainerDefaultProps.pr}px`,
    paddingBottom: `${ContainerDefaultProps.pb}px`,
    borderRadius: `${ContainerDefaultProps.radius}`,
    boxShadow: `${ContainerDefaultProps.shadow}`,
    flexDirection: `${ContainerDefaultProps.flexDirection}`,
    flex: `${ContainerDefaultProps.fillSpace}`,
    alignItems: `${ContainerDefaultProps.alignItems}`,
    justifyContent: `${ContainerDefaultProps.justifyContent}`,
    flexWrap: `${ContainerDefaultProps.flexWrap}`,
  }
  const {
    connectors: { connect, drag },
  } = useNode()
  return (
    <Element
      canvas
      id={"container"}
      is="div"
      ref={(ref: any) => connect(drag(ref))}
      // style={{ minHeight: "100px", minWidth: "100px" }}
      // className={`bg-["${ContainerDefaultProps.colorBg}"] text-[${ContainerDefaultProps.colorText}]`}
      style={{ margin: '5px 0', background:style.backgroundColor, padding: `20px`, minWidth: "300px", minHeight: "300px" }}
      // {...props}
    >
      {children}
    </Element>
  )
}

export const ContainerSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div>
{<>
  <h1>Color of your container</h1>
  <input type="text" onChange={(e) => setProp((props) => (props.colorBg = e.target.value))} />
  </>
}

      <div className="flex items-center space-x-2">
        <Label>Button Text:</Label>
        <ContentEditable
          html={props.text}
          onChange={(e) =>
            setProp(
              (props) =>
                (props.text = e.target.value.replace(/<\/?["^>"]+(>|$)/g, "")),
              500
            )
          }
          tagName="p"
        />
      </div>

      <Label>Size</Label>
      <RadioGroup
        defaultValue={props.size}
        onValueChange={(e) => setProp((props) => (props.size = e))}
      >
        <div className="flex items-center space-x-2">
          <Label htmlFor="s1">Small</Label>
          <RadioGroupItem value="small" color="primary" id="s1" />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="s2">Medium</Label>
          <RadioGroupItem value="medium" color="primary" id="s2" />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="s3">Large</Label>
          <RadioGroupItem value="Large" color="primary" id="s3" />
        </div>
      </RadioGroup>
      <Label>Variant</Label>
      <Select
        onValueChange={(e) => {
          setProp((props) => (props.variant = e), 1000)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a your variant" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="destructive">Destructive</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="ghost">Ghost</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label>Color</Label>
      <RadioGroup
        defaultValue={props.color}
        onValueChange={(e) => setProp((props) => (props.color = e))}
      >
        <RadioGroupItem value="small" color="default" />
        <RadioGroupItem value="small" color="primary" />
        <RadioGroupItem value="small" color="primary" className="basis-" />
      </RadioGroup>
    </div>
  )
}

export const ContainerDefaultProps: containerProps = {

  width: "300px",
  height: "300px",
  colorBg: "#ffffff",
  colorText: "inherit",
  ml: "2",
  mt: "2",
  mr: "2",
  mb: "2",
  pl: "4",
  pt: "4",
  pr: "4",
  pb: "4",
  radius: "none",
  shadow: "none",
  flexDirection: "col",
  fillSpace: "100%",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "nowrap",
}

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
}
