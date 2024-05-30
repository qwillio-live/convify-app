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
import {darken, rgba} from "polished";
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
import { getBackgroundForPreset, getHoverBackgroundForPreset } from "./useButtonThemePresets"

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
  small: "400px",
  medium: "800px",
  large: "974px",
  full: "100%",
}

const IconButtonMobileSizeValues={
  small: "200px",
  medium: "300px",
  large: "360px",
  full: "100%",
}

const ButtonTextLimit = {
  small: 36,
  medium: 56,
  large: 76,
  full: 100,
}
export const IconButtonGen = ({
  disabled,
  fontFamily,
  enableIcon,
  size,
  color,
  text,
  marginLeft,
  width: width,
  height: height,
  marginRight,
  marginTop,
  containerBackground,
  marginBottom,
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
    <div className="w-full relative" style={{
      width: "100%",
      background: `${containerBackground}`,
      display: "flex",
    justifyContent: "center",
    minWidth: '100%',
    paddingTop: `${props.marginTop}px`,
    paddingBottom: `${props.marginBottom}px`,
    paddingLeft: `${props.marginLeft}px`,
    paddingRight: `${props.marginRight}px`,
     }}>
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
        mobileScreen={false}
        {...props}
        onClick={() => console.log("Button clicked", text)}
      >
      <span>{text}</span>
      {enableIcon && IconsList[icon]}
    </StyledCustomButton>
    </div>
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
  mobileScreen: boolean
}
const StyledCustomButton = styled(CustomButton)<StyledCustomButtonProps>`
  font-family: ${(props) => `var(${props?.fontFamily})`};
  position: relative;
  gap: 2px;
  font-size: 1rem;
  font-weight: 400;
  border: '1px dashed transparent';
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
  max-width: ${(props) => props.mobileScreen ? IconButtonMobileSizeValues[props.size || "medium"] : IconButtonSizeValues[props.size || "medium"]};
  width: 100%;
  box-sizing: border-box;
  height: ${(props) => props.height}px;
  margin-top: ${(props) => props.marginTop}px;
  margin-left: ${(props) => props.marginLeft}px;
  margin-right: ${(props) => props.marginRight}px;
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

  @media (max-width: 480) {
    width: 100%; /* Make the button take the full width on smaller screens */
    min-width: 100%;
  }

`

export const IconButton = ({
  fontFamily,
  disabled,
  borderHoverColor,
  enableIcon,
  size,
  color,
  text,
  marginLeft,
  width: width,
  height: height,
  marginRight,
  marginTop,
  marginBottom,
  containerBackground,
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
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen);

  useEffect(() => {
    if(fontFamily.globalStyled && !fontFamily.isCustomized){
      setProp((props) => props.fontFamily.value = primaryFont, 200);
    }
   },
  [primaryFont])

  useEffect(() => {

      if(primaryColor){
        const backgroundPrimaryColor = getBackgroundForPreset(primaryColor,props.preset);
        const hoverBackgroundPrimaryColor = getHoverBackgroundForPreset(primaryColor,props.preset);

        if(background.globalStyled && !background.isCustomized){
          setProp((props) => props.background.value = backgroundPrimaryColor, 200)
        }
          if(color.globalStyled && !color.isCustomized){
        setProp((props) => props.color.value = primaryColor, 200)
      }
        if(borderColor.globalStyled && !borderColor.isCustomized){
          setProp((props) => props.borderColor.value = primaryColor, 200)
        }

        // hover colors

        if(backgroundHover.globalStyled && !backgroundHover.isCustomized){
          setProp((props) => props.backgroundHover.value = hoverBackgroundPrimaryColor, 200)
        }
        if(borderHoverColor.globalStyled && !borderHoverColor.isCustomized){
          setProp((props) => props.borderHoverColor.value = primaryColor, 200)
        }
        if(colorHover.globalStyled && !colorHover.isCustomized){
          setProp((props) => props.colorHover.value = primaryColor, 200)
        }
      }

  },[primaryColor])

  const handleTextChange = (e) => {
    const maxLength = ButtonTextLimit[size];
    const value = e.target.value;

    if (value.length <= maxLength) {
      setProp(
        (props) => {
          props.text = value;
        },
        200
      );
    } else {
      // Allow deletion beyond the limit
      if (text.length > maxLength && value.length < text.length) {
        setProp(
          (props) => {
            props.text = e.target.value;
          },
          200
        );
      }
    }
  };

  return (
    <div
    ref={(ref: any) => connect(drag(ref))}
    className="relative overflow-hidden w-full"
    style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
    }}
    >
        {isHovered && <Controller nameOfComponent="BUTTON" />}
        <div className="relative w-full"
  style={{
    background: `${containerBackground}`,
    display: "inline-flex",
    justifyContent: "center",
    boxSizing: 'border-box',
    minWidth: '100%',
    maxWidth: '100%',
    paddingTop: `${props.marginTop}px`,
    paddingBottom: `${props.marginBottom}px`,
    paddingLeft: `${props.marginLeft}px`,
    paddingRight: `${props.marginRight}px`,
  }}>
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
        mobileScreen={mobileScreen || false}
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
      <ContentEditable
        html={text}
        disabled={disabled}
        style={{
          maxWidth: IconButtonSizeValues[size || "medium"],
        }}
        className="text-ellipsis overflow-hidden whitespace-nowrap"
        onChange={(e) => {
          handleTextChange(e);
        }}
        tagName="span"
      />
        {enableIcon && IconsList[icon]}
      </StyledCustomButton>
      </div>
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
  containerBackground: string
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
  preset: string
}

export const IconButtonDefaultProps: IconButtonProps = {
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  containerBackground: "#ffffff",
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
  fullWidth: true,
  preset: 'filled',
}

IconButton.craft = {
  props: IconButtonDefaultProps,
  related: {
    settings: IconButtonSettings,
  },
}
