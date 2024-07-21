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
import { useAppSelector } from "@/lib/state/flows-state/hooks"

// Define Zod schema for input validation
const nameSchema = z
  .string()
  .min(1, "Name is required") // Ensure at least 1 character
  .regex(/\w/, "Name must contain at least 1 letter or number")

export default function SelectColor() {
  const t = useTranslations("Components")
  const backgroundColor = useAppSelector(
    (state) => state.newTheme?.general?.backgroundColor
  )
  const primaryColor = useAppSelector(
    (state) => state.newTheme?.general?.primaryColor
  )
  const secondaryColor = useAppSelector(
    (state) => state.newTheme?.general?.secondaryColor
  )
  const templateId = useAppSelector((state) => state.newTheme?.templateId)
  const [name, setName] = useState("")
  const [error, setError] = useState("")

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
      console.log("Form submitted with name:", name)
      const res = await fetch("/api/flows", {
        method: "POST",
        body: JSON.stringify({
          flowSettings: {
            backgroundColor,
            primaryColor,
            secondaryColor,
          },
          templateId,
          name,
        }),
      })
      const data = await res.json()
      console.log("result:", data)
    } catch (err) {
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
              className="bg-black"
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
            >
              {t("continue")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
