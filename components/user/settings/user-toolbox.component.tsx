import React from "react"
import cn from "classnames"
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
  GripVertical,
  Hand,
  Image as ImageIcon,
  ImagePlus,
  Layout,
  Linkedin,
  MousePointer2,
  Navigation,
  Pencil,
  PlusSquare,
  Square,
  Type,
} from "lucide-react"

import { Editor, Element, Frame, useEditor } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card as UiCard } from "@/components/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  ButtonDefaultProps,
  Button as UserButton,
} from "@/components/user/button/user-button.component"
import {
  TextDefaultProps,
  UserText,
} from "@/components/user/text/user-text.component"

import { Card } from "../card/user-card.component"
import {
  Container,
  ContainerDefaultProps,
} from "../container/user-container.component"
import {
  HeadlineText,
  HeadlineTextDefaultProps,
} from "../headline-text/headline-text.component"
import {
  IconButton,
  IconButtonDefaultProps,
} from "../icon-button/user-icon-button.component"
import { LogoBar, LogoBarDefaultProps } from "../logo-bar/logo-bar.component"
import { Logo, LogoDefaultProps } from "../logo/user-logo.component"
import {
  MultipleChoice,
  MultipleChoiceDefaultProps,
} from "../multiple-choice/user-multiple-choice.component"
import {
  PictureChoice,
  PictureChoiceDefaultProps,
} from "../picture-choice/picture-choice.component"

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

function HelperInformation() {
  return (
    <UiCard
      className={cn(
        "flex flex-col items-center justify-center border border-gray-500 px-2 py-3"
      )}
    >
      <div className="flex flex-row items-start gap-1 text-left">
        <Hand className="shrink-0" />
        <div>
          <h2 className="mb-1 text-base font-semibold uppercase text-gray-950 dark:text-slate-50">
            Drag and drop
          </h2>
          <p className="text-sm font-light text-justify">
            Click and hold a block from list, move it to the panel to the left
            and release it above the drop zone to add it.
          </p>
        </div>
      </div>
    </UiCard>
  )
}

export const UserToolbox = () => {
  const { connectors } = useEditor()

  return (
    <div className="p-y">
      <div className="flex flex-col items-center justify-center space-y-1">
        <HelperInformation />

        <ScrollArea className="overflow-y-auto pt-4 pb-8 w-full">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:no-underline uppercase">
                Text
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
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
                      <Button
                        variant="link"
                        className="hover:no-underline hover:cursor-grab flex flex-row items-center text-lg w-full justify-between"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Type className="mr-2 w-3 h-3" /> Headline{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <div className="flex flex-row gap-2 justify-center items-center p-4 border">
                        <h1 className="font-semibold text-lg">
                          Headline for your business
                        </h1>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>

                <div
                  className="group min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(ref, <UserText {...TextDefaultProps} />)
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="link"
                        className="hover:no-underline hover:cursor-grab flex flex-row items-center text-lg w-full justify-between"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Pencil className="mr-2 w-3 h-3" /> Text{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <div className="flex flex-row gap-2 justify-center items-center p-4 border">
                        <p className="font-normal text-base">
                          A good description of your cause
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="hover:no-underline uppercase">
                Input
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
                Input component here needs to be added
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="hover:no-underline uppercase">
                Button
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
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
                      <Button
                        variant="link"
                        className="hover:no-underline hover:cursor-grab flex flex-row items-center text-lg w-full justify-between"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Navigation className="mr-2 w-3 h-3" />
                          Icon Button{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <Button variant="secondary">
                        Register
                        <Bookmark className="ml-2" />
                      </Button>
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
                      <Button
                        variant="link"
                        className="hover:no-underline hover:cursor-grab flex flex-row items-center text-lg w-full justify-between"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <PlusSquare className="mr-2 w-3 h-3" /> Button{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <Button variant="secondary">Register</Button>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="hover:no-underline uppercase">
                Display
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
                <div
                  className="group min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(ref, <Card {...ContainerDefaultProps} />)
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="link"
                        className="hover:no-underline hover:cursor-grab flex flex-row items-center text-lg w-full justify-between"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Diamond className="mr-2 w-3 h-3" /> Card{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
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
                      <Button
                        variant="link"
                        className="hover:no-underline hover:cursor-grab flex flex-row items-center text-lg w-full justify-between"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Layout className="mr-2 w-3 h-3" /> Container{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <Square className="h-10 w-16" />
                    </HoverCardContent>
                  </HoverCard>
                </div>

                <div
                  className="group min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(ref, <Logo {...LogoDefaultProps} />)
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="link"
                        className="hover:no-underline hover:cursor-grab flex flex-row items-center text-lg w-full justify-between"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Dice2 className="mr-2 w-3 h-3" /> Logo{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <ImageIcon className="h-10 w-10" />
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
                      <Button
                        variant="link"
                        className="hover:no-underline hover:cursor-grab flex flex-row items-center text-lg w-full justify-between"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <ImagePlus className="mr-2 w-3 h-3" /> Picture Choice{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <ImageIcon className="h-10 w-10 col-span-1" />
                        <ImageIcon className="h-10 w-10 col-span-1" />
                        <ImageIcon className="h-10 w-10 col-span-1" />
                        <ImageIcon className="h-10 w-10 col-span-1" />
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
                      <Button
                        variant="link"
                        className="hover:no-underline hover:cursor-grab flex flex-row items-center text-lg w-full justify-between"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Copy className="mr-2 w-3 h-3" /> Multiple Choice
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
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
                    connectors.create(ref, <LogoBar {...LogoBarDefaultProps} />)
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="link"
                        className="hover:no-underline hover:cursor-grab flex flex-row items-center text-lg w-full justify-between"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Columns className="mr-2 w-3 h-3" /> Logo Bar{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <div className="flex flex-row gap-2 justify-center items-center p-4 border">
                        <ImageIcon className="h-10 w-10 col-span-1" />
                        <ImageIcon className="h-10 w-10 col-span-1" />
                        <ImageIcon className="h-10 w-10 col-span-1" />
                        <ImageIcon className="h-10 w-10 col-span-1" />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>
    </div>
  )
}
