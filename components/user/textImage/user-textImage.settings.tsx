import React, { useCallback, useEffect } from "react"
import {
  MoveHorizontal,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyCenter,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"
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
import { Checkbox } from "@/components/custom-checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/custom-select"
import { Slider } from "@/components/custom-slider"
import { Controller } from "../settings/controller.component"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { IconButtonSizes, UserLogo } from "./user-textImage.component"
import axios from "axios"
import ColorButton from "../color-button"

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
      <Card className="p-2">
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
        className="mb-10 w-full"
      >
        <AccordionItem value="item-2">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("General")}</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-muted-foreground text-sm">
                {t("Image Position")}
              </p>
              <Tabs
                value={position}
                defaultValue={position}
                onValueChange={(value) => {
                  setProp((props) => (props.position = value), 1000)
                }}
                className="flex-1"
              >
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="left">{t("Left")}</TabsTrigger>
                  <TabsTrigger value="right">{t("Right")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </AccordionContent>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Text Image Split")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {split}:{12 - split}
                </span>
              </div>
              <Slider
                className=""
                defaultValue={[split]}
                value={[split]}
                max={11}
                min={1}
                step={1}
                onValueChange={(e) => handlePropChangeDebounced("split", e)}
              />
            </div>
          </AccordionContent>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Both Align")}</Label>
              </div>
              <Tabs
                value={bothAlign}
                defaultValue={bothAlign}
                onValueChange={(value) => {
                  setProp((props) => (props.bothAlign = value), 1000)
                }}
                className="mt-2 flex-1"
              >
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="start">{t("Top")}</TabsTrigger>
                  <TabsTrigger value="center">{t("Center")}</TabsTrigger>
                  <TabsTrigger value="end">{t("Bottom")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </AccordionContent>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Horizontal Gap")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {horizontalGap}
                </span>
              </div>
              <Slider
                className=""
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
          </AccordionContent>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Vertical Gap")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {verticalGap}
                </span>
              </div>
              <Slider
                className=""
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
          </AccordionContent>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-muted-foreground text-sm">{t("Alt label")}</p>
              <Input
                className="p-2 text-sm"
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
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Design")} </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-4 p-2">
            <div className="col-span-2 flex flex-row items-center space-x-2">
              <label
                htmlFor="backgroundcolor"
                className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Background Color")}
              </label>
              <Input
                defaultValue={themeBackgroundColor}
                value={containerBackground}
                onChange={(e) => {
                  debouncedSetProp("containerBackground", e.target.value)
                }}
                className="basis-1/3"
                type={"color"}
                id="backgroundcolor"
              />
            </div>
            <ColorButton
              label={"Title Color"}
              styleKey="textColor"
              currentValue={textColor || ""}
              setProp={handlePropChangeDebounced}
            />
            <ColorButton
              label={"Subtitle Color"}
              styleKey="secTextColor"
              currentValue={secTextColor || ""}
              setProp={handlePropChangeDebounced}
            />
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Corner Radius")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {cornerRadius}
                </span>
              </div>
              <Slider
                className=""
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
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Title Font Size")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {titleFontSize}
                </span>
              </div>
              <Slider
                className=""
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
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-md text-muted-foreground flex-1">
                {t("Title Font Weight")}
              </p>
              <Select
                defaultValue={titleFontWeight}
                onValueChange={(e) => {
                  setProp((props) => (props.titleFontWeight = e), 1000)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Font Weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="thin">
                      <p>Thin</p>
                    </SelectItem>
                    <SelectItem value="normal">
                      <p>Normal</p>
                    </SelectItem>
                    <SelectItem value="medium">
                      <p>Medium</p>
                    </SelectItem>
                    <SelectItem value="semibold">
                      <p>Semi Bold</p>
                    </SelectItem>
                    <SelectItem value="bold">
                      <p>Bold</p>
                    </SelectItem>
                    <SelectItem value="extrabold">
                      <p>Extra Bold</p>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Text Font Size")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {textFontSize}
                </span>
              </div>
              <Slider
                className=""
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
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-md text-muted-foreground flex-1">
                {t("Text Font Weight")}
              </p>
              <Select
                defaultValue={textFontWeight}
                onValueChange={(e) => {
                  setProp((props) => (props.textFontWeight = e), 1000)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Font Weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="thin">
                      <p>Thin</p>
                    </SelectItem>
                    <SelectItem value="normal">
                      <p>Normal</p>
                    </SelectItem>
                    <SelectItem value="medium">
                      <p>Medium</p>
                    </SelectItem>
                    <SelectItem value="semibold">
                      <p>Semi Bold</p>
                    </SelectItem>
                    <SelectItem value="bold">
                      <p>Bold</p>
                    </SelectItem>
                    <SelectItem value="extrabold">
                      <p>Extra Bold</p>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="spacing">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Spacing")} </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <p className="text-md text-muted-foreground">{t("Width")}</p>
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
                  {Top}
                </span>
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
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Bottom")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
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

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Right")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {Right}
                </span>
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
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Left")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {Left}
                </span>
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
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${
                  activeAspectRatioBtn === "source"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioSource}
              >
                {t("Source")}
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${
                  activeAspectRatioBtn === "square"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioSquare}
              >
                1:1
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${
                  activeAspectRatioBtn === "portrait"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioPortrait}
              >
                4:3
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${
                  activeAspectRatioBtn === "landscape"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioLandscape}
              >
                16:9
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${
                  activeAspectRatioBtn === "portraito"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioPortraitO}
              >
                3:4
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${
                  activeAspectRatioBtn === "landscapeo"
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
  imageSize: 100,
  size: "",
  title: "title",
  cornerRadius: 10,
  text: "text",
  Text: "Text",
  uploadedImageUrl: "",
  uploadedImageMobileUrl: "",
  src: ImagePlaceholder.src,
  bothAlign: "start",
  horizontalGap: 20,
  verticalGap: 10,
  titleFontSize: 32,
  textFontSize: 17,
  titleFontWeight: "bold",
  textFontWeight: "normal",
}

Img.craft = {
  props: DefaultPropsTextImg,
  related: {
    settings: TextImageSettings,
  },
}
