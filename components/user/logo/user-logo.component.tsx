import React from "react"
import { Image } from "lucide-react"

import { useNode } from "@/lib/craftjs"
import { cn } from "@/lib/utils"
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
import { Checkbox } from "@/components/ui/checkbox"
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
import { Slider } from "@/components/ui/slider"

import { Controller } from "../settings/controller.component"

export const Logo = ({
  alt,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  background,
  radius,
  align,
  width,
  height,
  src,
  ...props
}) => {
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))
  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      className={cn(
        `relative flex flex-row justify-${align} w-full border border-transparent`,
        isHovered && "border border-blue-400 border-dotted"
      )}
    >
      {isHovered && <Controller nameOfComponent={"Logo"} />}
      {
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          alt={alt}
          // className="aspect-square object-cover"
          src={src}
          style={{
            width: width,
            height: height,
            borderRadius: `${radius}px`,
            backgroundColor: background,
            marginLeft: `${marginLeft}px`,
            marginRight: `${marginRight}px`,
            marginTop: `${marginTop}px`,
            marginBottom: `${marginBottom}px`,
          }}
          {...props}
        />
      }
    </div>
  )
}

export const LogoSettings = () => {
  const {
    actions: { setProp },
    props: {
      alt,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      background,
      radius,
      align,
      width,
      height,
      src,
    },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <>
      <Card className="p-2">
        <CardHeader className="p-2">
          <CardTitle>Logo</CardTitle>
          <CardDescription>Add url of logo</CardDescription>
        </CardHeader>
        <CardContent className="p-2 flex flex-col gap-2">
          <Input
            defaultValue={src}
            className="w-full text-xs p-2"
            onChange={(e) => setProp((props) => (props.src = e.target.value))}
          />
          <div>
            <img src={src} alt={alt} className="w-20" />
          </div>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-2">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">General </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Alt label</p>
              <Input
                className="text-sm p-2"
                value={alt}
                placeholder={alt}
                onChange={(e) => {
                  setProp((props) => (props.alt = e.target.value), 1000)
                }}
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Width</p>
              <Input
                defaultValue={width}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.width = e.target.value))
                }
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Height</p>
              <Input
                defaultValue={height}
                className="w-full"
                onChange={(e) => {
                  setProp((props) => (props.height = e.target.value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">Spacing</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-2">
            <div className="style-control flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Top</Label>
              <Slider
                defaultValue={[0]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                value={[marginTop]}
                onValueChange={(value) => {
                  setProp((props) => (props.marginTop = value), 1000)
                }}
              />
            </div>
            <div className="style-control flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Bottom</Label>
              <Slider
                defaultValue={[0]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                value={[marginBottom]}
                onValueChange={(value) =>
                  setProp((props) => (props.marginBottom = value), 1000)
                }
              />
            </div>
            <div className="style-control flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Left</Label>
              <Slider
                defaultValue={[0]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                value={[marginLeft]}
                onValueChange={(value) =>
                  setProp((props) => (props.marginLeft = value), 1000)
                }
              />
            </div>
            <div className="style-control flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Right</Label>
              <Slider
                defaultValue={[0]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                value={[marginRight]}
                onValueChange={(value) =>
                  setProp((props) => (props.marginRight = value), 1000)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Appearance </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Background</p>
              <Input
                type="color"
                value={background}
                onChange={(e) => {
                  setProp((props) => (props.background = e.target.value), 1000)
                }}
              />
            </div>
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Align</p>
              <RadioGroup
                value={align}
                onValueChange={(value) =>
                  setProp((props) => (props.align = value))
                }
              >
                <div className="flex flex-row gap-2">
                  <RadioGroupItem value="start" id="al-1" />
                  <Label htmlFor="al-1">Left</Label>
                </div>
                <div className="flex flex-row gap-2">
                  <RadioGroupItem value="center" id="al-2" />
                  <Label htmlFor="al-1">Center</Label>
                </div>
                <div className="flex flex-row gap-2">
                  <RadioGroupItem value="end" id="al-3" />
                  <Label htmlFor="al-1">Right</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Radius</p>
              <Slider
                defaultValue={[radius]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(value) => {
                  setProp((props) => (props.radius = value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export const LogoDefaultProps = {
  alt: "Logo",
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  background: "inherit",
  radius: "none",
  align: "center",
  width: 80,
  height: 80,
  src: "https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
}

Logo.craft = {
  props: LogoDefaultProps,
  related: {
    settings: LogoSettings,
  },
}
