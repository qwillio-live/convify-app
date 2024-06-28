import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { Minus, Plus } from "lucide-react"

import { Bar, BarChart, ResponsiveContainer } from "recharts"
import './Share.css'
import { ShareDrawerDesktop } from "./drawerDesktopShare"

const ShareFlowComponents = ({
  isPublished }) => {
  const [view, setView] = useState("desktop")
  const [innerview, setInnerView] = useState("desktop")
  const [isCustomLinkOpen, setIsCustomLinkOpen] = useState(false)
  const [link, setLink] = useState("https://convify.app/your-link-here")
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState<boolean>(false)
  const [shareDrawerOpen, setShareDrawerOpen] = useState<boolean>(false)

  const t = useTranslations("CreateFlow.SharePage")

  const updateView = () => {
    if (window.innerWidth >= 1024) {
      setShareDrawerOpen(false)
      setView("desktop");
      setInnerView("desktop")
    } else {
      setView("mobile");
      setInnerView("mobile")
      setShareDrawerOpen(true)
    }
  };

  useEffect(() => {
    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, []);

  return (
    <div>
      {
        innerview === "desktop" && (
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
                  className="flex-0 cursor-pointer border-b border-solid border-b-[rgba(0,0,0,0.07)] px-4  py-2 font-medium leading-8 text-[rgb(38,38,39)]  no-underline transition-[background]  delay-0 duration-200  ease-in hover:bg-[rgb(240,240,240)] "
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

            {/* Middle part */}
            <div className="h-full flex-1 overflow-hidden  bg-[#FAFAFA] px-10 py-8">
              {/* Warning  */}
              {!isPublished && (
                <div className="max-h-[4.75rem] min-w-0 pb-6">
                  <div className="flex max-h-[3.25rem] items-center rounded-[8px] bg-[rgb(255,250,235)] p-4 text-[rgb(100,82,22)]">
                    <span className="block w-full text-sm text-[rgb(100,82,22)]">
                      ⚠️ {t("This flow is not published yet")}{" "}
                      <Link className="underline" href="#">
                        {t("Click here to publish the latest version")}
                      </Link>{" "}
                      {t("before you share your flow")}
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              {/* max-h-[753px] to make it look more like typeform to reduce the scrollbar */}
              <div className="flex  h-full flex-col text-sm text-[rgb(38,38,39)] ">
                {/* [:not(:last-child)]:mb-0 */}
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
                              value={link}
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(link)
                          toast({
                            title: "Link copied to clipboard",
                          })
                        }}
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
                  {/* socials */}
                  <div className="text-[rgb(38,38,39)]] py-3 text-sm">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex">
                        <button
                          className="flex h-[32px] w-11 flex-[0_0_auto] cursor-pointer items-center justify-center rounded-[4px] bg-transparent text-[rgb(115,115,115)] hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                          onClick={() => setIsCustomLinkOpen(true)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 8.04853C16 3.6032 12.4187 0 8 0C3.58133 0 0 3.6032 0 8.04853C0 12.0667 2.9248 15.3963 6.74987 16V10.3755H4.71893V8.048H6.74987V6.2752C6.74987 4.25813 7.944 3.14347 9.77173 3.14347C10.6464 3.14347 11.5627 3.3008 11.5627 3.3008V5.2816H10.5531C9.55947 5.2816 9.25013 5.9024 9.25013 6.5392V8.04853H11.4688L11.1141 10.3749H9.25013V16C13.0752 15.3963 16 12.0667 16 8.04853Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </button>
                        <button
                          className="flex h-[32px] w-11 flex-[0_0_auto] cursor-pointer items-center justify-center rounded-[4px] bg-transparent text-[rgb(115,115,115)] hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                          onClick={() => setIsCustomLinkOpen(true)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.7778 0.888916C1.28689 0.888916 0.888916 1.28689 0.888916 1.7778V14.2222C0.888916 14.7132 1.28689 15.1111 1.7778 15.1111H14.2222C14.7132 15.1111 15.1111 14.7132 15.1111 14.2222V1.7778C15.1111 1.28689 14.7132 0.888916 14.2222 0.888916H1.7778ZM8.22149 6.30691H6.30691V13.0794H8.33865V9.82657C8.33865 8.6915 8.82559 8.00003 9.84688 8.00003C10.688 8.00003 11.0476 8.79038 11.0476 9.69112V13.0794H13.0794V9.32066C13.0794 7.30856 12.5085 6.22225 10.4625 6.22225C9.39652 6.22225 8.53438 6.7566 8.24248 7.28282H8.22149V6.30691ZM4.95241 13.0794H2.92066V6.30691H4.95241V13.0794ZM3.93653 5.20638C4.63816 5.20638 5.20638 4.63816 5.20638 3.93653C5.20638 3.23491 4.63816 2.66669 3.93653 2.66669C3.23491 2.66669 2.66669 3.23491 2.66669 3.93653C2.66669 4.63816 3.23491 5.20638 3.93653 5.20638Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </button>
                        <button
                          className="flex h-[32px] w-11 flex-[0_0_auto] cursor-pointer items-center justify-center rounded-[4px] bg-transparent text-[rgb(115,115,115)] hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                          onClick={() => setIsCustomLinkOpen(true)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16ZM6.536 12.22C10.084 12.22 12.024 9.28 12.024 6.732C12.024 6.64801 12.024 6.56398 12.02 6.484C12.396 6.212 12.724 5.872 12.984 5.484C12.64 5.636 12.268 5.74 11.876 5.788C12.276 5.548 12.58 5.172 12.724 4.72C12.352 4.94 11.94 5.1 11.5 5.188C11.148 4.812 10.648 4.58 10.092 4.58C9.028 4.58 8.164 5.444 8.164 6.508C8.164 6.66 8.18 6.808 8.216 6.948C6.612 6.868 5.192 6.1 4.24 4.932C4.076 5.216 3.98 5.548 3.98 5.9C3.98 6.568 4.32 7.16 4.84 7.504C4.524 7.496 4.228 7.408 3.968 7.264V7.288C3.968 8.224 4.632 9 5.516 9.18C5.356 9.224 5.184 9.248 5.008 9.248C4.884 9.248 4.764 9.236 4.644 9.212C4.888 9.98 5.6 10.536 6.444 10.552C5.784 11.068 4.952 11.376 4.048 11.376C3.892 11.376 3.74 11.368 3.588 11.348C4.432 11.9 5.448 12.22 6.536 12.22Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </button>
                        <button
                          className="flex h-[32px] w-11 flex-[0_0_auto] cursor-pointer items-center justify-center rounded-[4px] bg-transparent text-[rgb(115,115,115)] hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                          onClick={() => setIsCustomLinkOpen(true)}
                        >
                          <svg
                            width="14"
                            height="16"
                            viewBox="0 0 14 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.96165 0L0.249512 3.47691L6.96165 6.96599L13.7461 3.47691L6.96165 0Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M2.38244 6.53061L6.96165 8.78254L11.5891 6.53061L13.7461 7.58152L6.96165 10.8844L0.249512 7.58152L2.38244 6.53061Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M6.96165 12.9322L2.38244 10.449L0.249512 11.6019L6.96165 15.2381L13.7461 11.6019L11.5891 10.449L6.96165 12.9322Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </button>
                        <button
                          className="flex h-[32px] w-11 flex-[0_0_auto] cursor-pointer items-center justify-center rounded-[4px] bg-transparent text-[rgb(115,115,115)] hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                          onClick={() => setIsCustomLinkOpen(true)}
                        >
                          <svg
                            width="12"
                            height="16"
                            viewBox="0 0 12 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.04054 4.35316L9.42089 1.91823L10.8113 3.32384L8.30856 5.69236H11.8234V7.65137H8.28638L10.8002 10.0863L9.40976 11.4587L5.995 8.03871L2.58028 11.4587L1.20105 10.0863L3.71482 7.65137H0.177734V5.69236H3.69258L1.18992 3.32384L2.56916 1.91823L4.94947 4.35316V0.888916H7.01836V4.35316H7.04054ZM4.97172 10.4626H7.04054V15.1111H4.97172V10.4626Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </button>
                      </div>
                      <div className="flex">
                        <button
                          className="flex flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-2 rounded-[4px] bg-transparent px-3 py-[6px] text-[rgb(115,115,115)] no-underline  hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                          onClick={() => setIsCustomLinkOpen(true)}
                        >
                          <svg
                            width="16"
                            height="12"
                            viewBox="0 0 16 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.898 7.18202C9.391 7.68902 8.717 7.96802 8 7.96802C7.2825 7.96802 6.6085 7.68852 6.102 7.18152L0 1.08002V10C0 11.1045 0.8955 12 2 12H14C15.1045 12 16 11.1045 16 10V1.08002L9.898 7.18202Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M7.99999 6.505C8.31649 6.505 8.63299 6.3875 8.86849 6.1525L15.0205 0H0.979492L7.13149 6.1525C7.36699 6.3875 7.68349 6.505 7.99999 6.505Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          {t("Email link")}
                        </button>
                        <button
                          aria-label="qr code"
                          className="flex flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-2 rounded-[4px] bg-transparent px-3 py-[6px] text-[rgb(115,115,115)] no-underline hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                          onClick={() => setIsCustomLinkOpen(true)}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.777832 6.11117V0.777832H6.11117V6.11117H0.777832ZM2.55561 2.55561H4.33339V4.33339H2.55561V2.55561Z"
                              fill="currentColor"
                            ></path>
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.88894 6.11117V0.777832H13.2223V6.11117H7.88894ZM9.66672 2.55561H11.4445V4.33339H9.66672V2.55561Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M7.88894 7.88894H9.66672V9.66672H7.88894V7.88894Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M11.4445 9.66672H9.66672V11.4445H7.88894V13.2223H9.66672V11.4445H11.4445V13.2223H13.2223V11.4445H11.4445V9.66672Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M11.4445 9.66672V7.88894H13.2223V9.66672H11.4445Z"
                              fill="currentColor"
                            ></path>
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.777832 13.2223V7.88894H6.11117V13.2223H0.777832ZM2.55561 9.66672H4.33339V11.4445H2.55561V9.66672Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          {t("QR Code")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Main Content */}
                <div className="flex min-w-0 !flex-[1_0_auto] flex-col items-center  pt-6">

                  <div className="max-h-[585px] w-full flex-[1_0_auto] rounded-2xl bg-white transition-[width] duration-300 ease-in will-change-[width]"
                    style={{
                      maxWidth: view === "desktop" ? "100%" : "360px",
                    }}
                  >
                    {isPublished ? (
                      <iframe
                        src="https://convify.io/survey"
                        frameBorder="0"
                        className="size-full"
                      ></iframe>
                    ) : (
                      <div className="flex size-full items-center justify-center text-sm text-[rgb(38,38,39)] mt-5">
                        <div className="flex flex-col items-center gap-2">
                          <svg
                            width="64"
                            height="68"
                            viewBox="0 0 64 68"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                          >
                            <rect
                              y="0.5"
                              width="64"
                              height="67"
                              fill="url(#pattern0)"
                            ></rect>
                            <defs>
                              <pattern
                                id="pattern0"
                                patternContentUnits="objectBoundingBox"
                                width="1"
                                height="1"
                              >
                                <use
                                  xlinkHref="#image0_5265_82"
                                  transform="scale(0.0078125 0.00746269)"
                                ></use>
                              </pattern>
                              <image
                                id="image0_5265_82"
                                width="128"
                                height="134"
                                xlinkHref="data:image/png;base64,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"
                              ></image>
                            </defs>
                          </svg>
                          <span className="flex-[0_0_auto]">
                            {t("Publish your flow to preview it here")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isPublished ? (
                    <div className="relative mt-5  flex w-full items-end justify-center" style={{
                      marginBottom: "50px",
                    }}>
                      <Tabs defaultValue={view} className="w-[200px]">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="desktop" onClick={() => setView("desktop")} >{t("Desktop")}</TabsTrigger>{" "}
                          <TabsTrigger value="mobile" onClick={() => setView("mobile")}>{t("Mobile")}</TabsTrigger>{" "}
                        </TabsList>
                      </Tabs>
                    </div>
                  ) : (
                    <div className="relative mt-5  flex w-full items-end justify-center">
                      <Tabs defaultValue={view} className="w-[200px]">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="desktop" onClick={() => setView("desktop")} > {t("Desktop")}</TabsTrigger>{" "}
                          <TabsTrigger value="mobile" onClick={() => setView("mobile")}>{t("Mobile")}</TabsTrigger>{" "}
                        </TabsList>
                      </Tabs>
                    </div>
                  )
                  }
                </div>
              </div>
            </div >
          </div >)}
      {isCustomLinkOpen && (
        <div className="fixed inset-0 z-[99] flex size-full items-center justify-center bg-[rgba(227,227,227,.8)] text-sm text-[rgb(38,38,39)] transition-all">
          <div className="flex size-full items-center justify-center  from-white/0 to-white/90">
            <div className="z-[1] flex w-[512px] flex-col items-center p-8">
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
      )}
      <Drawer open={shareDrawerOpen} onOpenChange={setShareDrawerOpen}>
        <DrawerContent className="outline-none disable-after"
          style={{ marginBottom: "3px", borderRadius: "10px" }}
        >
          <div className="p-4">
            <div
              className="flex justify-between items-center"
              style={{ fontSize: '20px', lineHeight: '28px', color: 'rgb(38, 38, 38)', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif' }}
            >
              <h3 className="text-lg"

                style={{ fontSize: '20px', lineHeight: '28px', color: 'rgb(38, 38, 38)', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif' }}
              >
                {t("Share your convify")}
              </h3>
              <button
                onClick={() => setShareDrawerOpen(false)}
                aria-label="Close"
                style={{ fontSize: '30px', cursor: 'pointer', color: 'rgb(137, 137, 137)' }}
              >
                ×
              </button>
            </div>
            <div className="mt-4">
              <div className="flex mb-4 gap-[12px]">
                <button className="flex h-[32px] w-11 flex-[0_0_auto] cursor-pointer items-center justify-center rounded-[4px] bg-transparent text-[rgb(115,115,115)] hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                  style={{ borderRadius: "50%", backgroundColor: "rgb(47, 130, 255)", width: "44px", height: "44px", transition: 'background-color 0.2s ease 0s' }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="#FFF"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 8.04853C16 3.6032 12.4187 0 8 0C3.58133 0 0 3.6032 0 8.04853C0 12.0667 2.9248 15.3963 6.74987 16V10.3755H4.71893V8.048H6.74987V6.2752C6.74987 4.25813 7.944 3.14347 9.77173 3.14347C10.6464 3.14347 11.5627 3.3008 11.5627 3.3008V5.2816H10.5531C9.55947 5.2816 9.25013 5.9024 9.25013 6.5392V8.04853H11.4688L11.1141 10.3749H9.25013V16C13.0752 15.3963 16 12.0667 16 8.04853Z"
                      fill="#FFF"
                    ></path>
                  </svg>
                </button>
                <button className="flex h-[32px] w-11 flex-[0_0_auto] cursor-pointer items-center justify-center rounded-[4px] bg-transparent text-[rgb(115,115,115)] hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                  style={{ borderRadius: "50%", backgroundColor: "rgb(10, 102, 194)", width: "44px", height: "44px", transition: 'background-color 0.2s ease 0s' }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="#FFF"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.7778 0.888916C1.28689 0.888916 0.888916 1.28689 0.888916 1.7778V14.2222C0.888916 14.7132 1.28689 15.1111 1.7778 15.1111H14.2222C14.7132 15.1111 15.1111 14.7132 15.1111 14.2222V1.7778C15.1111 1.28689 14.7132 0.888916 14.2222 0.888916H1.7778ZM8.22149 6.30691H6.30691V13.0794H8.33865V9.82657C8.33865 8.6915 8.82559 8.00003 9.84688 8.00003C10.688 8.00003 11.0476 8.79038 11.0476 9.69112V13.0794H13.0794V9.32066C13.0794 7.30856 12.5085 6.22225 10.4625 6.22225C9.39652 6.22225 8.53438 6.7566 8.24248 7.28282H8.22149V6.30691ZM4.95241 13.0794H2.92066V6.30691H4.95241V13.0794ZM3.93653 5.20638C4.63816 5.20638 5.20638 4.63816 5.20638 3.93653C5.20638 3.23491 4.63816 2.66669 3.93653 2.66669C3.23491 2.66669 2.66669 3.23491 2.66669 3.93653C2.66669 4.63816 3.23491 5.20638 3.93653 5.20638Z"
                      fill="#FFF"
                    ></path>
                  </svg>
                </button>
                <button className="flex h-[32px] w-11 flex-[0_0_auto] cursor-pointer items-center justify-center rounded-[4px] bg-transparent text-[rgb(115,115,115)] hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                  style={{ borderRadius: "50%", backgroundColor: "rgb(30, 156, 241)", width: "44px", height: "44px", transition: 'background-color 0.2s ease 0s' }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="#FFF"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16ZM6.536 12.22C10.084 12.22 12.024 9.28 12.024 6.732C12.024 6.64801 12.024 6.56398 12.02 6.484C12.396 6.212 12.724 5.872 12.984 5.484C12.64 5.636 12.268 5.74 11.876 5.788C12.276 5.548 12.58 5.172 12.724 4.72C12.352 4.94 11.94 5.1 11.5 5.188C11.148 4.812 10.648 4.58 10.092 4.58C9.028 4.58 8.164 5.444 8.164 6.508C8.164 6.66 8.18 6.808 8.216 6.948C6.612 6.868 5.192 6.1 4.24 4.932C4.076 5.216 3.98 5.548 3.98 5.9C3.98 6.568 4.32 7.16 4.84 7.504C4.524 7.496 4.228 7.408 3.968 7.264V7.288C3.968 8.224 4.632 9 5.516 9.18C5.356 9.224 5.184 9.248 5.008 9.248C4.884 9.248 4.764 9.236 4.644 9.212C4.888 9.98 5.6 10.536 6.444 10.552C5.784 11.068 4.952 11.376 4.048 11.376C3.892 11.376 3.74 11.368 3.588 11.348C4.432 11.9 5.448 12.22 6.536 12.22Z"
                      fill="#FFF"
                    ></path>
                  </svg>
                </button>
                <button className="flex h-[32px] w-11 flex-[0_0_auto] cursor-pointer items-center justify-center rounded-[4px] bg-transparent text-[rgb(115,115,115)] hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                  style={{ borderRadius: "50%", backgroundColor: "rgb(44, 75, 255)", width: "44px", height: "44px", transition: 'background-color 0.2s ease 0s' }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="#FFF"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.96165 0L0.249512 3.47691L6.96165 6.96599L13.7461 3.47691L6.96165 0Z"
                      fill="#FFF"
                    ></path>
                    <path
                      d="M2.38244 6.53061L6.96165 8.78254L11.5891 6.53061L13.7461 7.58152L6.96165 10.8844L0.249512 7.58152L2.38244 6.53061Z"
                      fill="#FFF"
                    ></path>
                    <path
                      d="M6.96165 12.9322L2.38244 10.449L0.249512 11.6019L6.96165 15.2381L13.7461 11.6019L11.5891 10.449L6.96165 12.9322Z"
                      fill="#FFF"
                    ></path>
                  </svg>
                </button>
                <button className="flex h-[32px] w-11 flex-[0_0_auto] cursor-pointer items-center justify-center rounded-[4px] bg-transparent text-[rgb(115,115,115)] hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                  style={{ borderRadius: "50%", backgroundColor: "rgb(47, 130, 255)", width: "44px", height: "44px", transition: 'background-color 0.2s ease 0s' }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="#FFF"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.04054 4.35316L9.42089 1.91823L10.8113 3.32384L8.30856 5.69236H11.8234V7.65137H8.28638L10.8002 10.0863L9.40976 11.4587L5.995 8.03871L2.58028 11.4587L1.20105 10.0863L3.71482 7.65137H0.177734V5.69236H3.69258L1.18992 3.32384L2.56916 1.91823L4.94947 4.35316V0.888916H7.01836V4.35316H7.04054ZM4.97172 10.4626H7.04054V15.1111H4.97172V10.4626Z"
                      fill="#FFF"
                    ></path>
                  </svg>
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDesktopDrawerOpen(true)
                  setShareDrawerOpen(false)
                }}
                color="description"
                className="relative m-0 inline-block cursor-pointer border-none p-0 text-[rgb(115,115,115)] underline outline-none"
                style={{
                  fontSize: '14px',
                  color: '#737373',
                }}
              >
                {t("Customize link")}
              </button>
              <hr className="text-gray my-2" />
              <div className="flex flex-col gap-2 items-start my-5">
                <button className="flex flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-2 rounded-[4px] bg-transparent px-3 py-[6px] text-[rgb(115,115,115)] no-underline  hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                  style={{
                    fontSize: '14px',
                  }}
                >
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.898 7.18202C9.391 7.68902 8.717 7.96802 8 7.96802C7.2825 7.96802 6.6085 7.68852 6.102 7.18152L0 1.08002V10C0 11.1045 0.8955 12 2 12H14C15.1045 12 16 11.1045 16 10V1.08002L9.898 7.18202Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M7.99999 6.505C8.31649 6.505 8.63299 6.3875 8.86849 6.1525L15.0205 0H0.979492L7.13149 6.1525C7.36699 6.3875 7.68349 6.505 7.99999 6.505Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  {t("Email link")}
                </button>
                <button
                  aria-label="qr code"
                  style={{
                    fontSize: '14px',
                  }}
                  className="flex flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-2 rounded-[4px] bg-transparent px-3 py-[6px] text-[rgb(115,115,115)] no-underline hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.777832 6.11117V0.777832H6.11117V6.11117H0.777832ZM2.55561 2.55561H4.33339V4.33339H2.55561V2.55561Z"
                      fill="currentColor"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.88894 6.11117V0.777832H13.2223V6.11117H7.88894ZM9.66672 2.55561H11.4445V4.33339H9.66672V2.55561Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M7.88894 7.88894H9.66672V9.66672H7.88894V7.88894Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M11.4445 9.66672H9.66672V11.4445H7.88894V13.2223H9.66672V11.4445H11.4445V13.2223H13.2223V11.4445H11.4445V9.66672Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M11.4445 9.66672V7.88894H13.2223V9.66672H11.4445Z"
                      fill="currentColor"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.777832 13.2223V7.88894H6.11117V13.2223H0.777832ZM2.55561 9.66672H4.33339V11.4445H2.55561V9.66672Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  {t("QR Code")}
                </button>
              </div>
              <div className="p-4 rounded-[8px] bg-[rgb(240,240,240)] text-[rgb(38,38,38)]">
                <p className="mb-2 font-semibold text-sm" style={{ fontSize: '14px', color: '#262627' }}>
                  {t("Embed your convify on desktop")}
                </p>
                <p className="mb-4 text-sm" style={{ fontSize: '14px', color: '#262627' }}>
                  {t(
                    "Don't miss the full power of convify on desktop and embed directly on your site"
                  )}
                </p>
                <Button
                  className="w-full bg-[rgb(211,211,211)] hover:bg-[rgb(218,218,218)] text-[rgb(38,38,38)] text-sm"
                  onClick={() => {
                    setDesktopDrawerOpen(true)
                    setShareDrawerOpen(false)
                  }}
                  size="sm"
                >
                  {t("Continue on desktop")}
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      <ShareDrawerDesktop desktopDrawerOpen={desktopDrawerOpen} setDesktopDrawerOpen={setDesktopDrawerOpen} />
    </div>
  )
}

export default ShareFlowComponents
