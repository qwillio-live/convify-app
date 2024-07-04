import React from "react"
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

export default function SelectColor() {
  const t = useTranslations("Components")

  return (
    <div className="font-sans3 flex h-screen flex-col overflow-hidden tracking-wide">
      <div className="flex h-full w-full px-6">
        <div className="flex w-full">
          <div className="w-full px-6 py-9 md:w-6/12">
            <h2 className="mb-5 text-4xl font-semibold">
              {t("createConvify")}
            </h2>
            <Breadcrumb className="mb-6 mt-4 text-base font-normal">
              <BreadcrumbList>
                <BreadcrumbItem className="mr-2 text-base">
                  <BreadcrumbLink>{t("templateBreadcrumb")}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="mx-2 text-base">
                  <BreadcrumbLink>{t("colorsBreadcrumb")}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="mx-2 text-base">
                  <BreadcrumbPage>{t("finishBreadcrumb")}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-12">
              <label className="text-md my-4 font-bold">{t("name")}</label>
              <Input
                className="my-3 py-7 placeholder:text-base placeholder:font-normal"
                placeholder="Enter a title for your new convify"
              />
            </div>
          </div>

          <Separator orientation="vertical" className="mx-4 h-full" />
          <div className="w-full py-6 md:w-5/12">
            <iframe
              src="https://convify.io/survey"
              name="page"
              height={800}
              width="100%"
              title="Survey"
            ></iframe>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 flex w-full items-center justify-between bg-white px-6 py-3 md:w-6/12">
          <Link href={"/dashboard/flows/create-flow/select-color"}>
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div className="flex">
            <Link href={"/dashboard"}>
              <Button
                className="mr-2 w-32 font-bold"
                size="lg"
                variant="outline"
              >
                {t("exit")}
              </Button>
            </Link>
            <Link href={"/dashboard"}>
              <Button
                className="w-32 font-bold text-white"
                size="lg"
                variant="default"
              >
                {t("continue")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
