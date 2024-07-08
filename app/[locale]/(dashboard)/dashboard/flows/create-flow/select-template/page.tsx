"use client"
import React, { useState, useRef, useEffect } from "react"
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
  const [loadingCardIndex, setLoadingCardIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isScrolling, setIsScrolling] = useState<boolean>(false)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const cardContainerRef = useRef<HTMLDivElement | null>(null)
  const t = useTranslations("Components")

  const handleCardClick = (index: number) => {
    setLoadingCardIndex(index)
    setTimeout(() => {
      setLoadingCardIndex(null)
      // Perform your action here after loading
    }, 3000) // Simulate loading for 3 seconds
  }

  const handleFilterClick = (category: string) => {
    setSelectedCategory(category)
  }

  const filteredCards = cardData.filter(
    (card) => selectedCategory === "all" || card.category === selectedCategory
  )

  const handleScroll = () => {
    setIsScrolling(true)
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false)
    }, 1000) // Hide scrollbar 1 second after scrolling stops
  }

  useEffect(() => {
    const cardContainer = cardContainerRef.current
    if (cardContainer) cardContainer.addEventListener("scroll", handleScroll)
    return () => {
      if (cardContainer)
        cardContainer.removeEventListener("scroll", handleScroll)
    }
  }, [])

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
                variant={`${
                  selectedCategory === "Recruiting" ? "secondary" : "outline"
                }`}
                onClick={() => handleFilterClick("Recruiting")}
              >
                {t("Recruiting")}
              </Button>
              <Button
                variant={`${
                  selectedCategory === "b2cLeadGen" ? "secondary" : "outline"
                }`}
                size="filterIcon"
                className="w-auto font-normal"
                onClick={() => handleFilterClick("b2cLeadGen")}
              >
                {t("b2cLeadGen")}
              </Button>
              <Button
                variant={`${
                  selectedCategory === "customerFeedback"
                    ? "secondary"
                    : "outline"
                }`}
                size="filterIcon"
                className="font-normal"
                onClick={() => handleFilterClick("customerFeedback")}
              >
                {t("customerFeedback")}
              </Button>
              <Button
                variant={`${
                  selectedCategory === "other" ? "secondary" : "outline"
                }`}
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
              className={`custom-scrollbar grid grid-cols-1 gap-6 overflow-y-auto md:grid-cols-2 ${
                isScrolling ? "scrolling" : ""
              }`}
              style={{ maxHeight: "calc(100vh - 350px)" }}
              ref={cardContainerRef}
            >
              {filteredCards.map((card, index) => (
                <div key={card.id} className="pr-2">
                  <div
                    className="relative h-56 cursor-pointer space-y-3 overflow-hidden rounded-md"
                    onClick={() => handleCardClick(index)}
                  >
                    {loadingCardIndex === index && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="loader row flex items-center justify-center text-white">
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
        <div className="fixed bottom-8 left-4 flex w-full items-center justify-between bg-white px-6 py-3 md:w-6/12">
          <Button variant="secondary" size="icon">
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
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          transition: opacity 0.2s;
          opacity: 0;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.4);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar.scrolling::-webkit-scrollbar {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
