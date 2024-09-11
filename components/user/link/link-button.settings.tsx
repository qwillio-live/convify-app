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
        className="mb-10 w-full"
      >
        <AccordionItem value="content">
          <AccordionTrigger>{t("Content")}</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={enableIcon}
                onCheckedChange={(e) => {
                  handlePropChange("enableIcon", e)
                }}
                id="enableIcon"
              />
              <label
                htmlFor="enableIcon"
                className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Enable Icon")}
              </label>
            </div>
            {enableIcon && (
              <div className="style-control col-span-2 flex w-full grow-0 flex-row items-center gap-2">
                <>
                  <p className="text-md text-muted-foreground flex-1">
                    {t("Icon")}
                  </p>
                  <PicturePicker
                    className="w-full transition-all duration-100 ease-in-out"
                    maxWidthMobile={400}
                    maxWidthDesktop={400}
                    pictureType={PictureTypes.ICON}
                    picture={icon}
                    onChange={handlePictureChange}
                  />
                </>
              </div>
            )}

            <div className="style-control col-span-2 flex w-full grow-0 flex-row items-center gap-2">
              <label
                htmlFor="text"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Navigation
              </label>
              <Select
                // className="w-full"
                // value={buttonAction}
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select screen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={"next-screen"}>
                      {t("Next Screen")}
                    </SelectItem>
                    <SelectItem value={"redirect"}>{t("Redirect")}</SelectItem>
                    <SelectItem value={"none"}>{t("Do Nothing")}</SelectItem>
                    {screenNames?.map((screen, index) => (
                      <SelectItem key={index} value={screen.screenId}>
                        {index + 1} : {screen.screenName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {buttonAction === "redirect" && (
              <div className="col-span-2 mt-4 w-full">
                <div className="style-control col-span-2 mb-3 flex w-full grow-0 flex-row items-center gap-2">
                  <label
                    htmlFor="label-text"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t("URL")}
                  </label>
                  <Input
                    className="w-full"
                    type={"text"}
                    value={href}
                    onChange={(e) =>
                      handlePropChangeDebounced("href", e.target.value)
                    }
                    placeholder={t("Enter url link")}
                  />
                </div>

                <div className="style-control col-span-2 flex w-full grow-0 flex-row items-center gap-2">
                  <label
                    htmlFor="label-text"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t("Open in")}
                  </label>
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
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select screen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={"new-window"}>New window</SelectItem>
                        <SelectItem value={"same-window"}>
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
          <AccordionContent className="grid grid-cols-2 gap-y-4">
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
              <p className="text-md text-muted-foreground">
                {t("Button Size")}
              </p>
              <Tabs
                value={buttonSize}
                defaultValue={buttonSize}
                onValueChange={(value) => {
                  setProp((props) => (props.buttonSize = value), 1000)
                }}
                className="flex-1"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="small">{t("S")}</TabsTrigger>
                  <TabsTrigger value="medium">{t("M")}</TabsTrigger>
                  <TabsTrigger value="large">{t("L")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <p className="text-md text-muted-foreground">
                {t("Content Align")}
              </p>
              <Tabs
                value={justifyContent}
                defaultValue={justifyContent}
                onValueChange={(value) => {
                  setProp((props) => (props.justifyContent = value), 1000)
                }}
                className="flex-1"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="start">
                    <AlignHorizontalJustifyStart />
                  </TabsTrigger>
                  <TabsTrigger value="center">
                    <AlignHorizontalJustifyCenter />
                  </TabsTrigger>
                  <TabsTrigger value="end">
                    <AlignHorizontalJustifyEnd />
                  </TabsTrigger>
                  <TabsTrigger value="space-between">
                    <AlignHorizontalSpaceBetween />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="spacing">
          <AccordionTrigger>{t("Spacing")}</AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2">
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

        <AccordionItem value="styles">
          <AccordionTrigger >{t("Styles")}
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-4">
              <Card
                onClick={() => {
                  addPresetStyles(linkFilledPreset)
                  setSelectedPresets(PRESETNAMES.filled)
                }}
                className={cn(
                  "px-2 py-0 transition-all duration-300 hover:cursor-pointer",
                  { "border-blue-500": preset === "filled" }
                )}
              >
                <LinkButtonGen
                  {...linkFilledPreset}
                  text={"Link"}
                  paddingBottom={14}
                  paddingTop={14}
                  width={"266px"}
                  marginTop={12}
                  enableIcon={false}
                  justifyContent={"center"}
                  marginBottom={12}
                  marginLeft={0}
                  marginRight={0}
                  iconType={icon}
                />
              </Card>
              <Card
                onClick={() => {
                  addPresetStyles(linkOutLinePreset)
                  setSelectedPresets(PRESETNAMES.outLine)
                }}
                className={cn(
                  "px-2 py-0 transition-all duration-300 hover:cursor-pointer",
                  { "border-blue-500": preset === "outline" }
                )}
              >
                <LinkButtonGen
                  {...linkOutLinePreset}
                  paddingBottom={14}
                  paddingTop={14}
                  width={"266px"}
                  text={"Link"}
                  justifyContent={"center"}
                  enableIcon={false}
                  marginTop={12}
                  marginBottom={12}
                  marginLeft={0}
                  marginRight={0}
                  iconType={icon}
                />
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
