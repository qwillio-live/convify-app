import React from "react"
import { Element, useEditor } from "@craftjs/core"

import { Button } from "@/components/ui/button"
import { UserText } from "@/components/user/user-text.component"

export const UserToolbox = () => {
  const { connectors } = useEditor()

  return (
    <div className="p-y">
      <div className="flex flex-col items-center justify-center space-y-1">
        <div className="pb-2">
          <p>Drag to add</p>
        </div>
        <div className="w-full flex-col">
          <div
            className="min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
            ref={(ref: HTMLDivElement | null) => ref && connectors.create(ref, <UserText text="Your text" />)}
            data-cy="toolbox-text"
          >
            Text field
          </div>
        </div>
      </div>
    </div>
  )
}
