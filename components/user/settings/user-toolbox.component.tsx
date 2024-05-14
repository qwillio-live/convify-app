import React from "react"
import Image from "next/image"
import ConvifyLogo from "@/assets/convify_logo_black.png"
import FirstLogo from "@/assets/images/first-logo.png"
import FourthLogo from "@/assets/images/fourth-logo.png"
import SecondLogo from "@/assets/images/second-logo.png"
import ThirdLogo from "@/assets/images/third-logo.png"
import cn from "classnames"
import {
  ArrowRight,
  Bookmark,
  Box,
  Chrome,
  CircleSlashed,
  Columns,
  Copy,
  Diamond,
  Dice2,
  Facebook,
  Globe,
  GripVertical,
  Hand,
  HeartHandshake,
  Image as ImageIcon,
  ImagePlus,
  Layout,
  Linkedin,
  MousePointer2,
  Navigation,
  Pencil,
  PlusSquare,
  Rocket,
  Square,
  Target,
  TextCursorInput,
  Trophy,
  Type,
  Loader as LoaderIcon,
} from "lucide-react"

import { Editor, Element, Frame, useEditor } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import CustomLoader from "@/components/ui/loader"
import { Card as UiCard } from "@/components/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  ButtonDefaultProps,
  Button as UserButton,
} from "@/components/user/button/user-button.component"
import {
  LoaderDefaultProps,
  Loader,
} from "@/components/user/loader/user-loader.component"
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
import { UserInput, UserInputDefaultProps } from "../input/user-input.component"
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
import {
  ProgressBar,
  ProgressBarDefaultProps,
} from "../progress/user-progress.component"
import { Progress as CustomProgressBar } from "@/components/ui/progress-custom"
const MultipleChoiceOptions = [
  {
    id: "1",
    text: "Option 1",
    icon: <Chrome className="h-6 w-6 text-lg" />,
  },
  {
    id: "2",
    text: "Option 2",
    icon: <Facebook className="h-6 w-6" />,
  },
  {
    id: "3",
    text: "Option 3",
    icon: <Linkedin className="h-6 w-6" />,
  },
  {
    id: "4",
    text: "Option 4",
    icon: <Globe className="h-6 w-6" />,
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
          <p className="text-justify text-sm font-light">
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

        <ScrollArea className="w-full overflow-y-auto pb-32 pt-4">
          <Accordion
            type="multiple"
            defaultValue={["item-1", "item-2", "item-3", "item-4", "item-5"]}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="uppercase hover:no-underline">
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
                        className="flex w-full flex-row items-center justify-between text-lg hover:cursor-grab hover:no-underline"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Type className="mr-2 h-3 w-3" /> Headline{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <div className="flex flex-row items-center justify-center gap-2 border p-4">
                        <h1 className="text-lg font-semibold">
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
                        className="flex w-full flex-row items-center justify-between text-lg hover:cursor-grab hover:no-underline"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Pencil className="mr-2 h-3 w-3" /> Text{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <div className="flex flex-row items-center justify-center gap-2 border p-4">
                        <p className="text-base font-normal">
                          A good description of your cause
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="uppercase hover:no-underline">
                Input
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
                <div
                  className="group min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(
                      ref,
                      <UserInput {...UserInputDefaultProps} />
                    )
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="link"
                        className="flex w-full flex-row items-center justify-between text-lg hover:cursor-grab hover:no-underline"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <TextCursorInput className="mr-2 h-3 w-3" /> Input
                          field{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <Input
                        placeholder="Placeholder"
                        className="ring-offset-0 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      />
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
                        className="flex w-full flex-row items-center justify-between text-lg hover:cursor-grab hover:no-underline"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <ImagePlus className="mr-2 h-3 w-3" /> Picture Choice{" "}
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
                        <div
                          className="flex flex-col items-center justify-center gap-4 rounded-[8px] border-2
                                      border-[#eaeaeb] bg-white
                                    p-4 text-lg font-bold
                                    hover:cursor-pointer hover:border-[#4050ff]
                                      hover:bg-[#4050ff]
                                    hover:text-white
                        "
                        >
                          <Target className="h-10 w-10" />
                          Target
                        </div>
                        <div
                          className="flex flex-col items-center justify-center gap-4 rounded-[8px] border-2
                                      border-[#eaeaeb] bg-white
                                    p-4 text-lg font-bold
                                    hover:cursor-pointer hover:border-[#4050ff]
                                      hover:bg-[#4050ff]
                                    hover:text-white"
                        >
                          <Rocket className="h-10 w-10" />
                          Launch
                        </div>
                        <div
                          className="flex flex-col items-center justify-center gap-4 rounded-[8px] border-2
                                      border-[#eaeaeb] bg-white
                                    p-4 text-lg font-bold
                                    hover:cursor-pointer hover:border-[#4050ff]
                                      hover:bg-[#4050ff]
                                    hover:text-white"
                        >
                          <HeartHandshake className="h-10 w-10" />
                          Agree
                        </div>
                        <div
                          className="flex flex-col items-center justify-center gap-4 rounded-[8px] border-2
                                      border-[#eaeaeb] bg-white
                                    p-4 text-lg font-bold
                                    hover:cursor-pointer hover:border-[#4050ff]
                                      hover:bg-[#4050ff]
                                    hover:text-white"
                        >
                          <Trophy className="h-10 w-10" />
                          Achieve
                        </div>
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
                        className="flex w-full flex-row items-center justify-between text-lg hover:cursor-grab hover:no-underline"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Copy className="mr-2 h-3 w-3" /> Multiple Choice
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <div className="flex w-[360px] flex-col gap-2">
                        {MultipleChoiceOptions.map((option, index) => (
                          <div
                            key={index}
                            className="
                      option
                      flex flex-row
                      items-center gap-2 rounded-[8px]
                      border-2 border-[#eaeaeb]
                        bg-white
                      p-4 text-lg font-bold hover:cursor-pointer hover:border-[#4050ff] hover:bg-[#4050ff] hover:text-white"
                          >
                            <input type="radio" className="hidden" />
                            {/* {option.icon} */}
                            <label>{option.text}</label>
                          </div>
                        ))}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="uppercase hover:no-underline">
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
                        {...IconButtonDefaultProps}
                        disabled={false}
                      />
                    )
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="link"
                        className="flex w-full flex-row items-center justify-between text-lg hover:cursor-grab hover:no-underline"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Navigation className="mr-2 h-3 w-3" />
                          Button{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <Button className="w-[360px] bg-[#4050ff] px-4 py-6 text-white hover:bg-[#3041ff]">
                        Get quote
                        <ArrowRight className="ml-2" />
                      </Button>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="uppercase hover:no-underline">
                Display
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
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
                        className="flex w-full flex-row items-center justify-between text-lg hover:cursor-grab hover:no-underline"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Dice2 className="mr-2 h-3 w-3" /> Logo{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <Image
                        src={ConvifyLogo.src}
                        alt="Logo"
                        width={120}
                        height={42}
                      />
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
                        className="flex w-full flex-row items-center justify-between text-lg hover:cursor-grab hover:no-underline"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <Columns className="mr-2 h-3 w-3" /> Logo Bar{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <div className="flex w-[360px] flex-row items-center justify-between border p-4">
                        <Image
                          src={FirstLogo.src}
                          alt="Logo"
                          width={60}
                          height={32}
                        />
                        <Image
                          src={SecondLogo.src}
                          alt="Logo"
                          width={60}
                          height={32}
                        />
                        <Image
                          src={ThirdLogo.src}
                          alt="Logo"
                          width={60}
                          height={32}
                        />
                        <Image
                          src={FourthLogo.src}
                          alt="Logo"
                          width={60}
                          height={32}
                        />
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
                      <ProgressBar {...ProgressBarDefaultProps} />
                    )
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="link"
                        className="flex w-full flex-row items-center justify-between text-lg hover:cursor-grab hover:no-underline"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <CircleSlashed className="mr-2 h-3 w-3" /> Progress
                          bar{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full"
                      side="left"
                      sideOffset={18}
                    >
                      <div className="flex w-[360px] flex-row items-center justify-between border p-4">
                        <CustomProgressBar
                          value={50}
                          className="h-1 max-w-[366px]"
                          indicatorColor={"#4050ff"}
                        />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="uppercase hover:no-underline">
                Navigation
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
                <div
                  className="group min-w-full cursor-pointer rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(ref, <Loader {...LoaderDefaultProps} />)
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="link"
                        className="flex w-full flex-row items-center justify-between text-lg hover:cursor-grab hover:no-underline"
                      >
                        <span className="flex flex-row items-center text-sm">
                          <LoaderIcon className="mr-2 size-3" />
                          Loader{" "}
                        </span>{" "}
                        <GripVertical />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-full px-10 py-6"
                      side="left"
                      sideOffset={18}
                    >
                      <CustomLoader size="small" />
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
