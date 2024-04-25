import React from "react"
import { Editor, Element, Frame, useEditor } from "@craftjs/core"
import {
  ArrowRight,
  Check,
  Cross,
  Facebook,
  Github,
  Globe,
  Linkedin,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import ScreensList from "@/components/user/screens/screens-list.component"
import { SettingsPanel } from "@/components/user/settings/user-settings.components"
import { UserToolbox } from "@/components/user/settings/user-toolbox.component"
import { UserText } from "@/components/user/user-text.component"

import { ProgressBar } from "../progress-bar.component"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { Button as UserButton } from "../user/button/user-button.component"
import { Card, CardTop } from "../user/card/user-card.component"
import {
  Container,
  UserContainer,
} from "../user/container/user-container.component"
import { IconButton } from "../user/icon-button/user-icon-button.component"
import { ButtonChoiceScreen } from "../user/screens/screen-button-choice.component"
import { ScreenFooter } from "../user/screens/screen-footer.component"
import { ScreenHeader } from "../user/screens/screen-header.component"
import { ScreenOneChoice } from "../user/screens/screen-one-choice.component"
import { ScreenOneInput } from "../user/screens/screen-one-input.component"

const SaveButton = () => {
  const { query } = useEditor();
  return <a className="fixed left-3 top-3 z-10 bg-black p-3 text-white" onClick={() => console.log(query.serialize()) }>Get JSON</a>
}
export function CreateFlowComponent() {

  return (
    <div className="min-h-screen w-full">
      <Editor
        resolver={{
          UserText,
          UserButton,
          ButtonChoiceScreen,
          ScreenHeader,
          ScreenFooter,
          ScreensList,
          ScreenOneChoice,
          ProgressBar,
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
          // ScreenFrames,
        }}
      >
        <div className="flex h-full min-h-screen flex-row justify-between gap-0">
          <ScrollArea className="max-h-screen basis-[15%] overflow-y-auto border-r px-2 py-4 pl-0">
            <div className="section-header flex items-center justify-between">
              <h4 className="text-base font-normal tracking-tight">Content</h4>
              <Button size="icon" className="h-6 w-6">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="section-body">
              <ScreensList />
              {/* <ScreenFrames /> */}
            </div>
          </ScrollArea>
          <ScrollArea className="max-h-screen basis-[55%] overflow-y-auto border-r px-2 py-4 ">
            <div className="section-header flex items-center justify-between"></div>
            <div className="section-body pt-8">
              <Frame>
                <Element
                  is={"div"}
                  padding={5}
                  background="#ad2121"
                  canvas
                  className="min-h-screen min-w-full"
                >
                </Element>
              </Frame>
              <SaveButton />
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
          <ScrollArea className="max-h-screen basis-[15%] overflow-y-auto border-r px-2 py-4 pr-4 lg:pr-6">
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
