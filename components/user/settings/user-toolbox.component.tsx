import React, { useState } from "react"
import Image from "next/image"
import ConvifyLogo from "@/assets/convify_logo_black.png"
import AvatarPlaceholder from "@/assets/images/default-avatar.webp"
import ImagePlaceholder from "@/assets/images/default-image.webp"
import cn from "classnames"
import { is } from "date-fns/locale"
import {
  Box,
  Columns,
  GripVertical,
  Image as ImageIcon,
  ImagePlus,
  Images,
  LayoutList,
  Link,
  Loader as LoaderIcon,
  Mail,
  MessageCircleMoreIcon,
  Navigation,
  NotebookPen,
  Paintbrush,
  Paintbrush2,
  Pencil,
  Rocket,
  Send,
  SeparatorHorizontal,
  SkipBack,
  SquareCheckIcon,
  SquareMousePointer,
  Phone,
  RectangleEllipsis,
  SquarePen,
  SwatchBook,
  TextCursorInput,
  Trophy,
  Type,
  User,
  InfoIcon,
  HeadingIcon,
  TypeIcon,
  CheckSquare,
  MousePointer,
  ArrowRightIcon,
  ArrowLeftIcon,
  MinusIcon,
  ListIcon,
  ServerIcon,
  ListCollapse,
  Link2,
  CircleHelp,
  ImagesIcon,
  YoutubeIcon,
  MoveHorizontalIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import styled from "styled-components"

import { useEditor } from "@/lib/craftjs"
import { useScreensLength } from "@/lib/state/flows-state/features/screenHooks"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
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
import { PictureTypes } from "@/components/PicturePicker"
import { Icons } from "@/components/icons"
// import { Toggle, ToggleItem } from "@/components/ui/toggle-group"
import { Loader } from "@/components/user/loader/user-loader.component"
import {
  TextInputDefaultProps,
  UserText,
  UserTextInputGen,
} from "@/components/user/text/user-text.component"

import {
  AvatarComponent,
  AvatarDefaultProps,
} from "../avatar-new/user-avatar.component"
import { BackButton, BackButtonGen } from "../backButton/back-component"
import useBackThemePresets from "../backButton/back-theme"
import { Card, CardContentDefaultProps } from "../card/user-card.component"
import useChecklistThemePresets from "../checklist/useChecklistThemePresets"
import { Checklist, ChecklistGen } from "../checklist/user-checklist.component"
import {
  Form,
  FormContentDefaultProps,
  FormGen,
} from "../form/user-form.component"
import {
  HeadlineText,
  HeadlineTextDefaultProps,
  HeadlineTextGen,
} from "../headline-text/headline-text.component"
import useHeadlineThemePresets from "../headline-text/useHeadlineThemePresets"
import useButtonThemePresets from "../icon-button/useButtonThemePresets"
import {
  IconButton,
  IconButtonGen,
} from "../icon-button/user-icon-button.component"
import {
  ImageComponent,
  ImageDefaultProps,
} from "../image-new/user-image.component"
import { Img, ImgDefaultProps } from "../image/user-image-component"
import useInputCheckboxThemePresets from "../input-checkbox/useInputCheckboxThemePresets"
import {
  UserInputCheckbox,
  UserInputCheckboxGen,
} from "../input-checkbox/user-input-checkbox.component"
import useInputMailThemePresets from "../input-email/useInputMailThemePresets"
import {
  UserInputMail,
  UserInputMailGen,
} from "../input-email/user-input-mail.component"
import useInputPhoneThemePresets from "../input-phone/useInputPhoneThemePresets"
import {
  UserInputPhone,
  UserInputPhoneGen,
} from "../input-phone/user-input-phone.component"
import useInputTextareaThemePrests from "../input-textarea/useInputTextareaThemePresets"
import {
  UserInputTextarea,
  UserInputTextareaGen,
} from "../input-textarea/user-input-textarea.component"
import useInputThemePresets from "../input/useInputThemePresets"
import { UserInput, UserInputGen } from "../input/user-input.component"
import {
  IconLineSeperator,
  LineSelector,
  IconButtonDefaultProps as LineSelectorDefaultProps,
} from "../lineSeperator/line-seperator-component"
import { LinkButton, LinkButtonGen } from "../link/link-component"
import useLinkThemePresets from "../link/link-theme"
import useListThemePresets from "../list/useListThemePresets"
import { List, ListGen } from "../list/user-list.component"
import {
  LoaderComponent,
  LoaderComponentGen,
  LoaderDefaultProps,
} from "../loader-new/user-loader.component"
import useLogoBarThemePresets from "../logo-bar/useLogoBarThemePresets"
import { LogoBar, LogoBarGen } from "../logo-bar/user-logo-bar.component"
import {
  LogoComponent,
  LogoDefaultProps,
} from "../logo-new/user-logo.component"
import { Logo } from "../logo/user-logo.component"
import useMultipleChoiceThemePresets from "../multiple-choice/useMultipleChoiceThemePresets"
import {
  MultipleChoice,
  MultipleChoiceGen,
} from "../multiple-choice/user-multiple-choice.component"
import usePictureChoiceThemePresets from "../picture-choice/usePictureChoiceThemePresets"
import {
  PictureChoice,
  PictureChoiceGen,
} from "../picture-choice/user-picture-choice.component"
import {
  ProgressBar,
  ProgressBarDefaultProps,
  ProgressBarGen,
} from "../progress/user-progress.component"
import useSelectThemePresets from "../select/useSelectThemePresets"
import { Select, SelectGen } from "../select/user-select.component"
import useStepsThemePresets from "../steps/useStepsThemePresets"
import { Steps, StepsGen } from "../steps/user-steps.component"
import useTextThemePresets from "../text/useTextThemePresets"
import {
  TextImageComponent,
  TextImageComponentGen,
  TextImageComponentPreview,
  TextImageDefaultProps,
} from "../textImage/user-textImage.component"
import useShareButtonTheme from "../socialShareButton/share-theme"
import useTelegramButtonTheme from "../telegramShareButton/telegram-theme"
import {
  SocialShareButton,
  SocialShareButtonGen,
} from "../socialShareButton/share-component"
import {
  TelegramShareButton,
  TelegramShareButtonGen,
} from "../telegramShareButton/telegram-component"
import hexoid from "hexoid"
import { FAQ, FAQGen, FAQSizes } from "../faq/user-faq.component"
import useFaqThemePresets from "../faq/useFaqThemePresets"
import { Links, LinksGen } from "../links/user-links.component"
import { useLinksThemePresets } from "../links/useLinksThemePresets"
import {
  ImageStorySizes,
  useImageStoryThemePresets,
} from "../image-story/useImageStoryThemePresets"
import { ImageStory, ImageStoryGen } from "../image-story/image-story.component"
import {
  useYoutubeVideoThemePresets,
  YoutubeVideoSizes,
} from "../youtube-video/useYoutubeVideoThemePresets"
import {
  YoutubeVideo,
  YoutubeVideoGen,
} from "../youtube-video/user-youtube-video.component"
import {
  SliderBar,
  SliderBarDefaultProps,
  SliderBarGen,
} from "../slider/user-slider.component"
import { useParams } from "next/navigation"

function HelperInformation({ infoText }: { infoText: string }) {
  return (
    <UiCard className={cn("flex gap-2 rounded-lg border p-3 pr-4")}>
      <div className="flex flex-row items-start gap-1 text-left">
        <InfoIcon className="size-4 shrink-0" />
        <p className="text-xs">{infoText}</p>
      </div>
    </UiCard>
  )
}

const HoverCardWrapper = styled.div`
  .text-input-comp,
  .email-input-comp,
  .phone-input-comp,
  .checkbox-input-comp,
  .textarea-input-comp,
  .button-input-comp,
  .mcq-input-comp,
  .separator-comp,
  .progress-comp,
  .user-headline-comp,
  .user-text-comp,
  .user-picture-choice-component,
  .logobar-comp,
  .user-list-comp,
  .user-checklist-comp {
    width: 100%;
  }
  .heading-text-comp {
    margin: 0;
  }
`

const HoverCardComponent = ({ title, icon, children }) => {
  const [openCard, setOpenCard] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const themeBackgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )
  const themeBackgroundImage = useAppSelector(
    (state) => state?.theme?.general?.backgroundImage
  )
  // Handle mouse over event
  const handleMouseEnter = () => {
    // if (!isDragging) {
    setOpenCard(true)
    // }
  }

  // Handle mouse leave event
  const handleMouseLeave = () => {
    // if (!isDragging) {
    setOpenCard(false)
    // }
  }

  // Handle mouse down event
  const handleMouseDown = () => {
    setIsDragging(true)
    setOpenCard(false)
  }

  // Handle mouse up event
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  console.log("opencard", openCard, isDragging)
  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="bg-card flex w-full flex-row items-center justify-between rounded-lg border p-3 pl-4 text-lg hover:cursor-move hover:bg-inherit hover:text-inherit"
      >
        <span className="flex flex-row items-center gap-2 text-xs">
          {icon} {title}
        </span>{" "}
        <GripVertical className="right-4 size-4 shrink-0 text-[#7B7D80]" />
      </div>
      <HoverCardWrapper>
        {openCard && (
          <HoverCard openDelay={0}>
            <HoverCardTrigger
              asChild={false}
              className="w-full"
            ></HoverCardTrigger>
            <HoverCardContent
              className="flex min-w-[382px] flex-row items-center justify-center px-10 leading-normal"
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
      </HoverCardWrapper>
    </>
  )
}

export const UserToolbox = () => {
  const { flowId = "" } = useParams<{ flowId: string }>() ?? {}
  const t = useTranslations("Components")
  const APP_URL =
    process.env.NEXT_PUBLIC_DOMAIN_URL || "https://conv-hassan.picreel.bid"
  const { connectors } = useEditor()
  const { filledPreset, outLinePreset } = useButtonThemePresets()
  const { linkFilledPreset, linkOutLinePreset } = useLinkThemePresets()
  const { backFilledPreset, backOutLinePreset } = useBackThemePresets()
  const { SocialFilledPreset } = useShareButtonTheme()
  const { TelegramFilledPreset } = useTelegramButtonTheme()
  const { selectPreset } = useSelectThemePresets()
  const { outlinedPreset, underlinedPreset } = useInputThemePresets()
  const { normalPreset: checklistNormalPreset } = useChecklistThemePresets()
  const {
    filledPreset: multipleChoiceFilledPreset,
    previewChoices: multipleChoicePreviewChoices,
    previewSelections: multipleChoicePreviewSelections,
  } = useMultipleChoiceThemePresets()

  const primaryColor = useAppSelector(
    (state) => state.theme?.general?.primaryColor
  )
  const {
    outlinedPreset: pictureChoiceOutlinedPreset,
    defaultChoices: pictureChoiceDefaultChoices,
    defaultSelections: pictureChoiceDefaultSelections,
    filledPreset: pictureChoiceFilledSelections,
    preFilledPresent: pictureChoicePreFilledSelections,
  } = usePictureChoiceThemePresets()

  const { defaultPreset: stepsDefaultPreset } = useStepsThemePresets()

  const {
    horizontalPreset: listHorizontalPreset,
    defaultIcon: listPreviewIcon,
  } = useListThemePresets()

  const { preset: faqPresets } = useFaqThemePresets()
  const { defaultItems: linksItems, defaultPresets: linksPresets } =
    useLinksThemePresets()

  const { defaultPreset: logoBarDefaultPreset } = useLogoBarThemePresets()
  const { defaultPreset: imageStoryPreset } = useImageStoryThemePresets()
  const { defaultPresets: youtubeVideoPreset } = useYoutubeVideoThemePresets()
  const { outlinedPresetChecbox, underlinedPresetChecbox } =
    useInputCheckboxThemePresets()
  const { outlinedPresetMail, underlinedPresetMail } =
    useInputMailThemePresets()
  const { outlinedPresetPhone, underlinedPresetPhone } =
    useInputPhoneThemePresets()
  const { outlinedPresetTextarea, underlinedPresetTextarea } =
    useInputTextareaThemePrests()
  const { h2Preset } = useHeadlineThemePresets()
  const { parapgraphPreset, spanPreset } = useTextThemePresets()
  const { formPreset, formPresets } = useInputThemePresets()
  {
    /**
     * isHeaderFooterMode: flag is used to determine if the header or footer mode is active
     * this is used to filter out certain components which should be allowed in header footer mode
     *
     */
  }
  const isHeaderFooterMode = useAppSelector(
    (state: RootState) =>
      state?.screen?.flows[flowId]?.footerMode ||
      state?.screen?.flows[flowId]?.headerMode
  )

  const screensLength: number = useScreensLength(flowId) ?? 0
  const selectedScreen = useAppSelector(
    (state: RootState) => state.screen?.flows[flowId]?.selectedScreen ?? 0
  )
  return (
    <div className="text-card-foreground font-poppins" draggable={false}>
      <div className="flex flex-col items-center justify-center gap-6">
        <HelperInformation infoText={t("Helper Information")} />

        <ScrollArea className="w-full overflow-y-auto  pb-24 pt-4 md:pb-0">
          <Accordion
            type="multiple"
            className="flex flex-col gap-6"
            defaultValue={["item-1", "item-2", "item-3", "item-4", "item-5"]}
          >
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="pt-0 hover:no-underline">
                Text
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2 pb-0">
                <div
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(
                      ref,
                      <HeadlineText textColor={"#ffffff"} {...h2Preset} />
                    )
                  }
                  data-cy="toolbox-headline"
                >
                  <HoverCardComponent
                    title={t("Headline")}
                    icon={<HeadingIcon size={12} className="size-4" />}
                    data-cy="toolbox-text"
                  >
                    <div className="flex ">
                      <HeadlineTextGen
                        textColor={"#ffffff"}
                        {...h2Preset}
                        paddingBottom={0}
                        paddingLeft={0}
                        paddingRight={0}
                        paddingTop={0}
                        marginBottom={30}
                        marginLeft={0}
                        marginRight={0}
                        marginTop={30}
                        label={t("Text")}
                        placeholder={t("Placeholder")}
                      />
                    </div>
                  </HoverCardComponent>
                </div>

                <div
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(
                      ref,
                      <UserText textColor={"#ffffff"} {...parapgraphPreset} />
                    )
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCardComponent
                    title={t("Text")}
                    icon={<TypeIcon size={12} className="size-4" />}
                    data-cy="toolbox-text"
                  >
                    <div className="flex w-fit flex-row items-center justify-center gap-2 p-4">
                      <UserTextInputGen
                        textColor={"#ffffff"}
                        {...spanPreset}
                        paddingBottom={0}
                        paddingLeft={0}
                        paddingRight={0}
                        paddingTop={0}
                        marginBottom={0}
                        marginLeft={0}
                        marginRight={0}
                        marginTop={20}
                        label={t("Text")}
                        placeholder={t("Placeholder")}
                      />
                    </div>
                  </HoverCardComponent>
                </div>
              </AccordionContent>
            </AccordionItem>

            {!isHeaderFooterMode && (
              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="pt-0 hover:no-underline">
                  {t("Input")}
                </AccordionTrigger>
                <AccordionContent className="flex w-full basis-full flex-col gap-2 pb-0">
                  <div
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      //@ts-ignore
                      ref &&
                      connectors.create(
                        ref,
                        //@ts-ignore
                        <Form {...FormContentDefaultProps} />
                      )
                    }
                    data-cy="toolbox-layout-form"
                  >
                    <HoverCardComponent
                      title="Form"
                      icon={<ServerIcon size={12} className="size-4" />}
                    >
                      <div className="flex w-full  max-w-[376px] flex-col items-center justify-start ">
                        <div className="flex w-full max-w-[376px] gap-1">
                          <UserInputGen
                            {...formPreset}
                            id={`input-789000`}
                            label={t("FirstName")}
                            placeholder={t("FirstName")}
                            floatingLabel={true}
                            marginBottom={0}
                            marginLeft={0}
                            marginTop={0}
                            width={"100%"}
                          />
                          <UserInputGen
                            {...formPresets}
                            id={`input-000987`}
                            label={t("LastName")}
                            placeholder={t("LasttName")}
                            floatingLabel={true}
                            marginBottom={0}
                            marginRight={0}
                            marginTop={0}
                            width={"100%"}
                          />
                        </div>
                        <UserInputMailGen
                          {...outlinedPresetMail}
                          label={t("EmailLabel")}
                          placeholder={t("MailPlaceholder")}
                          floatingLabel={true}
                          marginTop={5}
                          marginBottom={0}
                        />
                        <UserInputPhoneGen
                          {...outlinedPresetPhone}
                          label={t("PhoneLabel")}
                          placeholder={t("PhonePlaceholder")}
                          floatingLabel={true}
                          marginTop={5}
                          marginBottom={0}
                        />

                        <UserInputCheckboxGen
                          {...outlinedPresetChecbox}
                          label={t("CheckboxPlaceholder")}
                          placeholder={t("CheckboxPlaceholder")}
                          marginTop={5}
                          marginBottom={0}
                          size={"full"}
                        />
                        <IconButtonGen
                          {...filledPreset}
                          marginTop={5}
                          marginRight={0}
                          marginLeft={0}
                          marginBottom={0}
                          text={t("Submit")}
                          gap={0}
                          // paddingLeft={185}
                        />
                      </div>
                    </HoverCardComponent>
                  </div>

                  <div
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <UserInput textColor="#505051" {...outlinedPreset} />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("Input Field")}
                      icon={<TextCursorInput className="size-4" />}
                    >
                      <UserInputGen
                        {...outlinedPreset}
                        label={t("Label")}
                        textColor="#505051"
                        placeholder={t("Placeholder")}
                      />
                    </HoverCardComponent>
                  </div>

                  <div
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <UserInputCheckbox {...outlinedPresetChecbox} />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("Checkbox")}
                      icon={<CheckSquare size={12} className="size-4" />}
                    >
                      <div className="flex w-full  max-w-[376px] flex-col items-center justify-start ">
                        <UserInputCheckboxGen
                          {...outlinedPresetChecbox}
                          label={t("CheckboxPlaceholder")}
                          placeholder={t("CheckboxPlaceholder")}
                          size={"large"}
                          width={"50%"}
                          paddingTop={0}
                          paddingBottom={0}
                          paddingLeft={0}
                          paddingRight={0}
                        />
                      </div>
                    </HoverCardComponent>
                  </div>

                  <div
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <UserInputMail {...outlinedPresetMail} />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("InputMail")}
                      icon={<Mail size={12} className="size-4" />}
                    >
                      <UserInputMailGen
                        {...outlinedPresetMail}
                        label={t("InputMail")}
                        // label={t("Label")}
                        placeholder={t("InputMail")}
                        // placeholder={t("Placeholder")}
                      />
                    </HoverCardComponent>
                  </div>

                  <div
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <UserInputPhone {...outlinedPresetPhone} />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("InputPhone")}
                      icon={<Phone size={12} className="size-4" />}
                    >
                      <UserInputPhoneGen
                        {...outlinedPresetPhone}
                        label={t("InputPhone")}
                        // label={t("Label")}
                        placeholder={t("InputPhone")}
                        // placeholder={t("Placeholder")}
                      />
                    </HoverCardComponent>
                  </div>

                  <div
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <UserInputTextarea {...outlinedPresetTextarea} />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("TextArea")}
                      icon={<SquarePen size={12} className="size-4" />}
                    >
                      <UserInputTextareaGen
                        {...outlinedPresetTextarea}
                        // label={t("InputPhone")}
                        label={t("TextArea")}
                        // label={t("Label")}
                        placeholder={t("TextArea")}
                        inputValue={""}
                        // placeholder={t("Placeholder")}
                      />
                    </HoverCardComponent>
                  </div>

                  <div
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <Select
                          labelColor={"#ffffff"}
                          {...selectPreset}
                          disabled={false}
                        />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("Select")}
                      icon={<MousePointer className="size-4" />}
                    >
                      <SelectGen
                        labelColor={"#000000"}
                        className="w-full"
                        {...selectPreset}
                        size="small"
                        marginTop={0}
                        marginBottom={0}
                        fieldName={t("Select")}
                      />
                    </HoverCardComponent>
                  </div>

                  <div
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <MultipleChoice
                          labelColor={"#ffffff"}
                          {...multipleChoiceFilledPreset}
                        />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("Multiple Choice")}
                      icon={<LayoutList className="size-4" />}
                    >
                      <MultipleChoiceGen
                        {...{
                          ...multipleChoiceFilledPreset,
                          labelColor: "#ffffff",
                          disabled: true,
                          marginTop: 8,
                          marginBottom: 8,
                          marginLeft: 8,
                          marginRight: 8,
                          selections: multipleChoicePreviewSelections,
                          choices: multipleChoicePreviewChoices,
                        }}
                      />
                    </HoverCardComponent>
                  </div>

                  <div
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <SliderBar
                          {...{
                            ...SliderBarDefaultProps,
                            forHeader: false,
                            type: "body",
                            paddingLeft: 0,
                            paddingRight: 0,
                            paddingBottom: 0,
                            paddingTop: 0,
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: 20,
                            marginBottom: 20,
                            maxValue: screensLength,
                            progressvalue:
                              screensLength > 0 ? selectedScreen + 1 : 1,
                          }}
                        />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("Range")}
                      icon={<MoveHorizontalIcon className="size-4" />}
                    >
                      <div className="flex w-full py-4">
                        <SliderBarGen
                          {...{
                            ...ProgressBarDefaultProps,
                            forHeader: false,
                            type: "body",
                            paddingLeft: 0,
                            paddingRight: 0,
                            paddingBottom: 0,
                            paddingTop: 20,
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: 0,
                            marginBottom: 0,
                            maxValue: screensLength,
                            progressvalue:
                              screensLength > 0 ? selectedScreen + 1 : 1,
                          }}
                        />
                      </div>
                    </HoverCardComponent>
                  </div>

                  <div
                    //
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <PictureChoice
                          labelColor={"#ffffff"}
                          {...pictureChoicePreFilledSelections}
                        />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("Picture Choice")}
                      icon={<ImageIcon className="size-4" />}
                    >
                      <div className="flex w-full py-4">
                        <PictureChoiceGen
                          {...{
                            ...pictureChoicePreFilledSelections,
                            labelColor: "#000000",
                            disabled: true,
                            marginTop: 8,
                            marginBottom: 12,
                            marginLeft: 8,
                            marginRight: 8,
                            size: "small",
                            selections: pictureChoiceDefaultSelections,
                            choices: pictureChoiceDefaultChoices,
                          }}
                        />
                      </div>
                    </HoverCardComponent>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="item-3" className="border-b-0">
              <AccordionTrigger className="pt-0 hover:no-underline">
                {t("Button")}
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2 pb-0">
                <div
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
                    icon={<ArrowRightIcon className="size-4" />}
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
                <div
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(
                      ref,
                      <BackButton
                        // {...IconButtonDefaultProps}
                        {...backOutLinePreset}
                        disabled={false}
                        text={t("Back")}
                        justifyContent={"center"}
                        marginTop={20}
                        marginBottom={20}
                        paddingLeft={0}
                        paddingRight={0}
                        iconType={PictureTypes.ICON}
                        buttonAction="back-screen"
                      />
                    )
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCardComponent
                    title={t("Back Button")}
                    icon={<ArrowLeftIcon className="size-4" />}
                  >
                    <BackButtonGen
                      className="w-full"
                      {...backOutLinePreset}
                      size="large"
                      marginTop={20}
                      marginBottom={20}
                      text={t("Back")}
                      justifyContent={"center"}
                      paddingLeft={0}
                      paddingRight={0}
                      iconType={PictureTypes.ICON}
                      buttonAction="back-screen"
                    />
                  </HoverCardComponent>
                </div>
                <div
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(
                      ref,
                      <SocialShareButton
                        // {...IconButtonDefaultProps}
                        {...SocialFilledPreset}
                        disabled={false}
                        text={t("WhatsApp")}
                        justifyContent={"center"}
                        size={"medium"}
                        marginTop={20}
                        marginBottom={20}
                        marginLeft={0}
                        marginRight={0}
                        paddingLeft={0}
                        paddingRight={0}
                        iconType={PictureTypes.ICON}
                        phoneNumber={""}
                      />
                    )
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCardComponent
                    title={t("WhatsApp Button")}
                    icon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="size-4"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_322_555)">
                          <path
                            d="M20.4015 3.48908C19.3014 2.37833 17.9911 1.49775 16.5471 0.898724C15.1031 0.299696 13.5543 -0.00579123 11.991 8.31376e-05C5.4405 8.31376e-05 0.102 5.33708 0.096 11.8891C0.096 13.9876 0.645 16.0291 1.6815 17.8366L0 24.0001L6.306 22.3471C8.04973 23.2984 10.0046 23.7962 11.991 23.7946H11.997C18.549 23.7946 23.886 18.4576 23.892 11.8996C23.8933 10.3367 23.5855 8.78894 22.9862 7.3455C22.3869 5.90206 21.5094 4.59143 20.4015 3.48908ZM11.991 21.7816C10.2198 21.7802 8.48134 21.3036 6.957 20.4016L6.597 20.1856L2.856 21.1666L3.855 17.5171L3.621 17.1406C2.63071 15.5661 2.10697 13.7431 2.1105 11.8831C2.1105 6.44408 6.546 2.00708 11.997 2.00708C13.2956 2.00475 14.5818 2.25949 15.7815 2.75662C16.9812 3.25375 18.0707 3.98342 18.987 4.90358C19.9063 5.82031 20.6352 6.9099 21.1315 8.10957C21.6279 9.30925 21.8819 10.5953 21.879 11.8936C21.873 17.3521 17.4375 21.7816 11.991 21.7816ZM17.4135 14.3806C17.118 14.2321 15.6585 13.5136 15.384 13.4116C15.111 13.3141 14.9115 13.2631 14.7165 13.5601C14.517 13.8556 13.947 14.5291 13.776 14.7226C13.605 14.9221 13.428 14.9446 13.131 14.7976C12.8355 14.6476 11.877 14.3356 10.743 13.3201C9.858 12.5326 9.2655 11.5576 9.0885 11.2621C8.9175 10.9651 9.072 10.8061 9.2205 10.6576C9.351 10.5256 9.516 10.3096 9.6645 10.1386C9.8145 9.96758 9.864 9.84158 9.9615 9.64358C10.059 9.44258 10.0125 9.27158 9.939 9.12308C9.864 8.97458 9.2715 7.50908 9.021 6.91808C8.781 6.33458 8.5365 6.41558 8.3535 6.40808C8.1825 6.39758 7.983 6.39758 7.7835 6.39758C7.63286 6.40142 7.48464 6.4363 7.3481 6.50005C7.21156 6.56381 7.08965 6.65505 6.99 6.76808C6.717 7.06508 5.9535 7.78358 5.9535 9.24908C5.9535 10.7146 7.0185 12.1231 7.1685 12.3226C7.3155 12.5221 9.2595 15.5206 12.243 16.8106C12.948 17.1181 13.503 17.2996 13.9365 17.4376C14.649 17.6656 15.2925 17.6311 15.8055 17.5576C16.3755 17.4706 17.562 16.8376 17.8125 16.1431C18.0585 15.4471 18.0585 14.8531 17.9835 14.7286C17.91 14.6026 17.7105 14.5291 17.4135 14.3806Z"
                            fill="black"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_322_555">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    }
                  >
                    <SocialShareButtonGen
                      className="w-full"
                      {...SocialFilledPreset}
                      size="lasmallrge"
                      marginTop={20}
                      marginBottom={20}
                      marginLeft={0}
                      marginRight={0}
                      text={t("WhatsApp")}
                      justifyContent={"center"}
                      paddingLeft={0}
                      paddingRight={0}
                      iconType={PictureTypes.ICON}
                      phoneNumber={""}
                    />
                  </HoverCardComponent>
                </div>
                <div
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(
                      ref,
                      <TelegramShareButton
                        // {...IconButtonDefaultProps}
                        {...TelegramFilledPreset}
                        disabled={false}
                        text={t("Telegram")}
                        justifyContent={"center"}
                        size={"medium"}
                        marginTop={20}
                        marginBottom={20}
                        marginLeft={0}
                        marginRight={0}
                        paddingLeft={0}
                        paddingRight={0}
                        iconType={PictureTypes.ICON}
                        url={""}
                      />
                    )
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCardComponent
                    title={t("Telegram Button")}
                    icon={<Send className="size-4" />}
                  >
                    <TelegramShareButtonGen
                      className="w-full"
                      {...TelegramFilledPreset}
                      size="small"
                      marginTop={20}
                      marginBottom={20}
                      marginLeft={20}
                      marginRight={20}
                      text={t("Telegram")}
                      justifyContent={"center"}
                      paddingLeft={0}
                      paddingRight={0}
                      iconType={PictureTypes.ICON}
                      url={""}
                    />
                  </HoverCardComponent>
                </div>
                <div
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(
                      ref,
                      <LinkButton
                        // {...IconButtonDefaultProps}
                        // {...filledPreset}
                        {...linkOutLinePreset}
                        // {...outLinePreset}
                        disabled={false}
                        marginTop={20}
                        marginBottom={20}
                        // marginLeft={20}
                        // marginRight={20}
                        href={APP_URL}
                        justifyContent={"center"}
                        enableIcon={false}
                        text={t("Link")}
                        iconType={PictureTypes.ICON}
                      />
                    )
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCardComponent
                    title={t("Link Button")}
                    icon={<Link className="size-4" />}
                  >
                    <LinkButtonGen
                      className="w-full"
                      // alignItems={"center"}
                      {...linkOutLinePreset}
                      size="small"
                      href={APP_URL}
                      text={t("Link")}
                      enableIcon={false}
                      justifyContent={"center"}
                      iconType={PictureTypes.ICON}
                    />
                  </HoverCardComponent>
                </div>
              </AccordionContent>
            </AccordionItem>
            {isHeaderFooterMode && (
              <AccordionItem value="item-4">
                <AccordionTrigger className="pt-0 hover:no-underline">
                  Display
                </AccordionTrigger>
                <AccordionContent className="flex w-full basis-full flex-col gap-2 pb-0">
                  <div
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <AvatarComponent
                          {...AvatarDefaultProps}
                          // {...filledPreset}
                          {...filledPreset}
                          // {...outLinePreset}
                          icon={"arrowright"}
                          disabled={false}
                        />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("Avatar")}
                      icon={<User className="mr-2 size-4" />}
                    >
                      <div className="m-auto items-center">
                        <Image
                          src={AvatarPlaceholder.src}
                          alt="Avatar component"
                          width={100}
                          height={100}
                          className="rounded-full"
                        />
                      </div>
                    </HoverCardComponent>
                  </div>
                  <div
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <LogoComponent
                          {...LogoDefaultProps}
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
                      title={t("Logo")}
                      icon={
                        <svg
                          className="size-4"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.33333 6.66667L8 2L10.6667 6.66667H5.33333Z"
                            stroke="#23262C"
                            stroke-width="1.2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M6.66667 11.6667C6.66667 12.9553 5.622 14 4.33333 14C3.04467 14 2 12.9553 2 11.6667C2 10.378 3.04467 9.33333 4.33333 9.33333C5.622 9.33333 6.66667 10.378 6.66667 11.6667Z"
                            stroke="#23262C"
                            stroke-width="1.2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M9.33333 9.33333H14V14H9.33333V9.33333Z"
                            stroke="#23262C"
                            stroke-width="1.2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      }
                    >
                      <div className="flex w-[160px] flex-row items-center justify-between p-4">
                        <Image
                          src={ConvifyLogo.src}
                          alt="Image component"
                          width={300}
                          height={200}
                          className="size-full"
                        />
                      </div>
                    </HoverCardComponent>
                  </div>
                  <div
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <ProgressBar
                          {...(isHeaderFooterMode
                            ? {
                                ...ProgressBarDefaultProps,
                                size: "full",
                                forHeader: true,
                                type: "header",
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 0,
                                marginRight: 0,
                                paddingLeft: 0,
                                paddingRight: 0,
                                paddingBottom: 0,
                                paddingTop: 0,
                              }
                            : {
                                ...ProgressBarDefaultProps,
                                forHeader: false,
                                type: "body",
                                paddingLeft: 0,
                                paddingRight: 0,
                                paddingBottom: 0,
                                paddingTop: 0,
                                marginLeft: 0,
                                marginRight: 0,
                                marginTop: 20,
                                marginBottom: 20,
                                maxValue: screensLength,
                                progressvalue:
                                  screensLength > 0 ? selectedScreen + 1 : 1,
                              })}
                        />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("Progress Bar")}
                      icon={<RectangleEllipsis className="mr-2 size-4" />}
                    >
                      <div className="flex w-[360px] flex-row items-center justify-between  p-4">
                        <ProgressBarGen
                          {...(isHeaderFooterMode
                            ? {
                                ...ProgressBarDefaultProps,
                                size: "full",
                                forHeader: true,
                                type: "header",
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 0,
                                marginRight: 0,
                                paddingLeft: 0,
                                paddingRight: 0,
                                paddingBottom: 0,
                                paddingTop: 0,
                              }
                            : {
                                ...ProgressBarDefaultProps,
                                size: "full",
                                forHeader: false,
                                type: "body",
                                paddingLeft: 0,
                                paddingRight: 0,
                                paddingBottom: 0,
                                paddingTop: 0,
                                marginLeft: 0,
                                marginRight: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                radius: 0,
                                maxValue: screensLength,
                                progressvalue:
                                  screensLength > 0 ? selectedScreen + 1 : 1,
                              })}
                          // Uncomment the following line if you need to set a value for the progress bar
                          // value={50}
                        />
                      </div>
                    </HoverCardComponent>
                  </div>
                  <div
                    //eslint-disable-next-line

                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        /** @ts-ignore */
                        <Links {...linksPresets} />
                      )
                    }
                    data-cy="toolbox-layout-container"
                  >
                    <HoverCardComponent
                      title={t("Links")}
                      icon={<Icons.Links />}
                    >
                      <div className="p-3">
                        {/** @ts-ignore */}
                        {/** @ts-ignore */}
                        <LinksGen
                          {...linksPresets}
                          marginTop={0}
                          links={linksItems}
                          marginBottom={0}
                        />
                      </div>
                    </HoverCardComponent>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {!isHeaderFooterMode && (
              <AccordionItem value="item-4">
                <AccordionTrigger className="pt-0 hover:no-underline">
                  Display
                </AccordionTrigger>

                <AccordionContent className="flex w-full basis-full flex-col gap-2 pb-0">
                  <>
                    <div
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        //@ts-ignore
                        ref &&
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
                        icon={
                          <svg
                            className="mr-2 size-4"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 6H14M6 6L6 14M5.2 2H10.8C11.9201 2 12.4802 2 12.908 2.21799C13.2843 2.40973 13.5903 2.71569 13.782 3.09202C14 3.51984 14 4.0799 14 5.2V10.8C14 11.9201 14 12.4802 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.4802 14 11.9201 14 10.8 14H5.2C4.07989 14 3.51984 14 3.09202 13.782C2.71569 13.5903 2.40973 13.2843 2.21799 12.908C2 12.4802 2 11.9201 2 10.8V5.2C2 4.07989 2 3.51984 2.21799 3.09202C2.40973 2.71569 2.71569 2.40973 3.09202 2.21799C3.51984 2 4.0799 2 5.2 2Z"
                              stroke="#23262C"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        }
                      >
                        <Box width={120} height={42} />
                      </HoverCardComponent>
                    </div>
                    <div
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,
                          <LineSelector
                            // {...IconButtonDefaultProps}
                            {...filledPreset}
                            // {...LineSelectorDefaultProps}
                            // {...outLinePreset}
                            size={"large"}
                            disabled={false}
                            enableLine={true}
                          />
                        )
                      }
                      data-cy="toolbox-text"
                    >
                      <HoverCardComponent
                        title={t("Separator")}
                        icon={<MinusIcon className="size-4" />}
                      >
                        <IconLineSeperator
                          className="w-full"
                          {...filledPreset}
                          size="small"
                          marginTop={0}
                          marginBottom={0}
                          enableLine={true}
                        />
                      </HoverCardComponent>
                    </div>

                    <div
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,
                          <ImageComponent
                            {...ImageDefaultProps}
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
                        title={t("Image")}
                        icon={<ImageIcon className="size-4" />}
                      >
                        <Image
                          src={ImagePlaceholder.src}
                          alt="Image component"
                          width={250}
                          height={140}
                          className="size-full"
                        />
                      </HoverCardComponent>
                    </div>

                    <div
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,
                          /** @ts-ignore */
                          <ImageStory {...imageStoryPreset} />
                        )
                      }
                      data-cy="toolbox-text"
                    >
                      <HoverCardComponent
                        title={t("Image story")}
                        icon={<Icons.ImageStory />}
                      >
                        <div className="flex w-full py-4">
                          {/** @ts-ignore */}
                          <ImageStoryGen
                            {...imageStoryPreset}
                            size={ImageStorySizes.full}
                            marginBottom={10}
                            marginTop={10}
                          />
                        </div>
                      </HoverCardComponent>
                    </div>

                    <div
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,
                          /** @ts-ignore */
                          <YoutubeVideo {...youtubeVideoPreset} />
                        )
                      }
                      data-cy="toolbox-text"
                    >
                      <HoverCardComponent
                        title={"Youtube"}
                        icon={<YoutubeIcon className="size-4" />}
                      >
                        {/** @ts-ignore */}
                        <YoutubeVideoGen
                          {...youtubeVideoPreset}
                          // marginLeft={10}
                          // marginRight={10}
                          size={YoutubeVideoSizes.full}
                        />
                      </HoverCardComponent>
                    </div>

                    <div
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,
                          <LoaderComponent
                            {...LoaderDefaultProps}
                            // {...filledPreset}
                            {...filledPreset}
                            buttonAction={"custom-action"}
                            nextScreen={""}
                            // {...outLinePreset}
                            disabled={false}
                          />
                        )
                      }
                      data-cy="toolbox-text"
                    >
                      <HoverCardComponent
                        title={t("Loader")}
                        icon={<LoaderIcon className=" size-4" />}
                      >
                        <div className="flex w-[260px] flex-row items-center justify-center">
                          <div className="relative">
                            <div className="h-24 w-24 rounded-full border-2 border-gray-300"></div>
                            <div
                              className="loader absolute left-0 top-0 inline-block h-24 w-24 animate-spin rounded-full border-2 border-t-2 border-transparent"
                              style={{ borderTopColor: primaryColor }}
                            />
                          </div>
                        </div>
                      </HoverCardComponent>
                    </div>
                    <div
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,
                          <LogoComponent
                            {...LogoDefaultProps}
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
                        title={t("Logo")}
                        icon={
                          <svg
                            className="size-4"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.33333 6.66667L8 2L10.6667 6.66667H5.33333Z"
                              stroke="#23262C"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M6.66667 11.6667C6.66667 12.9553 5.622 14 4.33333 14C3.04467 14 2 12.9553 2 11.6667C2 10.378 3.04467 9.33333 4.33333 9.33333C5.622 9.33333 6.66667 10.378 6.66667 11.6667Z"
                              stroke="#23262C"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M9.33333 9.33333H14V14H9.33333V9.33333Z"
                              stroke="#23262C"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        }
                      >
                        <div className="flex w-[160px] flex-row items-center justify-between p-4">
                          <Image
                            src={ConvifyLogo.src}
                            alt="Image component"
                            width={300}
                            height={200}
                            className="size-full"
                          />
                        </div>
                      </HoverCardComponent>
                    </div>
                    <div
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,
                          <TextImageComponent
                            textColor={"#ffffff"}
                            secTextColor={"#ffffff"}
                            {...TextImageDefaultProps}
                            title={t("Title")}
                            Text={t("Text Here")}
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
                        title={t("Text & Image")}
                        icon={
                          <svg
                            className="size-4"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 2V14M5.2 2H10.8C11.9201 2 12.4802 2 12.908 2.21799C13.2843 2.40973 13.5903 2.71569 13.782 3.09202C14 3.51984 14 4.0799 14 5.2V10.8C14 11.9201 14 12.4802 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.4802 14 11.9201 14 10.8 14H5.2C4.07989 14 3.51984 14 3.09202 13.782C2.71569 13.5903 2.40973 13.2843 2.21799 12.908C2 12.4802 2 11.9201 2 10.8V5.2C2 4.07989 2 3.51984 2.21799 3.09202C2.40973 2.71569 2.71569 2.40973 3.09202 2.21799C3.51984 2 4.0799 2 5.2 2Z"
                              stroke="#23262C"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M8 6H12"
                              stroke="#23262C"
                              stroke-linecap="round"
                            />
                            <path
                              d="M8 8H12"
                              stroke="#23262C"
                              stroke-linecap="round"
                            />
                            <path
                              d="M8 10H12"
                              stroke="#23262C"
                              stroke-linecap="round"
                            />
                          </svg>
                        }
                      >
                        <TextImageComponentPreview
                          textColor={"#ffffff"}
                          secTextColor={"#ffffff"}
                          {...TextImageDefaultProps}
                          title={t("Title")}
                          Text={"Text here"}
                        />
                      </HoverCardComponent>
                    </div>

                    <div
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,

                          <Steps {...stepsDefaultPreset} />
                        )
                      }
                      data-cy="toolbox-layout-container"
                    >
                      <HoverCardComponent
                        title={t("Steps")}
                        icon={
                          <svg
                            className="size-4"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.33333 7.99935C9.33333 8.73573 8.73638 9.33268 8 9.33268C7.26362 9.33268 6.66667 8.73573 6.66667 7.99935C6.66667 7.26297 7.26362 6.66602 8 6.66602C8.73638 6.66602 9.33333 7.26297 9.33333 7.99935Z"
                              stroke="#23262C"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M14 7.99935C14 8.73573 13.403 9.33268 12.6667 9.33268C11.9303 9.33268 11.3333 8.73573 11.3333 7.99935C11.3333 7.26297 11.9303 6.66602 12.6667 6.66602C13.403 6.66602 14 7.26297 14 7.99935Z"
                              stroke="#23262C"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M4.66667 7.99935C4.66667 8.73573 4.06971 9.33268 3.33333 9.33268C2.59695 9.33268 2 8.73573 2 7.99935C2 7.26297 2.59695 6.66602 3.33333 6.66602C4.06971 6.66602 4.66667 7.26297 4.66667 7.99935Z"
                              stroke="#23262C"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        }
                      >
                        <StepsGen {...stepsDefaultPreset} />
                      </HoverCardComponent>
                    </div>

                    <div
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,

                          <List
                            textColor={"#ffffff"}
                            secTextColor={"#ffffff"}
                            {...listHorizontalPreset}
                          />
                        )
                      }
                      data-cy="toolbox-layout-container"
                    >
                      <HoverCardComponent
                        title={t("List")}
                        icon={<ListIcon className="size-4" />}
                      >
                        <ListGen
                          textColor={"#ffffff"}
                          secTextColor={"#ffffff"}
                          {...{
                            ...listHorizontalPreset,
                            columnsDesktop: 1,
                            columnsMobile: 1,
                          }}
                        />
                      </HoverCardComponent>
                    </div>

                    <div
                      //eslint-disable-next-line

                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,
                          /** @ts-ignore */
                          <FAQ {...faqPresets} />
                        )
                      }
                      data-cy="toolbox-layout-container"
                    >
                      <HoverCardComponent
                        title={t("FAQ")}
                        icon={<CircleHelp className="size-4" />}
                      >
                        <div>
                          {/** @ts-ignore */}
                          {/** @ts-ignore */}
                          <FAQGen
                            {...faqPresets}
                            marginTop={0}
                            size={FAQSizes.full}
                            marginBottom={10}
                          />
                        </div>
                      </HoverCardComponent>
                    </div>

                    <div
                      //eslint-disable-next-line

                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,
                          /** @ts-ignore */
                          <Links {...linksPresets} />
                        )
                      }
                      data-cy="toolbox-layout-container"
                    >
                      <HoverCardComponent
                        title={t("Links")}
                        icon={<Icons.Links />}
                      >
                        <div className="p-3">
                          {/** @ts-ignore */}
                          {/** @ts-ignore */}
                          <LinksGen
                            {...linksPresets}
                            marginTop={0}
                            links={linksItems}
                            marginBottom={0}
                          />
                        </div>
                      </HoverCardComponent>
                    </div>

                    <div
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,

                          <Checklist
                            textColor={"#ffffff"}
                            {...checklistNormalPreset}
                          />
                        )
                      }
                      data-cy="toolbox-layout-container"
                    >
                      <HoverCardComponent
                        title={t("Checklist")}
                        icon={
                          <svg
                            className="size-4"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.66699 4H14.0003"
                              stroke="#23262C"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M6.66699 8H14.0003"
                              stroke="#23262C"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M6.66699 12H14.0003"
                              stroke="#23262C"
                              stroke-width="1.33333"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M2 4.00065L2.66667 4.66732L4 3.33398"
                              stroke="#23262C"
                              stroke-width="1.33333"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M2 8.00065L2.66667 8.66732L4 7.33398"
                              stroke="#23262C"
                              stroke-width="1.33333"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M2 12.0007L2.66667 12.6673L4 11.334"
                              stroke="#23262C"
                              stroke-width="1.33333"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        }
                      >
                        <ChecklistGen
                          textColor={"#ffffff"}
                          {...checklistNormalPreset}
                        />
                      </HoverCardComponent>
                    </div>

                    <div
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,

                          <LogoBar {...logoBarDefaultPreset} />
                        )
                      }
                      data-cy="toolbox-layout-container"
                    >
                      <HoverCardComponent
                        title={t("Logo Bar")}
                        icon={<SwatchBook className="size-4" />}
                      >
                        <LogoBarGen {...logoBarDefaultPreset} />
                      </HoverCardComponent>
                    </div>
                    <div
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,
                          <ProgressBar
                            {...(isHeaderFooterMode
                              ? {
                                  ...ProgressBarDefaultProps,
                                  size: "full",
                                  forHeader: true,
                                  type: "header",
                                  marginTop: 0,
                                  marginBottom: 0,
                                  marginLeft: 0,
                                  marginRight: 0,
                                  paddingLeft: 0,
                                  paddingRight: 0,
                                  paddingBottom: 0,
                                  paddingTop: 0,
                                }
                              : {
                                  ...ProgressBarDefaultProps,
                                  forHeader: false,
                                  type: "body",
                                  paddingLeft: 0,
                                  paddingRight: 0,
                                  paddingBottom: 0,
                                  paddingTop: 0,
                                  marginLeft: 0,
                                  marginRight: 0,
                                  marginTop: 20,
                                  marginBottom: 20,
                                  maxValue: screensLength,
                                  progressvalue:
                                    screensLength > 0 ? selectedScreen + 1 : 1,
                                })}
                          />
                        )
                      }
                      data-cy="toolbox-text"
                    >
                      <HoverCardComponent
                        title={t("Progress Bar")}
                        icon={
                          <svg
                            className="size-4"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 6.33008V9.66341M3.06667 9.66341H12.9333C13.3067 9.66341 13.4934 9.66341 13.636 9.59075C13.7614 9.52683 13.8634 9.42485 13.9273 9.2994C14 9.1568 14 8.97011 14 8.59674V7.39674C14 7.02338 14 6.83669 13.9273 6.69408C13.8634 6.56864 13.7614 6.46666 13.636 6.40274C13.4934 6.33008 13.3067 6.33008 12.9333 6.33008H3.06667C2.6933 6.33008 2.50661 6.33008 2.36401 6.40274C2.23856 6.46666 2.13658 6.56864 2.07266 6.69408C2 6.83669 2 7.02338 2 7.39674V8.59674C2 8.97011 2 9.1568 2.07266 9.2994C2.13658 9.42485 2.23856 9.52683 2.36401 9.59075C2.50661 9.66341 2.6933 9.66341 3.06667 9.66341Z"
                              stroke="#23262C"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        }
                      >
                        <div className="flex w-[360px] flex-row items-center justify-between  p-4">
                          <ProgressBarGen
                            {...(isHeaderFooterMode
                              ? {
                                  ...ProgressBarDefaultProps,
                                  size: "full",
                                  forHeader: true,
                                  type: "header",
                                  marginTop: 0,
                                  marginBottom: 0,
                                  marginLeft: 0,
                                  marginRight: 0,
                                  paddingLeft: 0,
                                  paddingRight: 0,
                                  paddingBottom: 0,
                                  paddingTop: 0,
                                }
                              : {
                                  ...ProgressBarDefaultProps,
                                  size: "full",
                                  forHeader: false,
                                  type: "body",
                                  paddingLeft: 0,
                                  paddingRight: 0,
                                  paddingBottom: 0,
                                  paddingTop: 0,
                                  marginLeft: 0,
                                  marginRight: 0,
                                  marginTop: 0,
                                  marginBottom: 0,
                                  radius: 0,
                                  maxValue: screensLength,
                                  progressvalue:
                                    screensLength > 0 ? selectedScreen + 1 : 1,
                                })}
                            // Uncomment the following line if you need to set a value for the progress bar
                            // value={50}
                          />
                        </div>
                      </HoverCardComponent>
                    </div>
                  </>
                </AccordionContent>
              </AccordionItem>
            )}
            {/* <AccordionItem value="item-5">
              <AccordionTrigger className="font-poppins hover:no-underline">
                Navigation
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
                <div
                  className="rounded-lg border p-3 pl-4 hover:bg-inherit hover:text-inherit bg-card"
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
                          <LoaderIcon className="mr-2 size-4" />
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
            </AccordionItem> */}
          </Accordion>
        </ScrollArea>
      </div>
    </div>
  )
}
