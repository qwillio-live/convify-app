"use client"

import {
  ArrowRight,
  Check,
  Cross,
  Facebook,
  Github,
  Globe,
  Image,
  Linkedin,
} from "lucide-react"
import React from "react"

import { Editor, Element, Frame, useEditor } from "@/lib/craftjs"
import { setEditorLoad } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { setMobileScreen } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
// import { ProgressBar } from "../progress-bar.component"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScreensList from "@/components/user/screens/screens-list.component"
import { SettingsPanel } from "@/components/user/settings/user-settings.components"
import { UserToolbox } from "@/components/user/settings/user-toolbox.component"
import { UserText } from "@/components/user/text/user-text.component"

import { Input } from "../ui/input"
import { Progress } from "../ui/progress-custom"
import { ScrollArea } from "../ui/scroll-area"
import { Button as UserButton } from "../user/button/user-button.component"
import { Card, CardContent } from "../user/card/user-card.component"
import {
  Container,
  UserContainer,
} from "../user/container/user-container.component"
import { HeadlineText } from "../user/headline-text/headline-text.component"
import { IconButton } from "../user/icon-button/user-icon-button.component"
import { Img } from "../user/image/user-image-component"
import { UserInput } from "../user/input/user-input.component"
import { LayoutContainer } from "../user/layout-container/layout-container.component"
import { List, ListItem } from "../user/list/list.component"
import { Loader } from "../user/loader/user-loader.component"
import { LogoBar, LogoBarItem } from "../user/logo-bar/logo-bar.component"
import { Logo } from "../user/logo/user-logo.component"
import { MultipleChoice } from "../user/multiple-choice/user-multiple-choice.component"
import { PictureChoice } from "../user/picture-choice/picture-choice.component"
import { ProgressBar } from "../user/progress/user-progress.component"
import { DragDrop } from "../user/screens/drag-drop-screens.component"
import { ButtonChoiceScreen } from "../user/screens/screen-button-choice.component"
import { ScreenFooter } from "../user/screens/screen-footer.component"
import { ScreenHeader } from "../user/screens/screen-header.component"
import { ScreenOneChoice } from "../user/screens/screen-one-choice.component"
import { ScreenOneInput } from "../user/screens/screen-one-input.component"
import { Controller } from "../user/settings/controller.component"
import { RenderNode } from "../user/settings/render-node"

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
      className="fixed left-3 top-3 z-10 bg-black p-3 text-white"
      onClick={() => console.log(query.serialize())}
    >
      Get JSON
    </a>
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
export function CreateFlowComponent() {
  const [view, setView] = React.useState<string>(VIEWS.DESKTOP)
  const dispatch = useAppDispatch()

  const backgroundImage = useAppSelector(
    (state) => state?.theme?.general?.backgroundImage
  )

  const backgroundColor = useAppSelector((state) => state?.theme?.general?.backgroundColor)
  const selectedScreen = useAppSelector((state) => state?.screen?.selectedScreen);
  const startScreen = useAppSelector((state) => state?.screen?.screens[0].screenData || "")
  const screenRoller = useAppSelector((state) => state?.screen?.screenRoller)
  const screensHeader = useAppSelector((state) => state?.screen?.screensHeader)

  // const firstScreen = useAppSelector((state) => state.screen.screens[0])
  const editorLoad = useAppSelector((state) => state?.screen?.editorLoad || {})
  const headerMode = useAppSelector((state) => state?.screen?.headerMode)

  const editorLoadLength = useAppSelector(
    (state) => Object.keys(state?.screen?.editorLoad).length
  )

  // React.useEffect(() => {
  //   dispatch(resetScreensState())
  // },[dispatch])

  return (
    <div className="max-h-[calc(-60px+100vh)] w-full">
      <Editor
        // Save the updated JSON whenever the Nodes has been changed
        onNodesChange={(query) => {
          let json = query.getSerializedNodes()
          let jsonString = JSON.stringify(json)
          // let editorLoadLength = Object.keys(editorLoad).length;
          // if(jsonString !== editorLoad){
          console.log("RE-REnder called")
          dispatch(setEditorLoad(JSON.stringify(json)))
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
          DragDrop,
          UserToolbox,
          Image,
          PictureChoice,
          MultipleChoice,
          LogoBar,
          LogoBarItem,
          LayoutContainer,
          Loader,
          List,
          ListItem,
          Img,
        }}
        onRender={RenderNode}
      >
        <div className="flex h-full min-h-screen flex-row justify-between gap-0">
          <ScrollArea className="max-h-screen basis-[15%] overflow-y-auto border-r px-2 py-4 pl-0">
            <div className="section-body">
              <ScreensList />
            </div>
          </ScrollArea>
          <ScrollArea className="max-h-[calc(-60px+99vh)] basis-[55%] overflow-y-auto border-r px-2 py-4 ">
            <div className="section-header mt-8 flex items-center justify-between"></div>
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
                    view == VIEWS.DESKTOP
                      ? "shahid w-full border-0"
                      : "w-96 border px-4"
                  )}
                  value={view}
                >
                  <Frame data={editorLoad}></Frame>

                </TabsContent>
                <TabsList className="fixed bottom-2 left-[37%] z-20 grid w-40 grid-cols-2">
                  <TabsTrigger value={VIEWS.MOBILE}>Mobile</TabsTrigger>
                  <TabsTrigger value={VIEWS.DESKTOP}>Desktop</TabsTrigger>
                </TabsList>
              </Tabs>

              {<SaveButton />}
            </div>
          </ScrollArea>
          <ScrollArea className="max-h-screen basis-[15%] overflow-y-auto border-r px-2 py-4 ">
            <div className="section-header flex items-center justify-between">
              <h4 className="text-base font-normal tracking-tight"></h4>
            </div>
            <div className="section-body">
              <UserToolbox />
            </div>
          </ScrollArea>
          <ScrollArea className="max-h-screen basis-[15%] overflow-y-auto border-r px-2 py-4 pr-4">
            <div className="section-header flex items-center justify-between">
              <h4 className="text-base font-normal tracking-tight"></h4>
            </div>
            <div className="section-body overflow-y-auto">
              <SettingsPanel />
            </div>
          </ScrollArea>
        </div>
      </Editor>
      <Editor
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
                DragDrop,
                UserToolbox,
                Image,
                PictureChoice,
                MultipleChoice,
                LogoBar,
                LogoBarItem,
                LayoutContainer,
                Loader,
                List,
                ListItem,
              }}
              onRender={RenderNode}
      >
        <div className="special-editor">
        <Frame data={screenRoller}></Frame>
        </div>
      </Editor>
    </div>
  )
}

CreateFlowComponent
