import React, { useCallback, useEffect } from "react"
import axios from "axios"
import { debounce, throttle } from "lodash"
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { useNode } from "@/lib/craftjs"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { UserLogo } from "./user-logo.component"
import { ColorInput } from "@/components/color-input"
import { debug } from "console"

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
  h,
  imageSize,
  enableLink,
  borderRad,
  ...props
}) => {
  const {
    connectors: { connect, drag },
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
      {isHovered && <Controller nameOfComponent={t("Logo")} />}
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
          background={background}
          radius={radius}
          borderRad={borderRad}
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

export const LogoSettings = () => {
  const t = useTranslations("Components")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)

  const {
    actions: { setProp },
    props: {
      enableLink,
      src,
      containerBackground,
      url,
      icon,
      alt,
      top,
      bottom,
      left,
      right,
      settingsTab,
      align,
      uploadedImageUrl,
      uploadedImageMobileUrl,
      borderRad,
      w
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))  
  useEffect(() => {
    if (mobileScreen && uploadedImageMobileUrl) {
      setProp((props) => (props.src = uploadedImageMobileUrl), 1000)
    } else if (!mobileScreen && uploadedImageUrl) {
      setProp((props) => (props.src = uploadedImageUrl), 1000)
    }
  }, [mobileScreen])

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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async () => {
        const imageSrc = reader.result as string
        setProp((props) => (props.src = imageSrc), 1000)
        const image = new Image()
        image.src = imageSrc
        image.onload = async () => {
          let { width, height } = image
         
          const aspectRatio = width / height
          const uploadedImage = await uploadToS3(
            file,
            aspectRatio,
            width,
            height
          )
          if (
            uploadedImage &&
            uploadedImage.data.data.images.original
          ) {
            setProp((props) => {
              props.src = uploadedImage.data.data.images.original
              props.uploadedImageUrl =
                uploadedImage.data.data.images.original
            }, 1000)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }


  const uploadToS3 = async (
    imageData,
    aspectRatio,
    actualWidth,
    actualHeight
  ) => {
    const formData = new FormData()
    formData.append("image", imageData)
    formData.append("file", imageData)
    formData.append(
      "sizes[0]",
      `${actualWidth}x${actualHeight}`
    )
    formData.append("sizes[1]", `${actualWidth}x${actualHeight}`)
    formData.append("bucket_name", "convify-images")

    try {
      const response = await axios.post("/api/upload", formData)
      return {
        data: response.data,
        logoSize: `${actualWidth}x${actualHeight}`,
      }
    } catch (error) {
      console.error("Error uploading image to S3:", error)
      return null
    }
  }
  const maxWidthPx = 300
  const minWidthPx = 100
  const imageSizePercentage = (((parseInt(w) - minWidthPx) * 100) / (maxWidthPx - minWidthPx))

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
        value={settingsTab}
        onValueChange={(value) => {
          setProp((props) => (props.settingsTab = value), 200)
        }}
        type="multiple"
        defaultValue={["design"]}
        className="w-full"
      >
        <AccordionItem value="item-2">
          <AccordionTrigger>{t("General")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>{t("Alt label")}</Label>
              <Input
                value={alt}
                placeholder={alt}
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
                onClick={() => {
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
                    defaultValue={"aperture"}
                    value={icon === "arrowright" ? "arrowright" : "aperture"}
                    onValueChange={(e) => {
                      setProp((props) => (props.icon = e), 1000)
                    }}
                  >
                    <SelectTrigger className="h-8.5 w-full bg-[#FAFAFA] text-xs">
                      <SelectValue placeholder="Select Link" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem className="text-xs" value="new-window">
                          <p>{t("New Window")}</p>
                        </SelectItem>
                        <SelectItem className="text-xs" value="same-window">
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
          <AccordionContent className="space-y-6 pt-2">
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
                  const newWidthPercentage = e[0]
                  const maxMinGap = maxWidthPx - minWidthPx
                  const newWidthPx = (newWidthPercentage / 100) * maxMinGap + minWidthPx
                  handlePropChangeDebounced("w", newWidthPx)

                  setProp((props) => {
                    props.w = `${newWidthPx}px`
                    // props.height = `${newHeightPx}px`;
                    props.imageSize = newWidthPx
                  }, 1000)
                }}
              />
            </div>
            <div className="flex flex-row items-center justify-between">
              <Label htmlFor="backgroundcolor">{t("Background Color")}</Label>
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="corner-radius">{t("Corner Radius")}</Label>
                <span className="text-muted-foreground text-xs">
                  {borderRad}
                </span>
              </div>
              <Slider
                defaultValue={[borderRad]}
                value={[borderRad]}
                max={200}
                min={0}
                step={1}
                onValueChange={(e) => handlePropChangeDebounced("borderRad", e)}
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
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="marginTop">{t("Top")}</Label>
                <span className="text-muted-foreground text-xs">{top}</span>
              </div>
              <Slider
                className=""
                defaultValue={[top]}
                value={[top]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) => handlePropChangeDebounced("top", e)}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="marginBottom">{t("Bottom")}</Label>
                <span className="text-muted-foreground text-xs">{bottom}</span>
              </div>
              <Slider
                defaultValue={[bottom]}
                value={[bottom]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) => handlePropChangeDebounced("bottom", e)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="marginRight">{t("Right")}</Label>
                <span className="text-muted-foreground text-xs">{right}</span>
              </div>
              <Slider
                defaultValue={[right]}
                value={[right]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) => handlePropChangeDebounced("right", e)}
              />
            </div>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marginLeft">{t("Left")}</Label>
                  <span className="text-muted-foreground text-xs">{left}</span>
                </div>
              <Slider
                defaultValue={[left]}
                value={[left]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) => handlePropChangeDebounced("left", e)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export const DefaultPropsLogo = {
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
  borderRad: 0,
  align: "center",
  width: "85%",
  maxWidth: "120px",
  w: "",
  h: "",
  height: "auto",
  enableLink: false,
  imageSize: 100,
  uploadedImageUrl: "",
  uploadedImageMobileUrl: "",
  src: "https://convify.io/images/convify_logo_black.svg",
}

Img.craft = {
  props: DefaultPropsLogo,
  related: {
    settings: LogoSettings,
  },
}
