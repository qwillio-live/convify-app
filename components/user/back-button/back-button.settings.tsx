import React, { useCallback, useState } from "react"
import { debounce, throttle } from "lodash"
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceBetween,
  Image as ImageIcon,
  MoveHorizontal,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { useNode } from "@/lib/craftjs"
import { useScreenNames } from "@/lib/state/flows-state/features/screenHooks"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PicturePicker, PictureTypes } from "@/components/PicturePicker"
import { Checkbox } from "@/components/custom-checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/custom-select"
import { Slider } from "@/components/custom-slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"

import { BackButtonGen } from "./back-button.component"
import useBackButtonThemePresets from "./useBackButtonThemePresets"

export const BackButtonSettings = () => {
  const t = useTranslations("Components")
  const screenNames = useScreenNames()

  const selectedScreen = useAppSelector(
    (state: RootState) => state.screen?.selectedScreen ?? 0
  )
  const prevScreenName =
    useAppSelector(
      (state: RootState) =>
        state?.screen?.screens[selectedScreen - 1 >= 0 ? selectedScreen - 1 : 0]
          ?.screenName
    ) || ""

  const prevScreenId =
    useAppSelector(
      (state: RootState) =>
        state?.screen?.screens[selectedScreen - 1 >= 0 ? selectedScreen - 1 : 0]
          ?.screenId
    ) || ""

  const {
    actions: { setProp },
    props: {
      enableIcon,
      size,
      buttonSize,
      containerBackground,
      icon,
      justifyContent,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      settingsTab,
      preset,
      tracking,
      trackingEvent,
      prevScreen,
      buttonAction,
      choice: originalChoice,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  enum PRESETNAMES {
    filled = "filled",
    outLine = "outLine",
  }
  const { filledPreset, outLinePreset } = useBackButtonThemePresets()

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
    }, 200),
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

  const [choice, setChoice] = useState(originalChoice)

  const handlePictureChange = (picture, pictureType) => {
    setChoice({ ...choice, picture, pictureType })

    setProp(
      (props) => (props.choice = { ...choice, picture, pictureType }),
      200
    )
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
        className="w-full mb-10"
      >
        <AccordionItem value="content">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Content")}</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="flex flex-row items-center col-span-2 space-x-2">
              <Checkbox
                className="peer h-4 w-4 shrink-0 rounded-sm border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary"
                checked={enableIcon}
                onCheckedChange={(e) => {
                  handlePropChange("enableIcon", e)
                }}
                id="enableIcon"
              />
              <label
                htmlFor="enableIcon"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Enable Icon")}
              </label>
            </div>
            <div className="style-control col-span-2 flex w-full grow-0 basis-2/4 flex-row items-center gap-2">
              {enableIcon && (
                <>
                  <p className="text-md flex-1 text-muted-foreground">
                    {t("Icon")}
                  </p>
                  <div className="flex w-full items-center gap-2">
                    <PicturePicker
                      className="transition-all duration-100 ease-in-out !w-24"
                      picture={
                        choice.pictureType === PictureTypes.NULL ? (
                          <ImageIcon className="text-muted-foreground size-4" />
                        ) : (
                          choice.picture
                        )
                      }
                      pictureType={choice.pictureType}
                      onChange={handlePictureChange}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-2/4 flex-row items-center gap-2">
              <label
                htmlFor="text"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Navigation")}
              </label>
              <Select
                defaultValue={
                  buttonAction === "prev-screen"
                    ? "prev-screen"
                    : prevScreen.screenId
                }
                value={
                  buttonAction === "prev-screen"
                    ? "prev-screen"
                    : prevScreen.screenId
                }
                onValueChange={(e) => {
                  if (e === "prev-screen") {
                    setProp((props) => (props.buttonAction = "prev-screen"))
                    setProp(
                      (props) =>
                        (props.prevScreen = {
                          screenId: prevScreenId,
                          screenName: prevScreenName,
                        })
                    )
                  } else {
                    setProp((props) => (props.buttonAction = "custom-action"))
                    setProp(
                      (props) =>
                        (props.prevScreen = {
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
                    <SelectItem value={"prev-screen"}>
                      Previous Screen
                    </SelectItem>
                    {screenNames?.map((screen, index) => {
                      return (
                        <SelectItem value={screen.screenId}>
                          {index + 1} : {screen.screenName}
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="design">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Design")} </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-4 p-2">
            <div className="flex flex-row items-center col-span-2 space-x-2">
              <label
                htmlFor="backgroundcolor"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-2/3"
              >
                {t("Background Color")}
              </label>
              <Input
                defaultValue={themeBackgroundColor}
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
                <TabsList className="w-full grid grid-cols-3">
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
                <TabsList className="w-full grid grid-cols-4">
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
                onValueChange={(e) => handlePropChangeDebounced("marginTop", e)}
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

        <AccordionItem value="styles">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Styles")}</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-4">
              <Card
                onClick={() => {
                  addPresetStyles(filledPreset)
                }}
                className={cn(
                  "px-2 py-0 hover:cursor-pointer transition-all duration-300",
                  { "border-blue-500": preset === "filled" }
                )}
              >
                <BackButtonGen
                  {...filledPreset}
                  size="full"
                  paddingBottom={14}
                  paddingTop={14}
                  width={"266px"}
                  marginTop={12}
                  marginBottom={12}
                  marginLeft={0}
                  marginRight={0}
                />
              </Card>
              <Card
                onClick={() => {
                  addPresetStyles(outLinePreset)
                }}
                className={cn(
                  "px-2 py-0 hover:cursor-pointer transition-all duration-300",
                  { "border-blue-500": preset === "outline" }
                )}
              >
                <BackButtonGen
                  {...outLinePreset}
                  size="full"
                  paddingBottom={14}
                  paddingTop={14}
                  width={"266px"}
                  marginTop={12}
                  marginBottom={12}
                  marginLeft={0}
                  marginRight={0}
                />
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tracking">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Tracking")}</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="flex flex-row items-center col-span-2 space-x-2">
              <Checkbox
                className="peer h-4 w-4 shrink-0 rounded-sm border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary"
                checked={tracking}
                onCheckedChange={(e) => {
                  handlePropChange("tracking", e)
                }}
                id="enableTracking"
              />
              <label
                htmlFor="enableIcon"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Tracking activated")}
              </label>
            </div>
            {tracking && (
              <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-row gap-2 items-center mt-2">
                <label
                  htmlFor="label-event"
                  className="text-sm font-medium shrink-0 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("Event Name")}
                </label>
                <Input
                  value={trackingEvent}
                  defaultValue={trackingEvent}
                  onChange={(e) => {
                    setProp(
                      (props) => (props.trackingEvent = e.target.value),
                      0
                    )
                  }}
                  type={"text"}
                  placeholder={t("Tracking Event")}
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
