import { Element, useNode } from '@/lib/craftjs';
import React from 'react';

import { Button } from '../button/user-button.component';
import {
  Container,
  UserContainerSettings,
  ContainerDefaultProps,
} from '../container/user-container.component';
import { UserText } from '../text/user-text.component';

export const CardTop = ({ children, ...props }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div
      {...props}
      ref={(ref: any) => connect(drag(ref))}

      className="text-only"
      style={{
        minWidth: `${props.width}px`,
        width: "100%",
        height: "auto",
        minHeight: `${props.height}px`,
        padding: '10px',
        marginBottom: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {children}
    </div>
  );
};

export const CardTopDefaultProps = {
  padding: 40,
  width: "400",
  height: "200",
  minHeight: "200px",
  minWidth: "400px",
  background: "inherit",
  color: "inherit",
  marginLeft: "2",
  marginTop: "2",
  marginRight: "2",
  marginBottom: "2",
  paddingLeft: "4",
  paddingTop: "4",
  paddingRight: "4",
  paddingBottom: "4",
  radius: "none",
  shadow: "none",
  flexDirection: "column",
  fillSpace: "1",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "nowrap",
  overflowY: "hidden",
  overflowX: "hidden",
  gap: 0,
  border: 0,
  borderColor: "inherit",
}

CardTop.craft = {
  props: ContainerDefaultProps,
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canDragIn: () => true,
    canDragOut: () => true,
  },
  related:{
    settings: UserContainerSettings

  }
};


export const Card = ({ background, padding = 20, ...props }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div
    className='card-container'
    ref={(ref: any) => connect(drag(ref))}>
      <Element canvas id="usercard" is={CardTop} data-cy="card-top">

      </Element>
    </div>
  );
};

Card.craft = {
  related: {
    settings: UserContainerSettings,
  },
};
