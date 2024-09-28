import React, { useCallback, useEffect, useState } from "react"
import {
  MoveHorizontal,
  GripVertical,
  Trash2,
  Plus,
  Image,
  CircleCheck,
  ArrowDown01,
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
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import hexoid from "hexoid"
import {
  PicturePicker,
  PictureTypes,
  SvgRenderer,
} from "@/components/PicturePicker"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import icons from "@/constant/streamline.json"
import { StepsStyles } from "./user-steps.component"
import { ColorInput } from "@/components/color-input"
import { Icons } from "@/components/icons"

export const StepsSettings = () => {
  const t = useTranslations("Components")

  const {
    actions: { setProp },
    props: {
      fontFamily,
      size,
      selectedColor,
      disabledColor,
      containerBackground,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      fullWidth,
      settingTabs,
      style,
      currentStep,
      steps,
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
            <div className="text-muted-foreground text-xs">
              {t("Drag to re-arrange click to edit")}
            </div>

            <Reorder.Group
              axis="y"
              values={steps}
              className="flex w-full flex-col gap-2"
              onReorder={(e) => {
                setProp((props) => {
                  props.currentStep =
                    currentStep < 0 || currentStep === steps.length
                      ? currentStep
                      : e.findIndex(
                          (step: { id: string }) =>
                            step.id === steps[currentStep]?.id
                        )
                  props.steps = e
                  return props
                })
              }}
            >
              {steps.map((step, index) => (
                <StepsItemSettings
                  key={`step-${step.id}`}
                  step={step}
                  index={index}
                  handlePropChangeDebounced={handlePropChangeDebounced}
                />
              ))}
            </Reorder.Group>
            <Button
              className="h-9.5 w-full bg-[#23262C] text-white"
              size="sm"
              onClick={() =>
                handlePropChange("steps", [
                  ...steps,
                  {
                    id: `steps-${hexoid(6)()}`,
                    picture: null,
                    pictureType: PictureTypes.NULL,
                    text: `${t("Step")} ${steps.length + 1}`,
                  },
                ])
              }
            >
              <Plus className="mr-2 size-4" /> {t("Add new")}
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="design">
          <AccordionTrigger>{t("Design")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="style">{t("Style")}</Label>
              <Tabs
                value={style}
                defaultValue={StepsStyles.icon}
                onValueChange={(value) => debouncedSetProp("style", value)}
              >
                <TabsList className="grid w-full grid-cols-2 bg-[#EEEEEE]">
                  <TabsTrigger className="rounded" value={StepsStyles.icon}>
                    <CircleCheck size={16} />
                  </TabsTrigger>
                  <TabsTrigger className="rounded" value={StepsStyles.number}>
                    <ArrowDown01 size={16} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="backgroundcolor">{t("Background Color")}</Label>
              <ColorInput
                value={containerBackground}
                handleChange={(e) => {
                  debouncedSetProp("containerBackground", e.target.value)
                }}
                handleRemove={() => {
                  debouncedSetProp("containerBackground", "transparent")
                }}
                id="backgroundcolor"
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
                    <MoveHorizontal size={16} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>{t("Top")}</Label>
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
                  <Label>{t("Bottom")}</Label>
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
                  <Label>{t("Right")}</Label>
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
                  <Label>{t("Left")}</Label>
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

export const StepsItemSettings = ({
  step: originalStep,
  index,
  handlePropChangeDebounced,
}) => {
  const t = useTranslations("Components")
  const y = useMotionValue(0)
  const controls = useDragControls()

  const {
    actions: { setProp },
    props: { steps, currentStep },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const isPastStep = index < currentStep
  const isPresentStep = index === currentStep
  const isFutureStep = index > currentStep

  const [step, setItem] = useState(originalStep)

  useEffect(() => {
    setItem(originalStep)
  }, [originalStep])

  const handleItemDelete = () => {
    if (index <= currentStep) setProp((props) => (props.currentStep -= 1), 200)
    setProp((props) => (props.steps = steps.filter((_, i) => i !== index)), 200)
  }

  const handlePictureChange = (picture, pictureType) => {
    setItem({ ...step, picture, pictureType })
    handlePropChangeDebounced("steps", [
      ...steps.slice(0, index),
      { ...step, picture, pictureType },
      ...steps.slice(index + 1),
    ])
  }

  const handleCurrentStepChange = () => {
    if (isPastStep) setProp((props) => (props.currentStep = index - 1), 200)

    if (isPresentStep) setProp((props) => (props.currentStep = index + 1), 200)

    if (isFutureStep) setProp((props) => (props.currentStep = index), 200)
  }

  const handleItemTextEdit = (newTitle) => {
    setItem({ ...step, text: newTitle })
    handlePropChangeDebounced("steps", [
      ...steps.slice(0, index),
      { ...step, text: newTitle },
      ...steps.slice(index + 1),
    ])
  }

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={originalStep}
      transition={{ duration: 0 }}
      id={`step-${originalStep.id}`}
      style={{ y }}
      className="flex w-full select-none items-center space-x-2"
    >
      <PicturePicker
        className="transition-all duration-100 ease-in-out"
        picture={
          step.pictureType === PictureTypes.NULL ? (
            <Image className="text-muted-foreground size-4" />
          ) : (
            step.picture
          )
        }
        pictureType={step.pictureType}
        maxWidthMobile={400}
        maxWidthDesktop={400}
        onChange={handlePictureChange}
      />

      <Button
        variant="ghost"
        className="h-fit rounded-full p-0 hover:bg-transparent"
        onClick={handleCurrentStepChange}
      >
        {isPastStep && (
          <div className="step-past-icon flex size-6 items-center justify-center rounded-full bg-green-500 text-white">
            <SvgRenderer iconName="check-solid" width="16" height="16" />
          </div>
        )}
        {isPresentStep && (
          <RadioGroup
            className="step-present-icon [&>button>span>svg]:size-4 [&>button]:size-6"
            value="check"
          >
            <RadioGroupItem value="check" />
          </RadioGroup>
        )}
        {isFutureStep && (
          <RadioGroup
            className="step-future-icon [&>button>span>svg]:size-4 [&>button>span]:hidden [&>button]:size-6 [&>button]:border-[#eaeaeb]"
            value="check"
          >
            <RadioGroupItem value="check" />
          </RadioGroup>
        )}
      </Button>

      <Input
        className="h-8.5 flex-1 text-xs"
        value={step.text}
        placeholder={`${t("Step")} ${index + 1}`}
        onChange={(e) => handleItemTextEdit(e.target.value)}
      />

      <Icons.Delete
        className="text-muted-foreground size-4 hover:cursor-pointer"
        onClick={handleItemDelete}
      />
      <div
        onPointerDown={(e) => controls.start(e)}
        className="reorder-handle !ml-1 hover:cursor-move"
      >
        <Icons.GripVertical />
      </div>
    </Reorder.Item>
  )
}
