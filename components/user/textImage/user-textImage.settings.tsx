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
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
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
import { Dialog, DialogContent } from "@/components/ui/dialog"
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
import { IconButtonSizes, UserLogo } from "./user-textImage.component"
import { ColorInput } from "@/components/color-input"

export const Img = ({
  fontFamily,
  color,
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
  align,
  width = "90%",
  height,
  src,
  position,
  imageSize,
  split,
  size,
  text,
  Text,
  title,
  disabled,
  enableLink,
  cornerRadius,
  bothAlign,
  horizontalGap,
  verticalGap,
  titleFontSize,
  textFontSize,
  titleFontWeight,
  textFontWeight,
  secondaryFontFamily,
  textColor,
  secTextColor,
  showTitle,
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
      {isHovered && <Controller nameOfComponent={t("Text & Image")} />}
      {
        /* eslint-disable-next-line @next/next/no-img-element */
        <UserLogo
          secTextColor={secTextColor}
          fontFamily={fontFamily}
          color={color}
          setProp={setProp}
          size={size}
          Text={Text}
          title={title}
          disabled={disabled}
          alt={alt}
          horizontalGap={horizontalGap}
          secondaryFontFamily={secondaryFontFamily}
          titleFontSize={titleFontSize}
          textFontSize={textFontSize}
          titleFontWeight={titleFontWeight}
          textFontWeight={textFontWeight}
          cornerRadius={cornerRadius}
          verticalGap={verticalGap}
          bothAlign={bothAlign}
          marginTop={Top}
          Top={Top}
          position={position}
          Bottom={Bottom}
          Left={Left}
          Right={Right}
          marginBottom={Bottom}
          marginLeft={Left}
          split={split}
          marginRight={Right}
          background={background}
          radius={radius}
          align={align}
          width={width}
          height={height}
          src={src}
          textColor={textColor}
          showTitle={showTitle}
          {...props}
        />
      }
    </div>
  )
}

export const TextImageSettings = () => {
  const t = useTranslations("Components")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const [cropData, setCropData] = React.useState(DefaultPropsTextImg.src)
  const [activeAspectRatioBtn, setActiveAspectRatioBtn] =
    React.useState<string>("source")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [showDialog, setShowDialog] = React.useState<boolean>(false)
  const [image, setImage] = React.useState<string>(DefaultPropsTextImg.src)
  const [imageFile, setImageFile] = React.useState<File>()
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)

  const {
    actions: { setProp },
    props: {
      textColor,
      secTextColor,
      enableLink,
      size,
      imageSize,
      src,
      containerBackground,
      url,
      icon,
      radius,
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
      uploadedImageUrl,
      uploadedImageMobileUrl,
      position,
      split,
      showTitle,
      bothAlign,
      horizontalGap,
      verticalGap,
      cornerRadius,
      titleFontSize,
      textFontSize,
      titleFontWeight,
      textFontWeight,
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
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as any)
      }
      reader.readAsDataURL(file)
      setShowDialog(true)
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

  const handleUploadOriginal = async () => {
    if (image && imageFile) {
      setProp((props) => (props.src = image))
      setShowDialog(false)
      setIsLoading(true)
      const aspectRatio = await getAspectRatio(URL.createObjectURL(imageFile))
      const uploadedImage = await uploadToS3(imageFile, aspectRatio)
      if (uploadedImage && uploadedImage.data.data.images.original) {
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
      setProp((props) => (props.width = "85%"), 1000)
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
      if (uploadedImage && uploadedImage.data.data.images.original) {
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
        className="w-full"
      >
        <AccordionItem value="content">
          <AccordionTrigger>{t("General")}</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                  checked={showTitle}
                  onCheckedChange={(checked) => {
                    setProp((props) => (props.showTitle = checked), 200)
                  }}
                  id="label"
              />
              <label
                  htmlFor="label"
                  className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                  {t("Show Title")}
              </label>
            </div>
            <div className="space-y-2">
              <Label>{t("Image Position")}</Label>
              <Tabs
                value={position}
                defaultValue={position}
                onValueChange={(value) => {
                  setProp((props) => (props.position = value), 1000)
                }}
              >
                <TabsList className="grid grid-cols-2 bg-[#EEEEEE]">
                  <TabsTrigger
                    className="rounded text-base leading-4"
                    value="left"
                  >
                    {t("Left")}
                  </TabsTrigger>
                  <TabsTrigger
                    className="rounded text-base leading-4"
                    value="right"
                  >
                    {t("Right")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="text-image-split">
                  {t("Text Image Split")}
                </Label>
                <span className="text-muted-foreground text-xs">
                  {split}:{12 - split}
                </span>
              </div>
              <Slider
                defaultValue={[split]}
                value={[split]}
                max={11}
                min={1}
                step={1}
                onValueChange={(e) => handlePropChangeDebounced("split", e)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="both-align">{t("Both Align")}</Label>
              <Tabs
                value={bothAlign}
                defaultValue={bothAlign}
                onValueChange={(value) => {
                  setProp((props) => (props.bothAlign = value), 1000)
                }}
              >
                <TabsList className="grid grid-cols-3 bg-[#EEEEEE]">
                  <TabsTrigger
                    className="rounded text-base leading-4"
                    value="start"
                  >
                    <AlignStartHorizontal size={16} />
                  </TabsTrigger>
                  <TabsTrigger
                    className="rounded text-base leading-4"
                    value="center"
                  >
                    <AlignCenterHorizontal size={16} />
                  </TabsTrigger>
                  <TabsTrigger
                    className="rounded text-base leading-4"
                    value="end"
                  >
                    <AlignEndHorizontal size={16} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="horizontal-gap">{t("Horizontal Gap")}</Label>
                <span className="text-muted-foreground text-xs">
                  {horizontalGap}
                </span>
              </div>
              <Slider
                defaultValue={[horizontalGap]}
                value={[horizontalGap]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) =>
                  handlePropChangeDebounced("horizontalGap", e)
                }
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="vertical-gap">{t("Vertical Gap")}</Label>
                <span className="text-muted-foreground text-xs">
                  {verticalGap}
                </span>
              </div>
              <Slider
                defaultValue={[verticalGap]}
                value={[verticalGap]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) =>
                  handlePropChangeDebounced("verticalGap", e)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Alt label")}</Label>
              <Input
                id="alt-label"
                value={alt}
                placeholder={alt}
                onChange={(e) => {
                  setProp((props) => (props.alt = e.target.value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="design">
          <AccordionTrigger>{t("Design")}</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <Label>{t("Background Color")}</Label>
              <ColorInput
                value={containerBackground}
                handleChange={(e) => {
                  debouncedSetProp("containerBackground", e.target.value)
                }}
                handleRemove={() =>
                  debouncedSetProp("containerBackground", "transparent")
                }
                id="backgroundcolor"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="textColor">{t("Title Color")}</Label>
              <ColorInput
                id="textColor"
                value={textColor === "#ffffff" ? null : textColor}
                handleChange={(e) => {
                  handlePropChange("textColor", e.target.value)
                }}
                handleRemove={() => handlePropChange("textColor", "#ffffff")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="secTextColor">{t("Subtitle Color")}</Label>
              <ColorInput
                id="secTextColor"
                value={secTextColor === "#ffffff" ? null : secTextColor}
                handleChange={(e) => {
                  handlePropChange("secTextColor", e.target.value)
                }}
                handleRemove={() => handlePropChange("secTextColor", "#ffffff")}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="corner-radius">{t("Corner Radius")}</Label>
                <span className="text-muted-foreground text-xs">
                  {cornerRadius}
                </span>
              </div>
              <Slider
                defaultValue={[cornerRadius]}
                value={[cornerRadius]}
                max={200}
                min={0}
                step={1}
                onValueChange={(e) =>
                  handlePropChangeDebounced("cornerRadius", e)
                }
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="title-font-size">{t("Title Font Size")}</Label>
                <span className="text-muted-foreground text-xs">
                  {titleFontSize}
                </span>
              </div>
              <Slider
                defaultValue={[titleFontSize]}
                value={[titleFontSize]}
                max={100}
                min={1}
                step={1}
                onValueChange={(e) =>
                  handlePropChangeDebounced("titleFontSize", e)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Title Font Weight")}</Label>
              <Select
                defaultValue={titleFontWeight}
                onValueChange={(e) => {
                  setProp((props) => (props.titleFontWeight = e), 1000)
                }}
              >
                <SelectTrigger className="h-8.5 w-full bg-[#FAFAFA] text-xs font-bold">
                  <SelectValue placeholder="Select Font Weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="text-xs" value="thin">
                      <p>Thin</p>
                    </SelectItem>
                    <SelectItem className="text-xs" value="normal">
                      <p>Normal</p>
                    </SelectItem>
                    <SelectItem className="text-xs" value="medium">
                      <p>Medium</p>
                    </SelectItem>
                    <SelectItem className="text-xs" value="semibold">
                      <p>Semi Bold</p>
                    </SelectItem>
                    <SelectItem className="text-xs" value="bold">
                      <p>Bold</p>
                    </SelectItem>
                    <SelectItem className="text-xs" value="extrabold">
                      <p>Extra Bold</p>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="text-font-size">{t("Text Font Size")}</Label>
                <span className="text-muted-foreground text-xs">
                  {textFontSize}
                </span>
              </div>
              <Slider
                defaultValue={[textFontSize]}
                value={[textFontSize]}
                max={100}
                min={1}
                step={1}
                onValueChange={(e) =>
                  handlePropChangeDebounced("textFontSize", e)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Text Font Weight")}</Label>
              <Select
                defaultValue={textFontWeight}
                onValueChange={(e) => {
                  setProp((props) => (props.textFontWeight = e), 1000)
                }}
              >
                <SelectTrigger className="h-8.5 w-full bg-[#FAFAFA] text-xs">
                  <SelectValue placeholder="Select Font Weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="text-xs" value="thin">
                      <p>Thin</p>
                    </SelectItem>
                    <SelectItem className="text-xs" value="normal">
                      <p>Normal</p>
                    </SelectItem>
                    <SelectItem className="text-xs" value="medium">
                      <p>Medium</p>
                    </SelectItem>
                    <SelectItem className="text-xs" value="semibold">
                      <p>Semi Bold</p>
                    </SelectItem>
                    <SelectItem className="text-xs" value="bold">
                      <p>Bold</p>
                    </SelectItem>
                    <SelectItem className="text-xs" value="extrabold">
                      <p>Extra Bold</p>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="spacing">
          <AccordionTrigger>{t("Spacing")}</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2">
            <div className="space-y-2">
              <Label>{t("Width")}</Label>
              <Tabs
                value={size}
                // defaultValue={size}
                onValueChange={(value) => {
                  setProp((props) => (props.size = value), 1000)
                  const sizeMap = {
                    small: "80%",
                    medium: "90%",
                    large: "95%",
                    full: "100%",
                  }
                  setProp((props) => (props.width = sizeMap[value]), 1000)
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

export const DefaultPropsTextImg = {
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  secondaryFontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  color: {
    value: "#ffffff",
    globalStyled: false,
    isCustomized: false,
  },
  alt: "Image",
  marginTop: "20px",
  marginBottom: "20px",
  marginLeft: "20px",
  marginRight: "20px",
  Top: "20px",
  Bottom: "20px",
  Left: "20px",
  Right: "20px",
  background: "inherit",
  radius: "none",
  align: "center",
  width: "90%",
  height: "auto",
  enableLink: false,
  split: 6,
  showTitle: false,
  imageSize: 100,
  size: "",
  title: "title",
  cornerRadius: 10,
  text: "text",
  Text: "Text",
  uploadedImageUrl: "",
  uploadedImageMobileUrl: "",
  src: DefaultImagePlaceholder,
  bothAlign: "start",
  horizontalGap: 20,
  verticalGap: 10,
  titleFontSize: 32,
  textFontSize: 17,
  titleFontWeight: "bold",
  textFontWeight: "normal",
  textColor: "#ffffff",
  secTextColor: "#ffffff",
}

Img.craft = {
  props: DefaultPropsTextImg,
  related: {
    settings: TextImageSettings,
  },
}
