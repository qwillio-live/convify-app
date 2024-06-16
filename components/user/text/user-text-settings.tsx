import React, { useEffect, useState, useCallback } from "react";
import { useNode } from "@/lib/craftjs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs";
import { useTranslations } from "next-intl";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoveHorizontal,
} from "lucide-react";
import { useAppSelector } from "@/lib/state/flows-state/hooks";
import { debounce } from 'lodash';

export const UserTextSettings = () => {
  const t = useTranslations("Components");
  const {
    actions: { setProp },
    fontSize,
    fontWeight,
    textAlign,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    textColor,
    tagType,
    containerBackground,
    // justifyContent,
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
    containerBackground: node.data.props.containerBackground,
    // justifyContent: node.data.props.justifyContent,
    containerSize: node.data.props.containerSize,
  }));

  const [localFontSize, setLocalFontSize] = useState(fontSize);

  useEffect(() => {
    if (!textAlign) {
      setProp((props) => (props.textAlign = "center"), 1000);
    }
  }, [textAlign, setProp]);


  const debouncedSetProp = useCallback(
    debounce((property, value) => {
      setProp((props) => { props[property] = value }, 0);
    }), [setProp]
  );

  const handlePropChangeDebounced = (property, value) => {
    debouncedSetProp(property, value);
  };

  const themeBackgroundColor = useAppSelector((state) => state?.theme?.general?.backgroundColor);
  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Typography</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2 p-2">
            <div className="style-control flex flex-col gap-2 pb-4 pt-2">
              <p className="text-md text-muted-foreground">Type</p>
              <Select
                defaultValue={tagType}
                onValueChange={(e) => {
                  setProp((props) => (props.tagType = e), 1000);
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
            </div>
            <div className="style-control flex flex-col gap-2 pb-4 pt-2">
              <div className="flex justify-between items-center">
                <p className="text-md text-muted-foreground">Font Size</p>
                <span className="text-md text-muted-foreground">{localFontSize}px</span>
              </div>
              <Slider
                value={[localFontSize]}
                onValueChange={(value) => {
                  setLocalFontSize(value[0]);
                  setProp((props) => (props.fontSize = value[0]), 1000);
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
                value={fontWeight}
                onValueChange={(e) => {
                  setProp((props) => (props.fontWeight = e), 1000);
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
                defaultValue={textAlign}
                onValueChange={(event) => {
                  setProp((props) => (props.textAlign = event), 1000);
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
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Margin</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <MarginInput
              label="Left"
              value={marginLeft}
              onChange={(value) => handlePropChangeDebounced("marginLeft", value)}
            />
            <MarginInput
              label="Top"
              value={marginTop}
              onChange={(value) => handlePropChangeDebounced("marginTop", value)}
            />
            <MarginInput
              label="Right"
              value={marginRight}
              onChange={(value) => handlePropChangeDebounced("marginRight", value)}
            />
            <MarginInput
              label="Bottom"
              value={marginBottom}
              onChange={(value) => handlePropChangeDebounced("marginBottom", value)}
            />
          </AccordionContent>
        </AccordionItem> */}
        <AccordionItem value="item-3">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Color</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-2">
            <ColorInput
              label="Text"
              value={textColor}
              onChange={(value) => handlePropChangeDebounced("textColor", value)}
            />
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
                value={textAlign}
                defaultValue={textAlign}
                onValueChange={(e) => {
                  setProp((props) => {
                    props.textAlign = e;
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
                value={containerBackground}
                defaultValue={containerBackground}
                onChange={(e) => handlePropChangeDebounced("containerBackground", e.target.value)}
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
                  // handlePropChange("marginTop",e)
                  handlePropChangeDebounced("marginTop", e)
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
  );
};

const MarginInput = ({ label, value, onChange }) => (
  <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
    <p className="text-md text-muted-foreground">{label}</p>
    <Input
      type="number"
      placeholder={value}
      max={100}
      min={0}
      className="w-full"
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const ColorInput = ({ label, value, onChange }) => (
  <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
    <p className="text-md text-muted-foreground">{label}</p>
    <Input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
