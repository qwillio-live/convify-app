import React, { useState } from "react"
import ConvifyLogo from "@/assets/convify_logo_black.png"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import { ArrowRight, GripVertical, Image, UploadCloud } from "lucide-react"
import ContentEditable from "react-contenteditable"

import { useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button as CustomButton } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useScreenNames, useScreensLength } from "@/lib/state/flows-state/features/screenHooks"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"

enum SWITCH {
  SINGLE = "single",
  MULTIPLE = "multiple",
}
export const MultipleChoiceSettings = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [setUploadedFile, uploadedFile] = React.useState<string | null>(null)
  const {
    actions: { setProp },
    props: {
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      background,
      radius,
      width,
      multipleChoices,
      singleChoice,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProp((props) => (props.src = URL.createObjectURL(file)), 1000)
    }
  }

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
    ) || "";

    const nextScreenId =
    useAppSelector(
      (state: RootState) =>
        state?.screen?.screens[
          selectedScreen + 1 < (screensLength || 0) ? selectedScreen + 1 : 0
        ]?.screenId
    ) || "";

  return (
    <>
      <Card className="p-2">
        <CardHeader className="p-2">
          <CardTitle>Content</CardTitle>
          <CardDescription>Drag to re-arrange click to edit</CardDescription>

          <Separator className="my-4 w-full" />
          <span>Selection</span>
          <div className="flex items-center space-x-2">
            <Label htmlFor="selection">Single </Label>

            <Switch
              onCheckedChange={(e) =>
                setProp((props) => (props.singleChoice = !props.singleChoice))
              }
              id="selection"
            />
            <Label htmlFor="selection">Multiple</Label>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Reorder.Group
            axis="y"
            values={multipleChoices}
            className="flex w-full flex-col gap-2 py-4"
            onReorder={(e) => setProp((props) => (props.multipleChoices = e))}
          >
            {multipleChoices?.map((item, index) => (
              <div>
              <MultipleChoiceSettingsItem
                key={item.id}
                item={item}
                index={index}
                singleChoice={singleChoice}
                screenNames={screenNames}
                nextScreenName={nextScreenName}
                nextScreenId={nextScreenId}
              />
              </div>
            ))}
          </Reorder.Group>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">General </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Width</p>
              <Input
                type={"number"}
                defaultValue={width}
                placeholder={width}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.width = e.target.value))
                }
              />
            </div>

            <Separator className="my-4 w-full basis-full" />

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Background</p>
              <Input
                type={"color"}
                defaultValue={background}
                placeholder={background}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.background = e.target.value))
                }
              />
            </div>

            <Separator className="my-4 w-full" />

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Border Radius</p>
              <Input
                type={"number"}
                defaultValue={radius}
                placeholder={radius}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.radius = e.target.value))
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Colors</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Text</p>
              <Input
                type={"color"}
                defaultValue={`#${multipleChoices.textColor}`}
                placeholder={multipleChoices.textColor}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) =>
                      (props.multipleChoiceStyles.textColor = e.target.value)
                  )
                }
              />
            </div>

            <Separator className="my-4 w-full" />

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Background</p>
              <Input
                type={"color"}
                defaultValue={multipleChoices.background}
                placeholder={multipleChoices.background}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) =>
                      (props.multipleChoiceStyles.background = e.target.value)
                  )
                }
              />
            </div>

            <Separator className="my-4 w-full" />

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Border</p>
              <Input
                type={"color"}
                defaultValue={multipleChoices.borderColor}
                placeholder={multipleChoices.borderColor}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) =>
                      (props.multipleChoiceStyles.borderColor = e.target.value)
                  )
                }
              />
            </div>

            <Separator className="my-4 w-full" />

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Hover Text</p>
              <Input
                type="color"
                value={multipleChoices.hoverTextColor}
                placeholder={multipleChoices.hoverTextColor}
                onChange={(e) =>
                  setProp(
                    (props) =>
                      (props.multipleChoiceStyles.hoverTextColor =
                        e.target.value)
                  )
                }
              />
            </div>

            <Separator className="my-4 w-full" />

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Hover Background</p>
              <Input
                type={"color"}
                defaultValue={multipleChoices.hoverBackground}
                placeholder={multipleChoices.hoverBackground}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) =>
                      (props.multipleChoiceStyles.hoverBackground =
                        e.target.value)
                  )
                }
              />
            </div>

            <Separator className="my-4 w-full" />

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Hover Border</p>
              <Input
                type={"color"}
                defaultValue={`#${multipleChoices.hoverBorderColor}`}
                placeholder={multipleChoices.hoverBorderColor}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) =>
                      (props.multipleChoiceStyles.hoverBorderColor =
                        e.target.value)
                  )
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
export const MultipleChoiceSettingsItem = ({ item, index,singleChoice,screenNames,nextScreenName, nextScreenId }) => {
  const y = useMotionValue(0)
  const controls = useDragControls()
  const inputRef = React.useRef<HTMLInputElement>(null)
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (file) {
  //     setProp(
  //       (props) => (props.pictureItems[index].pic = URL.createObjectURL(file)),
  //       1000
  //     )
  //     setProp(
  //       (props) => (
  //         (props.pictureItems[index].itemType = ItemType.PICTURE), 1000
  //       )
  //     )
  //   }
  // }
  const {
    actions: { setProp },
    props: { pictureItems, tagLine, containerStyles, pictureItemsStyles },
  } = useNode((node) => ({
    props: node.data.props,
  }))
  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={item}
      id={item.id}
      style={{ y }}
      key={item}
      className="flex w-full  flex-row items-center justify-between gap-3 border p-4"
    >
      <Input
        type="file"
        className="hidden"
        ref={inputRef}
        // onChange={handleInputChange}
      />
      <div className="flex flex-row flex-wrap items-center gap-3">
        <div
          // onClick={() => (inputRef.current as HTMLInputElement)?.click()}
          className="pic-container hover:cursor-pointer"
        >
          {/* {item.itemType === ItemType.ICON ? (
            <item.pic size={20} className="shrink-0" />
          ) : (
            <img src={item.pic} alt={item.alt || ""} className="w-10 h-10" />
          )} */}
        </div>
        <ContentEditable
          html={item.optionLabel}
          disabled={false}
          onChange={(e) =>
            setProp(
              (props) =>
                (props.multipleChoices[index].optionLabel =
                  e.target.value.replace(/<\/?[^>]+(>|$)/g, "")),
              500
            )
          }
          className="min-w-[100px] max-w-[100px] overflow-hidden truncate"
          tagName={"p"}
        />
        {
          singleChoice && (
            <div className="screen-action-container flex flex-col gap-2">
            <Select
              defaultValue={
                item.buttonAction === "next-screen"
                  ? "next-screen"
                  : item.nextScreen.screenId
              }
              value={
                item.buttonAction === "next-screen"
                  ? "next-screen"
                  : item.nextScreen.screenId
              }
              // onValueChange={(e) => {
              //   if (e === "next-screen") {
              //     setProp(
              //       (props) =>
              //         (props.multipleChoices[index].buttonAction = "next-screen")
              //     )
              //     setProp(
              //       (props) =>
              //         (props.multipleChoices[index].nextScreen = nextScreenName)
              //     )
              //   } else {
              //     setProp(
              //       (props) =>
              //         (props.multipleChoices[index].buttonAction = "custom-action")
              //     )
              //     setProp((props) => (props.multipleChoices[index].nextScreen = e))
              //   }
              // }}
              onValueChange={(e) => {
                if(e === "next-screen") {
                  setProp((props) => (props.multipleChoices[index].buttonAction = "next-screen" ))
                  setProp((props) => (props.multipleChoices[index].nextScreen = {
                    screenId: nextScreenId,
                    screenName: nextScreenName
                  } ))
                } else if(e === "none") {
                  setProp((props) => (props.multipleChoices[index].buttonAction = "none" ))
                  setProp((props) => (props.multipleChoices[index].nextScreen = {
                    screenId: "none",
                    screenName: ""
                  }))

                }else {
                  setProp((props) => (props.multipleChoices[index].buttonAction = "custom-action" ))
                  setProp((props) => (props.multipleChoices[index].nextScreen = {
                    screenId: e,
                    screenName: screenNames?.find(screen => screen.screenId === e)?.screenName
                  }))
                }
          }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select screen" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    value="next-screen"
                  >
                    Next Screen
                  </SelectItem>
                  <SelectItem value="none">
                    Do Nothing
                  </SelectItem>
                  {
                      screenNames?.map((screen,index) => {
                        return (
                          <SelectItem value={screen.screenId}>
                            {index+1} : {screen.screenName}
                          </SelectItem>
                        )
                      })
                      }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          )
        }
      </div>
      <div
        onPointerDown={(e) => controls.start(e)}
        className="reorder-handle hover:cursor-pointer"
      >
        <GripVertical />
      </div>
    </Reorder.Item>
  )
}
