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
  Circle,
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
import { Input } from "@/components/ui/input"
import { Progress as CustomProgressBar } from "@/components/ui/progress-custom"
import { ScrollArea } from "@/components/ui/scroll-area"
// import { Toggle, ToggleItem } from "@/components/ui/toggle-group"
import { Toggle } from "@/components/ui/toggle"
import {
  ButtonDefaultProps,
  Button as UserButton,
} from "@/components/user/button/user-button.component"
import {
  TextDefaultProps,
  UserText,
} from "@/components/user/text/user-text.component"

import { Card, CardContentDefaultProps } from "../card/user-card.component"
import {
  Container,
  ContainerDefaultProps,
  UserContainer,
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
import { is } from "date-fns/locale"
import { LayoutContainer, LayoutContainerDefaultProps } from "../layout-container/layout-container.component"

const MultipleChoiceOptions = [
  {
    id: "1",
    text: "Option 1",
    icon: <Chrome className="w-6 h-6 text-lg" />,
  },
  {
    id: "2",
    text: "Option 2",
    icon: <Facebook className="w-6 h-6" />,
  },
  {
    id: "3",
    text: "Option 3",
    icon: <Linkedin className="w-6 h-6" />,
  },
  {
    id: "4",
    text: "Option 4",
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

// const DragOverlay = ({ children }) => {
//   const [isDragging, setIsDragging] = React.useState(false)
//   const [dragPosition, setDragPosition] = React.useState({ x: 0, y: 0 })

//   const handleMouseDown = (e) => {
//     setIsDragging(true)
//     setDragPosition({ x: e.clientX, y: e.clientY })
//   }

//   const handleMouseMove = (e) => {
//     if (isDragging) {
//       setDragPosition({ x: e.clientX, y: e.clientY })
//     }
//   }

//   const handleMouseUp = () => {
//     setIsDragging(false)
//   }

//   React.useEffect(() => {
//     document.addEventListener("mousemove", handleMouseMove)
//     document.addEventListener("mouseup", handleMouseUp)

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove)
//       document.removeEventListener("mouseup", handleMouseUp)
//     }
//   }, [isDragging])

//   return (
//     <div
//       className="drag-overlay flex flex-row items-center text-lg w-full justify-between"
//       style={{
//         position: `${isDragging ? "relative" : "relative"}`,
//         // top: `${dragPosition.y}px`,
//         // left: `${dragPosition.x}px`,
//         top: "0",
//         left: "0",
//         cursor: "move",
//       }}
//       onMouseDown={handleMouseDown}
//     >
//       {children}
//     </div>
//   )
// }

const HoverCardComponent = ({ title, icon, children }) => {
  const [openCard, setOpenCard] = React.useState(false)
  return (
    <>
    <div
    onMouseOver={() => setOpenCard(true)}
    onMouseLeave={() => setOpenCard(false)}
    onMouseDown={() => setOpenCard(!openCard)}
    className="hover:cursor-move flex flex-row items-center text-lg w-full justify-between"><span className="flex flex-row items-center text-sm gap-2">{icon} {title}</span> <GripVertical className="shrink-0 right-4" /></div>
    {openCard && (
    <HoverCard
      openDelay={0}
    >
      <HoverCardTrigger
      asChild={false}
      className="w-full">
      </HoverCardTrigger>
      <HoverCardContent
      className="flex flex-row justify-center items-center"
      forceMount={true}
      avoidCollisions side="left" sideOffset={18}>
        {children}
      </HoverCardContent>
    </HoverCard>
    )}
    </>
  )
}

export const UserToolbox = () => {

  const { connectors } = useEditor()

  return (
    <div className="p-y" draggable={false}>
      <div className="flex flex-col items-center justify-center space-y-1">
        <HelperInformation />

        <ScrollArea className="overflow-y-auto pt-4 pb-32 w-full">
          <Accordion
            type="multiple"
            defaultValue={["item-1", "item-2", "item-3", "item-4"]}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:no-underline uppercase">
                Text
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
                <div
                  className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(
                      ref,
                      <HeadlineText {...HeadlineTextDefaultProps} />
                    )
                  }
                  data-cy="toolbox-headline"
                >
                  <HoverCardComponent
                    title="Headline"
                    icon={<Type className="mr-2 w-3 h-3" />}
                  >
                    <div className="flex w-fit flex-row gap-2 justify-center items-center p-4 border">
                      <h1 className="font-semibold text-lg">
                        Headline for your business
                      </h1>
                    </div>
                  </HoverCardComponent>
                </div>

                <div
                  className=" min-w-full  rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(ref, <UserText {...TextDefaultProps} />)
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCardComponent
                    title="Text"
                    icon={<Pencil className="mr-2 w-3 h-3" />}
                  >
                    <div className="flex w-fit flex-row gap-2 justify-center items-center p-4 border">
                      <h1 className="font-semibold text-lg">
                      A good description of your cause
                      </h1>
                    </div>
                  </HoverCardComponent>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="hover:no-underline uppercase">
                Input
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
                <div
                  className=" min-w-full  rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                                    <HoverCardComponent
                    title="Input field"
                    icon={<TextCursorInput className="mr-2 w-3 h-3" />}
                  >
                      <Input
                        placeholder="Placeholder"
                        className="focus-visible:ring-blue-600 ring-offset-0 focus-visible:ring-offset-0"
                      />
                  </HoverCardComponent>
                </div>

                <div
                  className=" min-w-full  rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                      <HoverCardComponent
                    title="Picture Choice"
                    icon={<ImagePlus className="mr-2 w-3 h-3" />}
                  >
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          className="flex flex-col gap-4 p-4 items-center justify-center text-lg
                                      hover: bg-white
                                    hover:bg-[#4050ff] rounded-[8px] border-2
                                    border-[#eaeaeb] hover:border-[#4050ff]
                                      font-bold
                                    hover:text-white
                        "
                        >
                          <Target className="h-10 w-10" />
                          Target
                        </div>
                        <div
                          className="flex flex-col gap-4 p-4 items-center justify-center text-lg
                                      hover: bg-white
                                    hover:bg-[#4050ff] rounded-[8px] border-2
                                    border-[#eaeaeb] hover:border-[#4050ff]
                                      font-bold
                                    hover:text-white"
                        >
                          <Rocket className="h-10 w-10" />
                          Launch
                        </div>
                        <div
                          className="flex flex-col gap-4 p-4 items-center justify-center text-lg
                                      hover: bg-white
                                    hover:bg-[#4050ff] rounded-[8px] border-2
                                    border-[#eaeaeb] hover:border-[#4050ff]
                                      font-bold
                                    hover:text-white"
                        >
                          <HeartHandshake className="h-10 w-10" />
                          Agree
                        </div>
                        <div
                          className="flex flex-col gap-4 p-4 items-center justify-center text-lg
                                      hover: bg-white
                                    hover:bg-[#4050ff] rounded-[8px] border-2
                                    border-[#eaeaeb] hover:border-[#4050ff]
                                      font-bold
                                    hover:text-white"
                        >
                          <Trophy className="h-10 w-10" />
                          Achieve
                        </div>
                      </div>
                  </HoverCardComponent>
                </div>

                <div
                  className=" min-w-full  rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                                    <HoverCardComponent
                    title="Multiple Choice"
                    icon={<Copy className="mr-2 w-3 h-3" />}
                  >
                      <div className="flex flex-col gap-2 w-full">
                        {MultipleChoiceOptions.map((option, index) => (
                          <div
                            key={index}
                            className="
                      text-lg
                      hover: bg-white
                      hover:bg-[#4050ff] rounded-[8px] border-2
                      border-[#eaeaeb] hover:border-[#4050ff]
                        font-bold
                      hover:text-white option flex flex-row p-4 gap-2 items-center"
                          >
                            <input type="radio" className="hidden" />
                            {/* {option.icon} */}
                            <label>{option.text}</label>
                          </div>
                        ))}
                      </div>
                  </HoverCardComponent>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="hover:no-underline uppercase">
                Button
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
                <div
                  className=" min-w-full  rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                                    <HoverCardComponent
                    title="Button"
                    icon={<Navigation className="mr-2 w-3 h-3" />}
                  >
                      <Button className="w-full bg-[#4050ff] text-white hover:bg-[#3041ff] px-4 py-6">
                        Get quote
                        <ArrowRight className="ml-2" />
                      </Button>
                  </HoverCardComponent>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="hover:no-underline uppercase">
                Display
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">

              <div
                  className=" min-w-full  rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    connectors.create(ref, <Card {...CardContentDefaultProps} />)
                  }
                  data-cy="toolbox-layout-container"
                >
                                    <HoverCardComponent
                    title="Container"
                    icon={<Dice2 className="mr-2 w-3 h-3" />}
                  >
                      <Image
                        src={ConvifyLogo.src}
                        alt="Logo"
                        width={120}
                        height={42}
                      />
                  </HoverCardComponent>
                </div>

                <div
                  className=" min-w-full  rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(ref, <Logo {...LogoDefaultProps} />)
                  }
                  data-cy="toolbox-text"
                >
                                    <HoverCardComponent
                    title="Logo"
                    icon={<Dice2 className="mr-2 w-3 h-3" />}
                  >
                      <Image
                        src={ConvifyLogo.src}
                        alt="Logo"
                        width={120}
                        height={42}
                      />
                  </HoverCardComponent>
                </div>

                <div
                  className=" min-w-full  rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(ref, <LogoBar {...LogoBarDefaultProps} />)
                  }
                  data-cy="toolbox-text"
                >
                                    <HoverCardComponent
                    title="Logo Bar"
                    icon={<Columns className="mr-2 w-3 h-3" />}
                  >
              <div className="flex flex-row justify-between items-center p-2 border w-[366px]">
                        <Image
                          src={FirstLogo.src}
                          alt="Logo"
                          width={42}
                          height={22}
                        />
                        <Image
                          src={SecondLogo.src}
                          alt="Logo"
                          width={42}
                          height={22}
                        />
                        <Image
                          src={ThirdLogo.src}
                          alt="Logo"
                          width={42}
                          height={22}
                        />
                        <Image
                          src={FourthLogo.src}
                          alt="Logo"
                          width={42}
                          height={22}
                        />
                      </div>
                  </HoverCardComponent>
                </div>

                <div
                  className=" min-w-full  rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                                    <HoverCardComponent
                    title="Progress"
                    icon={<CircleSlashed className="mr-2 w-3 h-3" />}
                  >
                      <div className="flex flex-row justify-between items-center p-4 border w-[360px]">
                        <CustomProgressBar
                          value={50}
                          className="h-1 max-w-[366px]"
                          indicatorColor={"#4050ff"}
                        />
                      </div>
                  </HoverCardComponent>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>
    </div>
  )
}
