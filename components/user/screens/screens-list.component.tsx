"use client"

import React, { use } from "react"
import {
  Clipboard,
  ClipboardCopy,
  Delete,
  Edit,
  MousePointer,
  PlusCircle,
  Scissors,
  Trash2,
} from "lucide-react"

import { Editor, Element, Frame, useEditor } from "@/lib/craftjs"
import {
  addScreen,
  deleteScreen,
  duplicateScreen,
  reorderScreens,
  setSelectedScreen,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Separator } from "@/components/ui/separator"
import emptyScreenData from "@/components/user/screens/empty-screen.json"
import { ScreenFooter } from "@/components/user/screens/screen-footer.component"
import { ScreenHeader } from "@/components/user/screens/screen-header.component"

import { DragDrop } from "./drag-drop-screens.component"
import { ButtonChoiceScreen } from "./screen-button-choice.component"
import { ScreenOneChoice } from "./screen-one-choice.component"
import { ScreenOneInput } from "./screen-one-input.component"

const ScreensList = () => {
  const screens = useAppSelector((state) => state.screen.screens)
  const dispatch = useAppDispatch()
  const selectedScreen = useAppSelector(
    (state) => state.screen.screens[state.screen.selectedScreen]
  )
  const selectedScreenIndex = useAppSelector(
    (state) => state.screen.selectedScreen
  )
  const { actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
  }))

  React.useEffect(() => {
    if(screens.length >= 0) {
      actions.deserialize(selectedScreen || emptyScreenData)
    }
  }, [actions, selectedScreen,screens])

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full overflow-x-hidden"
      defaultValue="item-2"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="uppercase hover:no-underline">
          Header & Footer
        </AccordionTrigger>
        <AccordionContent className="w-full">
          <p className="text-sm text-muted-foreground">Header</p>
          <ScreenHeader scale={0.6} />
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">Footer</p>
          <ScreenFooter scale={0.6} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="uppercase hover:no-underline">
          Screens
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          <HelperInformation />
          {screens?.map((screen: any, index) => (
            <ContextMenu key={index}>
              <ContextMenuTrigger>
                {" "}
                <Card
                  key={index}
                  className={cn(
                    "flex h-28 w-full flex-col items-center justify-center border p-4 hover:cursor-pointer",
                    {
                      "border-blue-500": selectedScreenIndex === index,
                    }
                  )}
                  onClick={() => dispatch(setSelectedScreen(index))}
                >
                  <div className="text-sm text-muted-foreground">
                    {screen[screen?.ROOT?.nodes[0]]?.displayName ??
                      "New Screen"}
                  </div>
                </Card>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  className="flex flex-row items-center gap-2 text-inherit hover:cursor-pointer"
                  onClick={() => dispatch(addScreen(index))}
                >
                  <PlusCircle size={18} />
                  <span>Add screen</span>
                </ContextMenuItem>
                <ContextMenuItem className="flex flex-row items-center gap-2 text-inherit hover:cursor-pointer"
                  onClick={() => dispatch(duplicateScreen(index))}
                >
                  <ClipboardCopy size={18} />
                  <span>Duplicate</span>
                </ContextMenuItem>
                <ContextMenuItem className="flex flex-row items-center gap-2 text-inherit hover:cursor-pointer"
                  onClick={() => dispatch(deleteScreen(index))}
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function HelperInformation() {
  return (
    <Card
      className={cn(
        "flex w-full flex-col items-center justify-center border border-gray-500 px-2 py-3 hover:cursor-pointer"
      )}
    >
      <div className="flex flex-row items-start gap-1 text-left">
        <MousePointer />
        <div>
          <h2 className="mb-1 text-base font-semibold uppercase text-gray-950 dark:text-slate-50">
            Right-click
          </h2>
          <p className="text-sm font-light">Click on a screen to edit it</p>
        </div>
      </div>
    </Card>
  )
}

function DisplayEditor() {
  const screens = useAppSelector((state) => state.screen.screens)

  return (
    <>
      <div>
        {screens.map((item: any, index: any) => {
          console.log(item.libraryContent)
          const htmlContent = item.libraryContent.outerHTML
          return (
            <div className="my-2 border-solid border-black" key={index}>
              <div>
                <p>{item.libraryName}</p>
              </div>
              <ul
                style={{
                  transform: "scale(0.178922)",
                  maxWidth: "150px",
                  height: "100px",
                }}
              >
                <Frame data={htmlContent} />
                {/* {item.libraryContent} */}
              </ul>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default ScreensList
