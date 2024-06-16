import React, { useEffect, useState } from "react";
import { useNode } from "@/lib/craftjs";
import ContentEditable from "react-contenteditable";
import { Controller } from "../settings/controller.component";
import { UserTextSettings } from "./user-text-settings";
import { useAppSelector } from "@/lib/state/flows-state/hooks";

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

export const UserText = ({
  text,
  fontSize,
  textAlign,
  fontWeight,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  textColor,
  tagType,
  containerBackground,
  // justifyContent,
  containerSize,
  fullWidth,
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
  }));

  const [editable, setEditable] = useState(false);
  const secondaryFont = useAppSelector((state) => state.theme?.text?.secondaryFont);
  const secondaryTextColor = useAppSelector((state) => state.theme?.text?.secondaryColor);
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen);

  useEffect(() => {
    setProp((props) => (props.fontFamily = secondaryFont), 200);
  }, [secondaryFont]);

  useEffect(() => {
    setProp((props) => (props.textColor = secondaryTextColor), 200);
  }, [secondaryTextColor]);

  useEffect(() => {
    if (selected) {
      return;
    }
    setEditable(false);
  }, [selected]);

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
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center", // justifyContent || "center",
        background: `${containerBackground}`,
      }}
      {...props}
      ref={(ref) => ref && connect(drag(ref))}
      onClick={() => selected && setEditable(true)}
    >
      {isHovered && <Controller nameOfComponent={"TEXT"} />}
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
          fontFamily: `var(${secondaryFont})`,
          fontSize: `${fontSize}px`,
          textAlign: textAlign,
          fontWeight: `${fontWeight}`,
          marginLeft: `${marginLeft}px`,
          marginRight: `${marginRight}px`,
          marginTop: `${marginTop}px`,
          marginBottom: `${marginBottom}px`,
          color: `${textColor}`,
          // outline: "none",
          background: `${containerBackground}`,
          width: getWidthValue(),
        }}
      />
    </div>
  );
};

export const TextDefaultProps = {
  fontFamily: "inherit",
  text: "Your text here",
  fontSize: 18,
  textColor: "inherit",
  fontWeight: "400",
  textAlign: "center",
  marginLeft: 0,
  marginRight: 0,
  marginTop: 20,
  marginBottom: 20,
  tagType: "p",
  fullWidth: true, // Default to true for full width
  // justifyContent: "center",
  containerSize: ContainerTextSize.medium,
  // containerBackground: string,
};

UserText.craft = {
  props: TextDefaultProps,
  related: {
    settings: UserTextSettings,
  },
};
