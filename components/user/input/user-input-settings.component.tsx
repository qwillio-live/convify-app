import React, { useCallback, useEffect, useState } from "react"
import { debounce, throttle } from "lodash"
import {
  Activity,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceBetween,
  Anchor,
  Aperture,
  ArrowRight,
  Disc,
  DollarSign,
  Image,
  Mountain,
  MoveHorizontal,
} from "lucide-react"
import { useTranslations } from "next-intl"
import ContentEditable from "react-contenteditable"

import { useEditor, useNode } from "@/lib/craftjs"
import { setFieldProp } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useAppDispatch } from "@/lib/state/flows-state/hooks"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { PicturePicker, PictureTypes } from "@/components/PicturePicker"
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
import useInputThemePresets from "./useInputThemePresets"
import { UserInput, UserInputGen } from "./user-input.component"
import { InputSettingsIconPicker } from "./user-input-icon-picker"
import { ColorInput } from "@/components/color-input"

export const UserInputSettings = () => {
  const t = useTranslations("Components")
  const {
    actions: { setProp },
    compId,
    parentScreenId,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    textColor,
    width,
    props,
    parent,
    props: { enableIcon, icon },
  } = useNode((node) => ({
    parent: node.data.parent,
    compId: node.id,
    props: node.data.props,
    parentScreenId: node.data.props.parentScreenId,
    marginLeft: node.data.props.marginLeft,
    marginRight: node.data.props.marginRight,
    marginTop: node.data.props.marginTop,
    marginBottom: node.data.props.marginBottom,
    textColor: node.data.props.textColor,
    width: node.data.props.width,
  }))

  const {
    // query,
    query: { node },
  } = useEditor()
  const dispatch = useAppDispatch()
  const parentContainer = node(parent || "").get()
  const [disableSize, setDisableSize] = useState(false)
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
  }, [parentContainer])

  enum PRESETNAMES {
    outlined = "outlined",
    underlined = "underlined",
  }
  const { outlinedPreset, underlinedPreset } = useInputThemePresets()
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
  const throttledSetProp = useCallback(
    throttle((property, value) => {
      setProp((prop) => {
        prop[property] = value
      }, 0)
    }, 200), // Throttle to 50ms to 200ms
    [setProp]
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
  const handlePictureChange = (picture, pictureType) => {
    // setChoice({ ...choice, picture, pictureType })
    handlePropChangeDebounced("icon", {
      picture,
      pictureType,
    })
  }

  const handlePropChange = (property, value) => {
    throttledSetProp(property, value)
  }
  return (
    <>
      <Accordion
        value={props.settingsTab}
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
                value={props.inputRequired}
                checked={props.inputRequired}
                onCheckedChange={(e) => {
                  setProp((props) => (props.inputRequired = e), 200)
                  dispatch(
                    setFieldProp({
                      screenId: parentScreenId,
                      fieldId: compId,
                      fieldName: "fieldRequired",
                      fieldValue: e,
                    })
                  )
                  // setProp((props) => (props.error = !props.error),200)
                }}
                id="required"
              />
              <label
                htmlFor="required"
                className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Required")}
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
                {t("Floating Label")}
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label-text">{t("Label")}</Label>
              <Input
                id="label-text"
                value={props.label}
                defaultValue={props.label}
                onChange={(e) => {
                  setProp((props) => (props.label = e.target.value), 0)
                  // handlePropChange("label",e.target.value);
                }}
                type={"text"}
                placeholder={t("Enter label text")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeholder-text">{t("Placeholder")}</Label>
              <Input
                id="placeholder-text"
                value={props.placeholder}
                onChange={(e) => {
                  setProp((props) => (props.placeholder = e.target.value), 0)
                  // handlePropChange("placeholder",e.target.value);
                }}
                type={"text"}
                placeholder={t("Enter placeholder text")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-name">{t("Field Name")}</Label>
              <Input
                id="field-name"
                value={props.fieldName}
                onChange={(e) =>
                  setProp((props) => (props.fieldName = e.target.value), 1000)
                }
                type={"text"}
                placeholder={t("Enter field name here")}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="design">
          <AccordionTrigger>{t("Design")}</AccordionTrigger>
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
              <Label htmlFor="enableIcon">{t("Decorator")}</Label>
            </div>

            {enableIcon && (
              <div className="flex items-center justify-between">
                <Label>{t("Select Icons")}</Label>
                <InputSettingsIconPicker
                  className="w-auto"
                  icon={icon}
                  onChange={(icon) => {
                    debouncedSetProp("icon", icon)
                  }}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="backgroundcolor">{t("Background Color")}</Label>
              <ColorInput
                id="backgroundcolor"
                value={props.backgroundColor}
                handleChange={(e) => {
                  handlePropChange("backgroundColor", e.target.value)
                }}
                handleRemove={() =>
                  debouncedSetProp("backgroundColor", "transparent")
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
                    // setProp((props) => (props.marginTop = e),200)
                    handlePropChange("marginTop", e)
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
                    handlePropChange("marginBottom", e)
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
                    handlePropChange("marginRight", e)
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
                    handlePropChange("marginLeft", e)
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="styles">
          <AccordionTrigger>{t("Styles")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <Card
              onClick={() => {
                addPresetStyles(outlinedPreset)
              }}
              className={cn(
                "relative bg-[#FAFAFA] p-2 !text-sm transition-all duration-300 hover:cursor-pointer",
                { "border-[#2B3398]": props.preset === "outlined" }
              )}
            >
              <div className="bg-white-50/0 absolute z-10 h-full w-full"></div>
              <UserInputGen
                {...outlinedPreset}
                floatingLabel={true}
                size="full"
                enableIcon={false}
                marginLeft="0"
                marginRight="0"
                marginTop="0"
                marginBottom="0"
                backgroundColor="#fff"
                label={t("Label")}
              />
            </Card>
            <Card
              onClick={() => {
                addPresetStyles(underlinedPreset)
              }}
              className={cn(
                "relative p-2 transition-all duration-300 hover:cursor-pointer ",
                { "border-[#2B3398]": props.preset === "underlined" }
              )}
            >
              <div className="bg-white-50/0 absolute z-10 h-full w-full"></div>
              <UserInputGen
                {...underlinedPreset}
                floatingLabel={true}
                size="full"
                enableIcon={false}
                marginLeft="0"
                marginRight="0"
                marginTop="0"
                marginBottom="0"
                backgroundColor="#fff"
                label={t("Label")}
              />
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
