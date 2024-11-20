import React, { useCallback, useEffect } from "react"
import { DefaultImagePlaceholder } from "@/constant"
import axios from "axios"


import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import {
  MoveHorizontal,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyCenter,
} from "lucide-react"
import ImagePlaceholder from "@/assets/images/default-image.webp"
import { useTranslations } from "next-intl"
import Cropper, { ReactCropperElement } from "react-cropper"
import { throttle, debounce } from "lodash"
import { useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/custom-checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/custom-select"
import { Slider } from "@/components/custom-slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"

import { Controller } from "../settings/controller.component"
import { Icons } from "@/components/icons"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { IconButtonSizes, UserLogo } from "./user-image.component"
import { ColorInput } from "@/components/color-input"

export const Img = ({
  alt,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  background,
  Top,
  Bottom,
  Right,
  Left,
  radius,
  radiusCorner,
  align,
  maxWidth,
  width = "85%",
  height,
  src,
  imageSize,
  enableLink,
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

  const t = useTranslations("Components")
  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      className={cn(
        `relative flex flex-row justify-${align} w-full border border-transparent`
      )}
    >
      {isHovered && <Controller nameOfComponent={t("Image")} />}
      {
        /* eslint-disable-next-line @next/next/no-img-element */
        <UserLogo
          alt={alt}
          maxWidth={maxWidth}
          marginTop={Top}
          Top={Top}
          Bottom={Bottom}
          Left={Left}
          Right={Right}
          marginBottom={Bottom}
          marginLeft={Left}
          marginRight={Right}
          background={background}
          radiusCorner={radiusCorner}
          radius={radius}
          align={align}
          width={width}
          height={height}
          src={src}
          {...props}
        />
      }
    </div>
  )
}

export const ImageSettings = () => {
  const t = useTranslations("Components")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const [cropData, setCropData] = React.useState(DefaultPropsImg.src)
  const [activeAspectRatioBtn, setActiveAspectRatioBtn] =
    React.useState<string>("source")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [showDialog, setShowDialog] = React.useState<boolean>(false)
  const [image, setImage] = React.useState<string>(DefaultPropsImg.src)
  const [imageFile, setImageFile] = React.useState<File>()
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)

  const {
    actions: { setProp },
    props: {
      windowTarget,
      enableLink,
      size,
      imageSize,
      src,
      containerBackground,
      url,
      icon,
      radius,
      radiusCorner,
      alt,
      Top,
      Bottom,
      Left,
      Right,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      width,
      height,
      settingsTab,
      align,
      picSize,
      uploadedImageUrl,
      uploadedImageMobileUrl,
      maxWidth,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const crop = !/.*(svg|gif).*/i.test(file.type)
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as any)
        if (!crop) {
          handleUpload(reader.result, file)

        }
      }
      reader.readAsDataURL(file)
      if (crop) {
        setShowDialog(true)
      }
    }
  }

  const getAspectRatio = (imageSrc) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const width = img.naturalWidth
        const height = img.naturalHeight
        const aspectRatio = width / height
        resolve(aspectRatio)
      }
      img.onerror = (error) => {
        reject(error)
      }
      img.src = imageSrc
    })
  }

  const calculateImageDimensions = (aspectRatio, maxWidth) => {
    const height = maxWidth / aspectRatio
    return {
      width: maxWidth,
      height: Math.round(height),
    }
  }

  const uploadToS3 = async (imageData, aspectRatio) => {
    const maxWidthMobile = 500
    const maxWidthDesktop = 1000
    const mobileDimensions = calculateImageDimensions(
      aspectRatio,
      maxWidthMobile
    )
    const desktopDimenstions = calculateImageDimensions(
      aspectRatio,
      maxWidthDesktop
    )

    const formData = new FormData()
    formData.append("image", imageData)
    formData.append("file", imageData)
    formData.append(
      "sizes[0]",
      `${mobileDimensions.width}x${mobileDimensions.height}`
    )
    formData.append(
      "sizes[1]",
      `${desktopDimenstions.width}x${desktopDimenstions.height}`
    )
    formData.append("bucket_name", "convify-images")

    try {
      const response = await axios.post("/api/upload", formData)
      return {
        data: response.data,
        mobileSize: `${mobileDimensions.width}x${mobileDimensions.height}`,
        desktopSize: `${desktopDimenstions.width}x${desktopDimenstions.height}`,
      }
    } catch (error) {
      console.error("Error uploading image to S3:", error)
      return null
    }
  }

  const handleUploadOriginal = () => handleUpload(image, imageFile);
  const handleUpload = async (image, imageFile) => {
    if (image && imageFile) {
      setProp((props) => (props.src = image))
      setShowDialog(false)
      setIsLoading(true)
      const aspectRatio = await getAspectRatio(URL.createObjectURL(imageFile))
      const uploadedImage = await uploadToS3(imageFile, aspectRatio)
      if (uploadedImage) {
        if (/.*(svg|gif).*/i.test(uploadedImage.data.data.file.type)) {
          setProp((props) => {
            props.src = uploadedImage.data.data.images.original
            props.uploadedImageUrl =
              uploadedImage.data.data.images.original
          }, 1000)
        }
        else {
          if (uploadedImage.data.data.images[uploadedImage.desktopSize]) {
            setProp((props) => {
              props.src = uploadedImage.data.data.images[uploadedImage.desktopSize]
              props.uploadedImageUrl =
                uploadedImage.data.data.images[uploadedImage.desktopSize]
            }, 1000)
          }
          if (uploadedImage.data.data.images[uploadedImage.mobileSize]) {
            setProp((props) => {
              props.uploadedImageMobileUrl =
                uploadedImage.data.data.images[uploadedImage.mobileSize]
            }, 1000)
          }
        }
      }
      setIsLoading(false)
    }
  }
  console.log("src is: ", src)

  const cropperRef = React.useRef<ReactCropperElement>(null)

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper
  }

  const base64ToBlob = (
    base64: string,
    contentType: string = "",
    sliceSize: number = 512
  ): Blob => {
    const byteCharacters = atob(base64.split(",")[1])
    const byteArrays: Uint8Array[] = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)
      const byteNumbers = new Array(slice.length)

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    return new Blob(byteArrays, { type: contentType })
  }

  const getCropData = async () => {
    setIsLoading(true)
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL())
      setProp(
        (props) =>
        (props.src = cropperRef.current?.cropper
          .getCroppedCanvas()
          .toDataURL()),
        1000
      )
      setProp((props) => (props.width = "100%"), 1000)
      setProp((props) => (props.height = "auto"), 1000)
      setShowDialog(false)
      setActiveAspectRatioBtn("source")
      setProp(
        (props) =>
        (props.src = cropperRef.current?.cropper
          .getCroppedCanvas()
          .toDataURL()),
        1000
      )
      const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas()
      const imageData = croppedCanvas.toDataURL("image/jpeg")
      const blob = base64ToBlob(imageData, "image/jpeg")
      const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" })
      const aspectRatio = croppedCanvas.width / croppedCanvas.height
      const uploadedImage = await uploadToS3(file, aspectRatio)
      if (
        uploadedImage &&
        uploadedImage.data.data.images[uploadedImage.desktopSize]
      ) {
        setProp((props) => {
          props.src = uploadedImage.data.data.images[uploadedImage.desktopSize]
          props.uploadedImageUrl =
            uploadedImage.data.data.images[uploadedImage.desktopSize]
        }, 1000)
      }
      if (
        uploadedImage &&
        uploadedImage.data.data.images[uploadedImage.mobileSize]
      ) {
        setProp((props) => {
          props.uploadedImageMobileUrl =
            uploadedImage.data.data.images[uploadedImage.mobileSize]
        }, 1000)
      }
      setIsLoading(false)
    }
  }

  const aspectRatioSource = () => {
    cropperRef.current?.cropper.setAspectRatio(
      cropperRef.current?.cropper.getImageData().width /
      cropperRef.current?.cropper.getImageData().height
    )
    setActiveAspectRatioBtn("source")
  }
  const aspectRatioSquare = () => {
    cropperRef.current?.cropper.setAspectRatio(1)
    setActiveAspectRatioBtn("square")
  }
  const aspectRatioPortrait = () => {
    cropperRef.current?.cropper.setAspectRatio(1.3333)
    setActiveAspectRatioBtn("portrait")
  }
  const aspectRatioLandscape = () => {
    cropperRef.current?.cropper.setAspectRatio(1.7777)
    setActiveAspectRatioBtn("landscape")
  }
  const aspectRatioPortraitO = () => {
    cropperRef.current?.cropper.setAspectRatio(0.75)
    setActiveAspectRatioBtn("portraito")
  }
  const aspectRatioLandscape0 = () => {
    cropperRef.current?.cropper.setAspectRatio(0.5625)
    setActiveAspectRatioBtn("landscapeo")
  }

  const themeBackgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )

  const maxWidthPx = 800
  const minWidthPx = 250
  const imageSizePercentage = (((imageSize - minWidthPx) * 100) / (maxWidthPx - minWidthPx))

  return (
    <>
      <Card className="mb-2 mt-4 p-2">
        <CardHeader className="p-2">
          <CardTitle>{t("Image")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-2">
          <span className="text-muted-foreground">{t("Upload image")}</span>
          <Input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleInputChange}
          />
          <div
            onClick={() => (inputRef.current as HTMLInputElement)?.click()}
            className="group relative flex w-full flex-row justify-center hover:cursor-pointer"
          >
            <div className="absolute flex h-full w-full flex-col items-center justify-center bg-transparent opacity-0 transition-opacity duration-200 ease-in group-hover:bg-white/[0.85] group-hover:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-image-up"
              >
                <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" />
                <path d="m14 19.5 3-3 3 3" />
                <path d="M17 22v-5.5" />
                <circle cx="9" cy="9" r="2" />
              </svg>
              <span className="mt-1 text-sm font-semibold text-black">
                {t("Upload")}
              </span>
            </div>
            <img src={src} alt={alt} className="w-30" />
          </div>
        </CardContent>
      </Card>
      <Accordion
        value={settingsTab || "content"}
        onValueChange={(value) => {
          setProp((props) => (props.settingsTab = value), 200)
        }}
        type="multiple"
        defaultValue={["content"]}
        className="w-full mb-10"
      >
        <AccordionItem value="item-2">
          <AccordionTrigger>{t("General")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="alt-label">{t("Alt label")}</Label>
              <Input
                id="alt-label"
                value={alt}
                placeholder={alt}
                type="text"
                onChange={(e) => {
                  setProp((props) => (props.alt = e.target.value), 1000)
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={enableLink}
                onCheckedChange={(e) => {
                  // setProp((props) => (props.enableIcon = e), 1000)
                  handlePropChange("enableLink", e)
                }}
                id="enableLink"
              />
              <label
                htmlFor="enableLink"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                onClick={(e) => {
                  handlePropChange("enableLink", !enableLink)
                }}
              >
                {t("Enable Link")}
              </label>
            </div>
            {enableLink && (
              <>
                <div className="style-control col-span-2 flex flex-col">
                  <p className="text-sm text-muted-foreground">
                    {t("Add URL")}
                  </p>
                  <Input
                    id="text-url"
                    type="text"
                    value={url}
                    placeholder={"URL"}
                    onChange={(e) => {
                      setProp((props) => (props.url = e.target.value), 1000)
                    }}
                  />
                </div>
                <div className="style-control col-span-2 flex flex-col">
                  <p className="text-md flex-1 text-muted-foreground">
                    {t("Open in")}
                  </p>
                  <Select
                    defaultValue={"arrowright"}
                    onValueChange={(e) => {
                      setProp((props) => (props.icon = e), 1000)
                    }}
                  >
                    <SelectTrigger className="h-8.5 w-full bg-[#FAFAFA] text-xs">
                      <SelectValue placeholder="Select Link" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="new-window">
                          <p>{t("New Window")}</p>
                        </SelectItem>
                        <SelectItem value="same-window">
                          <p>{t("Same Window")}</p>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="design">
          <AccordionTrigger>{t("Design")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="backgroundcolor">{t("Background Color")}</Label>
              <ColorInput
                id="background-color"
                value={containerBackground}
                handleChange={(e) => {
                  debouncedSetProp("containerBackground", e.target.value)
                }}
                handleRemove={() =>
                  debouncedSetProp("containerBackground", "transparent")
                }
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="corner-radius">{t("Corner Radius")}</Label>
                <span className="text-muted-foreground text-xs">
                  {radiusCorner}
                </span>
              </div>
              <Slider
                defaultValue={[radiusCorner]}
                value={[radiusCorner]}
                max={200}
                min={0}
                step={1}
                onValueChange={(e) =>
                  handlePropChangeDebounced("radiusCorner", e)
                }
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="size">{t("Size")}</Label>
                <span className="text-muted-foreground text-xs">
                  {imageSizePercentage.toFixed(0)}
                </span>
              </div>
              <Slider
                defaultValue={[imageSizePercentage]}
                value={[imageSizePercentage]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) => {
                  if(picSize !== 'full'){
                    const newWidthPercentage = e[0]
                  const maxMinGap = maxWidthPx - minWidthPx
                  const newWidthPx = (newWidthPercentage / 100) * maxMinGap + minWidthPx
                  const aspectRatio = parseInt(height, 10) / parseInt(width, 10)
                  const newHeightPx = newWidthPx * aspectRatio

                  // Logging to see the calculated values
                  console.log("New width percentage:", newWidthPercentage)
                  console.log("Max width in px:", maxWidthPx)
                  console.log("New width in px:", newWidthPx)
                  console.log("Aspect ratio:", aspectRatio)
                  console.log("New height in px:", newHeightPx)

                  handlePropChangeDebounced("imageSize", newWidthPx)

                  setProp((props) => {
                    props.width = `${newWidthPx}px`
                    // props.height = `${newHeightPx}px`;
                    props.imageSize = newWidthPx
                  }, 1000)
                  }
                  
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Align")}</Label>
              <Tabs
                value={align}
                defaultValue={align}
                onValueChange={(value) => {
                  setProp((props) => (props.align = value), 1000)
                }}
              >
                <TabsList className="grid w-full grid-cols-3 bg-[#EEEEEE]">
                  <TabsTrigger className="rounded" value="start">
                    <AlignHorizontalJustifyStart size={16} />
                  </TabsTrigger>
                  <TabsTrigger className="rounded" value="center">
                    <AlignHorizontalJustifyCenter size={16} />
                  </TabsTrigger>
                  <TabsTrigger className="rounded" value="end">
                    <AlignHorizontalJustifyEnd size={16} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="spacing">
          <AccordionTrigger>{t("Spacing")}</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2">
            <div className="space-y-2">
              <Label>{t("Width")}</Label>
              <Tabs
                value={picSize}
                defaultValue={picSize}
                onValueChange={(value) => {
                  setProp((props) => (props.picSize = value), 1000)
                  const sizeMap = {
                    small: "400px",
                    medium: "800px",
                    large: "850px",
                    full: "870px",
                  }
                  setProp((props) => (props.maxWidth = sizeMap[value]), 1000)
                }}
              >
                <TabsList className="grid w-full grid-cols-4 bg-[#EEEEEE]">
                  <TabsTrigger
                    className="rounded text-base leading-4"
                    value="small"
                  >
                    {t("S")}
                  </TabsTrigger>
                  <TabsTrigger
                    className="rounded text-base leading-4"
                    value="medium"
                  >
                    {t("M")}
                  </TabsTrigger>
                  <TabsTrigger
                    className="rounded text-base leading-4"
                    value="large"
                  >
                    {t("L")}
                  </TabsTrigger>
                  <TabsTrigger
                    className="rounded text-base leading-4"
                    value="full"
                  >
                    <MoveHorizontal size={16} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marginTop">{t("Top")}</Label>
                  <span className="text-muted-foreground text-xs">{Top}</span>
                </div>
                <Slider
                  className=""
                  defaultValue={[Top]}
                  value={[Top]}
                  max={100}
                  min={0}
                  step={1}
                  onValueChange={(e) => handlePropChangeDebounced("Top", e)}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marginBottom">{t("Bottom")}</Label>
                  <span className="text-muted-foreground text-xs">
                    {Bottom}
                  </span>
                </div>
                <Slider
                  defaultValue={[Bottom]}
                  value={[Bottom]}
                  max={100}
                  min={0}
                  step={1}
                  onValueChange={(e) => handlePropChangeDebounced("Bottom", e)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marginRight">{t("Right")}</Label>
                  <span className="text-muted-foreground text-xs">{Right}</span>
                </div>
                <Slider
                  defaultValue={[Right]}
                  value={[Right]}
                  max={100}
                  min={0}
                  step={1}
                  onValueChange={(e) => handlePropChangeDebounced("Right", e)}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marginLeft">{t("Left")}</Label>
                  <span className="text-muted-foreground text-xs">{Left}</span>
                </div>
                <Slider
                  defaultValue={[Left]}
                  value={[Left]}
                  max={100}
                  min={0}
                  step={1}
                  onValueChange={(e) => handlePropChangeDebounced("Left", e)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className="relative z-[9999999] flex h-[calc(100vh-10%)] max-h-[calc(100vh-10%)] max-w-[95%] flex-col gap-4 p-4 sm:max-w-[70%] sm:p-8"
          ref={dialogRef}
        >
          <Cropper
            ref={cropperRef}
            style={{
              width: "100%",
              height: "calc(100% - 56px)",
            }}
            initialAspectRatio={NaN}
            guides={false}
            crop={onCrop}
            autoCropArea={1}
            src={image}
            minCropBoxHeight={100}
            minCropBoxWidth={100}
            background={false}
            highlight={true}
            responsive={true}
          />
          <div className="flex items-center justify-between gap-4">
            <div className="bg-secondary flex gap-0 rounded-lg p-1">
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${activeAspectRatioBtn === "source"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                  }`}
                onClick={aspectRatioSource}
              >
                {t("Source")}
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${activeAspectRatioBtn === "square"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                  }`}
                onClick={aspectRatioSquare}
              >
                1:1
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${activeAspectRatioBtn === "portrait"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                  }`}
                onClick={aspectRatioPortrait}
              >
                4:3
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${activeAspectRatioBtn === "landscape"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                  }`}
                onClick={aspectRatioLandscape}
              >
                16:9
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${activeAspectRatioBtn === "portraito"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                  }`}
                onClick={aspectRatioPortraitO}
              >
                3:4
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${activeAspectRatioBtn === "landscapeo"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                  }`}
                onClick={aspectRatioLandscape0}
              >
                9:16
              </Button>
            </div>
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
                onClick={getCropData}
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
    </>
  )
}

export const DefaultPropsImg = {
  alt: "Image",
  radiusCorner: 15,
  size: "medium",
  // picSize: IconButtonSizes.medium,

  marginTop: "20px",
  marginBottom: "20px",
  marginLeft: "20px",
  marginRight: "20px",
  Top: "0px",
  Bottom: "0px",
  Left: "0px",
  Right: "0px",
  background: "inherit",
  radius: "none",
  align: "center",
  width: "100%",
  height: "auto",

  enableLink: false,
  imageSize: 376,
  uploadedImageUrl: "",
  uploadedImageMobileUrl: "",
  src: DefaultImagePlaceholder,
}

Img.craft = {
  props: DefaultPropsImg,
  related: {
    settings: ImageSettings,
  },
}
