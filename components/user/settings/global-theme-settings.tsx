import { useCallback, useEffect, useState } from "react"
import { debounce, throttle } from "lodash"
import { useTranslations } from "next-intl"

import { setHeaderPosition, setPartialStyles } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import ImageUpload from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

import { FontSelector } from "./font-selector.component"
import {   Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,SelectGroup } from "@/components/custom-select"
import { applyHeaderPosition } from "@/lib/state/flows-state/features/sagas/themeScreen.saga"
import { updateHeaderPosition } from "@/lib/state/flows-state/features/placeholderScreensSlice"

type Props = {}

export const GlobalThemeSettings = (props: Props) => {
  const [open, setOpen] = useState(false)
  const [secondaryOpen, setSecondaryOpen] = useState(false)

  const dispatch = useAppDispatch()

  const t = useTranslations("Components")

  const [image, setImage] = useState<string>("")

  /** GENERAL STYLES */
  const primaryColor = useAppSelector(
    (state) => state.theme?.general?.primaryColor
  )
  const defaultPrimaryColor = useAppSelector(
    (state) => state.theme?.defaultGeneral?.primaryColor
  )
  const secondaryColor = useAppSelector(
    (state) => state.theme?.general?.secondaryColor
  )
  const defaultSecondaryColor = useAppSelector(
    (state) => state.theme?.defaultGeneral?.secondaryColor
  )
  const backgroundColor = useAppSelector(
    (state) => state.theme?.general?.backgroundColor
  )
  const backgroundImage = useAppSelector(
    (state) => state.theme?.general?.backgroundImage
  )
  const defaultBackgroundColor = useAppSelector(
    (state) => state.theme?.defaultGeneral?.backgroundColor
  )

  const headerPosition = useAppSelector(
    (state) => state.theme?.header?.headerPosition
  )

  /** TEXT STYLES */
  const primaryFonts = useAppSelector((state) => state.theme?.primaryFonts)
  const secondaryFonts = useAppSelector((state) => state.theme?.secondaryFonts)
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const defaultPrimaryFont = useAppSelector(
    (state) => state.theme?.defaultText?.primaryFont
  )
  const secondaryFont = useAppSelector(
    (state) => state.theme?.text?.secondaryFont
  )
  const defaultSecondaryFont = useAppSelector(
    (state) => state.theme?.defaultText?.secondaryFont
  )
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  const defaultPrimaryTextColor = useAppSelector(
    (state) => state.theme?.defaultText?.primaryColor
  )
  const secondaryTextColor = useAppSelector(
    (state) => state.theme?.text?.secondaryColor
  )
  const defaultSecondaryTextColor = useAppSelector(
    (state) => state.theme?.defaultText?.secondaryColor
  )
  const screens = useAppSelector((state: RootState) => state?.screen?.screens)

  const handleApplyTheme = (themeStyles) => {
    dispatch({ type: "APPLY_THEME_AND_CYCLE_SCREENS", payload: themeStyles })
  }

  const handleFileChange = (e) => {
    if (!e?.target?.files?.length) return
    const file = e?.target?.files[0]
    const objectUrl = URL.createObjectURL(file)

    dispatch(setPartialStyles({ general: { backgroundImage: objectUrl } }))
  }

  const throttledDispatch = useCallback(
    throttle((value) => {
      dispatch(setPartialStyles(value))
    }, 200), // Throttle to 200ms
    [dispatch]
  )

  const handleStyleChange = (style) => {
    throttledDispatch(style)
  }

  useEffect(() => {
    console.log("primaryFonts", primaryFonts)
  }, [primaryFonts])

  const debouncedDispatch = useCallback(
    debounce(
      (value) => {
        dispatch(setPartialStyles(value))
      },
      200,
      {
        maxWait: 400,
      }
    ), // Throttle to 200ms
    [dispatch]
  )

  const handleStyleChangeDebounced = (style) => {
    debouncedDispatch(style)
  }

  const handleUploadComplete = (url: string) => {
    handleStyleChangeDebounced({
      general: { backgroundImage: `url(${url})` },
    })
  }

  const removeSelectedImage = () => {
    handleStyleChangeDebounced({
      general: { backgroundImage: `` },
    })
  }
  // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  // const hanldeScreenRolling =async () => {
  //   screens?.map(async (screen, index) => {
  //     await dispatch(rollScreens(screen.screenData))
  //     delay(200)
  //   })
  // }

  return (
    <>
      <ScrollArea>
        <Accordion type="multiple" defaultValue={["item-1"]} className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
              <span className="text-sm font-medium">{t("General")} </span>
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="col-span-2 flex flex-row items-center space-x-2">
                <label
                  htmlFor="headerscroll"
                  className="basis-2/3 whitespace-nowrap text-nowrap font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("Header Scroll")}
                </label>
                <Select
                  defaultValue={headerPosition}
                  value={headerPosition}
                  onValueChange={(e) => {
                    dispatch(setHeaderPosition(e))
                    // dispatch(updateHeaderPosition(e))
                }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Header scroll" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                    <SelectItem value={"absolute"}>
                      {t("Fixed")}
                    </SelectItem>
                    <SelectItem value={"relative"}>
                      {t("Scroll")}
                    </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 flex flex-row items-center space-x-2">
                <label
                  htmlFor="primarycolor"
                  className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("Primary Color")}
                </label>
                <Input
                  value={primaryColor || defaultPrimaryColor}
                  onChange={(e) => {
                    // dispatch(setPartialStyles({general: { primaryColor: e.target.value}}))
                    // handleColorChange(e)
                    handleStyleChangeDebounced({
                      general: { primaryColor: e.target.value },
                    })
                  }}
                  className=" basis-1/3"
                  type={"color"}
                  id="primarycolor"
                />
              </div>

              <div className="col-span-2 flex flex-row items-center space-x-2">
                <label
                  htmlFor="secondarycolor"
                  className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("Secondary Color")}
                </label>
                <Input
                  value={secondaryColor || defaultSecondaryColor}
                  onChange={(e) => {
                    // handleStyleChange({general: { secondaryColor: e.target.value}})
                    handleStyleChangeDebounced({
                      general: { secondaryColor: e.target.value },
                    })
                  }}
                  className=" basis-1/3"
                  type={"color"}
                  id="secondarycolor"
                />
              </div>

              <div className="col-span-2 flex flex-row items-center space-x-2">
                <label
                  htmlFor="backgroundcolor"
                  className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("Background Color")}
                </label>
                <Input
                  value={backgroundColor || defaultBackgroundColor}
                  onChange={(e) => {
                    // dispatch(setBackgroundColor(e.target.value))
                    handleStyleChangeDebounced({
                      general: { backgroundColor: e.target.value },
                    })
                    // dispatch({type: "APPLY_THEME_BACKGROUND_AND_CYCLE_SCREENS", payload: e.target.value})
                  }}
                  className=" basis-1/3"
                  type={"color"}
                  id="backgroundcolor"
                />
              </div>

              <div className="col-span-2 flex flex-col items-center space-y-2">
                <label
                  htmlFor="backgroundimage"
                  className="basis-full self-start text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("Background Image")}
                </label>
                {/* <Input
                  onChange={handleFileChange}
                  multiple={false}
                  className="basis-full"
                  type={"file"}
                  placeholder="Upload Image"
                  accept="image/*"
                  id="backgroundimage"
                /> */}
                <ImageUpload
                  onUploadComplete={handleUploadComplete}
                  backgroundImage={backgroundImage}
                  removeSelectedImage={removeSelectedImage}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
              <span className="text-sm font-medium">{t("Text")} </span>
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-4 p-2">
              <FontSelector
                fontList={primaryFonts}
                selectedFont={primaryFont}
                defaultFont={defaultPrimaryFont}
                handleFontChange={(value) => {
                  handleStyleChange({ text: { primaryFont: value } })
                }}
                label="Primary Font"
                open={open}
                setOpen={setOpen}
              />

              <FontSelector
                fontList={secondaryFonts}
                selectedFont={secondaryFont}
                defaultFont={defaultSecondaryFont}
                handleFontChange={(value) => {
                  handleStyleChange({ text: { secondaryFont: value } })
                }}
                label="Secondary Font"
                open={secondaryOpen}
                setOpen={setSecondaryOpen}
              />

              <div className="col-span-2 flex flex-row items-center space-x-2">
                <label
                  htmlFor="primarytextcolor"
                  className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("Primary Text Color")}
                </label>
                <Input
                  value={primaryTextColor || defaultPrimaryTextColor}
                  onChange={(e) => {
                    handleStyleChangeDebounced({
                      text: { primaryColor: e.target.value },
                    })
                    // handleApplyTheme({text: { primaryColor: e.target.value}})
                  }}
                  className=" basis-1/3"
                  type={"color"}
                  id="primarytextcolor"
                />
              </div>

              <div className="col-span-2 flex flex-row items-center space-x-2">
                <label
                  htmlFor="primarytextcolor"
                  className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("Secondary Text Color")}
                </label>
                <Input
                  value={secondaryTextColor || defaultSecondaryTextColor}
                  onChange={(e) => {
                    handleStyleChangeDebounced({
                      text: { secondaryColor: e.target.value },
                    })
                    // handleApplyTheme({text: { secondaryColor: e.target.value}})
                  }}
                  className=" basis-1/3"
                  type={"color"}
                  id="secondarytextcolor"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </>
  )
}
