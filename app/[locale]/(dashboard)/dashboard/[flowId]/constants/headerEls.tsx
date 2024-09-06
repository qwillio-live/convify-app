/* eslint-disable @next/next/no-head-element */
/* eslint-disable @next/next/no-sync-scripts */
"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Eye, Plus } from "lucide-react"
import { signOut } from "next-auth/react"
import { NextIntlClientProvider, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BreadCrumbs } from "@/components/breadcrumbs-with-flowId"
import { createElement, useEffect, useState } from "react"
import ReactDOMServer, {
  renderToStaticMarkup,
  renderToString,
} from "react-dom/server"
import { User } from "../../page"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import {
  setResetTotalFilled,
  setSelectedScreen,
  setTotalRequired,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { revalidateFlow } from "@/actions/flow/revalidateFlow"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Icons } from "@/components/icons"
import { env } from "@/env.mjs"
import { CRAFT_ELEMENTS } from "@/components/user/settings/craft-elements"
import { HeadlineTextGen } from "@/components/user/headline-text/headline-text.component"
import { IconButtonGen } from "@/components/user/icon-button/user-icon-button.component"
import { UserLogo } from "@/components/user/logo/user-logo.component"
import { UserTextInputGen } from "@/components/user/text/user-text.component"
import { UserInputGen } from "@/components/user/input/user-input.component"
import { LogoBarGen } from "@/components/user/logo-bar/user-logo-bar.component"
import { ProgressBarGen } from "@/components/user/progress/user-progress.component"
import {
  FormContentGen,
  FormGen,
} from "@/components/user/form/user-form.component"
import { PictureChoiceGen } from "@/components/user/picture-choice/user-picture-choice.component"
import { MultipleChoiceGen } from "@/components/user/multiple-choice/user-multiple-choice.component"
import { ScreenFooterGen } from "@/components/user/screens/screen-footer.component"
import {
  CardContentGen,
  CardGen,
} from "@/components/user/card/user-card.component"

import { UserInputCheckboxGen } from "@/components/user/input-checkbox/user-input-checkbox.component"
import { UserInputMailGen } from "@/components/user/input-email/user-input-mail.component"
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
import StoreProviderNonPersist from "@/lib/state/store-provider-non-persist"
import { ThemeProvider } from "@/components/theme-provider"
import { render } from "jsx-to-html"
import { ServerStyleSheet } from "styled-components"
const clearFlowNamesFromLocalStorage = () => {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i)
    if (key && key.startsWith("flowName_")) {
      localStorage.removeItem(key)
    }
  }
}

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
      <div {...props} parentNodeId={parentNodeId} nodeId={nodeId} key={nodeId}>
        {linkedNodesElements}
      </div>
    )

    parsedNodes[nodeId] = parsedNode
    return parsedNode
  }

  // Ensure that `ROOT` exists and is valid
  return parse("ROOT") || <></>
}

const htmlContent = (data, screenName) => {
  const filteredStep = data
    ? data.steps.find((screen) => screen.name === screenName)
      ? data.steps.find((screen) => screen.name === screenName)
      : data.steps[0]
    : null
  return (
    <NextIntlClientProvider
      messages={data?.flowSettings?.general?.locale}
      locale={"en"}
    >
      <StoreProviderNonPersist>
        <div>
          {data && (
            <div>
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
                className={`flex w-full flex-col !bg-[${data?.flowSettings?.general?.backgroundColor}] min-h-[71vh]`}
                style={{
                  backgroundColor: data?.flowSettings?.general?.backgroundColor,
                }}
              >
                {filteredStep && (
                  <div
                    key={`${filteredStep.name}`}
                    id={filteredStep.name}
                    style={{
                      backgroundColor:
                        data?.flowSettings?.general?.backgroundColor,
                    }}
                    className="animate-flow relative min-w-full shrink-0 basis-full"
                  >
                    {resolveComponents(filteredStep.content)}
                  </div>
                )}
              </div>
              <div>
                {data?.footerData && (
                  <div
                    className={`font-geist !bg-[${data?.flowSettings?.general?.backgroundColor}] flex w-full flex-col`}
                    style={{
                      backgroundColor:
                        data?.flowSettings?.general?.backgroundColor,
                    }}
                  >
                    {resolveComponents(JSON.parse(data?.footerData || {}))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </StoreProviderNonPersist>
    </NextIntlClientProvider>
  )
}

const Header = ({ flowId }) => {
  const t = useTranslations("CreateFlow")
  const router = useRouter()
  const currentPath = usePathname()
  const sheet = new ServerStyleSheet()
  const dispatch = useAppDispatch()
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<User>()
  const flowDomain = env.NEXT_PUBLIC_FLOW_DOMAIN
  const screeenName = useAppSelector(
    (state) => state?.screen?.screens[state?.screen?.selectedScreen]?.screenName
  )
  const selectedScreen =
    useAppSelector((state) => state?.screen?.selectedScreen) || 0

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user data:", error))
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 370)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem("flowData")
    localStorage.removeItem("flowId")
    localStorage.removeItem("responses")
    localStorage.removeItem("flowName")
    clearFlowNamesFromLocalStorage()
    await signOut({ redirect: false })
    router.push("/login")
  }

  const linkClasses = (path) =>
    `h-full rounded-none border-b-4 flex-1 lg:flex-auto flex justify-center items-center text-sm ${
      isSmallScreen ? "px-2.5" : "px-3"
    } ${
      currentPath?.split("/").at(-1) === path.split("/").at(-1) ||
      currentPath === "/pt" + path
        ? "text-foreground border-current"
        : "text-muted-foreground border-transparent"
    }`

  const publishFlow = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/flows/published/${flowId}`, {
        method: "POST",
      })
      if (response.ok) {
        const responseForFlow = await fetch(
          `${env.NEXT_PUBLIC_APP_URL}/api/flows/${flowId}`,
          {
            method: "GET",
            next: { tags: ["previewFlow"] },
          }
        )
        const data = await responseForFlow.json()
        const component = htmlContent(data, screeenName)
        const Component = () => component
        const htmlString = renderToStaticMarkup(
          sheet.collectStyles(<Component />)
        )
        const styleTags = sheet.getStyleTags()
        const head = `<head>${styleTags}</head>`
        const html = `<!DOCTYPE html><html lang="en">${head}<script src="https://cdn.tailwindcss.com"></script><body>${htmlString}</body></html>`
        const responseForPublish = await fetch(
          `${env.NEXT_PUBLIC_APP_URL}/api/flows/publish/${flowId}`,
          {
            method: "POST",
            body: JSON.stringify({ html: html }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        revalidateFlow({ tag: "publishedFlow" })
        setTimeout(() => {
          setIsLoading(false)
          router.push(`./share`)
        }, 3000)
        // }
      }
    } catch (err) {
      console.error("Publishing flow failed:", err)
    }
  }

  return (
    <header className="flex h-28 flex-wrap items-center justify-between gap-x-4 bg-[#fcfdfe] px-4 lg:h-[60px] lg:flex-nowrap lg:gap-4 lg:px-6">
      <div className="bread-crumbs flex h-1/2 max-h-screen flex-col items-center lg:h-full">
        <div className="flex h-14 items-center lg:h-[60px]">
          <BreadCrumbs flowId={flowId} />
        </div>
        <div className="hidden h-14 flex-1 flex-col items-center justify-between overflow-y-auto px-4 lg:h-[60px] lg:px-6">
          <div className="flex flex-row items-center justify-between py-4">
            <h4 className="scroll-m-20 text-lg font-normal tracking-tight">
              {t("Content")}
            </h4>
            <Button size="icon" className="size-8">
              <Plus className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="order-last flex h-1/2 w-full basis-full shadow-[rgba(0,0,0,0.07)_0px_1px_inset] lg:order-[unset] lg:h-full lg:w-auto lg:basis-auto">
        <div className="flex size-full bg-inherit py-0 lg:w-auto lg:justify-center">
          <Link
            className={linkClasses("/dashboard/flows/create-flow")}
            href={`/dashboard/${flowId}/create-flow`}
            style={{
              paddingLeft: isSmallScreen ? "0.625rem" : "1rem",
            }}
          >
            {t("Create")}
          </Link>
          <Link
            className={linkClasses("/dashboard/flows/connect")}
            href={`/dashboard/${flowId}/connect`}
          >
            {t("Connect")}
          </Link>
          <Link
            className={linkClasses("/dashboard/flows/share")}
            href={`/dashboard/${flowId}/share`}
          >
            {t("Share")}
          </Link>
          <Link
            className={linkClasses("/dashboard/flows/results")}
            href={`/dashboard/${flowId}/results`}
          >
            {t("Results")}
          </Link>
        </div>
      </div>
      <div
        className="account-settings flex h-1/2 flex-row items-center justify-between gap-4 lg:h-full"
        onClick={() => {
          dispatch(setResetTotalFilled(true))
          dispatch(setSelectedScreen(selectedScreen))
          revalidateFlow({ tag: "previewFlow" })
        }}
      >
        <Link
          href={`/dashboard/preview-flow/${flowId}?screen=${screeenName}`}
          target="_blank"
        >
          <Button variant="outline" size="sm" className="my-4 h-8 gap-1 p-2">
            <Eye className="size-3.5" />
          </Button>
        </Link>
        <div className="">
          <Button
            size="sm"
            className="my-4 h-8 gap-1 py-2"
            onClick={publishFlow}
            disabled={isLoading ? true : false}
          >
            {t("Publish")}
            {isLoading && (
              <div>
                <Icons.spinner className=" z-20  h-6 w-4 animate-spin" />
              </div>
            )}
          </Button>
        </div>

        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center justify-center rounded-full bg-[#eaeaec] p-0 text-base font-bold uppercase hover:bg-[#eaeaec]"
                style={{ width: "40px", height: "40px" }}
              >
                {userData ? (
                  userData?.name ? (
                    userData?.name?.charAt(0).toUpperCase()
                  ) : (
                    userData?.email?.charAt(0).toUpperCase()
                  )
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-user"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                  </svg>
                )}
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" style={{ zIndex: 80 }}>
              <DropdownMenuLabel>{t("My Account")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t("Settings")}</DropdownMenuItem>
              <DropdownMenuItem>{t("Support")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                {t("Logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header
