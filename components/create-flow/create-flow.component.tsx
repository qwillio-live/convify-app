"use client"

import { clear } from "console"
import React, { useCallback } from "react"
import { useRouter } from "next/navigation"
import { debounce, throttle } from "lodash"
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
  PlusCircle,
  Smartphone,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Editor, Element, Frame, useEditor } from "@/lib/craftjs"
import {
  addScreen,
  setCurrentScreenName,
  setEditorLoad,
  setFirstScreenName,
  setSelectedComponent,
  setSelectedScreen,
  setValidateScreen,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { setMobileScreen } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { cn } from "@/lib/utils"
// import { ProgressBar } from "../progress-bar.component"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import emptyScreenData from "@/components/user/screens/empty-screen.json"
import ScreensList from "@/components/user/screens/screens-list.component"
import { SettingsPanel } from "@/components/user/settings/user-settings.components"
import { UserToolbox } from "@/components/user/settings/user-toolbox.component"
import { UserText } from "@/components/user/text/user-text.component"

import { Input } from "../ui/input"
import { Progress } from "../ui/progress-custom"
import { ScrollArea } from "../ui/scroll-area"
import { Button as UserButton } from "../user/button/user-button.component"
import { Card, CardContent } from "../user/card/user-card.component"
import { Checklist } from "../user/checklist/user-checklist.component"
import {
  Container,
  UserContainer,
} from "../user/container/user-container.component"
import { HeadlineText } from "../user/headline-text/headline-text.component"
import { IconButton } from "../user/icon-button/user-icon-button.component"
import { Img } from "../user/image/user-image-component"
import { UserInput } from "../user/input/user-input.component"
import { LayoutContainer } from "../user/layout-container/layout-container.component"
import { List } from "../user/list/user-list.component"
import { Loader } from "../user/loader/user-loader.component"
import { LogoBar } from "../user/logo-bar/user-logo-bar.component"
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
import { Steps } from "../user/steps/user-steps.component"
import { SliderBar } from "../user/slider/user-slider.component"

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
      className="bg-[#f4f4f5]"
      onClick={() => handleAddScreen(selectedScreenIndex || 0)}
    >
      <PlusCircle className="mr-2 size-4" />
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

export function CreateFlowComponent() {
  const t = useTranslations("Components")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const editorHeaderRef = React.useRef(null)
  const [height, setHeight] = React.useState(90)
  const [width, setWidth] = React.useState(0)
  const [view, setView] = React.useState<string>(VIEWS.DESKTOP)
  const [topMargin, setTopMargin] = React.useState<number>(0)
  const dispatch = useAppDispatch()

  const backgroundImage = useAppSelector(
    (state) => state?.theme?.general?.backgroundImage
  )

  const selectedComponent = useAppSelector(
    (state) => state?.screen?.selectedComponent
  )
  const backgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )
  const selectedScreen =
    useAppSelector((state) => state?.screen?.selectedScreen) || 0
  const selectedScreenId = useAppSelector(
    (state) => state?.screen?.screens[selectedScreen]?.screenId || ""
  )
  const startScreen = useAppSelector(
    (state) => state?.screen?.screens[0].screenData || ""
  )
  const startScreenName = useAppSelector(
    (state) => state?.screen?.screens[0].screenName || ""
  )
  const screenRoller = useAppSelector((state) => state?.screen?.screenRoller)
  const screensHeader = useAppSelector((state) => state?.screen?.screensHeader)
  const screensFooter = useAppSelector((state) => state?.screen?.screensFooter)
  const footerMode = useAppSelector((state) => state?.screen?.footerMode)

  // const firstScreen = useAppSelector((state) => state.screen.screens[0])
  const editorLoad = useAppSelector((state) => state?.screen?.editorLoad || {})
  const headerMode = useAppSelector(
    (state: RootState) => state.screen?.headerMode
  )
  const headerPosition =
    useAppSelector((state) => state?.theme?.header?.headerPosition) ||
    "relative"
  const firstScreenName =
    useAppSelector((state) => state?.screen?.firstScreenName) || ""
  const editorLoadLength = useAppSelector(
    (state) => Object.keys(state?.screen?.editorLoad).length
  )
  const mobileScreen = useAppSelector((state) => state?.theme?.mobileScreen)
  const router = useRouter()
  const screens = useAppSelector((state: RootState) => state?.screen?.screens)
  const selectedScreenIndex = useAppSelector(
    (state) => state?.screen?.selectedScreen
  )

  const debouncedSetEditorLoad = useCallback(
    debounce((json) => {
      dispatch(setEditorLoad(JSON.stringify(json)))
    }, 1200),
    [dispatch]
  )

  React.useEffect(() => {
    dispatch(
      setValidateScreen({
        screenId: selectedScreenId,
        screenValidated: false,
        screenToggleError: false,
      })
    )
    dispatch(setFirstScreenName(startScreenName))
    dispatch(setCurrentScreenName(startScreenName))
  }, [])
  React.useEffect(() => {
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
  React.useEffect(() => {
    const updateWidth = () => {
      const newWidth =
        document.getElementById("editor-content")?.offsetWidth || 0
      setWidth(newWidth)
    }

    // Initial width setting
    updateWidth()

    // Event listener for window resize
    window.addEventListener("resize", updateWidth)
    window.addEventListener("", updateWidth)

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", updateWidth)
  }, [headerMode, height])
  return (
    <div className="max-h-[calc(-60px+100vh)] w-full">
      <Editor
        // Save the updated JSON whenever the Nodes has been changed
        onNodesChange={(query) => {
          let json = query.getSerializedNodes()
          debouncedSetEditorLoad(json)
          // dispatch(setSelectedComponent("ROOT"))
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
          UserText,
          UserButton,
          ProgressBar,
          Element,
          Progress,
          ButtonChoiceScreen,
          ScreenHeader,
          UserInput,
          ScreenFooter,
          ScreensList,
          ScreenOneChoice,
          // UserProgressBar,
          Card,
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
          CardContent,
          UserContainer,
          IconButton,
          Select,
          DragDrop,
          UserToolbox,
          Image,
          PictureChoice,
          MultipleChoice,
          Steps,
          Checklist,
          List,
          LogoBar,
          LayoutContainer,
          Loader,
          Img,
          SliderBar
        }}
        onRender={RenderNode}
      >
        <div className="h-[calc(-52px+99vh)] max-h-[calc(-52px+99vh)] flex-row justify-between gap-0 md:flex">
          <ScrollArea className="max-h-screen overflow-y-auto border-r px-2 py-6 md:basis-[15%]">
            <div className="section-body p-5">
              <ScreensList />
            </div>
          </ScrollArea>
          <ScrollArea
            ref={containerRef}
            id="scroll-container"
            className="hidden max-h-[calc(-52px+99vh)] basis-[55%] overflow-y-auto border-r md:block"
          >
            {/* <div className="section-header mt-8 flex items-center justify-between"></div> */}
            <div className="section-body">
              <Tabs
                defaultValue={VIEWS.DESKTOP}
                className="w-full"
                onValueChange={(value) => {
                  setView(value)
                  dispatch(setMobileScreen(value === VIEWS.MOBILE))
                }}
              >
                <TabsContent
                  style={{
                    backgroundColor: backgroundColor,
                    backgroundImage: backgroundImage,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className={cn(
                    "page-container z-20 mx-auto box-content min-h-[400px] font-sans antialiased",
                    footerMode ? "flex items-end justify-center" : "",
                    view == VIEWS.DESKTOP
                      ? "shahid w-full border-0"
                      : "w-96 border px-0"
                  )}
                  value={view}
                >
                  {!headerMode && !footerMode && (
                    <div
                      ref={editorHeaderRef}
                      id="editor-header"
                      style={{
                        position: headerPosition as Position,
                        width: mobileScreen
                          ? "384px"
                          : headerPosition === "absolute" && !mobileScreen
                            ? width + "px"
                            : "100%",
                        top:
                          headerPosition === "absolute" && !headerMode
                            ? "32px"
                            : "0",
                        // top: headerPosition === 'absolute' ? '66px' : '0',
                        // width: width,
                        zIndex: 20,
                        backgroundColor: backgroundColor,
                      }}
                    >
                      <ResolvedComponentsFromCraftState
                        screen={screensHeader}
                      />
                    </div>
                  )}
                  <div
                    id="editor-content"
                    style={{
                      backgroundColor: backgroundColor,
                      paddingTop:
                        !headerMode && headerPosition === "absolute"
                          ? `${height + 40}px`
                          : "40px",
                      // marginTop: !headerMode && headerPosition === 'absolute' ? `${height+46}px` : "0",
                    }}
                  >
                    <Frame data={editorLoad}></Frame>
                  </div>
                  {!headerMode && !footerMode && (
                    <ResolvedComponentsFromCraftState screen={screensFooter} />
                  )}
                </TabsContent>
                <TabsList className="w-100 absolute bottom-0  z-20 ">
                  <AddScreenButton />
                  <TabsTrigger value={VIEWS.MOBILE} className="mx-1">
                    <Smartphone className="size-5" />
                  </TabsTrigger>
                  <TabsTrigger value={VIEWS.DESKTOP}>
                    <Laptop className="size-5" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* {<SaveButton />} */}
            </div>
          </ScrollArea>
          <ScrollArea className="hidden  h-full max-h-[calc(-60px+99vh)] basis-[15%] overflow-y-auto border-r px-2 py-6 md:block">
            <div className="section-header flex items-center justify-between">
              <h4 className="text-base font-normal tracking-tight"></h4>
            </div>
            <div className="section-body py-6">
              <UserToolbox />
            </div>
          </ScrollArea>
          <ScrollArea className="hidden  h-full max-h-[calc(-60px+99vh)] basis-[15%] overflow-y-auto border-r bg-[#fafafa] py-6 md:block">
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
