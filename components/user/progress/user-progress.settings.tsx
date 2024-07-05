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
import {
  ProgressBarDefaultProps,
  ProgressBarGen,
} from "./user-progress.component"
import useButtonThemePresets from "../icon-button/useButtonThemePresets"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import {
  useScreenNames,
  useScreensLength,
} from "@/lib/state/flows-state/features/screenHooks"
import { RootState } from "@/lib/state/flows-state/store"
import Image from "next/image"

import dash_icon from "@/assets/images/dash_icon.png"

export const ProgressBarSettings = () => {
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
          selectedScreen + 1 < (screensLength || 0) ? selectedScreen + 1 : 0
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
    debouncedSetProp("maxValue", screensLength)
  }, [screensLength])
  return (
    <>
      {isHeaderFooterMode ? (
        <UiCard
          className={cn(
            "flex flex-col items-center justify-center border border-gray-500 px-4 py-3"
          )}
        >
          <div className="flex flex-row items-start gap-1 text-left">
            <div>
              <p className="text-justify text-sm font-light">
                The value of the progress bar adapts automatically based on the
                current screen number and total screen numbers. For example,
                when there are 10 screens in total and you&apos;re on screen 2,
                it shows 20% progress.
              </p>
            </div>
          </div>
        </UiCard>
      ) : (
        <Accordion
          value={settingsTab || "content"}
          onValueChange={(value) => {
            setProp((props) => (props.settingsTab = value), 200)
          }}
          type="multiple"
          defaultValue={["content"]}
          className="mb-10 w-full"
        >
          <AccordionItem value="design">
            <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
              <span className="text-sm font-medium">{t("Design")} </span>
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-y-4 p-2">
              <div className="col-span-2 flex flex-row items-center space-x-2">
                <label
                  htmlFor="backgroundcolor"
                  className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("Background Color")}
                </label>
                <Input
                  defaultValue={"#fff"}
                  value={containerBackground}
                  onChange={(e) => {
                    debouncedSetProp("containerBackground", e.target.value)
                  }}
                  className="basis-1/3"
                  type={"color"}
                  id="backgroundcolor"
                />
              </div>
              <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
                <p className="text-md text-muted-foreground">{t("Styles")}</p>
                <Tabs
                  value={progressStyle}
                  onValueChange={(value) => {
                    setProp((props) => (props.progressStyle = value), 1000)
                  }}
                  className="flex-1"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="minus">
                      <Minus />
                    </TabsTrigger>
                    <TabsTrigger value="rectangle">
                      <RectangleHorizontal />
                    </TabsTrigger>
                    <TabsTrigger value="grip">
                      <Image
                        src={dash_icon}
                        alt={"rectangle grip"}
                        height={25}
                        width={25}
                      />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
                <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                  <Label htmlFor="marginTop">{t("Filled Elements")}</Label>
                  <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                    {progressvalue}
                  </span>
                </div>
                <Slider
                  className=""
                  defaultValue={[progressvalue]}
                  value={[progressvalue]}
                  max={25}
                  min={0}
                  step={1}
                  onValueChange={(e) =>
                    // setProp((props) => (props.marginTop = e),200)
                    // handlePropChange("marginTop",e)
                    handlePropChangeDebounced("progressvalue", e)
                  }
                />
              </div>
              <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
                <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                  <Label htmlFor="marginTop">{t("Total Elements")}</Label>
                  <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                    {maxValue}
                  </span>
                </div>
                <Slider
                  className=""
                  // defaultValue={[maxValue]}
                  value={[maxValue]}
                  max={screensLength}
                  min={0}
                  step={1}
                  onValueChange={(e) => {
                    console.log("onvaluechange called")
                    // setProp((props) => (props.marginTop = e),200)
                    // handlePropChange("marginTop",e)
                    handlePropChangeDebounced("maxValue", e)
                  }}
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
                  onValueChange={(e) =>
                    // setProp((props) => (props.marginTop = e),200)
                    // handlePropChange("marginTop",e)
                    handlePropChangeDebounced("marginTop", e)
                  }
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
      )}
    </>
  )
}
