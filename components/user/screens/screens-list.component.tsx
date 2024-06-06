"use client"

import React, { use, useCallback, useEffect } from "react"
import { AnimatePresence, Reorder } from "framer-motion"
import {
  Clipboard,
  ClipboardCopy,
  Delete,
  Edit,
  MousePointer,
  Pencil,
  PlusCircle,
  Save,
  Scissors,
  Trash2,
} from "lucide-react"
import lz from "lzutf8"

import { Editor, Element, Frame, useEditor } from "@/lib/craftjs"
import {
  addScreen,
  deleteScreen,
  duplicateScreen,
  reorderScreens,
  setEditorLoad,
  setFooterMode,
  setHeaderFooterMode,
  setHeaderMode,
  setScreenFooter,
  setScreenHeader,
  setScreenName,
  setScreens,
  setSelectedScreen,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import emptyScreenData from "@/components/user/screens/empty-screen.json"
import { ScreenFooter } from "@/components/user/screens/screen-footer.component"
import { ScreenHeader } from "@/components/user/screens/screen-header.component"

import ResolvedComponentsFromCraftState from "../settings/resolved-components"
import { DragDrop } from "./drag-drop-screens.component"
import { ButtonChoiceScreen } from "./screen-button-choice.component"
import { ScreenListItem } from "./screen-list-item.component"
import { ScreenOneChoice } from "./screen-one-choice.component"
import { ScreenOneInput } from "./screen-one-input.component"
import { Input } from "@/components/input-custom"
import ContentEditable from "react-contenteditable"

const ScreensList = () => {
  const screens = useAppSelector((state: RootState) => state?.screen?.screens)
  const dispatch = useAppDispatch()
  const selectedScreen = useAppSelector(
    (state) => state?.screen?.screens[state?.screen?.selectedScreen]
  )
  const screensHeader = useAppSelector((state) => state?.screen?.screensHeader)
  const screensFooter = useAppSelector((state) => state?.screen?.screensFooter)
  const headerMode = useAppSelector((state) => state?.screen?.headerMode)
  const footerMode = useAppSelector((state) => state?.screen?.footerMode)

  const backgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )

  const selectedScreenIndex = useAppSelector(
    (state) => state?.screen?.selectedScreen
  )
  const editorLoad = useAppSelector((state) => state?.screen?.editorLoad)
  const headerFooterMode = useAppSelector(
    (state) => state?.screen?.headerMode || state?.screen?.footerMode
  )
  const { actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
  }))

  const themeSettings = useAppSelector((state: RootState) => state.theme)
  // const [compareLoad,setCompareLoad] = React.useState<any>(lz.encodeBase64(lz.compress(JSON.stringify(editorLoad))));

  // React.useEffect(() => {
  // if (lz.encodeBase64(lz.compress(JSON.stringify(editorLoad))) !== compareLoad) {
  //   console.log("EDITOR LOAD CALLED AGAIN", compareLoad)
  // console.log("DESERIALIZE CALLED: ")

  // actions.deserialize(editorLoad.screenData);
  // setCompareLoad(lz.encodeBase64(lz.compress(JSON.stringify(editorLoad))));
  // }
  // }, []);

  const handleReorder = (data) => {
    dispatch(setScreens(data))
  }

  // useEffect(() => {
  //   if (selectedScreenIndex !== undefined && screens && selectedScreenIndex >= 0 && selectedScreenIndex < screens.length) {
  //     actions.deserialize(screens[selectedScreenIndex]);
  //   } else {
  //     console.error('selectedScreenIndex or screens is undefined, or selectedScreenIndex is out of bounds');
  //   }
  // }, [selectedScreenIndex, screens]);

  const handleScreenClick = useCallback(
    async (index: number) => {
      if (screens && screens[index] && screens[index].screenData) {
        dispatch(setSelectedScreen(index))
        await actions.deserialize(screens[index].screenData || {})
      } else {
        console.error(
          "screens is undefined, index is out of bounds, or screenData is undefined"
        )
      }
    },
    [dispatch, screens]
  )

  const handleAddScreen = useCallback(
    async (index: number) => {
      if (screens && screens[index]) {
        dispatch(addScreen(index))
        await actions.deserialize(JSON.stringify(emptyScreenData))
      } else {
        console.error("screens is undefined or index is out of bounds")
      }
    },
    [dispatch, screens]
  )

  const handleDuplicateScreen = useCallback(
    async (index: number) => {
      if (screens) {
        dispatch(duplicateScreen(index))
        await actions.deserialize(editorLoad)
      }
    },
    [dispatch, screens]
  )

  const handleDeleteScreen = useCallback(
    async (index: number) => {
      if (screens && selectedScreenIndex !== undefined) {
        dispatch(deleteScreen(index))
        if (index === 0) {
          await actions.deserialize(screens[1].screenData)
        } else {
          await actions.deserialize(screens[index - 1].screenData)
        }
      }
    },
    [dispatch, screens]
  )

  const handleFooterScreenClick = () => {
    // dispatch(setHeaderFooterMode(false));
    dispatch(setFooterMode(true))
    actions.deserialize(screensFooter)
  }

  const handleHeaderScreenClick = () => {
    // dispatch(setHeaderFooterMode(false));
    dispatch(setHeaderMode(true))
    actions.deserialize(screensHeader)
  }

  return (
    <Accordion
      type="multiple"
      className="w-full overflow-x-hidden"
      defaultValue={["item-2"]}
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
            onClick={() => handleHeaderScreenClick()}
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
            onClick={() => handleFooterScreenClick()}
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
          onClick={() => dispatch(setHeaderFooterMode(false))}
        >
          Screens
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          <HelperInformation />
          <div className="section-header flex items-center justify-end">
            <Button
              variant={"secondary"}
              className=""
              onClick={() => handleAddScreen(selectedScreenIndex || 0)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Screen
            </Button>
          </div>
          {/* <ScrollArea className="max-h-[calc(60vh)] overflow-y-auto"> */}
          <Reorder.Group
            axis="y"
            onReorder={handleReorder}
            values={screens || []}
            // style={{ overflowY: "scroll", maxHeight: "calc(100vh - 500px)"}}
            // style={{ height: 600, border: "1px solid black", overflowY: "auto" }}
            // layoutScroll
          >
            {screens?.map((screen: any, index) => (
              // <ScreenListItem
              // key={screen?.screenName}
              // handleAddScreen={handleAddScreen}
              // handleDeleteScreen={handleDeleteScreen}
              // handleDuplicateScreen={handleDuplicateScreen}
              // handleScreenClick={handleScreenClick}
              // index={index}
              // screen={screen}
              // />
              <Reorder.Item
                key={screen?.screenName}
                id={screen?.screenName}
                value={screen}
                className="relative"
              >
                <ContextMenu>
                  <ContextMenuTrigger>
                    {" "}
                    <div className="mt-4 flex flex-row items-center justify-between px-2 gap-4">
                      <span>{index + 1}</span>
                      <EditScreenName screenId={screen.screenId} screenName={screen.screenName} />
                    </div>
                    <Card
                      style={{ backgroundColor: backgroundColor }}
                      className={cn(
                        "h-60 w-[14vw] mt-2 flex flex-col items-center justify-center border hover:cursor-pointer relative overflow-hidden",
                        {
                          "border-blue-500": selectedScreenIndex === index,
                        }
                      )}
                      onClick={() => handleScreenClick(index)}
                    >
                      <div className="text-xs text-muted-foreground scale-[.20] relative">
                        <div className="absolute w-full h-full z-10 bg-transparent top-0 left-0"></div>
                        <ResolvedComponentsFromCraftState
                          screen={screen.screenData ? screen.screenData : {}}
                        />
                      </div>
                    </Card>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      className="flex flex-row items-center gap-2 text-inherit hover:cursor-pointer"
                      onClick={() => handleAddScreen(index)}
                    >
                      <PlusCircle size={18} />
                      <span>Add screen</span>
                    </ContextMenuItem>
                    <ContextMenuItem
                      className="flex flex-row items-center gap-2 text-inherit hover:cursor-pointer"
                      onClick={() => handleDuplicateScreen(index)}
                    >
                      <ClipboardCopy size={18} />
                      <span>Duplicate</span>
                    </ContextMenuItem>
                    <ContextMenuItem
                      className="flex flex-row items-center gap-2 text-inherit hover:cursor-pointer"
                      onClick={() => handleDeleteScreen(index)}
                    >
                      <Trash2 size={18} />
                      <span>Delete</span>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          {/* </ScrollArea> */}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const EditScreenName = ({ screenId,screenName }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(screenName);
  const handleChange = (e) => {
    dispatch(setScreenName({ screenId: screenId, screenName: e }));
    // setName(e.target.value);
  };

  return (
    <>
    {
      !editing && (
        <div
        onClick={() => setEditing(true)}
        className="flex flex-row gap-2 items-center  border border-transparent text-current bg-slate-gray-200 p-2 grow justify-end hover:cursor-text">
        <Pencil size={16} className="shrink-0" />
        <div className="h-10 p-2">{screenName}</div>
      </div>
      )
    }
    {
      editing && (
        <div className="flex flex-row gap-2 items-center text-current bg-slate-gray-200 p-2 grow justify-end">
          <Input
            className="text-right"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {handleChange(name); setEditing(false);}}
            autoFocus
          />
        </div>
      )

    }
    </>
  );
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
  const screens = useAppSelector((state) => state?.screen?.screens)

  return (
    <>
      <div>
        {screens?.map((item: any, index: any) => {
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
