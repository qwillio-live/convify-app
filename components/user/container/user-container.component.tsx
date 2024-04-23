import { useNode,Element,Node,NodeHelpers } from '@craftjs/core';
import { Slider } from "@/components/ui/slider";
import { Input } from '@/components/ui/input';
import React from 'react';
import { Controller } from '../settings/controller.component';

export const UserContainer = ({ background, padding, children,height,width, ...props }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div
      {...props}
      ref={(ref:any) => connect(drag(ref))}
      style={{ margin: '5px 0', background, padding: `${padding}px` }}
    >
      {children}
    </div>
  );
};

export const UserContainerSettings = () => {
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
      <div>
        <div>Background</div>
        <Input
          type="color"
          name="background-color"
          // value={background}
          defaultValue={background}
          onChange={(event) => {
            console.log("color", event.target.value)
            setProp((props) => (props.background= event.target.value ), 500);
          }}
        />
      </div>
      <div>
        <div>Padding</div>
        <Slider
          defaultValue={[padding]}
          max={100}
          min={12}
          step={1}
          onValueChange={(value) =>
            setProp((props) => ( props.padding= value ), 500)
          }
        />
      </div>
    </div>
  );
};

export const ContainerDefaultProps = {
  background: 'inherit',
  padding: 40,
  color: 'inherit',
  height: 100,
  width: 100,
};

UserContainer.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: UserContainerSettings,
  },
};

export const Container = ({  ...props }) => {
  const {
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }));
  return (
    <div
    className='relative border border-dashed border-transparent transition-all duration-200 hover:border-blue-400 focus:border-blue-400'
    {...props}
    ref={(ref: any) => ref && connect(drag(ref))}
>
      {isHovered && <Controller nameOfComponent={"CONTAINER"} />}
      <Element canvas id="user-container" is={UserContainer} data-cy="user-container">

      </Element>
    </div>
  );
};

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: UserContainer,
  },
};
