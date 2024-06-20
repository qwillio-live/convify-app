import React, { useCallback, useEffect, useState } from "react"
import { MoveHorizontal, GripVertical, Trash2, Plus } from "lucide-react"
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

import useSelectThemePresets from "./useSelectThemePresets"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import {
  useScreenNames,
  useScreensLength,
} from "@/lib/state/flows-state/features/screenHooks"
import { RootState } from "@/lib/state/flows-state/store"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import hexoid from "hexoid"

export const SelectSettings = () => {
  const t = useTranslations("Components")
  const screenNames = useScreenNames()
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

  const {
    actions: { setProp },
    props: {
      props,
      selectOptions,
      required,
      sortAlphabetically,
      label,
      fieldName,
      placeholder,
      size,
      containerBackground,
      custom,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
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
        className="mb-10 w-full"
      >
        <AccordionItem value="content">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Content")}</span>
          </AccordionTrigger>
          <AccordionContent className="w-full space-y-2 p-2">
            <div className="text-muted-foreground">
              {t("Drag to re-arrange click to edit")}
            </div>

            <Reorder.Group
              axis="y"
              values={selectOptions}
              className="flex w-full flex-col gap-2"
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
              className="w-full"
              variant="secondary"
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
              <Plus className="mr-2 size-4" /> {t("Add new")}
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="general">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("General")}</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-4 p-2">
            <div className="col-span-2 flex flex-row items-center space-x-2">
              <Checkbox
                className="border-input ring-offset-background focus-visible:ring-ring data-[state=checked]:border-primary peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                checked={required}
                onCheckedChange={(e) => {
                  handlePropChange("required", e)
                }}
                id="required"
              />
              <label
                htmlFor="required"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Required")}
              </label>
            </div>

            <div className="col-span-2 flex flex-row items-center space-x-2">
              <Checkbox
                className="border-input ring-offset-background focus-visible:ring-ring data-[state=checked]:border-primary peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                checked={sortAlphabetically}
                onCheckedChange={(e) => {
                  handlePropChange("sortAlphabetically", e)
                }}
                id="sortAlphabetically"
              />
              <label
                htmlFor="sortAlphabetically"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Sort Alphabetically")}
              </label>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-1">
              <label
                htmlFor="placeholder-text"
                className="text-sm font-medium leading-none no-underline decoration-dotted peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Placeholder")}
              </label>
              <Input
                value={placeholder}
                onChange={(e) =>
                  handlePropChange("placeholder", e.target.value)
                }
                type={"text"}
                placeholder={t("Enter placeholder text")}
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-1">
              <label
                htmlFor="placeholder-text"
                className="text-sm font-medium leading-none no-underline decoration-dotted peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Field Name")}
              </label>
              <Input
                value={fieldName}
                onChange={(e) => handlePropChange("fieldName", e.target.value)}
                type={"text"}
                placeholder={t("Enter field name here")}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

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
                onValueChange={(e) => handlePropChangeDebounced("marginTop", e)}
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
                  handlePropChangeDebounced("marginLeft", e)
                }
              />
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
      value={option}
      transition={{ duration: 0 }}
      id={`select-option-item-${option.id}`}
      style={{ y }}
      className="flex w-full select-none items-center gap-2 [&>div]:hover:visible [&>svg]:hover:visible"
    >
      <Input
        className="h-8 flex-1"
        value={option.value}
        placeholder={`${t("Option")} ${index + 1}`}
        onChange={(e) => handleOptionEdit(e.target.value)}
      />
      <Trash2
        className="text-muted-foreground invisible size-3 hover:cursor-pointer"
        onClick={handleOptionDelete}
      />
      <div
        onPointerDown={(e) => controls.start(e)}
        className="reorder-handle invisible hover:cursor-move"
      >
        <GripVertical className="text-muted-foreground size-4" />
      </div>
    </Reorder.Item>
  )
}
