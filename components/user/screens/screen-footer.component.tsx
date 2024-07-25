import Link from 'next/link'
import React from 'react'
import { Controller } from '../settings/controller.component';
import { Element, useNode } from '@/lib/craftjs'
import { TextInputDefaultProps, UserText } from '../text/user-text.component';


export const ScreenFooterGen = () => {
  return(
<div className='w-full'>
<div className='flex basis-full flex-row items-center justify-center'>as seen on <span>Convify blog</span></div>
      <div
      className="flex basis-full flex-row items-center justify-center">

        <Link href={"#"}>
          <span>Link to start</span>
        </Link>
        <Link href={"#"}>
          <span>Link to Convify</span>
        </Link>
      </div>
</div>
  )
}

export const ScreenFooter = ({scale=1}) => {
  const {
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }));
  const [hover, setHover] = React.useState(false);
  return (

    <div
    ref={(ref: any) => connect(drag(ref))}
    className={`flex basis-full w-full flex-col justify-center gap-6 py-3 text-center text-base`} style={{
      transform: `scale(${scale})`
     }}
     onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
     >
      {hover && <Controller nameOfComponent={"Screen Footer"} />}
     <ScreenFooterGen />
    </div>

  )
}

ScreenFooter.craft = {
  props: {
    fullWidth: true,
  },
  rules: {
    canDrop: () => true,
    canDrag: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true
  },
  related: {}
}
