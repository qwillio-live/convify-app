import ImagePlaceholder from "@/assets/images/default-image.webp"
import "cropperjs/dist/cropper.css"
import React from "react"
import { useTranslations } from "next-intl"
import Cropper, { ReactCropperElement } from "react-cropper"
import { useNode } from "@/lib/craftjs"
import { cn } from "@/lib/utils"
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
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Icons } from "@/components/icons"

import { Controller } from "../settings/controller.component"

export const UserLogo = ({
  alt,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  background,
  radius,
  align,
  width,
  height,
  src,
  ...props
}) => {
  return (
    <>
      <img
        alt={alt}
        src={src}
        style={{
          width: width,
          height: height,
          borderRadius: `${radius}px`,
          backgroundColor: background,
          marginLeft: `${marginLeft}px`,
          marginRight: `${marginRight}px`,
          marginTop: `${marginTop}px`,
          marginBottom: `${marginBottom}px`,
        }}
      />
    </>
  )
}

export const Img = ({
  alt,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  background,
  radius,
  align,
  width,
  height,
  src,
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
  const [hover,setHover] = React.useState(false)
  const t = useTranslations("Components")
  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      className={cn(
        `relative flex flex-row justify-${align} w-full border border-transparent`
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && <Controller nameOfComponent={t("Image")} />}
      {
        /* eslint-disable-next-line @next/next/no-img-element */
        <UserLogo
          alt={alt}
          marginTop={marginTop}
          marginBottom={marginBottom}
          marginLeft={marginLeft}
          marginRight={marginRight}
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

export const ImgSettings = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const [setUploadedFile, uploadedFile] = React.useState<string | null>(null)
  const [showDialog, setShowDialog] = React.useState<boolean>(false)
  const [image, setImage] = React.useState<string>(ImgDefaultProps.src)
  const [cropData, setCropData] = React.useState(ImgDefaultProps.src)
  const [activeAspectRatioBtn, setActiveAspectRatioBtn] =
    React.useState<string>("source")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const t = useTranslations("Components")

  const {
    actions: { setProp },
    props: {
      alt,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      background,
      radius,
      align,
      width,
      height,
      src,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as any)
      }
      reader.readAsDataURL(file)
      setShowDialog(true)
    }
  }

  const handleUploadOriginal = () => {
    if (image) {
      setProp((props) => (props.src = image), 1000)
      setShowDialog(false)
    }
  }

  const cropperRef = React.useRef<ReactCropperElement>(null)

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper
  }

  const getCropData = () => {
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
    }
    setIsLoading(false)
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

  return (
    <>
      <Card className="p-2">
        <CardHeader className="p-2">
          <CardTitle>{t("Image")}</CardTitle>
          <CardDescription>{t("Add url of image")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-2">
          <Input
            defaultValue={src}
            className="w-full p-2 text-xs"
            onChange={(e) => setProp((props) => (props.src = e.target.value))}
          />
          <span className="text-muted-foreground">{t("Upload image")}</span>
          <Input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleInputChange}
          />
          <div
            onClick={() => (inputRef.current as HTMLInputElement)?.click()}
            className="relative flex w-full flex-row justify-center group hover:cursor-pointer"
          >
            <div className="absolute flex h-full w-full flex-col items-center justify-center bg-transparent group-hover:bg-white/[0.85] group-hover:opacity-100 opacity-0 transition-opacity duration-200 ease-in">
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
              <span className="text-sm font-semibold text-black mt-1">
                {t("Upload")}
              </span>
            </div>
            <img src={src} alt={alt} className="w-30" />
          </div>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-2">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("General")}</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">{t("Alt label")}</p>
              <Input
                className="p-2 text-sm"
                value={alt}
                placeholder={alt}
                onChange={(e) => {
                  setProp((props) => (props.alt = e.target.value), 1000)
                }}
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">{t("Width")}</p>
              <Input
                defaultValue={width}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.width = e.target.value))
                }
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">{t("Height")}</p>
              <Input
                defaultValue={height}
                className="w-full"
                onChange={(e) => {
                  setProp((props) => (props.height = e.target.value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">{t("Spacing")}</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-2">
            <div className="style-control flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Top</Label>
              <Input
                type="number"
                max={100}
                min={0}
                className="w-full"
                placeholder={marginTop}
                onChange={(e) => {
                  setProp((props) => (props.marginTop = e.target.value), 1000)
                }}
              />
            </div>
            <div className="style-control flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">
                {t("Bottom")}
              </Label>
              <Input
                type="number"
                placeholder={marginBottom}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.marginBottom = e.target.value),
                    1000
                  )
                }
              />
            </div>
            <div className="style-control flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">
                {t("Left")}
              </Label>
              <Input
                type="number"
                placeholder={marginLeft}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginLeft = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">
                {t("Right")}
              </Label>
              <Input
                type="number"
                placeholder={marginRight}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginRight = e.target.value), 1000)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Appearance")}</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">{t("Background")}</p>
              <Input
                type="color"
                value={background}
                onChange={(e) => {
                  setProp((props) => (props.background = e.target.value), 1000)
                }}
              />
            </div>
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">{t("Align")}</p>
              <RadioGroup
                value={align}
                onValueChange={(value) =>
                  setProp((props) => (props.align = value))
                }
              >
                <div className="flex flex-row gap-2">
                  <RadioGroupItem value="start" id="al-1" />
                  <Label htmlFor="al-1">{t("Left")}</Label>
                </div>
                <div className="flex flex-row gap-2">
                  <RadioGroupItem value="center" id="al-2" />
                  <Label htmlFor="al-1">{t("Center")}</Label>
                </div>
                <div className="flex flex-row gap-2">
                  <RadioGroupItem value="end" id="al-3" />
                  <Label htmlFor="al-1">{t("Right")}</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">{t("Radius")}</p>
              <Input
                type="number"
                placeholder={radius}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.radius = e.target.value), 1000)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className="z-[9999999] max-h-[calc(100vh-10%)] h-[calc(100vh-10%)] max-w-[95%] sm:max-w-[70%] relative flex flex-col gap-4 p-4 sm:p-8"
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
            <div className="p-1 flex gap-0 bg-secondary rounded-lg">
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${activeAspectRatioBtn === "source"
                  ? "bg-white border-input shadow font-medium hover:bg-white"
                  : "bg-transparent border-transparent hover:bg-transparent"
                  }`}
                onClick={aspectRatioSource}
              >
                {t("Source")}
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${activeAspectRatioBtn === "square"
                  ? "bg-white border-input shadow font-medium hover:bg-white"
                  : "bg-transparent border-transparent hover:bg-transparent"
                  }`}
                onClick={aspectRatioSquare}
              >
                1:1
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${activeAspectRatioBtn === "portrait"
                  ? "bg-white border-input shadow font-medium hover:bg-white"
                  : "bg-transparent border-transparent hover:bg-transparent"
                  }`}
                onClick={aspectRatioPortrait}
              >
                4:3
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${activeAspectRatioBtn === "landscape"
                  ? "bg-white border-input shadow font-medium hover:bg-white"
                  : "bg-transparent border-transparent hover:bg-transparent"
                  }`}
                onClick={aspectRatioLandscape}
              >
                16:9
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${activeAspectRatioBtn === "portraito"
                  ? "bg-white border-input shadow font-medium hover:bg-white"
                  : "bg-transparent border-transparent hover:bg-transparent"
                  }`}
                onClick={aspectRatioPortraitO}
              >
                3:4
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${activeAspectRatioBtn === "landscapeo"
                  ? "bg-white border-input shadow font-medium hover:bg-white"
                  : "bg-transparent border-transparent hover:bg-transparent"
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

export const ImgDefaultProps = {
  alt: "Image",
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  background: "inherit",
  radius: "none",
  align: "center",
  width: '85%',
  height: 'auto',
  src: ImagePlaceholder.src,
}

Img.craft = {
  props: ImgDefaultProps,
  related: {
    settings: ImgSettings,
  },
}
