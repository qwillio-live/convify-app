import { Element, useEditor, useNode } from '@/lib/craftjs';
import { useAppSelector } from '@/lib/state/flows-state/hooks';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import styled from 'styled-components';

import { Button } from "../button/user-button.component"
import {
  Container,
  ContainerDefaultProps,
  UserContainerSettings,
} from "../container/user-container.component"
import { UserInputCheckbox } from "../input-checkbox/user-input-checkbox.component"
import { UserInputMail } from "../input-email/user-input-mail.component"
import { UserInput } from "../input/user-input.component"
import { Controller } from "../settings/controller.component"
import { UserText } from "../text/user-text.component"
import { CardContainerSettings } from "./user-card-settings"

interface CardOuterStyles {
  fullWidth: boolean;
  parentHovered: boolean;
  width: string;
  height: string;
  backgroundColor: string;
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
  isHovered: boolean;
  selected: boolean;
}

const CardContentOuter = styled.div<CardOuterStyles>`
  width: "100%";
  flex-shrink: 0;
  flex-basis: 100%;
  min-width: 100%;
  height: auto;
  background: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  padding-left: 0;
  padding-top: ${(props) => props.paddingTop}px;
  padding-right: 0;
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
  /* border: ${(props) => props.selected ? '1px dotted' : '0'} solid ${(props) => props.borderColor}; */
  border-color: ${(props) => (props.selected || props.parentHovered) ? '#60A5FA' : props.backgroundColor};
  border-style: ${(props) => (props.selected || props.parentHovered) ? 'dotted' : 'solid'};
  border-width: 1px;
  &:hover {
    border-color: ${(props) => props.isHovered && '#60A5FA'};
    border-style: dotted;
  }
`;

interface CardInnerStyles {
  width: string
  direction: string
  size: string
  marginTop: string
  marginBottom: string
  marginLeft: string
  marginRight: string
  gap: string
  mobileFlexDirection: string
  alignItems: string
  justifyContent: string
  mobileAlignItems: string
  mobileJustifyContent: string
}

const CardContentInner = styled.div<CardInnerStyles>`
  max-width: ${(props) => CardSizeValues[props.size || "medium"]};
  width: 100%;
  display: flex;
  padding-top: ${(props) => props.marginTop}px;
  padding-bottom: ${(props) => props.marginBottom}px;
  margin-left: ${(props) => props.marginLeft}px;
  margin-right: ${(props) => props.marginRight}px;
  flex-direction: ${(props) => props.direction};
  flex: 1;
  align-items: ${(props) => props.alignItems};
  border-width: 0;
  justify-content: ${(props) => props.justifyContent};
  flex-wrap: nowrap;
  gap: ${(props) => props.gap}px;
  height: auto;
  @media (max-width: 768px) {
    flex-direction: ${(props) => props.mobileFlexDirection};
    align-items: ${(props) => props.mobileAlignItems};
    justify-content: ${(props) => props.mobileJustifyContent};
  }
`

export const CardContentGen = ({ children, ...props }) => {
  return (
    <CardContentOuter
    parentHovered={props.parentHovered}
    fullWidth={props.fullWidth}
    width={props.width}
    height={props.height}
    backgroundColor={props.backgroundColor}
    color={props.color}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
    marginRight={props.marginRight}
    marginBottom={props.marginBottom}
    isHovered={props.isHovered}
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
    selected={props.selected}
    borderColor={props.backgroundColor}
    >
      <CardContentInner
        size={props.size}
        width={props.width}
        gap={props.gap}
        alignItems={props.alignItems}
        justifyContent={props.justifyContent}
        mobileAlignItems={props.mobileAlignItems}
        mobileJustifyContent={props.mobileJustifyContent}
        direction={props.flexDirection || "column"}
        marginTop={props.marginTop}
        marginBottom={props.marginBottom}
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
  const {query} = useEditor();
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    isHovered,
    id,
    parent,
  } = useNode((state) => ({
    id: state.id,
    selected: state.events.selected,
    isHovered: state.events.hovered,
    parent: state.data.parent
  }))
  const {
    parentHovered,
  } = useNode((node) => ({
    parentHovered: query.node(parent || "").isHovered(),
  }))
  if(parentHovered){
    console.log("PARENT HOVERED", parentHovered)
  }
  // const [hoverState,setHoverState]=React.useState(isHovered || parentHovered)
  const t = useTranslations("Components")
  const mobileScreen = useAppSelector((state) => state?.theme?.mobileScreen);
  const selectedComponent = useAppSelector((state) => state?.screen?.selectedComponent);
  return (
    <div
    ref={(ref: any) => connect(drag(ref))}
    {...props}
    style={{ width: "100%", height: "100%", borderWidth: "0"}}
    // className={`${isHovered ? 'border border-blue-500 border-dotted' : ''} border border-transparent relative`}
    >
      <CardContentGen
          fullWidth={props.fullWidth}
          width={props.width}
          height={props.height}
          backgroundColor={props.backgroundColor}
          color={props.color}
          marginLeft={props.marginLeft}
          marginTop={props.marginTop}
          marginRight={props.marginRight}
          marginBottom={props.marginBottom}
          isHovered={isHovered}
          parentHovered={parentHovered}
          selected={id === selectedComponent}
          mobileFlexDirection={props.mobileFlexDirection}
          size={props.size}
          paddingLeft={props.paddingLeft}
          paddingTop={props.paddingTop}
          paddingRight={props.paddingRight}
          paddingBottom={props.paddingBottom}
          radius={props.radius}
          flexDirection={mobileScreen ? props.mobileFlexDirection : props.flexDirection}
          fillSpace={props.fillSpace}
          alignItems={mobileScreen ? props.mobileAlignItems : props.alignItems}
          justifyContent={mobileScreen ? props.mobileJustifyContent : props.justifyContent}
          flexWrap={props.flexWrap}
          overflowY={props.overflowY}
          overflowX={props.overflowX}
          gap={props.gap}
          border={props.border}
          borderColor={props.borderColor}
          mobileAlignItems={props.mobileAlignItems}
          mobileJustifyContent={props.mobileJustifyContent}
    >

        {children ? children : <div className='flex flex-col gap-2 justify-center items-center text-current opacity-50'><Plus size={32} /> {t("Add blocks here")}</div>}
        {/* {children} */}
    </CardContentGen>
    </div>
  )
}
export enum CardSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}
const CardSizeValues = {
  small: "300px",
  medium: "376px",
  large: "576px",
  full: "100%",
}

export type CardContentDefaultPropsTypes = {
  fullWidth: boolean
  parentHovered: boolean
  width: string
  height: string
  backgroundColor: string
  containerBackground: string
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
  mobileAlignItems: string
  mobileJustifyContent: string
  flexWrap: string
  overflowY: string
  overflowX: string
  gap: number
  border: number
  borderColor: string
  size: CardSizes
  mobileFlexDirection: string
  settingsTab: string
}
export const CardContentDefaultProps:CardContentDefaultPropsTypes= {
    fullWidth: true,
    parentHovered: false,
    width: "400",
    height: "200",
    backgroundColor: "transparent",
    containerBackground: "transparent",
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
    mobileAlignItems: "center",
    mobileJustifyContent: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
    overflowY: "hidden",
    overflowX: "hidden",
    gap: 20,
    border: 0,
    borderColor: "transparent",
    size: CardSizes.medium,
    settingsTab: "layout",
}

CardContent.craft = {
  props: CardContentDefaultProps,
  displayName: "Card Content",
  // rules: {
  //   canDrag: () => true,
  //   canDrop: () => true,
  //   canDragIn: () => true,
  //   canDragOut: () => true,
  //   isDeleteAble: () => true,
  // },
  related:{
    settings: CardContainerSettings
  }
};

const CardContainer = styled.div<{
backgroundColor: string;
}>`
  background: ${({ backgroundColor }) => `${backgroundColor}`};
  max-width: fit-content;
  width: 100%;
`
export const CardGen = ({ children, ...props }) => {
  return(
   <div
   style={{ width: "100%", height: "100%", borderWidth: "0", borderColor: props.backgroundColor }}
   >
        {children}
    </div>
  )
}

export const Card = ({ children,backgroundColor ,...props }) => {
  const [hover, setHover] = React.useState(false)
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))
  const t = useTranslations("Components")
  console.log("LIST OF PROPS", JSON.stringify(props))
  return (

    <div
    ref={(ref: any) => connect(drag(ref))}
      // backgroundColor={props.backgroundColor}
      className='card-container relative shrink-0 basis-full min-w-full flex justify-center items-center flex-col border-0'
      {...props}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ minWidth: "100%", height: "100%"}}
    >
      {hover && <Controller nameOfComponent={t("Container")} />}
      <Element
        canvas
        id="usercard"
        is={CardContent}
        data-cy="card-content"
        className=""
      >
        {children}
      </Element>
    </div>
  )
}

Card.craft = {
  // props: CardContentDefaultProps,
  displayName: "Card",
  // rules: {
  //   canDrag: () => true,
  //   canDrop: () => true,
  //   canDragIn: () => true,
  //   canDragOut: () => true,
  //   isDeleteAble: () => true,
  // },
};
