import React from "react"
import { useNode } from "@/lib/craftjs"
import {
  Activity,
  Anchor,
  Aperture,
  Disc,
  DollarSign,
  Mountain,
} from "lucide-react"
import ContentEditable from "react-contenteditable"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button as CustomButton } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

const IconsList = {
  aperture: <Aperture />,
  activity: <Activity />,
  dollarsign: <DollarSign />,
  anchor: <Anchor />,
  disc: <Disc />,
  mountain: <Mountain />,
}
export const IconButton = ({
  size,
  variant,
  color,
  text,
  marginLeft = 0,
  width: width,
  height: height,
  marginRight = 0,
  marginTop = 0,
  marginBottom = 0,
  background,
  custom,
  icon,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  radius,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  border,
  borderColor,
  ...props
}) => {
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))
  return (
    <CustomButton
      ref={(ref: any) => connect(drag(ref))}
      // size={size}
      className="relative  gap-2  border border-dashed border-transparent transition-all duration-200 hover:border-blue-400 focus:border-blue-400"
      variant={variant}
      style={{
        ...(custom
          ? { color: `${color}`, backgroundColor: `${background}` }
          : null),
        marginLeft: `${marginLeft}px`,
        width,
        height,
        marginRight: `${marginRight}px`,
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        paddingLeft: `${paddingLeft}px`,
        paddingTop: `${paddingTop}px`,
        paddingRight: `${paddingRight}px`,
        paddingBottom: `${paddingBottom}px`,
        borderRadius: `${radius}px`,
        flexDirection: flexDirection,
        alignItems: alignItems,
        justifyContent: justifyContent,
        gap: `${gap}px`,
        border: `${border}px solid ${borderColor}`,
      }}
      {...props}
    >
      {isHovered && <Controller nameOfComponent={"BUTTON"} />}
      <ContentEditable
        html={text}
        onChange={(e) =>
          setProp(
            (props) =>
              (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")),
            500
          )
        }
        tagName="span"
      />
      {IconsList[icon]}
    </CustomButton>
  )
}

export const IconButtonSettings = () => {
  const {
    actions: { setProp },
    props: {
      props,
      size,
      variant,
      background,
      color,
      text,
      custom,
      icon,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      radius,
      flexDirection,
      alignItems,
      justifyContent,
      gap,
      border,
      borderColor,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      width,
      height,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Button content </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-2/4 flex-row items-center gap-2">
              <p className="text-md flex-1 text-muted-foreground">Icon</p>
              <Select
                defaultValue={icon}
                onValueChange={(e) => {
                  setProp((props) => (props.icon = e), 1000)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="aperture">
                      <Aperture />
                    </SelectItem>
                    <SelectItem value="activity">
                      <Activity />
                    </SelectItem>
                    <SelectItem value="dollarsign">
                      <DollarSign />
                    </SelectItem>
                    <SelectItem value="anchor">
                      <Anchor />
                    </SelectItem>
                    <SelectItem value="disc">
                      <Disc />
                    </SelectItem>
                    <SelectItem value="mountain">
                      <Mountain />
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Dimensions </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Width</p>
              <Input
                defaultValue={width}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.width = e.target.value))
                }
              />
            </div>
            <div className="style-control col-span-2 flex grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Height</p>
              <Input
                defaultValue={height}
                onChange={(e) =>
                  setProp((props) => (props.height = e.target.value))
                }
                className="w-full"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Margin </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Left</p>
              <Slider
                defaultValue={[0]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.marginLeft = value), 1000)
                }}
              />
            </div>
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Top</p>
              <Slider
                defaultValue={[0]}
                max={100}
                min={0}
                step={1}
                onValueChange={(value) => {
                  setProp((props) => (props.marginTop = value), 1000)
                }}
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Right</p>
              <Slider
                defaultValue={[0]}
                max={100}
                min={0}
                step={1}
                onValueChange={(value) => {
                  setProp((props) => (props.marginRight = value), 1000)
                }}
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Bottom</p>
              <Slider
                defaultValue={[0]}
                max={100}
                min={0}
                step={1}
                onValueChange={(value) => {
                  setProp((props) => (props.marginBottom = value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Padding </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Left</p>
              <Slider
                defaultValue={[paddingLeft]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.paddingLeft = value), 1000)
                }}
              />
            </div>
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Top</p>
              <Slider
                defaultValue={[paddingTop]}
                max={100}
                min={0}
                step={1}
                onValueChange={(value) => {
                  setProp((props) => (props.paddingTop = value), 1000)
                }}
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Right</p>
              <Slider
                defaultValue={[paddingRight]}
                max={100}
                min={0}
                step={1}
                onValueChange={(value) => {
                  setProp((props) => (props.paddingRight = value), 1000)
                }}
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Bottom</p>
              <Slider
                defaultValue={[paddingBottom]}
                max={100}
                min={0}
                step={1}
                onValueChange={(value) => {
                  setProp((props) => (props.paddingBottom = value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Appearance</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="custom"
                checked={custom}
                onCheckedChange={(e) => {
                  setProp((props) => (props.custom = e), 1000)
                }}
              />
              <label
                htmlFor="custom"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Custom button
              </label>
            </div>

            {!custom ? (
              <div className="style-control flex flex-col gap-2 pb-4 pt-2">
                <p className="text-md text-muted-foreground">Variant</p>
                <Select
                  onValueChange={(e) => {
                    setProp((props) => (props.variant = e), 1000)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Style variant</SelectLabel>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="destructive">Destructive</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="ghost">Ghost</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <>
                <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
                  <p className="text-md text-muted-foreground">Text</p>
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      setProp((props) => (props.color = e.target.value), 1000)
                    }}
                  />
                </div>
                <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
                  <p className="text-md text-muted-foreground">Background</p>
                  <Input
                    type="color"
                    value={background}
                    onChange={(e) => {
                      setProp(
                        (props) => (props.background = e.target.value),
                        1000
                      )
                    }}
                  />
                </div>
              </>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Alignment </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Direction</p>
              <RadioGroup
                defaultValue={flexDirection}
                onValueChange={(value) => {
                  setProp((props) => (props.flexDirection = value), 1000)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="column" id="r2" />
                  <Label htmlFor="r2">Column</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="row" id="r3" />
                  <Label htmlFor="r3">Row</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="column-reverse" id="r4" />
                  <Label htmlFor="r4">Column reverse</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="row-reverse" id="r5" />
                  <Label htmlFor="r5">Row reverse</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="style-control col-span-1 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Align</p>
              <RadioGroup
                defaultValue={alignItems}
                onValueChange={(value) => {
                  setProp((props) => (props.alignItems = value), 1000)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"start"} id="r2" />
                  <Label htmlFor="r2">Start</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"center"} id="r3" />
                  <Label htmlFor="r3">Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"end"} id="r4" />
                  <Label htmlFor="r4">End</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="style-control col-span-1 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Justify</p>
              <RadioGroup
                defaultValue={justifyContent}
                onValueChange={(value) => {
                  setProp((props) => (props.justifyContent = value), 1000)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"start"} id="r2" />
                  <Label htmlFor="r2">Start</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"center"} id="r3" />
                  <Label htmlFor="r3">Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"end"} id="r4" />
                  <Label htmlFor="r4">End</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Gap</p>
              <Slider
                defaultValue={[gap]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.gap = value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Decoration </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Border</p>
              <Slider
                defaultValue={[border]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.border = value), 1000)
                }}
              />
            </div>
            <div className="style-control col-span-2 flex flex-col gap-2">
              <p className="text-md text-muted-foreground">Border color</p>
              <Input
                type="color"
                value={borderColor}
                onChange={(e) => {
                  setProp((props) => (props.borderColor = e.target.value), 1000)
                }}
              />
            </div>
            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Radius</p>
              <Slider
                defaultValue={[radius]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.radius = value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export const IconButtonDefaultProps = {
  width: "auto",
  height: "auto",
  size: "small",
  variant: "primary",
  custom: false,
  background: "inherit",
  color: "inherit",
  text: "Click me",
  marginLeft: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  icon: "aperture",
  paddingLeft: "4",
  paddingTop: "4",
  paddingRight: "4",
  paddingBottom: "4",
  radius: "none",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  border: 0,
  borderColor: "inherit",
}

IconButton.craft = {
  props: IconButtonDefaultProps,
  related: {
    settings: IconButtonSettings,
  },
}
