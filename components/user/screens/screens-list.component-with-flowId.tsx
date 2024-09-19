"use client"

import React, { useCallback, useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Reorder } from "framer-motion"
import {
  ClipboardCopy,
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
import { ShareDrawerDesktop } from "@/components/sections/createFlow/share/drawerDesktopShare"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/input-custom-for-screen-list"
import emptyScreenData from "@/components/user/screens/empty-screen.json"

import ResolvedComponentsFromCraftState from "../settings/resolved-components"
import { useTranslations } from "next-intl"
import { ScreenFooter } from "./screen-footer.component"

const ScreensList = ({ flowId }) => {
  const t = useTranslations("Components")

  console.log("flowId in screens-list.component is", flowId)

  const screens = useAppSelector((state: RootState) => state?.screen?.screens)
  const dispatch = useAppDispatch()
  const selectedScreen = useAppSelector(
    (state) => state?.screen?.screens[state?.screen?.selectedScreen]
  )
  const screensHeader = useAppSelector((state) => state?.screen?.screensHeader)
  const screensFooter = useAppSelector((state) => state?.screen?.screensFooter)
  const headerMode = useAppSelector((state) => state?.screen?.headerMode)
  const footerMode = useAppSelector((state) => state?.screen?.footerMode)
  const avatarBackgroundColor = useAppSelector(
    (state) => state?.screen?.avatarBackgroundColor
  )

  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState<boolean>(false)
  const [shareDrawerOpen, setShareDrawerOpen] = useState<boolean>(false)

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

  const handleReorder = async (data) => {
    // Dispatch the new order of screens
    dispatch(setScreens(data))

    // Get the currently selected screen's index
    const newIndex = selectedScreen
      ? data.findIndex((screen) => screen.screenId === selectedScreen.screenId)
      : -1

    // If a valid screen is selected and its data exists, deserialize the new screen data
    if (newIndex !== -1 && data[newIndex]?.screenData) {
      await actions.deserialize(data[newIndex].screenData)
      dispatch(setSelectedScreen(newIndex)) // Update the selected screen index if needed
    } else if (data.length > 0) {
      // If no valid screen is selected, fall back to the first screen
      await actions.deserialize(data[0].screenData)
      dispatch(setSelectedScreen(0))
    }
  }

  useEffect(() => {
    if (
      selectedScreenIndex !== undefined &&
      screens &&
      selectedScreenIndex >= 0 &&
      selectedScreenIndex < screens.length
    ) {
      actions.deserialize(screens[selectedScreenIndex].screenData)
    } else {
      console.error(
        "selectedScreenIndex or screens is undefined, or selectedScreenIndex is out of bounds"
      )
    }
  }, [selectedScreenIndex, screens])

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

  const divRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDesktopDrawerOpen(true)
            console.log("------scrolled------")
          } else {
            setDesktopDrawerOpen(false)
          }
        })
      },
      { threshold: 0.1 } // Adjust this value to trigger when a small portion is visible
    )

    if (divRef.current) {
      observer.observe(divRef.current)
    }

    return () => {
      if (divRef.current) {
        observer.unobserve(divRef.current)
      }
    }
  }, [])

  return (
    <Accordion
      type="multiple"
      // className="w-[94vw]  small:w-[98vw] bg-red-500 overflow-x-hidden pt-12 md:pt-0 md:max-w-[13.5vw] pb-32"
      className="relative w-[95vw] overflow-x-hidden pb-24 pt-0 md:max-w-[13.5vw] md:pb-0"
      defaultValue={["item-2"]}
    >
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="uppercase hover:no-underline">
          {t("Header & Footer")}
        </AccordionTrigger>
        <AccordionContent className="w-full">
          <div className="mt-4">{t("Header")}</div>

          {/*  ------- Desktop View CARD without Share Redirect Linking ------- */}
          <div className="  hidden md:block">
            <Card
              style={{
                backgroundColor:
                  avatarBackgroundColor !== "rgba(255,255,255,.1)"
                    ? avatarBackgroundColor
                    : backgroundColor,
                backgroundImage: backgroundImage,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className={cn(
                "relative mt-1 flex h-12 w-[94vw] flex-col items-center justify-center overflow-hidden border hover:cursor-pointer md:w-[13.5vw]",
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
          </div>

          {/*  ------- Mobile View CARD with Share Redirect Linking ------- */}
          <button
            className="md:hidden"
            onClick={() => {
              setDesktopDrawerOpen(true)
              setShareDrawerOpen(false)
            }}
          >
            <Card
              style={{
                backgroundColor:
                  avatarBackgroundColor !== "rgba(255,255,255,.1)"
                    ? avatarBackgroundColor
                    : backgroundColor,
                backgroundImage: backgroundImage,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className={cn(
                "relative mt-1 flex h-12 w-[94vw] flex-col items-center justify-center overflow-hidden border hover:cursor-pointer md:w-[13.5vw]",
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
          </button>
          <Separator className="my-4" />
          <p className="text-muted-foreground text-sm">{t("Footer")}</p>

          {/*  ------- Desktop View CARD without Share Redirect Linking ------- */}
          <div className="  hidden md:block">
            <Card
              style={{
                backgroundColor: backgroundColor,
                backgroundImage: backgroundImage,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className={cn(
                "relative mt-1 flex h-12 w-[94vw] flex-col items-center justify-center overflow-hidden border hover:cursor-pointer md:w-[13.5vw]",
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
          </div>

          {/*  ------- Mobile View CARD with Share Redirect Linking ------- */}
          <button
            className="md:hidden"
            onClick={() => {
              setDesktopDrawerOpen(true)
              setShareDrawerOpen(false)
            }}
          >
            <Card
              style={{
                backgroundColor: backgroundColor,
                backgroundImage: backgroundImage,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className={cn(
                "relative mt-1 flex h-12 w-[94vw] flex-col items-center justify-center overflow-hidden border hover:cursor-pointer md:w-[13.5vw]",
                {
                  "border-blue-500": footerMode,
                }
              )}
            >
              <div className="absolute bottom-0 left-0 z-10 size-full bg-transparent"></div>
              <div className="text-muted-foreground absolute bottom-0 top-[-130%] h-auto w-[40vw] scale-[.30] text-xs">
                <ResolvedComponentsFromCraftState screen={screensFooter} />
              </div>
            </Card>
          </button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger
          className="uppercase hover:no-underline"
          onClick={() => dispatch(setHeaderFooterMode(false))}
        >
          {t("Screens")}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          <HelperInformation />
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
                    <div className=" mt-5 flex flex-row items-center justify-between gap-4 px-2">
                      <span className="font-bold">{index + 1}</span>
                      <EditScreenName
                        screenId={screen.screenId}
                        screenName={screen.screenName}
                      />
                    </div>
                    {/* ---Steps Card--- */}
                    <button
                      className="md:hidden"
                      onClick={() => {
                        setDesktopDrawerOpen(true)
                        setShareDrawerOpen(false)
                      }}
                    >
                      {/*  ------- Mobile View CARD with Share Redirect Linking ------- */}
                      <Card
                        onClick={() => {
                          setDesktopDrawerOpen(true)
                          setShareDrawerOpen(false)
                        }}
                        style={{
                          backgroundColor: backgroundColor,
                          backgroundImage: backgroundImage,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        className={cn(
                          "relative mt-1 flex h-52 w-[94vw] flex-col items-center justify-center overflow-hidden border hover:cursor-pointer md:hidden md:h-32 md:w-[13.5vw]",
                          {
                            "border-blue-500":
                              selectedScreenIndex === index &&
                              !headerFooterMode,
                            "hover:border-4": selectedScreenIndex !== index,
                          }
                        )}
                      >
                        {/* <div className="absolute size-full size-full z-10 bg-transparent top-0 left-0"></div> */}
                        <div
                          className="text-muted-foreground relative w-full text-xs"
                          style={{
                            overflow: "hidden", // Hide content that overflows
                            transform: "scale(1,1)", // Zoom out vertically
                            zoom: "35%",
                            pointerEvents: "none",
                          }}
                        >
                          <div
                            style={{
                              background:
                                avatarBackgroundColor !== "rgba(255,255,255,.1)"
                                  ? avatarBackgroundColor
                                  : backgroundColor,
                            }}
                          >
                            <ResolvedComponentsFromCraftState
                              screen={screensHeader}
                            />
                          </div>
                          <div style={{ paddingTop: "50px" }}>
                            {JSON.parse(screen.screenData)["ROOT"].nodes
                              .length > 0 ? (
                              <ResolvedComponentsFromCraftState
                                screen={
                                  screen.screenData ? screen.screenData : {}
                                }
                              />
                            ) : (
                              <div style={{ paddingTop: "15%" }}>
                                <ResolvedComponentsFromCraftState
                                  screen={screensFooter}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </button>
                    {/*  ------- Desktop View CARD without Share Redirect Linking ------- */}
                    <Card
                      style={{
                        backgroundColor: backgroundColor,
                        backgroundImage: backgroundImage,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      className={cn(
                        "relative mt-1 hidden h-32 w-[94vw] flex-col overflow-hidden  border p-[3px] hover:cursor-pointer hover:p-0 md:flex md:w-[13.5vw]",
                        {
                          "border-blue-500 p-0":
                            selectedScreenIndex === index && !headerFooterMode,
                          "hover:border-4": selectedScreenIndex !== index,
                        }
                      )}
                      onClick={() => {
                        handleScreenClick(index)
                      }}
                    >
                      <div
                        className="text-muted-foreground relative   text-xs"
                        style={{
                          overflow: "hidden", // Hide content that overflows
                          transform: "scale(1,1)", // Zoom out vertically
                          zoom: "25%",
                          pointerEvents: "none",
                        }}
                      >
                        <div
                          style={{
                            background:
                              avatarBackgroundColor !== "rgba(255,255,255,.1)"
                                ? avatarBackgroundColor
                                : backgroundColor,

                            // overflow: "auto", // Make content scrollable within the 30% area
                          }}
                        >
                          <ResolvedComponentsFromCraftState
                            screen={screensHeader}
                          />
                        </div>

                        <div style={{ paddingTop: "50px" }}>
                          {JSON.parse(screen.screenData)["ROOT"].nodes.length >
                          0 ? (
                            <ResolvedComponentsFromCraftState
                              screen={
                                screen.screenData ? screen.screenData : {}
                              }
                            />
                          ) : (
                            <div style={{ paddingTop: "15%" }}>
                              <ResolvedComponentsFromCraftState
                                screen={screensFooter}
                              />
                            </div>
                          )}
                        </div>
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

      <div ref={divRef} className="h-2 w-full md:hidden "></div>

      <ShareDrawerDesktop
        desktopDrawerOpen={desktopDrawerOpen}
        setDesktopDrawerOpen={setDesktopDrawerOpen}
        flowId={flowId}
      />
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
      // toast.success("Screen name changed successfully")
      setEditing(false)
    } else {
      toast.error("Screen name already exists")
      ref?.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleChange(name)
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
        <div className="flex items-center " onClick={() => setEditing(true)}>
          <div className="bg-slate-gray-200 flex grow flex-row items-center justify-end gap-1 border border-transparent text-current hover:cursor-text">
            <div className="truncate">{screenName}</div>
          </div>

          <Pencil size={16} className="ml-2 shrink-0 cursor-pointer" />
        </div>
      )}
      {editing && (
        <div className="bg-slate-gray-200 flex grow flex-row items-center justify-end  gap-2 text-current">
          <Input
            ref={ref}
            className="text-right"
            value={name}
            onChange={handleInputChange}
            onBlur={() => handleChange(name)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <svg
            onClick={() => handleChange(name)}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-save  cursor-pointer"
          >
            <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
            <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
            <path d="M7 3v4a1 1 0 0 0 1 1h7" />
          </svg>
        </div>
      )}
      {/* <Toaster position="bottom-right" /> */}
    </>
  )
}

function HelperInformation() {
  const t = useTranslations("Components")
  return (
    <Card
      className={cn(
        "hidden w-full flex-col items-center justify-center border border-gray-500 px-2 py-3 hover:cursor-pointer md:flex"
      )}
    >
      <div className="flex flex-row items-start gap-1 text-left">
        <MousePointer />
        <div>
          <h2 className="mb-1 text-base font-semibold uppercase text-gray-950 dark:text-slate-50">
            {t("Right-Click")}
          </h2>
          <p className="text-sm font-light">
            {t("Click on a screen to edit it")}
          </p>
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
