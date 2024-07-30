"use client"
import React, { useMemo, useRef, useState } from "react"
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
import { Cropper, ReactCropperElement } from "react-cropper"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Icons } from "./icons"
import axios from "axios"

export enum PictureTypes {
  NULL = "null",
  ICON = "icon",
  EMOJI = "emoji",
  IMAGE = "image",
}

export type ImagePictureTypes = {
  original: string | undefined
  mobile: string | undefined
  desktop: string | undefined
}

export const PicturePicker = ({
  className = "",
  picture,
  pictureType,
  maxWidthMobile,
  maxWidthDesktop,
  onChange,
}: {
  className?: string
  picture: ImagePictureTypes | string | React.ReactNode
  pictureType: PictureTypes
  maxWidthMobile: number
  maxWidthDesktop: number
  onChange: (
    picture: ImagePictureTypes | string | React.ReactNode,
    pictureType: PictureTypes
  ) => void
}) => {
  const t = useTranslations("CreateFlow")
  const imagePickerRef = useRef<HTMLInputElement>(null)
  const imageCropperRef = useRef<ReactCropperElement>(null)

  const [iconPickerDialogOpen, setIconPickerDialogOpen] = useState(false)
  const [emojiPickerPopoverOpen, setEmojiPickerPopoverOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [iconPickerSearchQuery, setIconPickerSearchQuery] = useState("")
  const [imageCropperDialogOpen, setImageCropperDialogOpen] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const [pickedImage, setPickedImage] = useState<string>("")

  const filteredIcons = useMemo(
    () =>
      Object.keys(icons).filter((iconName) =>
        iconName.toLowerCase().includes(iconPickerSearchQuery.toLowerCase())
      ),
    [iconPickerSearchQuery]
  )

  const handleIconChange = (iconName) => {
    const iconData = icons[iconName]?.body
    if (iconData) {
      onChange(iconName, PictureTypes.ICON)
    }
    setIconPickerSearchQuery("")
    setIconPickerDialogOpen(false)
  }

  const handleEmojiChange = (emoji) => {
    if (emoji.emoji) {
      onChange(emoji.emoji, PictureTypes.EMOJI)
    }
    setEmojiPickerPopoverOpen(false)
  }

  const handleImageInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (imagePickerRef.current) imagePickerRef.current.value = ""
        setPickedImage(reader.result as any)
        setImageCropperDialogOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const calculateImageDimensions = (aspectRatio, maxWidth) => {
    const height = Math.round(maxWidth / aspectRatio)
    return {
      width: maxWidth,
      height: height,
      dimension: `${maxWidth}x${height}`,
    }
  }

  const uploadToS3 = async (imageData, mobileDimension, desktopDimenstion) => {
    const formData = new FormData()
    formData.append("image", imageData)
    formData.append("file", imageData)
    formData.append("sizes[0]", mobileDimension)
    formData.append("sizes[1]", desktopDimenstion)
    formData.append("bucket_name", "convify-images")

    try {
      const response = await axios.post("/api/upload", formData)
      return {
        data: response.data,
      }
    } catch (error) {
      console.error("Error uploading image to S3:", error)
      return null
    }
  }

  const handleImageUploadOriginal = () => {
    if (pickedImage) {
      imageCropperRef.current?.cropper.setAspectRatio(NaN)
      imageCropperRef.current?.cropper.reset()
      handleImageUploadCropped()
    }
  }

  const handleImageUploadCropped = async () => {
    setIsUploadingImage(true)

    if (typeof imageCropperRef.current?.cropper !== "undefined") {
      const aspectRatio =
        imageCropperRef.current?.cropper.getImageData().width /
        imageCropperRef.current?.cropper.getImageData().height

      const mobileDimensions = calculateImageDimensions(
        aspectRatio,
        maxWidthMobile
      )
      const desktopDimenstions = calculateImageDimensions(
        aspectRatio,
        maxWidthDesktop
      )

      const resizedImageData = imageCropperRef.current?.cropper
        .getCroppedCanvas({
          width: desktopDimenstions.width,
          height: desktopDimenstions.height,
        })
        .toDataURL("image/webp")

      let uploadedImage: ImagePictureTypes = {
        original: undefined,
        mobile: undefined,
        desktop: resizedImageData,
      }

      handleImageChange({ ...uploadedImage })

      const imageData = await new Promise((resolve) => {
        imageCropperRef.current?.cropper
          .getCroppedCanvas()
          .toBlob(async (imageBlob) => {
            resolve(imageBlob)
          }, "image/wepg")
      })

      setImageCropperDialogOpen(false)
      setIsUploadingImage(false)

      const uploadImageResponse = await uploadToS3(
        imageData,
        mobileDimensions.dimension,
        desktopDimenstions.dimension
      )

      if (
        uploadImageResponse &&
        uploadImageResponse.data.data.images.original
      ) {
        uploadedImage.original = uploadImageResponse.data.data.images
          .original as string
      }

      if (
        uploadImageResponse &&
        uploadImageResponse.data.data.images[mobileDimensions.dimension]
      ) {
        uploadedImage.mobile = uploadImageResponse.data.data.images[
          mobileDimensions.dimension
        ] as string
      }

      if (
        uploadImageResponse &&
        uploadImageResponse.data.data.images[desktopDimenstions.dimension]
      ) {
        uploadedImage.desktop = uploadImageResponse.data.data.images[
          desktopDimenstions.dimension
        ] as string
      }

      handleImageChange(uploadedImage)
    }
  }

  const handleAspectRatioChange = (newAspectRatio) => {
    if (newAspectRatio === "source") {
      imageCropperRef.current?.cropper.setAspectRatio(
        imageCropperRef.current?.cropper.getImageData().width /
          imageCropperRef.current?.cropper.getImageData().height
      )
    } else if (newAspectRatio === "custom") {
      imageCropperRef.current?.cropper.setAspectRatio(NaN)
    } else {
      const [width, height] = newAspectRatio.split(":")
      imageCropperRef.current?.cropper.setAspectRatio(width / height)
    }
  }

  const handleImageChange = (newImage) => {
    onChange(newImage as string, PictureTypes.IMAGE)
  }

  const handlePictureRemove = () => {
    onChange(null, PictureTypes.NULL)
  }

  return (
    <div className={className}>
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
                  className={`border-input !size-8 border p-0 [&>:first-child]:hover:block [&>:last-child]:hover:!hidden`}
                  variant="ghost"
                >
                  <CloudUpload className="hidden size-4" />
                  {pictureType === PictureTypes.NULL &&
                    (picture as React.ReactNode)}
                  {pictureType === PictureTypes.ICON && (
                    <SvgRenderer iconName={picture as string} />
                  )}
                  {pictureType === PictureTypes.EMOJI && (
                    <span className="flex size-5 items-center justify-center text-[18px] leading-[20px]">
                      {picture as string}
                    </span>
                  )}
                  {pictureType === PictureTypes.IMAGE && (
                    <picture>
                      <source
                        media="(min-width:1080px)"
                        srcSet={(picture as ImagePictureTypes).desktop}
                      />
                      <source
                        media="(min-width:560px)"
                        srcSet={(picture as ImagePictureTypes).mobile}
                      />
                      <img
                        src={(picture as ImagePictureTypes).original}
                        className="size-5 object-contain"
                      />
                    </picture>
                  )}
                </Button>
              </div>
            </PopoverTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIconPickerDialogOpen(true)}>
                <ThumbsUp className="mr-2 size-4" />
                <span>{t("PictureChoice.icon")}</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setEmojiPickerPopoverOpen(true)}>
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

        <Dialog
          open={iconPickerDialogOpen}
          onOpenChange={setIconPickerDialogOpen}
        >
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
        </Dialog>

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
          onChange={handleImageInput}
        />

        <Dialog
          open={imageCropperDialogOpen}
          onOpenChange={setImageCropperDialogOpen}
        >
          <DialogContent className="relative z-[9999999] flex h-[calc(100vh-10%)] max-h-[calc(100vh-10%)] max-w-[95%] flex-col gap-4 p-4 sm:max-w-[70%] sm:p-8">
            <Cropper
              ref={imageCropperRef}
              style={{
                width: "100%",
                height: "calc(100% - 56px)",
              }}
              initialAspectRatio={NaN}
              guides={false}
              autoCropArea={1}
              src={pickedImage}
              minCropBoxHeight={100}
              minCropBoxWidth={100}
              background={false}
              highlight={true}
              responsive={true}
            />

            <div className="flex items-center justify-between gap-4">
              <Tabs
                defaultValue={"custom"}
                onValueChange={handleAspectRatioChange}
              >
                <TabsList className="flex">
                  <TabsTrigger value="custom">
                    {t("PictureChoice.custom")}
                  </TabsTrigger>
                  <TabsTrigger value="source">
                    {t("PictureChoice.source")}
                  </TabsTrigger>
                  <TabsTrigger value="1:1">1:1</TabsTrigger>
                  <TabsTrigger value="4:3">4:3</TabsTrigger>
                  <TabsTrigger value="16:9">16:9</TabsTrigger>
                  <TabsTrigger value="3:4">3:4</TabsTrigger>
                  <TabsTrigger value="9:16">9:16</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-2">
                <Button
                  onClick={handleImageUploadOriginal}
                  variant="secondary"
                  disabled={isUploadingImage}
                >
                  {isUploadingImage && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("PictureChoice.Upload_original")}
                </Button>
                <Button
                  onClick={handleImageUploadCropped}
                  className="bg-black text-white"
                  disabled={isUploadingImage}
                >
                  {isUploadingImage && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("PictureChoice.Upload_crop")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Popover>
    </div>
  )
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

export const SvgRenderer = ({
  iconName,
  viewBox,
  width,
  height,
}: {
  iconName: string
  viewBox?: string
  width?: string
  height?: string
}) => {
  const svgData = icons[iconName]?.body
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox ?? "-1 -1 16 16"}
      width={width ?? "20px"}
      height={height ?? "20px"}
      dangerouslySetInnerHTML={{ __html: svgData }}
    />
  )
}
