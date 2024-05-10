import React, { useState } from "react"
import ConvifyLogo from "@/assets/convify_logo_black.png"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import {
  Circle,
  GripVertical,
  Image,
  PlusCircle,
  Trash2,
  UploadCloud,
} from "lucide-react"
import ContentEditable from "react-contenteditable"

import { useNode } from "@/lib/craftjs"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button, Button as CustomButton } from "@/components/ui/button"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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

enum SWITCH {
  SINGLE = "single",
  MULTIPLE = "multiple",
}
export const ProgressBarSettings = () => {
  const {
    actions: { setProp },
    props: { color, maxWidth,fullWidth },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">General </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
          <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Full Width</p>
              <Switch
                checked={fullWidth}
                onCheckedChange={(e) =>
                  setProp((props) => (props.fullWidth = e))
                } />
            </div>

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Width</p>
              <Input
                disabled={fullWidth}
                type={"number"}
                defaultValue={maxWidth}
                placeholder={maxWidth}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.maxWidth = e.target.value))
                }
              />
            </div>

            <Separator className="my-4 w-full basis-full" />

            <div className="style-control col-span-2 flex flex-col">
              <p className="text-sm text-muted-foreground">Color</p>
              <Input
                type={"color"}
                defaultValue={color}
                placeholder={color}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.color = e.target.value))
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
