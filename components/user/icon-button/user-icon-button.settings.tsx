import React from "react"
import {
  Activity,
  Anchor,
  Aperture,
  ArrowRight,
  Disc,
  DollarSign,
  Mountain,
  MoveHorizontal,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyCenter,
  AlignHorizontalSpaceBetween
} from "lucide-react"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button as CustomButton } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import {
  IconButtonDefaultProps,
  IconButtonGen,
} from "./user-icon-button.component"
import useButtonThemePresets from "./useButtonThemePresets"
import { useAppSelector } from "@/lib/state/flows-state/hooks"

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
  const {filledPreset, outLinePreset} = useButtonThemePresets();
  const addPresetStyles = (preset) => {
    setProp((props) => {
      Object.keys(preset).forEach((key) => {
        if(key !== "text" && key !== "icon" && key !== "enableIcon")
        props[key] = preset[key]
      })
    }, 1000)
  }

  const themeBackgroundColor = useAppSelector((state) => state?.theme?.general?.backgroundColor)

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Content </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="flex items-center col-span-2 space-x-2">
              <Checkbox
                checked={enableIcon}
                onCheckedChange={(e) => {
                  setProp((props) => (props.enableIcon = e), 1000)
                }}
                id="enableIcon"
              />
              <label
                htmlFor="enableIcon"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enable icon
              </label>
            </div>
            <div className="style-control col-span-2 flex w-full grow-0 basis-2/4 flex-row items-center gap-2">
              {enableIcon && (
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
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Design </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-4 p-2">

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Width</p>
              <ToggleGroup
              defaultValue={size}
              onValueChange={(value) => {
                setProp((props) => (props.size = value), 1000)
                if(value === 'full') {
                  setProp((props) => (props.fullWidth = true), 1000)
                }else{
                  setProp((props) => (props.fullWidth = false), 1000)
                }
              }}
              variant={"outline"}
              value={size}
              type="single">
                <ToggleGroupItem value="small" aria-label="Toggle small">
                  S
                </ToggleGroupItem>
                <ToggleGroupItem value="medium" aria-label="Toggle medium">
                  M
                </ToggleGroupItem>
                <ToggleGroupItem value="large" aria-label="Toggle large">
                  L
                </ToggleGroupItem>
                <ToggleGroupItem value="full" aria-label="Toggle full">
                  <MoveHorizontal />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Content align</p>
              <ToggleGroup
              defaultValue={justifyContent}
              onValueChange={(value) => {
                setProp((props) => (props.justifyContent = value), 1000)
              }}
              variant={"outline"}
              value={justifyContent}
              type="single">
                <ToggleGroupItem value="start" aria-label="Toggle start">
                  <AlignHorizontalJustifyStart />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Toggle center">
                  <AlignHorizontalJustifyCenter />
                </ToggleGroupItem>
                <ToggleGroupItem value="end" aria-label="Toggle end">
                  <AlignHorizontalJustifyEnd />
                </ToggleGroupItem>
                <ToggleGroupItem value="space-between" aria-label="Toggle space between">
                  <AlignHorizontalSpaceBetween />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Spacing </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
          <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <p className="text-md text-muted-foreground">Top</p>
              <div className="flex w-full basis-full flex-row items-center gap-2">
              <Slider
                className=""
                defaultValue={[marginTop]}
                value={[marginTop]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) =>
                  setProp((props) => (props.marginTop = e), 1000)
                }
              />
              <span className="font-medium">{marginTop}</span>
              </div>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <p className="text-md text-muted-foreground">Bottom</p>
              <div className="flex w-full basis-full flex-row items-center gap-2">
              <Slider
                defaultValue={[marginBottom]}
                value={[marginBottom]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) =>
                  setProp((props) => (props.marginBottom = e), 1000)
                }
              />
              <span className="font-medium">{marginBottom}</span>
              </div>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <p className="text-md text-muted-foreground">Right</p>
              <div className="flex w-full basis-full flex-row items-center gap-2">

              <Slider
                defaultValue={[marginRight]}
                value={[marginRight]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) =>
                  setProp((props) => (props.marginRight = e), 1000)
                }
              />
              <span className="font-medium">{marginRight}</span>
              </div>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <p className="text-md text-muted-foreground">Left</p>
              <div className="flex w-full basis-full flex-row items-center gap-2">

              <Slider
                defaultValue={[marginLeft]}
                value={[marginLeft]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) =>
                  setProp((props) => (props.marginLeft = e), 1000)
                }
              />
              <span className="font-medium">{marginLeft}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Styles </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-4">
            <Card onClick={() => addPresetStyles(filledPreset)}>
                <IconButtonGen {...filledPreset} size="full" />
              </Card>
              <Card onClick={() => addPresetStyles(outLinePreset)}>
                <IconButtonGen {...outLinePreset} size="full" />
              </Card>
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

        <AccordionItem value="item-6">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Padding </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Left</p>
              <Input
                type="number"
                placeholder={paddingLeft}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.paddingLeft = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Top</p>
              <Input
                type="number"
                placeholder={paddingTop}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.paddingTop = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Right</p>
              <Input
                type="number"
                placeholder={paddingRight}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.paddingRight = e.target.value),
                    1000
                  )
                }
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Bottom</p>
              <Input
                type="number"
                placeholder={paddingBottom}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.paddingBottom = e.target.value),
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
                  setProp((props) => (props.background = e.target.value), 1000)
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

            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Gap</p>
              <Input
                type="number"
                placeholder={gap}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.gap = e.target.value), 1000)
                }
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
              <Input
                type="number"
                placeholder={border}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.border = e.target.value), 1000)
                }
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
              <Input
                type="number"
                placeholder={radius}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.radius = e.target.value), 1000)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
