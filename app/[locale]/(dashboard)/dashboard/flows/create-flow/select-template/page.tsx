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
import { Badge } from "@/components/ui/badge"
import cardDemo from "@/assets/images/card_demo.png"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

const cardData = [
  { id: 1, category: "Recruiting", title: "Recruiting Campaign" },
  { id: 2, category: "b2cLeadGen", title: "B2C Lead Gen Campaign 1" },
  { id: 3, category: "b2cLeadGen", title: "B2C Lead Gen Campaign 2" },
  { id: 4, category: "customerFeedback", title: "Customer Feedback Campaign" },
  { id: 5, category: "other", title: "Other Campaign" },
  { id: 6, category: "b2bLeadGenMarketing", title: "B2B Lead Gen Marketing" },
]

export default function SelectTemplate() {
  const [loadingCardIndex, setLoadingCardIndex] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const t = useTranslations("Components")

  const handleCardClick = (index) => {
    setLoadingCardIndex(index)
    setTimeout(() => {
      setLoadingCardIndex(null)
      // Perform your action here after loading
    }, 3000) // Simulate loading for 3 seconds
  }

  const handleFilterClick = (category) => {
    setSelectedCategory(category)
  }

  const filteredCards = cardData.filter(
    (card) => selectedCategory === "all" || card.category === selectedCategory
  )

  return (
    <div className="font-sans3 flex h-screen flex-col overflow-hidden tracking-wide">
      <div className="flex h-full w-full px-6">
        <div className="flex w-full">
          <div className="w-full px-6 py-9 md:w-6/12">
            <h2 className="mb-5 text-4xl font-semibold">
              {t("selectTemplateHeader")}
            </h2>
            <Breadcrumb className="mb-6 mt-4 text-base font-normal">
              <BreadcrumbList>
                <BreadcrumbItem className="mr-2 text-base">
                  <BreadcrumbPage>{t("templateBreadcrumb")}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="mx-2 text-base">
                  <BreadcrumbLink>{t("colorsBreadcrumb")}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="mx-2 text-base">
                  <BreadcrumbLink>{t("finishBreadcrumb")}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="mb-8 mt-12 flex flex-wrap gap-2">
              <Button
                className="font-semibold"
                size="filterIcon"
                variant="secondary"
                onClick={() => handleFilterClick("Recruiting")}
              >
                {t("Recruiting")}
              </Button>
              <Button
                variant="outline"
                size="filterIcon"
                className="w-auto font-normal"
                onClick={() => handleFilterClick("b2cLeadGen")}
              >
                {t("b2cLeadGen")}
              </Button>
              <Button
                variant="outline"
                size="filterIcon"
                className="font-normal"
                onClick={() => handleFilterClick("customerFeedback")}
              >
                {t("customerFeedback")}
              </Button>
              <Button
                variant="outline"
                size="filterIcon"
                className="font-normal"
                onClick={() => handleFilterClick("other")}
              >
                {t("other")}
              </Button>
              <Button
                className="ml-3 border-0 bg-white font-semibold"
                variant="secondary"
                size="filterIcon"
                onClick={() => handleFilterClick("all")}
              >
                {t("startFromScratch")}
              </Button>
            </div>

            <div
              className="grid grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2"
              style={{ maxHeight: "calc(100vh - 350px)" }}
            >
              {filteredCards.map((card, index) => (
                <div key={card.id} className="pr-2">
                  <div
                    className="relative h-56 cursor-pointer space-y-3 overflow-hidden rounded-md"
                    onClick={() => handleCardClick(index)}
                  >
                    {loadingCardIndex === index && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                        <div className="loader row flex items-center justify-center">
                          <Loader2 className="loader-icon mr-2" />
                          {t("loading")}
                        </div>
                      </div>
                    )}
                    <span data-state="closed">
                      <div className="h-full w-full rounded-md">
                        <img
                          alt="Thinking Components"
                          loading="lazy"
                          decoding="async"
                          data-nimg="1"
                          className={`h-full w-full rounded-md object-cover transition-all ${
                            loadingCardIndex !== index ? "hover:scale-105" : ""
                          }`}
                          src={cardDemo.src}
                        />
                      </div>
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-md my-2 font-semibold leading-none">
                      {card.title}
                    </h3>
                    <Badge
                      variant="default"
                      className="font-sans3 rounded-md bg-black px-2 py-1 font-semibold"
                    >
                      {t("popular")}
                    </Badge>
                  </div>
                </div>
              ))}
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
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
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
            <Link href={"/dashboard/flows/create-flow/select-color"}>
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
