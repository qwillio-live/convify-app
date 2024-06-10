"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, Plus } from "lucide-react"
import { signOut } from "next-auth/react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BreadCrumbs } from "@/components/breadcrumbs"
import InsightsFlowComponents from "@/components/sections/createFlow/insights/Insights"
import ResponseFlowComponents from "@/components/sections/createFlow/response/Response"

// sections

export default function CreateFlowsPage() {
  const [openCreateFlow, setOpenCreatedFlow] = useState(true)
  const [isCustomLinkOpen, setIsCustomLinkOpen] = useState(false)
  const [link, setLink] = useState(
    "https://fgd01i1rvh5.typeform.com/to/jGXtoJYM"
  )
  const [tab, setTab] = useState("create")

  const t = useTranslations("CreateFlow")

  // store the current tab value
  const onTabChange = (value: string) => {
    setTab(value)
  }
  const router = useRouter()

  const handleOpenCreateFlow = () => {
    setOpenCreatedFlow(true)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    // document.cookie = "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/login")
  }

  return (
    <div className="min-h-screen w-full">
      <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 z-[60]">
          <header className="flex flex-wrap lg:flex-nowrap h-28 items-center justify-between gap-x-4 lg:gap-4 border-b bg-[#fcfdfe] px-4 lg:h-[60px] lg:px-6">
            <div className="bread-crumbs flex h-1/2 lg:h-full max-h-screen flex-col items-center">
              <div className="flex h-14 items-center lg:h-[60px]">
                <BreadCrumbs />
              </div>
              <div className="h-14 flex-1 flex-col items-center justify-between overflow-y-auto px-4 lg:h-[60px] lg:px-6 hidden">
                <div className="flex flex-row items-center justify-between py-4">
                  <h4 className="scroll-m-20 text-lg font-normal tracking-tight">
                    {t("Content")}
                  </h4>
                  <Button size="icon" className="size-8">
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full order-last lg:order-[unset] basis-full lg:basis-auto lg:w-auto flex h-1/2 lg:h-full shadow-[rgba(0,0,0,0.07)_0px_1px_inset]">
              <div className="flex h-full bg-inherit lg:justify-center py-0 w-full lg:w-auto">
                <Link
                  className="h-full rounded-none border-b-4 border-transparent flex-1 lg:flex-auto flex justify-center items-center text-sm text-muted-foreground px-3"
                  href="/dashboard/flows/create"
                >
                  {t("Create")}
                </Link>
                <Link
                  className="h-full rounded-none border-b-4 border-transparent flex-1 lg:flex-auto flex justify-center items-center text-sm text-muted-foreground px-3"
                  href="/dashboard/flows/connect"
                >
                  {t("Connect")}
                </Link>
                <Link
                  className="h-full rounded-none border-b-4 border-transparent flex-1 lg:flex-auto flex justify-center items-center text-sm text-muted-foreground px-3"
                  href="/dashboard/flows/share"
                >
                  {t("Share")}
                </Link>
                <Link
                  className="h-full rounded-none border-b-4 flex-1 lg:flex-auto flex justify-center items-center text-sm text-foreground border-current px-3"
                  href="/dashboard/flows/results"
                >
                  {t("Results")}
                </Link>
              </div>
            </div>
            <div className="account-settings flex flex-row items-center justify-between gap-4 h-1/2 lg:h-full">
              <Link href="/dashboard/flows/preview-flow" target="_blank">
                <Button
                  variant="outline"
                  size="sm"
                  className="my-4 h-8 gap-1 p-2"
                >
                  <Eye className="size-3.5" />
                </Button>
              </Link>
              <div className="">
                <Button size="sm" className="my-4 h-8 gap-1 py-2">
                  {t("Publish")}
                </Button>
              </div>

              <div className="lg:block hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full w-10 h-10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-circle-user"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                      </svg>
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("My Account")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>{t("Settings")}</DropdownMenuItem>
                    <DropdownMenuItem>{t("Support")}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      {t("Logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
        </div>
        <main
          className={`content relative z-50 bg-[#FAFAFA] flex-1 h-full ${
            tab === "results" ? "" : tab === "share" ? "" : "px-0 lg:px-6"
          }`}
        >
          <Tabs defaultValue="insights">
            <header className="flex h-14 items-center justify-center gap-4 border-b bg-muted/20 px-4 lg:h-[60px] bg-white">
              <div className="tabs-list-container flex h-full w-3/5 items-center justify-start">
                <TabsList className="flex h-full bg-inherit py-0">
                  <TabsTrigger
                    className="h-full rounded-none border-b-4 border-transparent uppercase data-[state=active]:border-current data-[state=active]:bg-inherit px-3"
                    value="insights"
                  >
                    {t("ResultsPage.insights")}
                  </TabsTrigger>
                  <TabsTrigger
                    className="h-full rounded-none  border-b-4 border-transparent uppercase data-[state=active]:border-current data-[state=active]:bg-inherit px-3"
                    value="responses"
                  >
                    {t("ResultsPage.responses")}
                  </TabsTrigger>
                </TabsList>
              </div>
            </header>
            <main className="content relative  z-50 flex  items-start justify-center bg-[#FAFAFA] px-4 lg:px-6 ">
              <div className="tabs-content flex w-full items-center">
                <TabsContent
                  className="mt-0 w-full h-[calc(100vh-232px)] lg:h-[calc(100vh-180px)]"
                  value="insights"
                >
                  <InsightsFlowComponents />
                </TabsContent>
                <TabsContent
                  className="mt-0 w-full h-[calc(100vh-232px)] lg:h-[calc(100vh-180px)]"
                  value="responses"
                >
                  <ResponseFlowComponents />
                </TabsContent>
              </div>
            </main>
          </Tabs>
        </main>
      </div>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end transition-all delay-0 duration-200 ease-in-out">
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
                <g fill-rule="evenodd">
                  <path
                    d="M0 5h2v.088H0V5zm0-1.25C0 1.494 1.626 0 4 0c2.377 0 4 1.488 4 3.75 0 1.462-.636 2.323-1.885 3.164l-.44.29c-.33.221-.482.355-.54.455C5.068 7.774 4.999 8.25 5 9l-2 .003c-.002-1.083.108-1.835.405-2.347.255-.439.59-.732 1.158-1.113l.435-.287C5.75 4.748 6 4.41 6 3.75 6 2.633 5.309 2 4 2c-1.305 0-2 .638-2 1.75v1.338H0V3.75z"
                    fill-rule="nonzero"
                  ></path>
                  <path d="M3 10h2v2H3z"></path>
                </g>
              </svg>
            </span>
          </div>
        </button>
      </div>
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
                    "Edit the link and let people know what your typeform is about."
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
                    fill-rule="evenodd"
                    clip-rule="evenodd"
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
        //         Edit the link and let people know what your typeform is about.
        //       </DialogDescription>
        //     </DialogHeader>
        //   </DialogContent>
        // </Dialog>
      )}
    </div>
  )
}
