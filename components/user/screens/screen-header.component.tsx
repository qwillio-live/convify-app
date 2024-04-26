import Link from 'next/link'
import React from 'react'
import { Element } from '@/lib/craftjs'

export const ScreenHeader = ({scale=1}) => {
  return (

    <div className={`flex basis-full flex-col py-3 text-center text-base`} style={{
      transform: `scale(${scale})`
     }}>
      <h2>Convify</h2>
    </div>
  )
}

