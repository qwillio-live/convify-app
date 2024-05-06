import React from "react";
import styled from 'styled-components';
import { Controller } from "../settings/controller.component";
import { cn } from "@/lib/utils";
import {useNode} from "@/lib/craftjs"
import { LogoBarSettings } from "./logo-bar-settings.component";
import Image from "next/image";
import firstLogo from "@/assets/images/first-logo.png";
import secondLogo from "@/assets/images/second-logo.png";
import thirdLogo from "@/assets/images/third-logo.png";
import fourthLogo from "@/assets/images/fourth-logo.png";
import { Element } from "@/lib/craftjs";


const LogoBarInner = styled.div<{
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
  background: string
  width: number
  fullWidth: boolean
  height: number
  flex: string
  flexDirection: string
  justifyContent: string
  alignItems: string
  gap: number
  radius: number
  paddingTop: number
  paddingBottom: number
  paddingLeft: number
  paddingRight: number
}>`
  margin-top: ${({marginTop}) => `${marginTop}px`};
  margin-bottom: ${({marginBottom}) => `${marginBottom}px`};
  margin-left: ${({marginLeft}) => `${marginLeft}px`};
  margin-right: ${({marginRight}) => `${marginRight}px`};
  background-color: ${({background}) => background};
  padding-top: ${({paddingTop}) => `${paddingTop}px`};
  padding-bottom: ${({paddingBottom}) => `${paddingBottom}px`};
  padding-left: ${({paddingLeft}) => `${paddingLeft}px`};
  padding-right: ${({paddingRight}) => `${paddingRight}px`};
  min-width: ${({width, fullWidth}) => fullWidth ? "100%" : `${width}px`};
  min-height: auto;
  display: ${({flex}) => flex};
  flex-direction: ${({flexDirection}) => flexDirection};
  justify-content: ${({justifyContent}) => justifyContent};
  align-items: ${({alignItems}) => alignItems};
  gap: ${({gap}) => `${gap}px`};
  border-radius: ${({radius}) => `${radius}px`};
  overflow: hidden;
  position: relative;
  flex-wrap: wrap;
`;


const LogoBarItem = ({
  logoBarItemStyles,
  item,
}) => {
  return (
    <div
      style={{ width: `${logoBarItemStyles.width}px` }}
      className="relative max-w-[100px] overflow-hidden"
    >
      <Element
        is={"img"}
        id={`logo-bar-item-image-${item.id}`}
        className="w-full"
        src={item.src}
        alt={item.alt}
      />
    </div>
  );
};

export const LogoBar = ({
logoBarStyles,
logoBarItemStyles,
  logoBarItems,
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
  }));

  return (
    <LogoBarInner
      ref={(ref: any) => connect(drag(ref))}
      {...logoBarStyles}
      {...props}
    >
      {isHovered && <Controller nameOfComponent={"Logo Bar"} />}
        {logoBarItems.map((item, index) => (
          <LogoBarItem
          logoBarItemStyles={logoBarItemStyles}
          key={index}
          item={item}
          />
        ))}
    </LogoBarInner>
  )
}

export type LogoBarProps = {
logoBarStyles:{
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
  paddingTop: number
  paddingBottom: number
  paddingLeft: number
  paddingRight: number
  background: string
  width: number
  fullWidth: boolean
  height: number
  flex: string
  flexDirection: "row" | "column"
  justifyContent: "space-between" | "center" | "flex-start" | "flex-end"
  alignItems: "center" | "flex-start" | "flex-end"
  gap: number
  radius: number
},
logoBarItemStyles:{
  width: number
},
  logoBarItems: {
    id: string | number
    src: string | null
    alt: string
  }[]
}

export const LogoBarDefaultProps: LogoBarProps = {
logoBarStyles:{
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  paddingTop: 20,
  paddingBottom: 20,
  paddingLeft: 0,
  paddingRight: 0,
  background: "#ffffff",
  width: 800,
  fullWidth: false,
  height: 300,
  flex: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 70,
  radius: 0,
},
logoBarItemStyles:{
  width: 100,
},
  logoBarItems: [
    {
      id: 1,
      src: firstLogo.src,
      alt: "first logo",
    },
    {
      id: 2,
      src: secondLogo.src,
      alt: "second logo",
    },
    {
      id: 3,
      src: thirdLogo.src,
      alt: "third logo",
    },
    {
      id: 4,
      src: fourthLogo.src,
      alt: "fourth logo",
    },
  ],
}

LogoBar.craft = {
  props: LogoBarDefaultProps,
  related: {
    settings: LogoBarSettings,
  },
}
