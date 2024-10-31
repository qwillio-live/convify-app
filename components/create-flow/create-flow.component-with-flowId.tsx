"use client"

import React, { useCallback, useEffect } from "react"
import { debounce } from "lodash"
import {
  ArrowRight,
  Check,
  Cross,
  Facebook,
  Github,
  Globe,
  Image,
  Laptop,
  Linkedin,
  Smartphone,
  PlusIcon,
  MonitorIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Editor, Element, Frame, useEditor } from "@/lib/craftjs"
import {
  addScreen,
  setComponentBeforeAvatar,
  setCurrentScreenName,
  setEditorLoad,
  setFirstScreenName,
  setScrollY,
  setSelectedComponent,
  setSelectedScreen,
  setValidateScreen,
  setEditorSelectedComponent,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { setMobileScreen } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { cn } from "@/lib/utils"
// import { ProgressBar } from "../progress-bar.component"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import emptyScreenData from "@/components/user/screens/empty-screen.json"
import ScreensList from "@/components/user/screens/screens-list.component-with-flowId"
import { SettingsPanel } from "@/components/user/settings/user-settings.components"
import { UserToolbox } from "@/components/user/settings/user-toolbox.component"
import { UserText } from "@/components/user/text/user-text.component"

import { Input } from "../ui/input"
import { Progress } from "../ui/progress-custom"
import { ScrollArea } from "../ui/scroll-area"
import { AvatarComponent } from "../user/avatar-new/user-avatar.component"
import { BackButton } from "../user/backButton/back-component"
import { Button as UserButton } from "../user/button/user-button.component"
import { Card, CardContent } from "../user/card/user-card.component"
import { Checklist } from "../user/checklist/user-checklist.component"
import {
  Container,
  UserContainer,
} from "../user/container/user-container.component"
import { Form, FormContent } from "../user/form/user-form.component"
import { HeadlineText } from "../user/headline-text/headline-text.component"
import { IconButton } from "../user/icon-button/user-icon-button.component"
import { ImageComponent } from "../user/image-new/user-image.component"
import { Img } from "../user/image/user-image-component"
import { UserInputCheckbox } from "../user/input-checkbox/user-input-checkbox.component"
import { UserInputMail } from "../user/input-email/user-input-mail.component"
import { UserInputPhone } from "../user/input-phone/user-input-phone.component"
import { UserInputTextarea } from "../user/input-textarea/user-input-textarea.component"
import { UserInput } from "../user/input/user-input.component"
import { LayoutContainer } from "../user/layout-container/layout-container.component"
import { LineSelector } from "../user/lineSeperator/line-seperator-component"
import { LinkButton } from "../user/link/link-component"
import { List } from "../user/list/user-list.component"
import { LoaderComponent } from "../user/loader-new/user-loader.component"
import { Loader } from "../user/loader/user-loader.component"
import { LogoBar } from "../user/logo-bar/user-logo-bar.component"
import { LogoComponent } from "../user/logo-new/user-logo.component"
import { Logo } from "../user/logo/user-logo.component"
import { MultipleChoice } from "../user/multiple-choice/user-multiple-choice.component"
import { PictureChoice } from "../user/picture-choice/user-picture-choice.component"
import { ProgressBar } from "../user/progress/user-progress.component"
import { DragDrop } from "../user/screens/drag-drop-screens.component"
import { ButtonChoiceScreen } from "../user/screens/screen-button-choice.component"
import { ScreenFooter } from "../user/screens/screen-footer.component"
import { ScreenHeader } from "../user/screens/screen-header.component"
import { ScreenOneChoice } from "../user/screens/screen-one-choice.component"
import { ScreenOneInput } from "../user/screens/screen-one-input.component"
import { Select } from "../user/select/user-select.component"
import { Controller } from "../user/settings/controller.component"
import { RenderNode } from "../user/settings/render-node"
import ResolvedComponentsFromCraftState from "../user/settings/resolved-components"
import { SocialShareButton } from "../user/socialShareButton/share-component"
import { Steps } from "../user/steps/user-steps.component"
import { TelegramShareButton } from "../user/telegramShareButton/telegram-component"
import { TextImageComponent } from "../user/textImage/user-textImage.component"

enum VIEWS {
  MOBILE = "mobile",
  DESKTOP = "desktop",
}
const SaveButton = () => {
  const {
    query,
    query: { node },
  } = useEditor()
  const headerId = useAppSelector((state) => state?.screen?.headerId)
  //screen header id is: HeT6HrWBxJ
  const nodeTree = node(headerId || "").toNodeTree()
  nodeTree.nodes = NodesToSerializedNodes(nodeTree.nodes)
  console.log("NODE TREE IS: ", JSON.stringify(nodeTree))
  return (
    <a
      className="absolute left-3 top-3 z-10 bg-black p-3 text-white"
      onClick={() => console.log(query.serialize())}
    >
      Get JSON
    </a>
  )
}
const AddScreenButton = () => {
  const dispatch = useAppDispatch()
  const screens = useAppSelector((state: RootState) => state?.screen?.screens)
  const selectedScreenIndex = useAppSelector(
    (state) => state?.screen?.selectedScreen
  )
  const t = useTranslations("Components")

  const { actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    actions: state.events.selected,
  }))

  const handleAddScreen = useCallback(
    async (index: number) => {
      if (screens && screens[index]) {
        console.log(index)
        dispatch(addScreen(index))
        await actions.deserialize(JSON.stringify(emptyScreenData))
      } else {
        console.error("screens is undefined or index is out of bounds")
      }
    },
    [dispatch, screens]
  )

  return (
    <Button
      variant="outline"
      size="sm"
      className="font-poppins border border-inherit bg-white text-[#23262C]"
      onClick={() => handleAddScreen(selectedScreenIndex || 0)}
    >
      <PlusIcon className="mr-2 size-4" />
      {t("Add Screen")}
    </Button>
  )
}
const NodesToSerializedNodes = (nodes) => {
  // getSerializedNodes is present in the useEditor hook
  const {
    query: { getSerializedNodes },
  } = useEditor()
  const serializedNodes = getSerializedNodes()
  const result = {}
  Object.keys(nodes).forEach((key) => {
    result[key] = serializedNodes[key]
  })
  return result
}
type Position = "static" | "relative" | "absolute" | "sticky" | "absolute"

export function CreateFlowComponent({ flowId }) {
  // const t = useTranslations("Components")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const editorHeaderRef = React.useRef(null)
  const [height, setHeight] = React.useState(90)
  const [width, setWidth] = React.useState(0)
  const [view, setView] = React.useState<string>(VIEWS.DESKTOP)
  // const [topMargin, setTopMargin] = React.useState<number>(0)
  const dispatch = useAppDispatch()

  const backgroundImage = useAppSelector(
    (state) => state?.theme?.general?.backgroundImage
  )

  // const selectedComponent = useAppSelector(
  //   (state) => state?.screen?.selectedComponent
  // )
  const backgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )
  const selectedScreen =
    useAppSelector((state) => state?.screen?.selectedScreen) || 0
  const selectedScreenId = useAppSelector(
    (state) => state?.screen?.screens[selectedScreen]?.screenId || ""
  )
  // const startScreen = useAppSelector(
  //   (state) => state?.screen?.screens[0]?.screenData || ""
  // )
  const startScreenName = useAppSelector(
    (state) => state?.screen?.screens[0]?.screenName || ""
  )
  // const screenRoller = useAppSelector((state) => state?.screen?.screenRoller)
  // const avatarComponentId = useAppSelector(
  //   (state) => state.screen?.avatarComponentId
  // )
  // const previousAvatarComponentId = useAppSelector(
  //   (state) => state.screen?.previousAvatarComponentId
  // )
  const screensHeader = useAppSelector((state) => state?.screen?.screensHeader)
  const screensFooter = useAppSelector((state) => state?.screen?.screensFooter)
  const footerMode = useAppSelector((state) => state?.screen?.footerMode)
  const avatarBackgroundColor = useAppSelector(
    (state) => state?.screen?.avatarBackgroundColor
  )

  // const firstScreen = useAppSelector((state) => state.screen.screens[0])
  const editorLoad = useAppSelector((state) => state?.screen?.editorLoad || {})
  const headerMode = useAppSelector(
    (state: RootState) => state.screen?.headerMode
  )
  const headerPosition =
    useAppSelector((state) => state?.theme?.header?.headerPosition) ||
    "relative"
  // const firstScreenName =
  //   useAppSelector((state) => state?.screen?.firstScreenName) || ""
  // const editorLoadLength = useAppSelector(
  //   (state) => Object.keys(state?.screen?.editorLoad).length
  // )
  const mobileScreen = useAppSelector((state) => state?.theme?.mobileScreen)
  // const router = useRouter()
  // const screens = useAppSelector((state: RootState) => state?.screen?.screens)
  // const selectedScreenIndex = useAppSelector(
  //   (state) => state?.screen?.selectedScreen
  // )

  const debouncedSetEditorLoad = useCallback(
    debounce((json) => {
      // console.log("jsonnnnn", json)
      dispatch(setEditorLoad(JSON.stringify(json)))
    }, 300),
    [dispatch]
  )

  const debouncedSetSelectedComponent = useCallback(
    (json) => {
      dispatch(setEditorSelectedComponent(json))
    },
    [dispatch]
  )

  const selectedScreenIdex =
    useAppSelector((state) => state?.screen?.selectedScreen) || 0

  const checkComponentBeforeAvatar = () => {
    const parsedEditor = JSON.parse(screensHeader)
    const container = parsedEditor["ROOT"]
    if (!container) {
      return false
    }
    const avatarIndex = container.nodes.findIndex(
      (nodeId) => parsedEditor[nodeId].type.resolvedName === "AvatarComponent"
    )
    return avatarIndex > 0
  }

  useEffect(() => {
    dispatch(setMobileScreen(false))
    dispatch(
      setValidateScreen({
        screenId: selectedScreenId,
        screenValidated: false,
        screenToggleError: false,
      })
    )
    dispatch(setFirstScreenName(startScreenName))
    dispatch(setCurrentScreenName(startScreenName))
    return () => {
      dispatch(setMobileScreen(false))
    }
  }, [])

  useEffect(() => {
    const hasComponentBeforeAvatar = checkComponentBeforeAvatar()
    dispatch(setComponentBeforeAvatar(hasComponentBeforeAvatar))
  }, [editorLoad, dispatch])

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const scrollTop = event.currentTarget.scrollTop
    dispatch(setScrollY(scrollTop))
  }

  const onChangeView = (viewType: VIEWS) => {
    setView(viewType)
    dispatch(setMobileScreen(viewType === VIEWS.MOBILE))
  }

  useEffect(() => {
    if (headerMode) {
      const height =
        document?.getElementById("editor-content")?.offsetHeight || 0
      setHeight(height)
    } else {
      if (editorHeaderRef.current && editorHeaderRef) {
        //@ts-ignore
        setHeight(editorHeaderRef?.current?.offsetHeight)
      }
    }
  }, [headerMode, height])

  useEffect(() => {
    if (!headerMode) {
      const updateWidth = () => {
        const newWidth =
          document.getElementById("editor-content")?.offsetWidth || 0
        // console.log(NEW WIDTH IS:" ", newWidth)
        setWidth(newWidth)
      }

      // Initial width setting
      if (!mobileScreen) {
        updateWidth()
      }

      // Event listener for window resize
      window.addEventListener("resize", updateWidth)
      window.addEventListener("", updateWidth)
      return () => window.removeEventListener("resize", updateWidth)
    }
  }, [headerMode, height, mobileScreen, width])
  const updateMinHeightAndClassName = (data) => {
    console.log("updating editorload")
    data = JSON.parse(data)
    if (data.ROOT && data.ROOT.props) {
      // Check if the style object exists; if not, create it
      if (!data.ROOT.props.style) {
        data.ROOT.props.style = {} // Create the style object
      }
      data.ROOT.props.style.minHeight = "80vh" // Update to 80vh

      // Check for className and remove any class starting with "min-h-"
      if (data.ROOT.props.className) {
        data.ROOT.props.className = data.ROOT.props.className
          .split(" ") // Split into an array of class names
          .filter((className) => !className.startsWith("min-h-")) // Remove classes starting with "min-h-"
          .join(" ") // Join back into a string
      }
      console.log(" updated editorLoad", data)
      // Add the new class
      data.ROOT.props.className += ` !py-0 min-h-[80vh]` // Append the new class
      return data
    }
  }

  const revertMinHeightAndClassName = (data) => {
    console.log("reverting editorloadddd", data)
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
      data.ROOT.props.style.minHeight = "0vh" // Update to 80vh
      data.ROOT.props.style.height = "auto" // Update to 80vh

      // Check for className and remove any class starting with "min-h-"
      if (data.ROOT.props.className) {
        data.ROOT.props.className = data.ROOT.props.className
          .split(" ") // Split into an array of class names
          .filter((className) => !className.startsWith("min-h-")) // Remove classes starting with "min-h-"
          .join(" ") // Join back into a string
      }
      console.log(" reverted editorLoadasdasdasd", data)
      data.ROOT.props.className += ` h-[${
        document?.getElementById("editor-content")?.offsetHeight || 0
      }px]` // Append the new class
      return JSON.stringify(data)
    }
  }

  // Update the editorLoad object
  console.log("editorLoad", editorLoad)
  return (
    <div className="max-h-[calc(-60px+100vh)] w-full">
      <Editor
        // Save the updated JSON whenever the Nodes has been changed
        onNodesChange={(query) => {
          let json = query.getSerializedNodes()
          // dispatch(setEditorSelectedComponent(json))
          // dispatch(setEditorLoad(JSON.stringify(json)))
          debouncedSetSelectedComponent(json)
          debouncedSetEditorLoad(json)

          // }else{
          // console.log("RE-REnder NOT called")
          // return;
          // }
          // save to server
        }}
        resolver={{
          Controller,
          Logo,
          HeadlineText,
          Form,
          FormContent,
          UserText,
          UserButton,
          UserInputCheckbox,
          UserInputMail,
          UserInputPhone,
          ProgressBar,
          Element,
          Progress,
          ButtonChoiceScreen,
          ScreenHeader,
          UserInput,
          ScreenFooter,
          ScreensList,
          ScreenOneChoice,
          LineSelector,
          BackButton,
          LinkButton,
          SocialShareButton,
          TelegramShareButton,
          // UserProgressBar,
          ScreenOneInput,
          Input,
          Button,
          ArrowRight,
          Check,
          Cross,
          Facebook,
          Github,
          Globe,
          Linkedin,
          Container,
          Card,
          CardContent,
          UserContainer,
          IconButton,
          Select,
          DragDrop,
          UserToolbox,
          ImageComponent,
          LoaderComponent,
          LogoComponent,
          AvatarComponent,
          TextImageComponent,
          Image,
          PictureChoice,
          MultipleChoice,
          Steps,
          Checklist,
          List,
          LogoBar,
          LayoutContainer,
          Loader,
          UserInputTextarea,
          Img,
        }}
        onRender={RenderNode}
      >
        <div className="h-[calc(-52px+99vh)] max-h-[calc(-52px+99vh)]  flex-row justify-between gap-0 md:flex">
          <ScrollArea className="max-h-screen min-w-fit overflow-y-auto border-r px-[3vw]  md:px-5  ">
            <div className="section-body py-5">
              <ScreensList flowId={flowId} />
            </div>
          </ScrollArea>
          <ScrollArea
            ref={containerRef}
            id="scroll-container"
            className="hidden max-h-[calc(-52px+99vh)] basis-[55%] overflow-y-auto border-r md:block"
            onScroll={handleScroll}
          >
            {/* <div className="section-header mt-8 flex items-center justify-between"></div> */}
            <div
              className={`section-body ${
                (JSON.parse(screensHeader)?.ROOT?.nodes?.length > 0 &&
                  headerMode) ||
                (!headerMode &&
                  JSON.parse(screensHeader)?.ROOT?.nodes?.length === 0)
                  ? "mt-8"
                  : "mt-0"
              } w-full`}
            >
              <div
                style={{
                  backgroundColor: backgroundColor,
                  backgroundImage: backgroundImage,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className={cn(
                  "page-container z-20 mx-auto mt-0 box-content grid min-h-[calc(-64px+99vh)] grid-cols-1 grid-rows-[1fr_auto] py-0 font-sans antialiased",
                  footerMode ? "flex items-end justify-center" : "",
                  view == VIEWS.DESKTOP
                    ? "shahid w-full border-0"
                    : "w-96 border px-0"
                )}
              >
                {!headerMode &&
                  !footerMode &&
                  JSON.parse(screensHeader)?.ROOT?.nodes?.length > 0 && (
                    <div
                      ref={editorHeaderRef}
                      id="editor-header"
                      style={{
                        position: headerPosition as Position,
                        width: mobileScreen
                          ? "384px"
                          : headerPosition === "absolute"
                          ? width + "px"
                          : "100%",
                        top: "0",
                        zIndex: 20,
                        height: "auto",
                        backgroundColor:
                          avatarBackgroundColor !== "rgba(255,255,255,.1)"
                            ? avatarBackgroundColor
                            : backgroundColor,
                      }}
                    >
                      <ResolvedComponentsFromCraftState
                        screen={revertMinHeightAndClassName(screensHeader)}
                      />
                    </div>
                  )}
                {headerMode || footerMode ? (
                  <>
                    <div
                      id="editor-content"
                      style={{
                        paddingTop: !headerMode ? `30px` : "0px",
                        backgroundColor: headerMode
                          ? avatarBackgroundColor
                          : "",
                      }}
                    >
                      <Frame
                        data={updateMinHeightAndClassName(editorLoad)}
                      ></Frame>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      id="editor-content"
                      style={{
                        paddingTop:
                          !headerMode &&
                          headerPosition === "absolute" &&
                          JSON.parse(screensHeader)?.ROOT?.nodes?.length > 0
                            ? `${height}px`
                            : "0px",
                        backgroundColor: headerMode
                          ? avatarBackgroundColor
                          : "",
                      }}
                    >
                      <Frame data={editorLoad}></Frame>
                    </div>
                  </>
                )}

                {!headerMode && !footerMode && (
                  <ResolvedComponentsFromCraftState
                    screen={revertMinHeightAndClassName(screensFooter)}
                  />
                )}
              </div>
              <div className="w-100 absolute bottom-2 left-2 z-20 flex bg-transparent">
                <AddScreenButton />
                <div className="ml-2 flex rounded-md bg-[#EEEEEE] p-1">
                  <button
                    onClick={() => onChangeView(VIEWS.MOBILE)}
                    className={cn(
                      "px-3",
                      view === VIEWS.MOBILE ? "rounded bg-white" : ""
                    )}
                  >
                    <Smartphone className="size-4" />
                  </button>
                  <button
                    onClick={() => onChangeView(VIEWS.DESKTOP)}
                    className={cn(
                      "px-3",
                      view === VIEWS.DESKTOP ? "rounded bg-white" : ""
                    )}
                  >
                    <MonitorIcon className="size-4" />
                  </button>
                </div>
              </div>

              {/* {<SaveButton />} */}
            </div>
          </ScrollArea>
          <ScrollArea className="hidden  h-full max-h-[calc(-60px+99vh)] basis-[15%] overflow-y-auto border-r px-5 md:block">
            <div className="section-header flex items-center justify-between">
              <h4 className="text-base font-normal tracking-tight"></h4>
            </div>
            <div className="section-body py-6">
              <UserToolbox />
            </div>
          </ScrollArea>
          <ScrollArea className="hidden  h-full max-h-[calc(-60px+99vh)] basis-[17.5%] overflow-y-auto border-r bg-[#f6f6f6]  md:block">
            <div className="section-header flex items-center justify-between">
              <h4 className="text-base font-normal tracking-tight"></h4>
            </div>
            <div className="section-body overflow-y-auto bg-[#f6f6f6]">
              <SettingsPanel />
            </div>
          </ScrollArea>
        </div>
      </Editor>
    </div>
  )
}

CreateFlowComponent
