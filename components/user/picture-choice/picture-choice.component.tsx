import { DefaultSerializer } from "v8"
import React, { useEffect, useState } from "react"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import {
  Anchor,
  Aperture,
  ArrowBigUp,
  BellRing,
  CheckCircle,
  GripVertical,
  Image as IconImage,
  ListOrdered,
  ShieldCheck,
  UploadCloud,
  XCircle,
  Check as IconCheck,
  X as IconX,
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
import { Card as UserCard } from "@/components/user/card/user-card.component"
import CrossIcon from "@/assets/icons/x.svg"
import CheckIcon from "@/assets/icons/check.svg"
import {
  Container,
  ContainerDefaultProps,
  UserContainer,
  UserContainerSettings,
} from "../container/user-container.component"
import { Controller } from "../settings/controller.component"
import { TextDefaultProps, UserText } from "../text/user-text.component"
import { UserTextSettings } from "../text/user-text-settings"
import { PictureChoiceSettings } from "./picture-choice-settings.component"
import styled from "styled-components"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { useScreenNames } from "@/lib/state/flows-state/features/screenHooks"

const ICONS = {
  check: CheckIcon.src,
  x: CrossIcon.src,
}

const PictureChoiceContainer = styled.div<{
  marginTop: number
  marginBottom: number
  paddingTop: number
  paddingBottom: number
  marginLeft: number
  marginRight: number
  background: string
  radius: number
  align: string
  flexDirection: string
  justifyContent: string
  gap: number
  border: number
  borderColor: string
  alignItems: string
}>`
  margin-top: ${({ marginTop }) => `${marginTop}px`};
  margin-bottom: ${({ marginBottom }) => `${marginBottom}px`};
  padding-top: ${({ paddingTop }) => `${paddingTop}px`};
  padding-bottom: ${({ paddingBottom }) => `${paddingBottom}px`};
  margin-left: ${({ marginLeft }) => `${marginLeft}px`};
  margin-right: ${({ marginRight }) => `${marginRight}px`};
  background: ${({ background }) => background};
  border-radius: ${({ radius }) => `${radius}px`};
  align-items: ${({ align }) => align};
  display: flex; /* Corrected from flex: flex; */
  max-width: fit-content;
  width: 100%;
  flex-direction: ${({ flexDirection }) => flexDirection};
  justify-content: ${({ justifyContent }) => justifyContent};
  gap: ${({ gap }) => `${gap}px`};
  border: ${({ border, borderColor }) => `${border}px solid ${borderColor}`};
`

const PictureChoiceItem = styled.div<{
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
`

export const PictureChoiceGen = ({
  containerStyles,
  pictureItemsStyles,
  pictureItems,
  ...props
}) => {
  return (
    <PictureChoiceContainer {...containerStyles}>
      {pictureItems.map((item, index) => (
        <PictureChoiceItem key={index} {...pictureItemsStyles}>
           {/* <>
              {item.icon === "check" ? (
                <IconCheck
                  style={{
                    width: `${pictureItemsStyles.picWidth}px`,
                    height: `${pictureItemsStyles.picHeight}px`,
                  }}
                />
              ) : item.icon === "x" ? (
                <IconX
                  style={{
                    width: `${pictureItemsStyles.picWidth}px`,
                    height: `${pictureItemsStyles.picHeight}px`,
                  }}
                />
              ) : null}
            </> */}
          {item.itemType === ItemType.ICON ? (
            item.icon ? (
              <div className="text-[75px]">{item.icon}</div>
            ) : (
              <div className="text-[75px]"></div>
            )
          ) : (
            item.pic &&
            (
              <img
                src={item.pic}
                alt={item.alt || ""}
                style={{
                  width: `${pictureItemsStyles.picWidth}px`,
                  height: `${pictureItemsStyles.picHeight}px`,
                }}
              />
            )
          )}
          <p>{item.text}</p>
        </PictureChoiceItem>
      ))}
    </PictureChoiceContainer>
  )
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
  const [hover, setHover] = useState(false)
  const screens = useAppSelector((state:RootState) => state?.screen?.screens);
  const screensLength = useAppSelector((state:RootState) => state?.screen?.screens?.length ?? 0);
  const selectedScreenIndex = useAppSelector((state:RootState) => state.screen?.selectedScreen ?? 0)
  const selectedScreen = useAppSelector((state:RootState) => state.screen?.screens[selectedScreenIndex]);
  const selectedScreenId = useAppSelector((state:RootState) => state.screen?.screens[selectedScreenIndex]?.screenId) || "";
  const screenFields = useAppSelector((state:RootState) => state.screen?.screens[selectedScreenIndex]?.screenFields) || {};
  const nextScreenName = useAppSelector((state:RootState) => state?.screen?.screens[((selectedScreenIndex+1 < screensLength) ? selectedScreenIndex+1 : 0)]?.screenName) || "";
  const nextScreenId = useAppSelector((state:RootState) => state?.screen?.screens[((selectedScreenIndex+1 < screensLength) ? selectedScreenIndex+1 : 0)]?.screenId) || "";
  const screenNames = useScreenNames();

  // editor load needs to be refreshed so that screenName value is re-populated but
  // it is working now because it refers screenId rather then screenName
  useEffect(() => {
    pictureItems.map((item, index) => {
      let screenNameChanged = false;
      if(item.buttonAction === "next-screen"){
      setProp((props) => (props.pictureItems[index].nextScreen = {
        screenName: nextScreenName,
        screenId: nextScreenId
      }), 200)
      }else if(item.buttonAction === "custom-action"){
        screenNames?.map(screen => {
          if(screen.screenId === item?.nextScreen?.screenId){
            setProp((props) => (props.pictureItems[index].nextScreen = {
              screenName: screen.screenName,
              screenId: screen.screenId
            }), 200)
            screenNameChanged = true;
          }
        })
        if(!screenNameChanged){
          setProp((props) => props.pictureItems[index].buttonAction = "next-screen", 200);
          setProp((props) => props.pictureItems[index].nextScreen = {
            screenId: nextScreenId,
            screenName: nextScreenName
          });
        }
      }
    })

},[pictureItems,nextScreenName])

  const [editable, setEditable] = useState(false)
  useEffect(() => {
    if (selected) {
      return
    }

    setEditable(false)
  }, [selected])

  return (
    <>
      <PictureChoiceContainer
        ref={(ref: any) => connect(drag(ref))}
        {...containerStyles}
        {...props}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => selected && setEditable(true)}
        className="relative"
      >
        {hover && <Controller nameOfComponent={"Picture Choice"} />}

        {pictureItems.map((item, index) => (
          <PictureChoiceItem key={index} {...pictureItemsStyles}>

            {item.itemType === ItemType.ICON ? (
              item.icon === "check" ? (
                <IconCheck
                  style={{
                    width: `${pictureItemsStyles.picWidth}px`,
                    height: `${pictureItemsStyles.picHeight}px`,
                  }}
                />
              ) : item.icon === "x" ? (
                <IconX
                  style={{
                    width: `${pictureItemsStyles.picWidth}px`,
                    height: `${pictureItemsStyles.picHeight}px`,
                  }}
                />
              ) :
              item.icon ? (
                <span className="text-[75px]"
                style={{
                  width: `${pictureItemsStyles.picWidth}px`,
                  height: `${pictureItemsStyles.picHeight}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>{item.icon}</span>
              ) : (
                <div style={{
                  width: `75px`,
                  height: `75px`,
                }}></div>
              )
            ) : (
              item.pic ? (
                <img
                  src={item.pic}
                  alt={item.alt || ""}
                  style={{
                    width: `${pictureItemsStyles.picWidth}px`,
                    height: `${pictureItemsStyles.picHeight}px`,
                    marginLeft: `6px`
                  }}
                />
              ) : (
                <div style={{
                  width: `${pictureItemsStyles.picWidth}px`,
                  height: `${pictureItemsStyles.picHeight}px`,
                }}></div>
              )
            )}
            <ContentEditable
              html={item?.text || ""}
              disabled={!editable}
              onChange={(e) =>
                setProp(
                  (props) =>
                    (props.pictureItems[index].text = e.target.value.replace(
                      /<\/?[^>]+(>|$)/g,
                      ""
                    )),
                  500
                )
              }
              tagName={"div"}
              style={{
                minWidth: "20px",
              }}
            />
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
  marginTop: number
  marginBottom: number
  paddingTop: number
  paddingBottom: number
  marginLeft: number
  maxWidth: number
  marginRight: number
  background: string
  radius: number
  align: string
  flexDirection: string
  justifyContent: string
  gap: number
  border: number
  borderColor: string
  alignItems: string
}
type PictureChoiceTypes = {
  containerStyles: PictureChoiceContainerProps
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
    icon: any
    buttonAction: "next-screen" | "custom-action" | "none"
    nextScreen: {
      screenId: string
      screenName: string
    }
    itemType: ItemType
  }[]
}
export const PictureChoiceDefaultProps: PictureChoiceTypes = {
  containerStyles: {
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
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
      pic: null,
      icon: "check",
      buttonAction: "next-screen",
      nextScreen: {
        screenId: "",
        screenName: "",
      },
      itemType: ItemType.ICON,
    },
    {
      id: 2,
      text: "No",
      pic: null,
      icon: "x",
      buttonAction: "next-screen",
      nextScreen: {
        screenId: "",
        screenName: "",
      },
      itemType: ItemType.ICON,
    },
  ],
}

PictureChoice.craft = {
  props: PictureChoiceDefaultProps,
  related: {
    settings: PictureChoiceSettings,
  },
}
