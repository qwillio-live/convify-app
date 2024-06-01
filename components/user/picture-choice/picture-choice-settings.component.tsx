import { createPortal } from "react-dom";
import React, { useEffect, useState, useRef, forwardRef } from "react"
import icons from "@/constant/streamline.json"
import {useOnClickOutside} from "@/hooks/use-click-outside"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"

import { Button, Button as CustomButton } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@radix-ui/react-label"
import { Slider } from "@/components/ui/slider"
import { useDragControls, Reorder, useMotionValue } from "framer-motion"
import { Card } from "@/components/ui/card"
import {
  GripVertical,
  Check as IconCheck,
  X as IconX,
  PlusCircle,
  Trash2,
} from "lucide-react"
import ContentEditable from "react-contenteditable"
import { ThumbsUp } from "lucide-react"
import { SmilePlus } from "lucide-react"
import { Image as ImageIcon } from "lucide-react"

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
  const [text, setText] = React.useState<string | null>("")
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

  // const handleAddFile = () => {
  //   const tempArray = [...pictureItems]
  //   tempArray.push({
  //     id: `${pictureItems.length + 1}`,
  //     text: text,
  //     pic: uploadFile,
  //     itemType: ItemType.PICTURE,
  //   })
  //   setProp((props) => (props.pictureItems = tempArray), 1000)
  //   setUploadFile(null)
  //   setText("")
  // }

  const handleAddFile = () => {
    const newItem = {
      id: `${pictureItems.length + 1}`,
      text: text || "Lorem",
      pic: uploadFile || "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f972.png", // Use a placeholder image URL
      itemType: ItemType.PICTURE,
    }

    setProp((props) => (props.pictureItems = [...props.pictureItems, newItem]), 1000)
    setUploadFile(null)
    setText("")
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
          <Button variant="outline" className="w-full" onClick={handleAddFile}>
            <PlusCircle className="mr-4" />
            Add Items
          </Button>
        </div>
      </Card>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Colors</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-muted-foreground text-sm">Text</p>
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

              <p className="text-muted-foreground text-sm">Hover</p>
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
              <p className="text-muted-foreground text-sm">Background</p>
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
              <p className="text-muted-foreground text-sm">Background hover</p>
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
                  setProp(
                    (props) => (props.containerStyles.padding = e.target.value),
                    1000
                  )
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
                  setProp(
                    (props) =>
                      (props.pictureItemsStyles.padding = e.target.value),
                    1000
                  )
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
                  setProp(
                    (props) =>
                      (props.containerStyles.marginLeft = e.target.value),
                    1000
                  )
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
                  setProp(
                    (props) =>
                      (props.containerStyles.marginTop = e.target.value),
                    1000
                  )
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
                  setProp(
                    (props) =>
                      (props.containerStyles.marginRight = e.target.value),
                    1000
                  )
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
                  setProp(
                    (props) =>
                      (props.containerStyles.marginBottom = e.target.value),
                    1000
                  )
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
                  setProp(
                    (props) => (props.containerStyles.gap = e.target.value),
                    1000
                  )
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
  const [pickerType, setPickerType] = useState("image")
  const y = useMotionValue(0)
  const controls = useDragControls()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropdownRef = React.useRef<HTMLInputElement>(null)
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [open, setOpen] = useState(false)
  const emojiRef = useRef(null)


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

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    console.log("emojiObject", emojiObject)
    setProp(
      (props) => (props.pictureItems[index].pic = emojiObject.imageUrl),
      1000
    )
    setProp(
      (props) => ((props.pictureItems[index].itemType = ItemType.PICTURE), 1000)
    )
    setPickerType("")
  }

  const handleOpenEmojiPicker = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setPickerPosition({
        top: rect.top + window.scrollY - 300, // Adjust the position as needed
        left: rect.left + window.scrollX - 250,
      });
      setPickerType("emoji");
    }
  };

  const handlePickerSelection = (type: string) => {
    setPickerType(type)
    if (type === "icon") {
      setProp(
        (props) => (props.pictureItems[index].itemType = ItemType.ICON),
        1000
      )
    } else {
      setProp(
        (props) => (props.pictureItems[index].itemType = ItemType.PICTURE),
        1000
      )
    }
  }

  const handleSVGChange = (iconName) => {
    // Get the SVG data for the selected icon
    const svgData = convertToSvg(icons[iconName]?.body);


    if (svgData) {
      // Convert the SVG data into a Blob
      const blob = new Blob([svgData], { type: "image/svg+xml" })
      // Create a URL for the Blob
      const imageUrl = URL.createObjectURL(blob)
      // Update the pictureItems state accordingly
      // For example:
      setProp((props) => {
        const updatedProps = { ...props }
        updatedProps.pictureItems[index].pic = imageUrl
        updatedProps.pictureItems[index].itemType = ItemType.PICTURE
        return updatedProps
      }, 1000)
    }
    setOpen(false)

  }

  const handleRemoveItem = () => {
    setProp((props) => {
      const updatedProps = { ...props };
      updatedProps.pictureItems[index].pic = null;
      updatedProps.pictureItems[index].icon = null;
      updatedProps.pictureItems[index].itemType = null;
      return updatedProps;
    }, 1000);
  };


  const handleClickOutside = () => {
    // Your custom logic here
    console.log("click")
    useOnClickOutside(emojiPickerRef, () => {
      if (pickerType === 'emoji') setPickerType('');
    });
  }

  useOnClickOutside(emojiRef, handleClickOutside)


  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={item}
      id={item.id}
      style={{ y }}
      key={item}
      className="flex h-20 w-full flex-row flex-wrap items-center justify-between gap-3 border p-4"
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* <Button variant="outline">Open</Button> */}
            <div className="flex flex-row flex-wrap items-center gap-3">
              <div
                onClick={() => console.log("clicked")}
                className="pic-container hover:cursor-pointer"
              >
                {item.itemType === ItemType.ICON ? (
                  // <img src={item.icon} className="shrink-0 w-20 h-20" />
                  item.icon === "check" ? (
                    <IconCheck className="size-5 shrink-0" />
                  ) : item.icon === "x" ? (
                    <IconX className="size-5 shrink-0" />
                  ) : null
                ) : (
                  <img
                    src={item.pic}
                    alt={item.alt || ""}
                    className="w-6 h-6 object-cover"
                  />
                )}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuGroup>
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <ThumbsUp className="mr-2 size-4" />
                  <span>Select Icon</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem onClick={handleOpenEmojiPicker} ref={dropdownRef}>
                <SmilePlus className="mr-2 size-4" />
                <span>Select Emoji</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => (inputRef.current as HTMLInputElement)?.click()}
              >
                <ImageIcon className="mr-2 size-4" />
                <span>Select Image</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRemoveItem}>
                <Trash2 className="mr-2 size-4" />
                <span>Remove</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* icons */}
        <DialogContent className="overflow-y-auto sm:max-h-[70%] sm:max-w-[80%]">
          <DialogHeader>
            <DialogTitle>Choose Icons</DialogTitle>
            <DialogDescription>
              Make changes to your icons here.
            </DialogDescription>
          </DialogHeader>
          <div className="ml-4 mt-4 grid grid-cols-6 gap-4">
            {Object.keys(icons).map((iconName) => (
              <IconRenderer
                key={iconName}
                iconName={iconName}
                onClick={handleSVGChange}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleInputChange}
      />
      <input
        type="text"
        value={item.text}
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
        className="min-w-[50px] max-w-[50px] overflow-x-auto truncate"
        tagName={"p"}
      />
        
      <PortalEmojiPicker
        isVisible={pickerType === "emoji"}
        position={pickerPosition}
        onEmojiClick={handleEmojiClick}
        ref={emojiRef}
      />


      <div
        onPointerDown={(e) => controls.start(e)}
        className="reorder-handle hover:cursor-pointer"
      >
        <GripVertical />
      </div>
    </Reorder.Item>
  )
}
const IconRenderer = ({ iconName, onClick }) => {
  return (
    <div
      className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex items-center justify-center rounded-md bg-transparent p-4 text-center"
      onClick={() => onClick(iconName)} // Call handleInputChange with the iconName when clicked
    >
      {" "}
      {/* Added flex and other properties */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24" // Adjust viewBox as needed
        dangerouslySetInnerHTML={{ __html: icons[iconName]?.body || "" }}
        className="h-24 w-24 cursor-pointer ml-6 mt-6" // Removed items-center and justify-center classes
      />
    </div>
  )
}

const convertToSvg = (svgBody) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 cursor-pointer" width="15"
  height="15">${svgBody}</svg>`;
};


const style = { position: "absolute", left: "300px", zIndex: 1000000 }

const PortalEmojiPicker = forwardRef(({ isVisible, position, onEmojiClick }, ref) => {
  const style = {
    position: "absolute",
    top: position.top,
    left: position.left,
    zIndex: 1000000,
  };

  return isVisible
    ? createPortal(
        <EmojiPicker ref={ref} style={style} onEmojiClick={onEmojiClick} lazyLoadEmojis={true} skinTonesDisabled={true} width={280} height={350} previewConfig={
          {showPreview: false}
        }/>,
        document.body
      )
    : null;
});