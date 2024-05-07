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

export const UserTextSettings = () => {
  const {
    actions: { setProp },
    fontSize,
    fontWeight,
    text,
    textAlign,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    textColor,
    tagType,
  } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    fontWeight: node.data.props.fontWeight,
    textAlign: node.data.props.textAlign,
    marginLeft: node.data.props.marginLeft,
    marginRight: node.data.props.marginRight,
    marginTop: node.data.props.marginTop,
    marginBottom: node.data.props.marginBottom,
    textColor: node.data.props.textColor,
    tagType: node.data.props.tagType,
  }))

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Typography </span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2 p-2">
            <div className="style-control flex flex-col gap-2 pb-4 pt-2">
              <p className="text-md text-muted-foreground">Type</p>
              <Select
                defaultValue={tagType}
                onValueChange={(e) => {
                  setProp((props) => (props.tagType = e), 1000)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select text type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="p">Paragraph</SelectItem>
                    <SelectItem value="span">Span</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="style-control flex flex-col gap-2 pb-4 pt-2">
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
            <div className="style-control flex flex-col gap-2 pb-4 pt-2">
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
                    <SelectItem value="100">Thin</SelectItem>
                    <SelectItem value="400">Normal</SelectItem>
                    <SelectItem value="500">Medium</SelectItem>
                    <SelectItem value="600">Semi-bold</SelectItem>
                    <SelectItem value="700">Bold</SelectItem>
                    <SelectItem value="800">Extra bold</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="style-control flex flex-col gap-2 pb-4 pt-2">
              <p className="text-md text-muted-foreground">Align</p>
              <RadioGroup
                defaultValue="left"
                onValueChange={(event) => {
                  setProp((props) => (props.textAlign = event), 1000)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="left" id="r1" />
                  <Label htmlFor="r1">Left</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="center" id="r2" />
                  <Label htmlFor="r2">Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="right" id="r3" />
                  <Label htmlFor="r3">Right</Label>
                </div>
              </RadioGroup>
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
        <AccordionItem value="item-3">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Appearance</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-2">
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Text</p>
              <Input
                type="color"
                value={textColor}
                onChange={(e) => {
                  setProp((props) => (props.textColor = e.target.value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
