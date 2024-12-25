import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react"
import { debounce, throttle } from "lodash"
import { useTranslations } from "next-intl"

import {
  GlobalThemeState,
  setHeaderPosition,
  setPartialStyles,
} from "@/lib/state/flows-state/features/theme/globalThemeSlice"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/custom-select"
import { applyHeaderPosition } from "@/lib/state/flows-state/features/sagas/themeScreen.saga"
import { updateHeaderPosition } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { X } from "lucide-react"
import clsx from "clsx"
import { Label } from "@/components/ui/label"
import { useEditor } from "@craftjs/core"
import { updateElementProps } from "./utils"
import { Switch } from "@/components/custom-switch"
import { ColorInput } from "@/components/color-input"

type Props = {}

export const GlobalThemeSettings = (props: Props) => {
  const { actions, query } = useEditor()

  const [open, setOpen] = useState(false)
  const [secondaryOpen, setSecondaryOpen] = useState(false)
  // const [isPickerVisible, setPickerVisible] = useState(false)

  const dispatch = useAppDispatch()

  const t = useTranslations("Components")

  // const [image, setImage] = useState<string>("")

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

  const showCookieConsentPopup = useAppSelector(
    (state) => state.theme?.general?.showCookieConsentPopup
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
  // const screens = useAppSelector((state: RootState) => state?.screen?.screens)

  // const handleApplyTheme = (themeStyles) => {
  //   dispatch({ type: "APPLY_THEME_AND_CYCLE_SCREENS", payload: themeStyles })
  // }

  // const handleFileChange = (e) => {
  //   if (!e?.target?.files?.length) return
  //   const file = e?.target?.files[0]
  //   const objectUrl = URL.createObjectURL(file)

  //   dispatch(setPartialStyles({ general: { backgroundImage: objectUrl } }))
  // }

  const throttledDispatch = useCallback(
    throttle((value) => {
      dispatch(setPartialStyles(value))
    }, 200), // Throttle to 200ms
    [dispatch]
  )

  const handleStyleChange = (style) => {
    throttledDispatch(style)
    changeGlobalStyle(style)
  }

  const changeGlobalStyle = (style: GlobalThemeState) => {
    // console.log("style", style)
    // console.log("nodes", query.getNodes())
    const textNodes = query.getNodes()

    Object.values(textNodes).forEach((node) => {
      updateElementProps(node, actions, style)
    })
  }

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
    changeGlobalStyle(style)
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

  // console.log('bg color, default bg"', backgroundColor, defaultBackgroundColor)
  return (
    <>
      <ScrollArea>
        <Accordion
          type="multiple"
          defaultValue={["item-1"]}
          className="font-poppins bg-[#f6f6f6] p-4 pt-0"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("General")}</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="col-span-2 flex flex-row items-center space-x-2">
                <label
                  htmlFor="headerscroll"
                  className="basis-2/3 whitespace-nowrap text-nowrap text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                      <SelectItem value={"absolute"}>{t("Fixed")}</SelectItem>
                      <SelectItem value={"relative"}>{t("Scroll")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="primarycolor">{t("Primary Color")}</Label>
                <ColorInputWrapper
                  defaultValue={defaultPrimaryColor}
                  value={primaryColor}
                  onColorChange={(e) => {
                    // dispatch(setPartialStyles({general: { primaryColor: e.target.value}}))
                    // handleColorChange(e)
                    handleStyleChangeDebounced({
                      general: { primaryColor: e },
                    })
                  }}
                  id="primarycolor"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="secondarycolor">{t("Secondary Color")}</Label>
                <ColorInputWrapper
                  defaultValue={defaultSecondaryColor}
                  value={secondaryColor}
                  onColorChange={(e) => {
                    // handleStyleChange({general: { secondaryColor: e.target.value}})
                    handleStyleChangeDebounced({
                      general: { secondaryColor: e },
                    })
                  }}
                  id="secondarycolor"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="backgroundcolor">{t("Background Color")}</Label>
                <ColorInputWrapper
                  value={backgroundColor}
                  onColorChange={(e) => {
                    // dispatch(setBackgroundColor(e.target.value))
                    handleStyleChangeDebounced({
                      general: { backgroundColor: e },
                    })
                    // dispatch({type: "APPLY_THEME_BACKGROUND_AND_CYCLE_SCREENS", payload: e.target.value})
                  }}
                  id="backgroundcolor"
                />
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="backgroundimage">{t("Background Image")}</Label>
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
              <div className="space-y-2 pt-2">
                {/* <Input
                  onChange={handleFileChange}
                  multiple={false}
                  className="basis-full"
                  type={"file"}
                  placeholder="Upload Image"
                  accept="image/*"
                  id="backgroundimage"
                /> */}
                <div className="flex items-center justify-between gap-2 pb-2">
                  <span className="text-xs">{t("Cookie consent popup")}</span>
                  <Switch
                    checked={showCookieConsentPopup}
                    onCheckedChange={checked => {
                      handleStyleChangeDebounced({
                        general: { showCookieConsentPopup: checked },
                      })
                    }}
                  />
                </div>
                {showCookieConsentPopup &&
                  (<span className="text-muted-foreground text-xs mt-4">
                    {t("The popup will appear when the page loads")}
                  </span>)}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{t("Text")}</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <FontSelector
                fontList={primaryFonts}
                selectedFont={primaryFont}
                defaultFont={defaultPrimaryFont}
                handleFontChange={(value) => {
                  handleStyleChange({ text: { primaryFont: value } })
                }}
                label={t("Primary Font")}
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
                label={t("Secondary Font")}
                open={secondaryOpen}
                setOpen={setSecondaryOpen}
              />

              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="primarytextcolor">
                  {t("Primary Text Color")}
                </Label>
                <ColorInputWrapper
                  defaultValue={defaultPrimaryTextColor}
                  value={primaryTextColor}
                  onColorChange={(e) => {
                    handleStyleChangeDebounced({
                      text: { primaryColor: e },
                    })
                    // handleApplyTheme({text: { primaryColor: e.target.value}})
                  }}
                  id="primarytextcolor"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="secondarytextcolor">
                  {t("Secondary Text Color")}
                </Label>
                <ColorInputWrapper
                  defaultValue={defaultSecondaryTextColor}
                  value={secondaryTextColor}
                  onColorChange={(e) => {
                    handleStyleChangeDebounced({
                      text: { secondaryColor: e },
                    })
                    // handleApplyTheme({text: { secondaryColor: e.target.value}})
                  }}
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

interface ColorInputProps extends React.HTMLProps<HTMLInputElement> {
  value?: string
  onColorChange?: (color: string | undefined) => void
}

export const ColorInputWrapper = ({
  value,
  onColorChange,
  ...rest
}: ColorInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onColorChange?.(e.target.value)
  }
  const handleRemove = () => {
    onColorChange?.(rest.defaultValue as string)
  }
  return (
    <ColorInput
      value={value ?? "transparent"}
      handleChange={handleChange}
      handleRemove={value === rest.defaultValue ? undefined : handleRemove}
      {...rest}
    />
  )
}
