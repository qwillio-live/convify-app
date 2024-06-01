import ImagePlaceholder from "@/assets/images/image-component-placeholder.webp"

import "cropperjs/dist/cropper.css"
import React from "react"
import { UploadCloud } from "lucide-react"
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
  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      className={cn(
        `relative flex flex-row justify-${align} w-full border border-transparent`
      )}
    >
      {isHovered && <Controller nameOfComponent={"Image"} />}
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
  const [setUploadedFile, uploadedFile] = React.useState<string | null>(null)
  const [showDialog, setShowDialog] = React.useState<boolean>(false)
  const [image, setImage] = React.useState<string>(ImgDefaultProps.src)
  const [cropData, setCropData] = React.useState(ImgDefaultProps.src)
  const [activeAspectRatioBtn, setActiveAspectRatioBtn] =
    React.useState<string>("source")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

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
      // setProp((props) => (props.src = URL.createObjectURL(file)), 1000)
      setShowDialog(true)
    }
  }

  const cropperRef = React.useRef<ReactCropperElement>(null)

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper
    // console.log(cropper.getCroppedCanvas().toDataURL())
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
  const aspectRatioFree = () => {
    cropperRef.current?.cropper.setAspectRatio(NaN)
    setActiveAspectRatioBtn("free")
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
          <CardTitle>Image</CardTitle>
          <CardDescription>Add url of image</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-2">
          <Input
            defaultValue={src}
            className="w-full p-2 text-xs"
            onChange={(e) => setProp((props) => (props.src = e.target.value))}
          />
          <span className="text-muted-foreground">Upload image</span>
          <Input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleInputChange}
          />
          <div
            onClick={() => (inputRef.current as HTMLInputElement)?.click()}
            className="relative flex w-full flex-row justify-center hover:cursor-pointer"
          >
            <div className="absolute flex size-full flex-row items-center justify-center bg-white bg-opacity-60">
              <UploadCloud />
            </div>
            <img src={src} alt={alt} className="w-30" />
          </div>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-2">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">General </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Alt label</p>
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
              <p className="text-sm text-muted-foreground">Width</p>
              <Input
                defaultValue={width}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.width = e.target.value))
                }
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Height</p>
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
            <span className="text-sm font-medium">Spacing</span>
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
              <Label className="text-sm text-muted-foreground">Bottom</Label>
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
              <Label className="text-sm text-muted-foreground">Left</Label>
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
              <Label className="text-sm text-muted-foreground">Right</Label>
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
            <span className="text-sm font-medium">Appearance </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Background</p>
              <Input
                type="color"
                value={background}
                onChange={(e) => {
                  setProp((props) => (props.background = e.target.value), 1000)
                }}
              />
            </div>
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Align</p>
              <RadioGroup
                value={align}
                onValueChange={(value) =>
                  setProp((props) => (props.align = value))
                }
              >
                <div className="flex flex-row gap-2">
                  <RadioGroupItem value="start" id="al-1" />
                  <Label htmlFor="al-1">Left</Label>
                </div>
                <div className="flex flex-row gap-2">
                  <RadioGroupItem value="center" id="al-2" />
                  <Label htmlFor="al-1">Center</Label>
                </div>
                <div className="flex flex-row gap-2">
                  <RadioGroupItem value="end" id="al-3" />
                  <Label htmlFor="al-1">Right</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Radius</p>
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
        <DialogContent className="max-h-[calc(100vh-10%)] z-[9999999] flex flex-col max-w-[95%] sm:max-w-[60%] sm:p-8">
          <Cropper
            ref={cropperRef}
            style={{ width: "100%" }}
            // Cropper.js options
            initialAspectRatio={NaN}
            guides={false}
            crop={onCrop}
            autoCropArea={1}
            src={image}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            highlight={true}
          />
          <div className="flex items-center justify-between">
            <div className="p-1 flex gap-0 bg-secondary rounded-lg">
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${
                  activeAspectRatioBtn === "source"
                    ? "bg-white border-input shadow font-medium hover:bg-white"
                    : "bg-transparent border-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioSource}
              >
                Source
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${
                  activeAspectRatioBtn === "free"
                    ? "bg-white border-input shadow font-medium hover:bg-white"
                    : "bg-transparent border-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioFree}
              >
                Free
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${
                  activeAspectRatioBtn === "square"
                    ? "bg-white border-input shadow font-medium hover:bg-white"
                    : "bg-transparent border-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioSquare}
              >
                1:1
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${
                  activeAspectRatioBtn === "portrait"
                    ? "bg-white border-input shadow font-medium hover:bg-white"
                    : "bg-transparent border-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioPortrait}
              >
                4:3
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${
                  activeAspectRatioBtn === "landscape"
                    ? "bg-white border-input shadow font-medium hover:bg-white"
                    : "bg-transparent border-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioLandscape}
              >
                16:9
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${
                  activeAspectRatioBtn === "portraito"
                    ? "bg-white border-input shadow font-medium hover:bg-white"
                    : "bg-transparent border-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioPortraitO}
              >
                3:4
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${
                  activeAspectRatioBtn === "landscapeo"
                    ? "bg-white border-input shadow font-medium hover:bg-white"
                    : "bg-transparent border-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioLandscape0}
              >
                9:16
              </Button>
            </div>
            <Button
              onClick={getCropData}
              className="bg-black text-white"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Crop Image
            </Button>
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
  width: 320,
  height: 180,
  src: ImagePlaceholder.src,
}

Img.craft = {
  props: ImgDefaultProps,
  related: {
    settings: ImgSettings,
  },
}
