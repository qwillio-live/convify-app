import React, { useCallback, useEffect } from "react"
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
  AlignHorizontalSpaceBetween,
  CornerRightDown,
  Minus,
  RectangleHorizontal,
  GripHorizontal,
  Ellipsis,
  InfoIcon,
} from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/custom-tabs"
import { useTranslations } from "next-intl"

import { throttle, debounce } from "lodash"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/custom-checkbox"
import { Card as UiCard } from "@/components/ui/card"
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
} from "@/components/custom-select"
import { Slider } from "@/components/custom-slider"

import { Controller } from "../settings/controller.component"
import { RangeDefaultProps, RangeGen } from "./user-range.component"
import useButtonThemePresets from "../icon-button/useButtonThemePresets"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import {
  useScreenNames,
  useScreensLength,
} from "@/lib/state/flows-state/features/screenHooks"
import { RootState } from "@/lib/state/flows-state/store"
import Image from "next/image"

import dash_icon from "@/assets/images/dash_icon_new.svg"
import dash_icon_selected from "@/assets/images/dash_icon_selected.svg"
import { ColorInput } from "@/components/color-input"

function HelperInformation({ infoText }: { infoText: string }) {
  return (
    <UiCard className={cn("flex gap-2 rounded-lg border p-3 pr-4")}>
      <div className="flex flex-row items-start gap-1 text-left">
        <InfoIcon className="size-4 shrink-0" />
        <p className="text-xs">{infoText}</p>
      </div>
    </UiCard>
  )
}

export const RangeSettings = () => {
  const t = useTranslations("Components")
  const screenNames = useScreenNames()
  console.log("SCREEN NAMES: ", screenNames)
  const screensLength: number = useScreensLength() ?? 0
  const selectedScreen = useAppSelector(
    (state: RootState) => state.screen?.selectedScreen ?? 0
  )
  const nextScreenName =
    useAppSelector(
      (state: RootState) =>
        state?.screen?.screens[
          selectedScreen + 1 < (screensLength || 0)
            ? selectedScreen + 1
            : selectedScreen
        ]?.screenName
    ) || ""

  const nextScreenId =
    useAppSelector(
      (state: RootState) =>
        state?.screen?.screens[
          selectedScreen + 1 < (screensLength || 0) ? selectedScreen + 1 : 0
        ]?.screenId
    ) || ""

  const {
    actions: { setProp },
    props: {
      enableIcon,
      props,
      size,
      buttonSize,
      containerBackground,
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
      settingsTab,
      preset,
      tracking,
      trackingEvent,
      nextScreen,
      buttonAction,
      progressStyle,
      progressvalue,
      maxValue,
      isVisibleLabel,
      isVisibleBottomLabels,
      lowerLimit,
      defaultValue,
      upperLimit,
      stepSize,
      prefix,
      suffix,
      slideColor,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  enum PRESETNAMES {
    filled = "filled",
    outLine = "outLine",
  }
  const { filledPreset, outLinePreset } = useButtonThemePresets()
  const [selectedPreset, setSelectedPresets] = React.useState(
    PRESETNAMES.filled
  )
  const addPresetStyles = (preset) => {
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
      "gap",
      "marginLeft",
      "marginTop",
      "marginRight",
      "marginBottom",
      "progressStyle",
      "progressvalue",
      "maxValue",
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
  const isHeaderFooterMode = useAppSelector(
    (state: RootState) => state?.screen?.footerMode || state?.screen?.headerMode
  )
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
  useEffect(() => {
    // if (progressvalue !== 1 && maxValue !== 5) {
    debouncedSetProp("maxValue", screensLength)
    if (progressvalue > screensLength) {
      debouncedSetProp("progressvalue", screensLength)
      // }
    }
  }, [screensLength])

  return (
    <>
      {isHeaderFooterMode ? (
        <div className="mt-7">
          <HelperInformation infoText={t("Progress_bar_description")} />
        </div>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={["general"]}
          className="w-full"
        >
          <AccordionItem value="general">
            <AccordionTrigger>{t("General")}</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  value={isVisibleLabel}
                  checked={isVisibleLabel}
                  onCheckedChange={(e) => {
                    setProp((props) => (props.isVisibleLabel = e), 200)
                  }}
                  id="isvisiblelabel"
                />
                <label
                  htmlFor="isvisiblelabel"
                  className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("Show Label")}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  value={isVisibleBottomLabels}
                  checked={isVisibleBottomLabels}
                  onCheckedChange={(e) => {
                    setProp((props) => (props.isVisibleBottomLabels = e), 200)
                  }}
                  id="isvisiblebottomlabels"
                />
                <label
                  htmlFor="isvisiblebottomlabels"
                  className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("Show Bottom Labels")}
                </label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowerlimit">{t("Lower Limit")}</Label>
                <Input
                  id="lowerlimit"
                  value={lowerLimit}
                  onChange={(e) => {
                    setProp((props) => (props.lowerLimit = e.target.value), 0)
                    // handlePropChange("placeholder",e.target.value);
                  }}
                  type="number"
                  placeholder={t("Enter Lower Limit")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultvalue">{t("Default Value")}</Label>
                <Input
                  id="defaultvalue"
                  value={defaultValue}
                  onChange={(e) => {
                    setProp((props) => (props.defaultValue = e.target.value), 0)
                    // handlePropChange("placeholder",e.target.value);
                  }}
                  type="number"
                  placeholder={t("Enter Default Value")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upperlimit">{t("Upper Limit")}</Label>
                <Input
                  id="upperlimit"
                  value={upperLimit}
                  onChange={(e) => {
                    setProp((props) => (props.upperLimit = e.target.value), 0)
                    // handlePropChange("placeholder",e.target.value);
                  }}
                  type="number"
                  placeholder={t("Enter Upper Limit")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stepsize">{t("Step Size")}</Label>
                <Input
                  id="stepsize"
                  value={stepSize}
                  onChange={(e) => {
                    setProp((props) => (props.stepSize = e.target.value), 0)
                    // handlePropChange("placeholder",e.target.value);
                  }}
                  type="number"
                  placeholder={t("Enter Step Size")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prefix">{t("Prefix")}</Label>
                <Input
                  id="prefix"
                  value={prefix}
                  onChange={(e) => {
                    setProp((props) => (props.prefix = e.target.value), 0)
                    // handlePropChange("placeholder",e.target.value);
                  }}
                  type="text"
                  placeholder={t("Enter Prefix")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suffix">{t("Suffix")}</Label>
                <Input
                  id="suffix"
                  value={suffix}
                  onChange={(e) => {
                    setProp((props) => (props.suffix = e.target.value), 0)
                    // handlePropChange("placeholder",e.target.value);
                  }}
                  type="text"
                  placeholder={t("Enter Suffix")}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="design">
            <AccordionTrigger>{t("Design")}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slidecolor">{t("Slide Color")}</Label>
                  <ColorInput
                    value={slideColor}
                    handleChange={(e) => {
                      debouncedSetProp("slideColor", e.target.value)
                    }}
                    handleRemove={() => {
                      debouncedSetProp("slideColor", "transparent")
                    }}
                    id="slidecolor"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="backgroundcolor">
                    {t("Background Color")}
                  </Label>
                  <ColorInput
                    value={containerBackground}
                    handleChange={(e) => {
                      debouncedSetProp("containerBackground", e.target.value)
                    }}
                    handleRemove={() => {
                      debouncedSetProp("containerBackground", "transparent")
                    }}
                    id="backgroundcolor"
                  />
                </div>
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
                  <TabsList className="grid w-full grid-cols-4 bg-[#EEEEEE]">
                    <TabsTrigger
                      className="rounded text-base leading-4"
                      value="small"
                    >
                      {t("S")}
                    </TabsTrigger>
                    <TabsTrigger
                      className="rounded text-base leading-4"
                      value="medium"
                    >
                      {t("M")}
                    </TabsTrigger>
                    <TabsTrigger
                      className="rounded text-base leading-4"
                      value="large"
                    >
                      {t("L")}
                    </TabsTrigger>
                    <TabsTrigger
                      className="rounded text-base leading-4"
                      value="full"
                    >
                      <MoveHorizontal size={16} />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{t("Top")}</Label>
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
                    <Label>{t("Bottom")}</Label>
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
                      handlePropChangeDebounced("marginBottom", e)
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{t("Right")}</Label>
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
                      handlePropChangeDebounced("marginRight", e)
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{t("Left")}</Label>
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
                      handlePropChangeDebounced("marginLeft", e)
                    }
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </>
  )
}
