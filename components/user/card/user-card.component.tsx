import { Element, useNode } from '@/lib/craftjs';
import { useAppSelector } from '@/lib/state/flows-state/hooks';
import React from 'react';
import styled from 'styled-components';

import { Button } from '../button/user-button.component';
import {
  Container,
  UserContainerSettings,
  ContainerDefaultProps,
} from '../container/user-container.component';
import { Controller } from '../settings/controller.component';
import { UserText } from '../text/user-text.component';
import { CardContainerSettings } from './user-card-settings';

interface CardOuterStyles {
  fullWidth: boolean;
  width: string;
  height: string;
  background: string;
  color: string;
  marginLeft: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  paddingLeft: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  radius: string;
  flexDirection: string;
  fillSpace: string;
  alignItems: string;
  justifyContent: string;
  flexWrap: 'wrap' | 'nowrap';
  overflowY: string;
  overflowX: string;
  gap: number;
  border: number;
  borderColor: string;
}


const CardContentOuter=styled.div<CardOuterStyles>`
  width: '100%';
  flex-shrink: 0;
  flex-basis: 100%;
  min-width: 100%;
  height: auto;
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  margin-top: ${(props) => props.marginTop}px;
  margin-bottom: ${(props) => props.marginBottom}px;
  padding-left: ${(props) => props.paddingLeft}px;
  padding-top: ${(props) => props.paddingTop}px;
  padding-right: ${(props) => props.paddingRight}px;
  padding-bottom: ${(props) => props.paddingBottom}px;
  border-radius: ${(props) => props.radius};
  display: flex;
  flex-direction: ${(props) => props.flexDirection};
  flex: ${(props) => props.fillSpace};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  flex-wrap: ${(props) => props.flexWrap};
  overflow-y: ${(props) => props.overflowY};
  overflow-x: ${(props) => props.overflowX};
  gap: ${(props) => props.gap}px;
  border: ${(props) => props.border}px solid;
  border-color: ${(props) => props.borderColor};
`;

interface CardInnerStyles {
  width: string;
  direction: string;
  size: string;
  marginLeft: string;
  marginRight: string;
  gap: string;
  mobileFlexDirection: string;
}

const CardContentInner=styled.div<CardInnerStyles>`
  max-width: ${(props) => CardSizeValues[props.size || "medium"] };
  width: 100%;
  display: flex;
  margin-left: ${(props) => props.marginLeft}px;
  margin-right: ${(props) => props.marginRight}px;
  flex-direction: ${(props) => props.direction};
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: ${(props) => props.gap}px;
  height: auto;
  @media (max-width: 768px) {
    flex-direction: ${(props) => props.mobileFlexDirection};
  }
`;



export const CardContentGen = ({ children, ...props }) => {
  return(
    <CardContentOuter
    fullWidth={props.fullWidth}
    width={props.width}
    height={props.height}
    background={props.background}
    color={props.color}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
    marginRight={props.marginRight}
    marginBottom={props.marginBottom}
    paddingLeft={props.paddingLeft}
    paddingTop={props.paddingTop}
    paddingRight={props.paddingRight}
    paddingBottom={props.paddingBottom}
    radius={props.radius}
    flexDirection={props.flexDirection}
    fillSpace={props.fillSpace}
    alignItems={props.alignItems}
    justifyContent={props.justifyContent}
    flexWrap={props.flexWrap}
    overflowY={props.overflowY}
    overflowX={props.overflowX}
    gap={props.gap}
    border={props.border}
    borderColor={props.borderColor}
    >
    <CardContentInner
    size={props.size}
    width={props.width}
    gap={props.gap}
    direction={props.flexDirection || "column"}
    marginLeft={props.marginLeft}
    marginRight={props.marginRight}
    mobileFlexDirection={props.mobileFlexDirection}
    >
      {children}
      </CardContentInner>
      </CardContentOuter>
  )
}
export const CardContent = ({ children, ...props }) => {
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))
  const mobileScreen = useAppSelector((state) => state?.theme?.mobileScreen);
  return (
    <div
    ref={(ref: any) => connect(drag(ref))}
    style={{ width: "100%", height: "100%" }}
    className={`${isHovered ? 'border border-blue-500 border-dotted' : ''} border border-transparent relative`}>
      <CardContentGen
          fullWidth={props.fullWidth}
          width={props.width}
          height={props.height}
          background={props.background}
          color={props.color}
          marginLeft={props.marginLeft}
          marginTop={props.marginTop}
          marginRight={props.marginRight}
          marginBottom={props.marginBottom}
          mobileFlexDirection={props.mobileFlexDirection}
          size={props.size}
          paddingLeft={props.paddingLeft}
          paddingTop={props.paddingTop}
          paddingRight={props.paddingRight}
          paddingBottom={props.paddingBottom}
          radius={props.radius}
          flexDirection={mobileScreen ? props.mobileFlexDirection : props.flexDirection}
          fillSpace={props.fillSpace}
          alignItems={props.alignItems}
          justifyContent={props.justifyContent}
          flexWrap={props.flexWrap}
          overflowY={props.overflowY}
          overflowX={props.overflowX}
          gap={props.gap}
          border={props.border}
          borderColor={props.borderColor}
    >

      {children}
    </CardContentGen>
    </div>
  );
};
export enum CardSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}
const CardSizeValues={
  small: "300px",
  medium: "376px",
  large: "576px",
  full: "100%",
}

export type CardContentDefaultPropsTypes= {
  fullWidth: boolean
  width: string
  height: string
  background: string
  color: string
  marginLeft: string
  marginTop: string
  marginRight: string
  marginBottom: string
  paddingLeft: string
  paddingTop: string
  paddingRight: string
  paddingBottom: string
  radius: string
  flexDirection: string
  fillSpace: string
  alignItems: string
  justifyContent: string
  flexWrap: string
  overflowY: string
  overflowX: string
  gap: number
  border: number
  borderColor: string
  size: CardSizes
  mobileFlexDirection: string
}
export const CardContentDefaultProps:CardContentDefaultPropsTypes= {
    fullWidth: true,
    width: "400",
    height: "200",
    background: "#ffffff",
    color: "#000000",
    marginLeft: "2",
    marginTop: "2",
    marginRight: "2",
    marginBottom: "2",
    paddingLeft: "12",
    paddingTop: "40",
    paddingRight: "12",
    paddingBottom: "40",
    radius: "none",
    flexDirection: "column",
    mobileFlexDirection: "column",
    fillSpace: "1",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
    overflowY: "hidden",
    overflowX: "hidden",
    gap: 20,
    border: 0,
    borderColor: "inherit",
    size: CardSizes.medium,
}

CardContent.craft = {
  props: CardContentDefaultProps,
  displayName: "Card Content",
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canDragIn: () => true,
    canDragOut: () => true,
    isDeleteAble: () => true,
  },
  related:{
    settings: CardContainerSettings
  }
};

const CardContainer = styled.div<{
background: string;
}>`
  background: ${({ background }) => background};
  max-width: fit-content;
  width: 100%;
`;
export const CardGen = ({ children, ...props }) => {
  return(
   <div
   style={{ width: "100%", height: "100%" }}
   >
        {children}
    </div>
  )
}

export const Card = ({ children, ...props }) => {
  const [hovered, setHovered] = React.useState(false)
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

    <CardContainer
      background={props.background}
      className='card-container relative shrink-0 basis-full min-w-full flex justify-center items-center flex-col'
      ref={(ref: any) => connect(drag(ref))}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ minWidth: "100%", height: "100%" }}
    >
      {hovered && <Controller nameOfComponent={"Card"} />}
      <Element
        canvas id="usercard" is={CardContent} data-cy="card-content"
        className=""
      >
        {children}
      </Element>
    </CardContainer>
  )
}

Card.craft = {
  props: CardContentDefaultProps,
  displayName: "Card",
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canDragIn: () => true,
    canDragOut: () => true,
  }
};
