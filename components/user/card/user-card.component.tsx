import { Element, useNode } from '@craftjs/core';
import React from 'react';

import { Button } from '../button/user-button.component';
import {
  Container,
  UserContainerSettings,
  ContainerDefaultProps,
} from '../container/user-container.component';
import { UserText } from '../user-text.component';

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

CardTop.craft = {
  rules: {
    canDrag: () => true,
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
    <Container
    ref={(ref: any) => connect(drag(ref))}
    {...props} background={background} padding={padding}>
      <Element canvas id="usercard" is={CardTop} data-cy="card-top">

      </Element>
    </Container>
  );
};

Card.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: UserContainerSettings,
  },
};
