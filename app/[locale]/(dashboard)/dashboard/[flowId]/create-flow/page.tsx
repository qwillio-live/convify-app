"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BreadCrumbs } from "@/components/breadcrumbs"
import { CreateFlowComponent } from "@/components/create-flow/create-flow.component-with-flowId"
import ConnectFlowComponents from "@/components/sections/createFlow/connect/Connect"
// sections
import ResultFlowComponents from "@/components/sections/createFlow/result/Result"
import Header from "../constants/headerEls"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { reset } from "@/lib/state/flows-state/features/theme/globalewTheme"
import { resetScreens } from "@/lib/state/flows-state/features/newScreens"
import { setScreensData } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { setFlowSettings } from "@/lib/state/flows-state/features/theme/globalThemeSlice"

export default function CreateFlowsPage({
  params,
}: {
  params: { flowId: string; en: string }
}) {
  const router = useRouter()
  const flowId = params?.flowId
  console.log("flowId", flowId)
  const [isCustomLinkOpen, setIsCustomLinkOpen] = useState(false)
  const [link, setLink] = useState(
    "https://fgd01i1rvh5.typeform.com/to/jGXtoJYM"
  )

  const dispatch = useAppDispatch()
  const firstScreenName =
    useAppSelector((state) => state?.screen?.firstScreenName) || ""

  const [tab, setTab] = useState("create")

  const t = useTranslations("Components")

  // store the current tab value
  const onTabChange = (value: string) => {
    setTab(value)
    // router.replace(`/dashboard/flows/${value}`);
  }
  useEffect(() => {
    const getFlowData = async () => {
      try {
        const response = await fetch(`/api/flows/${flowId}`)
        const flowData = await response.json()
        console.log("flowData", flowData)
        dispatch(setScreensData(flowData))
        dispatch(setFlowSettings(flowData.flowSettings ?? {}))
      } catch (error) {
        console.error("Error fetching flow data:", error) // Handle the error
      }
    }

    // Reset state first
    dispatch(reset())
    dispatch(resetScreens())

    // Then fetch the flow data
    getFlowData()
  }, []) // Add flowId as a dependency if it can change

  return (
    <div className="fixed min-h-screen w-full">
      <Tabs
        defaultValue="create"
        onValueChange={onTabChange}
        className="flex min-h-screen flex-col"
      >
        <div className="sticky top-0 z-[60]">
          <Header flowId={flowId} />
        </div>
        <main
          className={`content relative z-50 flex-1 overflow-hidden border-t bg-[#FAFAFA] ${
            tab === "results" ? "" : tab === "share" ? "" : ""
          }`}
        >

          {/* --New Commit-- */}
          <div className="tabs-content">
            <TabsContent className="mt-0" value="create">
              <CreateFlowComponent flowId={flowId} />
            </TabsContent>



            {/* <TabsContent className="mt-0" value="connect">
              <ConnectFlowComponents />
            </TabsContent>
            <TabsContent className="mt-0" value="share">
              <div className="flex h-[calc(-52px+99vh)] flex-row items-start justify-between">
                <div className="relative flex h-full  w-64  flex-col overflow-hidden border-r border-[rgba(0,0,0,0.07)] bg-white">
                  <nav className="grid items-start  text-sm font-medium ">
                    <Link
                      href="#"
                      className="flex-0 border-b border-solid border-b-[rgba(0,0,0,0.07)] bg-[rgb(227,227,227)] px-4 py-2 font-medium leading-8 text-[rgb(38,38,39)] no-underline transition-[background]  delay-0 duration-200 ease-in hover:bg-[rgb(240,240,240)]"
                    >
                      {t("Share the link")}
                    </Link>
                    <div
                      onClick={() => setIsCustomLinkOpen(true)}
                      className="flex-0 cursor-pointer border-b border-solid border-b-[rgba(0,0,0,0.07)] px-4  py-2 font-medium leading-8 text-[rgb(38,38,39)]  no-underline transition-[background]  delay-0 duration-200  ease-in hover:bg-[rgb(240,240,240)]"
                    >
                      {t("Embed in an email")}
                    </div>
                    <div
                      onClick={() => setIsCustomLinkOpen(true)}
                      className="flex-0 cursor-pointer border-b border-solid border-b-[rgba(0,0,0,0.07)] px-4  py-2 font-medium leading-8 text-[rgb(38,38,39)]  no-underline transition-[background] delay-0 duration-200   ease-in hover:bg-[rgb(240,240,240)]"
                    >
                      {t("Embed in a webpage")}
                    </div>
                  </nav>

                  <div className=" flex min-h-0 min-w-0 flex-1 pt-3"></div>
                </div>
            <div className="h-full flex-1 overflow-hidden  bg-[#FAFAFA] px-10 py-8">
              <div className="max-h-[4.75rem] min-w-0 pb-6">
                <div className="flex max-h-[3.25rem] items-center rounded-[8px] bg-[rgb(255,250,235)] p-4 text-[rgb(100,82,22)]">
                  <span className="block w-full text-sm text-[rgb(100,82,22)]">
                    ⚠️ {t("This flow is not published yet.")}{" "}
                    <Link className="underline" href="#">
                      {t("Click here to publish the latest version")}
                    </Link>{" "}
                    {t("before you share your flow.")}
                  </span>
                </div>
              </div>
              <div className="flex  h-full flex-col text-sm text-[rgb(38,38,39)] ">
                <div className="m-auto w-full max-w-[608px] flex-[0_0_auto]">
                  <div className="flex flex-row items-center justify-between ">
                    <div className="flex w-full max-w-[267.3px]">
                      <div className="inline-block w-full max-w-[350px] flex-[0_0_auto]">
                        <div className="ease durationease-in flex items-center rounded-[4px] rounded-r-none border border-solid border-[rgb(187,187,187)] bg-white text-[rgb(38,38,38)]  transition-all">
                          <div className="flex-1">
                            <input
                              type="text"
                              aria-label="copy link input"
                              className="m-0 block w-full border-0 bg-transparent px-[11px] py-[5px] text-sm outline-none"
                              value="https://fgd01i1rvh5.typeform.com/to/jGXtoJYM"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(link)}
                        className="flex h-8 w-auto flex-[0_0_auto] cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-[4px] rounded-l-none border border-solid border-transparent bg-[rgb(38,38,38)] px-3 text-sm font-medium text-white outline-none transition-all duration-200 hover:bg-[rgb(76,76,76)] "
                      >
                        {t("Copy link")}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCustomLinkOpen(true)}
                      color="description"
                      className="relative m-0 inline-block cursor-pointer border-none p-0 text-[rgb(115,115,115)] underline outline-none"
                    >
                      {t("Customize link")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent className="mt-0" value="results">
          <ResultFlowComponents />
        </TabsContent> */}
          </div>
        </main>
      </Tabs>
      {/* <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end transition-all delay-0 duration-200 ease-in-out">
        <button className="relative size-8 cursor-pointer rounded-[50%] border border-solid border-transparent bg-white p-0 shadow-[rgba(0,0,0,0.08)_0px_2px_4px,rgba(0,0,0,0.06)_0px_2px_12px,rgba(0,0,0,0.04)_0px_8px_14px,rgba(0,0,0,0.02)_0px_12px_16px] outline-none transition-all duration-500 ease-in hover:bg-[rgb(231,231,231)]">
          <div className="flex size-auto cursor-pointer items-center justify-center">
            <span className="SVGInline">
              <svg
                className="SVGInline-svg"
                width="8"
                height="12"
                viewBox="0 0 8 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fillRule="evenodd">
                  <path
                    d="M0 5h2v.088H0V5zm0-1.25C0 1.494 1.626 0 4 0c2.377 0 4 1.488 4 3.75 0 1.462-.636 2.323-1.885 3.164l-.44.29c-.33.221-.482.355-.54.455C5.068 7.774 4.999 8.25 5 9l-2 .003c-.002-1.083.108-1.835.405-2.347.255-.439.59-.732 1.158-1.113l.435-.287C5.75 4.748 6 4.41 6 3.75 6 2.633 5.309 2 4 2c-1.305 0-2 .638-2 1.75v1.338H0V3.75z"
                    fillRule="nonzero"
                  ></path>
                  <path d="M3 10h2v2H3z"></path>
                </g>
              </svg>
            </span>
          </div>
        </button>
      </div> */}
      {isCustomLinkOpen && (
        <div className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-[rgba(227,227,227,.8)] text-sm text-[rgb(38,38,39)] transition-all">
          <div className="flex size-full items-center justify-center  from-white/0 to-white/90">
            <div className="z-[1] flex w-[512px] flex-col items-center p-8">
              <div className="min-h-0 min-w-0 shrink-0 pb-6">
                <span className="text-center text-xs font-bold uppercase text-[rgb(38,38,39)]">
                  {t("CUSTOM LINK")}
                </span>
              </div>
              <div className="min-h-0 min-w-0 shrink-0 pb-2">
                <span className="block text-center text-4xl font-light">
                  {t("Create a custom link")}
                </span>
              </div>
              <div className="min-h-0 min-w-0 shrink-0">
                <span className="block text-center text-xl text-[rgb(115,115,115)]">
                  {t(
                    "Edit the link and let people know what your flow is about"
                  )}
                </span>
              </div>
              <div className="mb-10"></div>
              <div className="min-h-0 min-w-0 shrink-0 pb-6">
                <span className="block text-center text-sm font-medium text-[rgb(2,80,65)]">
                  {t("Available on these plans: Plus, Business, Enterprise")}
                </span>
              </div>
              <div className="flex size-full items-center justify-center">
                <button className="relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-[4px] border-0 bg-[rgb(2,100,81)] px-4 py-2 text-base text-white no-underline transition-all duration-300 hover:bg-[rgb(40,123,107)]">
                  <div className="flex">
                    <span className="block flex-[0_0_auto]">
                      {t("Upgrade my plan")}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <button
            aria-label="Close dialog"
            color="#737373"
            data-qa="upgrade-nag-screen-close-button"
            style={{
              marginTop: "60px",
            }}
            className="fixed right-2 top-2 size-10 cursor-pointer border border-solid border-transparent bg-transparent p-0 outline-none transition-all duration-300"
          >
            <div className="flex size-auto items-center justify-center ">
              <span
                onClick={() => setIsCustomLinkOpen(false)}
                className="cursor-pointer"
              >
                {" "}
                <svg
                  width="28px"
                  height="28px"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"
                  />
                </svg>
              </span>
            </div>
          </button>
        </div>
        // <Dialog open={isCustomLinkOpen} onOpenChange={setIsCustomLinkOpen}>
        //   <DialogContent className=" sm:max-w-md">
        //     <DialogHeader>
        //       <DialogTitle className="">CUSTOM LINK</DialogTitle>
        //       <DialogTitle>Create a custom link</DialogTitle>
        //       <DialogDescription>
        //         Edit the link and let people know what your flow is about.
        //       </DialogDescription>
        //     </DialogHeader>
        //   </DialogContent>
        // </Dialog>
      )}
    </div>
  )
}
