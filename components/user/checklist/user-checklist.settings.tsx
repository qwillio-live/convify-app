import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  MoveHorizontal,
  GripVertical,
  Trash2,
  Plus,
  Search,
  X as IconX,
  StretchHorizontal,
  StretchVertical,
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
import {
  Reorder,
  useDragControls,
  useInView,
  useMotionValue,
} from "framer-motion"
import hexoid from "hexoid"
import icons from "@/constant/streamline.json"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ChecklistGen,
  ChecklistLayouts,
  ChecklistPresets,
} from "./user-checklist.component"
import useChecklistThemePresets from "./useChecklistThemePresets"
import { Card } from "@/components/ui/card"
import { ColorInput } from "@/components/color-input"
import { Icons } from "@/components/icons"

export const ChecklistSettings = () => {
  const t = useTranslations("Components")
  const screenNames = useScreenNames()
  const screensLength = useScreensLength()
  const selectedScreen = useAppSelector(
    (state: RootState) => state.screen?.selectedScreen ?? 0
  )

  const {
    actions: { setProp },
    props: {
      props,
      checklistItems,
      icon,
      size,
      containerBackground,
      iconColor,
      layout,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      width,
      height,
      settingTabs,
      preset,
      textColor,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const { normalPreset, boldPreset } = useChecklistThemePresets()

  const changePresetStyles = (preset) => {
    const updatedStyles = ["fontWeight", "fontSize", "preset"]
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
              values={checklistItems}
              className="flex w-full flex-col gap-2"
              onReorder={(e) => handlePropChange("checklistItems", e)}
            >
              {checklistItems.map((item, index) => (
                <ChecklistItemSettings
                  key={`checklist-item-${item.id}`}
                  item={item}
                  index={index}
                  handlePropChangeDebounced={handlePropChangeDebounced}
                />
              ))}
            </Reorder.Group>
            <Button
              className="h-9.5 w-full bg-[#23262C] text-white"
              size="sm"
              onClick={() =>
                handlePropChange("checklistItems", [
                  ...checklistItems,
                  {
                    id: `checklist-item-${hexoid(4)()}`,
                    value: `${t("Item")} ${checklistItems.length + 1}`,
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
            <div className="flex items-center justify-between">
              <Label htmlFor="icon">{t("Icon")}</Label>
              <ChecklistSettingsIconPicker
                icon={icon}
                onChange={(icon) => {
                  debouncedSetProp("icon", icon)
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="iconcolor">{t("Icon Color")}</Label>
              <ColorInput
                value={iconColor}
                handleChange={(e) => {
                  debouncedSetProp("iconColor", e.target.value)
                }}
                id="iconcolor"
              />
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
            <div className="flex items-center justify-between">
              <Label htmlFor="textColor">{t("Text Color")}</Label>
              <ColorInput
                id="textColor"
                value={textColor === "#ffffff" ? null : textColor}
                handleChange={(e) => {
                  handlePropChange("textColor", e.target.value)
                }}
                handleRemove={() => handlePropChange("textColor", "#ffffff")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="layout">{t("Layout")}</Label>
              <Tabs
                value={layout}
                defaultValue={ChecklistLayouts.column}
                onValueChange={(value) => debouncedSetProp("layout", value)}
              >
                <TabsList className="grid w-full grid-cols-2 bg-[#EEEEEE]">
                  <TabsTrigger
                    className="rounded"
                    value={ChecklistLayouts.column}
                  >
                    <StretchHorizontal size={16} />
                  </TabsTrigger>
                  <TabsTrigger className="rounded" value={ChecklistLayouts.row}>
                    <StretchVertical size={16} />
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

        <AccordionItem value="styles">
          <AccordionTrigger>{t("Styles")}</AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-4">
              <Card
                onClick={() => {
                  changePresetStyles(normalPreset)
                }}
                className="px-4 py-0 transition-all duration-300 hover:cursor-pointer"
                style={{
                  ...(preset === ChecklistPresets.normal
                    ? {
                        border: `1px solid #2B3398`,
                      }
                    : {}),
                }}
              >
                <ChecklistGen textColor={"#ffffff"} {...normalPreset} />
              </Card>
              <Card
                onClick={() => {
                  changePresetStyles(boldPreset)
                }}
                className="px-4 py-0 transition-all duration-300 hover:cursor-pointer"
                style={{
                  ...(preset === ChecklistPresets.bold
                    ? {
                        border: `1px solid #2B3398`,
                      }
                    : {}),
                }}
              >
                <ChecklistGen textColor={"#ffffff"} {...boldPreset} />
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export const ChecklistItemSettings = ({
  item: originalItem,
  index,
  handlePropChangeDebounced,
}) => {
  const t = useTranslations("Components")
  const y = useMotionValue(0)
  const controls = useDragControls()

  const {
    actions: { setProp },
    props: { checklistItems },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const [item, setItem] = useState(originalItem)

  useEffect(() => {
    setItem(originalItem)
  }, [originalItem])

  const handleItemDelete = () => {
    setProp(
      (props) =>
        (props.checklistItems = checklistItems.filter((_, i) => i !== index)),
      200
    )
  }

  const handleItemValueEdit = (updatedValue) => {
    setItem({ ...item, value: updatedValue })
    handlePropChangeDebounced("checklistItems", [
      ...checklistItems.slice(0, index),
      { ...item, value: updatedValue },
      ...checklistItems.slice(index + 1),
    ])
  }

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={originalItem}
      transition={{ duration: 0 }}
      id={`checklist-item-${originalItem.id}`}
      style={{ y }}
      className="flex w-full select-none items-center space-x-2"
    >
      <Input
        className="h-8.5 flex-1 text-xs"
        value={item.value}
        placeholder={`${t("Item")} ${index + 1}`}
        onChange={(e) => handleItemValueEdit(e.target.value)}
        // onBlur={() =>
        //   setProp((props) => (props.checklistItems[index] = item), 200)
        // }
      />
      <Icons.Delete
        className="hover:cursor-pointer"
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

export const ChecklistIconRenderer = ({
  iconName,
  className = "",
  style = {},
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-0.5 -0.5 15 15"
      dangerouslySetInnerHTML={{ __html: icons[iconName]?.body || "" }}
      className={className}
      style={style}
    />
  )
}

const ChecklistIconPickerItem = ({ iconName, onClick }) => {
  const ref = useRef(null)
  const isInView = useInView(ref)
  return (
    <div className="max-h-[160px]">
      <div
        ref={ref}
        className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex aspect-square h-auto max-h-full w-auto max-w-full items-center justify-center rounded-md bg-transparent p-4 text-center"
        onClick={() => onClick(iconName)}
      >
        {isInView && (
          <ChecklistIconRenderer
            iconName={iconName}
            className="size-20 cursor-pointer"
          />
        )}
      </div>
    </div>
  )
}

const ChecklistSettingsIconPicker = ({ className = "", icon, onChange }) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const t = useTranslations("CreateFlow")

  const filteredIcons = Object.keys(icons).filter((iconName) =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleChange = (iconName) => {
    onChange(iconName)
    setOpen(false)
  }

  return (
    <div className={`text-center ${className}`}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-8 w-full">
            <ChecklistIconRenderer iconName={icon} className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[70%] overflow-y-auto p-0 sm:max-h-[70%] sm:max-w-[80%]">
          <DialogHeader className="sticky top-0 z-10 bg-white px-8 pb-4 pt-10">
            <div className="flex items-center justify-start gap-4">
              <div>
                <DialogTitle>{t("PictureChoice.icon")}</DialogTitle>
                <DialogDescription>
                  {t("PictureChoice.iconDesc")}
                </DialogDescription>
              </div>
              <div className="relative ml-auto flex flex-1 items-center md:grow-0">
                <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
                <Input
                  type="search"
                  placeholder={t("PictureChoice.iconSearch")}
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
          <div className="m-6 mt-0 grid grid-cols-6 gap-4">
            {filteredIcons.length > 0 ? (
              filteredIcons.map((iconName) => (
                <ChecklistIconPickerItem
                  key={iconName}
                  iconName={iconName}
                  onClick={handleChange}
                />
              ))
            ) : (
              <div className="col-span-6 mt-4 text-center">
                {t("PictureChoice.iconNotFound")}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
