import React, { useCallback, useEffect,useRef } from "react"
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
import { throttle,debounce } from 'lodash';

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
  aperture: (props) => <Aperture {...props} />,
  activity: (props) => <Activity {...props} />,
  dollarsign: (props) => <DollarSign {...props} />,
  anchor: (props) => <Anchor {...props} />,
  disc: (props) => <Disc {...props} />,
  mountain: (props) => <Mountain {...props} />,
  arrowright: (props) => <ArrowRight {...props} />,
};

const IconGenerator = ({ icon, size, className = '', ...rest }) => {
  const IconComponent = IconsList[icon];

  if (!IconComponent) {
    return null; // or some default icon or error handling
  }

  return <IconComponent className={`shrink-0 ${className}`} size={size} {...rest} />;
};


const IconButtonSizeValues={
  small: "300px",
  medium: "376px",
  large: "576px",
  full: "100%",
}

const ButtonSizeValues = {
  small: ".8rem",
  medium: "1rem",
  large: "1.2rem",
}
const IconSizeValues ={
  small: 18,
  medium: 22,
  large: 26,
}

const IconButtonMobileSizeValues={
  small: "300px",
  medium: "330px",
  large: "360px",
  full: "100%",
}

const ButtonTextLimit = {
  small: 100,
  // small: 22,
  // medium: 30,
  // large: 40,
  // full: 82,

  medium: 100,
  large: 100,
  full: 100,
}
export const IconButtonGen = ({
  disabled,
  fontFamily,
  enableIcon,
  size,
  buttonSize,
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
        buttonSize={buttonSize}
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
        className="text-[1rem]"
        onClick={() => console.log("Button clicked", text)}
      >
      <div style={{
      maxWidth: '100%',
      transitionProperty: 'all',
      overflowX: 'clip',
      textOverflow: 'ellipsis',
    }}>{text}</div>
      {enableIcon && <IconGenerator icon={icon} size={IconSizeValues[buttonSize]} />}
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
  buttonSize?: string
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
  display: flex;
  flex-direction: row;
  position: relative;
  gap: 6px;
  font-size: ${(props) => ButtonSizeValues[props.buttonSize || "medium"]};
  font-weight: 400;
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
  max-width: ${(props) => props.mobileScreen ? IconButtonMobileSizeValues[props.size || "medium"] : IconButtonSizeValues[props.size || "medium"]};
  width: 100%;
  box-sizing: border-box;
  height: ${(props) => props.height}px;
  margin-top: ${(props) => props.marginTop}px;
  margin-left: ${(props) => props.marginLeft}px;
  margin-right: ${(props) => props.marginRight}px;
  margin-bottom: ${(props) => props.marginBottom}px;
  padding-left: ${(props) => props.paddingLeft}px;
  padding-top: ${(props) => ButtonSizeValues[props.buttonSize || "medium"]};
  padding-right: ${(props) => props.paddingRight}px;
  padding-bottom: ${(props) => ButtonSizeValues[props.buttonSize || "medium"]};
  border-radius: ${(props) => props.radius}px;
  flex-direction: ${(props) => props.flexDirection};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  gap: ${(props) => props.gap}px;
  border: ${(props) => props.border}px solid ${(props) => props.borderColor};
  @media (max-width: 760px) {
    width: 100%; /* Make the button take the full width on smaller screens */
    max-width: 600px;
  }
  @media (max-width: 660px) {
    width: 100%; /* Make the button take the full width on smaller screens */
    max-width: 400px;
  }
`;


export const IconButton = ({
  fontFamily,
  disabled,
  borderHoverColor,
  enableIcon,
  size,
  buttonSize,
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
  const ref = useRef<HTMLDivElement>(null);
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
  const maxLength = ButtonTextLimit[size];
  const handleTextChange = (e) => {

    const value = e.target.innerText;
    if (value.length <= maxLength) {
      setProp((props) => props.text = value);
      // handlePropChangeDebounced('text',value);
      // handlePropChangeThrottled('text',value)
    } else {
      if(ref.current){
        e.target.innerText = text || ''; // Restore the previous text
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        range.collapse(false); // Move cursor to the end
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  useEffect(() => {

    const currentRef = ref.current;
    if (currentRef) {
      currentRef.addEventListener('input', handleTextChange);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('input', handleTextChange);
      }
    };

  }, [text, maxLength]);
  const throttledSetProp = useCallback(
    throttle((property,value) => {
      setProp((prop) => {prop[property] = value},0);
    }, 200), // Throttle to 50ms to 200ms
    [setProp]
  );

  const handlePropChangeThrottled = (property,value) => {
    throttledSetProp(property,value);
  };

  const debouncedSetProp = useCallback(
    debounce((property,value) => {
      setProp((prop) => {prop[property] = value},0);
    }),[setProp])

  const handlePropChangeDebounced = (property,value) => {
    debouncedSetProp(property,value);
  }
  return (
    <div
    ref={(ref: any) => connect(drag(ref))}
    className=""
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
        buttonSize={buttonSize}
        {...props}
        onClick={() => console.log("Button clicked", text)}
      >
      <div className="flex flex-col max-w-[100%] min-h-[16px] min-w-[32px] overflow-x-clip">
      <ContentEditable
    html={text}
    innerRef={ref}
    disabled={disabled}
    style={{
      maxWidth: '100%',
      transitionProperty: 'all',
      overflowX: 'clip',
      textOverflow: 'ellipsis',
    }}
    className="min-w-16 min-h-16 border-transparent leading-relaxed border-dotted hover:border-blue-500"
    onChange={(e) => {
        handleTextChange(e);
    }}
    tagName="div"
/>
</div>
        {enableIcon && <IconGenerator icon={icon} size={IconSizeValues[buttonSize]} />}
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
  settingsTab: string
  buttonSize: string
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
  buttonSize: "medium",
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
  settingsTab: 'content'

}

IconButton.craft = {
  props: IconButtonDefaultProps,
  related: {
    settings: IconButtonSettings,
  },
}
