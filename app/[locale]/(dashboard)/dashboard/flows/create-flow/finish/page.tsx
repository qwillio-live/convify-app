"use client"
import React, { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
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
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { z } from "zod"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { reset } from "@/lib/state/flows-state/features/theme/globalewTheme"
import { resetScreens } from "@/lib/state/flows-state/features/newScreens"
import { useRouter } from "next/navigation"
import NewFlowPreview from "@/components/flow-preview/flow-preview-new.cpmponent"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Drawer } from "@/components/ui/drawer"
import { DrawerContent } from "@/components/ui/drawerDesctop"
import { env } from "@/env.mjs"
import { Icons } from "@/components/icons"
import { setScreensData } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { setFlowSettings } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useSearchParams } from "next/navigation"

// Define Zod schema for input validation
const nameSchema = z
  .string()
  .min(1, "Name is required") // Ensure at least 1 character
  .regex(/\w/, "Name must contain at least 1 letter or number")

export default function SelectColor() {
  const t = useTranslations("Components")
  const general = useAppSelector((state) => state.newTheme?.general)
  const dispatch = useAppDispatch()
  const mobileScreen = useAppSelector((state) => state.newTheme?.mobileScreen)
  const header = useAppSelector((state) => state.newTheme?.header)
  const text = useAppSelector((state) => state.newTheme?.text)
  const templateId = useAppSelector((state) => state.newTheme?.templateId)
  const templateLink = useAppSelector((state) => state.newTheme?.templateLink)
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false) // State for loading state
  const [successMessage, setSuccessMessage] = useState("") // State for success message
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState<boolean>(true)
  const [shareDrawerOpen, setShareDrawerOpen] = useState<boolean>(false)
  const [view, setView] = useState("desktop")
  const [innerview, setInnerView] = useState("desktop")
  const [isCustomLinkOpen, setIsCustomLinkOpen] = useState(false)
  const router = useRouter()

  const handleInputChange = (event) => {
    setName(event.target.value)
    // Clear error message if user starts typing
    if (error && event.target.value.length > 0) {
      setError("")
    }
  }
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
  const handleSubmit = async () => {
    try {
      // Validate input against Zod schema
      nameSchema.parse(name)
      // Handle submission logic here (e.g., navigate to next step)
      setIsLoading(true) // Start loading
      const res = await fetch("/api/flows", {
        method: "POST",
        body: JSON.stringify({
          flowSettings: { general, mobileScreen, header, text },
          templateId,
          name,
          link: templateLink,
        }),
      }).then((res) => {
        setSuccessMessage(t("Flow created successfully!"))
        return res
      })

      const data = await res.json()
      console.log("result:", data)
      setIsLoading(false) // Stop loading
      router.push(`/dashboard/${data.id}/create-flow`)
    } catch (err) {
      setIsLoading(false) // Stop loading
      setError(t("Name is required"))
    }
  }

  useEffect(() => {
    // Function to send style updates to the iframe
    if (templateId === "") router.push("./select-template")
  }, [])
  useEffect(() => {
    updateView()
    window.addEventListener("resize", updateView)
    return () => window.removeEventListener("resize", updateView)
  }, [])

  return (
    <div className="font-poppins flex h-screen flex-col overflow-hidden tracking-wide">
      {!desktopDrawerOpen && (
        <div className="flex size-full">
          <div className="flex w-full">
            <div className="relative w-full bg-[#FAFAFA] px-6 py-10 md:w-6/12 2xl:px-10">
              <h2 className="mb-6 text-[2rem] font-semibold leading-8">
                {t("createConvify")}
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
                    <BreadcrumbLink>
                      <Link
                        href={`/dashboard/flows/create-flow/select-color?allow=${isAllowed}`}
                      >
                        {t("colorsBreadcrumb")}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{t("finishBreadcrumb")}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="mt-14 space-y-3">
                <label className="text-xl font-semibold leading-none">
                  {t("name")}
                </label>
                <div className="space-y-2">
                  <Input
                    className="h-14 w-full bg-white px-4 text-base placeholder:text-base placeholder:font-normal"
                    placeholder={t("Enter a title for your new convify")}
                    value={name}
                    onChange={handleInputChange}
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
              </div>
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
                    href={`/dashboard/flows/create-flow/select-color?allow=${isAllowed}`}
                  >
                    <Button
                      variant="outline"
                      className="h-9.5 rounded-lg px-2.5"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    className="w-[7.5rem] rounded-lg text-base font-normal text-white"
                    onClick={handleSubmit}
                    disabled={isLoading} // Disable button while loading
                  >
                    {isLoading && (
                      <div>
                        <Icons.spinner className=" z-20 mr-2 h-4 w-4 animate-spin" />
                      </div>
                    )}
                    {t("continue")}
                  </Button>
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="z-20 h-full" />
            <div className={`mx-auto w-full  md:w-6/12`}>
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
