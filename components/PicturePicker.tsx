import { useEffect, useMemo, useRef, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  CloudUpload,
  ImageIcon,
  Search,
  SmilePlus,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import icons from "@/constant/streamline.json"
import { useInView } from "framer-motion"
import EmojiPicker, { EmojiStyle, SuggestionMode } from "emoji-picker-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export enum PictureTypes {
  NULL = "null",
  ICON = "icon",
  EMOJI = "emoji",
  IMAGE = "image",
}

export const PicturePicker = ({
  className = "",
  picture,
  pictureType,
  nullIcon,
  onChange,
}: {
  className?: string
  picture: string | null
  pictureType: PictureTypes
  nullIcon: React.ReactNode
  onChange: (picture: string | null, pictureType: PictureTypes) => void
}) => {
  const t = useTranslations("CreateFlow")
  const imagePickerRef = useRef<HTMLInputElement>(null)

  const [currentPicture, setCurrentPicture] = useState<{
    data: any
    type: PictureTypes
  }>({
    data: picture,
    type: pictureType,
  })
  const [iconPickerDialogOpen, setIconPickerDialogOpen] = useState(false)
  const [emojiPickerPopoverOpen, setEmojiPickerPopoverOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [iconPickerSearchQuery, setIconPickerSearchQuery] = useState("")

  useEffect(() => {
    onChange(currentPicture.data, currentPicture.type)
  }, [currentPicture])

  const filteredIcons = useMemo(
    () =>
      Object.keys(icons).filter((iconName) =>
        iconName.toLowerCase().includes(iconPickerSearchQuery.toLowerCase())
      ),
    [iconPickerSearchQuery]
  )

  const handleIconChange = (iconName) => {
    const svgData = convertToSvg(icons[iconName]?.body)
    if (svgData) {
      // console.log("SVG Data", svgData);

      // const dataUrl = `data:image/svg+xml;base64,${btoa(svgData)}`
      setCurrentPicture({ data: svgData, type: PictureTypes.ICON })
    }
    setIconPickerSearchQuery("")
    setIconPickerDialogOpen(false)
  }

  const handleEmojiChange = (emoji) => {
    if (emoji.imageUrl) {
      setCurrentPicture({ data: emoji.imageUrl, type: PictureTypes.EMOJI })
    }
    setEmojiPickerPopoverOpen(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    console.log("Original File Size", file.size)

    if (file) {
      imageToDataURL(file).then((imageData) => {
        setCurrentPicture({ data: imageData, type: PictureTypes.IMAGE })
      })
    }
  }

  const handlePictureRemove = () => {
    setCurrentPicture({ data: null, type: PictureTypes.NULL })
  }

  const imageToDataURL = async (image) => {
    const canvas = document.createElement("canvas")
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.src = URL.createObjectURL(image)

    const imageData = await new Promise((resolve) => {
      img.onload = () => {
        var hRatio = canvas.width / img.width
        var vRatio = canvas.height / img.height
        var ratio = Math.min(hRatio, vRatio)
        var centerShift_x = (canvas.width - img.width * ratio) / 2
        var centerShift_y = (canvas.height - img.height * ratio) / 2
        ctx?.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShift_x,
          centerShift_y,
          img.width * ratio,
          img.height * ratio
        )

        const imageData = canvas.toDataURL("image/wepg")

        resolve(imageData)
      }
    })

    return imageData
  }

  return (
    <div className={className}>
      <Dialog
        open={iconPickerDialogOpen}
        onOpenChange={setIconPickerDialogOpen}
      >
        <Popover
          open={emojiPickerPopoverOpen}
          onOpenChange={setEmojiPickerPopoverOpen}
        >
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <PopoverTrigger
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <div className="flex flex-row flex-wrap items-center gap-3">
                  <Button
                    className="border-input !size-8 border p-0"
                    variant="ghost"
                    {...(currentPicture.type === PictureTypes.ICON
                      ? {
                          dangerouslySetInnerHTML: {
                            __html: currentPicture.data,
                          },
                        }
                      : {
                          children: (
                            <>
                              {currentPicture.type === PictureTypes.NULL &&
                                nullIcon}
                              {(currentPicture.type === PictureTypes.EMOJI ||
                                currentPicture.type === PictureTypes.IMAGE) && (
                                <img
                                  src={currentPicture.data}
                                  className="size-5 object-cover"
                                />
                              )}
                            </>
                          ),
                        })}
                  />
                </div>
              </PopoverTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuGroup>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <ThumbsUp className="mr-2 size-4" />
                    <span>{t("PictureChoice.icon")}</span>
                  </DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuItem
                  onClick={() => setEmojiPickerPopoverOpen(true)}
                >
                  <SmilePlus className="mr-2 size-4" />
                  <span>{t("PictureChoice.emoji")}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    (imagePickerRef.current as HTMLInputElement)?.click()
                  }
                >
                  <ImageIcon className="mr-2 size-4" />
                  <span>{t("PictureChoice.image")}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handlePictureRemove}
                  className="focus:bg-red-500 focus:text-white"
                >
                  <Trash2 className="mr-2 size-4" />
                  <span>{t("PictureChoice.remove")}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

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
                    value={iconPickerSearchQuery}
                    onChange={(e) => setIconPickerSearchQuery(e.target.value)}
                  />
                </div>
                <DialogClose asChild>
                  <Button variant="ghost">
                    <X className="size-5 shrink-0" />
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>
            <div className="m-6 mt-0 grid grid-cols-6 gap-4">
              {filteredIcons.length > 0 ? (
                filteredIcons.map((iconName) => (
                  <IconRenderer
                    key={iconName}
                    iconName={iconName}
                    onClick={handleIconChange}
                  />
                ))
              ) : (
                <div className="col-span-6 mt-4 text-center">
                  {t("PictureChoice.iconNotFound")}
                </div>
              )}
            </div>
          </DialogContent>

          <PopoverContent className="p-0">
            <EmojiPicker
              emojiStyle={EmojiStyle.NATIVE}
              onEmojiClick={handleEmojiChange}
              lazyLoadEmojis={true}
              skinTonesDisabled={true}
              width={280}
              height={350}
              suggestedEmojisMode={SuggestionMode.RECENT}
              emojiVersion={"4.0"}
              previewConfig={{ showPreview: false }}
            />
          </PopoverContent>

          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imagePickerRef}
            onChange={handleImageChange}
          />
        </Popover>
      </Dialog>
    </div>
  )
}

const convertToSvg = (svgBody) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="20px" height="20px">${svgBody}</svg>`
}

const IconRenderer = ({ iconName, onClick }) => {
  const ref = useRef(null)
  const isInView = useInView(ref)
  return (
    <div className="max-h-[160px]">
      <div
        ref={ref}
        className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex h-auto max-h-full w-auto max-w-full items-center justify-center rounded-md bg-transparent p-4 text-center"
        onClick={() => onClick(iconName)}
      >
        {isInView && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            dangerouslySetInnerHTML={{ __html: icons[iconName]?.body || "" }}
            className="ml-10 mt-8 h-24 w-24 cursor-pointer"
          />
        )}
      </div>
    </div>
  )
}