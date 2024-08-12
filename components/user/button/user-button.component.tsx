import React from "react"
import { useNode } from "@/lib/craftjs"
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

export const Button = ({
  size,
  variant,
  color,
  text,
  marginLeft = 0,
  marginRight = 0,
  marginTop = 0,
  marginBottom = 0,
  background,
  custom,
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
      className="relative  border border-dashed border-transparent transition-all duration-200 hover:border-blue-400 focus:border-blue-400"
      variant={variant}
      style={{
        ...(custom
          ? { color: `${color}`, backgroundColor: `${background}` }
          : null),
        marginLeft: `${marginLeft}px`,
        marginRight: `${marginRight}px`,
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
      }}
      {...props}
    >
      {isHovered && <Controller nameOfComponent={"BUTTON"} />}

      {/** @ts-ignore */}
      {/** @ts-ignore */}
      <ContentEditable
        html={text}
        onChange={(e) =>
          setProp(
            (props) =>
              (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")),
            500
          )
        }
        tagName="p"
      />
    </CustomButton>
  )
}

export const ButtonSettings = () => {
  const {
    actions: { setProp },
    props: { props, size, variant, background, color, text, custom },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-2">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Margin </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Left</p>
              <Input
                type="number"
                placeholder={props.marginLeft}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginLeft = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Top</p>
              <Input
                type="number"
                placeholder={props.marginTop}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginTop = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Right</p>
              <Input
                type="number"
                placeholder={props.marginRight}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginRight = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Bottom</p>
              <Input
                type="number"
                placeholder={props.marginBottom}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.marginBottom = e.target.value),
                    1000
                  )
                }
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
      </Accordion>
    </>
  )
}

export const ButtonDefaultProps = {
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
}

Button.craft = {
  rules: {
    canMoveIn: () => true,
  },
  props: ButtonDefaultProps,
  related: {
    settings: ButtonSettings,
  },
}
