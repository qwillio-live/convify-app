import React, { useCallback, useEffect, useRef, useState } from "react"
import { MoveHorizontal, GripVertical, Trash2, Plus, Image } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/custom-checkbox"
import { PicturePicker, PictureTypes } from "@/components/PicturePicker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/custom-select"

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
    outlinedPreset,
    defaultIcon,
    defaultChoices,
    defaultSelections,
  } = usePictureChoiceThemePresets()

  const changePresetStyles = (preset) => {
    const updatedStyles = [
      "preset",
      "checkboxVisible",
      "contentReversed",
      "defaultStyles",
      "hoverStyles",
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
        className="font-poppins flex w-full flex-col gap-4 bg-[#f6f6f6] p-5"
      >
        <AccordionItem value="content" className="flex flex-col gap-6">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-0  hover:no-underline">
            <span className="font-medium">{t("Content")}</span>
          </AccordionTrigger>
          <AccordionContent className="w-full space-y-2 p-2">
            <div className="flex items-center justify-between gap-2">
              <span>{t("Single")}</span>
              <Switch
                checked={multiSelect}
                onCheckedChange={(checked) =>
                  handlePropChange("multiSelect", checked)
                }
              />
              <span>{t("Multiple")}</span>
            </div>
            <div className="text-muted-foreground">
              {t("Drag to re-arrange click to edit")}
            </div>

            <Reorder.Group
              axis="y"
              values={choices}
              className="flex w-full flex-col gap-2"
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
              className="w-full"
              variant="secondary"
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
              <Plus className="mr-2 size-4" /> {t("Add new")}
            </Button>
          </AccordionContent>
        </AccordionItem>
        <hr className="w-full" />

        <AccordionItem value="general" className="flex flex-col gap-6">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-0  hover:no-underline">
            <span className="font-medium">{t("General")}</span>
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

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-1">
              <label
                htmlFor="placeholder-text"
                className="text-sm font-medium leading-none no-underline decoration-dotted peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Field Name")}
              </label>
              <Input
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
        <hr className="w-full" />

        <AccordionItem value="design" className="flex flex-col gap-6">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-0  hover:no-underline">
            <span className="font-medium">{t("Design")} </span>
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
                defaultValue={containerBackground}
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
        <hr className="w-full" />

        <AccordionItem value="spacing" className="flex flex-col gap-6">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-0  hover:no-underline">
            <span className="font-medium">{t("Spacing")} </span>
          </AccordionTrigger>
          <AccordionContent className="">
            <div className="style-control col-span-2 mb-6 flex w-full grow-0 basis-full flex-col gap-2">
              <p className="text-xs">{t("Width")}</p>
              <Tabs
                value={size}
                defaultValue={size}
                onValueChange={(value) => {
                  setProp((props) => (props.size = value), 1000)
                }}
                className="flex-1"
              >
                <TabsList className="grid w-full grid-cols-4 bg-[#EEEEEE] p-0 px-1 text-[#7B7D80]">
                  <TabsTrigger value="small">{t("S")}</TabsTrigger>
                  <TabsTrigger value="medium">{t("M")}</TabsTrigger>
                  <TabsTrigger value="large">{t("L")}</TabsTrigger>
                  <TabsTrigger value="full">
                    <MoveHorizontal size={16} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-col gap-4">
              <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
                <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                  <Label className="text-xs font-normal" htmlFor="marginTop">
                    {t("Top")}
                  </Label>
                  <span className="hover:border-border w-12 rounded-md border border-transparent text-right text-xs text-[#7b7d80]">
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

              <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
                <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                  <Label className="text-xs font-normal" htmlFor="marginTop">
                    {t("Bottom")}
                  </Label>
                  <span className="hover:border-border w-12 rounded-md border border-transparent text-right text-xs text-[#7b7d80]">
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
                  <Label className="text-xs font-normal" htmlFor="marginTop">
                    {t("Right")}
                  </Label>
                  <span className="hover:border-border w-12 rounded-md border border-transparent text-right text-xs text-[#7b7d80]">
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
                  <Label className="text-xs font-normal" htmlFor="marginTop">
                    {t("Left")}
                  </Label>
                  <span className="hover:border-border w-12 rounded-md border border-transparent text-right text-xs text-[#7b7d80]">
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
        <hr className="w-full" />

        <AccordionItem value="styles" className="flex flex-col gap-6">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-0  hover:no-underline">
            <span className="font-medium">{t("Styles")}</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-4">
              <Card
                onClick={() => {
                  changePresetStyles(outlinedPreset)
                }}
                className="p-0 transition-all duration-300 hover:cursor-pointer"
                style={{
                  ...(preset === PictureChoicePresets.outlined
                    ? {
                        border: `1px solid ${primaryColor}`,
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
                        border: `1px solid ${primaryColor}`,
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
                        border: `1px solid ${primaryColor}`,
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
                    selections: defaultSelections,
                    choices: defaultChoices.slice(0, 2),
                  }}
                />
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
        <hr className="w-full" />

        <AccordionItem value="tracking" className="flex flex-col gap-6">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-0  hover:no-underline">
            <span className="font-medium">{t("Tracking")}</span>
          </AccordionTrigger>
          <AccordionContent className="w-full space-y-2 p-2">
            <div className="col-span-2 flex flex-row items-center space-x-2">
              <Checkbox
                id="tracking"
                className="border-input ring-offset-background focus-visible:ring-ring data-[state=checked]:border-primary peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                checked={tracking}
                onCheckedChange={(e) => {
                  handlePropChange("tracking", e)
                }}
              />
              <label
                htmlFor="tracking"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Tracking activated")}
              </label>
            </div>

            {tracking && (
              <div>
                <div className="text-muted-foreground pt-2">
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
  console.log("choicessssssss:", choices)
  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={originalChoice}
      transition={{ duration: 0 }}
      id={`picture-choice-${originalChoice.id}`}
      style={{ y }}
      className="flex w-full select-none flex-col gap-2 [&>div>div>button>div>button>svg]:hover:visible [&>div>div]:hover:visible [&>div>svg]:hover:visible"
    >
      <div className="flex w-full items-center gap-2">
        <PicturePicker
          className="transition-all duration-100 ease-in-out"
          picture={
            choice.pictureType === PictureTypes.NULL ? (
              <Image className="text-muted-foreground invisible size-4" />
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
          className="h-8 flex-1"
          value={choice.value}
          placeholder={`${t("Option")} ${index + 1}`}
          onChange={(e) => handleChoiceTextEdit(e.target.value)}
        />

        <Trash2
          className="text-muted-foreground invisible size-3 hover:cursor-pointer"
          onClick={handleChoiceDelete}
        />
        <div
          onPointerDown={(e) => controls.start(e)}
          className="reorder-handle invisible hover:cursor-move"
        >
          <GripVertical className="text-muted-foreground size-4" />
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
          selectedScreen + 1 < (screensLength || 0) ? selectedScreen + 1 : 0
        ]?.screenName
    ) || ""

  useEffect(() => {
    if (!nextScreen) {
      onChange("next-screen", nextScreenName)
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
        className={`h-8 [&>span]:line-clamp-1 [&>span]:flex-1 [&>span]:text-ellipsis [&>span]:break-all${
          buttonAction === null ? " text-muted-foreground" : ""
        }`}
      >
        <SelectValue placeholder={t("Navigate to screen")} />
      </SelectTrigger>
      <SelectContent className="text-left">
        <SelectItem value={"none"}>{t("Do Nothing")}</SelectItem>
        <SelectItem value="next-screen">{t("Next Screen")}</SelectItem>
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
    <div className="style-control col-span-2 mt-2 flex w-full grow-0 basis-full flex-row items-center gap-2">
      <label
        htmlFor="label-event"
        className="shrink-0 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {`${t("Option")} ${index + 1}`}
      </label>
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
