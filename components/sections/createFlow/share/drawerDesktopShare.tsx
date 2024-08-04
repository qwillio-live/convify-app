import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"
import { Button } from "@/components/ui/button"
import { env } from "@/env.mjs"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawerDesctop"

import { Minus, Plus } from "lucide-react"

import { Bar, BarChart, ResponsiveContainer } from "recharts"
import "./Share.css"

export const ShareDrawerDesktop = ({
  desktopDrawerOpen,
  setDesktopDrawerOpen,
  flowId
}) => {
  const t = useTranslations("CreateFlow.SharePage")
  const whatsAppNumber = env.NEXT_PUBLIC_WA_NUMBER
  const telegramUser = env.NEXT_PUBLIC_TL_URL
  return (
    <Drawer open={desktopDrawerOpen} onOpenChange={setDesktopDrawerOpen}>
      <DrawerContent className="disable-after outline-none">
        <div className="mx-auto w-full max-w-sm border-none ">
          <DrawerHeader style={{ alignItems: "left" }}>
            <DrawerTitle>{t("Continue on desktop")}</DrawerTitle>
            <DrawerDescription>
              {t("continue on desktop desc")}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              className=" w-full border-none bg-[rgb(38,38,39)] text-base text-white hover:bg-[rgb(71,71,71)] "
              onClick={() => setDesktopDrawerOpen(false)}
            >
              <svg
                className="mr-2.5"
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.898 7.182C9.391 7.689 8.717 7.968 8 7.968C7.2825 7.968 6.6085 7.6885 6.102 7.1815L0 1.08V10C0 11.1045 0.8955 12 2 12H14C15.1045 12 16 11.1045 16 10V1.08L9.898 7.182Z"></path>
                <path d="M8 6.505C8.3165 6.505 8.633 6.3875 8.8685 6.1525L15.0205 0H0.9795L7.1315 6.1525C7.367 6.3875 7.6835 6.505 8 6.505Z"></path>
              </svg>
              {t("Email me a direct link")}
            </Button>
            <Button variant={"green"} className=" w-full text-base text-white"
            onClick={() => window.open(`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
              `${t("I would like to get link for my flow")}=${flowId}`
            )}`, '_blank')}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-1 -1 16 16"
                width="1.5em"
                height="1.2em"
              >
                <g fill="none" stroke="currentColor">
                  <path d="M7 .88C3.665.88.88 3.67.88 7.002a6.14 6.14 0 0 0 1.025 3.39L.877 13.127l3.439-.622A6.13 6.13 0 0 0 7 13.121c3.338.002 6.127-2.784 6.127-6.118c0-3.33-2.79-6.126-6.127-6.124Z"></path>
                  <path d="M7.337 9.7c.829.531 1.692.144 2.294-.305c.415-.31.402-.907.047-1.285l-.7-.745c-.265.265-.783.397-1.142.287c-.773-.235-1.097-.637-1.36-1.047c-.301-.47.04-1.172.305-1.437l-.78-.712c-.329-.3-.828-.35-1.115-.01c-.568.673-.92 1.696-.503 2.347c.75 1.169 1.785 2.156 2.954 2.906Z"></path>
                </g>
              </svg>
              <span className="ml-2 mr-4"> {t("Send on WhatsApp")}</span>
            </Button>
            <Button
              variant={"lightBlue"}
              className="mb-2 w-full text-base text-white"
              onClick={() => window.open(`https://telegram.me/share/url?url=${encodeURIComponent(
                telegramUser
              )}&text=${encodeURIComponent(
                `${t("I would like to get link for my flow")}=${flowId}`
              )}`, '_blank')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-1 -1 16 16"
                width="1.5em"
                height="1.2em"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M.25 7a6.75 6.75 0 1 1 13.5 0A6.75 6.75 0 0 1 .25 7m9.002 4.064l1.045-7.932l-8.165 3.935l2.417.876l2.686-2.076a.5.5 0 1 1 .611.792L5.618 8.38v2.726l1.685-1.604z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="ml-2 mr-5"> {t("Send on Telegram")}</span>
            </Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full bg-[rgb(227,227,227)] text-base hover:bg-[rgb(227,227,227)]"
                onClick={() => setDesktopDrawerOpen(false)}
              >
                {t("Dismiss")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
