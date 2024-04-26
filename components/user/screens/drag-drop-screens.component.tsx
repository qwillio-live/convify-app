import React from "react"
import { Element, useEditor } from "@/lib/craftjs"

import { Button } from "@/components/ui/button"
import { Button as UserButton } from "@/components/user/button/user-button.component"
import { UserText } from "@/components/user/user-text.component"

import { Card } from "@/components/user/card/user-card.component"
import { Container } from "@/components/user/container/user-container.component"
import { IconButton } from "@/components/user/icon-button/user-icon-button.component"
import { ScreenOneChoice } from "./screen-one-choice.component"

export const DragDrop = () => {
  const { connectors } = useEditor()

  return (
    <div className="p-y">
      <div className="flex flex-col items-center justify-center space-y-1">
        <div className="pb-2">
          <p>Drag to add</p>
        </div>
        <div className="flex w-full  flex-col gap-2">
          <div
            className="min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
            //eslint-disable-next-line
            ref={(ref: any) =>
              ref && connectors.create(ref, <ScreenOneChoice />)
            }
            data-cy="toolbox-text"
          >
            <ScreenOneChoice />
          </div>
        </div>
      </div>
    </div>
  )
}
