"use client"
import React, { useCallback, useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { HexColorPicker } from "react-colorful"
import tinycolor from "tinycolor2"
import { debounce, throttle } from "lodash"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import {
  setNewBackgroundColor,
  setNewFlowSettings,
  setNewPartialSyles,
  setNewPrimaryColor,
  setNewTextColor,
} from "@/lib/state/flows-state/features/theme/globalewTheme"
import FlowPreview from "@/components/flow-preview/flow-preview.component"
import { setScreensData } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import ResolvedComponentsFromCraftState from "@/components/user/settings/resolved-components"
import { setNewScreensData } from "@/lib/state/flows-state/features/newScreens"
import NewFlowPreview from "@/components/flow-preview/flow-preview-new.cpmponent"
import {
  setBackgroundColors,
  setPartialStyles,
  setPrimaryColors,
  setTextColors,
} from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { NewGlobalThemeSettings } from "@/components/user/settings/global-theme-settings-new"
import { GlobalThemeSettings } from "@/components/user/settings/global-theme-settings"
import { useRouter, useSearchParams } from "next/navigation"
import { Drawer } from "@/components/ui/drawer"
import { DrawerContent } from "@/components/ui/drawerDesctop"
import { env } from "@/env.mjs"
import { ShareDrawerDesktop } from "@/components/sections/createFlow/share/drawerDesktopShare"

const ColorPicker = ({ color, onChange }) => {
  const t = useTranslations("Components")
  return (
    <div className="color-picker">
      <HexColorPicker color={color} onChange={onChange} />
      <div className="color-text-container">
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="color-text font-sans3 font-xs font-normal text-[#191919]"
        />
      </div>
      <Separator className="mt-3" />
      <span className="font-sans3 mt-2 flex w-full justify-start text-xs font-normal tracking-wide text-[#919191]">
        {t("suggestions")}
      </span>
      <style jsx>{`
        .color-picker {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .color-picker .react-colorful__saturation,
        .color-picker .react-colorful__hue {
          height: 5px !important;
        }
        .color-picker .react-colorful__pointer {
          background: white;
          border-radius: 50%;
        }
        .color-text-container {
          margin-top: 10px;
          background: white;
          border: 1px solid #e9e9e9;
          border-radius: 3px;
          padding: 4px;
          display: flex;
          width: 100%;
          justify-content: center;
        }
        .color-text {
          width: 100%;
          text-align: center;
          border: none;
          outline: none;
        }
      `}</style>
    </div>
  )
}

const ColorPickerWithSuggestions = ({ color, onChange }) => {
  const generateSuggestions = (baseColor) => {
    const colorObj = tinycolor(baseColor)
    return [
      colorObj.darken(10).toHexString(),
      colorObj.desaturate(10).toHexString(),
      colorObj.lighten(5).toHexString(),
      colorObj.lighten(20).toHexString(),
      colorObj.lighten(10).toHexString(),
    ]
  }

  const suggestions = generateSuggestions(color)

  return (
    <div className="color-picker-wrapper">
      <ColorPicker color={color} onChange={onChange} />
      <div className="suggestions">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="suggestion"
            style={{ backgroundColor: suggestion }}
            onClick={() => onChange(suggestion)}
          />
        ))}
      </div>
      <style jsx>{`
        .color-picker-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #e9e9e9;
          border-radius: 8px;
          padding: 9px;
          background-color: #fff;
        }
        .suggestions {
          display: flex;
          justify-content: center;
          margin-top: 8px;
        }
        .suggestion {
          width: 45px;
          height: 40px;
          border: 1px solid #e9e9e9;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default function SelectColor() {
  const templateSetting = useAppSelector((state) => state.newTheme)
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState<boolean>(true)
  const [shareDrawerOpen, setShareDrawerOpen] = useState<boolean>(false)
  const [view, setView] = useState("desktop")
  const [innerview, setInnerView] = useState("desktop")
  const [isCustomLinkOpen, setIsCustomLinkOpen] = useState(false)
  const query = useSearchParams()
  const isAllowed = query?.get("allow") || false
  const updateView = () => {
    if (window.innerWidth >= 1024) {
      setDesktopDrawerOpen(false)
      setView("desktop")
      setInnerView("desktop")
    } else {
      setView("mobile")
      setInnerView("mobile")
      if (isAllowed) setDesktopDrawerOpen(false)
      else router.push("/mobile")
    }
  }
  const dispatch = useAppDispatch()
  const router = useRouter()
  console.log("localFlowSettings", templateSetting)

  const [primaryColor, setPrimaryColor] = useState(
    templateSetting?.general?.primaryColor
  )
  const [textColor, setTextColor] = useState(
    templateSetting?.text?.primaryColor
  )
  const [backgroundColor, setBackgroundColor] = useState(
    templateSetting?.general?.backgroundColor
  )
  const handleBackgroundColor = (e) => {
    setBackgroundColor(e)
    dispatch(setNewBackgroundColor(e))
  }
  const handlePrimaryColor = (e) => {
    setPrimaryColor(e)
    dispatch(setNewPrimaryColor(e))
  }
  const handleTextColor = (e) => {
    setTextColor(e)
    dispatch(setNewTextColor(e))
  }

  const t = useTranslations("Components")
  const updateIframeStyles = async () => {
    const response = await fetch(
      `/api/templates/${templateSetting?.templateId}/templateWithSteps`
    )
    const flowData = await response.json()
    console.log("flowData", flowData)
    dispatch(setNewScreensData(flowData))
  }
  useEffect(() => {
    // Function to send style updates to the iframe
    if (templateSetting?.templateId === "") router.push("./select-template")
    else updateIframeStyles()
  }, [])

  useEffect(() => {
    updateView()
    window.addEventListener("resize", updateView)
    return () => window.removeEventListener("resize", updateView)
  }, [])
  /** GENERAL STYLES */

  const defaultPrimaryColor = useAppSelector(
    (state) => state?.newTheme?.defaultGeneral?.primaryColor
  )
  const secondaryColor = useAppSelector(
    (state) => state?.newTheme?.general?.secondaryColor
  )
  const defaultSecondaryColor = useAppSelector(
    (state) => state?.newTheme?.defaultGeneral?.secondaryColor
  )

  const backgroundImage = useAppSelector(
    (state) => state?.newTheme?.general?.backgroundImage
  )
  const defaultBackgroundColor = useAppSelector(
    (state) => state?.newTheme?.defaultGeneral?.backgroundColor
  )

  const headerPosition = useAppSelector(
    (state) => state?.newTheme?.header?.headerPosition
  )

  /** TEXT STYLES */
  const primaryFonts = useAppSelector((state) => state?.newTheme?.primaryFonts)
  const secondaryFonts = useAppSelector(
    (state) => state?.newTheme?.secondaryFonts
  )
  const primaryFont = useAppSelector(
    (state) => state?.newTheme?.text?.primaryFont
  )
  const defaultPrimaryFont = useAppSelector(
    (state) => state?.newTheme?.defaultText?.primaryFont
  )
  const secondaryFont = useAppSelector(
    (state) => state?.newTheme?.text?.secondaryFont
  )
  const defaultSecondaryFont = useAppSelector(
    (state) => state?.newTheme?.defaultText?.secondaryFont
  )
  const primaryTextColor = useAppSelector(
    (state) => state?.newTheme?.text?.primaryColor
  )
  const defaultPrimaryTextColor = useAppSelector(
    (state) => state?.newTheme?.defaultText?.primaryColor
  )
  const secondaryTextColor = useAppSelector(
    (state) => state?.newTheme?.text?.secondaryColor
  )
  const defaultSecondaryTextColor = useAppSelector(
    (state) => state?.newTheme?.defaultText?.secondaryColor
  )
  const screens = useAppSelector((state) => state?.screen?.screens)

  console.log("templateid", templateSetting?.templateId)
  const whatsAppNumber = env.NEXT_PUBLIC_WA_NUMBER
  const telegramUser = env.NEXT_PUBLIC_TL_URL
  return (
    <div className="font-sans3 flex h-screen flex-col overflow-hidden tracking-wide">
      {!desktopDrawerOpen && (
        <div className="flex h-full w-full pl-12">
          <div className="flex w-full">
            <div className="w-full   md:w-6/12">
              <ScrollArea className="z-20 h-full pb-9  ">
                <h2 className="mb-5 mt-9 text-4xl font-semibold">
                  {t("customiseColor")}
                </h2>
                <Breadcrumb className=" mt-4 text-base font-normal hover:cursor-pointer">
                  <BreadcrumbList>
                    <BreadcrumbItem className="mr-2 text-base">
                      <BreadcrumbLink>
                        <Link
                          href={`/dashboard/flows/create-flow/select-template?allow=${isAllowed}`}
                        >
                          {t("templateBreadcrumb")}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem className="mx-2 text-base">
                      <BreadcrumbPage className="font-semibold">
                        {t("colorsBreadcrumb")}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem className="mx-2 text-base">
                      <BreadcrumbLink>
                        <Link
                          href={`/dashboard/flows/create-flow/finish?allow=${isAllowed}`}
                        >
                          {t("finishBreadcrumb")}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                {/* <ScrollArea className="max-h-[calc(100vh - 350px)] h-[38rem] "> */}
                <div className="mb-8 mt-10 flex flex-wrap gap-3 ">
                  <div className="flex flex-col">
                    <label className="my-3 block text-base font-semibold ">
                      {t("primaryColor")}
                    </label>
                    <ColorPickerWithSuggestions
                      color={primaryColor}
                      onChange={handlePrimaryColor}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="my-3 block text-base font-semibold ">
                      {t("textColor")}
                    </label>
                    <ColorPickerWithSuggestions
                      color={textColor}
                      onChange={handleTextColor}
                    />
                    {/* <NewGlobalThemeSettings /> */}
                  </div>
                  <div className="flex flex-col">
                    <label className="my-3 block text-base font-semibold ">
                      {t("backgroundColor")}
                    </label>
                    <ColorPickerWithSuggestions
                      color={backgroundColor}
                      onChange={handleBackgroundColor}
                    />
                  </div>
                </div>
              </ScrollArea>
            </div>

            <Separator orientation="vertical" className="z-40 h-full" />
            <div className={`mx-auto w-full  md:w-6/12`}>
              <ScrollArea className="z-20 h-full bg-white ">
                <NewFlowPreview />
              </ScrollArea>
            </div>
          </div>
          <div className="fixed bottom-0 left-4 z-30 flex w-full items-center justify-between bg-white px-6 py-3 pr-11  md:w-6/12">
            <Link
              href={`/dashboard/flows/create-flow/select-template?allow=${isAllowed}`}
            >
              <Button
                variant="secondary"
                size="icon"
                className="hover:cursor-pointer"
              >
                <ChevronLeft className="z-10 h-4 w-4" />
              </Button>
            </Link>

            <div className="flex">
              <Link href={"/dashboard"}>
                <Button
                  className="mr-2 w-32 font-bold hover:cursor-pointer"
                  size="lg"
                  variant="outline"
                >
                  {t("exit")}
                </Button>
              </Link>
              <Link
                href={`/dashboard/flows/create-flow/finish?allow=${isAllowed}`}
              >
                <Button
                  className="w-32 font-bold text-white hover:cursor-pointer"
                  size="lg"
                  variant="default"
                >
                  {t("continue")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
