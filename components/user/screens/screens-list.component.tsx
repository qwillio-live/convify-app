"use client"

import React, { use } from "react"
import { AnimatePresence, Reorder } from "framer-motion"
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
  setHeaderMode,
  setFooterMode,
  setScreens,
  setSelectedScreen,
  setHeaderFooterMode,
  setEditorLoad,
  setScreenHeader,
  setScreenFooter,
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

import ResolvedComponentsFromCraftState from "../settings/resolved-components"
import { DragDrop } from "./drag-drop-screens.component"
import { ButtonChoiceScreen } from "./screen-button-choice.component"
import { ScreenOneChoice } from "./screen-one-choice.component"
import { ScreenOneInput } from "./screen-one-input.component"

const ScreensList = () => {
  const screenNames = ["Button Choice", "One Choice", "One Input"]
  const screens = useAppSelector((state) => state.screen.screens)
  const dispatch = useAppDispatch()
  const selectedScreen = useAppSelector(
    (state) => state.screen.screens[state.screen.selectedScreen]
  )
  const screensHeader = useAppSelector((state) => state.screen.screensHeader)
  const screensFooter = useAppSelector((state) => state.screen.screensFooter)
  const headerMode = useAppSelector((state) => state.screen.headerMode)
  const footerMode = useAppSelector((state) => state.screen.footerMode)

  const selectedScreenIndex = useAppSelector(
    (state) => state.screen.selectedScreen
  )
  const editorLoad = useAppSelector((state) => state.screen.editorLoad)
 const headerFooterMode = useAppSelector((state) => state.screen.headerMode || state.screen.footerMode);
  const { actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
  }))
  React.useEffect(() => {
    dispatch(setHeaderFooterMode(false));
  }, [dispatch]);

  React.useEffect(() => {
      if(editorLoad){
        console.log("EDITOR LOAD CALLED AGAIN")
        actions.deserialize(editorLoad);
      }
  }, [actions, editorLoad]);

  const handleReorder = (data) => {
    dispatch(setScreens(data));
  };

  const handleScreenClick = (index: number) => {
    dispatch(setHeaderFooterMode(false));
    dispatch(setSelectedScreen(index));
    dispatch(setEditorLoad(screens[index]));
  };

  const handleFooterScreenClick = () => {
    dispatch(setHeaderFooterMode(false));
    dispatch(setFooterMode(true));
    dispatch(setEditorLoad(screensFooter));
  };

  const handleHeaderScreenClick = () => {
    dispatch(setHeaderFooterMode(false));
    dispatch(setHeaderMode(true));
    dispatch(setEditorLoad(screensHeader));
  };

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
          <div className="mt-4">Header</div>

          <Card
            className={cn(
              "flex h-60 w-[14vw] mt-2 flex-col items-center justify-center border p-4 hover:cursor-pointer",
              {
                "border-blue-500": headerMode,
              }
            )}
            onClick={handleHeaderScreenClick}
          >
            <div className="text-xs text-muted-foreground scale-[.25] relative">
              <div className="absolute w-full h-full z-10 bg-transparent top-0 left-0"></div>
              <ResolvedComponentsFromCraftState screen={screensHeader} />
            </div>
          </Card>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">Footer</p>

          <Card
            className={cn(
              "flex h-60 w-[14vw] mt-2 flex-col items-center justify-center border p-4 hover:cursor-pointer",
              {
                "border-blue-500": footerMode,
              }
            )}
            onClick={handleFooterScreenClick}
          >
            <div className="text-xs text-muted-foreground scale-[.25] relative">
              <div className="absolute w-full h-full z-10 bg-transparent top-0 left-0"></div>
              <ResolvedComponentsFromCraftState screen={screensFooter} />
            </div>
          </Card>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger
          className="uppercase hover:no-underline"
        >
          Screens
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          <HelperInformation />

          <Reorder.Group values={screens} onReorder={handleReorder}>
            {screens?.map((screen: any, index) => (
              <Reorder.Item
                key={screen?.ROOT?.nodes[0]}
                id={screen?.ROOT?.nodes[0]}
                value={screen}
                className="relative"
              >
                <ContextMenu>
                  <ContextMenuTrigger>
                    {" "}
                    <div className="mt-4">
                      {screen?.ROOT?.displayName ?? "New Screen"}
                    </div>
                    <Card
                      className={cn(
                        "h-60 w-[14vw] mt-2 flex flex-col items-center justify-center border hover:cursor-pointer relative overflow-hidden",
                        {
                          "border-blue-500": (selectedScreenIndex === index) && !headerFooterMode,
                        }
                      )}
                      onClick={() => handleScreenClick(index)}
                    >
                      <div className="text-xs text-muted-foreground scale-[.20] relative">
                        <div className="absolute w-full h-full z-10 bg-transparent top-0 left-0"></div>
                        <ResolvedComponentsFromCraftState screen={screen} />
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
                    <ContextMenuItem
                      className="flex flex-row items-center gap-2 text-inherit hover:cursor-pointer"
                      onClick={() => dispatch(duplicateScreen(index))}
                    >
                      <ClipboardCopy size={18} />
                      <span>Duplicate</span>
                    </ContextMenuItem>
                    <ContextMenuItem
                      className="flex flex-row items-center gap-2 text-inherit hover:cursor-pointer"
                      onClick={() => dispatch(deleteScreen(index))}
                    >
                      <Trash2 size={18} />
                      <span>Delete</span>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </Reorder.Item>
            ))}
          </Reorder.Group>
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
