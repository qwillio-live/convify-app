import React from "react"
import {
  Bookmark,
  Box,
  Chrome,
  Columns,
  Copy,
  Diamond,
  Dice2,
  Facebook,
  Globe,
  Image,
  ImagePlus,
  Layout,
  Linkedin,
  Navigation,
  Pencil,
  PlusSquare,
  Square,
  Type,
} from "lucide-react"

import { Editor, Element, Frame, useEditor } from "@/lib/craftjs"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button as UserButton, ButtonDefaultProps } from "@/components/user/button/user-button.component"
import {
  TextDefaultProps,
  UserText,
} from "@/components/user/text/user-text.component"

import { Card } from "../card/user-card.component"
import { Container, ContainerDefaultProps } from "../container/user-container.component"
import {
  IconButton,
  IconButtonDefaultProps,
} from "../icon-button/user-icon-button.component"
import { Logo, LogoDefaultProps } from "../logo/user-logo.component"
import {
  MultipleChoice,
  MultipleChoiceDefaultProps,
} from "../multiple-choice/user-multiple-choice.component"
import {
  PictureChoice,
  PictureChoiceDefaultProps,
} from "../picture-choice/picture-choice.component"
import { LogoBar, LogoBarDefaultProps } from "../logo-bar/logo-bar.component"
import { HeadlineText, HeadlineTextDefaultProps } from "../headline-text/headline-text.component"
import { ScrollArea } from "@/components/ui/scroll-area"

const MultipleChoiceOptions = [
  {
    id: "1",
    text: "Google",
    icon: <Chrome className="w-6 h-6 text-lg" />,
  },
  {
    id: "2",
    text: "Facebook",
    icon: <Facebook className="w-6 h-6" />,
  },
  {
    id: "3",
    text: "Linkedin",
    icon: <Linkedin className="w-6 h-6" />,
  },
  {
    id: "4",
    text: "Other",
    icon: <Globe className="w-6 h-6" />,
  },
]

export const UserToolbox = () => {
  const { connectors } = useEditor()

  return (
    <div className="p-y">
      <div className="flex flex-col items-center justify-center space-y-1">
        <div className="pb-2">
          <p>Drag to add</p>
        </div>

        <ScrollArea className="overflow-y-auto py-4 w-full">
        <div className="flex w-full basis-full flex-col gap-2">
        <div
            className="group min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
            //eslint-disable-next-line
            ref={(ref: any) =>
              ref &&
              connectors.create(
                ref,
                <UserText {...TextDefaultProps} />
              )
            }
            data-cy="toolbox-text"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="hover:no-underline flex flex-row items-center text-lg">
                  <Pencil className="mr-4" /> Text
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-full" side="left" sideOffset={18}>
                <div className="flex flex-row gap-2 justify-center items-center p-4 border">
                  <p className="font-normal text-base">A good description of your cause</p>
                </div>
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
                <HeadlineText {...HeadlineTextDefaultProps} />
              )
            }
            data-cy="toolbox-text"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="hover:no-underline flex flex-row items-center text-lg">
                  <Type className="mr-4" /> Headline
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-full" side="left" sideOffset={18}>
                <div className="flex flex-row gap-2 justify-center items-center p-4 border">
                  <h1 className="font-semibold text-lg">Headline for your business</h1>
                </div>
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
                <UserButton {...ButtonDefaultProps} />
              )
            }
            data-cy="toolbox-text"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="hover:no-underline flex flex-row items-center text-lg">
                  <PlusSquare className="mr-4" /> Button
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-full" side="left" sideOffset={18}>
                <Button variant="secondary">Register</Button>
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
                <Card {...ContainerDefaultProps} />
              )
            }
            data-cy="toolbox-text"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="hover:no-underline flex flex-row items-center text-lg">
                  <Diamond className="mr-4" /> Card
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-full" side="left" sideOffset={18}>
                <Square className="h-10 w-10" />
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
                <Container {...ContainerDefaultProps} />
              )
            }
            data-cy="toolbox-text"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="hover:no-underline flex flex-row items-center text-lg">
                  <Layout className="mr-4" /> Container
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-full" side="left" sideOffset={18}>
                <Square className="h-10 w-16" />
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
                <IconButton disabled={false} {...IconButtonDefaultProps} />
              )
            }
            data-cy="toolbox-text"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="hover:no-underline flex flex-row items-center text-lg">
                  <Navigation className="mr-4" /> Button
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-full" side="left" sideOffset={18}>
                <Button variant="secondary">
                  Register
                  <Bookmark  className="ml-2" />
                </Button>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div
            className="group min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
            //eslint-disable-next-line
            ref={(ref: any) =>
              ref && connectors.create(ref, <Logo {...LogoDefaultProps} />)
            }
            data-cy="toolbox-text"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="hover:no-underline flex flex-row items-center text-lg">
                  <Dice2 className="mr-4" /> Logo
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
                <Button variant="link" className="hover:no-underline flex flex-row items-center text-lg">
                  <ImagePlus className="mr-4" /> Picture Choice
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-full" side="left" sideOffset={18}>
                <div className="grid grid-cols-2 gap-2">
                  <Image className="h-10 w-10 col-span-1" />
                  <Image className="h-10 w-10 col-span-1" />
                  <Image className="h-10 w-10 col-span-1" />
                  <Image className="h-10 w-10 col-span-1" />
                </div>
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
                <MultipleChoice {...MultipleChoiceDefaultProps} />
              )
            }
            data-cy="toolbox-text"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="hover:no-underline flex flex-row items-center text-lg">
                  <Copy className="mr-4" /> Multiple Choice
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-full" side="left" sideOffset={18}>
                <div className="flex flex-col gap-2 w-[360px]">
                  {MultipleChoiceOptions.map((option, index) => (
                    <div
                      key={index}
                      className="
                      text-lg
                      hover:cursor-pointer bg-white
                      hover:bg-[#4050ff] rounded-[8px] border-2
                      border-[#eaeaeb] hover:border-[#4050ff]
                        font-bold
                      hover:text-white option flex flex-row p-4 gap-2 items-center"
                    >
                      <input type="radio" className="hidden" />
                      {option.icon}
                      <label>{option.text}</label>
                    </div>
                  ))}
                </div>
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
                <LogoBar {...LogoBarDefaultProps} />
              )
            }
            data-cy="toolbox-text"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="hover:no-underline flex flex-row items-center text-lg">
                  <Columns className="mr-4" /> Logo Bar
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-full" side="left" sideOffset={18}>
                <div className="flex flex-row gap-2 justify-center items-center p-4 border">
                  <Image className="h-10 w-10 col-span-1" />
                  <Image className="h-10 w-10 col-span-1" />
                  <Image className="h-10 w-10 col-span-1" />
                  <Image className="h-10 w-10 col-span-1" />
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          </div>{/* End of Container */}

          </ScrollArea>
      </div>
    </div>
  )
}
