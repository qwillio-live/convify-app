"use client"

import React, { useCallback, useEffect } from "react"
import Link from "next/link"
import { Reorder } from "framer-motion"
import {
  ClipboardCopy,
  Edit3Icon,
  MousePointer,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { Frame, useEditor } from "@/lib/craftjs"
import {
  addScreen,
  deleteScreen,
  duplicateScreen,
  setFooterMode,
  setHeaderFooterMode,
  setHeaderMode,
  setScreenName,
  setScreens,
  setSelectedComponent,
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
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/input-custom"
import emptyScreenData from "@/components/user/screens/empty-screen.json"

import ResolvedComponentsFromCraftState from "../settings/resolved-components"
import { useTranslations } from "next-intl"
import { HelperInformation } from "./screens-list.component-with-flowId"

const ScreensList = () => {
  const t = useTranslations("Components")
  const screens = useAppSelector((state: RootState) => state?.screen?.screens)
  const dispatch = useAppDispatch()
  const selectedScreen = useAppSelector(
    (state) => state?.screen?.screens[state?.screen?.selectedScreen]
  )
  const screensHeader = useAppSelector((state) => state?.screen?.screensHeader)
  const screensFooter = useAppSelector((state) => state?.screen?.screensFooter)
  const headerMode = useAppSelector((state) => state?.screen?.headerMode)
  const footerMode = useAppSelector((state) => state?.screen?.footerMode)

  const backgroundImage = useAppSelector(
    (state) => state?.theme?.general?.backgroundImage
  )
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
    actions: state.events.selected,
  }))

  const themeSettings = useAppSelector((state: RootState) => state.theme)
  // const [compareLoad,setCompareLoad] = React.useState<any>(lz.encodeBase64(lz.compress(JSON.stringify(editorLoad))));

  // React.useEffect(() => {
  // if (lz.encodeBase64(lz.compress(JSON.stringify(editorLoad))) !== compareLoad) {
  // //   console.log("EDITOR LOAD CALLED AGAIN", compareLoad)
  // console.log("DESERIALIZE CALLED: ")
  //   actions.deserialize(editorLoad);
  //   setCompareLoad(lz.encodeBase64(lz.compress(JSON.stringify(editorLoad))));
  // }
  // }, [editorLoad]);
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

  const handleHeaderScreenClick = async () => {
    // dispatch(setHeaderFooterMode(false));
    dispatch(setHeaderMode(true))
    await actions.deserialize(screensHeader)
  }

  return (
    <Accordion
      type="multiple"
      className="font-poppins small:w-[98vw] w-[94vw] overflow-x-hidden pb-32 pt-12 md:w-[13.5vw] md:pt-0"
      defaultValue={["item-2"]}
    >
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="pt-0 hover:no-underline">
          {t("Header & Footer")}
        </AccordionTrigger>
        <AccordionContent className="w-full ">
          <div className="mt-4">{t("Header")}</div>

          <Card
            style={{
              backgroundColor: backgroundColor,
              backgroundImage: backgroundImage,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className={cn(
              "relative mt-1 flex h-12 w-[13.5vw] flex-col items-center justify-center overflow-hidden border p-4 hover:cursor-pointer",
              {
                "border-blue-500": headerMode,
              }
            )}
            onClick={() => handleHeaderScreenClick()}
          >
            <div className="text-muted-foreground absolute bottom-[70%] top-0 h-auto w-[40vw] scale-[.30] text-xs">
              <ResolvedComponentsFromCraftState screen={screensHeader} />
            </div>
            <div className="absolute left-0 top-0 z-10 size-full bg-transparent"></div>
          </Card>
          <Separator className="my-4" />
          <p className="text-muted-foreground text-sm">{t("Footer")}</p>

          <Card
            style={{
              backgroundColor: backgroundColor,
              backgroundImage: backgroundImage,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className={cn(
              "relative mt-1 flex h-12 w-[13.5vw] flex-col items-center justify-center overflow-hidden border p-4 hover:cursor-pointer",
              {
                "border-blue-500": footerMode,
              }
            )}
            onClick={() => handleFooterScreenClick()}
          >
            <div className="absolute bottom-0 left-0 z-10 size-full bg-transparent"></div>
            <div className="text-muted-foreground absolute bottom-0 top-[-130%] h-auto w-[40vw] scale-[.30] text-xs">
              <ResolvedComponentsFromCraftState screen={screensFooter} />
            </div>
          </Card>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="border-t">
        <AccordionTrigger
          className="hover:no-underline"
          onClick={() => dispatch(setHeaderFooterMode(false))}
        >
          {t("Screens")}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          <HelperInformation infoText={t("Click on a screen to edit it")} />
          {/* <div className="section-header flex items-center justify-end">
            <Button
              variant={"secondary"}
              className=""
              onClick={() => handleAddScreen(selectedScreenIndex || 0)}
            >
              <PlusCircle className="mr-2 size-4" />
              {t("Add Screen")}
            </Button>
          </div> */}
          {/* <ScrollArea className="max-h-[calc(60vh)] overflow-y-auto"> */}
          <Reorder.Group
            axis="y"
            className="mt-4 flex flex-col gap-4"
            onReorder={handleReorder}
            values={screens || []}
            // style={{ overflowY: "scroll", maxHeight: "calc(100vh - 500px)"}}
            // style={{ height: 600, border: "1px solid black", overflowY: "auto" }}
            // layoutScroll
          >
            {screens?.map((screen: any, index) => (
              <Reorder.Item
                key={screen.screenName + screen.screenId}
                id={screen.screenName + screen.screenId}
                value={screen}
                onClick={() => {
                  dispatch(setSelectedComponent("ROOT")),
                    dispatch(setHeaderFooterMode(false))
                }}
                // className="relative"
              >
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div className="mt-5 flex flex-row items-center justify-between gap-4 px-2">
                      <span className="font-bold">{index + 1}</span>
                      <EditScreenName
                        screenId={screen.screenId}
                        screenName={screen.screenName}
                      />
                    </div>
                    <Link className="md:hidden" href={`/dashboard/flows/share`}>
                      <Card
                        style={{
                          backgroundColor: backgroundColor,
                          backgroundImage: backgroundImage,
                        }}
                        className={cn(
                          "small:w-[97vw] relative mt-1 flex h-32 w-[94vw] flex-col items-center justify-center overflow-hidden border hover:cursor-pointer md:w-[13.5vw]",
                          {
                            "border-blue-500":
                              selectedScreenIndex === index &&
                              !headerFooterMode,
                            "hover:border-4": selectedScreenIndex !== index,
                          }
                        )}
                        onClick={() => handleScreenClick(index)}
                      >
                        {/* <div className="absolute size-full size-full z-10 bg-transparent top-0 left-0"></div> */}
                        <div className="text-muted-foreground relative scale-[.20] text-xs">
                          <ResolvedComponentsFromCraftState
                            screen={screensHeader}
                          />
                          <ResolvedComponentsFromCraftState
                            screen={screen.screenData ? screen.screenData : {}}
                          />
                          <ResolvedComponentsFromCraftState
                            screen={screensFooter}
                          />
                        </div>
                      </Card>
                    </Link>
                    <Card
                      style={{
                        backgroundColor: backgroundColor,
                        backgroundImage: backgroundImage,
                      }}
                      className={cn(
                        "relative mt-1 hidden h-32 w-[96vw] flex-col items-center justify-center overflow-hidden border hover:cursor-pointer md:flex md:w-[13.5vw]",
                        {
                          "border-blue-500":
                            selectedScreenIndex === index && !headerFooterMode,
                          "hover:border-4": selectedScreenIndex !== index,
                        }
                      )}
                      onClick={() => handleScreenClick(index)}
                    >
                      {/* <div className="absolute size-full size-full z-10 bg-transparent top-0 left-0"></div> */}
                      <div className="text-muted-foreground relative scale-[.20] text-xs">
                        <ResolvedComponentsFromCraftState
                          screen={screensHeader}
                        />
                        <ResolvedComponentsFromCraftState
                          screen={screen.screenData ? screen.screenData : {}}
                        />
                        <ResolvedComponentsFromCraftState
                          screen={screensFooter}
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
                      <span>{t("Add Screen")}</span>
                    </ContextMenuItem>
                    <ContextMenuItem
                      className="flex flex-row items-center gap-2 text-inherit hover:cursor-pointer"
                      onClick={() => handleDuplicateScreen(index)}
                    >
                      <ClipboardCopy size={18} />
                      <span>{t("Duplicate")}</span>
                    </ContextMenuItem>
                    <ContextMenuItem
                      className="flex flex-row items-center gap-2 text-inherit hover:cursor-pointer"
                      onClick={() => handleDeleteScreen(index)}
                    >
                      <Trash2 size={18} />
                      <span>{"Delete"}</span>
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

const EditScreenName = ({ screenId, screenName }) => {
  const ref = React.useRef<HTMLInputElement | null>(null)
  const dispatch = useAppDispatch()
  const [editing, setEditing] = React.useState(false)
  const [name, setName] = React.useState(screenName)
  const screens = useAppSelector((state: RootState) => state?.screen?.screens)

  const handleChange = (inputName) => {
    if (!checkDuplicateName(inputName)) {
      dispatch(setScreenName({ screenId: screenId, screenName: inputName }))
      setName(inputName)
      toast.success("Screen name changed successfully")
      setEditing(false)
    } else {
      toast.error("Screen name already exists")
      ref?.current?.focus()
    }
  }

  const checkDuplicateName = (inputName) => {
    const screenNames = screens
      ?.filter((screen) => screen.screenId !== screenId) // Exclude the current screen
      .map((screen) => screen.screenName.toLowerCase())

    return screenNames?.includes(inputName.toLowerCase())
  }

  const handleInputChange = (e) => {
    let value = e.target.value
    value = value.replace(/\s+/g, "-")
    value = value.replace(/[^a-z0-9-]/gi, "")
    setName(value.toLowerCase())
  }

  return (
    <>
      {!editing && (
        <div
          onClick={() => setEditing(true)}
          className="bg-slate-gray-200 flex grow flex-row items-center justify-end gap-1 border border-transparent text-current hover:cursor-text"
        >
          <div className="truncate">{screenName}</div>
          <Edit3Icon size={16} className="shrink-0 text-[#7B7D80]" />
        </div>
      )}
      {editing && (
        <div className="bg-slate-gray-200 flex grow flex-row items-center justify-end gap-2 p-0.5 text-current">
          <Input
            ref={ref}
            className="text-right"
            value={name}
            onChange={handleInputChange}
            onBlur={() => handleChange(name)}
            autoFocus
          />
        </div>
      )}
      {/* <Toaster position="bottom-right" /> */}
    </>
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
