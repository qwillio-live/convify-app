import React, { useState } from "react"
import Image from "next/image"
import ConvifyLogo from "@/assets/convify_logo_black.png"
import AvatarPlaceholder from "@/assets/images/default-avatar.webp"
import ImagePlaceholder from "@/assets/images/default-image.webp"
import cn from "classnames"
import { is } from "date-fns/locale"
import {
  Box,
  Chrome,
  CircleSlashed,
  Columns,
  Copy,
  Dice2,
  Ellipsis,
  Facebook,
  Globe,
  GripVertical,
  Hand,
  HeartHandshake,
  Image as ImageIcon,
  ImagePlus,
  Images,
  LayoutList,
  Link,
  Linkedin,
  ListChecks,
  ListOrdered,
  Loader as LoaderIcon,
  LucidePaintbrush,
  Mail,
  MessageCircleMoreIcon,
  Navigation,
  NotebookPen,
  Paintbrush,
  Paintbrush2,
  Pencil,
  Phone,
  RectangleEllipsis,
  Rocket,
  Send,
  SeparatorHorizontal,
  SkipBack,
  SquareCheckIcon,
  SquareMousePointer,
  SquarePen,
  SwatchBook,
  Target,
  TextCursorInput,
  Trophy,
  Type,
  User,
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
import { Form, FormContentDefaultProps } from "../form/user-form.component"
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
import {
  SocialShareButton,
  SocialShareButtonGen,
} from "../socialShareButton/share-component"
import useShareButtonTheme from "../socialShareButton/share-theme"
import useStepsThemePresets from "../steps/useStepsThemePresets"
import { Steps, StepsGen } from "../steps/user-steps.component"
import {
  TelegramShareButton,
  TelegramShareButtonGen,
} from "../telegramShareButton/telegram-component"
import useTelegramButtonTheme from "../telegramShareButton/telegram-theme"
import useTextThemePresets from "../text/useTextThemePresets"
import {
  TextImageComponent,
  TextImageComponentGen,
  TextImageComponentPreview,
  TextImageDefaultProps,
} from "../textImage/user-textImage.component"

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
        className="flex w-full flex-row items-center justify-between text-lg cursor-move "
      >
        <span className="flex flex-row items-center gap-2 text-sm">
          {icon} {title}
        </span>{" "}
        <GripVertical className="right-4 shrink-0" />
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
  const t = useTranslations("Components")
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
  } = usePictureChoiceThemePresets()

  const { defaultPreset: stepsDefaultPreset } = useStepsThemePresets()

  const {
    horizontalPreset: listHorizontalPreset,
    defaultIcon: listPreviewIcon,
  } = useListThemePresets()

  const { defaultPreset: logoBarDefaultPreset } = useLogoBarThemePresets()
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
  const { formPreset } = useInputThemePresets()
  {
    /**
     * isHeaderFooterMode: flag is used to determine if the header or footer mode is active
     * this is used to filter out certain components which should be allowed in header footer mode
     *
     */
  }
  const isHeaderFooterMode = useAppSelector(
    (state: RootState) => state?.screen?.footerMode || state?.screen?.headerMode
  )

  const screensLength: number = useScreensLength() ?? 0
  const selectedScreen = useAppSelector(
    (state: RootState) => state.screen?.selectedScreen ?? 0
  )
  return (
    <div className="p-y" draggable={false}>
      <div className="flex flex-col items-center justify-center space-y-1">
        <HelperInformation />

        <ScrollArea className="w-full overflow-y-auto  pb-24 pt-4 md:pb-0">
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
                    connectors.create(ref, <HeadlineText {...h2Preset} />)
                  }
                  data-cy="toolbox-headline"
                >
                  <HoverCardComponent
                    title={t("Title")}
                    icon={<Type size={12} className="mr-2 size-3" />}
                    data-cy="toolbox-text"
                  >
                    <div className="flex w-fit flex-row items-center justify-center gap-2 p-4">
                      <HeadlineTextGen
                        {...h2Preset}
                        label={t("Text")}
                        placeholder={t("Placeholder")}
                      />
                    </div>
                  </HoverCardComponent>
                </div>

                <div
                  className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                  //eslint-disable-next-line
                  ref={(ref: any) =>
                    ref &&
                    connectors.create(ref, <UserText {...parapgraphPreset} />)
                  }
                  data-cy="toolbox-text"
                >
                  <HoverCardComponent
                    title={t("Text")}
                    icon={<Pencil size={12} className="mr-2 size-3" />}
                    data-cy="toolbox-text"
                  >
                    <div className="flex w-fit flex-row items-center justify-center gap-2 p-4">
                      <UserTextInputGen
                        {...spanPreset}
                        label={t("Text")}
                        placeholder={t("Placeholder")}
                      />
                    </div>
                  </HoverCardComponent>
                </div>
              </AccordionContent>
            </AccordionItem>

            {!isHeaderFooterMode && (
              <AccordionItem value="item-2">
                <AccordionTrigger className="uppercase hover:no-underline">
                  {t("Input")}
                </AccordionTrigger>
                <AccordionContent className="flex w-full basis-full flex-col gap-2">
                  <div
                    className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      //@ts-ignore
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
                      icon={<NotebookPen size={12} className="mr-2 size-3" />}
                    >
                      <div className="flex max-w-[350px] flex-col items-center justify-start ">
                        <div className="flex max-w-[376px] gap-1">
                          <UserInputGen
                            {...formPreset}
                            label={t("FirstName")}
                            placeholder={t("FirstName")}
                            floatingLabel={true}
                            marginBottom={0}
                            marginLeft={0}
                            marginTop={0}
                            width={"100%"}
                          />
                          <UserInputGen
                            {...formPreset}
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
                    className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                    className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                      icon={
                        <SquareCheckIcon size={12} className="mr-2 size-3" />
                      }
                    >
                      <UserInputCheckboxGen
                        {...outlinedPresetChecbox}
                        label={t("CheckboxPlaceholder")}
                        placeholder={t("CheckboxPlaceholder")}
                      />
                    </HoverCardComponent>
                  </div>

                  <div
                    className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                      icon={<Mail size={12} className="mr-2 size-3" />}
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
                    className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                      icon={<Phone size={12} className="mr-2 size-3" />}
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
                    className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                      icon={<SquarePen size={12} className="mr-2 size-3" />}
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
                    className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <Select {...selectPreset} disabled={false} />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("Select")}
                      icon={<SquareMousePointer className="mr-2 size-3" />}
                    >
                      <SelectGen
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
                    className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <MultipleChoice {...multipleChoiceFilledPreset} />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("Multiple Choice")}
                      icon={<LayoutList className="mr-2 size-3" />}
                    >
                      <MultipleChoiceGen
                        {...{
                          ...multipleChoiceFilledPreset,
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
                    className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                    //eslint-disable-next-line
                    ref={(ref: any) =>
                      ref &&
                      connectors.create(
                        ref,
                        <PictureChoice {...pictureChoiceOutlinedPreset} />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("Picture Choice")}
                      icon={<Images className="mr-2 size-3" />}
                    >
                      <PictureChoiceGen
                        {...{
                          ...pictureChoiceOutlinedPreset,
                          disabled: true,
                          marginTop: 8,
                          marginBottom: 8,
                          marginLeft: 8,
                          marginRight: 8,
                          size: "small",
                          selections: pictureChoiceDefaultSelections,
                          choices: pictureChoiceDefaultChoices,
                        }}
                      />
                    </HoverCardComponent>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="item-3">
              <AccordionTrigger className="uppercase hover:no-underline">
                {t("Button")}
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
                <div
                  className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                <div
                  className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                        size={"large"}
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
                    icon={<SkipBack className="mr-2 size-3" />}
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
                  className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                        size={"small"}
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
                    icon={<MessageCircleMoreIcon className="mr-2 size-3" />}
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
                  className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                        size={"small"}
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
                    icon={<Send className="mr-2 size-3" />}
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
                  className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                    icon={<Link className="mr-2 size-3" />}
                  >
                    <LinkButtonGen
                      className="w-full"
                      // alignItems={"center"}
                      {...linkOutLinePreset}
                      size="small"
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
                <AccordionTrigger className="uppercase hover:no-underline">
                  Display
                </AccordionTrigger>
                <AccordionContent className="flex w-full basis-full flex-col gap-2">
                  <div
                    className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                          disabled={false}
                        />
                      )
                    }
                    data-cy="toolbox-text"
                  >
                    <HoverCardComponent
                      title={t("Avatar")}
                      icon={<User className="mr-2 size-3" />}
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
                    className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                      icon={<Columns className="mr-2 size-3" />}
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
                    className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                      icon={<RectangleEllipsis className="mr-2 size-3" />}
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
                </AccordionContent>
              </AccordionItem>
            )}

            {!isHeaderFooterMode && (
              <AccordionItem value="item-4">
                <AccordionTrigger className="uppercase hover:no-underline">
                  Display
                </AccordionTrigger>

                <AccordionContent className="flex w-full basis-full flex-col gap-2">
                  <>
                    <div
                      className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                      className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,
                          <LineSelector
                            // {...IconButtonDefaultProps}
                            // {...filledPreset}
                            {...filledPreset}
                            // {...outLinePreset}
                            disabled={false}
                            enableLine={true}
                          />
                        )
                      }
                      data-cy="toolbox-text"
                    >
                      <HoverCardComponent
                        title={t("Separator")}
                        icon={<SeparatorHorizontal className="mr-2 size-3" />}
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
                      className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                        icon={<ImageIcon className="mr-2 size-3" />}
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
                      className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                        icon={<LoaderIcon className="mr-2 size-3" />}
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
                      className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                        icon={<Columns className="mr-2 size-3" />}
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
                      className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        ref &&
                        connectors.create(
                          ref,
                          <TextImageComponent
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
                        icon={<LayoutList className="mr-2 size-3" />}
                      >
                        <TextImageComponentPreview
                          {...TextImageDefaultProps}
                          title={t("Title")}
                          Text={"Text here"}
                        />
                      </HoverCardComponent>
                    </div>

                    <div
                      className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        //@ts-ignore
                        connectors.create(
                          ref,
                          //@ts-ignore
                          <Steps {...stepsDefaultPreset} />
                        )
                      }
                      data-cy="toolbox-layout-container"
                    >
                      <HoverCardComponent
                        title={t("Steps")}
                        icon={<Ellipsis className="mr-2 size-3" />}
                      >
                        <StepsGen {...stepsDefaultPreset} />
                      </HoverCardComponent>
                    </div>

                    <div
                      className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        //@ts-ignore
                        connectors.create(
                          ref,
                          //@ts-ignore
                          <List {...listHorizontalPreset} />
                        )
                      }
                      data-cy="toolbox-layout-container"
                    >
                      <HoverCardComponent
                        title={t("List")}
                        icon={<ListOrdered className="mr-2 size-3" />}
                      >
                        <ListGen
                          {...{
                            ...listHorizontalPreset,
                            columnsDesktop: 1,
                            columnsMobile: 1,
                          }}
                        />
                      </HoverCardComponent>
                    </div>

                    <div
                      className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        //@ts-ignore
                        connectors.create(
                          ref,
                          //@ts-ignore
                          <Checklist {...checklistNormalPreset} />
                        )
                      }
                      data-cy="toolbox-layout-container"
                    >
                      <HoverCardComponent
                        title={t("Checklist")}
                        icon={<ListChecks className="mr-2 size-3" />}
                      >
                        <ChecklistGen {...checklistNormalPreset} />
                      </HoverCardComponent>
                    </div>

                    <div
                      className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
                      //eslint-disable-next-line
                      ref={(ref: any) =>
                        //@ts-ignore
                        connectors.create(
                          ref,
                          //@ts-ignore
                          <LogoBar {...logoBarDefaultPreset} />
                        )
                      }
                      data-cy="toolbox-layout-container"
                    >
                      <HoverCardComponent
                        title={t("Logo Bar")}
                        icon={<SwatchBook className="mr-2 size-3" />}
                      >
                        <LogoBarGen {...logoBarDefaultPreset} />
                      </HoverCardComponent>
                    </div>
                    <div
                      className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
                        icon={<RectangleEllipsis className="mr-2 size-3" />}
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
              <AccordionTrigger className="uppercase hover:no-underline">
                Navigation
              </AccordionTrigger>
              <AccordionContent className="flex w-full basis-full flex-col gap-2">
                <div
                  className="rounded-md border p-2 hover:bg-inherit hover:text-inherit"
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
            </AccordionItem> */}
          </Accordion>
        </ScrollArea>
      </div>
    </div>
  )
}
