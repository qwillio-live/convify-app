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
  Image,
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
import { Button as CustomButton } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/custom-checkbox"
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
import { IconButtonDefaultProps, LinkButtonGen } from "./link-component"
import useButtonThemePresets from "../icon-button/useButtonThemePresets"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import {
  useScreenNames,
  useScreensLength,
} from "@/lib/state/flows-state/features/screenHooks"
import { RootState } from "@/lib/state/flows-state/store"
import { PicturePicker, PictureTypes } from "@/components/PicturePicker"
import useLinkThemePresets from "./link-theme"
import { ColorInput } from "@/components/color-input"

export const LinkButtonSettings = () => {
  const t = useTranslations("Components")
  const screenNames = useScreenNames()
  console.log("SCREEN NAMES: ", screenNames)
  const screensLength = useScreensLength()
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
      windowTarget,
      href,
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
      iconType,
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
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  enum PRESETNAMES {
    filled = "filled",
    outLine = "outLine",
  }
  const { linkFilledPreset, linkOutLinePreset } = useLinkThemePresets()
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
  const handlePictureChange = (picture, pictureType) => {
    console.log("picture,pictureType", picture, pictureType)
    setProp((props) => (props.icon = picture), 1000)
    setProp((props) => (props.iconType = pictureType), 1000)
  }
  return (
    <>
      <Accordion
        value={settingsTab || "content"}
        onValueChange={(value) => {
          setProp((props) => (props.settingsTab = value), 200)
        }}
        type="multiple"
        defaultValue={["content"]}
        className="w-full"
      >
        <AccordionItem value="content">
          <AccordionTrigger>{t("Content")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={enableIcon}
                onCheckedChange={(e) => {
                  handlePropChange("enableIcon", e)
                }}
                id="enableIcon"
              />
              <Label htmlFor="enableIcon">{t("Enable Icon")}</Label>
            </div>
            {enableIcon && (
              <div className="flex items-center justify-between">
                <Label>{t("Icon")}</Label>
                <PicturePicker
                  className="transition-all duration-100 ease-in-out"
                  maxWidthMobile={400}
                  maxWidthDesktop={400}
                  pictureType={iconType}
                  picture={
                    iconType === PictureTypes.NULL ? (
                      <Image className="text-muted-foreground size-4" />
                    ) : (
                      icon
                    )
                  }
                  onChange={handlePictureChange}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="text">Navigation</Label>
              <Select
                // className="w-full"
                defaultValue={"redirect"}
                value={
                  buttonAction === "custom-action"
                    ? nextScreen.screenId
                    : buttonAction
                }
                onValueChange={(e) => {
                  if (e === "next-screen") {
                    setProp((props) => (props.buttonAction = "next-screen"))
                    setProp(
                      (props) =>
                        (props.nextScreen = {
                          screenId: nextScreenId,
                          screenName: nextScreenName,
                        })
                    )
                  } else if (e === "redirect") {
                    console.log("redirect")
                    setProp((props) => (props.buttonAction = "redirect"))
                  } else if (e === "none") {
                    setProp((props) => (props.buttonAction = "none"))
                    setProp(
                      (props) =>
                        (props.nextScreen = {
                          screenId: "none",
                          screenName: "",
                        })
                    )
                  } else {
                    console.log("entered", e)
                    setProp((props) => (props.buttonAction = "custom-action"))
                    setProp(
                      (props) =>
                        (props.nextScreen = {
                          screenId: e,
                          screenName: screenNames?.find(
                            (screen) => screen.screenId === e
                          )?.screenName,
                        })
                    )
                  }
                }}
              >
                <SelectTrigger className="h-8.5 w-full bg-[#FAFAFA] text-xs">
                  <SelectValue placeholder="Select screen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="text-xs" value={"next-screen"}>
                      {t("Next Screen")}
                    </SelectItem>
                    <SelectItem className="text-xs" value={"redirect"}>
                      {t("Redirect")}
                    </SelectItem>
                    <SelectItem className="text-xs" value={"none"}>
                      {t("Do Nothing")}
                    </SelectItem>
                    {screenNames?.map((screen, index) => (
                      <SelectItem
                        className="text-xs"
                        key={index}
                        value={screen.screenId}
                      >
                        {index + 1} : {screen.screenName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {buttonAction === "redirect" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url-field">{t("URL")}</Label>
                  <Input
                    id="url-field"
                    className="w-full"
                    type={"text"}
                    value={href}
                    onChange={(e) =>
                      handlePropChangeDebounced("href", e.target.value)
                    }
                    placeholder={t("Enter url link")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="open-in">{t("Open in")}</Label>
                  <Select
                    defaultValue={"new-window"}
                    value={windowTarget ? "new-window" : "same-window"}
                    onValueChange={(e) =>
                      setProp(
                        (props) =>
                          (props.windowTarget =
                            e === "new-window" ? true : false)
                      )
                    }
                  >
                    <SelectTrigger className="h-8.5 w-full bg-[#FAFAFA] text-xs">
                      <SelectValue placeholder="Select screen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem className="text-xs" value={"new-window"}>
                          New window
                        </SelectItem>
                        <SelectItem className="text-xs" value={"same-window"}>
                          Same Window
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="design">
          <AccordionTrigger>{t("Design")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label>{t("Background Color")}</Label>
              <ColorInput
                value={containerBackground}
                handleChange={(value) => {
                  debouncedSetProp("containerBackground", value)
                }}
                handleRemove={() => {
                  debouncedSetProp("containerBackground", "transparent")
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("Button Size")}</Label>
              <Tabs
                value={buttonSize}
                defaultValue={buttonSize}
                onValueChange={(value) => {
                  setProp((props) => (props.buttonSize = value), 1000)
                }}
              >
                <TabsList className="grid w-full grid-cols-3 bg-[#EEEEEE]">
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
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label>{t("Content Align")}</Label>
              <Tabs
                value={justifyContent}
                defaultValue={justifyContent}
                onValueChange={(value) => {
                  setProp((props) => (props.justifyContent = value), 1000)
                }}
              >
                <TabsList className="grid w-full grid-cols-4 bg-[#EEEEEE]">
                  <TabsTrigger className="rounded" value="start">
                    <AlignHorizontalJustifyStart size={16} />
                  </TabsTrigger>
                  <TabsTrigger className="rounded" value="center">
                    <AlignHorizontalJustifyCenter size={16} />
                  </TabsTrigger>
                  <TabsTrigger className="rounded" value="end">
                    <AlignHorizontalJustifyEnd size={16} />
                  </TabsTrigger>
                  <TabsTrigger className="rounded" value="space-between">
                    <AlignHorizontalSpaceBetween size={16} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
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
                    // setProp((props) => (props.marginTop = e),200)
                    // handlePropChange("marginTop",e)
                    handlePropChangeDebounced("marginTop", e)
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marginBottom">{t("Bottom")}</Label>
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
                  <Label htmlFor="marginRight">{t("Right")}</Label>
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
                  <Label htmlFor="marginLeft">{t("Left")}</Label>
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

        <AccordionItem value="styles">
          <AccordionTrigger>{t("Styles")}</AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-4 max-w-[255px]">
              <Card
                onClick={() => {
                  addPresetStyles(linkFilledPreset)
                  setSelectedPresets(PRESETNAMES.filled)
                }}
                className={cn(
                  "relative px-2 py-0 transition-all duration-300 hover:cursor-pointer",
                  { "border-[#15347B]": preset === "filled" }
                )}
              >
                <div className="absolute inset-0 z-10" />
                <LinkButtonGen
                  {...linkFilledPreset}
                  text={"Link"}
                  paddingBottom={14}
                  paddingTop={14}
                  width={"266px"}
                  marginTop={8}
                  enableIcon={false}
                  justifyContent={"center"}
                  marginBottom={8}
                  marginLeft={0}
                  marginRight={0}
                  iconType={icon}
                  height={34}
                  buttonSize={"small"}
                />
              </Card>
              <Card
                onClick={() => {
                  addPresetStyles(linkOutLinePreset)
                  setSelectedPresets(PRESETNAMES.outLine)
                }}
                className={cn(
                  "relative bg-[#FAFAFA] px-2 py-0 transition-all duration-300 hover:cursor-pointer",
                  { "border-[#2B3398]": preset === "outline" }
                )}
              >
                <div className="absolute inset-0 z-10" />
                <LinkButtonGen
                  {...linkOutLinePreset}
                  paddingBottom={14}
                  paddingTop={14}
                  width={"266px"}
                  text={"Link"}
                  justifyContent={"center"}
                  enableIcon={false}
                  marginTop={8}
                  marginBottom={8}
                  marginLeft={0}
                  marginRight={0}
                  iconType={icon}
                  buttonSize={"small"}
                  height={34}
                />
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
