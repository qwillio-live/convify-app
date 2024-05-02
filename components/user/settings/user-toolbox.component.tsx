import React from "react"
import { Bookmark, Image } from "lucide-react"

import { Editor, Element, Frame, useEditor } from "@/lib/craftjs"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button as UserButton } from "@/components/user/button/user-button.component"
import { UserText } from "@/components/user/user-text.component"

import { Card } from "../card/user-card.component"
import { Container } from "../container/user-container.component"
import { IconButton, IconButtonDefaultProps } from "../icon-button/user-icon-button.component"
import { Logo, LogoDefaultProps } from "../logo/user-logo.component"
import { PictureChoice, PictureChoiceDefaultProps } from "../picture-choice/picture-choice.component"

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
              ref &&
              connectors.create(
                ref,
                <UserText
                  text="Your text"
                  textColor={"inherit"}
                  tagType={"p"}
                />
              )
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
                  text={"Button"}
                  background={undefined}
                  custom={undefined}
                />
              )
            }
            data-cy="toolbox-text"
          >
            Button
          </div>

          <div
            className="min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
            //eslint-disable-next-line
            ref={(ref: any) =>
              ref && connectors.create(ref, <Card background={undefined} />)
            }
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
            className="group min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
            //eslint-disable-next-line
            ref={(ref: any) =>
              ref &&
              connectors.create(
                ref,
                <IconButton
                  disabled={false}
                  {...IconButtonDefaultProps}
                />
              )
            }
            data-cy="toolbox-text"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="hover:no-underline">
                  Icon Button
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-full" side="left" sideOffset={18}>
                <Editor enabled={false} resolver={{ IconButton }}>
                  <Frame>
                    <IconButton
                      disabled={true}
                      {...IconButtonDefaultProps}
                    />
                  </Frame>
                </Editor>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div
            className="group min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
            //eslint-disable-next-line
            ref={(ref: any) =>
              ref &&
              connectors.create(
                ref,
                <Logo
                  {...LogoDefaultProps}
                />
              )
            }
            data-cy="toolbox-text"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="hover:no-underline">
                  Logo
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-full" side="left" sideOffset={18}>
                     <Image className="h-10 w-10" />
              </HoverCardContent>
            </HoverCard>
          </div>

          <div
            className="group min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
            //eslint-disable-next-line
            ref={(ref: any) =>
              ref &&
              connectors.create(
                ref,
                <PictureChoice {...PictureChoiceDefaultProps} />
              )
            }
            data-cy="toolbox-text"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="hover:no-underline">
                  Picture Choice
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-full" side="left" sideOffset={18}>
                     <Image className="h-10 w-10" />
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </div>
  )
}
