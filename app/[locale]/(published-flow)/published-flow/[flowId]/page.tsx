// export const runtime = "nodejs"
export const dynamic = "force-static"
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
import FlowStateSetter from "../../storeSetter"
// import { cookies } from "next/headers"
import { unstable_setRequestLocale } from "next-intl/server"
// import { cookies } from "next/headers"

// export async function generateStaticParams() {
//   const locales = ["en", "pt"]
//   const response = await fetch(`http://127.0.0.1:8000/api/flows/published`, {
//     method: "GET",
//     //   headers: {
//     //     Cookie: cookieString,
//     //   },
//     cache: "force-cache",
//     next: { tags: ["flow"] },
//   })
//   const data = await response.json()
//   // const data = [
//   //   {
//   //     id: "clzii72n300012bn3x7jv5dzw",
//   //     name: "gty",
//   //     isDeleted: false,
//   //     createdAt: "2024-08-06T14:16:22.044Z",
//   //     updatedAt: "2024-08-06T14:16:22.044Z",
//   //     previewImage:
//   //       "https://s3.eu-central-2.wasabisys.com/screenreceurope/ShareX/2024/07/chrome_2HzXSQ53Oh.png",
//   //     link: "",
//   //     status: "active",
//   //     numberOfSteps: 4,
//   //     numberOfResponses: 0,
//   //     userId: "clxvshkl600009jfxoxfl3rd4",
//   //     templateId: "clyymc4im0002mlrpbdtly9zt",
//   //     headerData:
//   //       '{"ROOT":{"type":"UserContainer","isCanvas":true,"props":{"padding":5,"background":"#ad2121","expanded":"true","containerType":"header","style":{"minHeight":"40px","minWidth":"100%","flexDirection":"column","width":"100%","zIndex":20,"top":0,"position":"relative","justifyContent":"start"},"className":"min-h-auto min-w-full flex flex-col items-center"},"displayName":"Header Screen","custom":{},"hidden":false,"nodes":["xTIX1BInqi","MxVSJ1erxD","mSQvCVvDqs"],"linkedNodes":{}},"xTIX1BInqi":{"type":{"resolvedName":"LogoComponent"},"isCanvas":false,"props":{"fontFamily":{"value":"--font-poppins","globalStyled":true,"isCustomized":false},"containerBackground":"rgba(255,255,255,0)","background":{"value":"#13aa1d","globalStyled":true,"isCustomized":false},"color":{"value":"#ffffff","globalStyled":false,"isCustomized":true},"backgroundHover":{"value":"#119c1b","globalStyled":true,"isCustomized":false},"colorHover":{"value":"#ffffff","globalStyled":false,"isCustomized":true},"radius":{"value":"8","globalStyled":false,"isCustomized":false},"justifyContent":"space-between","borderColor":{"value":"#13aa1d","globalStyled":true,"isCustomized":false},"borderHoverColor":{"value":"#13aa1d","globalStyled":true,"isCustomized":false},"alt":"Image","align":"center","url":"https://convify.io","src":"/_next/static/media/convify_logo_black.0085e885.png","disabled":false,"enableLink":false,"minWidth":"120px","w":"auto","h":"80px","width":"medium","height":"auto","size":"medium","imageSize":90,"buttonSize":"medium","time":2,"text":"Continue","top":0,"bottom":0,"left":0,"right":0,"marginLeft":0,"marginTop":20,"marginRight":0,"marginBottom":20,"icon":{"picture":"interface-arrows-right-arrow-right-keyboard","pictureType":"icon"},"paddingLeft":"16","paddingTop":"14","paddingRight":"16","paddingBottom":"14","flexDirection":"row","alignItems":"center","gap":4,"border":2,"fullWidth":true,"preset":"filled","settingsTab":"content","tracking":false,"trackingEvent":"button-d33100","nextScreen":"screen-one","buttonAction":"next-screen","borderRad":0,"enableIcon":true},"displayName":"LogoComponent","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}},"MxVSJ1erxD":{"type":{"resolvedName":"ProgressBar"},"isCanvas":false,"props":{"fontFamily":{"value":"--font-poppins","globalStyled":true,"isCustomized":false},"containerBackground":"rgba(255, 255, 255, 0.886)","background":{"value":"#4050ff","globalStyled":false,"isCustomized":false},"color":{"value":"#ffffff","globalStyled":false,"isCustomized":false},"backgroundHover":{"value":"#3182ce","globalStyled":false,"isCustomized":false},"colorHover":{"value":"#ffffff","globalStyled":false,"isCustomized":false},"radius":{"value":"0","globalStyled":false,"isCustomized":false},"justifyContent":"center","borderColor":{"value":"inherit","globalStyled":false,"isCustomized":false},"borderHoverColor":{"value":"inherit","globalStyled":false,"isCustomized":false},"disabled":false,"enableIcon":true,"width":"366","height":"auto","size":"full","buttonSize":"medium","text":"Get quote","marginLeft":0,"marginTop":0,"marginRight":0,"marginBottom":0,"icon":"arrowright","paddingLeft":0,"paddingTop":0,"paddingRight":0,"paddingBottom":0,"flexDirection":"row","alignItems":"center","gap":4,"border":0,"fullWidth":true,"preset":"filled","settingsTab":"content","tracking":false,"trackingEvent":"button_clicked","nextScreen":{"screenName":"screen-one","screenId":"clzii73bz00022bn39ttxr3xa"},"buttonAction":"next-screen","progressvalue":1,"maxValue":5,"maxWidth":"366","progressStyle":"minus","forHeader":true,"type":"header"},"displayName":"ProgressBar","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}},"mSQvCVvDqs":{"type":{"resolvedName":"AvatarComponent"},"isCanvas":false,"props":{"fontFamily":{"value":"--font-poppins","globalStyled":true,"isCustomized":false},"containerBackground":"rgba(255,255,255,0)","background":{"value":"#13aa1d","globalStyled":true,"isCustomized":false},"color":{"value":"#ffffff","globalStyled":false,"isCustomized":true},"backgroundHover":{"value":"#119c1b","globalStyled":true,"isCustomized":false},"colorHover":{"value":"#ffffff","globalStyled":false,"isCustomized":true},"radius":{"value":"8","globalStyled":false,"isCustomized":false},"justifyContent":"space-between","borderColor":{"value":"#13aa1d","globalStyled":true,"isCustomized":false},"borderHoverColor":{"value":"#13aa1d","globalStyled":true,"isCustomized":false},"alt":"Image","align":"center","url":"https://convify.io","src":"/_next/static/media/default-avatar.5b6d0509.webp","disabled":false,"enableLink":false,"w":"auto","h":"60px","width":"medium","height":"auto","size":"medium","imageSize":90,"buttonSize":"medium","time":2,"text":"Continue","top":0,"bottom":0,"left":0,"right":0,"marginLeft":0,"marginTop":20,"marginRight":0,"marginBottom":20,"icon":{"picture":"interface-arrows-right-arrow-right-keyboard","pictureType":"icon"},"paddingLeft":"16","paddingTop":"14","paddingRight":"16","paddingBottom":"14","flexDirection":"row","alignItems":"center","gap":4,"border":2,"fullWidth":true,"preset":"filled","settingsTab":"content","tracking":false,"trackingEvent":"button-06d500","nextScreen":"screen-one","buttonAction":"next-screen","cornRad":50,"uploadedImageUrl":"","uploadedImageMobileUrl":"","enableIcon":true},"displayName":"AvatarComponent","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}}}',
//   //     footerData:
//   //       '{"ROOT":{"type":"UserContainer","isCanvas":true,"props":{"padding":5,"fullWidth":true,"background":"#ad2121","expanded":"true","style":{"minHeight":"200px","minWidth":"200px","width":"100%","flexDirection":"column","justifyContent":"end"},"className":"flex flex-col items-center py-5"},"displayName":"Screen Footer","custom":{},"hidden":false,"nodes":["footer-node"],"linkedNodes":{}},"footer-node":{"type":{"resolvedName":"ScreenFooter"},"isCanvas":false,"props":{"fullWidth":true},"displayName":"Footer","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}}}',
//   //     flowSettings: {
//   //       text: {
//   //         primaryFont: "--font-poppins",
//   //         primaryColor: "#000000",
//   //         secondaryFont: "--font-roboto",
//   //         secondaryColor: "#504a54",
//   //       },
//   //       header: {
//   //         headerPosition: "absolute",
//   //       },
//   //       general: {
//   //         primaryColor: "#13aa1d",
//   //         secondaryColor: "#b8b319",
//   //         backgroundColor: "#cf99db",
//   //       },
//   //       mobileScreen: false,
//   //     },
//   //     customDomain: "",
//   //     isPublished: true,
//   //   },
//   //   {
//   //     id: "clxkjmjx900017m3fj3tass9g",
//   //     name: "Recruiting new template",
//   //     isDeleted: false,
//   //     createdAt: "2024-06-18T15:12:31.579Z",
//   //     updatedAt: "2024-06-18T15:12:31.579Z",
//   //     previewImage: null,
//   //     link: "https://convify.io/survey-es",
//   //     status: "active",
//   //     numberOfSteps: 3,
//   //     numberOfResponses: 0,
//   //     userId: "clxj7ar700000pr20kr270nni",
//   //     templateId: "1",
//   //     headerData: null,
//   //     footerData: null,
//   //     flowSettings: {
//   //       text: {
//   //         primaryFont: "--font-cal-sans",
//   //         primaryColor: "#0e0e0e",
//   //         secondaryFont: "--font-inter",
//   //         secondaryColor: "#0e0e0e",
//   //       },
//   //       header: {
//   //         headerPosition: "absolute",
//   //       },
//   //       general: {
//   //         primaryColor: "#4050ff",
//   //         secondaryColor: "#4050ff",
//   //         backgroundColor: "rgba(255,255,255,.1)",
//   //       },
//   //     },
//   //     customDomain: "",
//   //     isPublished: true,
//   //   },
//   //   {
//   //     id: "clwqfhfvh0001sja3q8nlhuat",
//   //     name: "copy of b2b",
//   //     isDeleted: false,
//   //     createdAt: "2024-05-29T07:37:03.021Z",
//   //     updatedAt: "2024-05-29T07:37:03.021Z",
//   //     previewImage:
//   //       "https://s3.eu-central-2.wasabisys.com/screenreceurope/ShareX/2024/06/chrome_ZrocJkm7TG.png",
//   //     link: "https://convify.io/survey",
//   //     status: "active",
//   //     numberOfSteps: 2,
//   //     numberOfResponses: 18,
//   //     userId: "clxj7ar700000pr20kr270nni",
//   //     templateId: "1",
//   //     headerData: null,
//   //     footerData: null,
//   //     flowSettings: {
//   //       primaryColor: "#4050ff",
//   //       secondaryColor: "#41111111ff",
//   //       backgroundColor: "#ffffff",
//   //     },
//   //     customDomain: "",
//   //     isPublished: true,
//   //   },
//   // ]
//   // Function to generate three random alphabets
//   function getRandomSuffix() {
//     const characters = "abcdefghijklmnopqrstuvwxyz"
//     let result = ""
//     for (let i = 0; i < 3; i++) {
//       result += characters.charAt(Math.floor(Math.random() * characters.length))
//     }
//     return result
//   }

//   // Map the response data to create the desired format
//   // return data.map((flow) => ({
//   //   // const formattedName = flow.name.toLowerCase().replace(/\s+/g, "-")
//   //   return {`${formattedName}`}
//   // }))
//   const localeParams = locales.map((locale) => ({ locale }))

//   // Generate flow params
//   const flowParams = data.map((flow) => ({
//     params: { flowId: flow.id },
//   }))

//   // Combine both sets of params
//   const combinedParams = localeParams.flatMap((localeParam) =>
//     flowParams.map((flowParam) => ({
//       ...flowParam,
//       ...localeParam,
//     }))
//   )

//   return combinedParams
// }
interface PageProps {
  params: {
    flowId: string
    locale: any
  }
  searchParams: {
    screen: string
  }
}

export default async function PreviewFlows({
  params,
  searchParams,
}: PageProps) {
  unstable_setRequestLocale(params.locale)
  console.log("searchParamssss", searchParams)
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
  // const cookie = cookies()
  // const screenName = searchParams?.screen || ""
  // const cookieString = cookie
  //   .getAll()
  //   .map((cookie) => `${cookie.name}=${cookie.value}`)
  //   .join("; ")

  const flowId = params?.flowId
  const response = await fetch(
    `http://localhost:3000/api/flows/published/${flowId}`,
    {
      method: "GET",
      //   headers: {
      //     Cookie: cookieString,
      //   },
      cache: "force-cache",
      next: { tags: ["flow"] },
    }
  )
  const data = await response.json()
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

  console.log("dataaaaa in publisedh", data, flowId)
  const screenNames = data?.steps?.map((screen) => screen.name)
  return (
    <>
      <FlowStateSetter flowData={data} screenNames={screenNames} />
      <div
        className={`flex w-full flex-col !bg-[${data?.flowSettings?.general?.backgroundColor}]`}
        style={{
          backgroundColor: data?.flowSettings?.general?.backgroundColor,
        }}
      >
        {data?.headerData &&
          resolveComponents(JSON.parse(data?.headerData || {}))}
      </div>
      <div
        className={`flex w-full flex-col !bg-[${data?.flowSettings?.general?.backgroundColor}] h-full `}
      >
        {data.steps?.map((screen, index) => {
          return (
            <div
              key={index}
              id={screen?.name}
              style={{
                // display:
                // screenName === "" && index === 0
                //   ? "block"
                //   : screenName === screen?.name
                // "block",
                // : "none",
                backgroundColor: data?.flowSettings?.general?.backgroundColor,
              }}
              className="
relative
          
          min-w-full
          shrink-0
          basis-full
          "
            >
              {resolveComponents(screen.content)}
            </div>
          )
        })}
      </div>
    </>
  )
}
