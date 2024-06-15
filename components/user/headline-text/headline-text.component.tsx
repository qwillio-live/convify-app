import React, { useEffect, useState } from "react"
import ContentEditable from "react-contenteditable"

import { useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { HeadlineTextSettings } from "./headline-text-settings"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { StyleProperty } from "../types/style.types"

export enum ContainerTextSize {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

const ContainerTextSizeValues = {
  small: "300px",
  medium: "376px",
  large: "576px",
  full: "100%",
};

const ContainerTextMobileSizeValues = {
  small: "300px",
  medium: "330px",
  large: "360px",
  full: "100%",
};

export const HeadlineTextGen = ({
  text,
  fontSize,
  textAlign,
  fontWeight,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  textColor,
  fontFamily,
  tagType,
  containerBackground,
  ...props
}) => {
  return (
    <ContentEditable
      html={text}
      disabled={true}
      onChange={(e) => console.log("Headline Text: ", e.target.value)}
      tagName={tagType}
      style={{
        fontFamily: `var(${fontFamily?.value})`,
        fontSize: `${fontSize.value}px`,
        textAlign,
        fontWeight: `${fontWeight.value}`,
        marginLeft: `${marginLeft.value}px`,
        marginRight: `${marginRight.value}px`,
        marginTop: `${marginTop.value}px`,
        marginBottom: `${marginBottom.value}px`,
        color: `${textColor.value}`,
        lineHeight: `${fontSize.value}px`,
        minWidth: "max-content",
        background: `${containerBackground}`,
      }}
    />
  )
}

export const HeadlineText = ({
  text,
  fontSize,
  fontFamily,
  textAlign,
  fontWeight,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  textColor,
  tagType,
  fullWidth,
  // justifyContent,
  containerBackground,
  containerSize,
  ...props
}) => {
  const {
    connectors: { connect, drag },
    selected,
    isHovered,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
    isHovered: state.events.hovered,
  }))
  const [editable, setEditable] = useState(false)
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const primaryTextColor = useAppSelector((state) => state.theme?.text?.primaryColor);
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen);
  useEffect(() => {
    setProp((props) => props.fontFamily.value = primaryFont, 200);
  },
    [primaryFont])

  useEffect(() => {
    setProp((props) => props.textColor.value = primaryTextColor, 200)
  }, [primaryTextColor])

  useEffect(() => {
    if (selected) {
      return
    }

    setEditable(false)
  }, [selected])

  const getWidthValue = () => {
    if (mobileScreen) {
      return containerSize === 'full' ? '100%' : ContainerTextMobileSizeValues[containerSize];
    } else {
      return containerSize === 'full' ? '100%' : ContainerTextSizeValues[containerSize];
    }
  };
  return (
    <div
      className="relative"
      {...props}
      ref={(ref: any) => ref && connect(drag(ref))}
      onClick={() => selected && setEditable(true)}

      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        background: `${containerBackground}`,
      }}
    >
      {isHovered && <Controller nameOfComponent={"HEADLINE"} />}
      <ContentEditable
        html={text}
        disabled={!editable}
        onChange={(e) =>
          setProp(
            (props) =>
              (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")),
            500
          )
        }
        tagName={tagType}
        style={{
          fontFamily: `var(${fontFamily?.value})`,
          // fontFamily: `var(${primaryFont})`,
          fontSize: `${fontSize.value}px`,
          textAlign: `${textAlign.value}`,
          fontWeight: `${fontWeight.value}`,
          marginLeft: `${marginLeft.value}px`,
          marginRight: `${marginRight.value}px`,
          marginTop: `${marginTop.value}px`,
          marginBottom: `${marginBottom.value}px`,
          color: `${textColor.value}`,
          outline: "none",
          background: `${containerBackground}`,
          width: getWidthValue(),
          // color: `${primaryTextColor}`
        }}
      />
    </div>
  )
}

interface HeadlineTextProps {
  text: string;
  fontSize: StyleProperty;
  fontFamily: StyleProperty;
  textColor: StyleProperty;
  fontWeight: StyleProperty;
  textAlign: StyleProperty;
  marginLeft: StyleProperty;
  marginRight: StyleProperty;
  marginTop: StyleProperty;
  marginBottom: StyleProperty;
  tagType: string;
  fullWidth: boolean;
  containerSize: ContainerTextSize;
}

export const HeadlineTextDefaultProps: HeadlineTextProps = {
  text: "Headlines for your business",
  fontSize: { value: 42, isCustomized: false, globalStyled: false },
  fontFamily: { value: "inherit", isCustomized: false, globalStyled: false },
  textColor: { value: "inherit", isCustomized: false, globalStyled: false },
  fontWeight: { value: "700", isCustomized: false, globalStyled: false },
  textAlign: { value: "center", isCustomized: false, globalStyled: false },
  marginLeft: { value: 0, isCustomized: false, globalStyled: false },
  marginRight: { value: 0, isCustomized: false, globalStyled: false },
  marginTop: { value: 20, isCustomized: false, globalStyled: false },
  marginBottom: { value: 20, isCustomized: false, globalStyled: false },
  tagType: "h1",
  fullWidth: true,
  containerSize: ContainerTextSize.medium,
};


HeadlineText.craft = {
  props: HeadlineTextDefaultProps,
  related: {
    settings: HeadlineTextSettings,
  },
}
