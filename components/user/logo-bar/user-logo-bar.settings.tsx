import React, { useCallback, useRef, useState } from "react"
import {
  MoveHorizontal,
  GripVertical,
  Trash2,
  Plus,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalSpaceBetween,
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
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import hexoid from "hexoid"
import { LogoBarAlignments, LogoBarGen } from "./user-logo-bar.component"
import useLogoBarThemePresets from "./useLogoBarThemePresets"
import { Checkbox } from "@/components/custom-checkbox"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Cropper, ReactCropperElement } from "react-cropper"
import { Icons } from "@/components/icons"
import axios from "axios"
import { ImagePictureTypes } from "@/components/PicturePicker"

export const LogoBarSettings = () => {
  const t = useTranslations("Components")

  const {
    actions: { setProp },
    props: {
      size,
      grayscale,
      containerBackground,
      align,
      height,
      gap,
      alignMobile,
      mobileRowItems,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      fullWidth,
      settingTabs,
      items,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const { defaultPreset, defaultLogo } = useLogoBarThemePresets()

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
                <LogoBarItemSettings
                  key={`logo-bar-item-${item.id}`}
                  item={item}
                  index={index}
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
                    id: `logo-bar-item-${hexoid(6)()}`,
                    src: { original: defaultLogo } as ImagePictureTypes,
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
              <Checkbox
                className="border-input ring-offset-background focus-visible:ring-ring data-[state=checked]:border-primary peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                checked={grayscale}
                onCheckedChange={(e) => {
                  handlePropChange("grayscale", e)
                }}
                id="grayscale"
              />
              <label
                htmlFor="grayscale"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Grayscale")}
              </label>
            </div>

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

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <p className="text-md text-muted-foreground">{t("Align")}</p>
              <Tabs
                value={align}
                defaultValue={align}
                onValueChange={(value) => {
                  setProp((props) => (props.align = value), 1000)
                }}
                className="flex-1"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value={LogoBarAlignments.start}>
                    <AlignHorizontalJustifyStart />
                  </TabsTrigger>
                  <TabsTrigger value={LogoBarAlignments.center}>
                    <AlignHorizontalJustifyCenter />
                  </TabsTrigger>
                  <TabsTrigger value={LogoBarAlignments.end}>
                    <AlignHorizontalJustifyEnd />
                  </TabsTrigger>
                  <TabsTrigger value={LogoBarAlignments.spaceBetween}>
                    <AlignHorizontalSpaceBetween />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="height">{t("Height")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {height}
                </span>
              </div>
              <Slider
                defaultValue={[height]}
                value={[height]}
                max={200}
                min={0}
                step={1}
                onValueChange={(e) => handlePropChangeDebounced("height", e)}
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="gap">{t("Gap")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {gap}
                </span>
              </div>
              <Slider
                defaultValue={[gap]}
                value={[gap]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) => handlePropChangeDebounced("gap", e)}
              />
            </div>

            <div className="col-span-2 flex flex-row items-center space-x-2">
              <Checkbox
                className="border-input ring-offset-background focus-visible:ring-ring data-[state=checked]:border-primary peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                checked={alignMobile}
                onCheckedChange={(e) => {
                  handlePropChange("alignMobile", e)
                }}
                id="alignMobile"
              />
              <label
                htmlFor="alignMobile"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Align on mobile")}
              </label>
            </div>

            {alignMobile && (
              <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
                <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                  <Label htmlFor="mobileRowItems">{t("Items per row")}</Label>
                  <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                    {mobileRowItems}
                  </span>
                </div>
                <Slider
                  defaultValue={[mobileRowItems]}
                  value={[mobileRowItems]}
                  max={6}
                  min={1}
                  step={1}
                  onValueChange={(e) =>
                    handlePropChangeDebounced("mobileRowItems", e)
                  }
                />
              </div>
            )}
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
                <Label htmlFor="marginTop">{t("Top")}</Label>
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
                <Label htmlFor="marginTop">{t("Bottom")}</Label>
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
                <Label htmlFor="marginTop">{t("Right")}</Label>
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
                <Label htmlFor="marginTop">{t("Left")}</Label>
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
      </Accordion>
    </>
  )
}

export const LogoBarItemSettings = ({ item, index }) => {
  const t = useTranslations("Components")
  const y = useMotionValue(0)
  const controls = useDragControls()

  const inputRef = useRef<HTMLInputElement>(null)
  const cropperRef = useRef<ReactCropperElement>(null)
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false)
  const [image, setImage] = useState<string>(item.src)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    actions: { setProp },
    props: { items },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const handleItemDelete = () => {
    setProp((props) => (props.items = items.filter((_, i) => i !== index)), 200)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (inputRef.current) inputRef.current.value = ""
        setImage(reader.result as any)
        setDialogOpen(true)
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

  const handleUploadOriginal = () => {
    if (image) {
      cropperRef.current?.cropper.setAspectRatio(NaN)
      cropperRef.current?.cropper.reset()
      handleUploadCropped()
    }
  }

  const handleUploadCropped = async () => {
    setIsLoading(true)

    if (typeof cropperRef.current?.cropper !== "undefined") {
      const maxWidthMobile = 400
      const maxWidthDesktop = 400

      const aspectRatio =
        cropperRef.current?.cropper.getImageData().width /
        cropperRef.current?.cropper.getImageData().height

      const mobileDimensions = calculateImageDimensions(
        aspectRatio,
        maxWidthMobile
      )
      const desktopDimenstions = calculateImageDimensions(
        aspectRatio,
        maxWidthDesktop
      )

      const resizedImageData = cropperRef.current?.cropper
        .getCroppedCanvas({
          width: desktopDimenstions.width,
          height: desktopDimenstions.height,
        })
        .toDataURL("image/webp")

      let uploadedImage: ImagePictureTypes = {
        original: resizedImageData,
        mobile: undefined,
        desktop: undefined,
      }

      handleLogoChange({ ...uploadedImage })

      const imageData = await new Promise((resolve) => {
        cropperRef.current?.cropper
          .getCroppedCanvas()
          .toBlob(async (imageBlob) => {
            resolve(imageBlob)
          }, "image/wepg")
      })

      setDialogOpen(false)
      setIsLoading(false)

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

      handleLogoChange(uploadedImage)
    }
  }

  const handleAspectRatioChange = (newAspectRatio) => {
    if (newAspectRatio === "source") {
      cropperRef.current?.cropper.setAspectRatio(
        cropperRef.current?.cropper.getImageData().width /
          cropperRef.current?.cropper.getImageData().height
      )
    } else if (newAspectRatio === "custom") {
      cropperRef.current?.cropper.setAspectRatio(NaN)
    } else {
      const [width, height] = newAspectRatio.split(":")
      cropperRef.current?.cropper.setAspectRatio(width / height)
    }
  }

  const handleLogoChange = (newLogo) => {
    setProp((props) => ((props.items[index].src = newLogo), 200))
  }

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={item}
      transition={{ duration: 0 }}
      id={`logo-bar-item-${item.id}`}
      style={{ y }}
      className="flex w-full select-none items-center gap-2 [&>div>svg]:hover:visible [&>svg]:hover:visible"
    >
      <input
        className="hidden"
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
      />
      <Button
        variant="outline"
        className="flex-1"
        onClick={() => inputRef.current?.click()}
      >
        <picture key={(item.src as ImagePictureTypes).desktop}>
          <source
            media="(min-width:560px)"
            srcSet={(item.src as ImagePictureTypes).mobile}
          />
          <img
            src={(item.src as ImagePictureTypes).desktop}
            className="h-6 w-full object-contain"
            loading="lazy"
          />
        </picture>
      </Button>
      <Trash2
        className="text-muted-foreground invisible size-3 hover:cursor-pointer"
        onClick={handleItemDelete}
      />
      <div
        onPointerDown={(e) => controls.start(e)}
        className="reorder-handle invisible hover:cursor-move"
      >
        <GripVertical className="text-muted-foreground size-4" />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="relative z-[9999999] flex h-[calc(100vh-10%)] max-h-[calc(100vh-10%)] max-w-[95%] flex-col gap-4 p-4 sm:max-w-[70%] sm:p-8">
          <Cropper
            ref={cropperRef}
            style={{
              width: "100%",
              height: "calc(100% - 56px)",
            }}
            initialAspectRatio={NaN}
            guides={false}
            autoCropArea={1}
            src={image}
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
                <TabsTrigger value="custom">{t("Custom")}</TabsTrigger>
                <TabsTrigger value="source">{t("Source")}</TabsTrigger>
                <TabsTrigger value="1:1">1:1</TabsTrigger>
                <TabsTrigger value="4:3">4:3</TabsTrigger>
                <TabsTrigger value="16:9">16:9</TabsTrigger>
                <TabsTrigger value="3:4">3:4</TabsTrigger>
                <TabsTrigger value="9:16">9:16</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button
                onClick={handleUploadOriginal}
                variant="secondary"
                disabled={isLoading}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("Upload original")}
              </Button>
              <Button
                onClick={handleUploadCropped}
                className="bg-black text-white"
                disabled={isLoading}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("Upload crop")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Reorder.Item>
  )
}
