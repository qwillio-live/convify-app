// export const runtime = "edge"
import React, { Suspense } from "react"
import { cookies } from "next/headers"
import { usePathname, useSearchParams } from "next/navigation"
import { User } from "lucide-react"
import { getServerSession } from "next-auth"

import { env } from "@/env.mjs"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import FlowLayout from "@/components/flow-preview/flow-preview-server"
import { AvatarComponentGen } from "@/components/user/avatar-new/user-avatar.component"
import { BackButtonGen } from "@/components/user/backButton/back-component"
import {
  CardContent,
  CardContentGen,
  CardGen,
} from "@/components/user/card/user-card.component"
import { ChecklistGen } from "@/components/user/checklist/user-checklist.component"
import { UserContainerGen } from "@/components/user/container/user-container.component"
import {
  FormContent,
  FormContentGen,
  FormGen,
} from "@/components/user/form/user-form.component"
import { HeadlineTextGen } from "@/components/user/headline-text/headline-text.component"
import { IconButtonGen } from "@/components/user/icon-button/user-icon-button.component"
import { ImageComponentGen } from "@/components/user/image-new/user-image.component"
import { UserInputCheckboxGen } from "@/components/user/input-checkbox/user-input-checkbox.component"
import { UserInputMailGen } from "@/components/user/input-email/user-input-mail.component"
import { UserInputPhoneGen } from "@/components/user/input-phone/user-input-phone.component"
import { UserInputTextareaGen } from "@/components/user/input-textarea/user-input-textarea.component"
import { UserInputGen } from "@/components/user/input/user-input.component"
import { IconLineSeperator } from "@/components/user/lineSeperator/line-seperator-component"
import { LinkButtonGen } from "@/components/user/link/link-component"
import { ListGen } from "@/components/user/list/user-list.component"
import { LoaderComponentGen } from "@/components/user/loader-new/user-loader.component"
import { LogoBarGen } from "@/components/user/logo-bar/user-logo-bar.component"
import { LogoComponentGen } from "@/components/user/logo-new/user-logo.component"
import { UserLogo } from "@/components/user/logo/user-logo.component"
import { MultipleChoiceGen } from "@/components/user/multiple-choice/user-multiple-choice.component"
import { PictureChoiceGen } from "@/components/user/picture-choice/user-picture-choice.component"
import { ProgressBarGen } from "@/components/user/progress/user-progress.component"
import { ScreenFooterGen } from "@/components/user/screens/screen-footer.component"
import { SelectGen } from "@/components/user/select/user-select.component"
import { CRAFT_ELEMENTS } from "@/components/user/settings/craft-elements"
import { SocialShareButtonGen } from "@/components/user/socialShareButton/share-component"
import { StepsGen } from "@/components/user/steps/user-steps.component"
import { TelegramShareButtonGen } from "@/components/user/telegramShareButton/telegram-component"
// import lz from "lzutf8";
import { UserTextInputGen } from "@/components/user/text/user-text.component"
import { TextImageComponentGen } from "@/components/user/textImage/user-textImage.component"

export default async function PreviewFlows({
  params,
  searchParams,
}: {
  params: { flowId: string; en: string }
  searchParams: { screen: string }
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

  const screenName = searchParams?.screen || ""
  const cookieString = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ")

  const flowId = params?.flowId
  const appUrl = env.NEXT_PUBLIC_APP_URL
  const response = await fetch(`${appUrl}/api/flows/${flowId}`, {
    method: "GET",
    headers: {
      Cookie: cookieString,
    },
    cache: "force-cache",
    next: { tags: ["previewFlow"] },
  })
  const data = await response.json()
  const filteredStep = data.steps?.find((screen) => screen.name === screenName)
    ? data.steps?.find((screen) => screen.name === screenName)
    : data?.steps?.[0]

  const resolveComponents = (screenContent) => {
    if (!screenContent) return <></>

    const craftState = screenContent
    const parsedNodes = {}

    const parse = (nodeId: string, parentNodeId?: string) => {
      if (parsedNodes[nodeId]) return parsedNodes[nodeId]

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

    // Ensure that `ROOT` exists and is valid
    return parse("ROOT") || <></>
  }

  console.log("anjit", data?.flowSettings?.header)
  const revertMinHeightAndClassName = (data) => {
    console.log("reverting editorload", data)
    try {
      data = JSON.parse(data)
    } catch (e) {
      console.log("erring", e)
      data = data
    }
    console.log("pop", data)
    if (data.ROOT && data.ROOT.props) {
      // Check if the style object exists; if not, create it
      if (!data.ROOT.props.style) {
        data.ROOT.props.style = {} // Create the style object
      }
      data.ROOT.props.style.minHeight = "none" // Update to 80vh
      data.ROOT.props.style.height = "auto" // Update to 80vh

      // Check for className and remove any class starting with "min-h-"
      if (data.ROOT.props.className) {
        data.ROOT.props.className = data.ROOT.props.className
          .split(" ") // Split into an array of class names
          .filter((className) => !className.startsWith("min-h-")) // Remove classes starting with "min-h-"
          .join(" ") // Join back into a string
      }
      console.log(" reverted editorLoad", data)
      return data
    }
  }
  return (
    <>
      <div className="flex h-screen flex-col">
        <div
          className={cn(
            `flex w-full flex-col !bg-[${data?.flowSettings?.general?.backgroundColor}] z-20`,
            {
              fixed: data?.flowSettings?.header?.headerPosition === "absolute",
            }
          )}
          style={{
            backgroundColor: data?.flowSettings?.general?.backgroundColor,
          }}
        >
          {data?.headerData &&
            resolveComponents(revertMinHeightAndClassName(data?.headerData))}
        </div>

        <div
          className={`flex w-full flex-1 flex-col !bg-[${data?.flowSettings?.general?.backgroundColor}]`}
          style={{
            backgroundColor: data?.flowSettings?.general?.backgroundColor,
          }}
        >
          {filteredStep && (
            <div
              key={`${filteredStep.name}`}
              id={filteredStep.name}
              style={{
                backgroundColor: data?.flowSettings?.general?.backgroundColor,
              }}
              className="animate-flow relative min-w-full"
            >
              {resolveComponents(filteredStep.content)}
            </div>
          )}
        </div>

        {data?.footerData && (
          <div
            className={`font-geist !bg-[${data?.flowSettings?.general?.backgroundColor}] flex w-full flex-col`}
            style={{
              backgroundColor: data?.flowSettings?.general?.backgroundColor,
            }}
          >
            {resolveComponents(
              revertMinHeightAndClassName(data?.footerData || {})
            )}
          </div>
        )}
      </div>
    </>
  )
}
