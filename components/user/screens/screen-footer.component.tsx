import { Element, useNode } from '@/lib/craftjs'
import Link from 'next/link'
import React from 'react'


export const ScreenFooter = ({scale=1}) => {
  const { connectors: {connect, drag} } = useNode();
  return (

    <div
    ref={(ref: any) => connect(drag(ref))}
    className={`flex basis-full flex-col justify-center gap-6 py-3 text-center text-base`} style={{
      transform: `scale(${scale})`
     }}>
      <div className='flex basis-full flex-row items-center justify-center'>as seen on <span>Convify blog</span></div>
      <div className="flex basis-full flex-row items-center justify-center">
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

