import React from "react"

import { FONTS } from "@/lib/state/flows-state/features/theme/fonts"
import { setPartialStyles } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
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

type Props = {}

export const GlobalThemeSettings = (props: Props) => {
  const dispatch = useAppDispatch()
  const primaryFonts = useAppSelector((state) => state.theme?.primaryFonts)
  const secondaryFonts = useAppSelector((state) => state.theme?.secondaryFonts)
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const secondaryFont = useAppSelector(
    (state) => state.theme?.text?.secondaryFont
  )
  const primaryTextColor = useAppSelector((state) => state.theme?.text?.primaryColor);
  const secondaryTextColor = useAppSelector((state) => state.theme?.text?.secondaryColor);

  const handleApplyTheme = (themeStyles) => {
    dispatch({ type: 'APPLY_THEME_AND_CYCLE_SCREENS', payload: themeStyles });
  };

  return (
    <>
      <ScrollArea>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
              <span className="text-sm font-medium">General </span>
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
              <div className="flex flex-row items-center col-span-2 space-x-2">
                <label
                  htmlFor="primarycolor"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-2/3"
                >
                  Primary Color
                </label>
                <Input
                  className=" basis-1/3"
                  type={"color"}
                  id="primarycolor"
                />
              </div>

              <div className="flex flex-row items-center col-span-2 space-x-2">
                <label
                  htmlFor="secondarycolor"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-2/3"
                >
                  Secondary Color
                </label>
                <Input
                  className=" basis-1/3"
                  type={"color"}
                  id="secondarycolor"
                />
              </div>

              <div className="flex flex-row items-center col-span-2 space-x-2">
                <label
                  htmlFor="backgroundcolor"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-2/3"
                >
                  Background Color
                </label>
                <Input
                  className=" basis-1/3"
                  type={"color"}
                  id="backgroundcolor"
                />
              </div>

              <div className="flex flex-col items-center col-span-2 space-y-2">
                <label
                  htmlFor="backgroundimage"
                  className="text-sm self-start font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-full"
                >
                  Background Image
                </label>
                <Input
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
              <div className="flex flex-col items-center col-span-2 space-y-2">
                <label
                  htmlFor="primaryfont"
                  className="text-sm font-medium self-start leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-full"
                >
                  Primary Font
                </label>
                <Select
                  value={primaryFont}
                  onValueChange={(value) => {
                    dispatch(setPartialStyles({ text: { primaryFont: value } }))
                    // handleApplyTheme({text: { primaryFont: value}})
                  }
                  }
                >
                  <SelectTrigger className="basis-full self-start">
                    <SelectValue placeholder="Primary font" />
                  </SelectTrigger>
                  <SelectContent>
                    {primaryFonts?.map((font, index) => {
                      return (
                        <SelectItem key={index} value={font.variable}>
                          {font.name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-center col-span-2 space-y-2">
                <label
                  htmlFor="secondaryfont"
                  className="text-sm font-medium self-start leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-full"
                >
                  Secondary Font
                </label>
                <Select
                  value={secondaryFont}
                  onValueChange={(value) => {
                    dispatch(
                      setPartialStyles({ text: { secondaryFont: value } })
                    )
                    // handleApplyTheme({text: { secondaryFont: value}})
                  }
                  }
                >
                  <SelectTrigger className="basis-full self-start">
                    <SelectValue placeholder="Secondary font" />
                  </SelectTrigger>
                  <SelectContent>
                    {secondaryFonts?.map((font, index) => {
                      return (
                        <SelectItem key={index} value={font.variable}>
                          {font.name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-row items-center col-span-2 space-x-2">
                <label
                  htmlFor="primarytextcolor"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-2/3"
                >
                  Primary Text Color
                </label>
                <Input
                value={primaryTextColor}
                onChange={(e) =>
                  {
                    dispatch(setPartialStyles({text: { primaryColor: e.target.value}}))
                    // handleApplyTheme({text: { primaryColor: e.target.value}})
                  }

                }
                  className=" basis-1/3"
                  type={"color"}
                  id="primarytextcolor"
                />
              </div>

              <div className="flex flex-row items-center col-span-2 space-x-2">
                <label
                  htmlFor="primarytextcolor"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-2/3"
                >
                  Secondary Text Color
                </label>
                <Input
                value={secondaryTextColor}
                onChange={(e) => {
                  dispatch(setPartialStyles({text: { secondaryColor: e.target.value}}))
                  // handleApplyTheme({text: { secondaryColor: e.target.value}})
                  }
                }
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
