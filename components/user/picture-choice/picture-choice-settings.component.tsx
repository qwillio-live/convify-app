import React, { useEffect, useState } from "react"
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button, Button as CustomButton } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@radix-ui/react-label"
import { Slider } from "@/components/ui/slider"
import { useDragControls, Reorder, useMotionValue } from "framer-motion"
import { Card } from "@/components/ui/card"
import { GripVertical,Check as IconCheck, X as IconX, PlusCircle } from "lucide-react"
import ContentEditable from "react-contenteditable"

export const PictureChoiceSettings = () => {
  const controls = useDragControls()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const {
    actions: { setProp },
    props: { pictureItemsStyles, containerStyles, pictureItems },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const [uploadFile, setUploadFile] = React.useState<string | null>(null)
  const [text, setText] = React.useState<string | null>(null)
  const [isPopoverOpen, setPopoverOpen] = useState(false)
  const popoverRef = React.useRef<HTMLInputElement>(null)

  const closePopover = () => {
    setPopoverOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        closePopover()
      }
    }

    if (isPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPopoverOpen, popoverRef])

  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFile(URL.createObjectURL(file))
    }
  }

  const handleAddFile = () => {
    const tempArray = [...pictureItems]
    tempArray.push({
      id: `${pictureItems.length + 1}`,
      text: text,
      pic: uploadFile,
      itemType: ItemType.PICTURE,
    })
    setProp((props) => (props.pictureItems = tempArray), 1000)
    setUploadFile(null)
    setText(null)
  }

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
            className="flex w-full flex-col gap-2 py-4"
            onReorder={(e) => setProp((props) => (props.pictureItems = e))}
          >
            {pictureItems.map((item, index) => (
              <PictureChoiceItem key={item.id} item={item} index={index} />
            ))}
          </Reorder.Group>
        </CardContent>
        <div className="add-logo mb-6 flex w-full flex-row items-center justify-end">
          <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                <PlusCircle className="mr-4" />
                Add Items
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" ref={popoverRef}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">
                    Add Picture Choice
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Select image as Picture and set text
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-2">
                    <Label htmlFor="media">Picture</Label>
                    <Input
                      id="media"
                      onChange={handleInputFileChange}
                      type={"file"}
                      className="col-span-2 h-8"
                    />
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <Label htmlFor="altText">Text</Label>
                    <Input
                      id="altText"
                      onChange={(e) => {
                        setText(e.target.value)
                      }}
                      placeholder="Text for Picture Icon"
                      className="col-span-2 h-8"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-4 items-center gap-2">
                    <Button
                      id="altText"
                      onClick={() => {
                        handleAddFile()
                        closePopover()
                      }}
                      className="col-span-2 h-8"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
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
                className="p-2 text-sm"
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
                className="p-2 text-sm"
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
                className="p-2 text-sm"
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
                className="p-2 text-sm"
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
              <Input
                type="number"
                placeholder={containerStyles.padding}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.containerStyles.padding = e.target.value), 1000)
                }
              />
            </div>

            <Separator className="my-4" />
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Item</p>
              <Input
                type="number"
                placeholder={pictureItemsStyles.padding}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.pictureItemsStyles.padding = e.target.value), 1000)
                }
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
              <Input
                type="number"
                placeholder={containerStyles.marginLeft}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.containerStyles.marginLeft = e.target.value), 1000)
                }
              />
            </div>

            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Top</p>
              <Input
                type="number"
                placeholder={containerStyles.marginTop}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.containerStyles.marginTop = e.target.value), 1000)
                }
              />
            </div>

            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Right</p>
              <Input
                type="number"
                placeholder={containerStyles.marginRight}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.containerStyles.marginRight = e.target.value), 1000)
                }
              />
            </div>

            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Bottom</p>
              <Input
                type="number"
                placeholder={containerStyles.marginBottom}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.containerStyles.marginBottom = e.target.value), 1000)
                }
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
                  setProp(
                    (props) => (props.containerStyles.flexDirection = value),
                    1000
                  )
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
                  setProp(
                    (props) => (props.containerStyles.alignItems = value),
                    1000
                  )
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
                  setProp(
                    (props) => (props.containerStyles.justifyContent = value),
                    1000
                  )
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
              <Input
                type="number"
                placeholder={containerStyles.gap}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.containerStyles.gap = e.target.value), 1000)
                }
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
      className="flex h-20 w-full  flex-row items-center justify-between gap-3 border p-4"
    >
      <Input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleInputChange}
      />
      <div className="flex flex-row flex-wrap items-center gap-3">
        <div
          onClick={() => (inputRef.current as HTMLInputElement)?.click()}
          className="pic-container hover:cursor-pointer"
        >
          {item.itemType === ItemType.ICON ? (
            // <img src={item.icon} className="shrink-0 w-20 h-20" />
            item.icon === 'check' ? (
              <IconCheck
                className="w-5 h-5 shrink-0"
              />
            ) : item.icon === 'x' ? (
              <IconX
              className="w-5 h-5 shrink-0"
              />
            ) : null
          ) : (
            <img src={item.pic} alt={item.alt || ""} className="h-10 w-10" />
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
          className="min-w-[80px] max-w-[100px] overflow-hidden truncate"
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
