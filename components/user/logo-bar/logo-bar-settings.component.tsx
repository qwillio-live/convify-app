import React, { useState } from "react"
import ConvifyLogo from "@/assets/convify_logo_blue.png"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import {
  Circle,
  GripVertical,
  Image,
  PlusCircle,
  Trash2,
  UploadCloud,
} from "lucide-react"
import ContentEditable from "react-contenteditable"

import { useNode } from "@/lib/craftjs"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button, Button as CustomButton } from "@/components/ui/button"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import { Switch } from "@/components/ui/switch"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"

enum SWITCH {
  SINGLE = "single",
  MULTIPLE = "multiple",
}
export const LogoBarSettings = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uploadFile, setUploadFile] = React.useState<string | null>(null)
  const [altText, setAltText] = React.useState<string | null>(null)
  const {
    actions: { setProp },
    props: {
      logoBarItems,
      logoBarStyles: {
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
        fullWidth,
        height,
        flex,
        flexDirection,
        justifyContent,
        alignItems,
        gap,
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
    const tempArray = [...logoBarItems]
    tempArray.push({
      id: `logo-bar-item-image-+${logoBarItems.length + 1}`,
      src: uploadFile,
      alt: altText,
    })
    setProp((props) => (props.logoBarItems = tempArray), 1000)
    setUploadFile(null)
    setAltText(null)
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
            values={logoBarItems}
            className="py-4 gap-2 flex flex-col w-full"
            onReorder={(e) => setProp((props) => (props.logoBarItems = e))}
          >
            {logoBarItems?.map((item, index) => (
              <MultipleChoiceSettingsItem
                key={`logo-bar-item-image-${item.id}`}
                item={item}
                index={index}
              />
            ))}
          </Reorder.Group>
        </CardContent>
        <div className="add-logo flex flex-row justify-end items-center w-full mb-6">
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
                  <h4 className="font-medium leading-none">Add logo item</h4>
                  <p className="text-sm text-muted-foreground">
                    Select image as logo and set alt text
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-2">
                    <Label htmlFor="media">Logo</Label>
                    <Input
                      id="media"
                      onChange={handleInputFileChange}
                      type={"file"}
                      className="col-span-2 h-8"
                    />
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <Label htmlFor="altText">Alt</Label>
                    <Input
                      id="altText"
                      onChange={(e) => {
                        setAltText(e.target.value)
                      }}
                      placeholder="Alt text for image"
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
                      (props.logoBarStyles.fullWidth =
                        !props.logoBarStyles.fullWidth)
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
                    (props) => (props.logoBarStyles.width = e.target.value)
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
                    (props) => (props.logoBarStyles.background = e.target.value)
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
                    (props) => (props.logoBarStyles.radius = e.target.value)
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
                    (props) => (props.logoBarStyles.marginTop = e.target.value)
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
                      (props.logoBarStyles.marginBottom = e.target.value)
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
                    (props) => (props.logoBarStyles.marginLeft = e.target.value)
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
                      (props.logoBarStyles.marginRight = e.target.value)
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
                    (props) => (props.logoBarStyles.paddingTop = e.target.value)
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
                      (props.logoBarStyles.paddingBottom = e.target.value)
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
                      (props.logoBarStyles.paddingLeft = e.target.value)
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
                      (props.logoBarStyles.paddingRight = e.target.value)
                  )
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Alignment</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Direction</p>
              <Select
                defaultValue={flexDirection}
                onValueChange={(e) => {
                  setProp(
                    (props) => (props.logoBarStyles.flexDirection = e),
                    1000
                  )
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="row">Row</SelectItem>
                    <SelectItem value="column">Column</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Justify</p>
              <Select
                defaultValue={justifyContent}
                onValueChange={(e) => {
                  setProp(
                    (props) => (props.logoBarStyles.justifyContent = e),
                    1000
                  )
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Justify" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="flex-start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="flex-end">End</SelectItem>
                    <SelectItem value="space-between">Between</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Align</p>
              <Select
                defaultValue={alignItems}
                onValueChange={(e) => {
                  setProp((props) => (props.logoBarStyles.alignItems = e), 1000)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Align" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="flex-start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="flex-end">End</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
        (props) => (props.logoBarItems[index].src = URL.createObjectURL(file)),
        1000
      )
    }
  }
  const {
    actions: { setProp },
    props: { logoBarItems },
  } = useNode((node) => ({
    props: node.data.props,
  }))
  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={item}
      id={`logo-bar-item-image-${item.id}`}
      style={{ y }}
      key={`logo-bar-item-image-${item.id}`}
      className="flex flex-row gap-3  p-4 items-center border justify-between w-full h-20"
    >
      <Button
        onClick={() =>
          setProp(
            (props) =>
              (props.logoBarItems = logoBarItems.filter((_, i) => i !== index)),
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
          <img src={item.src} alt={item.alt || ""} className="w-20 h-auto" />
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
