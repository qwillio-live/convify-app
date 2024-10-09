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
  Mail,
  Mountain,
  MoveHorizontal,
  Phone,
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
import useInputPhoneThemePresets from "./useInputPhoneThemePresets"
import { UserInputPhone, UserInputPhoneGen } from "./user-input-phone.component"
import { InputSettingsIconPicker } from "../input/user-input-icon-picker"
import { ColorInput } from "@/components/color-input"

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

export const UserInputPhoneSettings = () => {
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
  const { outlinedPresetPhone, underlinedPresetPhone } =
    useInputPhoneThemePresets()
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
      >
        <AccordionItem value="content">
          <AccordionTrigger>{tComponents("Content")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
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
              <Label htmlFor="required">{tComponents("Required")}</Label>
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
              <Label htmlFor="floating-label">
                {tComponents("Floating Label")}
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label-text">{tComponents("Label")}</Label>
              <Input
                id="label-text"
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

            <div className="space-y-2">
              <Label htmlFor="placeholder-text">
                {tComponents("Placeholder")}
              </Label>
              <Input
                id="placeholder-text"
                value={props.placeholder}
                onChange={(e) => {
                  setProp((props) => (props.placeholder = e.target.value), 0)
                  // handlePropChange("placeholder",e.target.value);
                }}
                type={"text"}
                placeholder={tComponents("Enter placeholder text")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-name">{tComponents("Field Name")}</Label>
              <Input
                id="field-name"
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
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={props.enableIcon}
                onCheckedChange={(e) => {
                  // setProp((props) => (props.enableIcon = e), 1000)
                  handlePropChange("enableIcon", e)
                }}
                id="enableIcon"
              />
              <Label htmlFor="enableIcon">{tComponents("Decorator")}</Label>
            </div>
            {props.enableIcon && (
              <div className="flex items-center justify-between">
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

                <Label>{tComponents("Select Icons")}</Label>
                <InputSettingsIconPicker
                  className="w-auto"
                  icon={props.icon}
                  onChange={(icon) => {
                    handlePropChange("icon", icon)
                  }}
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label htmlFor="backgroundcolor">
                {tComponents("Background Color")}
              </Label>
              <ColorInput
                id="backgroundcolor"
                value={props.backgroundColor}
                handleChange={(e) => {
                  handlePropChange("backgroundColor", e.target.value)
                }}
                handleRemove={() =>
                  handlePropChange("backgroundColor", "transparent")
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="textColor">{tComponents("Label Color")}</Label>
              <ColorInput
                id="textColor"
                value={textColor === "#ffffff" ? null : textColor}
                handleChange={(e) => {
                  handlePropChange("textColor", e.target.value)
                }}
                handleRemove={() => handlePropChange("textColor", "#ffffff")}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="spacing">
          <AccordionTrigger>{tComponents("Spacing")}</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2">
            <div className="space-y-2">
              <Label>{tComponents("Width")}</Label>
              <Tabs
                defaultValue={props.size}
                value={props.size}
                onValueChange={(value) => {
                  setProp((props) => (props.size = value), 1000)
                }}
              >
                <TabsList className="grid w-full grid-cols-4 bg-[#eeeeee]">
                  <TabsTrigger
                    value="small"
                    className="rounded text-base leading-4"
                  >
                    {tComponents("S")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="medium"
                    className="rounded text-base leading-4"
                  >
                    {tComponents("M")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="large"
                    className="rounded text-base leading-4"
                  >
                    {tComponents("L")}
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
                  <Label htmlFor="marginTop">{tComponents("Top")}</Label>
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
                    handlePropChange("marginTop", e)
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marginTop">{tComponents("Bottom")}</Label>
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
                    handlePropChange("marginBottom", e)
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marginTop">{tComponents("Right")}</Label>
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
                    handlePropChange("marginRight", e)
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marginTop">{tComponents("Left")}</Label>
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
                    handlePropChange("marginLeft", e)
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="styles">
          <AccordionTrigger>{tComponents("Styles")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <Card
              onClick={() => {
                addPresetStyles(outlinedPresetPhone)
              }}
              className={cn(
                "relative p-2 transition-all duration-300 hover:cursor-pointer",
                { "border-[#2B3398]": props.preset === "outlined" }
              )}
            >
              <div className="bg-white-50/0 absolute z-10 size-full"></div>
              <UserInputPhoneGen
                {...outlinedPresetPhone}
                floatingLabel={true}
                size="full"
                enableIcon={true}
                marginLeft="0"
                marginRight="0"
                marginTop="0"
                marginBottom="0"
                backgroundColor="#fff"
                label={tComponents("Label")}
              />
            </Card>
            <Card
              onClick={() => {
                addPresetStyles(underlinedPresetPhone)
              }}
              className={cn(
                "relative p-2 transition-all duration-300 hover:cursor-pointer",
                { "border-[#2B3398]": props.preset === "underlined" }
              )}
            >
              <div className="bg-white-50/0 absolute z-10 size-full"></div>
              <UserInputPhoneGen
                {...underlinedPresetPhone}
                floatingLabel={true}
                size="full"
                enableIcon={true}
                marginLeft="0"
                marginRight="0"
                marginTop="0"
                marginBottom="0"
                backgroundColor="#fff"
                label={tComponents("Label")}
              />
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
