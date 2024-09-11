import React, { useCallback, useEffect, useRef, useState } from "react"
import icons from "@/constant/streamline.json"
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  SuggestionMode,
} from "emoji-picker-react"
import {
  Reorder,
  useDragControls,
  useInView,
  useMotionValue,
} from "framer-motion"
import { throttle } from "lodash"
import {
  Activity,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceBetween,
  Anchor,
  Aperture,
  ArrowRight,
  CornerRightDown,
  DollarSign,
  GripVertical,
  Check as IconCheck,
  X as IconX,
  Image as ImageIcon,
  Mountain,
  MoveHorizontal,
  Phone,
  Mail,
  PlusCircle,
  Search,
  SmilePlus,
  ThumbsUp,
  Trash2,
} from "lucide-react"
import { useTranslations } from "next-intl"
import ContentEditable from "react-contenteditable"
import { createPortal } from "react-dom"
import { useEventListener } from "usehooks-ts"

import { useEditor, useNode } from "@/lib/craftjs"
import {
  useScreenNames,
  useScreensLength,
} from "@/lib/state/flows-state/features/screenHooks"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { cn } from "@/lib/utils"
import { isValidUrl } from "@/lib/utils/text"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button, Button as CustomButton } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// import {useInView}

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import useInputMailThemePresets from "./useInputMailThemePresets"
import { UserInputMail, UserInputMailGen } from "./user-input-mail.component"

const IconRenderer = ({ iconName, onClick }) => {
  const ref = useRef(null)
  const isInView = useInView(ref)
  return (
    <div className="max-h-[160px]">
      <div
        ref={ref}
        className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex h-auto max-h-full w-auto max-w-full items-center justify-center rounded-md bg-transparent p-4 text-center"
        onClick={() => onClick(iconName)}
      >
        {isInView && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            dangerouslySetInnerHTML={{ __html: icons[iconName]?.body || "" }}
            className="ml-10 mt-8 h-24 w-24 cursor-pointer"
          />
        )}
      </div>
    </div>
  )
}

const convertToSvg = (svgBody) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 cursor-pointer" width="15"
  height="15">${svgBody}</svg>`
}

export const UserInputMailSettings = () => {
  const tComponents = useTranslations("Components")
  const tCreateFlow = useTranslations("CreateFlow")

  const {
    actions: { setProp },
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    textColor,
    width,
    parent,
    props,
  } = useNode((node) => ({
    parent: node.data.parent,
    props: node.data.props,
    marginLeft: node.data.props.marginLeft,
    marginRight: node.data.props.marginRight,
    marginTop: node.data.props.marginTop,
    marginBottom: node.data.props.marginBottom,
    textColor: node.data.props.textColor,
    width: node.data.props.width,
    pictureItems: node.data.props.pictureItems,
  }))
  const {
    // query,
    query: { node },
  } = useEditor()
  const parentContainer = node(parent || "").get()
  const { outlinedPresetMail, underlinedPresetMail } =
    useInputMailThemePresets()
  const addPresetStyles = (preset) => {
    const staticStyles = [
      "error",
      "inputRequired",
      "label",
      "placeHolder",
      "backgroundColor",
      "fieldName",
      "floatingLabel",
      "settingsTab",
      "inputValue",
      "icon",
      "enableIcon",
      "size",
      "fullWidth",
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
  const [isPopoverOpen, setPopoverOpen] = useState(false)
  const popoverRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [disableSize, setDisableSize] = useState(false)

  const closePopover = () => {
    setPopoverOpen(false)
  }
  const screensLength = useScreensLength()
  const selectedScreen = useAppSelector(
    (state: RootState) => state.screen?.selectedScreen ?? 0
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        closePopover()
      }
    }

    if (isPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPopoverOpen, popoverRef])

  const filteredIcons = Object.keys(icons).filter((iconName) =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSVGChange = (iconName) => {
    // Get the SVG data for the selected icon

    const svgData = convertToSvg(isValidUrl(icons[iconName]?.body))
    setProp((props) => (props.icon = iconName), 1000)

    if (svgData) {
      //  the SVG data into a Blob
      const blob = new Blob([svgData], { type: "image/svg+xml" })
      // Create a URL for the Blob
      const imageUrl = URL.createObjectURL(blob)
      // Update the pictureItems state accordingly
      // setProp((props) => {
      //   const updatedProps = { ...props }
      //   return updatedProps
      // }, 1000)
      console.log("IMAGE URL", imageUrl)
    }
    setOpen(false)
    return { ...props }
  }

  useEffect(() => {
    if (
      parentContainer.id !== "ROOT" &&
      parentContainer.data.name === "CardContent"
    ) {
      setProp((props) => (props.size = "full"))
      setDisableSize(true)
    } else {
      setDisableSize(false)
    }
  }, [parentContainer, setProp])

  enum PRESETNAMES {
    outlined = "outlined",
    underlined = "underlined",
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

  return (
    <>
      <Accordion
        value={props.settingsTab || "content"}
        onValueChange={(value) => {
          setProp((props) => (props.settingsTab = value), 200)
        }}
        type="multiple"
        defaultValue={["content"]}
        className="w-full"
      >
        <AccordionItem value="content">
          <AccordionTrigger>{tComponents("Content")}</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                value={props.inputRequired}
                checked={props.inputRequired}
                onCheckedChange={(e) => {
                  setProp((props) => (props.inputRequired = e), 200)
                  // setProp((props) => (props.error = !props.error),200)
                }}
                id="required"
              />
              <label
                htmlFor="required"
                className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tComponents("Required")}
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={props.floatingLabel}
                onCheckedChange={(e) => {
                  setProp((props) => (props.floatingLabel = e), 0)
                  // handlePropChange("floatingLabel",e);
                }}
                id="floating-label"
              />
              <label
                htmlFor="floating-label"
                className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tComponents("Floating Label")}
              </label>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-1">
              <label
                htmlFor="label-text"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tComponents("Label")}
              </label>
              <Input
                value={props.label}
                defaultValue={props.label}
                onChange={(e) => {
                  setProp((props) => (props.label = e.target.value), 0)
                  // handlePropChange("label",e.target.value);
                }}
                type={"text"}
                placeholder={tComponents("Enter label text")}
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-1">
              <label
                htmlFor="placeholder-text"
                className="text-sm font-medium leading-none no-underline decoration-dotted peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tComponents("Placeholder")}
              </label>
              <Input
                value={props.placeholder}
                onChange={(e) => {
                  setProp((props) => (props.placeholder = e.target.value), 0)
                  // handlePropChange("placeholder",e.target.value);
                }}
                type={"text"}
                placeholder={tComponents("Enter placeholder text")}
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-1">
              <label
                htmlFor="placeholder-text"
                className="text-sm font-medium leading-none no-underline decoration-dotted peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tComponents("Field Name")}
              </label>
              <Input
                value={props.fieldName}
                onChange={(e) =>
                  setProp((props) => (props.fieldName = e.target.value), 1000)
                }
                type={"text"}
                placeholder={tComponents("Enter field name here")}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="design">
          <AccordionTrigger>{tComponents("Design")}</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={props.enableIcon}
                onCheckedChange={(e) => {
                  // setProp((props) => (props.enableIcon = e), 1000)
                  handlePropChange("enableIcon", e)
                }}
                id="enableIcon"
              />
              <label
                htmlFor="enableIcon"
                className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tComponents("Decorator")}
              </label>
            </div>
            {props.enableIcon && (
              <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-row items-center gap-2">
                {/* {props.enableIcon && (
                <>
                  <p className="text-md flex-1 text-muted-foreground">
                    {t("Icon")}
                  </p>
                  <Select
                    defaultValue={props.icon}
                    onValueChange={(e) => {
                      setProp((props) => (props.icon = e), 1000)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="arrowright">
                          <ArrowRight />
                        </SelectItem>
                        <SelectItem value="aperture">
                          <Aperture />
                        </SelectItem>
                        <SelectItem value="activity">
                          <Activity />
                        </SelectItem>
                        <SelectItem value="dollarsign">
                          <DollarSign />
                        </SelectItem>
                        <SelectItem value="anchor">
                          <Anchor />
                        </SelectItem>
                        <SelectItem value="disc">
                          <Disc />
                        </SelectItem>
                        <SelectItem value="mountain">
                          <Mountain />
                        </SelectItem>
                        <SelectItem value="phone">
                          <Phone />
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </>
              )} */}
                {/* <p className="text-md flex-1 text-muted-foreground">
                {t("Icon")}
              </p> */}
                <Dialog open={open} onOpenChange={setOpen}>
                  <div className="text-md text-muted-foreground flex w-full items-center justify-between rounded py-2 pr-4">
                    <span>{tCreateFlow("PictureChoice.icon")}</span>
                    <DialogTrigger asChild>
                      {
                        <div
                          dangerouslySetInnerHTML={{
                            __html: convertToSvg(icons[props.icon]?.body),
                          }}
                          className="border-border flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border bg-white"
                        />
                      }
                    </DialogTrigger>
                  </div>

                  {/* icons */}
                  <DialogContent className="h-[70%] overflow-y-auto sm:max-h-[70%] sm:max-w-[80%]">
                    <DialogHeader className="sticky top-0 z-10 bg-white px-2 py-4">
                      <div className="flex items-center justify-start gap-4">
                        <div>
                          <DialogTitle>
                            {tCreateFlow("PictureChoice.icon")}
                          </DialogTitle>
                          <DialogDescription>
                            {tCreateFlow("PictureChoice.iconDesc")}
                          </DialogDescription>
                        </div>
                        <div className="relative ml-auto flex flex-1 items-center md:grow-0">
                          <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
                          <Input
                            type="search"
                            placeholder={tCreateFlow(
                              "PictureChoice.iconSearch"
                            )}
                            className="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[336px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <DialogClose asChild>
                          <Button variant="ghost">
                            <IconX className="size-5 shrink-0" />
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogHeader>
                    <div className="ml-4 mt-4 grid grid-cols-6 gap-4">
                      {filteredIcons.length > 0 ? (
                        filteredIcons.map((iconName) => (
                          <IconRenderer
                            key={iconName}
                            iconName={iconName}
                            onClick={handleSVGChange}
                          />
                        ))
                      ) : (
                        <div className="col-span-6 mt-4 text-center">
                          {tCreateFlow("PictureChoice.iconNotFound")}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            <div className="col-span-2 flex flex-row items-center space-x-2">
              <label
                htmlFor="backgroundcolor"
                className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tComponents("Background Color")}
              </label>
              <Input
                // defaultValue={themeBackgroundColor}
                // value={containerBackground}
                value={props.backgroundColor}
                onChange={(e) => {
                  // debouncedSetProp("containerBackground",e.target.value)
                  handlePropChange("backgroundColor", e.target.value)
                }}
                className="basis-1/3"
                type={"color"}
                id="backgroundcolor"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="spacing">
          <AccordionTrigger>{tComponents("Spacing")} </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <p className="text-md text-muted-foreground">
                {tComponents("Width")}
              </p>
              <Tabs
                defaultValue={props.size}
                value={props.size}
                onValueChange={(value) => {
                  setProp((props) => (props.size = value), 1000)
                }}
                className="flex-1"
              >
                <TabsList
                  className={cn("grid w-full grid-cols-4", {
                    "cursor-not-allowed": disableSize,
                  })}
                >
                  <TabsTrigger disabled={disableSize} value="small">
                    {tComponents("S")}
                  </TabsTrigger>
                  <TabsTrigger disabled={disableSize} value="medium">
                    {tComponents("M")}
                  </TabsTrigger>
                  <TabsTrigger disabled={disableSize} value="large">
                    {tComponents("L")}
                  </TabsTrigger>
                  <TabsTrigger disabled={disableSize} value="full">
                    <MoveHorizontal />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{tComponents("Top")}</Label>
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
                  handlePropChange("marginTop", e)
                }
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{tComponents("Bottom")}</Label>
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
                  handlePropChange("marginBottom", e)
                }
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{tComponents("Right")}</Label>
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
                  handlePropChange("marginRight", e)
                }
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{tComponents("Left")}</Label>
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
                  handlePropChange("marginLeft", e)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="styles">
          <AccordionTrigger>{tComponents("Styles")}</AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-4">
              <Card
                onClick={() => {
                  addPresetStyles(outlinedPresetMail)
                }}
                className={cn(
                  "relative px-2 py-0 transition-all duration-300 hover:cursor-pointer",
                  { "border-blue-500": props.preset === "outlined" }
                )}
              >
                <div className="bg-white-50/0 absolute z-10 h-full w-full"></div>
                <UserInputMailGen
                  {...outlinedPresetMail}
                  floatingLabel={true}
                  size="full"
                  enableIcon={true}
                  marginLeft="0"
                  marginRight="0"
                  backgroundColor="#fff"
                  label={tComponents("Label")}
                />
              </Card>
              <Card
                onClick={() => {
                  addPresetStyles(underlinedPresetMail)
                }}
                className={cn(
                  "relative px-2 py-0 transition-all duration-300 hover:cursor-pointer",
                  { "border-blue-500": props.preset === "underlined" }
                )}
              >
                <div className="bg-white-50/0 absolute z-10 h-full w-full"></div>
                <UserInputMailGen
                  {...underlinedPresetMail}
                  floatingLabel={true}
                  size="full"
                  enableIcon={true}
                  marginLeft="0"
                  marginRight="0"
                  backgroundColor="#fff"
                  label={tComponents("Label")}
                />
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
