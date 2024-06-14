// import React, { useEffect, useState } from "react"
// import { useNode } from "@/lib/craftjs"
// import ContentEditable from "react-contenteditable"

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Slider } from "@/components/ui/slider"

// import { Input } from "@/components/ui/input"
// import { Controller } from "../settings/controller.component"

// export const UserTextSettings = () => {
//   const {
//     actions: { setProp },
//     props: {
//       fontSize,
//       fontWeight,
//       text,
//       textAlign,
//       marginLeft,
//       marginRight,
//       marginTop,
//       marginBottom,
//       textColor,
//       tagType,
//     },
//   } = useNode((node) => ({
//     props: node.data.props,
//   }))

//   return (
//     <Accordion type="single" collapsible className="w-full">
//       <AccordionItem value="item-1">
//         <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
//           <span className="text-sm font-medium">Teleloy</span>
//         </AccordionTrigger>
//         <AccordionContent className="flex flex-col gap-2 p-2">
//           <div className="style-control flex flex-col gap-2 pb-4 pt-2">
//             <p className="text-md text-muted-foreground">Type</p>
//             <Select
//               defaultValue={tagType}
//               onValueChange={(e) => {
//                 setProp((props) => (props.tagType = e), 1000)
//               }}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select text type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectItem value="p">Paragraph</SelectItem>
//                   <SelectItem value="span">Span</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="style-control flex flex-col gap-2 pb-4 pt-2">
//             <p className="text-md text-muted-foreground">Font Size</p>
//             <Input
//               type="number"
//               value={fontSize}
//               placeholder={fontSize}
//               max={100}
//               min={0}
//               className="w-full"
//               onChange={(e) =>
//                 setProp((props) => (props.fontSize = e.target.value), 1000)
//               }
//             />
//           </div>
//           <div className="style-control flex flex-col gap-2 pb-4 pt-2">
//             <p className="text-md text-muted-foreground">Font Weight</p>
//             <Select
//               value={fontWeight}
//               onValueChange={(e) => {
//                 setProp((props) => (props.fontWeight = e), 1000)
//               }}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select font weight" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Font Weight</SelectLabel>
//                   <SelectItem value="100">Test1</SelectItem>
//                   <SelectItem value="400">Normal</SelectItem>
//                   <SelectItem value="500">Medium</SelectItem>
//                   <SelectItem value="600">Semi-bold</SelectItem>
//                   <SelectItem value="700">Bold</SelectItem>
//                   <SelectItem value="800">Extra bold</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="style-control flex flex-col gap-2 pb-4 pt-2">
//             <p className="text-md text-muted-foreground">Align</p>
//             <RadioGroup
//               defaultValue="left"
//               onValueChange={(event) => {
//                 setProp((props) => (props.textAlign = event), 1000)
//               }}
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="left" id="r1" />
//                 <Label htmlFor="r1">Left</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="center" id="r2" />
//                 <Label htmlFor="r2">Center</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="right" id="r3" />
//                 <Label htmlFor="r3">Right</Label>
//               </div>
//             </RadioGroup>
//           </div>
//         </AccordionContent>
//       </AccordionItem>
//       <AccordionItem value="item-2">
//         <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
//           <span className="text-sm font-medium">Margin</span>
//         </AccordionTrigger>
//         <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
//           <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
//             <p className="text-md text-muted-foreground">Left</p>
//             <Input
//               type="number"
//               placeholder={marginLeft}
//               max={100}
//               min={0}
//               className="w-full"
//               onChange={(e) =>
//                 setProp((props) => (props.marginLeft = e.target.value), 1000)
//               }
//             />
//           </div>
//           <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
//             <p className="text-md text-muted-foreground">Top</p>
//             <Input
//               type="number"
//               placeholder={marginTop}
//               max={100}
//               min={0}
//               className="w-full"
//               onChange={(e) =>
//                 setProp((props) => (props.marginTop = e.target.value), 1000)
//               }
//             />
//           </div>
//           <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
//             <p className="text-md text-muted-foreground">Right</p>
//             <Input
//               type="number"
//               placeholder={marginRight}
//               max={100}
//               min={0}
//               className="w-full"
//               onChange={(e) =>
//                 setProp((props) => (props.marginRight = e.target.value), 1000)
//               }
//             />
//           </div>
//           <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
//             <p className="text-md text-muted-foreground">Bottom</p>
//             <Input
//               type="number"
//               placeholder={marginBottom}
//               max={100}
//               min={0}
//               className="w-full"
//               onChange={(e) =>
//                 setProp((props) => (props.marginBottom = e.target.value), 1000)
//               }
//             />
//           </div>
//         </AccordionContent>
//       </AccordionItem>
//       <AccordionItem value="item-3">
//         <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
//           <span className="text-sm font-medium">Appearance</span>
//         </AccordionTrigger>
//         <AccordionContent className="flex flex-col gap-y-2 p-2">
//           <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
//             <p className="text-md text-muted-foreground">Text</p>
//             <Input
//               type="color"
//               value={textColor}
//               onChange={(e) => {
//                 setProp((props) => (props.textColor = e.target.value), 1000)
//               }}
//             />
//           </div>
//         </AccordionContent>
//       </AccordionItem>
//     </Accordion>
//   )
// }

import React, { useCallback, useEffect } from "react"
import { debounce, throttle } from "lodash"
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceBetween,
  MoveHorizontal,
} from "lucide-react"
import { useTranslations } from "next-intl"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useNode } from "@/lib/craftjs"
import {
  useScreenNames,
  useScreensLength,
} from "@/lib/state/flows-state/features/screenHooks"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button as CustomButton } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Checkbox } from "@/components/custom-checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/custom-select"
import { Slider } from "@/components/custom-slider"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/custom-tabs"

import { Controller } from "../settings/controller.component"
import useButtonThemePresets from "./useTextThemePresets"
import { TextInputDefaultProps, UserTextInputGen } from "./user-text.component"

export const UserTextInputSettings = () => {
  const t = useTranslations("Components")
  const screenNames = useScreenNames()
  const screensLength = useScreensLength()
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
      enableIcon,
      props,
      size,
      buttonSize,
      containerBackground,
      background,
      backgroundHover,
      colorHover,
      color,
      text,
      custom,
      icon,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      radius,
      flexDirection,
      alignItems,
      justifyContent,
      gap,
      border,
      borderColor,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      width,
      height,
      settingsTab,
      preset,
      tracking,
      trackingEvent,
      nextScreen,
      buttonAction,
      fontWeight,
      fontSize,
      tagType,
      textColor,
      textAlign,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const { filledPreset, outLinePreset } = useButtonThemePresets()
  const addPresetStyles = (preset) => {
    const staticStyles = [
      "buttonSize",
      "settingsTab",
      "containerBackground",
      "text",
      "icon",
      "enableIcon",
      "size",
      "fullWidth",
      "width",
      "height",
      "paddingLeft",
      "justifyContent",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "flexDirection",
      "alignItems",
      "gap",
      "marginLeft",
      "marginTop",
      "marginRight",
      "marginBottom",
      "fontWeight",
      "fontSize",
      "tagType",
      "textColor",
      "textAlign",
    ]
    setProp((props) => {
      Object.keys(preset).forEach((key) => {
        if (!staticStyles.includes(key)) props[key] = preset[key]
      })
    }, 1000)
  }

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

  const themeBackgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )

  return (
    <>
      <Accordion
        value={settingsTab}
        onValueChange={(value) => {
          setProp((props) => (props.settingsTab = value), 200)
        }}
        type="multiple"
        defaultValue={["design"]}
        className="w-full mb-10"
      >
        <AccordionItem value="design">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Design")} </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-4 p-2">
            <div className="flex flex-row items-center col-span-2 space-x-2">
              <label
                htmlFor="backgroundcolor"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-2/3"
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
              <p className="text-md text-muted-foreground">
                {t("Button Size")}
              </p>
              <Tabs
                value={buttonSize}
                defaultValue={buttonSize}
                onValueChange={(value) => {
                  setProp((props) => (props.buttonSize = value), 1000)
                }}
                className="flex-1"
              >
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="small">{t("S")}</TabsTrigger>
                  <TabsTrigger value="medium">{t("M")}</TabsTrigger>
                  <TabsTrigger value="large">{t("L")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <p className="text-md text-muted-foreground">
                {t("Content Align")}
              </p>
              <Tabs
                value={justifyContent}
                defaultValue={justifyContent}
                onValueChange={(value) => {
                  setProp((props) => (props.justifyContent = value), 1000)
                }}
                className="flex-1"
              >
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="start">
                    <AlignHorizontalJustifyStart />
                  </TabsTrigger>
                  <TabsTrigger value="center">
                    <AlignHorizontalJustifyCenter />
                  </TabsTrigger>
                  <TabsTrigger value="end">
                    <AlignHorizontalJustifyEnd />
                  </TabsTrigger>
                  <TabsTrigger value="space-between">
                    <AlignHorizontalSpaceBetween />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-1">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Typography</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2 p-2">
            {/* <div className="style-control flex flex-col gap-2 pb-4 pt-2">
              <p className="text-md text-muted-foreground">Type</p>
              <Select
                defaultValue={tagType}
                onValueChange={(e) => {
                  setProp((props) => (props.tagType = e), 1000)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select text type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="p">Paragraph</SelectItem>
                    <SelectItem value="span">Span</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div> */}
            <div className="style-control flex flex-col gap-2 pb-4 pt-2">
              <p className="text-md text-muted-foreground">Font Size</p>
              {/* <Input
                type="number"
                value={fontSize}
                placeholder={fontSize}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.fontSize = e.target.value), 1000)
                }
              /> */}
              <Slider
                className=""
                defaultValue={[fontSize]}
                value={[fontSize]}
                max={100}
                min={0}
                step={1}
                onValueChange={(e) => handlePropChangeDebounced("fontSize", e)}
              />

            </div>
            <div className="style-control flex flex-col gap-2 pb-4 pt-2">
              <p className="text-md text-muted-foreground">Font Weight</p>
              <Select
                value={fontWeight}
                onValueChange={(e) => {
                  setProp((props) => (props.fontWeight = e), 1000)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select font weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Font Weight</SelectLabel>
                    <SelectItem value="100">Thin</SelectItem>
                    <SelectItem value="400">Normal</SelectItem>
                    <SelectItem value="500">Medium</SelectItem>
                    <SelectItem value="600">Semi-bold</SelectItem>
                    <SelectItem value="700">Bold</SelectItem>
                    <SelectItem value="800">Extra bold</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="spacing">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Spacing")} </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <p className="text-md text-muted-foreground">{t("Width")}</p>
              <Tabs
                value={size}
                defaultValue={size}
                onValueChange={(value) => {
                  setProp((props) => (props.size = value), 1000)
                }}
                className="flex-1"
              >
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="small">{t("S")}</TabsTrigger>
                  <TabsTrigger value="medium">{t("M")}</TabsTrigger>
                  <TabsTrigger value="large">{t("L")}</TabsTrigger>
                  <TabsTrigger value="full">
                    <MoveHorizontal />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
                <Label htmlFor="marginTop">{t("Top")}</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
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
                onValueChange={(e) => handlePropChangeDebounced("marginTop", e)}
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
                <Label htmlFor="marginTop">{t("Bottom")}</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
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
                  // setProp((props) => (props.marginBottom = e),200)
                  // handlePropChange("marginBottom",e)
                  handlePropChangeDebounced("marginBottom", e)
                }
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
                <Label htmlFor="marginTop">{t("Right")}</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
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
                  // setProp((props) => (props.marginRight = e),200)
                  // handlePropChange("marginRight",e)
                  handlePropChangeDebounced("marginRight", e)
                }
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
                <Label htmlFor="marginTop">{t("Left")}</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
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
                  // setProp((props) => (props.marginLeft = e),200)
                  // handlePropChange("marginLeft",e)
                  handlePropChangeDebounced("marginLeft", e)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
