import { DefaultSerializer } from "v8"
import React from "react"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import {
  Anchor,
  Aperture,
  ArrowBigUp,
  BellRing,
  CheckCircle,
  GripVertical,
  Image,
  ListOrdered,
  ShieldCheck,
  UploadCloud,
  XCircle,
} from "lucide-react"
import ContentEditable from "react-contenteditable"

import { Element, useNode } from "@/lib/craftjs"
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
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  CardTop,
  Card as UserCard,
} from "@/components/user/card/user-card.component"

import {
  Container,
  ContainerDefaultProps,
  UserContainer,
  UserContainerSettings,
} from "../container/user-container.component"
import { Controller } from "../settings/controller.component"
import {
  TextDefaultProps,
  UserText,
  UserTextSettings,
} from "../user-text.component"
import { PictureChoiceSettings } from "./picture-choice-settings.component"





const ICONS = {
  image: Image,
  listOrdered: ListOrdered,
  uploadCloud: UploadCloud,
  aperture: Aperture,
  arrowBigUp: ArrowBigUp,
  anchor: Anchor,
  bellingRing: BellRing,
  checkCircle: CheckCircle,
  shieldCheck: ShieldCheck,
  circleX: XCircle,
}


export const PictureChoice = ({
  containerStyles,
  pictureItemsStyles,
  pictureItems,
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
    <>
      {isHovered && <Controller nameOfComponent={"Picture Choice"} />}
      <div
        ref={(ref: any) => connect(drag(ref))}
        style={{
          display: "flex",
          marginTop: `${containerStyles.marginTop}px`,
          marginBottom: `${containerStyles.marginBottom}px`,
          marginLeft: `${containerStyles.marginLeft}px`,
          marginRight: `${containerStyles.marginRight}px`,
          background: `${containerStyles.background}`,
          borderRadius: `${containerStyles.radius}px`,
          alignItems: containerStyles.align,
          flexDirection: containerStyles.flexDirection,
          justifyContent: containerStyles.justifyContent,
          gap: `${containerStyles.gap}px`,
          padding: `${containerStyles.padding}px`,
          border: `${containerStyles.border}px solid ${containerStyles.borderColor}`,
        }}
        className={cn(isHovered && "border-blue-400 border-dotted")}
      >
        {pictureItems.map((item, index) => (
          <div
            key={index}
            className="hover:cursor-pointer hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
            style={{
              minWidth: `${pictureItemsStyles.itemWidth}px`,
              minHeight: `${pictureItemsStyles.itemHeight}px`,
              fontSize: `${pictureItemsStyles.fontSize}px`,
              display: "flex",
              backgroundColor: `${pictureItemsStyles.background}`,
              width:"100%",
              height:"100%",
              color: pictureItemsStyles.textColor,
              borderRadius: `${pictureItemsStyles.radius}px`,
              alignItems: pictureItemsStyles.align,
              flexDirection: pictureItemsStyles.flexDirection,
              justifyContent: pictureItemsStyles.justifyContent,
              gap: `${pictureItemsStyles.gap}px`,
              padding: `${pictureItemsStyles.padding}px`,
              flexWrap: "wrap",
              maxWidth: "100%",
              overflow: "hidden",
              border: `${pictureItemsStyles.border}px solid ${pictureItemsStyles.borderColor}`,
            }}
          >
            {item.itemType === ItemType.ICON ? (
              <item.pic
                style={{
                  width: `${pictureItemsStyles.picWidth}px`,
                  height: `${pictureItemsStyles.picHeight}px`,
                }}
              />
            ) : (
              <img
                src={item.pic}
                alt={item.alt || ""}
                style={{
                  width: `${pictureItemsStyles.picWidth}px`,
                  height: `${pictureItemsStyles.picHeight}px`,
                }}
              />
            )}
            <p style={{
              color: `${pictureItemsStyles.textColor}`,
             }}>{item.text}</p>
          </div>
        ))}
      </div>
    </>
  )
}

enum ItemType {
  PICTURE = "picture",
  ICON = "icon",
}

export const PictureChoiceDefaultProps = {
  containerStyles: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    background: "#ffffff",
    radius: 0,
    align: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 20,
    border: 0,
    borderColor: "#a1a1a1",
  },
  pictureItemsStyles: {
    itemWidth: 185,
    itemHeight: 160,
    fontSize: 24,
    picWidth: 75,
    picHeight: 75,
    background: "#ffffff",
    backgroundHover: "#000000",
    radius: 15,
    textColor: "#4050ff",
    textHover: "#ffffff",
    align: "center",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 30,
    border: 3,
    borderColor: "#eaeaeb",
  },
  pictureItems: [
    {
      id: 1,
      text: "Yes",
      pic: ICONS.checkCircle,
      itemType: ItemType.ICON,
    },
    {
      id: 2,
      text: "No",
      pic: ICONS.circleX,
      itemType: ItemType.ICON,
    }
  ],
}

PictureChoice.craft = {
  props: PictureChoiceDefaultProps,
  related: {
    settings: PictureChoiceSettings,
  },
}
