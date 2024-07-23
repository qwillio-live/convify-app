"use client"
import React, { useState } from "react"
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
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false) // State for loading state
  const [successMessage, setSuccessMessage] = useState("") // State for success message
  const router = useRouter()

  const handleInputChange = (event) => {
    setName(event.target.value)
    // Clear error message if user starts typing
    if (error && event.target.value.length > 0) {
      setError("")
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
        }),
      }).then((res) => {
        setSuccessMessage(t("Flow created successfully!"))
        return res
      })

      const data = await res.json()
      console.log("result:", data)
      setIsLoading(false) // Stop loading

      dispatch(reset())
      dispatch(resetScreens())

      // Set success message and navigate to dashboard after some time (simulating a delay)
      setTimeout(() => {
        router.push(`/dashboard/${data.id}/create-flow`)
      }, 2000) // Navigate after 2 seconds
    } catch (err) {
      setIsLoading(false) // Stop loading
      setError(t("Name is required"))
    }
  }

  return (
    <div className="font-sans3 flex h-screen flex-col overflow-hidden tracking-wide">
      <div className="flex h-full w-full px-6">
        <div className="flex w-full">
          <div className="w-full px-6 py-9 md:w-6/12">
            <h2 className="mb-5 text-4xl font-semibold">
              {t("createConvify")}
            </h2>
            <Breadcrumb className="mb-6 mt-4 text-base font-normal hover:cursor-pointer">
              <BreadcrumbList>
                <BreadcrumbItem className="mr-2 text-base">
                  <BreadcrumbLink>
                    <Link href={"/dashboard/flows/create-flow/select-template"}>
                      {t("templateBreadcrumb")}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="mx-2 text-base">
                  <BreadcrumbLink>
                    <Link href={"/dashboard/flows/create-flow/select-color"}>
                      {t("colorsBreadcrumb")}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="mx-2 text-base">
                  <BreadcrumbPage className="font-semibold">
                    {t("finishBreadcrumb")}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-12">
              <label className="my-4 text-xl font-bold">{t("name")}</label>
              <div className="my-3">
                <Input
                  className="w-full py-[27px] placeholder:text-base placeholder:font-normal"
                  placeholder={t("Enter a title for your new convify")}
                  value={name}
                  onChange={handleInputChange}
                />
                {error && <p className="mt-2 text-red-500">{error}</p>}
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="z-20 h-full" />
          <div className="mx-auto w-full py-6 md:w-6/12">
            <iframe
              src="https://convify.io/survey"
              name="page"
              height={800}
              width="100%"
              title="Survey"
            ></iframe>
          </div>
        </div>
        <div className="fixed bottom-0 left-4 right-5 z-10 flex w-full items-center justify-between bg-white px-6 py-3 pr-11 md:w-6/12">
          <Link href={"/dashboard/flows/create-flow/select-color"}>
            <Button
              variant="secondary"
              size="icon"
              className="hover:cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
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
            <Button
              className="w-32 font-bold text-white"
              size="lg"
              variant="default"
              onClick={handleSubmit}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? t("loading") : t("continue")}
            </Button>
          </div>
        </div>
      </div>

      {/* Success message display */}
      {successMessage && (
        <div className="fixed bottom-20 right-4 z-50 rounded-md bg-green-500 p-4 text-white shadow-lg">
          {successMessage}
        </div>
      )}
    </div>
  )
}
