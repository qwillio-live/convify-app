"use client"
import React from "react"
import ConvifyLogo from "@/assets/convify_logo_black.png"
import { UploadCloud } from "lucide-react"

import { useNode } from "@/lib/craftjs"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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

import { Controller } from "../settings/controller.component"

export const UserLogo = ({
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
  return (
    <>
      <img
        alt={alt}
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
      />
    </>
  )
}

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
        `relative flex flex-row justify-${align} w-full border border-transparent`
      )}
    >
      {isHovered && <Controller nameOfComponent={"Logo"} />}
      {
        /* eslint-disable-next-line @next/next/no-img-element */
        <UserLogo
          alt={alt}
          marginTop={marginTop}
          marginBottom={marginBottom}
          marginLeft={marginLeft}
          marginRight={marginRight}
          background={background}
          radius={radius}
          align={align}
          width={width}
          height={height}
          src={src}
          {...props}
        />
      }
    </div>
  )
}

export const LogoSettings = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [setUploadedFile, uploadedFile] = React.useState<string | null>(null)
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProp((props) => (props.src = URL.createObjectURL(file)), 1000)
    }
  }

  return (
    <>
      <Card className="p-2">
        <CardHeader className="p-2">
          <CardTitle>Logo</CardTitle>
          <CardDescription>Add url of logo</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-2">
          <Input
            defaultValue={src}
            className="w-full p-2 text-xs"
            onChange={(e) => setProp((props) => (props.src = e.target.value))}
          />
          <span className="text-muted-foreground">Upload logo</span>
          <Input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleInputChange}
          />
          <div
            onClick={() => (inputRef.current as HTMLInputElement)?.click()}
            className="relative flex w-full flex-row justify-center hover:cursor-pointer"
          >
            <div className="absolute flex size-full flex-row items-center justify-center bg-white bg-opacity-60">
              <UploadCloud />
            </div>
            <img src={src} alt={alt} className="w-30" />
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
              <p className="text-muted-foreground text-sm">Alt label</p>
              <Input
                className="p-2 text-sm"
                value={alt}
                placeholder={alt}
                onChange={(e) => {
                  setProp((props) => (props.alt = e.target.value), 1000)
                }}
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-muted-foreground text-sm">Width</p>
              <Input
                defaultValue={width}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.width = e.target.value))
                }
              />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-muted-foreground text-sm">Height</p>
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
              <Label className="text-muted-foreground text-sm">Top</Label>
              <Input
                type="number"
                max={100}
                min={0}
                className="w-full"
                placeholder={marginTop}
                onChange={(e) => {
                  setProp((props) => (props.marginTop = e.target.value), 1000)
                }}
              />
            </div>
            <div className="style-control flex flex-col gap-2">
              <Label className="text-muted-foreground text-sm">Bottom</Label>
              <Input
                type="number"
                placeholder={marginBottom}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.marginBottom = e.target.value),
                    1000
                  )
                }
              />
            </div>
            <div className="style-control flex flex-col gap-2">
              <Label className="text-muted-foreground text-sm">Left</Label>
              <Input
                type="number"
                placeholder={marginLeft}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginLeft = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control flex flex-col gap-2">
              <Label className="text-muted-foreground text-sm">Right</Label>
              <Input
                type="number"
                placeholder={marginRight}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginRight = e.target.value), 1000)
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
              <p className="text-muted-foreground text-sm">Background</p>
              <Input
                type="color"
                value={background}
                onChange={(e) => {
                  setProp((props) => (props.background = e.target.value), 1000)
                }}
              />
            </div>
            <div className="style-control col-span-2 flex flex-col">
              <p className="text-muted-foreground text-sm">Align</p>
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
              <p className="text-muted-foreground text-sm">Radius</p>
              <Input
                type="number"
                placeholder={radius}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.radius = e.target.value), 1000)
                }
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
  width: 156,
  height: 50,
  src: ConvifyLogo.src,
}

Logo.craft = {
  props: LogoDefaultProps,
  related: {
    settings: LogoSettings,
  },
}
