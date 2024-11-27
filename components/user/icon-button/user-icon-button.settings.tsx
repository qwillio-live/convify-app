import { useCallback, useEffect } from "react"
import { debounce, throttle } from "lodash"
import {
  // Activity,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceBetween,
  // Anchor,
  // Aperture,
  // ArrowRight,
  // CornerRightDown,
  // Disc,
  // DollarSign,
  Image as ImageIcon,
  // Mountain,
  MoveHorizontal,
} from "lucide-react"
import { useTranslations } from "next-intl"

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
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/custom-select"
import { Slider } from "@/components/custom-slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"

import useButtonThemePresets from "./useButtonThemePresets"
import { IconButtonGen, IconButtonProps } from "./user-icon-button.component"
import { ColorInput } from "@/components/color-input"

// enum PRESETNAMES {
//   filled = "filled",
//   outLine = "outLine",
// }

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

export const IconButtonSettings = () => {
  const t = useTranslations("Components")
  const screenNames = useScreenNames()
  // console.log("SCREEN NAMES: ", screenNames)
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
      enableIcon,
      // props,
      size,
      buttonSize,
      containerBackground,
      // background,
      // backgroundHover,
      // colorHover,
      // color,
      // text,
      // custom,
      icon,
      // paddingLeft,
      // paddingTop,
      // paddingRight,
      // paddingBottom,
      // radius,
      // flexDirection,
      // alignItems,
      justifyContent,
      // gap,
      // border,
      // borderColor,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      // width,
      // height,
      settingsTab,
      preset,
      tracking,
      trackingEvent,
      nextScreen,
      buttonAction,
    },
  } = useNode((node) => ({
    props: node.data.props as IconButtonProps,
  }))

  const { filledPreset, outLinePreset } = useButtonThemePresets()
  // const [selectedPreset, setSelectedPresets] = React.useState(
  //   PRESETNAMES.filled
  // )
  const addPresetStyles = (preset) => {
    setProp((props) => {
      Object.keys(preset).forEach((key) => {
        if (!staticStyles.includes(key)) props[key] = preset[key]
      })
    }, 1000)
  }

  const handlePictureChange = (picture, pictureType) => {
    // setChoice({ ...choice, picture, pictureType })
    handlePropChangeDebounced("icon", {
      picture,
      pictureType,
    })
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

  // const themeBackgroundColor = useAppSelector(
  //   (state) => state?.theme?.general?.backgroundColor
  // )

  return (
    <Accordion
      value={settingsTab}
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
                // setProp((props) => (props.enableIcon = e), 1000)
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
                picture={
                  icon.pictureType === PictureTypes.NULL ? (
                    <ImageIcon className="text-muted-foreground size-4" />
                  ) : (
                    icon.picture
                  )
                }
                pictureType={icon.pictureType}
                maxWidthMobile={50}
                maxWidthDesktop={80}
                onChange={handlePictureChange}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="navigation-select">Navigation</Label>
            <Select
              defaultValue={
                buttonAction === "next-screen"
                  ? "next-screen"
                  : nextScreen.screenId
              }
              value={
                buttonAction === "next-screen"
                  ? "next-screen"
                  : nextScreen.screenId
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
                  <SelectItem className="text-xs" value={"none"}>
                    {t("Do Nothing")}
                  </SelectItem>
                  {screenNames?.map((screen, index) => {
                    return (
                      <SelectItem className="text-xs" value={screen.screenId}>
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
        <AccordionTrigger>{t("Design")}</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label>{t("Background Color")}</Label>
            <ColorInput
              value={containerBackground}
              handleChange={(value) => {
                debouncedSetProp("containerBackground", value)
              }}
              handleRemove={() =>
                debouncedSetProp("containerBackground", "transparent")
              }
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
              <TabsList className="grid w-full grid-cols-3 bg-[#eeeeee]">
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
              <TabsList className="grid w-full grid-cols-4 bg-[#eeeeee]">
                <TabsTrigger value="start">
                  <AlignHorizontalJustifyStart className="size-4 rounded" />
                </TabsTrigger>
                <TabsTrigger value="center">
                  <AlignHorizontalJustifyCenter className="size-4 rounded" />
                </TabsTrigger>
                <TabsTrigger value="end">
                  <AlignHorizontalJustifyEnd className="size-4 rounded" />
                </TabsTrigger>
                <TabsTrigger value="space-between">
                  <AlignHorizontalSpaceBetween className="size-4 rounded" />
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
          <div className="space-y-6">
            <Card
              onClick={() => {
                addPresetStyles(filledPreset)
                // setSelectedPresets(PRESETNAMES.filled)
              }}
              className={cn(
                "relative bg-[#FAFAFA] px-2 py-0 transition-all duration-300 hover:cursor-pointer",
                { "border-[#15347B]": preset === "filled" }
              )}
            >
              <div className="absolute inset-0 z-10"></div>
              <IconButtonGen
                {...filledPreset}
                size="full"
                paddingBottom={14}
                paddingTop={14}
                width={"266px"}
                marginTop={8}
                marginBottom={8}
                marginLeft={0}
                marginRight={0}
                buttonSize={"small"}
                height={34}
              />
            </Card>
            <Card
              onClick={() => {
                addPresetStyles(outLinePreset)
                // setSelectedPresets(PRESETNAMES.outLine)
              }}
              className={cn(
                "relative bg-[#FAFAFA] px-2 py-0 transition-all duration-300 hover:cursor-pointer",
                { "border-[#15347B]": preset === "outline" }
              )}
            >
              <div className="absolute inset-0 z-10"></div>
              <IconButtonGen
                {...outLinePreset}
                size="full"
                paddingBottom={14}
                paddingTop={14}
                width={"266px"}
                marginTop={8}
                marginBottom={8}
                marginLeft={0}
                marginRight={0}
                buttonSize={"small"}
                height={34}
              />
            </Card>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="tracking">
        <AccordionTrigger>{t("Tracking")}</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={tracking}
              onCheckedChange={(e) => {
                // setProp((props) => (props.enableIcon = e), 1000)
                handlePropChange("tracking", e)
              }}
              id="enableTracking"
            />
            <Label htmlFor="enableTracking">{t("Tracking activated")}</Label>
          </div>
          {tracking && (
            <div className="space-y-2">
              <Label htmlFor="event-name">{t("Event Name")}</Label>
              <Input
                id="event-name"
                value={trackingEvent}
                defaultValue={trackingEvent}
                onChange={(e) => {
                  setProp((props) => (props.trackingEvent = e.target.value), 0)
                }}
                type={"text"}
                placeholder={t("Tracking Event")}
              />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/**Removed until further notice */}
      {/* <AccordionItem value="item-7">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Dimensions </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Width</p>
              <Input
                defaultValue={width}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.width = e.target.value))
                }
              />
            </div>
            <div className="style-control col-span-2 flex grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Height</p>
              <Input
                defaultValue={height}
                onChange={(e) =>
                  setProp((props) => (props.height = e.target.value))
                }
                className="w-full"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Padding </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Left</p>
              <Input
                type="number"
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
        <AccordionItem value="item-3">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Appearance</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-2">
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Text</p>
              <Input
                type="color"
                value={color}
                onChange={(e) => {
                  setProp((props) => (props.color = e.target.value), 1000)
                }}
              />
            </div>
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Background</p>
              <Input
                type="color"
                value={background}
                onChange={(e) => {
                  setProp((props) => (props.background = e.target.value), 1000)
                }}
              />
            </div>

            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Text Hover</p>
              <Input
                type="color"
                value={colorHover}
                onChange={(e) => {
                  setProp((props) => (props.colorHover = e.target.value), 1000)
                }}
              />
            </div>
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Background Hover</p>
              <Input
                type="color"
                value={backgroundHover}
                onChange={(e) => {
                  setProp(
                    (props) => (props.backgroundHover = e.target.value),
                    1000
                  )
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Alignment </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Direction</p>
              <RadioGroup
                defaultValue={flexDirection}
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
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="column-reverse" id="r4" />
                  <Label htmlFor="r4">Column reverse</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="row-reverse" id="r5" />
                  <Label htmlFor="r5">Row reverse</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="style-control col-span-1 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Align</p>
              <RadioGroup
                defaultValue={alignItems}
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

            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Gap</p>
              <Input
                type="number"
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
                placeholder={radius}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.radius = e.target.value), 1000)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem> */}
    </Accordion>
  )
}
