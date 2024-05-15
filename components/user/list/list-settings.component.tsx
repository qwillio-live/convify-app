import React from "react"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import {
  GripVertical,
  PlusCircle,
  Trash2,
} from "lucide-react"

import { useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

enum SWITCH {
  SINGLE = "single",
  MULTIPLE = "multiple",
}
export const ListItemSettings = () => {
  const [uploadFile, setUploadFile] = React.useState<string | null>(null)
  const [heading, setHeading] = React.useState<string | null>(null)
  const [subHeading, setSubHeading] = React.useState<string | null>(null)
  const {
    actions: { setProp },
    props: {
      listItems,
      listStyles: {
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        background,
        width,
        column,
        fullWidth,
        radius,
      },
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))
  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFile(URL.createObjectURL(file))
    }
  }

  const handleAddFile = () => {
    const tempArray = [...listItems]
    tempArray.push({
      id: `list-item-image-+${listItems.length + 1}`,
      icon: uploadFile,
      text: heading,
      subText: subHeading
    })
    setProp((props) => (props.listItems = tempArray), 1000)
    setUploadFile(null)
    setHeading(null)
    setSubHeading(null)
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
            values={listItems}
            className="py-4 gap-2 flex flex-col w-full"
            onReorder={(e) => setProp((props) => (props.listItems = e))}
          >
            {listItems?.map((item, index) => (
              <MultipleChoiceSettingsItem
                key={`list-item-image-${item.id}`}
                item={item}
                index={index}
              />
            ))}
          </Reorder.Group>
        </CardContent>
        <div className="add-list flex flex-row justify-end items-center w-full mb-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                <PlusCircle className="mr-4" />
                Add Items
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Add list item</h4>
                  <p className="text-sm text-muted-foreground">
                    Select image as list and set alt text
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-2">
                    <Label htmlFor="media">List</Label>
                    <Input
                      id="media"
                      onChange={handleInputFileChange}
                      type={"file"}
                      className="col-span-2 h-8"
                    />
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <Label htmlFor="altText">Heading</Label>
                    <Input
                      id="heading"
                      onChange={(e) => {
                        setHeading(e.target.value)
                      }}
                      placeholder="Heading"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-2">
                    <Label htmlFor="altText">Sub Heading</Label>
                    <Input
                      id="sub-heading"
                      onChange={(e) => {
                        setSubHeading(e.target.value)
                      }}
                      placeholder="Sub Heading"
                      className="col-span-2 h-8"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-2 mt-4">
                    <Button
                      id="altText"
                      onClick={handleAddFile}
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
            <span className="text-sm font-medium">General </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Full-width</p>
              <Input
                type={"checkbox"}
                defaultValue={fullWidth}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) =>
                      (props.listStyles.fullWidth =
                        !props.listStyles.fullWidth)
                  )
                }
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Width</p>
              <Input
                type={"number"}
                defaultValue={width}
                placeholder={width}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.listStyles.width = e.target.value)
                  )
                }
              />
            </div>

            <Separator className="my-4 w-full basis-full" />

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Background</p>
              <Input
                type={"color"}
                defaultValue={background}
                placeholder={background}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.listStyles.background = e.target.value)
                  )
                }
              />
            </div>

            <Separator className="my-4 w-full" />

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Border Radius</p>
              <Input
                type={"number"}
                defaultValue={radius}
                placeholder={radius}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.listStyles.radius = e.target.value)
                  )
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Margin</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Top</p>
              <Input
                type={"number"}
                defaultValue={marginTop}
                placeholder={marginTop}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.listStyles.marginTop = e.target.value)
                  )
                }
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Bottom</p>
              <Input
                type={"number"}
                defaultValue={marginBottom}
                placeholder={marginBottom}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) =>
                      (props.listStyles.marginBottom = e.target.value)
                  )
                }
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Left</p>
              <Input
                type={"number"}
                defaultValue={marginLeft}
                placeholder={marginLeft}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.listStyles.marginLeft = e.target.value)
                  )
                }
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Right</p>
              <Input
                type={"number"}
                defaultValue={marginRight}
                placeholder={marginRight}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) =>
                      (props.listStyles.marginRight = e.target.value)
                  )
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Padding</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Top</p>
              <Input
                type={"number"}
                defaultValue={paddingTop}
                placeholder={paddingTop}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.listStyles.paddingTop = e.target.value)
                  )
                }
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Bottom</p>
              <Input
                type={"number"}
                defaultValue={paddingBottom}
                placeholder={paddingBottom}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) =>
                      (props.listStyles.paddingBottom = e.target.value)
                  )
                }
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Left</p>
              <Input
                type={"number"}
                defaultValue={paddingLeft}
                placeholder={paddingLeft}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) =>
                      (props.listrStyles.paddingLeft = e.target.value)
                  )
                }
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Right</p>
              <Input
                type={"number"}
                defaultValue={paddingRight}
                placeholder={paddingRight}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) =>
                      (props.listStyles.paddingRight = e.target.value)
                  )
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Appearance</span>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <div className="style-control col-span-2 flex flex-col">
              <div className="style-control flex flex-col gap-2 pb-4 pt-2">
                <p className="text-md text-muted-foreground">{`Columns ${column}`}</p>
                  <Slider
                    defaultValue={[2]}
                    max={4}
                    min={1}
                    step={1}
                    onValueChange={(value) => {
                      setProp((props) => (props.listStyles.column = value), 1000)
                    }}
                  />
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export const MultipleChoiceSettingsItem = ({ item, index }) => {
  const y = useMotionValue(0)
  const controls = useDragControls()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProp(
        (props) => (props.listItems[index].src = URL.createObjectURL(file)),
        1000
      )
    }
  }
  const {
    actions: { setProp },
    props: { listItems },
  } = useNode((node) => ({
    props: node.data.props,
  }))
  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={item}
      id={`list-item-image-${item.id}`}
      style={{ y }}
      key={`list-item-image-${item.id}`}
      className="flex flex-row gap-3  p-4 items-center border justify-between w-full h-20"
    >
      <Button
        onClick={() =>
          setProp(
            (props) =>
              (props.listItems = listItems.filter((_, i) => i !== index)),
            1000
          )
        }
        className="p-2"
        variant={"outline"}
      >
        <Trash2 className="w-5 h-5" />
      </Button>
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
          <div
            className="text-lg flex items-center gap-x-4"
          >
              <label className="text-sm"><b>{item.text}</b></label>
          </div>
        </div>
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
