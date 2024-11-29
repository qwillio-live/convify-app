import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  MoveHorizontal,
  GripVertical,
  Trash2,
  Plus,
  Image,
  Trash,
} from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/custom-slider"

import { useAppSelector } from "@/lib/state/flows-state/hooks"
import {
  useScreenNames,
  useScreensLength,
} from "@/lib/state/flows-state/features/screenHooks"
import { RootState } from "@/lib/state/flows-state/store"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import hexoid from "hexoid"
import {
  PictureChoiceGen,
  PictureChoicePresets,
} from "./user-picture-choice.component"
import { Card } from "@/components/ui/card"
import usePictureChoiceThemePresets from "./usePictureChoiceThemePresets"
import { Switch } from "@/components/custom-switch"
import { Checkbox } from "@/components/custom-checkbox"
import { PicturePicker, PictureTypes } from "@/components/PicturePicker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/custom-select"
import { ColorInput } from "@/components/color-input"
import { Icons } from "@/components/icons"

export const PictureChoiceSettings = () => {
  const t = useTranslations("Components")

  const {
    actions: { setProp },
    props: {
      fontFamily,
      size,
      required,
      fieldName: originalFieldName,
      containerBackground,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      settingTabs,
      multiSelect,
      checkboxVisible,
      contentReversed,
      preset,
      defaultStyles,
      labelColor,
      hoverStyles,
      selectedStyles,
      selections,
      choices,
      tracking,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const [fieldName, setFieldName] = useState(originalFieldName)

  useEffect(() => {
    setFieldName(originalFieldName)
  }, [originalFieldName])

  const {
    filledPreset,
    semifilledPreset,
    preFilledPresent,
    outlinedPreset,
    defaultIcon,
    defaultChoices,
    defaultSelections,
  } = usePictureChoiceThemePresets()
  console.log("present", preset)
  const changePresetStyles = (preset) => {
    const updatedStyles = [
      "preset",
      "checkboxVisible",
      "contentReversed",
      "defaultStyles",
      "hoverStyles",
      "prefilled",
      "selectedStyles",
    ]
    setProp((props) => {
      Object.keys(preset).forEach((key) => {
        if (updatedStyles.includes(key)) props[key] = preset[key]
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

  const primaryColor = useAppSelector(
    (state) => state?.theme?.general?.primaryColor
  )

  useEffect(() => {
    setProp((props) => (props.selections = []), 200)
    setProp(
      (props) =>
        (props.choices = choices.map((choice) => ({
          ...choice,
          buttonAction: "custom-action",
          nextScreen: "none",
        }))),
      200
    )
  }, [multiSelect])

  useEffect(() => {
    setProp(
      (props) =>
        (props.choices = choices.map((choice) => ({
          ...choice,
          trackingEvent: null,
        }))),
      200
    )
  }, [tracking])

  return (
    <>
      <Accordion
        value={settingTabs || ["content"]}
        onValueChange={(value) => {
          setProp((props) => (props.settingTabs = value), 200)
        }}
        type="multiple"
        defaultValue={settingTabs || ["content"]}
        className="w-full"
      >
        <AccordionItem value="content">
          <AccordionTrigger>{t("Content")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs">{t("Single")}</span>
                <Switch
                  checked={multiSelect}
                  onCheckedChange={(checked) =>
                    handlePropChange("multiSelect", checked)
                  }
                />
                <span className="text-xs">{t("Multiple")}</span>
              </div>
              <div className="text-muted-foreground text-xs">
                {t("Drag to re-arrange click to edit")}
              </div>
            </div>

            <Reorder.Group
              axis="y"
              values={choices}
              className="flex w-full flex-col gap-4"
              onReorder={(e) => handlePropChange("choices", e)}
            >
              {choices.map((choice, index) => (
                <PictureChoiceItemSettings
                  key={`input-${choice.id}`}
                  choice={choice}
                  index={index}
                  handlePropChangeDebounced={handlePropChangeDebounced}
                />
              ))}
            </Reorder.Group>
            <Button
              className="h-9.5 w-full bg-[#23262C] text-white"
              size="sm"
              onClick={() =>
                handlePropChange("choices", [
                  ...choices,
                  {
                    id: `input-${hexoid(6)()}`,
                    picture: defaultIcon,
                    pictureType: PictureTypes.ICON,
                    value: `${t("Option")} ${choices.length + 1}`,
                    buttonAction: "custom-action",
                    nextScreen: "none",
                    trackingEvent: null,
                  },
                ])
              }
            >
              <Plus className="mr-2 size-4" /> {t("Add new option")}
            </Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="general">
          <AccordionTrigger>{t("General")}</AccordionTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="field-name">{t("Field Name")}</Label>
              <Input
                id="field-name"
                value={fieldName}
                onChange={(e) => {
                  setFieldName(e.target.value)
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
            <div className="flex items-center justify-between">
              <Label>{t("Label Color")}</Label>
              <ColorInput
                value={labelColor === "#ffffff" ? null : labelColor}
                handleChange={(value) => {
                  debouncedSetProp("labelColor", value)
                }}
                handleRemove={() => debouncedSetProp("labelColor", "#ffffff")}
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
                    handlePropChangeDebounced("marginLeft", e)
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
                changePresetStyles(preFilledPresent)
              }}
              className="p-0 transition-all duration-300 hover:cursor-pointer"
              style={{
                ...(preset === PictureChoicePresets.prefilled
                  ? {
                      border: `1px solid #2B3398`,
                    }
                  : {}),
              }}
            >
              <PictureChoiceGen
                {...{
                  ...preFilledPresent,
                  multiSelect,
                  disabled: true,
                  marginTop: 16,
                  marginBottom: 16,
                  marginLeft: 16,
                  marginRight: 6,
                  labelColor: labelColor,
                  selections: defaultSelections,
                  choices: defaultChoices.slice(0, 2),
                }}
              />
            </Card>
            <Card
              onClick={() => {
                changePresetStyles(filledPreset)
              }}
              className="p-0 transition-all duration-300 hover:cursor-pointer"
              style={{
                ...(preset === PictureChoicePresets.filled
                  ? {
                      border: `1px solid #2B3398`,
                    }
                  : {}),
              }}
            >
              <PictureChoiceGen
                {...{
                  ...filledPreset,
                  multiSelect,
                  disabled: true,
                  marginTop: 16,
                  marginBottom: 16,
                  marginLeft: 16,
                  marginRight: 6,
                  labelColor: labelColor,
                  selections: defaultSelections,
                  choices: defaultChoices.slice(0, 2),
                }}
              />
            </Card>
            <Card
              onClick={() => {
                changePresetStyles(outlinedPreset)
              }}
              className="p-0 transition-all duration-300 hover:cursor-pointer"
              style={{
                ...(preset === PictureChoicePresets.outlined
                  ? {
                      border: `1px solid #2B3398`,
                    }
                  : {}),
              }}
            >
              <PictureChoiceGen
                {...{
                  ...outlinedPreset,
                  multiSelect,
                  disabled: true,
                  marginTop: 16,
                  marginBottom: 16,
                  marginLeft: 16,
                  marginRight: 6,
                  labelColor: labelColor,
                  selections: defaultSelections,
                  choices: defaultChoices.slice(0, 2),
                }}
              />
            </Card>
            <Card
              onClick={() => {
                changePresetStyles(semifilledPreset)
              }}
              className="p-0 transition-all duration-300 hover:cursor-pointer"
              style={{
                ...(preset === PictureChoicePresets.semifilled
                  ? {
                      border: `1px solid #2B3398`,
                    }
                  : {}),
              }}
            >
              <PictureChoiceGen
                {...{
                  ...semifilledPreset,
                  multiSelect,
                  disabled: true,
                  marginTop: 16,
                  marginBottom: 16,
                  marginLeft: 16,
                  marginRight: 6,
                  labelColor: labelColor,
                  selections: defaultSelections,
                  choices: defaultChoices.slice(0, 2),
                }}
              />
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tracking">
          <AccordionTrigger>{t("Tracking")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tracking"
                checked={tracking}
                onCheckedChange={(e) => {
                  handlePropChange("tracking", e)
                }}
              />
              <Label htmlFor="tracking">{t("Tracking activated")}</Label>
            </div>

            {tracking && (
              <div className="space-y-4">
                <div className="text-muted-foreground text-xs">
                  {t("Tracking Event")}
                </div>
                {choices.map((choice, index) => (
                  <PictureChoiceItemTrackingSettings
                    key={`picture-choice-tracking-event-${choice.id}`}
                    choice={choice}
                    index={index}
                    onChange={(updatedTrackingEvent) => {
                      handlePropChangeDebounced(
                        "choices",
                        choices.map((choice, i) =>
                          i === index
                            ? { ...choice, trackingEvent: updatedTrackingEvent }
                            : choice
                        )
                      )
                    }}
                  />
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export const PictureChoiceItemSettings = ({
  choice: originalChoice,
  index,
  handlePropChangeDebounced,
}) => {
  const t = useTranslations("Components")
  const y = useMotionValue(0)
  const controls = useDragControls()

  const {
    actions: { setProp },
    props: { multiSelect, selections, choices },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const [choice, setChoice] = useState(originalChoice)

  useEffect(() => {
    setChoice(originalChoice)
  }, [originalChoice])

  const handleChoiceDelete = () => {
    if (selections.includes(choice.id))
      setProp(
        (props) =>
          (props.selections = selections.filter((id) => id !== choice.id)),
        200
      )
    setProp(
      (props) => (props.choices = choices.filter((_, i) => i !== index)),
      200
    )
  }

  const handlePictureChange = (picture, pictureType) => {
    setChoice({ ...choice, picture, pictureType })
    handlePropChangeDebounced("choices", [
      ...choices.slice(0, index),
      { ...choice, picture, pictureType },
      ...choices.slice(index + 1),
    ])
  }

  const handleChoiceTextEdit = (newValue) => {
    setChoice({ ...choice, value: newValue })
    handlePropChangeDebounced("choices", [
      ...choices.slice(0, index),
      { ...choice, value: newValue },
      ...choices.slice(index + 1),
    ])
  }

  const handleNavigationChange = (buttonAction, nextScreen) => {
    setChoice({ ...choice, buttonAction, nextScreen })
    handlePropChangeDebounced("choices", [
      ...choices.slice(0, index),
      { ...choice, buttonAction, nextScreen },
      ...choices.slice(index + 1),
    ])
  }
  console.log("choicessssssss:", choices, selections)
  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={originalChoice}
      transition={{ duration: 0 }}
      id={`picture-choice-${originalChoice.id}`}
      style={{ y }}
      className="flex w-full select-none flex-col gap-1 "
    >
      <div className="flex w-full items-center space-x-2">
        <PicturePicker
          className="transition-all duration-100 ease-in-out"
          picture={
            choice.pictureType === PictureTypes.NULL ? (
              <Image className="text-muted-foreground size-4" />
            ) : (
              choice.picture
            )
          }
          pictureType={choice.pictureType}
          maxWidthMobile={400}
          maxWidthDesktop={400}
          onChange={handlePictureChange}
        />

        <Input
          className="h-8.5 flex-1 bg-[#FAFAFA] text-xs"
          value={choice.value}
          placeholder={`${t("Option")} ${index + 1}`}
          onChange={(e) => handleChoiceTextEdit(e.target.value)}
        />

        <Icons.Delete
          className="hover:cursor-pointer"
          onClick={handleChoiceDelete}
        />
        <div
          onPointerDown={(e) => controls.start(e)}
          className="reorder-handle !ml-1 hover:cursor-move"
        >
          <Icons.GripVertical />
        </div>
      </div>
      <div className="pl-10 pr-11">
        {!multiSelect && (
          <PictureChoiceItemNavigationSettings
            buttonAction={choice.buttonAction}
            nextScreen={choice.nextScreen}
            onChange={handleNavigationChange}
          />
        )}
      </div>
    </Reorder.Item>
  )
}

const PictureChoiceItemNavigationSettings = ({
  buttonAction,
  nextScreen,
  onChange,
}) => {
  const t = useTranslations("Components")
  const screenNames = useAppSelector(
    (state: RootState) =>
      state.screen?.screens.map(({ screenName }) => screenName) ?? []
  )
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

  useEffect(() => {
    if (!nextScreen) {
      onChange("nextScreen", nextScreenName)
    }
  }, [onChange])
  console.log("button action", buttonAction, nextScreen)
  return (
    <Select
      value={buttonAction === "next-screen" ? "next-screen" : nextScreen}
      onValueChange={(e) => {
        if (e === "next-screen") {
          onChange("next-screen", nextScreenName)
        } else if (e === "none") {
          onChange("custom-action", e)
        } else {
          onChange("custom-action", e)
        }
      }}
    >
      <SelectTrigger
        className={`h-8.5 bg-[#FAFAFA] text-xs [&>span]:line-clamp-1 [&>span]:flex-1 [&>span]:text-ellipsis [&>span]:break-all${
          buttonAction === null ? " text-muted-foreground" : ""
        }`}
      >
        <SelectValue placeholder={t("Navigate to screen")} />
      </SelectTrigger>
      <SelectContent className="text-left">
        <SelectItem value={"none"} className="text-xs">
          {t("Do Nothing")}
        </SelectItem>
        <SelectItem value="next-screen" className="text-xs">
          {t("Next Screen")}
        </SelectItem>
        {screenNames?.map((screenName, index) => (
          <SelectItem className="text-xs" value={screenName}>
            {index + 1} : {screenName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const PictureChoiceItemTrackingSettings = ({
  choice: originalChoice,
  index,
  onChange,
}) => {
  const t = useTranslations("Components")

  const [choice, setChoice] = useState(originalChoice)

  useEffect(() => {
    setChoice(originalChoice)
  }, [originalChoice])

  const handleTrackingEventChange = (updatedTrackingEvent) => {
    setChoice({ ...choice, trackingEvent: updatedTrackingEvent })
    onChange(updatedTrackingEvent)
  }

  return (
    <div className="flex items-center space-x-2">
      <Label className="w-14 shrink-0" htmlFor="label-event">{`${t("Option")} ${
        index + 1
      }`}</Label>
      <Input
        value={choice.trackingEvent ?? ""}
        defaultValue={choice.trackingEvent ?? ""}
        placeholder={choice.value.replaceAll(" ", "_")}
        onChange={(e) => handleTrackingEventChange(e.target.value)}
        type={"text"}
      />
    </div>
  )
}
