import React, { useCallback } from "react"
import ImagePlaceholder from "@/assets/images/default-image.webp"
import { useTranslations } from "next-intl"
import { throttle, debounce } from "lodash"
import { useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CardContent } from "@/components/ui/card"
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
import { UserLogo } from "./user-loader.component"
import {
  useScreenNames,
  useScreensLength,
} from "@/lib/state/flows-state/features/screenHooks"
import { RootState } from "@/lib/state/flows-state/store"
import axios from "axios"

export const Img = ({
  alt,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  background,
  radius,
  top,
  left,
  right,
  bottom,
  align,
  width = "85%",
  height,
  src,
  enableRedirect,
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
      {isHovered && <Controller nameOfComponent={t("Loader")} />}
      {
        /* eslint-disable-next-line @next/next/no-img-element */
        <UserLogo
          alt={alt}
          top={top}
          left={left}
          right={right}
          bottom={bottom}
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

export const LoaderSettings = () => {
  const t = useTranslations("Components")
  const screenNames = useScreenNames()
  const screensLength = useScreensLength()
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)
  const selectedScreen = useAppSelector(
    (state: RootState) => state.screen?.selectedScreen ?? 0
  )
  const nextScreenName =
    useAppSelector(
      (state: RootState) =>
        state?.screen?.screens[
          selectedScreen + 1 < (screensLength || 0) ? selectedScreen + 1 : 0
        ]?.screenName
    ) || ""
  const {
    actions: { setProp },
    props: {
      enableRedirect,
      containerBackground,
      icon,
      time,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      top,
      left,
      right,
      bottom,
      settingsTab,
      nextScreen,
      buttonAction,
      uploadedImageUrl,
      uploadedImageMobileUrl,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  React.useEffect(() => {
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
        // Set the src to the selected image immediately
        setProp((props) => (props.src = imageSrc), 1000)

        // Continue with uploading the image
        const image = new Image()
        image.src = imageSrc
        image.onload = async () => {
          let { width, height } = image
          const maxWidth = 400
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
            uploadedImage.data.data.images[uploadedImage.desktopSize]
          ) {
            // Update the src to the uploaded image URL
            setProp((props) => {
              props.src =
                uploadedImage.data.data.images[uploadedImage.desktopSize]
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
        }
      }
      reader.readAsDataURL(file)
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

  const uploadToS3 = async (
    imageData,
    aspectRatio,
    actualWidth,
    actualHeight
  ) => {
    const maxWidthMobile = 300
    const maxWidthDesktop = 400
    const mobileDimensions = calculateImageDimensions(
      aspectRatio,
      maxWidthMobile
    )
    const desktopDimensions = calculateImageDimensions(
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
      `${desktopDimensions.width}x${desktopDimensions.height}`
    )
    formData.append("bucket_name", "convify-images")

    try {
      const response = await axios.post("/api/upload", formData)
      return {
        data: response.data,
        mobileSize: `${mobileDimensions.width}x${mobileDimensions.height}`,
        desktopSize: `${desktopDimensions.width}x${desktopDimensions.height}`,
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
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={enableRedirect}
                onCheckedChange={(e) => {
                  // setProp((props) => (props.enableIcon = e), 1000)
                  handlePropChange("enableRedirect", e)
                }}
                id="enableIcon"
              />
              <label
                htmlFor="enableRedirect"
                className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Enable Redirect")}
              </label>
            </div>
            <div className="style-control col-span-2 mt-2 flex w-full grow-0 basis-full flex-col items-start gap-2">
              <div className="flex w-full basis-full flex-row items-center justify-between gap-2">
                <Label htmlFor="time">{t("Wait Time (seconds)")}</Label>
                <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                  {time}
                </span>
              </div>
              <Slider
                className="flex-grow"
                defaultValue={[5]}
                value={[time]}
                max={10}
                min={1}
                step={1}
                onValueChange={(e) => handlePropChange("time", e[0])}
              />
            </div>
            <div className="style-control col-span-2 flex w-full grow-0 basis-2/4 flex-row items-center gap-2">
              <label
                htmlFor="text"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Navigation")}
              </label>
              <Select
                defaultValue={
                  buttonAction === "next-screen" ? "next-screen" : nextScreen
                }
                value={
                  buttonAction === "next-screen" ? "next-screen" : nextScreen
                }
                onValueChange={(e) => {
                  if (e === "next-screen") {
                    setProp((props) => (props.buttonAction = "next-screen"))
                    setProp((props) => (props.nextScreen = nextScreenName))
                  } else {
                    setProp((props) => (props.buttonAction = "custom-action"))
                    setProp((props) => (props.nextScreen = e))
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select screen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={"next-screen"}>
                      {t("Next Screen")}
                    </SelectItem>
                    {screenNames?.map((screen, index) => {
                      return (
                        <SelectItem value={screen.screenId}>
                          {index + 1} : {screen.screenName}
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="design">
          <AccordionTrigger>{t("Design")}</AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-4">
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

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <CardContent className="flex flex-col gap-2 p-2">
                <Label htmlFor="picture">{t("Custom Visual")}</Label>
                <Input id="picture" type="file" onChange={handleInputChange} />
              </CardContent>
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

export const DefaultPropsLoader = {
  alt: "Image",
  marginTop: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  marginRight: "0px",
  background: "inherit",
  radius: "none",
  align: "center",
  width: "85%",
  height: "auto",
  top: 20,
  left: 0,
  right: 0,
  bottom: 20,
  enableRedirect: true,
  src: ImagePlaceholder.src,
}

Img.craft = {
  props: DefaultPropsLoader,
  related: {
    settings: LoaderSettings,
  },
}
