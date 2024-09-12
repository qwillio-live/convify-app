import React, { useCallback, useEffect } from "react"
import { debounce, throttle } from "lodash"
import {
  AlignCenter,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceBetween,
  AlignLeft,
  AlignRight,
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
import { ColorInput } from "@/components/color-input"

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
      >
        <AccordionItem value="design">
          <AccordionTrigger>{t("Design")}</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2">
            <div className="space-y-2">
              <Label>{t("Align")}</Label>
              <Tabs
                value={justifyContent}
                defaultValue={justifyContent}
                onValueChange={(value) => {
                  setProp((props) => (props.justifyContent = value), 1000)
                }}
              >
                <TabsList className="grid w-full grid-cols-3 bg-[#eeeeee]">
                  <TabsTrigger value="start" className="rounded">
                    <AlignLeft className="size-4" />
                  </TabsTrigger>
                  <TabsTrigger value="center" className="rounded">
                    <AlignCenter className="size-4" />
                  </TabsTrigger>
                  <TabsTrigger value="end" className="rounded">
                    <AlignRight className="size-4" />
                  </TabsTrigger>
                  {/* <TabsTrigger value="space-between">
                    <AlignHorizontalSpaceBetween />
                  </TabsTrigger>  */}
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="backgroundcolor">{t("Background Color")}</Label>
              <ColorInput
                id="backgroundcolor"
                value={containerBackground}
                handleChange={(e) => {
                  debouncedSetProp("containerBackground", e.target.value)
                }}
                handleRemove={() => debouncedSetProp("containerBackground", "")}
              />
            </div>

            {mobileScreen ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t("FontSize")}</Label>
                  <span className="text-muted-foreground text-xs">
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>{t("FontSize")}</Label>
                  <span className="text-muted-foreground text-xs">
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

            <div className="space-y-2">
              <Label>{t("FontWeight")}</Label>
              <Select
                value={fontWeight}
                defaultValue={fontWeight}
                onValueChange={(value) => {
                  setProp((props) => (props.fontWeight = value), 1000)
                }}
              >
                <SelectTrigger className={cn("h-9 text-xs font-bold")}>
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
          <AccordionTrigger>{t("Spacing")}</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2">
            <div className="space-y-2">
              <Label>{t("Width")}</Label>
              <Tabs
                value={size}
                defaultValue={size}
                onValueChange={(value) => {
                  setProp((props) => (props.size = value), 1000)
                }}
              >
                <TabsList className="grid w-full grid-cols-4 bg-[#eeeeee]">
                  <TabsTrigger
                    value="small"
                    className="rounded text-base leading-4"
                  >
                    {t("S")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="medium"
                    className="rounded text-base leading-4"
                  >
                    {t("M")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="large"
                    className="rounded text-base leading-4"
                  >
                    {t("L")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="full"
                    className="rounded text-base leading-4"
                  >
                    <MoveHorizontal className="size-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marginTop">{t("Top")}</Label>
                  <span className="text-muted-foreground text-xs">
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
                    handlePropChangeDebounced("marginTop", e)
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marginTop">{t("Bottom")}</Label>
                  <span className="text-muted-foreground text-xs">
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

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marginTop">{t("Right")}</Label>
                  <span className="text-muted-foreground text-xs">
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

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marginTop">{t("Left")}</Label>
                  <span className="text-muted-foreground text-xs">
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
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
