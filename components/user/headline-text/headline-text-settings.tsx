import React, { useEffect, useState, useCallback } from "react"
import { useNode } from "@/lib/craftjs"
import ContentEditable from "react-contenteditable"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { Slider } from "@/components/ui/slider"

import { Input } from "@/components/ui/input"
import { Controller } from "../settings/controller.component"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoveHorizontal,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs";
import { useTranslations } from "next-intl";
import { debounce } from 'lodash';
import { useAppSelector } from "@/lib/state/flows-state/hooks";

export const HeadlineTextSettings = () => {
  const t = useTranslations("Components");
  const {
    actions: { setProp },
    fontSize,
    fontWeight,
    text,
    textAlign,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    textColor,
    tagType,
    // justifyContent,
    containerBackground,
    containerSize,
  } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    fontWeight: node.data.props.fontWeight,
    textAlign: node.data.props.textAlign,
    marginLeft: node.data.props.marginLeft,
    marginRight: node.data.props.marginRight,
    marginTop: node.data.props.marginTop,
    marginBottom: node.data.props.marginBottom,
    textColor: node.data.props.textColor,
    tagType: node.data.props.tagType,
    // justifyContent: node.data.props.justifyContent,
    containerBackground: node.data.props.containerBackground,
    containerSize: node.data.props.containerSize,
  }))

  const [localMarginTop, setLocalMarginTop] = useState(marginTop.value);
  useEffect(() => {
    setLocalMarginTop(marginTop.value);
  }, [marginTop]);

  const [localMarginBottom, setLocalMarginBottom] = useState(marginBottom.value);
  useEffect(() => {
    setLocalMarginBottom(marginTop.value);
  }, [marginBottom]);

  const [localMarginRight, setLocalMarginRight] = useState(marginRight.value);
  useEffect(() => {
    setLocalMarginRight(marginRight.value);
  }, [marginRight]);

  const [localMarginLeft, setLocalMarginLeft] = useState(marginLeft.value);
  useEffect(() => {
    setLocalMarginLeft(marginLeft.value);
  }, [marginLeft]);

  const [localFontSize, setLocalFontSize] = useState(fontSize.value);
  useEffect(() => {
    setLocalFontSize(fontSize.value);
  }, [fontSize]);

  const debouncedSetProp = useCallback(
    debounce((property, value) => {
      setProp((props) => { props[property] = value }, 0);
    }), [setProp]
  );

  const handlePropChangeDebounced = useCallback(
    debounce((property, value) => {
      setProp((props) => {
        props[property] = value; // Update directly in the props
      });
    }, 1000),
    [setProp]
  );

  const themeBackgroundColor = useAppSelector((state) => state?.theme?.general?.backgroundColor)
  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Typography </span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2 p-2">
            <div className="style-control flex flex-col gap-2 pb-4 pt-2">
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
                    <SelectItem value="h1">Heading 1</SelectItem>
                    <SelectItem value="h2">Heading 2</SelectItem>
                    <SelectItem value="h3">Heading 3</SelectItem>
                    <SelectItem value="h4">Heading 4</SelectItem>
                    <SelectItem value="h5">Heading 5</SelectItem>
                    <SelectItem value="h6">Heading 6</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="style-control flex flex-col gap-2 pb-4 pt-2">
              <div className="flex justify-between items-center">
                <p className="text-md text-muted-foreground">Font Size</p>
                <span className="text-md text-muted-foreground">{localFontSize}px</span>
              </div>
              <Slider
                value={[localFontSize]}
                onValueChange={(value) => {
                  setLocalFontSize(value[0])
                  debouncedSetProp("fontSize", { value: value[0], isCustomized: true, globalStyled: false })
                }}
                min={12}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="style-control flex flex-col gap-2 pb-4 pt-2">
              <p className="text-md text-muted-foreground">Font Weight</p>
              <Select
                defaultValue={fontWeight.value}
                onValueChange={(e) => {
                  setProp((props) => (props.fontWeight.value = e), 1000)
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

            {/* <div className="style-control flex flex-col gap-2 pb-4 pt-2">
              <p className="text-md text-muted-foreground">Align</p>
              <RadioGroup
                defaultValue="left"
                onValueChange={(event) => {
                  setProp((props) => (props.textAlign.value = event), 1000)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="left" id="r1" />
                  <Label htmlFor="r1">Left</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="center" id="r2" />
                  <Label htmlFor="r2">Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="right" id="r3" />
                  <Label htmlFor="r3">Right</Label>
                </div>
              </RadioGroup>
            </div> */}
          </AccordionContent>
        </AccordionItem>
        {/* <AccordionItem value="item-2">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Margin </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Left</p>
              <Input
                type="number"
                placeholder={marginLeft.value}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginLeft.value = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Top</p>
              <Input
                type="number"
                placeholder={marginTop.value}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginTop.value = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Right</p>
              <Input
                type="number"
                placeholder={marginRight.value}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginRight.value = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Bottom</p>
              <Input
                type="number"
                placeholder={marginBottom.value}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginBottom.value = e.target.value), 1000)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem> */}
        <AccordionItem value="item-3">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Appearance</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-2">
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Text</p>
              <Input
                type="color"
                value={textColor.value}
                onChange={(e) => {
                  setProp((props) => (props.textColor.value = e.target.value))
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Design</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Align</p>
              <Tabs
                value={textAlign.value}
                defaultValue={textAlign.value}
                onValueChange={(e) => {
                  setProp((props) => {
                    props.textAlign.value = e;
                  }, 1000);
                }}
                className="flex-1"
              >
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="left"><AlignLeft /></TabsTrigger>
                  <TabsTrigger value="center"><AlignCenter /></TabsTrigger>
                  <TabsTrigger value="right"><AlignRight /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-row items-center col-span-2 space-x-2">
              <label
                htmlFor="backgroundcolor"
                className="text-md text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-2/3"
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Spacing</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-2">
            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Container Size</p>
              <Tabs
                value={containerSize}
                defaultValue={containerSize}
                onValueChange={(value) => {
                  setProp((props) => (props.containerSize = value), 1000);
                }}
                className="flex-1"
              >
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="small">{t("S")}</TabsTrigger>
                  <TabsTrigger value="medium">{t("M")}</TabsTrigger>
                  <TabsTrigger value="large">{t("L")}</TabsTrigger>
                  <TabsTrigger value="full"><MoveHorizontal /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
                <Label htmlFor="marginTop">{t("Top")}</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                  {marginTop.value}
                </span>
              </div>
              <Slider
                value={[localMarginTop]}
                onValueChange={(value) => {
                  setLocalMarginTop(value[0]); // Update local state
                  handlePropChangeDebounced("marginTop", value[0]); // Debounced update
                }}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
                <Label htmlFor="marginTop">{t("Bottom")}</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                  {marginBottom.value}
                </span>
              </div>
              <Slider
                value={[localMarginBottom]}
                max={100}
                min={0}
                step={1}
                onValueChange={(value) => {
                  setLocalMarginBottom(value[0]); // Update local state
                  handlePropChangeDebounced("marginBottom", value[0]); // Debounced update
                }}
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
                <Label htmlFor="marginTop">{t("Left")}</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                  {marginLeft.value}
                </span>
              </div>
              <Slider
                value={[localMarginLeft]}
                max={100}
                min={0}
                step={1}
                onValueChange={(value) => {
                  setLocalMarginLeft(value[0]); // Update local state
                  handlePropChangeDebounced("marginLeft", value[0]); // Debounced update
                }}
              />
            </div>

            <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start">
              <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
                <Label htmlFor="marginTop">{t("Right")}</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                  {marginRight.value}
                </span>
              </div>
              <Slider
                value={[localMarginRight]}
                max={100}
                min={0}
                step={1}
                onValueChange={(value) => {
                  setLocalMarginRight(value[0]); // Update local state
                  handlePropChangeDebounced("marginRight", value[0]); // Debounced update
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
