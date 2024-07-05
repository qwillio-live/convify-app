import React, { useCallback } from "react"
import { debounce, throttle } from "lodash"
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  MoveHorizontal,
} from "lucide-react"
import { useTranslations } from "next-intl"
import styled from "styled-components"

import { Element, Node, NodeHelpers, useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { Slider } from "@/components/custom-slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"

import { ScreenFooter } from "../screens/screen-footer.component"
import { Controller } from "../settings/controller.component"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"

export const FormSettings = () => {
  const {
    props: {
      padding,
      fullWidth,
      width,
      height,
      background,
      color,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      radius,
      shadow,
      flexDirection,
      fillSpace,
      alignItems,
      justifyContent,
      flexWrap,
      overflowY,
      overflowX,
      gap,
      borderColor,
      border,
      size,
      mobileFlexDirection,
      mobileJustifyContent,
      mobileAlignItems,
      settingsTab,
    },
    actions: { setProp },
  } = useNode((node) => ({
    props: node.data.props,
  }))
  const t = useTranslations("Components")
  const debouncedSetProp = useCallback(
    debounce((property, value) => {
      setProp((prop) => {
        prop[property] = value
      }, 0)
    }),
    [setProp]
  )
  const handlePropChangeDebounced = (property, value) => {
    debouncedSetProp(property, value)
  }
  const mobileScreen = useAppSelector((state:RootState) => state.theme?.mobileScreen);
  return (
    <>
      <Accordion
            value={settingsTab || "layout"}
            onValueChange={(value) => {
              setProp((props) => (props.settingsTab = value), 200)
            }}
            type="multiple"
            defaultValue={['layout']}
        className="w-full">
        <AccordionItem value="layout">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Layout")} </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            {/* <div className="grid grid-cols-2 items-center col-span-2 space-x-2">
              <Label className="text-md text-muted-foreground col-span-1">
                {t("Layout Desktop")}
              </Label>
              <Tabs
                value={flexDirection}
                defaultValue={flexDirection}
                onValueChange={(value) => {
                  setProp((props) => (props.flexDirection = value), 200)
                }}
                className="flex-1 col-span-1"
              >
                <TabsList className="flex-initial flex flex-row shrink-0">
                <TabsTrigger value="column">
                    <AlignVerticalJustifyStart size={16} />
                  </TabsTrigger>
                <TabsTrigger value="row">
                    <AlignHorizontalJustifyStart size={16} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="grid grid-cols-2 items-center col-span-2 space-x-2">
              <Label className="col-span-1 text-md text-muted-foreground">
                {t("Layout Mobile")}
              </Label>
              <Tabs
                value={mobileFlexDirection}
                defaultValue={mobileFlexDirection}
                onValueChange={(value) => {
                  setProp((props) => (props.mobileFlexDirection = value), 200)
                }}
                className="flex-1 col-span-1"
              >
                <TabsList className="flex-initial flex flex-row shrink-0">
                <TabsTrigger value="column">
                    <AlignVerticalJustifyStart size={16} />
                  </TabsTrigger>
                  <TabsTrigger value="row">
                    <AlignHorizontalJustifyStart size={16} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="col-span-2 flex flex-row items-center space-x-2 justify-between">
              <Label className="text-md text-muted-foreground">
                {t("Align Horizontal")}
              </Label>
              <Tabs
                value={mobileScreen ? mobileFlexDirection === "column" ? mobileAlignItems: mobileJustifyContent : flexDirection === "column" ? alignItems: justifyContent}
                defaultValue={mobileScreen ? mobileFlexDirection === "column" ? mobileAlignItems: mobileJustifyContent: flexDirection === "column" ? alignItems: justifyContent}
                onValueChange={(value) => {
                  if(mobileScreen){
                    mobileFlexDirection === "column" ? setProp((props) => (props.mobileAlignItems = value), 200) : setProp((props) => (props.mobileJustifyContent = value), 200)
                  }else{
                    flexDirection === "column" ? setProp((props) => (props.alignItems = value), 200) : setProp((props) => (props.justifyContent = value), 200)
                  }
                }}
                className="flex-initial flex flex-col shrink-0"
              >
                <TabsList className="w-full flex flex-row">
                  <TabsTrigger value="flex-start">
                    <AlignHorizontalJustifyStart size={16} />
                  </TabsTrigger>
                  <TabsTrigger value="center" >
                    <AlignHorizontalJustifyCenter size={16} />
                  </TabsTrigger>
                  <TabsTrigger value="flex-end">
                    <AlignHorizontalJustifyEnd size={16} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div> */}
{
  ((mobileScreen && mobileFlexDirection === "row") || (!mobileScreen && flexDirection === "row")) && (
    <div className="col-span-2 flex flex-row items-center space-x-2 justify-between">
    <Label className="text-md text-muted-foreground">
      {t("Align Vertical")}
    </Label>
    <Tabs
      value={mobileScreen ? mobileAlignItems: alignItems}
      defaultValue={mobileScreen ? mobileAlignItems: alignItems}
      onValueChange={(value) => {
        if(mobileScreen){
          setProp((props) => (props.mobileAlignItems = value), 200)
        }else{
          setProp((props) => (props.alignItems = value), 200)
        }
      }}
      className="flex-initial flex flex-col shrink-0"
    >
      <TabsList className="w-full flex flex-row">
        <TabsTrigger value="flex-start">
          <AlignVerticalJustifyStart  size={16} />
        </TabsTrigger>
        <TabsTrigger value="center" >
          <AlignVerticalJustifyCenter size={16} />
        </TabsTrigger>
        <TabsTrigger value="flex-end">
          <AlignVerticalJustifyEnd size={16} />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
  )
}
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
                <Label htmlFor="marginTop">{t("Gap")}</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                  {gap}
                </span>
              </div>
              <Slider
                className=""
                defaultValue={[gap]}
                value={[gap]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) =>
                  // setProp((props) => (props.marginTop = e),200)
                  // handlePropChange("marginTop",e)
                  handlePropChangeDebounced("gap", e)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="design">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Design")} </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="flex flex-row items-center col-span-2 space-x-2">
              <label
                htmlFor="backgroundcolor"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-2/3"
              >
                {t("Background Color")}
              </label>
              <Input
                defaultValue={"rgba(0,0,0,0)"}
                value={background}
                onChange={(e) => {
                  debouncedSetProp("background", e.target.value)
                }}
                className="basis-1/3"
                type={"color"}
                id="backgroundcolor"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="spacing">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Spacing")} </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <Label className="text-md text-muted-foreground">
                {t("Width")}
              </Label>
              <Tabs
                value={size}
                defaultValue={size}
                onValueChange={(value) => {
                  setProp((props) => (props.size = value), 1000)
                }}
                className="flex-1"
              >
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="small">{t("S")}</TabsTrigger>
                  <TabsTrigger value="medium">{t("M")}</TabsTrigger>
                  <TabsTrigger value="large">{t("L")}</TabsTrigger>
                  <TabsTrigger value="full">
                    <MoveHorizontal />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
                <Label htmlFor="marginTop">{t("Top")}</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                  {marginTop}
                </span>
              </div>
              <Slider
                className=""
                defaultValue={[marginTop]}
                value={[marginTop]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) =>
                  // setProp((props) => (props.marginTop = e),200)
                  // handlePropChange("marginTop",e)
                  handlePropChangeDebounced("marginTop", e)
                }
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
                <Label htmlFor="marginTop">{t("Bottom")}</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                  {marginBottom}
                </span>
              </div>
              <Slider
                defaultValue={[marginBottom]}
                value={[marginBottom]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) =>
                  // setProp((props) => (props.marginBottom = e),200)
                  // handlePropChange("marginBottom",e)
                  handlePropChangeDebounced("marginBottom", e)
                }
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
                <Label htmlFor="marginTop">{t("Right")}</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                  {marginRight}
                </span>
              </div>
              <Slider
                defaultValue={[marginRight]}
                value={[marginRight]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) =>
                  // setProp((props) => (props.marginRight = e),200)
                  // handlePropChange("marginRight",e)
                  handlePropChangeDebounced("marginRight", e)
                }
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
                <Label htmlFor="marginTop">{t("Left")}</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                  {marginLeft}
                </span>
              </div>
              <Slider
                defaultValue={[marginLeft]}
                value={[marginLeft]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) =>
                  // setProp((props) => (props.marginLeft = e),200)
                  // handlePropChange("marginLeft",e)
                  handlePropChangeDebounced("marginLeft", e)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* <AccordionItem value="item-4">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Padding </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Left</p>
              <Input
                type="number"
                value={paddingLeft}
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
                value={paddingTop}
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
                value={paddingRight}
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
                value={paddingBottom}
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

        <AccordionItem value="item-5">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Decoration </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Border</p>
              <Input
                type="number"
                value={border}
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
                value={radius}
                placeholder={radius}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.radius = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Shadow</p>
              <Input
                type="number"
                value={shadow}
                placeholder={shadow}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.shadow = e.target.value), 1000)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Alignment </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-1 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Direction</p>
              <RadioGroup
                defaultValue="column"
                value={flexDirection}
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
              </RadioGroup>
            </div>

            <div className="style-control col-span-1 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Fill Space</p>
              <RadioGroup
                defaultValue={fullWidth}
                value={fullWidth}
                onValueChange={(value) => {
                  setProp((props) => (props.fullWidth = value), 1000)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"1"} id="r2" />
                  <Label htmlFor="r2">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"0"} id="r3" />
                  <Label htmlFor="r3">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="style-control col-span-1 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Align</p>
              <RadioGroup
                defaultValue={alignItems}
                value={alignItems}
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
                value={justifyContent}
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
              <Input
                type="number"
                value={gap}
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
        </AccordionItem> */}
      </Accordion>
    </>
  )
}
