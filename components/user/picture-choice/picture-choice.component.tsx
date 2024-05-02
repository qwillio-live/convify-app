import React from "react"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import { GripVertical, Image, ListOrdered, UploadCloud } from "lucide-react"

import { Element, useNode } from "@/lib/craftjs"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  CardTop,
  Card as UserCard,
} from "@/components/user/card/user-card.component"

import {
  Container,
  ContainerDefaultProps,
  UserContainer,
  UserContainerSettings,
} from "../container/user-container.component"
import { Controller } from "../settings/controller.component"

export const PictureContainer = ({ children, ...props }) => {
  const {
    connectors: { connect, drag },
  } = useNode()
  return (
    <div
      className="relative w-full h-full flex flex-row items-center justify-center"
      ref={(ref: any) => connect(drag(ref))}
      {...ContainerDefaultProps}
    >
      {children}
    </div>
  )
}

export const PictureContainerSettings = () => {
  return (
    <Card className="p-2">
      <CardHeader className="p-2">
        <CardTitle>Container</CardTitle>
        <CardDescription>Container settings</CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <Checkbox />
      </CardContent>
    </Card>
  )
}

PictureContainer.craft = {
  related: {
    settings: PictureContainerSettings,
  },
}

export const PictureChoice = ({
  alt,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  background,
  radius,
  align,
  width,
  height,
  src,
  pictureItems,
  ...props
}) => {
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))

  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      className={cn(
        `relative flex flex-row justify-${align} w-full border border-transparent`,
        isHovered && "border-blue-400 border-dotted"
      )}
    >
      {isHovered && <Controller nameOfComponent={"Picture Choice"} />}
      {pictureItems.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center border border-gray-400 w-40 h-40"
        >
          <img src={src} alt={item.alt || ""} />
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  )
}

export const PictureChoiceItem = ({ item }) => {
  const y = useMotionValue(0)
  const controls = useDragControls()

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={item}
      id={item.id}
      style={{ y }}
      key={item}
      className="flex flex-row gap-3  p-4 items-center border justify-between w-full h-20"
    >
      <div className="flex flex-row items-center gap-3">
        <img src={item.pic} alt={item.alt || ""} className="w-10 h-10" />
        <p>{item.text}</p>
      </div>
      <div
        onPointerDown={(e) => controls.start(e)}
        className="reorder-handle hover:cursor-pointer"
      >
        <GripVertical />
      </div>
    </Reorder.Item>
  )
}

export const PictureChoiceSettings = () => {
  const controls = useDragControls()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const {
    actions: { setProp },
    props: {
      alt,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      background,
      radius,
      align,
      width,
      height,
      src,
      pictureItems,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProp((props) => (props.src = URL.createObjectURL(file)), 1000)
    }
  }

  return (
    <>
      <Card className="p-2">
        <div>
          <Reorder.Group
            axis="y"
            values={pictureItems}
            className="py-4 gap-2 flex flex-col w-full"
            onReorder={(e) => setProp((props) => (props.pictureItems = e))}
          >
            {pictureItems.map((item) => (
              <PictureChoiceItem key={item.id} item={item} />
            ))}
          </Reorder.Group>
        </div>
        <CardHeader className="p-2">
          <CardTitle>Logo</CardTitle>
          <CardDescription>Add url of logo</CardDescription>
        </CardHeader>
        <CardContent className="p-2 flex flex-col gap-2">
          <Input
            defaultValue={src}
            className="w-full text-xs p-2"
            onChange={(e) => setProp((props) => (props.src = e.target.value))}
          />
          <span className="text-muted-foreground">Upload logo</span>
          <Input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleInputChange}
          />
          <div
            onClick={() => (inputRef.current as HTMLInputElement)?.click()}
            className="relative flex flex-row justify-center hover:cursor-pointer w-full"
          >
            <div className="bg-white bg-opacity-60 absolute w-full h-full flex flex-row items-center justify-center">
              <UploadCloud />
            </div>
            <img src={src} alt={alt} className="w-30" />
          </div>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-2">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">General </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Alt label</p>
              <Input
                className="text-sm p-2"
                value={alt}
                placeholder={alt}
                onChange={(e) => {
                  setProp((props) => (props.alt = e.target.value), 1000)
                }}
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Width</p>
              <Input
                defaultValue={width}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.width = e.target.value))
                }
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Height</p>
              <Input
                defaultValue={height}
                className="w-full"
                onChange={(e) => {
                  setProp((props) => (props.height = e.target.value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Spacing</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-2">
            <div className="style-control flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Top</Label>
              <Slider
                defaultValue={[0]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                value={[marginTop]}
                onValueChange={(value) => {
                  setProp((props) => (props.marginTop = value), 1000)
                }}
              />
            </div>
            <div className="style-control flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Bottom</Label>
              <Slider
                defaultValue={[0]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                value={[marginBottom]}
                onValueChange={(value) =>
                  setProp((props) => (props.marginBottom = value), 1000)
                }
              />
            </div>
            <div className="style-control flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Left</Label>
              <Slider
                defaultValue={[0]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                value={[marginLeft]}
                onValueChange={(value) =>
                  setProp((props) => (props.marginLeft = value), 1000)
                }
              />
            </div>
            <div className="style-control flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Right</Label>
              <Slider
                defaultValue={[0]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                value={[marginRight]}
                onValueChange={(value) =>
                  setProp((props) => (props.marginRight = value), 1000)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Appearance </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Background</p>
              <Input
                type="color"
                value={background}
                onChange={(e) => {
                  setProp((props) => (props.background = e.target.value), 1000)
                }}
              />
            </div>
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Align</p>
              <RadioGroup
                value={align}
                onValueChange={(value) =>
                  setProp((props) => (props.align = value))
                }
              >
                <div className="flex flex-row gap-2">
                  <RadioGroupItem value="start" id="al-1" />
                  <Label htmlFor="al-1">Left</Label>
                </div>
                <div className="flex flex-row gap-2">
                  <RadioGroupItem value="center" id="al-2" />
                  <Label htmlFor="al-1">Center</Label>
                </div>
                <div className="flex flex-row gap-2">
                  <RadioGroupItem value="end" id="al-3" />
                  <Label htmlFor="al-1">Right</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Radius</p>
              <Slider
                defaultValue={[radius]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.radius = value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

enum ItemType {
  PICTURE = "picture",
  ICON = "icon",
}

export const PictureChoiceDefaultProps = {
  tagLine: "Picture Choice",
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  background: "inherit",
  radius: "none",
  align: "center",
  pictureItems: [
    {
      id: 1,
      text: "Achieve",
      pic: "https://shorturl.at/cikG1",
      itemType: ItemType.PICTURE,
    },
    {
      id: 2,
      text: "Target",
      pic: "https://shorturl.at/cikG1",
      itemType: ItemType.PICTURE,
    },
    {
      id: 3,
      text: "Launch",
      pic: "https://shorturl.at/cikG1",
      itemType: ItemType.PICTURE,
    },
    {
      id: 4,
      text: "Dont agree",
      pic: "https://shorturl.at/cikG1",
      itemType: ItemType.PICTURE,
    },
  ],
  width: 80,
  height: 80,
  src: "https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
}

PictureChoice.craft = {
  props: PictureChoiceDefaultProps,
  related: {
    settings: PictureChoiceSettings,
  },
}
