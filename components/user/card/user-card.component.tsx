import { Element, useNode } from '@/lib/craftjs';
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

interface CardStyles {
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


const CardContentInner=styled.div<CardStyles>`
  width: '100%';
  height: ${(props) => props.height}px;
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  margin-left: ${(props) => props.marginLeft}px;
  margin-top: ${(props) => props.marginTop}px;
  margin-right: ${(props) => props.marginRight}px;
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



export const CardContentGen = ({ children, ...props }) => {
  return(
    <CardContentInner
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
    >{children}</CardContentInner>
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
  return (
    <div
    ref={(ref: any) => connect(drag(ref))}
    className={`${isHovered ? 'border border-blue-500 border-dotted' : ''} border border-transparent relative`}>
      <CardContentGen
      {...props}
    >
      {children}
    </CardContentGen>
    </div>
  );
};

export const CardContentDefaultProps:CardStyles = {
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
    paddingTop: "12",
    paddingRight: "12",
    paddingBottom: "12",
    radius: "none",
    flexDirection: "column",
    fillSpace: "1",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
    overflowY: "hidden",
    overflowX: "hidden",
    gap: 20,
    border: 0,
    borderColor: "inherit",
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
    <div
      style={{
        width: `100%`,
        minWidth: '100%',
        flexBasis: `100%`,
        height: `auto`,
      }}
      className='card-container relative'
      ref={(ref: any) => connect(drag(ref))}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && <Controller nameOfComponent={"Card"} />}
      <Element
        canvas id="usercard" is={CardContent} data-cy="card-top"
        {...props}
      >
        {children}
      </Element>
    </div>
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
