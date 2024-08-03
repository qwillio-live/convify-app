import React, { useCallback, useEffect } from "react"
import { debounce, throttle } from "lodash"
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceBetween,
  MoveHorizontal,
  AlignCenter as TextAlignCenter,
  AlignLeft as TextAlignLeft,
  AlignRight as TextAlignRight,
} from "lucide-react"
import { useTranslations } from "next-intl"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useNode } from "@/lib/craftjs"
import {
  useScreenNames,
  useScreensLength,
} from "@/lib/state/flows-state/features/screenHooks"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button as CustomButton } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Checkbox } from "@/components/custom-checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/custom-select"
import { Slider } from "@/components/custom-slider"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/custom-tabs"

import { Controller } from "../settings/controller.component"
import {
  HeadlineTextDefaultProps,
  HeadlineTextGen,
} from "./headline-text.component"
import useHeadlineThemePresets from "./useHeadlineThemePresets"

export const HeadlineTextSettings = () => {
  const t = useTranslations("Components")
  const screensLength = useScreensLength()
  const selectedScreen = useAppSelector(
    (state: RootState) => state.screen?.selectedScreen ?? 0
  )

  const mobileScreen = useAppSelector(
    (state: RootState) => state.theme?.mobileScreen
  )

  const nextScreenName =
    useAppSelector(
      (state: RootState) =>
        state?.screen?.screens[
          selectedScreen + 1 < (screensLength || 0) ? selectedScreen + 1 : 0
        ]?.screenName
    ) || ""

  const {
    actions: { setProp },
    props: {
      props,
      size,
      containerBackground,
      justifyContent,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      settingsTab,
      preset,
      fontWeight,
      fontSize,
      tagType,
      textColor,
      textAlign,
      mobileFontSize,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const { h1Preset, h2Preset } = useHeadlineThemePresets()
  const addPresetStyles = (preset = h1Preset) => {
    const staticStyles = [
      "buttonSize",
      "settingsTab",
      "containerBackground",
      "text",
      "icon",
      "enableIcon",
      "size",
      "fullWidth",
      "width",
      "height",
      "paddingLeft",
      "justifyContent",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "flexDirection",
      "alignItems",
      "marginLeft",
      "marginTop",
      "marginRight",
      "marginBottom",
      "fontWeight",
      "fontSize",
      "tagType",
      "textColor",
      "textAlign",
      "mobileFontSize",
    ]
    setProp((props) => {
      Object.keys(preset).forEach((key) => {
        if (!staticStyles.includes(key)) props[key] = preset[key]
      })
    }, 1000)
  }

  const throttledSetProp = useCallback(
    throttle((property, value) => {
      setProp((prop) => {
        prop[property] = value
      }, 0)
    }, 200), // Throttle to 50ms to 200ms
    [setProp]
  )

  const handlePropChange = (property, value) => {
    throttledSetProp(property, value)
  }

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

  const themeBackgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )

  return (
    <>
      <Accordion
        value={settingsTab}
        onValueChange={(value) => {
          setProp((props) => (props.settingsTab = value), 200)
        }}
        type="multiple"
        defaultValue={["design"]}
        className="mb-10 w-full"
      >
        <AccordionItem value="design">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Design")} </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-4 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <p className="text-md text-muted-foreground">{t("Align")}</p>
              <Tabs
                value={justifyContent}
                defaultValue={justifyContent}
                onValueChange={(value) => {
                  setProp((props) => (props.justifyContent = value), 1000)
                }}
                className="flex-1"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="start">
                    <AlignHorizontalJustifyStart />
                  </TabsTrigger>
                  <TabsTrigger value="center">
                    <AlignHorizontalJustifyCenter />
                  </TabsTrigger>
                  <TabsTrigger value="end">
                    <AlignHorizontalJustifyEnd />
                  </TabsTrigger>
                  {/* <TabsTrigger value="space-between">
                    <AlignHorizontalSpaceBetween />
                  </TabsTrigger>  */}
                </TabsList>
              </Tabs>
            </div>

            <div className="col-span-2 flex flex-row items-center space-x-2">
              <label
                htmlFor="backgroundcolor"
                className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Background Color")}
              </label>
              <Input
                defaultValue={containerBackground}
                value={containerBackground}
                onChange={(e) => {
                  debouncedSetProp("containerBackground", e.target.value)
                }}
                className="basis-1/3"
                type={"color"}
                id="backgroundcolor"
              />
            </div>

            {mobileScreen ? (
              <div className="style-control col-span-2 flex w-full flex-col gap-2 pb-4 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-md text-muted-foreground">
                    {t("FontSize")}
                  </p>
                  <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                    {mobileFontSize}
                  </span>
                </div>
                <Slider
                  className=""
                  defaultValue={[mobileFontSize]}
                  value={[mobileFontSize]}
                  max={100}
                  min={12}
                  step={1}
                  onValueChange={(e) =>
                    handlePropChangeDebounced("mobileFontSize", e)
                  }
                />
              </div>
            ) : (
              <div className="style-control col-span-2 flex w-full flex-col gap-2 pb-4 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-md text-muted-foreground">
                    {t("FontSize")}
                  </p>
                  <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                    {fontSize}
                  </span>
                </div>
                <Slider
                  className=""
                  defaultValue={[fontSize]}
                  value={[fontSize]}
                  max={100}
                  min={12}
                  step={1}
                  onValueChange={(e) =>
                    handlePropChangeDebounced("fontSize", e)
                  }
                />
              </div>
            )}

            <div className="style-control col-span-2 flex flex-col gap-2 pb-4 pt-2">
              <p className="text-md text-muted-foreground">{t("FontWeight")}</p>
              <Select
                value={fontWeight}
                defaultValue={fontWeight}
                onValueChange={(value) => {
                  setProp((props) => (props.fontWeight = value), 1000)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={"Type your weight"} />
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="spacing">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Spacing")} </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <p className="text-md text-muted-foreground">{t("Width")}</p>
              <Tabs
                value={size}
                defaultValue={size}
                onValueChange={(value) => {
                  setProp((props) => (props.size = value), 1000)
                }}
                className="flex-1"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="small">{t("S")}</TabsTrigger>
                  <TabsTrigger value="medium">{t("M")}</TabsTrigger>
                  <TabsTrigger value="large">{t("L")}</TabsTrigger>
                  <TabsTrigger value="full">
                    <MoveHorizontal />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Top")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
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
                onValueChange={(e) => handlePropChangeDebounced("marginTop", e)}
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Bottom")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
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

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Right")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
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

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Left")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
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
      </Accordion>
    </>
  )
}
