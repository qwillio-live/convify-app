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
import { ColorPickerWithSuggestions } from "@/components/ColorPickerWithSuggestions"


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

  return (
    <div className="font-poppins flex h-screen flex-col overflow-hidden tracking-wide">
      {!desktopDrawerOpen && (
        <div className="flex size-full">
          <div className="flex w-full">
            <div className="relative w-full bg-[#FAFAFA] md:w-6/12">
              <ScrollArea className="z-20 h-full px-6 2xl:px-10 ">
                <div className="pb-24 pt-10">
                  <h2 className="mb-6 text-[2rem] font-semibold leading-8">
                    {t("customiseColor")}
                  </h2>
                  <Breadcrumb>
                    <BreadcrumbList className="text-base sm:gap-4">
                      <BreadcrumbItem>
                        <BreadcrumbLink>
                          <Link
                            href={`/dashboard/flows/create-flow/select-template?allow=${isAllowed}`}
                          >
                            {t("templateBreadcrumb")}
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{t("colorsBreadcrumb")}</BreadcrumbPage>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
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
                  <div className="mt-14 grid grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label className="block text-base font-semibold leading-none">
                        {t("primaryColor")}
                      </label>
                      <ColorPickerWithSuggestions
                        color={primaryColor}
                        onChange={handlePrimaryColor}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-base font-semibold leading-none ">
                        {t("textColor")}
                      </label>
                      <ColorPickerWithSuggestions
                        color={textColor}
                        onChange={handleTextColor}
                      />
                      {/* <NewGlobalThemeSettings /> */}
                    </div>
                    <div className="space-y-3">
                      <label className="block text-base font-semibold leading-none ">
                        {t("backgroundColor")}
                      </label>
                      <ColorPickerWithSuggestions
                        color={backgroundColor}
                        onChange={handleBackgroundColor}
                      />
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="absolute inset-x-0 bottom-0  z-30 flex items-center justify-between bg-white p-6 pt-4 2xl:px-10">
                <Link href={"/dashboard"}>
                  <Button
                    className="w-[7.5rem] rounded-lg text-base font-normal"
                    variant="outline"
                  >
                    {t("exit")}
                  </Button>
                </Link>
                <div className="flex space-x-4">
                  <Link
                    href={`/dashboard/flows/create-flow/select-template?allow=${isAllowed}`}
                  >
                    <Button
                      variant="outline"
                      className="h-9.5 rounded-lg px-2.5"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href={`/dashboard/flows/create-flow/finish?allow=${isAllowed}`}
                  >
                    <Button className="w-[7.5rem] rounded-lg text-base font-normal text-white ">
                      {t("continue")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="z-40 h-full" />
            <div className={`mx-auto w-full md:w-6/12`}>
              <ScrollArea className="z-20 h-full bg-white ">
                <NewFlowPreview />
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
