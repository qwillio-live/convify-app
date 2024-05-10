import React from "react"
import {
  Activity,
  Anchor,
  Aperture,
  ArrowRight,
  Disc,
  DollarSign,
  Mountain,
} from "lucide-react"
import ContentEditable from "react-contenteditable"

import { useNode } from "@/lib/craftjs"
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
import { type } from "os"
import styled from "styled-components"

const IconsList = {
  aperture: <Aperture />,
  activity: <Activity />,
  dollarsign: <DollarSign />,
  anchor: <Anchor />,
  disc: <Disc />,
  mountain: <Mountain />,
  arrowright: <ArrowRight />,
}
interface StyledCustomButtonProps {
  color?: string;
  background?: string;
  backgroundHover?: string;
  colorHover?: string;
  marginLeft?: string | number;
  width?: string | number;
  height?: string | number;
  marginRight?: string | number;
  marginTop?: string | number;
  marginBottom?: string | number;
  paddingLeft?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  radius?: number;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  gap?: number;
  border?: number;
  borderColor?: string;
}
const StyledCustomButton = styled(CustomButton)<StyledCustomButtonProps>`
  position: relative;
  gap: 2px;
  border: 1px dashed transparent;
  transition: all 0.2s ease;
  &:hover {
    border-style: solid;
    border-color: #3182ce; /* Change to your desired hover border color */
    background: ${(props) => props.backgroundHover};
    color: ${(props) => props.colorHover};
  }
  &:focus {
    border-color: #3182ce; /* Change to your desired focus border color */
  }
  background: ${(props) => props.background};
  color: ${(props) => props.color};

  margin-left: ${(props) => props.marginLeft}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  margin-right: ${(props) => props.marginRight}px;
  margin-top: ${(props) => props.marginTop}px;
  margin-bottom: ${(props) => props.marginBottom}px;
  padding-left: ${(props) => props.paddingLeft}px;
  padding-top: ${(props) => props.paddingTop}px;
  padding-right: ${(props) => props.paddingRight}px;
  padding-bottom: ${(props) => props.paddingBottom}px;
  border-radius: ${(props) => props.radius}px;
  flex-direction: ${(props) => props.flexDirection};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  gap: ${(props) => props.gap}px;
  border: ${(props) => props.border}px solid ${(props) => props.borderColor};
`;

export const IconButton = ({
  disabled,
  enableIcon,
  size,
  color,
  text,
  marginLeft = 0,
  width: width,
  height: height,
  marginRight = 0,
  marginTop = 0,
  marginBottom = 0,
  background,
  backgroundHover,
  colorHover,
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
<StyledCustomButton
  ref={(ref:any) => connect(drag(ref))}
  color={color}
  background={background}
  backgroundHover={backgroundHover}
  colorHover={colorHover}
  marginLeft={marginLeft}
  width={width}
  height={height}
  marginRight={marginRight}
  marginTop={marginTop}
  marginBottom={marginBottom}
  paddingLeft={paddingLeft}
  paddingTop={paddingTop}
  paddingRight={paddingRight}
  paddingBottom={paddingBottom}
  radius={radius}
  flexDirection={flexDirection}
  alignItems={alignItems}
  justifyContent={justifyContent}
  gap={gap}
  border={border}
  borderColor={borderColor}
  {...props}
  onClick={() => console.log("Button clicked", text)}
>
  {isHovered && <Controller nameOfComponent="BUTTON" />}

  <ContentEditable
    html={text}
    disabled={disabled}
    onChange={(e) =>
      setProp(
        (props) =>
          (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, '')),
        500
      )
    }
    tagName="span"
  />
  {enableIcon && IconsList[icon]}
</StyledCustomButton>

  )
}

export const IconButtonSettings = () => {
  const {
    actions: { setProp },
    props: {
      enableIcon,
      props,
      size,
      background,
      backgroundHover,
      colorHover,
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
          <div className="flex items-center col-span-2 space-x-2">
              <Checkbox
              checked={enableIcon}
              onCheckedChange={(e) => {
                setProp((props) => (props.enableIcon = e), 1000)
              }}
              id="enableIcon" />
              <label
                htmlFor="enableIcon"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enable icon
              </label>
            </div>
            <div className="style-control col-span-2 flex w-full grow-0 basis-2/4 flex-row items-center gap-2">
            {
              enableIcon && (
                <>
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
                      <SelectItem value="arrowright">
                        <ArrowRight />
                      </SelectItem>
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
                </>
              )
            }

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

                <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
                  <p className="text-md text-muted-foreground">Text Hover</p>
                  <Input
                    type="color"
                    value={colorHover}
                    onChange={(e) => {
                      setProp((props) => (props.colorHover = e.target.value), 1000)
                    }}
                  />
                </div>
                <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
                  <p className="text-md text-muted-foreground">Background Hover</p>
                  <Input
                    type="color"
                    value={backgroundHover}
                    onChange={(e) => {
                      setProp(
                        (props) => (props.backgroundHover = e.target.value),
                        1000
                      )
                    }}
                  />
                </div>
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

type IconButtonProps = {
  disabled: boolean
  enableIcon: boolean
  size: string
  background: string
  backgroundHover: string
  color: string
  colorHover: string
  text: string
  icon: string
  paddingLeft: string | number
  paddingTop: string | number
  paddingRight: string | number
  paddingBottom: string | number
  radius: string
  flexDirection: string
  alignItems: string
  justifyContent: string
  gap: number
  border: number
  borderColor: string
  marginLeft: number | number
  marginTop: number | number
  marginRight: number | number
  marginBottom: number | number
  width: string | number
  height: string | number
}

export const IconButtonDefaultProps:IconButtonProps = {
  disabled: false,
  enableIcon: true,
  width: "366",
  height: "auto",
  size: "small",
  background: "#4050ff",
  color: "#ffffff",
  backgroundHover: "#3041ff",
  colorHover: "#ffffff",
  text: "Get quote",
  marginLeft: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  icon: "arrowright",
  paddingLeft: "16",
  paddingTop: "26",
  paddingRight: "16",
  paddingBottom: "26",
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
