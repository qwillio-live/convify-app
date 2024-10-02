import React, { useCallback, useEffect } from "react"
import AvatarPlaceholder from "@/assets/images/default-avatar.webp"
import ImagePlaceholder from "@/assets/images/default-image.webp"
import axios from "axios"
import { debounce, throttle } from "lodash"
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  MoveHorizontal,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Cropper, { ReactCropperElement } from "react-cropper"

import { useNode } from "@/lib/craftjs"
import { setAvatarBackgroundColor } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
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
import { Icons } from "@/components/icons"

import { Controller } from "../settings/controller.component"
import { UserLogo } from "./user-avatar.component"

export const Img = ({
  alt,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  background,
  top,
  bottom,
  right,
  left,
  radius,
  align,
  width = "85%",
  height,
  src,
  w,
  cornRad,
  h,
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
      {isHovered && <Controller nameOfComponent={"Avatar"} />}
      {
        /* eslint-disable-next-line @next/next/no-img-element */
        <UserLogo
          alt={alt}
          marginTop={top}
          top={top}
          bottom={bottom}
          left={left}
          right={right}
          marginBottom={bottom}
          marginLeft={left}
          marginRight={right}
          cornRad={cornRad}
          background={background}
          radius={radius}
          align={align}
          width={width}
          w={w}
          h={h}
          height={height}
          src={src}
          {...props}
        />
      }
    </div>
  )
}

export const AvatarSettings = () => {
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const [setUploadedFile, uploadedFile] = React.useState<string | null>(null)
  const [showDialog, setShowDialog] = React.useState<boolean>(false)
  const [image, setImage] = React.useState<string>(AvatarPlaceholder.src)
  const [cropData, setCropData] = React.useState(AvatarPlaceholder.src)
  const [activeAspectRatioBtn, setActiveAspectRatioBtn] =
    React.useState<string>("source")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const t = useTranslations("Components")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = React.useState<File>()

  const {
    actions: { setProp },
    props: {
      enableLink,
      src,
      containerBackground,
      url,
      icon,
      radius,
      alt,
      top,
      bottom,
      left,
      right,
      settingsTab,
      align,
      uploadedImageUrl,
      uploadedImageMobileUrl,
      cornRad,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const dispatch = useAppDispatch()

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
    const maxWidthMobile = 60
    const maxWidthDesktop = 90
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
    formData.append("sizes[0]", `60x60`)
    formData.append("sizes[1]", `100x100`)
    formData.append("bucket_name", "convify-images")

    try {
      const response = await axios.post("/api/upload", formData)
      return {
        data: response.data,
        mobileSize: `60x60`,
        desktopSize: `100x100`,
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
  const avatarBackgroundColor = useAppSelector(
    (state) => state?.screen?.avatarBackgroundColor
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
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="col-span-2 flex flex-row items-center space-x-2">
              <Checkbox
                className="border-input ring-offset-background focus-visible:ring-ring data-[state=checked]:border-primary peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                checked={enableLink}
                onCheckedChange={(e) => {
                  // setProp((props) => (props.enableIcon = e), 1000)
                  handlePropChange("enableLink", e)
                }}
                id="enableIcon"
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
                  <p className="text-muted-foreground text-sm">
                    {t("Add URL")}
                  </p>
                  <Input
                    className="p-2 text-sm"
                    value={url}
                    placeholder={"URL"}
                    onChange={(e) => {
                      setProp((props) => (props.url = e.target.value), 1000)
                    }}
                  />
                </div>
                <div className="style-control col-span-2 flex flex-col">
                  <p className="text-md text-muted-foreground flex-1">
                    {t("Open in")}
                  </p>
                  <Select
                    defaultValue={"aperture"}
                    value={
                      icon && icon === "arrowright" ? "arrowright" : "aperture"
                    }
                    onValueChange={(e) => {
                      setProp((props) => (props.icon = e), 1000)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Link" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="arrowright">
                          <p>{t("New Window")}</p>
                        </SelectItem>
                        <SelectItem value="aperture">
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
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Design")} </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-4 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Corner Radius")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {cornRad}
                </span>
              </div>
              <Slider
                className=""
                defaultValue={[cornRad]}
                value={[cornRad]}
                max={200}
                min={0}
                step={1}
                onValueChange={(e) => handlePropChangeDebounced("cornRad", e)}
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

export const DefaultPropsAvatar = {
  alt: "Image",
  marginTop: "20px",
  marginBottom: "20px",
  marginLeft: "20px",
  marginRight: "20px",
  top: "0px",
  bottom: "0px",
  left: "0px",
  right: "0px",
  background: "inherit",
  radius: "none",
  align: "center",
  width: "85%",
  w: "auto",
  h: "60px",
  cornRad: 50,
  height: "auto",
  enableLink: false,
  imageSize: 100,
  src: `${AvatarPlaceholder.src}`,
  uploadedImageUrl: "",
  uploadedImageMobileUrl: "",
}

Img.craft = {
  props: DefaultPropsAvatar,
  related: {
    settings: AvatarSettings,
  },
}
