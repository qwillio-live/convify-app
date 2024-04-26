import React from "react"
import { Element, useEditor } from "@/lib/craftjs"

import { Button } from "@/components/ui/button"
import { Button as UserButton } from "@/components/user/button/user-button.component"
import { UserText } from "@/components/user/user-text.component"

import { Card } from "../card/user-card.component"
import { Container } from "../container/user-container.component"
import { IconButton } from "../icon-button/user-icon-button.component"

export const UserToolbox = () => {
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
              ref && connectors.create(ref, <UserText text="Your text" textColor={"inherit"} tagType={"p"} />)
            }
            data-cy="toolbox-text"
          >
            Text field
          </div>

          <div
            className="min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
            //eslint-disable-next-line
            ref={(ref: any) =>
              ref &&
              connectors.create(
                ref,
                <UserButton
                  size={"small"}
                  variant={"outline"}
                  color={"#ff235"}
                  text={"Button"} background={undefined} custom={undefined}                />
              )
            }
            data-cy="toolbox-text"
          >
            Button
          </div>

          <div
            className="min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
            //eslint-disable-next-line
            ref={(ref: any) => ref && connectors.create(ref, <Card background={undefined} />)}
            data-cy="toolbox-text"
          >
            Card
          </div>

          <div
            className="min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
            //eslint-disable-next-line
            ref={(ref: any) => ref && connectors.create(ref, <Container />)}
            data-cy="toolbox-text"
          >
            Container
          </div>

          <div
            className="min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
            //eslint-disable-next-line
            ref={(ref: any) => ref && connectors.create(ref, <IconButton size={undefined} variant={undefined} color={undefined} text={"Click me"} width={undefined} height={undefined} background={undefined} custom={undefined} icon={undefined} paddingLeft={undefined} paddingTop={undefined} paddingRight={undefined} paddingBottom={undefined} radius={undefined} flexDirection={undefined} alignItems={undefined} justifyContent={undefined} gap={undefined} border={undefined} borderColor={undefined} />)}
            data-cy="toolbox-text"
          >
            Icon Button
          </div>
        </div>
      </div>
    </div>
  )
}
