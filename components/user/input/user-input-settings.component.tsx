import React, { useEffect, useCallback,useState } from "react"
import ContentEditable from "react-contenteditable"
import {throttle} from "lodash"
import { useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MoveHorizontal } from "lucide-react"

export const UserInputSettings = () => {
  const {
    actions: { setProp },
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    textColor,
    width,
    props,
  } = useNode((node) => ({
    props: node.data.props,
    marginLeft: node.data.props.marginLeft,
    marginRight: node.data.props.marginRight,
    marginTop: node.data.props.marginTop,
    marginBottom: node.data.props.marginBottom,
    textColor: node.data.props.textColor,
    width: node.data.props.width,
  }))
  const throttledSetProp = useCallback(
    throttle((property,value) => {
      setProp((prop) => {prop[property] = value},0);
    }, 200), // Throttle to 50ms to 200ms
    [setProp]
  );

  const handlePropChange = (property,value) => {
    throttledSetProp(property,value);
  };
  return (
    <>
      <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Content Options </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-4 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-row gap-1 items-center">
            <Checkbox
            value={props.inputRequired}
            onChange={(e) => setProp((props) => (props.inputRequired = e),1000)}
            id="required" />
              <label
                htmlFor="required"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 underline decoration-dotted"
              >
                Required
              </label>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-row gap-1 items-center">
            <Checkbox
            checked={props.floatingLabel}
            onCheckedChange={(e) => setProp((props) => (props.floatingLabel = e),1000)}
            id="floating-label" />
              <label
                htmlFor="floating-label"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 underline decoration-dotted"
              >
                Floating label
              </label>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-1 items-start">
              <label
                htmlFor="label-text"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 no-underline decoration-dotted"
              >
                Label
              </label>
              <Input
              value={props.label}
              onChange={(e) => setProp((props) => (props.label = e.target.value), 1000)}
              type={"text"}
              placeholder={"Enter placeholder text"}
              />
            </div>


            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-1 items-start">
              <label
                htmlFor="placeholder-text"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 no-underline decoration-dotted"
              >
                Placeholder
              </label>
              <Input
              value={props.placeholder}
              onChange={(e) => setProp((props) => (props.placeholder = e.target.value), 1000)}
              type={"text"}
              placeholder={"Enter placeholder text"}
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-1 items-start">
              <label
                htmlFor="placeholder-text"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 no-underline decoration-dotted"
              >
                Field name
              </label>
              <Input
              value={props.fieldName}
              onChange={(e) => setProp((props) => (props.fieldName = e.target.value), 1000)}
              type={"text"}
              placeholder={"Enter field name here"}
              />

            </div>

          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Design</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-2">
          <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Width</p>
              <Tabs
                defaultValue={props.size}
                value={props.size}
                onValueChange={(value) => {
                  setProp((props) => (props.size = value), 1000)
                  if(value === 'full') {
                    // setProp((props) => (props.fullWidth = true), 1000)
                  }else{
                    // setProp((props) => (props.fullWidth = false), 1000)
                  }
                }}
               className="flex-1">
                <TabsList className="w-full grid grid-cols-4 h-14">
                  <TabsTrigger className="h-12"  value="small">S</TabsTrigger>
                  <TabsTrigger  className="h-12" value="medium">M</TabsTrigger>
                  <TabsTrigger  className="h-12" value="large">L</TabsTrigger>
                  <TabsTrigger  className="h-12" value="full"><MoveHorizontal /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Background</p>
              <Input
                type="color"
                value={props.backgroundColor}
                onChange={(e) => {
                  // setProp((props) => (props.backgroundColor = e.target.value), 1000)
                  handlePropChange('backgroundColor',e.target.value);
                }}
              />
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
      </Accordion>
    </>
  )
}
