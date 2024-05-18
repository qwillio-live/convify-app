
import { useNode,Element } from '@/lib/craftjs';
import React from 'react';
import { Container } from '../container/user-container.component';

export const LayoutContainerGen = ({ children, props }) => {
  // Render the container and its children
  return (
    <div {...props}>
      {children}
    </div>
  );
};
export const LayoutContainer = ({ background, padding, children, ...props }) => {

  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div ref={(ref:any) => ref && connect(drag(ref))} {...props} style={{ background, padding }}>
      <Element is={LayoutContainerGen} id="layout-container" props={props}>
        {children}
        </Element>
    </div>
  );
};

export const LayoutContainerSettings = () => {
  const {
    background,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
  }));

  return (
    <div>
      Layout container Settings
    </div>
  );
};

export const LayoutContainerDefaultProps = {
  background: '#ffffff',
  padding: 3,
};

LayoutContainer.craft = {
  rules: {
    canMoveIn: () => true,
  },
  props: LayoutContainerDefaultProps,
  related: {
    settings: LayoutContainerSettings,
  },
};
