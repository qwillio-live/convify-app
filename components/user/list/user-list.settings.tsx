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
import ColorButton from "../color-button"

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
              className="w-full"
              variant="secondary"
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
            <ColorButton
              label={"Title Color"}
              styleKey="textColor"
              currentValue={textColor || ""}
              setProp={handlePropChangeDebounced}
            />
            <ColorButton
              label={"Subtitle Color"}
              styleKey="secTextColor"
              currentValue={secTextColor || ""}
              setProp={handlePropChangeDebounced}
            />

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label>{t("Vertical Gap")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
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

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label>{t("Columns Desktop")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
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

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label>{t("Columns Mobile")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {columnsMobile}
                </span>
              </div>
              <Slider
                defaultValue={[columnsMobile]}
                value={[columnsMobile]}
                max={5}
                min={1}
                step={1}
                onValueChange={(e) =>
                  handlePropChangeDebounced("columnsMobile", e)
                }
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
                <Label>{t("Top")}</Label>
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
                <Label>{t("Bottom")}</Label>
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
                <Label>{t("Right")}</Label>
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
                <Label>{t("Left")}</Label>
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
                  changePresetStyles(horizontalPreset)
                }}
                className="px-4 transition-all duration-300 hover:cursor-pointer"
                style={{
                  ...(preset === ListPresets.horizontal
                    ? {
                        border: `1px solid ${primaryColor}`,
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
                        border: `1px solid ${primaryColor}`,
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
      className="flex w-full select-none flex-col gap-2 [&>div>div>button>div>button>svg]:hover:visible [&>div>div]:hover:visible [&>div>svg]:hover:visible"
    >
      <div className="flex w-full items-center gap-2">
        <PicturePicker
          className="transition-all duration-100 ease-in-out"
          picture={
            item.pictureType === PictureTypes.NULL ? (
              <Image className="text-muted-foreground invisible size-4" />
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
          className="h-8 flex-1"
          value={item.title}
          placeholder={`${t("Title")} ${index + 1}`}
          onChange={(e) => handleItemTitleEdit(e.target.value)}
        />

        <Trash2
          className="text-muted-foreground invisible size-3 hover:cursor-pointer"
          onClick={handleItemDelete}
        />
        <div
          onPointerDown={(e) => controls.start(e)}
          className="reorder-handle invisible  hover:cursor-move"
        >
          <GripVertical className="text-muted-foreground size-4" />
        </div>
      </div>
      <div className="pl-10 pr-11">
        <Input
          className="h-8 flex-1 text-[#5a5a5a]"
          value={item.description}
          placeholder={`${t("Enter Description")}`}
          onChange={(e) => handleItemDescriptionEdit(e.target.value)}
        />
      </div>
    </Reorder.Item>
  )
}
