import React, { Suspense, useEffect, useState } from "react"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { CRAFT_ELEMENTS } from "@/components/user/settings/craft-elements"
import { UserContainerGen } from "@/components/user/container/user-container.component"
import { HeadlineTextGen } from "@/components/user/headline-text/headline-text.component"
import { IconButtonGen } from "@/components/user/icon-button/user-icon-button.component"
import { ImageComponentGen } from "../image-new/user-image.component"
import { UserLogo } from "@/components/user/logo/user-logo.component"
import { UserTextInputGen } from "@/components/user/text/user-text.component"
import { UserInputGen } from "../input/user-input.component"
import { ProgressBarGen } from "../progress/user-progress.component"
import { MultipleChoiceGen } from "../multiple-choice/user-multiple-choice.component"
import { PictureChoiceGen } from "../picture-choice/user-picture-choice.component"
import { ScreenFooterGen } from "../screens/screen-footer.component"
import { CardContentGen, CardGen } from "../card/user-card.component"
import { SelectGen } from "../select/user-select.component"
import { ChecklistGen } from "../checklist/user-checklist.component"
import { ListGen } from "../list/user-list.component"
import { LogoBarGen } from "../logo-bar/user-logo-bar.component"
import { StepsGen } from "../steps/user-steps.component"
import { IconLineSeperator } from "../lineSeperator/line-seperator-component"
import { BackButtonGen } from "../backButton/back-component"
import { LinkButtonGen } from "../link/link-component"
import { AvatarComponentGen } from "../avatar-new/user-avatar.component"
import { LogoComponentGen } from "../logo-new/user-logo.component"
import { LoaderComponentGen } from "../loader-new/user-loader.component"
import { TextImageComponentGen } from "../textImage/user-textImage.component"
import { SocialShareButtonGen } from "../socialShareButton/share-component"
import { TelegramShareButtonGen } from "../telegramShareButton/telegram-component"
import { useNode } from "@craftjs/core"
import { rgba } from "polished"
import { UserInputCheckboxGen } from "../input-checkbox/user-input-checkbox.component"
import { UserInputMailGen } from "../input-email/user-input-mail.component"
import { UserInputPhoneGen } from "../input-phone/user-input-phone.component"
import { UserInputTextareaGen } from "../input-textarea/user-input-textarea.component"
import { FormContentGen, FormGen } from "../form/user-form.component"
import { FAQGen } from "../faq/user-faq.component"
import { LinksGen } from "../links/user-links.component"
import { ImageStory, ImageStoryGen } from "../image-story/image-story.component"

const CraftJsUserComponents = {
  [CRAFT_ELEMENTS.USERCONTAINER]: UserContainerGen,
  [CRAFT_ELEMENTS.LOGO]: UserLogo,
  [CRAFT_ELEMENTS.CARD]: CardGen,
  [CRAFT_ELEMENTS.CARDCONTENT]: CardContentGen,
  [CRAFT_ELEMENTS.DIV]: "div",
  [CRAFT_ELEMENTS.LOGOBAR]: LogoBarGen,
  [CRAFT_ELEMENTS.PROGRESSBAR]: ProgressBarGen,
  [CRAFT_ELEMENTS.ICONBUTTON]: IconButtonGen,
  [CRAFT_ELEMENTS.LINESELECTOR]: IconLineSeperator,
  [CRAFT_ELEMENTS.BACKBUTTON]: BackButtonGen,
  [CRAFT_ELEMENTS.LINKBUTTON]: LinkButtonGen,
  [CRAFT_ELEMENTS.LOGOCOMPONENT]: LogoComponentGen,
  [CRAFT_ELEMENTS.LOADERCOMPONENT]: LoaderComponentGen,
  [CRAFT_ELEMENTS.IMAGECOMPONENT]: ImageComponentGen,
  [CRAFT_ELEMENTS.AVATARCOMPONENT]: AvatarComponentGen,
  [CRAFT_ELEMENTS.TEXTIMAGECOMPONENT]: TextImageComponentGen,
  [CRAFT_ELEMENTS.SELECT]: SelectGen,
  [CRAFT_ELEMENTS.USERINPUT]: UserInputGen,
  [CRAFT_ELEMENTS.USERTEXT]: UserTextInputGen,
  [CRAFT_ELEMENTS.HEADLINETEXT]: HeadlineTextGen,
  [CRAFT_ELEMENTS.PICTURECHOICE]: PictureChoiceGen,
  [CRAFT_ELEMENTS.MULTIPLECHOICE]: MultipleChoiceGen,
  [CRAFT_ELEMENTS.STEPS]: StepsGen,
  [CRAFT_ELEMENTS.CHECKLIST]: ChecklistGen,
  [CRAFT_ELEMENTS.LIST]: ListGen,
  [CRAFT_ELEMENTS.LINKS]: LinksGen,
  [CRAFT_ELEMENTS.FAQ]: FAQGen,
  [CRAFT_ELEMENTS.IMAGESTORY]: ImageStoryGen,
  [CRAFT_ELEMENTS.SCREENFOOTER]: ScreenFooterGen,
  [CRAFT_ELEMENTS.SOCIALSHAREBUTTON]: SocialShareButtonGen,
  [CRAFT_ELEMENTS.TELEGRAMSHAREBUTTON]: TelegramShareButtonGen,
  [CRAFT_ELEMENTS.INPUTCHECKBOX]: UserInputCheckboxGen,
  [CRAFT_ELEMENTS.INPUTMAIL]: UserInputMailGen,
  [CRAFT_ELEMENTS.INPUTPHONE]: UserInputPhoneGen,
  [CRAFT_ELEMENTS.TEXTAREA]: UserInputTextareaGen,
  [CRAFT_ELEMENTS.FORM]: FormGen,
  [CRAFT_ELEMENTS.FORMCONTENT]: FormContentGen,
}

interface Props {
  compressedCraftState: string
}

const ResolvedNewComponentsFromCraftState = ({
  screen,
}): React.ReactElement | null => {
  const [toRender, setToRender] = useState<React.ReactElement | null>(null)
  const globalTheme = useAppSelector((state: RootState) => state?.newTheme)
  const textColor = globalTheme?.text?.primaryColor
  const primaryColor = globalTheme?.general?.primaryColor
  console.log("textcolor, pc", textColor, primaryColor)
  useEffect(() => {
    try {
      const changeBackgroundColor = () => {
        const elements = document.querySelectorAll(
          ".bLjYAn"
        ) as NodeListOf<HTMLElement>
        console.log("element", elements)
        if (elements) {
          elements?.forEach((element) => {
            element.style.backgroundColor =
              globalTheme?.general?.primaryColor || ""
          })
        }
      }

      // Call the function when component mounts or when specific dependencies change
      changeBackgroundColor()

      const craftState = JSON.parse(screen)
      const resolveComponents = () => {
        const parsedNodes = {}

        const parse = (nodeId: string, parentNodeId?: string) => {
          if (parsedNodes[nodeId]) return parsedNodes[nodeId]

          const nodeData = craftState[nodeId]
          if (!nodeData) return null

          const { type, props, nodes = [], linkedNodes = {} } = nodeData
          console.log("props", props)
          const resolvedName = type?.resolvedName
          const ReactComponent = resolvedName
            ? CraftJsUserComponents[resolvedName]
            : null

          let filteredNodes = nodes
          if (resolvedName !== "AvatarComponent") {
            const avatarComponents = nodes.filter(
              (childNodeId) =>
                craftState[childNodeId]?.type.resolvedName === "AvatarComponent"
            )
            filteredNodes = nodes.filter(
              (childNodeId) =>
                craftState[childNodeId]?.type.resolvedName !== "AvatarComponent"
            )
            if (avatarComponents.length > 0) {
              filteredNodes.push(avatarComponents[avatarComponents.length - 1])
            }
          }

          const childNodes = filteredNodes.map((childNodeId: string) =>
            parse(childNodeId, nodeId)
          )
          const linkedNodesElements = filteredNodes
            .concat(Object.values(linkedNodes))
            .map((linkedNodeData: any) => {
              const linkedNodeId = linkedNodeData.nodeId || linkedNodeData
              return parse(linkedNodeId, nodeId)
            })

          const parsedNode = ReactComponent ? (
            <ReactComponent
              {...props}
              parentNodeId={parentNodeId}
              nodeId={nodeId}
              key={nodeId}
              scrollY={scrollY}
              textColor={textColor}
              color={{ value: globalTheme?.text?.primaryColor }}
              background={{
                value: globalTheme?.general?.primaryColor,
              }}
              backgroundHover={{
                value: globalTheme?.general?.primaryColor,
              }}
              containerBackground={globalTheme?.general?.backgroundColor}
              labelColor={textColor}
              borderColor={{ value: globalTheme?.general?.primaryColor }}
              borderHoverColor={globalTheme?.general?.primaryColor}
              activeBorderColor={{
                value: globalTheme?.general?.primaryColor,
                globalStyled: false,
                isCustomized: false,
              }}
              selectedStyles={{
                ...props.selectedStyles,

                ...(props.selectedStyles?.borderColor?.value
                  ? {
                      borderColor: {
                        value: globalTheme?.general?.primaryColor,
                        globalStyled: true,
                        isCustomized: false,
                      },
                    }
                  : {
                      borderColor: globalTheme?.general?.primaryColor,
                    }),
                ...(props.selectedStyles?.backgroundColor?.value
                  ? {
                      backgroundColor: {
                        value: globalTheme?.general?.primaryColor,
                        globalStyled: true,
                        isCustomized: false,
                      },
                    }
                  : {
                      backgroundColor: rgba(
                        globalTheme?.general?.primaryColor || "",
                        0.1
                      ),
                    }),
                ...(props.selectedStyles?.iconColor?.value
                  ? {
                      iconColor: {
                        value: "white",
                        globalStyled: true,
                        isCustomized: false,
                      },
                    }
                  : {
                      iconColor: globalTheme?.general?.primaryColor,
                    }),
              }}
              defaultStyles={{
                ...props.defaultStyles,

                ...(props.defaultStyles?.iconColor?.value
                  ? {
                      iconColor: {
                        value: globalTheme?.general?.primaryColor,
                        globalStyled: true,
                        isCustomized: false,
                      },
                    }
                  : {
                      iconColor: globalTheme?.general?.primaryColor,
                    }),
              }}
              hoverStyles={{
                ...props.hoverStyles,
                ...(props.hoverStyles?.borderColor?.value
                  ? {
                      borderColor: {
                        value: globalTheme?.general?.primaryColor,
                        globalStyled: true,
                        isCustomized: false,
                      },
                    }
                  : {
                      borderColor: globalTheme?.general?.primaryColor,
                    }),
                ...(props.hoverStyles?.iconColor?.value
                  ? {
                      iconColor: {
                        value: globalTheme?.general?.primaryColor,
                        globalStyled: true,
                        isCustomized: false,
                      },
                    }
                  : {
                      iconColor: globalTheme?.general?.primaryColor,
                    }),
                ...(props.hoverStyles?.backgroundColor?.value
                  ? {
                      backgroundColor: {
                        value: globalTheme?.general?.backgroundColor,
                        globalStyled: true,
                        isCustomized: false,
                      },
                    }
                  : {
                      backgroundColor: rgba(
                        globalTheme?.general?.primaryColor || "",
                        0.1
                      ),
                    }),
                ...(props.hoverStyles?.textColor?.value
                  ? {
                      textColor: {
                        value: globalTheme?.general?.primaryColor,
                        globalStyled: true,
                        isCustomized: false,
                      },
                    }
                  : {
                      textColor: "#000000",
                    }),
              }}
            >
              {linkedNodesElements}
            </ReactComponent>
          ) : (
            <div
              {...props}
              parentNodeId={parentNodeId}
              nodeId={nodeId}
              key={nodeId}
              containerBackground={globalTheme?.general?.backgroundColor}
              textColor={{ value: textColor, ...props.textColor }}
              color={textColor}
              borderColor={{ value: primaryColor, ...props.borderColor }}
              borderHoverColor={{
                value: primaryColor,
              }}
            >
              {linkedNodesElements}
            </div>
          )

          parsedNodes[nodeId] = parsedNode
          return parsedNode
        }

        return parse("ROOT") || <></>
      }

      setToRender(resolveComponents())
    } catch (error) {
      console.error("Error parsing craft state: ", error)
      setToRender(<div>Error loading components.</div>)
    }
  }, [screen, globalTheme])
  return <Suspense fallback={<h2>Loading...</h2>}>{toRender}</Suspense>
}

export default ResolvedNewComponentsFromCraftState
