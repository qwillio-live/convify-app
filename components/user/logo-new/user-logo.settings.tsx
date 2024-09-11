import React, { useCallback, useEffect } from "react"
import {
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyCenter,
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
import { UserLogo } from "./user-logo.component"
import axios from "axios"

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
      borderRad,
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
          const maxWidth = 120
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          const aspectRatio = width / height
          const uploadedImage = await uploadToS3(
            file,
            aspectRatio,
            width,
            height
          )
          if (
            uploadedImage &&
            uploadedImage.data.data.images[uploadedImage.logoSize]
          ) {
            setProp((props) => {
              props.src = uploadedImage.data.data.images[uploadedImage.logoSize]
              props.uploadedImageUrl =
                uploadedImage.data.data.images[uploadedImage.logoSize]
            }, 1000)
          }
          if (
            uploadedImage &&
            uploadedImage.data.data.images[uploadedImage.logoSize]
          ) {
            setProp((props) => {
              props.uploadedImageMobileUrl =
                uploadedImage.data.data.images[uploadedImage.logoSize]
            }, 1000)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const calculateImageDimensions = (aspectRatio, maxWidth) => {
    const height = maxWidth / aspectRatio
    return {
      width: maxWidth,
      height: Math.round(height),
    }
  }

  const uploadToS3 = async (
    imageData,
    aspectRatio,
    actualWidth,
    actualHeight
  ) => {
    const maxWidthLogo = 120
    const logoDimensions = calculateImageDimensions(aspectRatio, maxWidthLogo)

    const formData = new FormData()
    formData.append("image", imageData)
    formData.append("file", imageData)
    formData.append(
      "sizes[0]",
      `${logoDimensions.width}x${logoDimensions.height}`
    )
    formData.append("sizes[1]", `${actualWidth}x${actualHeight}`)
    formData.append("bucket_name", "convify-images")

    try {
      const response = await axios.post("/api/upload", formData)
      return {
        data: response.data,
        logoSize: `${logoDimensions.width}x${logoDimensions.height}`,
      }
    } catch (error) {
      console.error("Error uploading image to S3:", error)
      return null
    }
  }

  const themeBackgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )

  return (
    <>
      <Card className="mt-4 p-2">
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
          <AccordionTrigger>{t("General")}</AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2">
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
          <AccordionContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={enableLink}
                onCheckedChange={(e) => {
                  // setProp((props) => (props.enableIcon = e), 1000)
                  handlePropChange("enableLink", e)
                }}
                id="enableIcon"
              />
              <label
                htmlFor="enableLink"
                className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                    {t("Open in..")}
                  </p>
                  <Select
                    defaultValue={icon}
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
          <AccordionTrigger>{t("Design")}</AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-4">
            <div className="flex flex-row items-center space-x-2">
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

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Corner Radius")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {borderRad}
                </span>
              </div>
              <Slider
                className=""
                defaultValue={[borderRad]}
                value={[borderRad]}
                max={200}
                min={0}
                step={1}
                onValueChange={(e) => handlePropChangeDebounced("borderRad", e)}
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="start">
                    <AlignHorizontalJustifyStart />
                  </TabsTrigger>
                  <TabsTrigger value="center">
                    <AlignHorizontalJustifyCenter />
                  </TabsTrigger>
                  <TabsTrigger value="end">
                    <AlignHorizontalJustifyEnd />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="spacing">
          <AccordionTrigger>{t("Spacing")}</AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Top")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {top}
                </span>
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
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Bottom")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {bottom}
                </span>
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

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Right")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {right}
                </span>
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
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="marginTop">{t("Left")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {left}
                </span>
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
