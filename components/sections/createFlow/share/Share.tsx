"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { LucideCross } from "lucide-react"

import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"

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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
import notPublishedImg from "@/assets/images/share-nopublish.svg"
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
  const [messageId, setMessageId] = useState(1)
  const messages = {
    1: "Create a custom link",
    2: "Create a custom email link",
    3: "Create a custom QR code",
  }
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
  const whatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || 380937064139
  const telegramUser =
    process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "sofiaai_admin"
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
            setMessageId={setMessageId}
            isPublished={isPublished}
            link={link}
            t={t}
          />

          <div className="h-full flex-1 px-10 pt-8">
            {/* Main Content */}
            <div className="flex  h-full flex-col">
              <div className="flex min-w-0 !flex-[1_0_auto] flex-col items-center">
                <div
                  className="relative w-full flex-[1_0_auto] transition-[width] duration-300 ease-in will-change-[width]"
                  style={{
                    maxWidth: view === "desktop" ? "100%" : "360px",
                  }}
                >
                  {!!isPublished ? (
                    <iframe
                      src={link ? link : "https://convify.io/survey"}
                      frameBorder="0"
                      className="size-full rounded-[20px] border border-[#E9E9E9]"
                      style={{ background: "#e21af3 !important" }}
                    ></iframe>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center rounded-[20px] border border-[#E9E9E9] bg-white">
                      <div className="z-100 absolute top-8 flex h-[46px] flex-nowrap items-center whitespace-nowrap rounded-full bg-[#E37400] pl-6 pr-8 text-sm text-white">
                        <span className="flex flex-nowrap items-center gap-1.5">
                          <TriangleAlert className="-mr-1.5 -mt-0.5 h-3.5" />{" "}
                          {t("This flow is not published yet")}{" "}
                          <Link className="underline" href="#">
                            {t("Click here to publish the latest version")}
                          </Link>{" "}
                          {t("before you share your flow")}
                        </span>
                      </div>
                      <div className="h-fit">
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
      {/* {isCustomLinkOpen && (
        // <div className="fixed inset-0 z-[99] flex size-full items-center justify-center bg-[rgba(227,227,227,.8)] text-sm text-[rgb(38,38,39)] transition-all">
        //   <div className="flex size-full items-center justify-center  from-white/0 to-white/90">
        //     <div className="z-[1] flex w-[512px] flex-col items-center p-8">
        //       <div className="min-h-0 min-w-0 shrink-0 pb-2">
        //         <span className="block text-center text-4xl font-light">
        //           {t(messages[messageId])}
        //         </span>
        //       </div>
        //       <div className="mb-10"></div>
        //       <div className="min-h-0 min-w-0 shrink-0 pb-6">
        //         <span className="block text-center text-sm font-medium text-[rgb(2,80,65)]">
         {t(messages[messageId])}
        //           {t("Available on these plans: Plus, Business, Enterprise")}
         {t("Upgrade my plan")}
        //         </span>
        //       </div>
        //       <div className="flex size-full items-center justify-center">
        //         <button className="relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-[4px] border-0 bg-[rgb(2,100,81)] px-4 py-2 text-base text-white no-underline transition-all duration-300 hover:bg-[rgb(40,123,107)]">
        //           <div className="flex">
        //             <span className="block flex-[0_0_auto]">
        //               {t("Upgrade my plan")}
        //             </span>
        //           </div>
        //         </button>
        //       </div>
        //     </div>
        //   </div>
        //   <button
        //     aria-label="Close dialog"
        //     color="#737373"
        //     data-qa="upgrade-nag-screen-close-button"
        //     className="fixed right-2 top-2 size-10 cursor-pointer border border-solid border-transparent bg-transparent p-0 outline-none transition-all duration-300"
        //   >
        //     <div className="flex size-auto items-center justify-center ">
        //       <span
        //         onClick={() => setIsCustomLinkOpen(false)}
        //         className="cursor-pointer"
        //       >
        //         {" "}
        //         <svg
        //           width="28px"
        //           height="28px"
        //           viewBox="0 0 16 16"
        //           xmlns="http://www.w3.org/2000/svg"
        //           fill="#000000"
        //         >
        //           <path
        //             fillRule="evenodd"
        //             clipRule="evenodd"
        //             d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"
        //           />
        //         </svg>
        //       </span>
        //     </div>
        //   </button>
        // </div>
        // <Dialog>
        //   <DialogTrigger asChild>
        //     <Button variant="outline">Share</Button>
        //   </DialogTrigger>
        //   <DialogContent className="sm:max-w-md">
        //     <DialogHeader>
        //       <DialogTitle>Share link</DialogTitle>
        //       <DialogDescription>
        //         Anyone who has this link will be able to view this.
        //       </DialogDescription>
        //     </DialogHeader>
        //     <div className="flex items-center space-x-2">
        //       <div className="grid flex-1 gap-2">
        //         <Label htmlFor="link" className="sr-only">
        //           Link
        //         </Label>
        //         <Input
        //           id="link"
        //           defaultValue="https://ui.shadcn.com/docs/installation"
        //           readOnly
        //         />
        //       </div>
        //     </div>
        //     <DialogFooter className="sm:justify-start">
        //       <DialogClose asChild>
        //         <Button type="button" variant="secondary">
        //           Close
        //         </Button>
        //       </DialogClose>
        //     </DialogFooter>
        //   </DialogContent>
        // </Dialog>
      )} */}

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
                  onClick={() => {
                    setIsCustomLinkOpen(true)
                    setMessageId(2)
                  }}
                  className="h-9 cursor-pointer gap-1 rounded-md border border-[#E6E2DD] px-4 text-sm font-normal text-[#23262C]"
                >
                  <Mail className="h-4" />
                  {t("Email link")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCustomLinkOpen(true)
                    setMessageId(3)
                  }}
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

const HeaderComponent = ({
  setIsCustomLinkOpen,
  isPublished,
  link,
  t,
  setMessageId,
}) => {
  const messages = {
    1: "Create a custom link",
    2: "Create a custom email link",
    3: "Create a custom QR code",
  }
  return (
    <div className="flex h-[88px] items-center justify-between border-b border-[#E6E2DD] bg-white px-2 md:px-10">
      <div className="flex w-full max-w-[480px] items-center">
        <input
          type="text"
          aria-label="copy link input"
          className="h-10 w-full rounded-lg border border-[#E6E2DD] pl-4 text-base text-[#23262C] outline-none"
          value={link !== "" ? link : "https://convify.app/your-link-here"}
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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                setIsCustomLinkOpen(true)
                setMessageId(1)
              }}
              className="h-10 cursor-pointer gap-1 rounded-lg border border-[#E6E2DD] px-4 text-base font-normal"
            >
              <PenLine className="h-4" />
              {t("Customize link")}
            </Button>
          </DialogTrigger>
          <DialogContent
            className="flex h-[308px] w-[434px] justify-center !rounded-[12px]"
            dialogueClassname="bg-[#9C9C9E]/80 backdrop-blur-0"
          >
            <DialogHeader>
              <DialogTitle className="relative left-[2.5rem] flex justify-end">
                <DialogClose asChild>
                  <Button
                    className="!hover:bg-transparent"
                    type="button"
                    variant="ghost"
                  >
                    <X className="size-5" color="#7B7D80" />
                  </Button>
                </DialogClose>
              </DialogTitle>
              <DialogDescription className=" flex-wrap content-center items-center  text-base font-normal">
                <span className="!font-poppins mb-3 flex justify-center space-x-8 text-[32px] font-semibold leading-[48px] tracking-wide text-[#23262C]">
                  {t(messages[1])}
                </span>
                <span className="!font-poppins mx-auto mb-8 flex w-[290px] flex-wrap items-center justify-center text-center text-[#505050]">
                  {t("Available on these plans: Plus, Business, Enterprise")}
                </span>
                <div className="flex w-full justify-center">
                  <Button className="mx-auto h-[48px] w-[298px] !font-poppins text-[16px] ">
                    {t("Upgrade my plan")}
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                setIsCustomLinkOpen(true)
                setMessageId(2)
              }}
              className="h-10 cursor-pointer gap-1 rounded-lg border border-[#E6E2DD] px-4 text-base font-normal"
            >
              <Mail className="h-4" />
              {t("Email link")}
            </Button>
          </DialogTrigger>
          <DialogContent
            className="flex h-[308px] min-w-[434px] justify-center !rounded-[12px]"
            dialogueClassname="bg-[#9C9C9E]/80 backdrop-blur-0"
          >
            <DialogHeader>
              <DialogTitle className="relative left-[2.5rem] flex justify-end">
                <DialogClose asChild>
                  <Button
                    className="!hover:bg-transparent"
                    type="button"
                    variant="ghost"
                  >
                    <X className="size-5" color="#7B7D80" />
                  </Button>
                </DialogClose>
              </DialogTitle>
              <DialogDescription className=" flex-wrap content-center items-center  text-base font-normal ">
                <span className="!font-poppins mb-3 flex justify-center space-x-8 text-[32px] font-semibold leading-[48px] tracking-wide text-[#23262C]">
                  {t(messages[2])}
                </span>
                <span className="mx-auto mb-8 flex w-[290px] flex-wrap items-center justify-center text-center !font-poppins">
                  {t("Available on these plans: Plus, Business, Enterprise")}
                </span>
                <div className="flex w-full justify-center">
                  <Button className="mx-auto h-[48px] w-[298px] !font-poppins text-[16px] ">
                    {t("Upgrade my plan")}
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                setIsCustomLinkOpen(true)
                setMessageId(3)
              }}
              className="h-10 cursor-pointer gap-1 rounded-lg border border-[#E6E2DD] px-4 text-base font-normal"
            >
              <QrCode className="h-4" />
              {t("QR Code")}
            </Button>
          </DialogTrigger>
          <DialogContent
            className="flex h-[308px] min-w-[434px] justify-center !rounded-[12px]"
            dialogueClassname="bg-[#9C9C9E]/80 backdrop-blur-0"
          >
            <DialogHeader>
              <DialogTitle className="relative left-[2.5rem] flex justify-end">
                <DialogClose asChild>
                  <Button
                    className="!hover:bg-transparent"
                    type="button"
                    variant="ghost"
                  >
                    <X className="size-5" color="#7B7D80" />
                  </Button>
                </DialogClose>
              </DialogTitle>
              <DialogDescription className=" flex-wrap content-center items-center  text-base font-normal ">
                <span className="!font-poppins mb-3 flex justify-center space-x-8 text-[32px] font-semibold leading-[48px] tracking-wide text-[#23262C]">
                  {t(messages[3])}
                </span>
                <span className="mx-auto mb-8 flex w-[290px] flex-wrap items-center justify-center text-center !font-poppins">
                  {t("Available on these plans: Plus, Business, Enterprise")}
                </span>
                <div className="flex w-full justify-center">
                  <Button className="mx-auto h-[48px] w-[298px] !font-poppins text-[16px] ">
                    {t("Upgrade my plan")}
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
