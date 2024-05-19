
import { useNode,Element } from '@/lib/craftjs';
import React from 'react';
import { Controller } from '../settings/controller.component';

export const LayoutContainer = ({ background, padding, children, ...props }) => {
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
      {...props}
      ref={(ref: any) => connect(drag(ref))}
      style={{position: 'relative', margin: '5px 0', background, padding: `${padding}px`,minWidth:"300px", minHeight: "300px" }}
    >
      {isHovered && <Controller nameOfComponent={"LayoutContainer"} />}
      {children}
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
      <h1>Layout LayoutContainer settings</h1>
    </div>
  );
};

export const LayoutContainerDefaultProps = {
  background: '#ffffff',
  padding: 3,
};

LayoutContainer.craft = {
  props: LayoutContainerDefaultProps,
  related: {
    settings: LayoutContainerSettings,
  },
};
