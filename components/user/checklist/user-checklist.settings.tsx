import React, { useCallback, useRef, useState } from "react"
import {
  MoveHorizontal,
  GripVertical,
  Trash2,
  Plus,
  Search,
  X as IconX,
  StretchHorizontal,
  StretchVertical,
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
              values={checklistItems}
              className="flex w-full flex-col gap-2"
              onReorder={(e) => handlePropChange("checklistItems", e)}
            >
              {checklistItems.map((item, index) => (
                <ChecklistItemSettings
                  key={`checklist-item-${item.id}`}
                  item={item}
                  index={index}
                />
              ))}
            </Reorder.Group>
            <Button
              className="w-full"
              variant="secondary"
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
              <Plus className="mr-2 size-4" /> {t("Add new item")}
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="design">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Design")} </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-4 p-2">
            <div className="col-span-2 flex flex-row items-center space-x-2">
              <label
                htmlFor="icon"
                className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Icon")}
              </label>
              <ChecklistSettingsIconPicker
                className="basis-1/3"
                icon={icon}
                onChange={(icon) => {
                  debouncedSetProp("icon", icon)
                }}
              />
            </div>

            <div className="col-span-2 flex flex-row items-center space-x-2">
              <label
                htmlFor="iconcolor"
                className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Icon Color")}
              </label>
              <Input
                value={iconColor}
                onChange={(e) => {
                  debouncedSetProp("iconColor", e.target.value)
                }}
                className="basis-1/3"
                type={"color"}
                id="iconcolor"
              />
            </div>

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

            <div className="col-span-2 flex flex-row items-center space-x-2">
              <label
                htmlFor="layout"
                className="basis-1/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Layout")}
              </label>
              <Tabs
                value={layout}
                defaultValue={ChecklistLayouts.column}
                onValueChange={(value) => debouncedSetProp("layout", value)}
                className="basis-2/3"
              >
                <TabsList className="grid w-full grid-cols-2 [&>button]:h-full">
                  <TabsTrigger value={ChecklistLayouts.column}>
                    <StretchHorizontal size={20} />
                  </TabsTrigger>
                  <TabsTrigger value={ChecklistLayouts.row}>
                    <StretchVertical size={20} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
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

        <AccordionItem value="styles">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Styles")}</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-4">
              <Card
                onClick={() => {
                  changePresetStyles(normalPreset)
                }}
                className="px-4 py-0 transition-all duration-300 hover:cursor-pointer"
                style={{
                  ...(preset === ChecklistPresets.normal
                    ? {
                        border: `1px solid ${primaryColor}`,
                      }
                    : {}),
                }}
              >
                <ChecklistGen {...normalPreset} />
              </Card>
              <Card
                onClick={() => {
                  changePresetStyles(boldPreset)
                }}
                className="px-4 py-0 transition-all duration-300 hover:cursor-pointer"
                style={{
                  ...(preset === ChecklistPresets.bold
                    ? {
                        border: `1px solid ${primaryColor}`,
                      }
                    : {}),
                }}
              >
                <ChecklistGen {...boldPreset} />
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export const ChecklistItemSettings = ({ item, index }) => {
  const t = useTranslations("Components")
  const y = useMotionValue(0)
  const controls = useDragControls()

  const {
    actions: { setProp },
    props: { checklistItems },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const handleItemDelete = () => {
    setProp(
      (props) =>
        (props.checklistItems = checklistItems.filter((_, i) => i !== index)),
      200
    )
  }

  const handleItemValueEdit = (updatedValue) => {
    setProp((props) => (props.checklistItems[index].value = updatedValue), 200)
  }

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={item}
      transition={{ duration: 0 }}
      id={`checklist-item-${item.id}`}
      style={{ y }}
      className="flex w-full select-none items-center gap-2 [&>div]:hover:visible [&>svg]:hover:visible"
    >
      <Input
        className="h-8 flex-1"
        value={item.value}
        placeholder={`${t("Item")} ${index + 1}`}
        onChange={(e) => handleItemValueEdit(e.target.value)}
      />
      <Trash2
        className="text-muted-foreground invisible size-3 hover:cursor-pointer"
        onClick={handleItemDelete}
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
    <div className={`w-full text-center ${className}`}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <ChecklistIconRenderer iconName={icon} className="size-6" />
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
