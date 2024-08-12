// export const runtime = "nodejs"
// export const dynamic = "force-static"
import { CRAFT_ELEMENTS } from "@/components/user/settings/craft-elements"
import React, { Suspense } from "react"

import { HeadlineTextGen } from "@/components/user/headline-text/headline-text.component"
import { IconButtonGen } from "@/components/user/icon-button/user-icon-button.component"
import { UserLogo } from "@/components/user/logo/user-logo.component"
// import lz from "lzutf8";
import { UserTextInputGen } from "@/components/user/text/user-text.component"
import { UserInputGen } from "@/components/user/input/user-input.component"
import { LogoBarGen } from "@/components/user/logo-bar/user-logo-bar.component"
import { ProgressBarGen } from "@/components/user/progress/user-progress.component"
import {
  FormContentGen,
  FormContent,
  FormGen,
} from "@/components/user/form/user-form.component"
import { PictureChoiceGen } from "@/components/user/picture-choice/user-picture-choice.component"
import { MultipleChoiceGen } from "@/components/user/multiple-choice/user-multiple-choice.component"
import { ScreenFooterGen } from "@/components/user/screens/screen-footer.component"
import {
  CardContentGen,
  CardContent,
  CardGen,
} from "@/components/user/card/user-card.component"

import { UserInputCheckboxGen } from "@/components/user/input-checkbox/user-input-checkbox.component"
import { UserInputMailGen } from "@/components/user/input-email/user-input-mail.component"
import { User } from "lucide-react"
import { UserInputPhoneGen } from "@/components/user/input-phone/user-input-phone.component"
import { UserInputTextareaGen } from "@/components/user/input-textarea/user-input-textarea.component"
import { ImageComponentGen } from "@/components/user/image-new/user-image.component"
import { SelectGen } from "@/components/user/select/user-select.component"
import { ChecklistGen } from "@/components/user/checklist/user-checklist.component"
import { ListGen } from "@/components/user/list/user-list.component"
import { StepsGen } from "@/components/user/steps/user-steps.component"
import { IconLineSeperator } from "@/components/user/lineSeperator/line-seperator-component"
import { BackButtonGen } from "@/components/user/backButton/back-component"
import { LinkButtonGen } from "@/components/user/link/link-component"
import { AvatarComponentGen } from "@/components/user/avatar-new/user-avatar.component"
import { LogoComponentGen } from "@/components/user/logo-new/user-logo.component"
import { LoaderComponentGen } from "@/components/user/loader-new/user-loader.component"
import { TextImageComponentGen } from "@/components/user/textImage/user-textImage.component"
import { SocialShareButtonGen } from "@/components/user/socialShareButton/share-component"
import { TelegramShareButtonGen } from "@/components/user/telegramShareButton/telegram-component"
import { UserContainerGen } from "@/components/user/container/user-container.component"
import { getCurrentUser } from "@/lib/session"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import FlowLayout from "@/components/flow-preview/flow-preview-server"
// import { cookies } from "next/headers"
import { unstable_setRequestLocale } from "next-intl/server"
import { Analytics } from "@/components/analytics"
import MetaGoogleAnalytics from "@/components/googleMetaAnalytics"
// import { cookies } from "next/headers"

export default async function StaticPublishedFile({
  data,
  screenName,
  allScreens,
}: {
  data: any
  screenName: string
  allScreens: string[]
}) {
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
  const resolveComponents = (screen) => {
    const craftState = screen
    // console.log("Parsed Craft State:", craftState) // Log parsed JSON data
    const parsedNodes = {}

    const parse = (nodeId: string, parentNodeId?: string) => {
      if (parsedNodes[nodeId]) return parsedNodes[nodeId]
      // console.log(`Parsing node: ${parsedNodes[nodeId]}`)

      const nodeData = craftState[nodeId]
      if (!nodeData) return null

      const { type, props, nodes = [], linkedNodes = {} } = nodeData
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
          // scrollY={scrollY}
        >
          {linkedNodesElements}
        </ReactComponent>
      ) : (
        <div
          {...props}
          parentNodeId={parentNodeId}
          nodeId={nodeId}
          key={nodeId}
        >
          {linkedNodesElements}
        </div>
      )

      parsedNodes[nodeId] = parsedNode
      return parsedNode
    }

    return parse("ROOT") || <></>
  }
  const filteredStep = data.steps.find(
    (screen) => screen.name === (screenName === "" ? allScreens[0] : screenName)
  )
  return (
    <div
      className={`flex w-full flex-col`}
      style={{
        backgroundColor:
          data?.flowSettings?.general?.backgroundColor || "transparent",
      }}
    >
      {data?.headerData &&
        resolveComponents(JSON.parse(data?.headerData || {}))}

      <div
        className={`flex h-full w-full flex-col`}
        style={{
          backgroundColor:
            data?.flowSettings?.general?.backgroundColor || "transparent",
          minHeight: "100vh",
        }}
      >
        {filteredStep && (
          <div
            id={filteredStep.name}
            style={{
              backgroundColor:
                data?.flowSettings?.general?.backgroundColor || "transparent",
            }}
            className="
                relative
                min-w-full
                shrink-0
                basis-full
              "
          >
            {resolveComponents(filteredStep.content)}
          </div>
        )}
      </div>
    </div>
  )
}
