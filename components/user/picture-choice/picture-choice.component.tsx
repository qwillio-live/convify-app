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
  Check,
  X,
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
  UserText
} from "../text/user-text.component"
import { UserTextSettings } from "../text/user-text-settings"
import { PictureChoiceSettings } from "./picture-choice-settings.component"
import styled from "styled-components"

const ICONS = {
  image: Image,
  check: Check,
  listOrdered: ListOrdered,
  uploadCloud: UploadCloud,
  aperture: Aperture,
  arrowBigUp: ArrowBigUp,
  anchor: Anchor,
  bellingRing: BellRing,
  checkCircle: CheckCircle,
  shieldCheck: ShieldCheck,
  circleX: XCircle,
  x: X,
}

const PictureChoiceContainer = styled.div<{
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  background: string;
  radius: number;
  align: string;
  flexDirection: string;
  justifyContent: string;
  gap: number;
  padding: number;
  border: number;
  borderColor: string;
  alignItems: string;
}>`
  margin-top: ${({ marginTop }) => `${marginTop}px`};
  margin-bottom: ${({ marginBottom }) => `${marginBottom}px`};
  margin-left: ${({ marginLeft }) => `${marginLeft}px`};
  margin-right: ${({ marginRight }) => `${marginRight}px`};
  background: ${({ background }) => background};
  border-radius: ${({ radius }) => `${radius}px`};
  align-items: ${({ align }) => align};
  display: flex; /* Corrected from flex: flex; */
  width: 100%;
  flex-direction: ${({ flexDirection }) => flexDirection};
  justify-content: ${({ justifyContent }) => justifyContent};
  gap: ${({ gap }) => `${gap}px`};
  padding: ${({ padding }) => `${padding}px`};
  border: ${({ border, borderColor }) => `${border}px solid ${borderColor}`};
`;

const PictureChoiceItem = styled.div<{
  itemWidth: number;
  itemHeight: number;
  fontSize: number;
  picWidth: number;
  picHeight: number;
  background: string;
  backgroundHover: string;
  radius: number;
  textColor: string;
  textHover: string;
  align: string;
  flexDirection: string;
  justifyContent: string;
  gap: number;
  padding: number;
  alignItems: string;
  border: number;
  borderColor: string;
  borderHover: string;
}>`
  min-width: ${({ itemWidth }) => `${itemWidth}px`};
  min-height: ${({ itemHeight }) => `${itemHeight}px`};
  font-size: ${({ fontSize }) => `${fontSize}px`};
  display: flex;
  background-color: ${({ background }) => background};
  width: 100%;
  height: 100%;
  color: ${({ textColor }) => textColor};
  border-radius: ${({ radius }) => `${radius}px`};
  align-items: ${({ align }) => align};
  flex-direction: ${({ flexDirection }) => flexDirection};
  justify-content: ${({ justifyContent }) => justifyContent};
  gap: ${({ gap }) => `${gap}px`};
  padding: ${({ padding }) => `${padding}px`};
  flex-wrap: wrap;
  max-width: 100%;
  overflow: hidden;
  border: ${({ border, borderColor }) => `${border}px solid ${borderColor}`};
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background-color: ${({ backgroundHover }) => backgroundHover};
    color: ${({ textHover }) => textHover};
    border: ${({ border, borderHover }) => `${border}px solid ${borderHover}`};
  }
`;



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
      <PictureChoiceContainer
        ref={(ref: any) => connect(drag(ref))}
        {...containerStyles}
      >
      {isHovered && <Controller nameOfComponent={"Picture Choice"} />}

        {pictureItems.map((item, index) => (
          <PictureChoiceItem
            key={index}
            {...pictureItemsStyles}
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
            <p>{item.text}</p>
          </PictureChoiceItem>
        ))}
      </PictureChoiceContainer>
    </>
  )
}

enum ItemType {
  PICTURE = "picture",
  ICON = "icon",
}
interface PictureChoiceContainerProps {
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    maxWidth: number;
    marginRight: number;
    background: string;
    radius: number;
    align: string;
    flexDirection: string;
    justifyContent: string;
    gap: number;
    padding: number;
    border: number;
    borderColor: string;
    alignItems: string;
}
type PictureChoiceTypes = {
  containerStyles: PictureChoiceContainerProps,
  pictureItemsStyles: {
    itemWidth: number
    itemHeight: number
    fontSize: number
    picWidth: number
    picHeight: number
    background: string
    backgroundHover: string
    radius: number
    textColor: string
    textHover: string
    align: string
    flexDirection: string
    justifyContent: string
    gap: number
    padding: number
    alignItems: string
    border: number
    borderColor: string
    borderHover: string
  }
  pictureItems: {
    id: number
    text: string
    pic: any
    itemType: ItemType
  }[]

}
export const PictureChoiceDefaultProps:PictureChoiceTypes = {
  containerStyles: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    maxWidth: 0,
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
    backgroundHover: "rgba(64, 80, 255, 0.05)",
    radius: 15,
    textColor: "#4050ff",
    textHover: "#3041ff",
    align: "center",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 30,
    border: 3,
    borderColor: "#eaeaeb",
    borderHover: "rgba(64, 80, 255, 0.6)",
  },
  pictureItems: [
    {
      id: 1,
      text: "Yes",
      pic: ICONS.check,
      itemType: ItemType.ICON,
    },
    {
      id: 2,
      text: "No",
      pic: ICONS.x,
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
