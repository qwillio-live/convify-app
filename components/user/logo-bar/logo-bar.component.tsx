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
}>`
  margin-top: ${({marginTop}) => `${marginTop}px`};
  margin-bottom: ${({marginBottom}) => `${marginBottom}px`};
  margin-left: ${({marginLeft}) => `${marginLeft}px`};
  margin-right: ${({marginRight}) => `${marginRight}px`};
  background-color: ${({background}) => background};
  min-width: ${({width, fullWidth}) => fullWidth ? "100%" : `${width}px`};
  min-height: ${({height}) => `${height}px`};
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
  item,
}) => {
  return (
    <div className="relative overflow-hidden">
      <img
        className="w-full"
        src={item.src}
        alt={item.alt}
      />
    </div>
  );
};

export const LogoBar = ({
logoBarStyles,
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
  background: "#ffffff",
  width: 500,
  fullWidth: true,
  height: 300,
  flex: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 10,
  radius: 0,
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
