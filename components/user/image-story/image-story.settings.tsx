import { useNode } from "@craftjs/core"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState } from "react"
import { throttle, debounce } from "lodash"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"
import { MoveHorizontal, Plus } from "lucide-react"
import { Icons } from "@/components/icons"
import axios from "axios"
import hexoid from "hexoid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/custom-slider"
import { ColorInput } from "@/components/color-input"
import { ImageStoryAspectRatios } from "./useImageStoryThemePresets"

export const ImageStorySettnigs = () => {
  const t = useTranslations("Components")

  const {
    actions: { setProp },
    props: {
      size,
      containerBackground,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      settingTabs,
      aspectRatio,
      items,
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

  return (
    <>
      <Accordion
        value={settingTabs || ["content"]}
        onValueChange={(value) => {
          setProp((props) => (props.settingTabs = value), 200)
        }}
        type="multiple"
        defaultValue={settingTabs || ["content"]}
        className="w-full"
      >

        <AccordionItem value="content">
          <AccordionTrigger>{t("Content")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="text-muted-foreground text-xs">
              {t("Drag to re-arrange click to edit")}
            </div>

            <Reorder.Group
              axis="y"
              values={items}
              className="flex w-full flex-col gap-2"
              onReorder={(e) => handlePropChange("items", e)}
            >
              {items.map((item, index) => (
                <ImageStoryItemSetting
                  key={`image-story-item-${item.id}`}
                  originalItem={item}
                  index={index}
                />
              ))}
            </Reorder.Group>
            <Button
              className="h-9.5 w-full bg-[#23262C] text-white"
              size="sm"
              onClick={() =>
                handlePropChange("items", [
                  ...items,
                  {
                    id: `image-story-item-${hexoid(6)()}`,
                    src: "https://siteimages.b-cdn.net/flow/default-image.30d08cea.webp",
                  },
                ])
              }
            >
              <Plus className="mr-2 size-4" /> {t("Add new")}
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="design">
          <AccordionTrigger>{t("Design")}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="aspectRatio">{t("Ratio")}</Label>

              <Tabs
                value={aspectRatio}
                defaultValue={aspectRatio}
                onValueChange={(value) => {
                  setProp((props) => (props.aspectRatio = value), 1000)
                }}
              >
                <TabsList className="grid w-full grid-cols-2 bg-[#EEEEEE]">
                  <TabsTrigger
                    className="rounded text-base leading-4"
                    value={ImageStoryAspectRatios.fiveByFour}
                  >
                    5:4
                  </TabsTrigger>
                  <TabsTrigger
                    className="rounded text-base leading-4"
                    value={ImageStoryAspectRatios.sixteenByNine}
                  >
                    16:9
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="backgroundcolor">{t("Background Color")}</Label>
              <ColorInput
                value={containerBackground}
                handleChange={(e) => {
                  debouncedSetProp("containerBackground", e.target.value)
                }}
                handleRemove={() => {
                  debouncedSetProp("containerBackground", "transparent")
                }}
                id="backgroundcolor"
              />
            </div>

          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="spacing">
          <AccordionTrigger>{t("Spacing")}</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2">
            <div className="space-y-2">
              <Tabs
                value={size}
                defaultValue={size}
                onValueChange={(value) => {
                  setProp((props) => (props.size = value), 1000)
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
                  <Label>{t("Top")}</Label>
                  <span className="text-muted-foreground text-xs">
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
                  onValueChange={(e) =>
                    handlePropChangeDebounced("marginTop", e)
                  }
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>{t("Bottom")}</Label>
                  <span className="text-muted-foreground text-xs">
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

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>{t("Right")}</Label>
                  <span className="text-muted-foreground text-xs">
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

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>{t("Left")}</Label>
                  <span className="text-muted-foreground text-xs">
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
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </>
  )


}

export const ImageStoryItemSetting = ({ originalItem, index }) => {
  const {
    actions: { setProp },
    props: { items },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const controls = useDragControls()
  const inputRef = useRef<HTMLInputElement>(null)
  const [item, setItem] = useState(originalItem)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const y = useMotionValue(0)


  useEffect(() => {
    setItem(originalItem)
  }, [originalItem])



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
    const logoDimensions = calculateImageDimensions(aspectRatio, 1000)

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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async () => {
        const imageSrc = reader.result as string
        setIsLoading(true)
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
            uploadedImage.data.data.images['original']
          ) {
            setProp((props) => {
              props.items[index].src =
                uploadedImage.data.data.images['original']
            }, 1000)
          }
          setIsLoading(false)

        }
      }
      reader.readAsDataURL(file)
    }
  }
  const handleItemDelete = () => {
    setProp((props) => (props.items = items.filter((_, i) => i !== index)), 200)
  }

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={item}
      style={{ y }}
      transition={{ duration: 0 }}
      id={`image-story-item-${item.id}`}
      className="flex w-full select-none items-center space-x-2"
    >
      <input
        className="hidden"
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
      />
      <div
        className="!ml-0 flex-1 h-28 w-32"
        onClick={() => inputRef.current?.click()}
        style={{
          borderRadius: "6px",
        }}
      >
        {isLoading ? (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          </div>
        ) : (
          <img
            src={item.src}
            className="h-full w-full object-cover"
            loading="lazy"
            style={{
              borderRadius: "6px",
            }}
          />

        )}
      </div>
      <Icons.Delete
        className="hover:cursor-pointer"
        onClick={handleItemDelete}
      />
      <div
        onPointerDown={(e) => controls.start(e)}
        className="reorder-handle !ml-1 hover:cursor-move"
      >
        <Icons.GripVertical />
      </div>
    </Reorder.Item>
  )
}