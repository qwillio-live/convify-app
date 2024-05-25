import React, { useEffect,useRef } from "react"
import {
  Activity,
  Anchor,
  Aperture,
  ArrowRight,
  Disc,
  DollarSign,
  Mountain,
} from "lucide-react"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useNode } from "@/lib/craftjs"
import {darken} from "polished";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button as CustomButton } from "@/components/ui/button"
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
import { IconButtonSettings } from "./user-icon-button.settings"
import { StyleProperty } from "../types/style.types"
import { useAppSelector } from "@/lib/state/flows-state/hooks"

const IconsList = {
  aperture: <Aperture className="shrink-0" />,
  activity: <Activity className="shrink-0" />,
  dollarsign: <DollarSign className="shrink-0" />,
  anchor: <Anchor className="shrink-0" />,
  disc: <Disc />,
  mountain: <Mountain className="shrink-0" />,
  arrowright: <ArrowRight className="shrink-0" />,
}

const IconButtonSizeValues={
  small: "220px",
  medium: "336px",
  large: "532px",
  full: "100%",
}

export const IconButtonGen = ({
  disabled,
  fontFamily,
  enableIcon,
  size,
  color,
  text,
  marginLeft = 0,
  width: width,
  height: height,
  marginRight = 0,
  marginTop = 0,
  marginBottom = 0,
  background,
  backgroundHover,
  colorHover,
  icon,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  radius,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  border,
  borderColor,
  borderHoverColor,
  ...props
}) => {
  return (
<StyledCustomButton
        fontFamily={fontFamily?.value}
        color={color.value}
        background={background.value}
        backgroundHover={backgroundHover.value}
        borderHoverColor={borderHoverColor?.value}
        colorHover={colorHover.value}
        radius={radius.value}
        flexDirection={flexDirection}
        justifyContent={justifyContent}
        borderColor={borderColor.value}
        border={border}
        marginLeft={marginLeft}
        width={width}
        size={size}
        height={height}
        marginRight={marginRight}
        marginTop={marginTop}
        marginBottom={marginBottom}
        paddingLeft={paddingLeft}
        paddingTop={paddingTop}
        paddingRight={paddingRight}
        paddingBottom={paddingBottom}
        alignItems={alignItems}
        gap={gap}
        {...props}
        onClick={() => console.log("Button clicked", text)}
      >
      <span>{text}</span>
      {enableIcon && IconsList[icon]}
    </StyledCustomButton>
  )
}
interface StyledCustomButtonProps {
  fontFamily?: string
  color?: string
  background?: string
  backgroundHover?: string
  colorHover?: string
  size?: string
  marginLeft?: string | number
  width?: string | number
  height?: string | number
  marginRight?: string | number
  marginTop?: string | number
  marginBottom?: string | number
  paddingLeft?: string | number
  paddingTop?: string | number
  paddingRight?: string | number
  paddingBottom?: string | number
  radius?: number
  flexDirection?: string
  alignItems?: string
  justifyContent?: string
  gap?: number
  border?: number
  borderColor?: string
  borderHoverColor?: string
}
const StyledCustomButton = styled(CustomButton)<StyledCustomButtonProps>`
  font-family: ${(props) => `var(${props?.fontFamily})`};
  position: relative;
  gap: 2px;
  border: 1px dashed transparent;
  transition: all 0.2s ease;
  &:hover {
    border-style: solid;
    border-color: ${(props) => props.borderHoverColor}; /* Change to your desired hover border color */
    background: ${(props) => props.backgroundHover};
    color: ${(props) => props.colorHover};
  }
  &:focus {
    border-color: ${(props) => props.borderHoverColor}; /* Change to your desired focus border color */
  }
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  overflow: hidden;
  margin-left: ${(props) => props.marginLeft}px;
  max-width: 100%;
  width: ${(props) => IconButtonSizeValues[props.size || "medium"]};
  min-width: ${(props) => IconButtonSizeValues[props.size || "medium"]};
  height: ${(props) => props.height}px;
  margin-right: ${(props) => props.marginRight}px;
  margin-top: ${(props) => props.marginTop}px;
  margin-bottom: ${(props) => props.marginBottom}px;
  padding-left: ${(props) => props.paddingLeft}px;
  padding-top: ${(props) => props.paddingTop}px;
  padding-right: ${(props) => props.paddingRight}px;
  padding-bottom: ${(props) => props.paddingBottom}px;
  border-radius: ${(props) => props.radius}px;
  flex-direction: ${(props) => props.flexDirection};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  gap: ${(props) => props.gap}px;
  border: ${(props) => props.border}px solid ${(props) => props.borderColor};
`

export const IconButton = ({
  fontFamily,
  disabled,
  borderHoverColor,
  enableIcon,
  size,
  color,
  text,
  marginLeft = 0,
  width: width,
  height: height,
  marginRight = 0,
  marginTop = 0,
  marginBottom = 0,
  background,
  backgroundHover,
  colorHover,
  icon,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  radius,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  border,
  borderColor,
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
  const [buttonFullWidth, setButtonFullWidth] = React.useState(size === "full");
  const primaryTextColor = useAppSelector((state) => state.theme?.text?.primaryColor)
  const secondaryTextColor = useAppSelector((state) => state.theme?.text?.secondaryColor)
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont);
  const primaryColor = useAppSelector((state) => state.theme?.general?.primaryColor);
  const secondaryColor = useAppSelector((state) => state.theme?.general?.secondaryColor);

  useEffect(() => {
    if(fontFamily.globalStyled && !fontFamily.isCustomized){
      setProp((props) => props.fontFamily.value = primaryFont, 200);
    }
   },
  [primaryFont])

  // useEffect(() => {
  //   if(color.globalStyled && !color.isCustomized){
  //     setProp((props) => props.color.value = primaryTextColor, 200)
  //   }
  // },[primaryTextColor])

  // useEffect(() => {

  // },[secondaryTextColor])


  useEffect(() => {

      if(primaryColor){
        const darkenedPrimaryColor = darken(0.1,primaryColor);
        if(background.globalStyled && !background.isCustomized){
          setProp((props) => props.background.value = primaryColor, 200)
        }
          if(color.globalStyled && !color.isCustomized){
        setProp((props) => props.color.value = primaryColor, 200)
      }
        if(borderColor.globalStyled && !borderColor.isCustomized){
          setProp((props) => props.borderColor.value = primaryColor, 200)
        }

        // hover colors

        if(backgroundHover.globalStyled && !backgroundHover.isCustomized){
          setProp((props) => props.backgroundHover.value = darkenedPrimaryColor, 200)
        }
        if(borderHoverColor.globalStyled && !borderHoverColor.isCustomized){
          setProp((props) => props.borderHoverColor.value = darkenedPrimaryColor, 200)
        }
        if(colorHover.globalStyled && !colorHover.isCustomized){
          setProp((props) => props.colorHover.value = darkenedPrimaryColor, 200)
        }
      }

  },[primaryColor])


  return (
    <div
    ref={(ref: any) => connect(drag(ref))}>
      <StyledCustomButton
        fontFamily={fontFamily.value}
        color={color.value}
        background={background.value}
        backgroundHover={backgroundHover.value}
        colorHover={colorHover.value}
        radius={radius.value}
        flexDirection={flexDirection}
        justifyContent={justifyContent}
        borderColor={borderColor.value}
        borderHoverColor={borderHoverColor.value}
        border={border}
        marginLeft={marginLeft}
        width={width}
        height={height}
        marginRight={marginRight}
        marginTop={marginTop}
        marginBottom={marginBottom}
        paddingLeft={paddingLeft}
        paddingTop={paddingTop}
        paddingRight={paddingRight}
        paddingBottom={paddingBottom}
        alignItems={alignItems}
        gap={gap}
        size={size}
        {...props}
        onClick={() => console.log("Button clicked", text)}
      >
        {isHovered && <Controller nameOfComponent="BUTTON" />}
        <ContentEditable
          html={text}
          disabled={disabled}
          style={{
            maxWidth: IconButtonSizeValues[size || "medium"],
           }}
          className="text-ellipsis overflow-hidden whitespace-nowrap"
          onChange={(e) =>
            setProp(
              (props) =>
                (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")),
              500
            )
          }
          tagName="span"
        />
        {enableIcon && IconsList[icon]}
      </StyledCustomButton>
    </div>
  )
}


export enum IconButtonSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}



export type IconButtonProps = {
  fontFamily: StyleProperty
  disabled: boolean
  enableIcon: boolean
  size: IconButtonSizes
  background: StyleProperty
  backgroundHover: StyleProperty
  color: StyleProperty
  colorHover: StyleProperty
  text: string
  icon: string
  paddingLeft: string | number
  paddingTop: string | number
  paddingRight: string | number
  paddingBottom: string | number
  radius: StyleProperty
  flexDirection: string
  alignItems: string
  justifyContent: string
  gap: number
  border: number
  borderColor: StyleProperty
  borderHoverColor: StyleProperty
  marginLeft: number | number
  marginTop: number | number
  marginRight: number | number
  marginBottom: number | number
  width: string | number
  height: string | number
  fullWidth: boolean
}

export const IconButtonDefaultProps: IconButtonProps = {
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  background: {
    value: "#4050ff",
    globalStyled: false,
    isCustomized: false,
  },
  color: {
    value: "#ffffff",
    globalStyled: false,
  isCustomized: false,
  },
  backgroundHover: {
    value: "#3182ce",
    globalStyled: false,
    isCustomized: false,
  },
  colorHover: {
    value: "#ffffff",
    globalStyled: false,
    isCustomized: false,

  },
  radius: {
    value: "0",
    globalStyled: false,
    isCustomized: false,
  },
  justifyContent: "center",
  borderColor: {
    value: "inherit",
    globalStyled: false,
    isCustomized: false,
  },
  borderHoverColor: {
    value: "inherit",
    globalStyled: false,
    isCustomized: false,
  },
  disabled: false,
  enableIcon: true,
  width: "366",
  height: "auto",
  size: IconButtonSizes.medium,
  text: "Get quote",
  marginLeft: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  icon: "arrowright",
  paddingLeft: "16",
  paddingTop: "26",
  paddingRight: "16",
  paddingBottom: "26",
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
  border: 0,
  fullWidth: false,
}

IconButton.craft = {
  props: IconButtonDefaultProps,
  related: {
    settings: IconButtonSettings,
  },
}
