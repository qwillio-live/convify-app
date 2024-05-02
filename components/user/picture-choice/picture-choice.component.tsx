import { DefaultSerializer } from "v8"
import React from "react"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import {
  Anchor,
  Aperture,
  ArrowBigUp,
  BellRing,
  CheckCircle,
  GripVertical,
  Image,
  ListOrdered,
  ShieldCheck,
  UploadCloud,
} from "lucide-react"
import ContentEditable from "react-contenteditable"

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
import { Separator } from "@/components/ui/separator"
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
import {
  TextDefaultProps,
  UserText,
  UserTextSettings,
} from "../user-text.component"

const ICONS = {
  image: Image,
  listOrdered: ListOrdered,
  uploadCloud: UploadCloud,
  aperture: Aperture,
  arrowBigUp: ArrowBigUp,
  anchor: Anchor,
  bellingRing: BellRing,
  checkCircle: CheckCircle,
  shieldCheck: ShieldCheck,
}

export const PictureChoice = ({
  containerStyles,
  pictureItemsStyles,
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
    <>
      {isHovered && <Controller nameOfComponent={"Picture Choice"} />}
      <Element
        id="picture-choice-tagline"
        is={UserText}
        {...TextDefaultProps}
        text="Get your sales up"
      />
      <div
        ref={(ref: any) => connect(drag(ref))}
        style={{
          display: "flex",
          marginTop: `${containerStyles.marginTop}px`,
          marginBottom: `${containerStyles.marginBottom}px`,
          marginLeft: `${containerStyles.marginLeft}px`,
          marginRight: `${containerStyles.marginRight}px`,
          background: `${containerStyles.background}`,
          borderRadius: `${containerStyles.radius}px`,
          alignItems: containerStyles.align,
          flexDirection: containerStyles.flexDirection,
          justifyContent: containerStyles.justifyContent,
          gap: `${containerStyles.gap}px`,
          padding: `${containerStyles.padding}px`,
          border: `${containerStyles.border}px solid ${containerStyles.borderColor}`,
        }}
        className={cn(isHovered && "border-blue-400 border-dotted")}
      >
        {pictureItems.map((item, index) => (
          <div
            key={index}
            style={{
              minWidth: `${pictureItemsStyles.itemWidth}px`,
              minHeight: `${pictureItemsStyles.itemHeight}px`,
              fontSize: `${pictureItemsStyles.fontSize}px`,
              display: "flex",
              backgroundColor: `${pictureItemsStyles.background}`,
              width:"100%",
              height:"100%",
              color: pictureItemsStyles.textColor,
              borderRadius: `${pictureItemsStyles.radius}px`,
              alignItems: pictureItemsStyles.align,
              flexDirection: pictureItemsStyles.flexDirection,
              justifyContent: pictureItemsStyles.justifyContent,
              gap: `${pictureItemsStyles.gap}px`,
              padding: `${pictureItemsStyles.padding}px`,
              flexWrap: "wrap",
              maxWidth: "100%",
              overflow: "hidden",
              border: `${pictureItemsStyles.border}px solid ${pictureItemsStyles.borderColor}`,
            }}
          >
            {item.itemType === ItemType.ICON ? (
              <item.pic
                style={{
                  width: `${pictureItemsStyles.picWidth}px`,
                  height: `${pictureItemsStyles.picHeight}px`,
                }}
              />
            ) : (
              <img
                src={item.pic}
                alt={item.alt || ""}
                style={{
                  width: `${pictureItemsStyles.picWidth}px`,
                  height: `${pictureItemsStyles.picHeight}px`,
                }}
              />
            )}
            <p style={{
              color: `${pictureItemsStyles.textColor}`,
             }}>{item.text}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export const PictureChoiceItem = ({ item, index }) => {
  const y = useMotionValue(0)
  const controls = useDragControls()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProp(
        (props) => (props.pictureItems[index].pic = URL.createObjectURL(file)),
        1000
      )
      setProp(
        (props) => (
          (props.pictureItems[index].itemType = ItemType.PICTURE), 1000
        )
      )
    }
  }
  const {
    actions: { setProp },
    props: { pictureItems, tagLine, containerStyles, pictureItemsStyles },
  } = useNode((node) => ({
    props: node.data.props,
  }))
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
      <Input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleInputChange}
      />
      <div className="flex flex-row items-center gap-3 flex-wrap">
        <div
          onClick={() => (inputRef.current as HTMLInputElement)?.click()}
          className="pic-container hover:cursor-pointer"
        >
          {item.itemType === ItemType.ICON ? (
            <item.pic size={20} className="shrink-0" />
          ) : (
            <img src={item.pic} alt={item.alt || ""} className="w-10 h-10" />
          )}
        </div>
        <ContentEditable
          html={item.text}
          disabled={false}
          onChange={(e) =>
            setProp(
              (props) =>
                (props.pictureItems[index].text = e.target.value.replace(
                  /<\/?[^>]+(>|$)/g,
                  ""
                )),
              500
            )
          }
          className="overflow-hidden max-w-[100px] truncate min-w-[100px]"
          tagName={"p"}
        />
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
    props: { pictureItemsStyles, containerStyles, pictureItems },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <>
      <Card className="p-2">
        <CardHeader className="p-2">
          <CardTitle>Content</CardTitle>
          <CardDescription>Drag to re-arrange click to edit</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Reorder.Group
            axis="y"
            values={pictureItems}
            className="py-4 gap-2 flex flex-col w-full"
            onReorder={(e) => setProp((props) => (props.pictureItems = e))}
          >
            {pictureItems.map((item, index) => (
              <PictureChoiceItem key={item.id} item={item} index={index} />
            ))}
          </Reorder.Group>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Colors</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Text</p>
              <Input
                type={"color"}
                className="text-sm p-2"
                value={pictureItemsStyles.textColor}
                placeholder={pictureItemsStyles.textColor}
                onChange={(e) => {
                  setProp(
                    (props) =>
                      (props.pictureItemsStyles.textColor = e.target.value),
                    1000
                  )
                }}
              />

              <p className="text-sm text-muted-foreground">Hover</p>
              <Input
                type={"color"}
                className="text-sm p-2"
                value={pictureItemsStyles.textHover}
                placeholder={pictureItemsStyles.textHover}
                onChange={(e) => {
                  setProp(
                    (props) =>
                      (props.pictureItemsStyles.textHover = e.target.value),
                    1000
                  )
                }}
              />
            </div>

            <Separator className="my-4" />

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Background</p>
              <Input
                type={"color"}
                className="text-sm p-2"
                value={pictureItemsStyles.background}
                placeholder={pictureItemsStyles.background}
                onChange={(e) => {
                  setProp(
                    (props) =>
                      (props.pictureItemsStyles.background = e.target.value),
                    1000
                  )
                }}
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Background hover</p>
              <Input
                type={"color"}
                className="text-sm p-2"
                value={pictureItemsStyles.backgroundHover}
                placeholder={pictureItemsStyles.backgroundHover}
                onChange={(e) => {
                  setProp(
                    (props) =>
                      (props.pictureItemsStyles.backgroundHover =
                        e.target.value),
                    1000
                  )
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Padding</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
          <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Container</p>
              <Slider
                defaultValue={[containerStyles.padding]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.containerStyles.padding = value), 1000)
                }}
              />
            </div>

            <Separator className="my-4" />
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Item</p>
              <Slider
                defaultValue={[pictureItemsStyles.padding]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.pictureItemsStyles.padding = value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Margin container</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
          <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Left</p>
              <Slider
                defaultValue={[containerStyles.marginLeft]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.containerStyles.marginLeft = value), 1000)
                }}
              />
            </div>

            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Top</p>
              <Slider
                defaultValue={[containerStyles.marginTop]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.containerStyles.marginTop = value), 1000)
                }}
              />
            </div>

            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Right</p>
              <Slider
                defaultValue={[containerStyles.marginRight]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.containerStyles.marginRight = value), 1000)
                }}
              />
            </div>

            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Bottom</p>
              <Slider
                defaultValue={[containerStyles.marginBottom]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.containerStyles.marginBottom = value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Alignment </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-1 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Direction</p>
              <RadioGroup
                defaultValue={containerStyles.flexDirection}
                onValueChange={(value) => {
                  setProp((props) => (props.containerStyles.flexDirection = value), 1000)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="column" id="r2" />
                  <Label htmlFor="r2">Column</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="row" id="r3" />
                  <Label htmlFor="r3">Row</Label>
                </div>
              </RadioGroup>
            </div>


            <div className="style-control col-span-1 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Align</p>
              <RadioGroup
                defaultValue={containerStyles.alignItems}
                onValueChange={(value) => {
                  setProp((props) => (props.containerStyles.alignItems = value), 1000)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"start"} id="r2" />
                  <Label htmlFor="r2">Start</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"center"} id="r3" />
                  <Label htmlFor="r3">Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"end"} id="r4" />
                  <Label htmlFor="r4">End</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="style-control col-span-1 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Justify</p>
              <RadioGroup
                defaultValue={containerStyles.justifyContent}
                onValueChange={(value) => {
                  setProp((props) => (props.containerStyles.justifyContent = value), 1000)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"start"} id="r2" />
                  <Label htmlFor="r2">Start</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"center"} id="r3" />
                  <Label htmlFor="r3">Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"end"} id="r4" />
                  <Label htmlFor="r4">End</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Gap</p>
              <Slider
                defaultValue={[containerStyles.gap]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.containerStyles.gap = value), 1000)
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
  containerStyles: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    background: "#ffffff",
    radius: 0,
    align: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 20,
    border: 0,
    borderColor: "#a1a1a1",
  },
  pictureItemsStyles: {
    itemWidth: 120,
    itemHeight: 120,
    fontSize: 24,
    picWidth: 46,
    picHeight: 46,
    background: "#ffffff",
    backgroundHover: "#000000",
    radius: 0,
    textColor: "#000000",
    textHover: "#ffffff",
    align: "center",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 30,
    border: 2,
    borderColor: "#747070",
  },
  pictureItems: [
    {
      id: 1,
      text: "Achieve",
      pic: ICONS.bellingRing,
      itemType: ItemType.ICON,
    },
    {
      id: 2,
      text: "Target",
      pic: ICONS.shieldCheck,
      itemType: ItemType.ICON,
    },
    {
      id: 3,
      text: "Launch",
      pic: ICONS.checkCircle,
      itemType: ItemType.ICON,
    },
    {
      id: 4,
      text: "Agree",
      pic: ICONS.uploadCloud,
      itemType: ItemType.ICON,
    },
  ],
}

PictureChoice.craft = {
  props: PictureChoiceDefaultProps,
  related: {
    settings: PictureChoiceSettings,
  },
}
