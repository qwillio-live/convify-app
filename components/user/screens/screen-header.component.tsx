import Link from "next/link"
import React from "react"
import { Element, useNode } from "@/lib/craftjs"
import { Logo, LogoDefaultProps } from "../logo/user-logo.component"
import {
  ContainerDefaultProps,
  UserContainer,
} from "../container/user-container.component"
import { setHeaderId } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useAppDispatch } from "@/lib/state/flows-state/hooks"
import { Card } from "../card/user-card.component"

export const ScreenHeader = ({ scale = 1 }) => {
  // const { id } = useNode();
  const dispatch = useAppDispatch()
  // React.useEffect(() => {
  //   dispatch(setHeaderId(id))
  // },[id])
  return (
    <Element
      canvas
      backgroundColor={"transparent"}
      className="w-full"
      {...ContainerDefaultProps}
      is={Card}
      id="user_card_header"
    >
      <Element
        className="w-full"
        {...LogoDefaultProps}
        is={Logo}
        id="user_logo_header"
      />
    </Element>
  )
}
