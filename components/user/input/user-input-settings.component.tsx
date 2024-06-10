import React, { useEffect, useCallback,useState } from "react"
import ContentEditable from "react-contenteditable"
import {throttle} from "lodash"
import { useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/custom-tabs"
import { Checkbox } from "@/components/custom-checkbox"
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
} from "@/components/custom-select"
import { Slider } from "@/components/custom-slider"
import { Card } from "@/components/ui/card"
import { Controller } from "../settings/controller.component"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Activity,
  Anchor,
  Aperture,
  ArrowRight,
  Disc,
  DollarSign,
  Mountain,
  MoveHorizontal,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyCenter,
  AlignHorizontalSpaceBetween
} from "lucide-react"
import { cn } from "@/lib/utils"
import useInputThemePresets from "./useInputThemePresets"
import { UserInput, UserInputGen } from "./user-input.component"
import { useTranslations } from "next-intl"

export const UserInputSettings = () => {
  const t = useTranslations("Components")
  const {
    actions: { setProp },
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    textColor,
    width,
    props,
  } = useNode((node) => ({
    props: node.data.props,
    marginLeft: node.data.props.marginLeft,
    marginRight: node.data.props.marginRight,
    marginTop: node.data.props.marginTop,
    marginBottom: node.data.props.marginBottom,
    textColor: node.data.props.textColor,
    width: node.data.props.width,
  }))
  enum PRESETNAMES {
    outlined= "outlined",
    underlined= "underlined"
  }
  const {outlinedPreset, underlinedPreset} = useInputThemePresets();
  const addPresetStyles = (preset) => {
    const staticStyles = ["error","inputRequired","label","placeHolder","backgroundColor","fieldName","floatingLabel","settingsTab","inputValue","icon","enableIcon","size","fullWidth","marginLeft","marginTop","marginRight","marginBottom"]
    setProp((props) => {
      Object.keys(preset).forEach((key) => {
        if(!staticStyles.includes(key))
        props[key] = preset[key]
      })
    }, 1000)
  }
  const throttledSetProp = useCallback(
    throttle((property,value) => {
      setProp((prop) => {prop[property] = value},0);
    }, 200), // Throttle to 50ms to 200ms
    [setProp]
  );

  const handlePropChange = (property,value) => {
    throttledSetProp(property,value);
  };
  return (
    <>
      <Accordion
      value={props.settingsTab || "content"}
      onValueChange={(value) => {
        setProp((props) => (props.settingsTab = value), 200)
      }}
      type="multiple"
      defaultValue={['content']}
      className="w-full">
      <AccordionItem value="content">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Content")}</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-4 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-row gap-1 items-center">
            <Checkbox
            value={props.inputRequired}
            checked={props.inputRequired}
            onCheckedChange={(e) => {
              setProp((props) => (props.inputRequired = e),200)
              // setProp((props) => (props.error = !props.error),200)
            }}
            id="required" />
              <label
                htmlFor="required"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Required")}
              </label>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-row gap-1 items-center">
            <Checkbox
            checked={props.floatingLabel}
            onCheckedChange={(e) => {
              setProp((props) => (props.floatingLabel = e),0)
              // handlePropChange("floatingLabel",e);
            }}
            id="floating-label" />
              <label
                htmlFor="floating-label"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Floating Label")}
              </label>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-1 items-start">
              <label
                htmlFor="label-text"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Label")}
              </label>
              <Input
              value={props.label}
              defaultValue={props.label}
              onChange={(e) => {
                setProp((props) => (props.label = e.target.value), 0)
                // handlePropChange("label",e.target.value);
              }}
              type={"text"}
              placeholder={t("Enter label text")}
              />
            </div>


            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-1 items-start">
              <label
                htmlFor="placeholder-text"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 no-underline decoration-dotted"
              >
                {t("Placeholder")}
              </label>
              <Input
              value={props.placeholder}
              onChange={(e) => {
                setProp((props) => (props.placeholder = e.target.value), 0)
                // handlePropChange("placeholder",e.target.value);
              }}
              type={"text"}
              placeholder={t("Enter placeholder text")}
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-1 items-start">
              <label
                htmlFor="placeholder-text"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 no-underline decoration-dotted"
              >
                {t("Field Name")}
              </label>
              <Input
              value={props.fieldName}
              onChange={(e) => setProp((props) => (props.fieldName = e.target.value), 1000)}
              type={"text"}
              placeholder={t("Enter field name here")}
              />

            </div>

          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="design">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">{t("Design")}</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-2">
          <div className="flex flex-row items-center col-span-2 space-x-2">
              <Checkbox
                className="peer h-4 w-4 shrink-0 rounded-sm border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary"
                checked={props.enableIcon}
                onCheckedChange={(e) => {
                  // setProp((props) => (props.enableIcon = e), 1000)
                  handlePropChange("enableIcon",e);
                }}
                id="enableIcon"
              />
              <label
                htmlFor="enableIcon"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Decorator")}
              </label>
            </div>

          <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-row items-center gap-2">
          {props.enableIcon && (
                <>
                  <p className="text-md flex-1 text-muted-foreground">{t("Icon")}</p>
                  <Select
                    defaultValue={props.icon}
                    onValueChange={(e) => {
                      setProp((props) => (props.icon = e), 1000)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="arrowright">
                          <ArrowRight />
                        </SelectItem>
                        <SelectItem value="aperture">
                          <Aperture />
                        </SelectItem>
                        <SelectItem value="activity">
                          <Activity />
                        </SelectItem>
                        <SelectItem value="dollarsign">
                          <DollarSign />
                        </SelectItem>
                        <SelectItem value="anchor">
                          <Anchor />
                        </SelectItem>
                        <SelectItem value="disc">
                          <Disc />
                        </SelectItem>
                        <SelectItem value="mountain">
                          <Mountain />
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>

            <div className="flex flex-row items-center col-span-2 space-x-2">
                <label
                  htmlFor="backgroundcolor"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-2/3"
                >
                  {t("Background Color")}
                </label>
                <Input
                  // defaultValue={themeBackgroundColor}
                  // value={containerBackground}
                  value={props.backgroundColor}
                  onChange={(e) => {
                    // debouncedSetProp("containerBackground",e.target.value)
                  handlePropChange  ('backgroundColor',e.target.value);
                  }}
                  className="basis-1/3"
                  type={"color"}
                  id="backgroundcolor"
                />
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
                defaultValue={props.size}
                value={props.size}
                onValueChange={(value) => {
                  setProp((props) => (props.size = value), 1000)
                  if(value === 'full') {
                    // setProp((props) => (props.fullWidth = true), 1000)
                  }else{
                    // setProp((props) => (props.fullWidth = false), 1000)
                  }
                }}
               className="flex-1">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger  value="small">{t("S")}</TabsTrigger>
                  <TabsTrigger  value="medium">{t("M")}</TabsTrigger>
                  <TabsTrigger  value="large">{("L")}</TabsTrigger>
                  <TabsTrigger  value="full"><MoveHorizontal /></TabsTrigger>
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
                onValueChange={(e) =>

                  // setProp((props) => (props.marginTop = e),200)
                  handlePropChange("marginTop",e)
                }
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
                  handlePropChange("marginBottom",e)
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
                  handlePropChange("marginRight",e)
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
                  handlePropChange("marginLeft",e)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="styles">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">{t("Styles")}</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-4">
            <Card onClick={() => {
              addPresetStyles(outlinedPreset)
            }}
            className={cn("relative px-2 py-0 hover:cursor-pointer transition-all duration-300", {"border-blue-500" : props.preset === "outlined"})}
            >
              <div className="absolute w-full h-full bg-white-50/0 z-10"></div>
              <UserInputGen {...outlinedPreset} floatingLabel={true} size="full" enableIcon={false} marginLeft="0" marginRight="0" backgroundColor="#fff" label={t("Label")}  />
              </Card>
              <Card onClick={() => {
                addPresetStyles(underlinedPreset)
              }}
              className={cn("relative px-2 py-0 hover:cursor-pointer transition-all duration-300", {"border-blue-500" : props.preset === "underlined"})}
              >
                <div className="absolute w-full h-full bg-white-50/0 z-10"></div>
                <UserInputGen {...underlinedPreset} floatingLabel={true} size="full" enableIcon={false} marginLeft="0" marginRight="0" backgroundColor="#fff" label={t("Label")} />
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
