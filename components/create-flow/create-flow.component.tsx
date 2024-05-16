"use client"
import React from "react"
import {
  ArrowRight,
  Check,
  Cross,
  Facebook,
  Github,
  Globe,
  Linkedin,
  Plus,
  PlusCircle,
  Image,
} from "lucide-react"

import { Editor, Element, Frame, useEditor } from "@/lib/craftjs"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScreensList from "@/components/user/screens/screens-list.component"
import { SettingsPanel } from "@/components/user/settings/user-settings.components"
import { UserToolbox } from "@/components/user/settings/user-toolbox.component"
import { UserText } from "@/components/user/text/user-text.component"

// import { ProgressBar } from "../progress-bar.component"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { Button as UserButton } from "../user/button/user-button.component"
import {ProgressBar} from "../user/progress/user-progress.component"
import { Progress } from "../ui/progress-custom"
import { Card, CardTop } from "../user/card/user-card.component"
import {
  Container,
  ContainerDefaultProps,
  UserContainer,
} from "../user/container/user-container.component"
import { IconButton } from "../user/icon-button/user-icon-button.component"
import { DragDrop } from "../user/screens/drag-drop-screens.component"
import { ButtonChoiceScreen } from "../user/screens/screen-button-choice.component"
import { ScreenFooter } from "../user/screens/screen-footer.component"
import { ScreenHeader } from "../user/screens/screen-header.component"
import { ScreenOneChoice } from "../user/screens/screen-one-choice.component"
import { ScreenOneInput } from "../user/screens/screen-one-input.component"
import { addScreen, resetScreensState, setEditorLoad } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { RenderNode } from "../user/settings/render-node"
import { Logo } from "../user/logo/user-logo.component"
import { LogoBar,LogoBarItem } from "../user/logo-bar/logo-bar.component"
import { PictureChoice } from "../user/picture-choice/picture-choice.component"
import { MultipleChoice } from "../user/multiple-choice/user-multiple-choice.component"
import { HeadlineText } from "../user/headline-text/headline-text.component"
import { UserInput } from "../user/input/user-input.component"
import { Controller } from "../user/settings/controller.component"
import { setScreenHeader } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import screensFooterData from "@/components/user/screens/screen-footer.json"

enum VIEWS {
  MOBILE = "mobile",
  DESKTOP = "desktop",
}
// const SaveButton =() => {
//   const { query,query: {node} } = useEditor();
//   const headerId= useAppSelector((state) => state.screen.headerId)
//   //screen header id is: HeT6HrWBxJ
//   const nodeTree = node(headerId).toNodeTree()
//   nodeTree.nodes = NodesToSerializedNodes(nodeTree.nodes)
//   console.log("NODE TREE IS: ",nodeTree)
//   return (
//     <a
//       className="fixed left-3 top-3 z-10 bg-black p-3 text-white"
//       onClick={() => console.log(query.serialize())}
//     >
//       Get JSON
//     </a>
//   )
// }
const NodesToSerializedNodes = (nodes) =>  {
  // getSerializedNodes is present in the useEditor hook
  const {query: {getSerializedNodes}} = useEditor();
  const serializedNodes = getSerializedNodes()
const result = {}
Object.keys(nodes).forEach(key => {
result[key] = serializedNodes[key]
})
return result
}
export function CreateFlowComponent() {
  const [view, setView] = React.useState<string>(VIEWS.DESKTOP)
  const dispatch = useAppDispatch();

  const selectedScreen = useAppSelector((state) => state.screen.selectedScreen);

  const firstScreen = useAppSelector((state) => state.screen.screens[0])

  const headerMode = useAppSelector((state) => state.screen.headerMode)

  React.useEffect(() => {
    dispatch(resetScreensState())
  },[dispatch])

  return (
    <div className="max-h-[calc(-60px+100vh)] w-full">
      <Editor
        onNodesChange={(nodes) => {
          const newNodes = nodes.getSerializedNodes();
          dispatch(setEditorLoad(newNodes))
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
          CardTop,
          UserContainer,
          IconButton,
          DragDrop,
          UserToolbox,
          Image,
          PictureChoice,
          MultipleChoice,
          LogoBar,
          LogoBarItem,

        }}
        onRender={RenderNode}
      >
        <div className="flex h-full min-h-screen flex-row justify-between gap-0">
          <ScrollArea className="max-h-screen basis-[15%] overflow-y-auto border-r px-2 py-4 pl-0">
            <div className="section-header flex items-center justify-end">
              <Button variant={"secondary"} className="" onClick={() => dispatch(addScreen(selectedScreen))}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Screen
              </Button>
            </div>
            <div className="section-body">
              <ScreensList />
            </div>
          </ScrollArea>
          <ScrollArea className="max-h-[calc(-60px+99vh)] basis-[55%] overflow-y-auto border-r px-2 py-4 ">
            <div className="mt-8 section-header flex items-center justify-between"></div>
            <div className="section-body">
              <Tabs
                defaultValue={VIEWS.DESKTOP}
                className="w-full"
                onValueChange={(value) => setView(value)}
              >
                <TabsContent
                  className={cn(
                    "mx-auto page-container min-h-[400px] box-content bg-background font-sans antialiased z-20",
                    view == VIEWS.DESKTOP
                      ? "w-full border-0"
                      : "w-96 border px-4"
                  )}
                  value={view}
                >
                  <Frame
                  data={firstScreen}
                  >
                  </Frame>
                </TabsContent>
                <TabsList className="fixed bottom-2 left-[37%] grid w-40 grid-cols-2 z-20">
                  <TabsTrigger value={VIEWS.MOBILE}>Mobile</TabsTrigger>
                  <TabsTrigger value={VIEWS.DESKTOP}>Desktop</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* {<SaveButton />} */}

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
    </div>
  )
}

CreateFlowComponent
