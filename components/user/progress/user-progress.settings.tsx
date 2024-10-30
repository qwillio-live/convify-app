import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"
import { Ellipsis, InfoIcon, Minus, MoveHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"
import React, { useCallback, useEffect } from "react"

import { debounce, throttle } from "lodash"

import { Slider } from "@/components/custom-slider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card as UiCard } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useNode } from "@/lib/craftjs"

import {
  useScreenNames,
  useScreensLength,
} from "@/lib/state/flows-state/features/screenHooks"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { cn } from "@/lib/utils"
import Image from "next/image"
import useButtonThemePresets from "../icon-button/useButtonThemePresets"

import dash_icon from "@/assets/images/dash_icon_new.svg"
import dash_icon_selected from "@/assets/images/dash_icon_selected.svg"
import { ColorInput } from "@/components/color-input"

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
      {!isHeaderFooterMode ? (
        <UiCard className={cn("mt-6 flex gap-2 rounded-lg border p-3 pr-4")}>
          <div className="flex flex-row items-start gap-1 text-left">
            <InfoIcon className="size-4 shrink-0" />
            <p className="text-xs">{t("Progress_bar_description")}</p>
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
          className="w-full"
        >
          <AccordionItem value="design">
            <AccordionTrigger>{t("Design")}</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="backgroundcolor">{t("Background Color")}</Label>
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
              <div className="space-y-2">
                <Label>{t("Styles")}</Label>
                <Tabs
                  value={progressStyle}
                  onValueChange={(value) => {
                    setProp((props) => (props.progressStyle = value), 1000)
                  }}
                >
                  <TabsList className="grid  grid-cols-3  bg-[#EEEEEE]">
                    <TabsTrigger className="rounded" value="minus">
                      <Minus size={16} />
                    </TabsTrigger>
                    <TabsTrigger className="rounded" value="rectangle">
                      <Image
                        src={
                          progressStyle === "rectangle"
                            ? dash_icon_selected
                            : dash_icon
                        }
                        alt={"rectangle grip"}
                        height={16}
                        width={20}
                      />
                    </TabsTrigger>
                    <TabsTrigger className="rounded" value="grip">
                      <Ellipsis size={16} />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="filled-elements">
                    {t("Filled Elements")}
                  </Label>
                  <span className="text-muted-foreground text-xs">
                    {progressvalue}
                  </span>
                </div>
                <Slider
                  // defaultValue={[progressvalue]}
                  value={[progressvalue]}
                  max={screensLength}
                  min={0}
                  step={1}
                  onValueChange={(e) =>
                    // setProp((props) => (props.marginTop = e),200)
                    // handlePropChange("marginTop",e)
                    handlePropChangeDebounced("progressvalue", e)
                  }
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="total-elements">{t("Total Elements")}</Label>
                  <span className="text-muted-foreground text-xs">
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
                  onValueChange={(e) =>
                    // setProp((props) => (props.marginTop = e),200)
                    // handlePropChange("marginTop",e)
                    handlePropChangeDebounced("maxValue", e)
                  }
                />
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
