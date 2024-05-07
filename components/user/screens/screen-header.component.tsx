import Link from 'next/link'
import React from 'react'
import { Element } from '@/lib/craftjs'
import { Logo, LogoDefaultProps } from '../logo/user-logo.component'

export const ScreenHeader = ({scale=1}) => {
  return (
    <Element
    is="div"
    canvas
    id="screen-header"
    >
    <Element
    canvas
    className="w-full"
    {...LogoDefaultProps}
    is={Logo} id="user_logo_header" />
    </Element>
  )
}

