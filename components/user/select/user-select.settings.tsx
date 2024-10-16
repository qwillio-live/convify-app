import React, { useCallback, useEffect, useState } from "react"
import { MoveHorizontal, GripVertical, Trash2, Plus, Trash } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"
import { useTranslations } from "next-intl"

import { throttle, debounce } from "lodash"
import { useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/custom-checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/custom-slider"

import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import hexoid from "hexoid"
import { ColorInput } from "@/components/color-input"
import { Icons } from "@/components/icons"

export const SelectSettings = () => {
  const t = useTranslations("Components")

  const {
    actions: { setProp },
    props: {
      props,
      selectOptions,
      required,
      sortAlphabetically,
      label,
      fieldName: originalFieldname,
      placeholder: originalPlaceholder,
      size,
      containerBackground,
      custom,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      labelColor,
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
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const [placeholder, setPlaceholder] = useState(originalPlaceholder)
  const [fieldName, setFieldname] = useState(originalFieldname)

  useEffect(() => {
    setPlaceholder(originalPlaceholder)
  }, [originalPlaceholder])

  useEffect(() => {
    setFieldname(originalFieldname)
  }, [originalFieldname])

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
            <span className="text-muted-foreground text-xs">
              {t("Drag to re-arrange click to edit")}
            </span>

            <Reorder.Group
              axis="y"
              values={selectOptions}
              className="flex w-full flex-col gap-4"
              onReorder={(e) => handlePropChange("selectOptions", e)}
            >
              {selectOptions.map((option, index) => (
                <SelectOptionSettings
                  key={`select-option-item-${option.id}`}
                  option={option}
                  index={index}
                  handlePropChangeDebounced={handlePropChangeDebounced}
                />
              ))}
            </Reorder.Group>
            <Button
              className="h-9.5 w-full bg-[#23262C] text-white"
              size="sm"
              onClick={() =>
                handlePropChange("selectOptions", [
                  ...selectOptions,
                  {
                    id: `select-option-item-${hexoid(4)()}`,
                    value: `${t("Option")} ${selectOptions.length + 1}`,
                  },
                ])
              }
            >
              <Plus className="mr-2 size-4" /> {t("Add new option")}
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="general">
          <AccordionTrigger> {t("General")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={required}
                onCheckedChange={(e) => {
                  handlePropChange("required", e)
                }}
                id="required"
              />
              <Label htmlFor="required">{t("Required")}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={sortAlphabetically}
                onCheckedChange={(e) => {
                  handlePropChange("sortAlphabetically", e)
                }}
                id="sortAlphabetically"
              />
              <Label htmlFor="sortAlphabetically">
                {t("Sort Alphabetically")}
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeholder-text">{t("Placeholder")}</Label>
              <Input
                id="placeholder-text"
                value={placeholder}
                onChange={(e) => {
                  setPlaceholder(e.target.value)
                  handlePropChangeDebounced("placeholder", e.target.value)
                }}
                type={"text"}
                placeholder={t("Enter placeholder text")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-name">{t("Field Name")}</Label>
              <Input
                id="field-name"
                value={fieldName}
                onChange={(e) => {
                  setFieldname(e.target.value)
                  handlePropChangeDebounced("fieldName", e.target.value)
                }}
                type={"text"}
                placeholder={t("Enter field name here")}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="design">
          <AccordionTrigger>{t("Design")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="backgroundcolor">{t("Background Color")}</Label>
              <ColorInput
                id="backgroundcolor"
                value={containerBackground}
                handleChange={(e) => {
                  debouncedSetProp("containerBackground", e.target.value)
                }}
                handleRemove={() =>
                  debouncedSetProp("containerBackground", "transparent")
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="labelColor">{t("Label Color")}</Label>
              <ColorInput
                id="labelColor"
                value={labelColor === "#ffffff" ? null : labelColor}
                handleChange={(e) => {
                  handlePropChange("labelColor", e.target.value)
                }}
                handleRemove={() => handlePropChange("labelColor", "#ffffff")}
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
                    handlePropChangeDebounced("marginTop", e)
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
                    handlePropChangeDebounced("marginBottom", e)
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
                    handlePropChangeDebounced("marginRight", e)
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
                    handlePropChangeDebounced("marginLeft", e)
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export const SelectOptionSettings = ({
  option: originalOption,
  index,
  handlePropChangeDebounced,
}) => {
  const t = useTranslations("Components")
  const y = useMotionValue(0)
  const controls = useDragControls()

  const {
    actions: { setProp },
    props: { selectedOptionId, selectOptions },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const [option, setOption] = useState(originalOption)

  useEffect(() => {
    setOption(originalOption)
  }, [originalOption])

  const handleOptionDelete = () => {
    if (option.id === selectedOptionId)
      setProp((props) => (props.selectedOptionId = undefined), 200)
    setProp(
      (props) =>
        (props.selectOptions = props.selectOptions.filter(
          (_, i) => i !== index
        )),
      200
    )
  }

  const handleOptionEdit = (updatedValue) => {
    setOption({ ...option, value: updatedValue })
    handlePropChangeDebounced("selectOptions", [
      ...selectOptions.slice(0, index),
      { ...option, value: updatedValue },
      ...selectOptions.slice(index + 1),
    ])
    // setProp((props) => (props.selectOptions[index].value = newValue), 200)
  }

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={originalOption}
      transition={{ duration: 0 }}
      id={`select-option-item-${originalOption.id}`}
      style={{ y }}
      className="flex w-full select-none items-center gap-1"
    >
      <Input
        className="h-8.5 mr-1 flex-1 bg-[#FAFAFA] text-xs"
        value={option.value}
        placeholder={`${t("Option")} ${index + 1}`}
        onChange={(e) => handleOptionEdit(e.target.value)}
      />
      <Icons.Delete
        className="hover:cursor-pointer"
        onClick={handleOptionDelete}
      />
      <div
        onPointerDown={(e) => controls.start(e)}
        className="reorder-handle hover:cursor-move"
      >
        <Icons.GripVertical />
      </div>
    </Reorder.Item>
  )
}
