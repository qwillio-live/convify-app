"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"
import { Button } from "@/components/ui/button"
import facebook from "@/assets/icons/facebook.png"
import linkedin from "@/assets/icons/linkedin.png"
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
import { env } from "@/env.mjs"
import {
  Mail,
  Minus,
  PenLine,
  Plus,
  QrCode,
  TriangleAlert,
  X,
} from "lucide-react"

import { Bar, BarChart, ResponsiveContainer } from "recharts"
import "./Share.css"
import { ShareDrawerDesktop } from "./drawerDesktopShare"
import Image from "next/image"
import TelegramPic from "@/assets/images/telegram_pic.png"
import WhatsAppPic from "@/assets/images/whatsapp-removebg-preview.png"
import notPublishedImg from "@/assets/images/share-nopublish.png"
import { FbIcon, LnIcon, TgIcon, WpIcon } from "./assets"
const ShareFlowComponents = ({
  isPublished,
  data,
  flowId,
}: {
  isPublished: boolean
  data: any
  flowId?: string
}) => {
  const [view, setView] = useState("desktop")
  const [innerview, setInnerView] = useState("desktop")
  const [isCustomLinkOpen, setIsCustomLinkOpen] = useState(false)
  const [link, setLink] = useState(() => {
    return data && data.link ? data.link : "https://convify.io/survey-es"
  })
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState<boolean>(false)
  const [shareDrawerOpen, setShareDrawerOpen] = useState<boolean>(false)
  const updateView = () => {
    if (window.innerWidth >= 1024) {
      setShareDrawerOpen(false)
      setView("desktop")
      setInnerView("desktop")
    } else {
      setView("mobile")
      setInnerView("mobile")
      setShareDrawerOpen(true)
    }
  }

  useEffect(() => {
    updateView()
    window.addEventListener("resize", updateView)
    return () => window.removeEventListener("resize", updateView)
  }, [])
  const t = useTranslations("Components")
  const whatsAppNumber = env.NEXT_PUBLIC_WA_NUMBER
  const telegramUser = env.NEXT_PUBLIC_TL_URL

  useEffect(() => {
    if (data) {
      setLink(data.link)
    }
  }, [])

  return (
    <div className="font-poppins flex h-[calc(100vh-60px)] flex-col">
      {innerview === "desktop" && (
        <>
          <HeaderComponent
            setIsCustomLinkOpen={setIsCustomLinkOpen}
            isPublished={isPublished}
            link={link}
            t={t}
          />

          <div className="h-full flex-1 px-10 pt-8">
            {/* Main Content */}
            <div className="flex  h-full flex-col">
              <div className="flex min-w-0 !flex-[1_0_auto] flex-col items-center">
                <div
                  className="w-full flex-[1_0_auto] overflow-hidden rounded-[20px] border border-[#E9E9E9] transition-[width] duration-300 ease-in will-change-[width]"
                  style={{
                    maxWidth: view === "desktop" ? "100%" : "360px",
                  }}
                >
                  {isPublished ? (
                    <iframe
                      src={link ? link : "https://convify.io/survey"}
                      frameBorder="0"
                      className="size-full"
                      style={{ background: "#e21af3 !important" }}
                    ></iframe>
                  ) : (
                    <div className="flex h-full flex-col items-center bg-white pt-8">
                      <div className="absolute flex h-[46px] flex-nowrap items-center whitespace-nowrap rounded-full bg-[#E37400] pl-6 pr-8 text-sm text-white">
                        <span className="flex flex-nowrap items-center gap-1.5">
                          <TriangleAlert className="-mr-1.5 -mt-0.5 h-3.5" />{" "}
                          {t("This flow is not published yet")}{" "}
                          <Link className="underline" href="#">
                            {t("Click here to publish the latest version")}
                          </Link>{" "}
                          {t("before you share your flow")}
                        </span>
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2">
                        <Image
                          src={notPublishedImg}
                          height={500}
                          width={800}
                          className="h-[240px] w-[334px]"
                          alt="not published"
                        />
                        <div className="mt-3">
                          <h2 className="text-center text-lg font-semibold text-[#23262C]">
                            {t("Your flow isn’t published")}
                          </h2>
                          <p className="mt-1 text-center text-base text-[#505050]">
                            {t("Publish to preview it here")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <FooterComponent
            isPublished={isPublished}
            view={view}
            setView={setView}
            t={t}
          />
        </>
      )}
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
        <DrawerContent className="disable-after font-poppins m-2 rounded-[12px] outline-none">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#23262C]">
                {t("Share your convify")}
              </h3>
              <button
                onClick={() => setShareDrawerOpen(false)}
                aria-label="Close"
                className=""
              >
                <X className="h-5 text-[#7B7D80]" />
              </button>
            </div>
            <div className="mt-4">
              <div className="mb-3 grid grid-cols-4 gap-2">
                <Link
                  href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
                    `${t("I would like to get link for my flow")}=${flowId}`
                  )}`}
                  target="_blank"
                  className="flex h-10 w-full items-center justify-center rounded-md bg-[#25D366]"
                >
                  <WpIcon />
                </Link>
                <Link
                  href={`https://telegram.me/share/url?url=${encodeURIComponent(
                    telegramUser
                  )}&text=${encodeURIComponent(
                    `${t("I would like to get link for my flow")}=${flowId}`
                  )}`}
                  target="_blank"
                  className="flex h-10 w-full items-center justify-center rounded-md bg-[#027BB7]"
                >
                  <TgIcon />
                </Link>
                <button className="flex h-10 w-full items-center justify-center rounded-md  bg-[#0A66C2]">
                  <Image
                    src={facebook}
                    className="h-4 w-4"
                    height={60}
                    width={60}
                    alt="facebook"
                  />
                </button>
                <button className="flex h-10 w-full items-center justify-center rounded-md bg-[#0A66C2]">
                  <Image
                    src={linkedin}
                    className="h-4 w-4"
                    height={60}
                    width={60}
                    alt="linkedin"
                  />
                </button>
              </div>

              <Button
                type="button"
                onClick={() => {
                  setDesktopDrawerOpen(true)
                  setShareDrawerOpen(false)
                }}
                variant="outline"
                className="h-9 w-full cursor-pointer gap-1 rounded-md border border-[#E6E2DD] px-4 text-sm font-normal text-[#23262C]"
              >
                <PenLine className="h-4" />
                {t("Customize link")}
              </Button>

              <hr className="my-4 border-b border-t border-b-[#EAEAEC] border-t-transparent" />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCustomLinkOpen(true)}
                  className="h-9 cursor-pointer gap-1 rounded-md border border-[#E6E2DD] px-4 text-sm font-normal text-[#23262C]"
                >
                  <Mail className="h-4" />
                  {t("Email link")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCustomLinkOpen(true)}
                  className="h-9 cursor-pointer gap-1 rounded-md border border-[#E6E2DD] px-4 text-sm font-normal text-[#23262C]"
                >
                  <QrCode className="h-4" />
                  {t("QR Code")}
                </Button>
              </div>

              <div className="mt-12 rounded-lg border border-[#E6E2DD] bg-[#FAFAFA] p-5">
                <h2 className="mb-1 text-sm font-semibold text-[#23262C]">
                  {t("Embed your convify on desktop")}
                </h2>
                <p className="mb-3 text-xs text-[#505050]">
                  {t(
                    "Don't miss the full power of convify on desktop and embed directly on your site"
                  )}
                </p>
                <Button
                  className="h-[38px] w-full rounded-md bg-[#23262C]/[56%] text-sm font-normal text-white"
                  onClick={() => {
                    setDesktopDrawerOpen(true)
                    setShareDrawerOpen(false)
                  }}
                  style={{ fontWeight: "400 !important" }}
                  size="sm"
                >
                  {t("Continue on desktop")}
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      <ShareDrawerDesktop
        desktopDrawerOpen={desktopDrawerOpen}
        setDesktopDrawerOpen={setDesktopDrawerOpen}
        flowId={flowId}
      />
    </div>
  )
}

export default ShareFlowComponents

const HeaderComponent = ({ setIsCustomLinkOpen, isPublished, link, t }) => {
  return (
    <div className="flex h-[88px] items-center justify-between border-b border-[#E6E2DD] bg-white px-2 md:px-10">
      <div className="flex w-full max-w-[480px] items-center">
        <input
          type="text"
          aria-label="copy link input"
          className="h-10 w-full rounded-lg border border-[#E6E2DD] pl-4 text-base text-[#23262C] outline-none"
          value={isPublished ? link : "https://convify.app/your-link-here"}
        />
        <Button
          onClick={() => {
            isPublished && navigator.clipboard.writeText(link)
            isPublished &&
              toast({
                title: t("Link copied to clipboard"),
              })
          }}
          className={`font-sm -ml-3 h-10 cursor-pointer rounded-md bg-opacity-100 font-medium text-white ${
            isPublished ? "bg-[#23262C]" : "pointer-events-none bg-[#848589]"
          }`}
        >
          {t("Copy link")}
        </Button>
      </div>
      <div className="flex items-center gap-2 text-[#23262C]">
        <Button
          variant="outline"
          onClick={() => setIsCustomLinkOpen(true)}
          className="h-10 cursor-pointer gap-1 rounded-lg border border-[#E6E2DD] px-4 text-base font-normal"
        >
          <PenLine className="h-4" />
          {t("Customize link")}
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsCustomLinkOpen(true)}
          className="h-10 cursor-pointer gap-1 rounded-lg border border-[#E6E2DD] px-4 text-base font-normal"
        >
          <Mail className="h-4" />
          {t("Email link")}
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsCustomLinkOpen(true)}
          className="h-10 cursor-pointer gap-1 rounded-lg border border-[#E6E2DD] px-4 text-base font-normal"
        >
          <QrCode className="h-4" />
          {t("QR Code")}
        </Button>
      </div>
    </div>
  )
}

const FooterComponent = ({ isPublished, view, setView, t }) => {
  return (
    <>
      {!isPublished && (
        <div className="mt-5 flex w-full items-end justify-center pb-2">
          <Tabs defaultValue={view} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2 bg-inherit">
              <TabsTrigger
                value="desktop"
                onClick={() => setView("desktop")}
                className="rounded-none border-b-2 border-transparent px-3 text-base font-medium uppercase text-[#9B9A99] shadow-none data-[state=active]:border-current data-[state=active]:bg-inherit data-[state=active]:font-semibold data-[state=active]:text-[#23262C] data-[state=active]:shadow-none md:border-b-4"
              >
                {t("Desktop")}
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
                onClick={() => setView("mobile")}
                className="rounded-none border-b-2 border-transparent px-3 text-base font-medium uppercase text-[#9B9A99] shadow-none data-[state=active]:border-current data-[state=active]:bg-inherit data-[state=active]:font-semibold data-[state=active]:text-[#23262C] data-[state=active]:shadow-none md:border-b-4"
              >
                {t("Mobile")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {isPublished && (
        <div className="relative mt-5 flex w-full items-end justify-center pb-2">
          <Tabs defaultValue={view} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2 bg-inherit">
              <TabsTrigger
                value="desktop"
                onClick={() => setView("desktop")}
                className="rounded-none border-b-2 border-transparent px-3 text-base font-medium uppercase text-[#9B9A99] shadow-none data-[state=active]:border-current data-[state=active]:bg-inherit data-[state=active]:font-semibold data-[state=active]:text-[#23262C] data-[state=active]:shadow-none md:border-b-4"
              >
                {t("Desktop")}
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
                onClick={() => setView("mobile")}
                className="rounded-none border-b-2 border-transparent px-3 text-base font-medium uppercase text-[#9B9A99] shadow-none data-[state=active]:border-current data-[state=active]:bg-inherit data-[state=active]:font-semibold data-[state=active]:text-[#23262C] data-[state=active]:shadow-none md:border-b-4"
              >
                {t("Mobile")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
    </>
  )
}
