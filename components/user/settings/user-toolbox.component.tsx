import React from "react"
import Image from "next/image"
import ConvifyLogo from "@/assets/convify_logo_black.png"
import FirstLogo from "@/assets/images/first-logo.png"
import FourthLogo from "@/assets/images/fourth-logo.png"
import ImagePlaceholder from "@/assets/images/image-component-placeholder.webp"
import SecondLogo from "@/assets/images/second-logo.png"
import ThirdLogo from "@/assets/images/third-logo.png"
import cn from "classnames"
import {
  Box,
  Chrome,
  CircleSlashed,
  Columns,
  Copy,
  Dice2,
  Facebook,
  Globe,
  GripVertical,
  Hand,
  HeartHandshake,
  Image as ImageIcon,
  ImagePlus,
  Linkedin,
  Loader as LoaderIcon,
  Navigation,
  Pencil,
  Rocket,
  Target,
  TextCursorInput,
  Trophy,
  Type,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { useEditor } from "@/lib/craftjs"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
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
import CustomLoader from "@/components/ui/loader"
import { Progress as CustomProgressBar } from "@/components/ui/progress-custom"
import { ScrollArea } from "@/components/ui/scroll-area"
// import { Toggle, ToggleItem } from "@/components/ui/toggle-group"
import {
  Loader,
  LoaderDefaultProps,
} from "@/components/user/loader/user-loader.component"
import {
  TextDefaultProps,
  UserText,
} from "@/components/user/text/user-text.component"

import { Card, CardContentDefaultProps } from "../card/user-card.component"
import {
  HeadlineText,
  HeadlineTextDefaultProps,
} from "../headline-text/headline-text.component"
import useButtonThemePresets from "../icon-button/useButtonThemePresets"
import {
  IconButton,
  IconButtonGen,
} from "../icon-button/user-icon-button.component"
import { Img, ImgDefaultProps } from "../image/user-image-component"
import useInputThemePresets from "../input/useInputThemePresets"
import { UserInput, UserInputGen } from "../input/user-input.component"
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

const MultipleChoiceOptions = [
  {
    id: "1",
    text: "Option 1",
    icon: <Chrome className="size-6 text-lg" />,
  },
  {
    id: "2",
    text: "Option 2",
    icon: <Facebook className="size-6" />,
  },
  {
    id: "3",
    text: "Option 3",
    icon: <Linkedin className="size-6" />,
  },
  {
    id: "4",
    text: "Option 4",
    icon: <Globe className="size-6" />,
  },
]

const ListOptions = [
  {
    id: "1",
    text: "User Friendly",
    subText: "Saves time and frustation",
    icon: (
      <svg
        className="size-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M11.566 1.017a.486.486 0 0 1 .868 0l1.009 2.034a.483.483 0 0 0 .363.262l2.264.327a.481.481 0 0 1 .389.323.47.47 0 0 1-.121.487L14.7 6.044a.473.473 0 0 0-.138.419l.388 2.247a.474.474 0 0 1-.194.465.487.487 0 0 1-.509.035l-2.021-1.054a.482.482 0 0 0-.452 0L9.758 9.21a.487.487 0 0 1-.509-.035.474.474 0 0 1-.194-.465l.388-2.247a.473.473 0 0 0-.138-.419L7.662 4.45a.47.47 0 0 1-.121-.487.481.481 0 0 1 .389-.323l2.264-.327a.483.483 0 0 0 .363-.262ZM6.322 10.1l-.863-.45a.49.49 0 0 0-.453 0L2.991 10.7a.491.491 0 0 1-.51-.034.474.474 0 0 1-.193-.466l.387-2.246a.471.471 0 0 0-.137-.419L.894 5.944a.472.472 0 0 1-.12-.487.481.481 0 0 1 .389-.323l2.263-.327a.483.483 0 0 0 .364-.262L4.8 2.511a.484.484 0 0 1 .434-.267M17.678 10.1l.863-.451a.49.49 0 0 1 .453 0l2.015 1.051a.491.491 0 0 0 .51-.034.474.474 0 0 0 .193-.466l-.387-2.246a.471.471 0 0 1 .137-.419l1.644-1.595a.472.472 0 0 0 .12-.487.481.481 0 0 0-.389-.323l-2.263-.327a.483.483 0 0 1-.364-.262l-1.01-2.03a.484.484 0 0 0-.434-.267M17.027 23.243a6.678 6.678 0 0 0-10.052 0"
          style={{
            fill: "none",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "1.5px",
          }}
        />
        <circle
          cx="12"
          cy="15.336"
          r="4.125"
          style={{
            fill: "none",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "1.5px",
          }}
        />
      </svg>
    ),
  },
  {
    id: "2",
    text: "Seamless and elegant",
    subText: "It's fun to work with",
    icon: (
      <svg
        className="size-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M10.621 17.879c1.589-1.9.1-4.338 1.513-5.981a2.759 2.759 0 1 1 4.179 3.6 6.5 6.5 0 0 1-5.692 2.381Z"
          style={{
            fill: "none",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "1.5px",
          }}
        />
        <path
          d="m16.6 12.291 6.231-8.253A2.038 2.038 0 1 0 19.377 1.9l-4.53 9.116M7.557 17.07c-5.3-1.343-3.222-4.116-5.557-4.116-3.036 0-.088 6.968 4.892 9.555a7.459 7.459 0 0 0 8.389-1.435l.081-.082"
          style={{
            fill: "none",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "1.5px",
          }}
        />
      </svg>
    ),
  },
  {
    id: "3",
    text: "Secure and private",
    subText: "Your data is protected",
    icon: (
      <svg
        className="size-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M2.25 3.923v7.614A11.907 11.907 0 0 0 9.882 22.65l1.041.4a3 3 0 0 0 2.154 0l1.041-.4a11.907 11.907 0 0 0 7.632-11.113V3.923a1.487 1.487 0 0 0-.868-1.362A21.7 21.7 0 0 0 12 .75a21.7 21.7 0 0 0-8.882 1.811 1.487 1.487 0 0 0-.868 1.362Z"
          style={{
            fill: "none",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "1.5px",
          }}
        />
        <path
          d="M17.2 11.25a5.25 5.25 0 1 1-5.2-6"
          style={{
            fill: "none",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "1.5px",
          }}
        />
        <path
          d="m17.25 6.562-4.786 4.786a.657.657 0 0 1-.928 0l-1.5-1.505"
          style={{
            fill: "none",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "1.5px",
          }}
        />
      </svg>
    ),
  },
  {
    id: "4",
    text: "Anayltics and tracking",
    subText: "Understand your user's behavior",
    icon: (
      <svg
        className="size-6"
        xmlns="http://www.w3.org/2000/svg"
        width="192"
        height="192"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path fill="none" d="M0 0h256v256H0z" />
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
          d="M224 208H32V48"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
          d="m208 64-80 80-32-32-64 64"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
          d="M208 104V64h-40"
        />
      </svg>
    ),
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

const HoverCardComponent = ({ title, icon, children }) => {
  const [openCard, setOpenCard] = React.useState(false)
  const themeBackgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )
  const themeBackgroundImage = useAppSelector(
    (state) => state?.theme?.general?.backgroundImage
  )

  return (
    <>
      <div
        onMouseOver={() => setOpenCard(true)}
        onMouseLeave={() => setOpenCard(false)}
        onMouseDown={() => setOpenCard(!openCard)}
        className="flex w-full flex-row items-center justify-between text-lg hover:cursor-move"
      >
        <span className="flex flex-row items-center gap-2 text-sm">
          {icon} {title}
        </span>{" "}
        <GripVertical className="right-4 shrink-0" />
      </div>
      {openCard && (
        <HoverCard openDelay={0}>
          <HoverCardTrigger
            asChild={false}
            className="w-full"
          ></HoverCardTrigger>
          <HoverCardContent
            className="flex flex-row items-center justify-center px-10 min-w-[382px]"
            forceMount={true}
            style={{
              background: themeBackgroundColor,
              backgroundImage: themeBackgroundImage,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            avoidCollisions
            side="left"
            sideOffset={32}
          >
            {children}
          </HoverCardContent>
        </HoverCard>
      )}
    </>
  )
}

export const UserToolbox = () => {
  const t = useTranslations("Components")
  const { connectors } = useEditor()
  const { filledPreset, outLinePreset } = useButtonThemePresets()
  const { outlinedPreset, underlinedPreset } = useInputThemePresets()
  return (
    <div className="p-y" draggable={false}>
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
                    icon={<Type className="mr-2 size-3" />}
                  >
                    <div className="flex w-fit flex-row items-center justify-center gap-2 border p-4">
                      <h1 className="text-lg font-semibold">
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
                    icon={<Pencil className="mr-2 size-3" />}
                  >
                    <div className="flex w-fit flex-row items-center justify-center gap-2 border p-4">
                      <h1 className="text-lg font-semibold">
                        A good description of your cause
                      </h1>
                    </div>
                  </HoverCardComponent>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="uppercase hover:no-underline">
                {t("Input")}
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
                <div
                  className=" min-w-full  rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(ref, <UserInput {...outlinedPreset} />)
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCardComponent
                    title={t("Input Field")}
                    icon={<TextCursorInput className="mr-2 size-3" />}
                  >
                    <UserInputGen
                      {...outlinedPreset}
                      label={t("Label")}
                      placeholder={t("Placeholder")}
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
                    icon={<ImagePlus className="mr-2 size-3" />}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className="hover: flex flex-col items-center justify-center gap-4 rounded-[8px]
                                      border-2 border-[#eaeaeb]
                                    bg-white p-4 text-lg
                                    font-bold hover:border-[#4050ff]
                                      hover:bg-[#4050ff]
                                    hover:text-white
                        "
                      >
                        <Target className="size-10" />
                        Target
                      </div>
                      <div
                        className="hover: flex flex-col items-center justify-center gap-4 rounded-[8px]
                                      border-2 border-[#eaeaeb]
                                    bg-white p-4 text-lg
                                    font-bold hover:border-[#4050ff]
                                      hover:bg-[#4050ff]
                                    hover:text-white"
                      >
                        <Rocket className="size-10" />
                        Launch
                      </div>
                      <div
                        className="hover: flex flex-col items-center justify-center gap-4 rounded-[8px]
                                      border-2 border-[#eaeaeb]
                                    bg-white p-4 text-lg
                                    font-bold hover:border-[#4050ff]
                                      hover:bg-[#4050ff]
                                    hover:text-white"
                      >
                        <HeartHandshake className="size-10" />
                        Agree
                      </div>
                      <div
                        className="hover: flex flex-col items-center justify-center gap-4 rounded-[8px]
                                      border-2 border-[#eaeaeb]
                                    bg-white p-4 text-lg
                                    font-bold hover:border-[#4050ff]
                                      hover:bg-[#4050ff]
                                    hover:text-white"
                      >
                        <Trophy className="size-10" />
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
                    icon={<Copy className="mr-2 size-3" />}
                  >
                    <div className="flex w-full flex-col gap-2">
                      {MultipleChoiceOptions.map((option, index) => (
                        <div
                          key={index}
                          className="
                      hover:
                      option flex
                      flex-row items-center gap-2
                      rounded-[8px] border-2
                        border-[#eaeaeb]
                      bg-white p-4 text-lg font-bold hover:border-[#4050ff] hover:bg-[#4050ff] hover:text-white"
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
              <AccordionTrigger className="uppercase hover:no-underline">
                {t("Button")}
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
                        // {...IconButtonDefaultProps}
                        // {...filledPreset}
                        {...filledPreset}
                        // {...outLinePreset}
                        disabled={false}
                      />
                    )
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCardComponent
                    title={t("Continue Button")}
                    icon={<Navigation className="mr-2 size-3" />}
                  >
                    <IconButtonGen
                      className="w-full"
                      {...filledPreset}
                      size="small"
                      marginTop={0}
                      marginBottom={0}
                      text={t("Continue")}
                    />
                    {/* <Button className="w-full bg-[#4050ff] px-4 py-6 text-white hover:bg-[#3041ff]">
                      Get quote
                      <ArrowRight className="ml-2" />
                    </Button> */}
                  </HoverCardComponent>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="uppercase hover:no-underline">
                Display
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
                <div
                  className=" min-w-full  rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    //@ts-ignore
                    connectors.create(
                      ref,
                      //@ts-ignore
                      <Card {...CardContentDefaultProps} />
                    )
                  }
                  data-cy="toolbox-layout-container"
                >
                  <HoverCardComponent
                    title="Container"
                    icon={<Box className="mr-2 size-3" />}
                  >
                    <Box width={120} height={42} />
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
                    icon={<Dice2 className="mr-2 size-3" />}
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
                    icon={<Columns className="mr-2 size-3" />}
                  >
                    <div className="flex w-[366px] flex-row items-center justify-between border p-2">
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
                    icon={<CircleSlashed className="mr-2 size-3" />}
                  >
                    <div className="flex w-[360px] flex-row items-center justify-between border p-4">
                      <CustomProgressBar
                        value={50}
                        className="h-1 max-w-[366px]"
                        indicatorColor={"#4050ff"}
                      />
                    </div>
                  </HoverCardComponent>
                </div>

                <div
                  className="min-w-full  rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref && connectors.create(ref, <Img {...ImgDefaultProps} />)
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCardComponent
                    title={t("Image")}
                    icon={<ImageIcon className="mr-2 size-3" />}
                  >
                    <div className="flex w-[360px] flex-row items-center justify-between">
                      <Image
                        src={ImagePlaceholder.src}
                        alt="Image component"
                        width={360}
                        height={203}
                        className="size-full"
                      />
                    </div>
                  </HoverCardComponent>
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
