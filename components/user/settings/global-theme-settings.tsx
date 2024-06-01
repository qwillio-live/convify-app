import React, { useCallback, useEffect, useState } from "react"
import { throttle } from "lodash"
import { FONTS } from "@/lib/state/flows-state/features/theme/fonts"
import {
  setBackgroundColor,
  setPartialStyles,
} from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { applyThemeBackgroundAndCycleScreens } from "@/lib/state/flows-state/features/sagas/themeScreen.saga"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Props = {}

export const GlobalThemeSettings = (props: Props) => {
  const [open, setOpen] = useState(false)
  const [secondaryOpen, setSecondaryOpen] = useState(false)

  const dispatch = useAppDispatch()

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
  const defaultBackgroundColor = useAppSelector(
    (state) => state.theme?.defaultGeneral?.backgroundColor
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

  return (
    <>
      <ScrollArea>
        <Accordion type="single" defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
              <span className="text-sm font-medium">General </span>
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
              <div className="col-span-2 flex flex-row items-center space-x-2">
                <label
                  htmlFor="primarycolor"
                  className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Primary Color
                </label>
                <Input
                  value={primaryColor || defaultPrimaryColor}
                  onChange={(e) => {
                    // dispatch(setPartialStyles({general: { primaryColor: e.target.value}}))
                    // handleColorChange(e)
                    handleStyleChange({
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
                  Secondary Color
                </label>
                <Input
                  value={secondaryColor || defaultSecondaryColor}
                  onChange={(e) => {
                    handleStyleChange({
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
                  Background Color
                </label>
                <Input
                  value={backgroundColor || defaultBackgroundColor}
                  onChange={(e) => {
                    // dispatch(setBackgroundColor(e.target.value))
                    handleStyleChange({
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
                  Background Image
                </label>
                <Input
                  onChange={handleFileChange}
                  multiple={false}
                  className="basis-full"
                  type={"file"}
                  placeholder="Upload Image"
                  accept="image/*"
                  id="backgroundimage"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
              <span className="text-sm font-medium">Text </span>
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-4 p-2">
              <div className="col-span-2 flex flex-col items-center space-y-2">
                <label
                  htmlFor="primaryfont"
                  className="basis-full self-start text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Primary Font
                </label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="flex w-full items-center justify-between"
                    >
                      {primaryFont
                        ? primaryFonts?.find(
                            (font) => font.variable === primaryFont
                          )?.name
                        : "Select primary font"}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <ScrollArea className="h-72 rounded-md border">
                      <Command>
                        <CommandInput placeholder="Search font..." />
                        <CommandEmpty>No font found.</CommandEmpty>
                        <CommandGroup>
                          {primaryFonts?.map((font) => (
                            <CommandItem
                              key={font.variable}
                              value={font.variable}
                              onSelect={(currentValue) => {
                                handleStyleChange({
                                  text: { primaryFont: currentValue },
                                })
                                setOpen(false)
                              }}
                              style={{ fontFamily: `var(${font.variable})` }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-4",
                                  primaryFont === font.variable
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {font.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="col-span-2 flex flex-col items-center space-y-2">
                <label
                  htmlFor="secondaryfont"
                  className="basis-full self-start text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Secondary Font
                </label>
                <Popover open={secondaryOpen} onOpenChange={setSecondaryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="flex w-full items-center justify-between"
                    >
                      {secondaryFont
                        ? secondaryFonts?.find(
                            (font) => font.variable === secondaryFont
                          )?.name
                        : "Select secondary font"}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <ScrollArea className="h-72 rounded-md border">
                      <Command>
                        <CommandInput placeholder="Search font..." />
                        <CommandEmpty>No font found.</CommandEmpty>
                        <CommandGroup>
                          {secondaryFonts?.map((font) => (
                            <CommandItem
                              key={font.variable}
                              value={font.variable}
                              onSelect={(currentValue) => {
                                handleStyleChange({
                                  text: { secondaryFont: currentValue },
                                })
                                setSecondaryOpen(false)
                              }}
                              style={{ fontFamily: `var(${font.variable})` }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-4",
                                  secondaryFont === font.variable
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {font.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="col-span-2 flex flex-row items-center space-x-2">
                <label
                  htmlFor="primarytextcolor"
                  className="basis-2/3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Primary Text Color
                </label>
                <Input
                  value={primaryTextColor || defaultPrimaryTextColor}
                  onChange={(e) => {
                    handleStyleChange({
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
                  Secondary Text Color
                </label>
                <Input
                  value={secondaryTextColor || defaultSecondaryTextColor}
                  onChange={(e) => {
                    handleStyleChange({
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
