import { Input } from '@/components/ui/input'
import React from 'react'

type Props = {}

const InputElement = ({floating, label, placeholder, icon}) => {
  return (
    <div className='input-container w-full'>
      {
        floating
      }
      <Input
      placeholder={placeholder}

      />

    </div>
  )
}

export default InputElement
