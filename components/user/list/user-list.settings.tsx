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
import { ListGen, ListPresets } from "./user-list.component"
import { Card } from "@/components/ui/card"
import useListThemePresets from "./useListThemePresets"
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
import { ColorInput } from "@/components/color-input"
import { Icons } from "@/components/icons"

export const ListSettings = () => {
  const t = useTranslations("Components")

  const {
    actions: { setProp },
    props: {
      textColor,
      secTextColor,
      titleFontFamily,
      descriptionFontFamily,
      size,
      verticalGap,
      iconColor,
      titleColor,
      descriptionColor,
      containerBackground,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      columnsDesktop,
      columnsMobile,
      flexDirection,
      fullWidth,
      settingTabs,
      preset,
      items,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const { horizontalPreset, verticalPreset, defaultIcon, defaultItems } =
    useListThemePresets()

  const changePresetStyles = (preset) => {
    const updatedStyles = ["preset", "textAlign", "flexDirection"]

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
              values={items}
              className="flex w-full flex-col gap-2"
              onReorder={(e) => handlePropChange("items", e)}
            >
              {items.map((item, index) => (
                <ListItemSettings
                  key={`input-${item.id}`}
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
                handlePropChange("items", [
                  ...items,
                  {
                    id: `list-item-${hexoid(6)()}`,
                    picture: defaultIcon,
                    pictureType: PictureTypes.ICON,
                    title: `${t("Title")} ${items.length + 1}`,
                    description: `${t("Description")}`,
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
              <Label htmlFor="textColor">{t("Title Color")}</Label>
              <ColorInput
                id="textColor"
                value={textColor === "#ffffff" ? null : textColor}
                handleChange={(e) => {
                  handlePropChange("textColor", e.target.value)
                }}
                handleRemove={() => handlePropChange("textColor", "#ffffff")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="secTextColor">{t("Subtitle Color")}</Label>
              <ColorInput
                id="secTextColor"
                value={secTextColor === "#ffffff" ? null : secTextColor}
                handleChange={(e) => {
                  handlePropChange("secTextColor", e.target.value)
                }}
                handleRemove={() => handlePropChange("secTextColor", "#ffffff")}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>{t("Vertical Gap")}</Label>
                <span className="text-muted-foreground text-xs">
                  {verticalGap}
                </span>
              </div>
              <Slider
                defaultValue={[verticalGap]}
                value={[verticalGap]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) =>
                  handlePropChangeDebounced("verticalGap", e)
                }
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>{t("Columns Desktop")}</Label>
                <span className="text-muted-foreground text-xs">
                  {columnsDesktop}
                </span>
              </div>
              <Slider
                defaultValue={[columnsDesktop]}
                value={[columnsDesktop]}
                max={5}
                min={1}
                step={1}
                onValueChange={(e) =>
                  handlePropChangeDebounced("columnsDesktop", e)
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
          <AccordionContent className=" pt-2">
            <div className="space-y-4">
              <Card
                onClick={() => {
                  changePresetStyles(horizontalPreset)
                }}
                className="px-4 transition-all duration-300 hover:cursor-pointer"
                style={{
                  ...(preset === ListPresets.horizontal
                    ? {
                        border: `1px solid #2B3398`,
                      }
                    : {}),
                }}
              >
                <ListGen
                  textColor={"#ffffff"}
                  secTextColor={"#ffffff"}
                  {...{
                    ...horizontalPreset,
                    columnsDesktop: 1,
                    columnsMobile: 1,
                    items: [
                      {
                        ...horizontalPreset.items[0],
                        picture: defaultIcon,
                        pictureType: PictureTypes.ICON,
                      },
                    ],
                  }}
                />
              </Card>
              <Card
                onClick={() => {
                  changePresetStyles(verticalPreset)
                }}
                className="p-0 transition-all duration-300 hover:cursor-pointer"
                style={{
                  ...(preset === ListPresets.vertical
                    ? {
                        border: `1px solid #2B3398`,
                      }
                    : {}),
                }}
              >
                <ListGen
                  textColor={"#ffffff"}
                  secTextColor={"#ffffff"}
                  {...{
                    ...verticalPreset,
                    columnsDesktop: 1,
                    columnsMobile: 1,
                    items: [
                      {
                        ...verticalPreset.items[0],
                        picture: defaultIcon,
                        pictureType: PictureTypes.ICON,
                      },
                    ],
                  }}
                />
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export const ListItemSettings = ({
  item: originalItem,
  index,
  handlePropChangeDebounced,
}) => {
  const t = useTranslations("Components")
  const y = useMotionValue(0)
  const controls = useDragControls()

  const {
    actions: { setProp },
    props: { items },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const [item, setItem] = useState(originalItem)

  useEffect(() => {
    setItem(originalItem)
  }, [originalItem])

  const handleItemDelete = () => {
    setProp((props) => (props.items = items.filter((_, i) => i !== index)), 200)
  }

  const handlePictureChange = (picture, pictureType) => {
    setItem({ ...item, picture, pictureType })
    handlePropChangeDebounced("items", [
      ...items.slice(0, index),
      { ...item, picture, pictureType },
      ...items.slice(index + 1),
    ])
  }

  const handleItemTitleEdit = (newTitle) => {
    setItem({ ...item, title: newTitle })
    handlePropChangeDebounced("items", [
      ...items.slice(0, index),
      { ...item, title: newTitle },
      ...items.slice(index + 1),
    ])
  }

  const handleItemDescriptionEdit = (newDescription) => {
    setItem({ ...item, description: newDescription })
    handlePropChangeDebounced("items", [
      ...items.slice(0, index),
      { ...item, description: newDescription },
      ...items.slice(index + 1),
    ])
  }

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={originalItem}
      transition={{ duration: 0 }}
      id={`list-item-${originalItem.id}`}
      style={{ y }}
      className="flex w-full select-none flex-col gap-2"
    >
      <div className="flex w-full items-center space-x-2">
        <PicturePicker
          className="transition-all duration-100 ease-in-out"
          picture={
            item.pictureType === PictureTypes.NULL ? (
              <Image className="text-muted-foreground size-4" />
            ) : (
              item.picture
            )
          }
          pictureType={item.pictureType}
          maxWidthMobile={100}
          maxWidthDesktop={100}
          onChange={handlePictureChange}
        />

        <Input
          className="h-8.5 flex-1 text-xs"
          value={item.title}
          placeholder={`${t("Title")} ${index + 1}`}
          onChange={(e) => handleItemTitleEdit(e.target.value)}
        />

        <Icons.Delete
          className="hover:cursor-pointer"
          onClick={handleItemDelete}
        />
        <div
          onPointerDown={(e) => controls.start(e)}
          className="reorder-handle !ml-1  hover:cursor-move"
        >
          <Icons.GripVertical />
        </div>
      </div>
      <div className="pl-10 pr-11">
        <Input
          className="h-8.5 flex-1 text-xs text-[#5a5a5a]"
          value={item.description}
          placeholder={`${t("Enter Description")}`}
          onChange={(e) => handleItemDescriptionEdit(e.target.value)}
        />
      </div>
    </Reorder.Item>
  )
}
