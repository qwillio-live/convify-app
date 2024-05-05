import { GripHorizontal, GripVertical } from 'lucide-react'
import React from 'react'



export const Controller = ({nameOfComponent}) => {
  return (
    <div className='special absolute bottom-[100%] left-0 flex flex-row items-center gap-4 bg-blue-500 p-2 text-xs text-white'>
      <span>{nameOfComponent}</span>
      <span className='hover:cursor-move'><GripHorizontal /></span>
    </div>
  )
}
