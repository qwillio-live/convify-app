"use client";

import { json } from "stream/consumers";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import cardDemo from "@/assets/images/card_demo.png";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";



import { env } from "@/env.mjs";
import { setNewFlowSettings, setTemplateId, setTemplateLink } from "@/lib/state/flows-state/features/theme/globalewTheme";
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { DrawerContent } from "@/components/ui/drawerDesctop";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShareDrawerDesktop } from "@/components/sections/createFlow/share/drawerDesktopShare";





export default function SelectTemplate() {
  const [loadingCardIndex, setLoadingCardIndex] = useState<number | null>(null)
  const [selectedCard, setSelectedCard] = useState<number>(1)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [templates, setTemplates] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [showDrawer, setShowDrawer] = useState<boolean>(true)
  const [isScrolling, setIsScrolling] = useState<boolean>(false)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const cardContainerRef = useRef<HTMLDivElement | null>(null)
  const t = useTranslations("Components")
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const query = useSearchParams()
  const isAllowed = query?.get("allow") || false

  const handleCardClick = (index: number) => {
    setLoadingCardIndex(index)
    setSelectedCard(index + 1)
    dispatch(setNewFlowSettings(JSON.parse(templates[index]?.templateSettings)))
    dispatch(setTemplateId(templates[index]?.id))
    dispatch(setTemplateLink(templates[index]?.link))
    setTimeout(() => {
      setLoadingCardIndex(null)
      // Perform your action here after loading
    }, 300) // Simulate loading for 3 seconds
  }

  const handleFilterClick = (category: string) => {
    if (category == selectedCategory) {
      setSelectedCategory("all")
    } else setSelectedCategory(category)
  }

  const filteredCards = templates.filter(
    (card) =>
      card.name !== "Start from Scratch" &&
      (selectedCategory === "all" ||
        JSON.parse(card.tags).includes(selectedCategory))
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
    const fetchTemplates = async () => {
      let url = pathname?.includes("/pt/")
        ? "/api/templates/pt"
        : "/api/templates"
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const templates = await response.json()
        return templates
      } catch (error) {
        console.error("Failed to fetch templates:", error)
        return null
      }
    }

    const getTemplates = async () => {
      let templates = await fetchTemplates()
      const uniqueTags = templates?.reduce((acc, item) => {
        const tags = JSON.parse(item.tags)
        tags.forEach((tag) => {
          if (!acc[tag]) {
            acc[tag] = true
          }
        })
        return acc
      }, {})

      setCategories(Object?.keys(uniqueTags) || [])
      setTemplates(templates)
      dispatch(setNewFlowSettings(JSON.parse(templates[0]?.templateSettings)))
      dispatch(setTemplateId(templates[0]?.id))
    }

    getTemplates()
  }, [])
  useEffect(() => {
    updateView()
    window.addEventListener("resize", updateView)
    return () => window.removeEventListener("resize", updateView)
  }, [])
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState<boolean>(true)
  const [shareDrawerOpen, setShareDrawerOpen] = useState<boolean>(false)
  const [view, setView] = useState("desktop")
  const [innerview, setInnerView] = useState("desktop")
  const [isCustomLinkOpen, setIsCustomLinkOpen] = useState(false)
  const updateView = () => {
    if (window.innerWidth >= 1024) {
      setDesktopDrawerOpen(false)
      setView("desktop")
      setInnerView("desktop")
    } else {
      setView("mobile")
      setInnerView("mobile")
      if (isAllowed) setDesktopDrawerOpen(false)
      else router.push("/select-template")
    }
  }

  console.log(
    "templates | categories",
    templates,
    categories,
    selectedCard
    // templates[selectedCard]?.content
    // state
  )

  return (
    <div className="font-poppins flex h-screen flex-col overflow-hidden tracking-wide">
      {!desktopDrawerOpen && (
        <div className="flex size-full">
          <div className="flex w-full">
            <div className="relative w-full bg-[#FAFAFA] md:w-6/12">
              <ScrollArea className="z-20 h-full px-6 2xl:px-10">
                <div className="pb-24 pt-10">
                  <h2 className="mb-6 text-[2rem] font-semibold leading-8">
                    {t("selectTemplateHeader")}
                  </h2>
                  <Breadcrumb>
                    <BreadcrumbList className="text-base sm:gap-4">
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          {t("templateBreadcrumb")}
                        </BreadcrumbPage>
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
                  <div className="mb-6 mt-14 flex items-center justify-between gap-1">
                    <div className="flex space-x-0.5 rounded-lg bg-[#EEEEEE] p-1">
                      <Button
                        className={cn(
                          "hover:text-foreground h-7 rounded-sm bg-transparent px-2 text-xs font-normal leading-3 text-[#7B7D80] hover:bg-white/70",
                          {
                            "text-foreground bg-white":
                              selectedCategory === "all",
                          }
                        )}
                        onClick={() => handleFilterClick("all")}
                      >
                        {t("All")}
                      </Button>
                      {categories.map((category, index) => {
                        return (
                          <Button
                            key={index}
                            className={cn(
                              "hover:text-foreground h-7 rounded-sm bg-transparent px-2 text-xs font-normal leading-3 text-[#7B7D80] hover:bg-white/70",
                              {
                                "text-foreground bg-white":
                                  selectedCategory === category,
                              }
                            )}
                            onClick={() => handleFilterClick(category)}
                          >
                            {category}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      className="text-foreground h-9 border bg-white text-xs font-normal leading-3 hover:bg-white/10"
                      onClick={() => {
                        let scratchTemplate = templates.find(
                          (template) => template.name === "Start from Scratch"
                        )
                        dispatch(
                          setNewFlowSettings(scratchTemplate?.templateSettings)
                        )
                        dispatch(setTemplateId(scratchTemplate?.id))
                        router.push("/dashboard/flows/create-flow/select-color")
                      }}
                    >
                      {t("startFromScratch")}
                    </Button>
                  </div>

                  <div className="!z-0 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {filteredCards.map((card, index) => (
                      <div key={index} className="space-y-2">
                        <div
                          className={`relative h-52 w-full cursor-pointer space-y-3 overflow-hidden rounded-lg border shadow-sm min-[1920px]:h-[18.5rem] ${
                            selectedCard - 1 === index
                              ? "border-[#23262C]"
                              : "border-transparent"
                          }`} // Adjusted height and rounded border
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
                            <div className="h-full w-full rounded-lg">
                              <img
                                alt="Thinking Components"
                                loading="lazy"
                                decoding="async"
                                data-nimg="1"
                                className={`h-full w-full rounded-md object-cover object-center transition-all ${
                                  loadingCardIndex !== index
                                    ? "hover:scale-105"
                                    : ""
                                }`}
                                src={card.preview}
                              />
                            </div>
                          </span>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-base font-semibold leading-4">
                            {card?.name}
                          </h3>
                          {card?.isPopular && (
                            <Badge
                              variant="default"
                              className="rounded-sm border-none leading-none md:h-[15px] md:px-1.5 md:text-[10px] md:font-normal"
                            >
                              {t("popular")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
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
                  <Link href={"/dashboard"}>
                    <Button
                      variant="outline"
                      className="h-9.5 rounded-lg px-2.5"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href={`/dashboard/flows/create-flow/select-color?allow=${isAllowed}`}
                  >
                    <Button className="w-[7.5rem] rounded-lg text-base font-normal text-white ">
                      {t("continue")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <Separator orientation="vertical" className="z-40" />
            <div className=" mx-auto w-full bg-white p-6 md:w-6/12">
              {selectedCard && (
                <iframe
                  src={templates[selectedCard - 1]?.content}
                  name="page"
                  height={800}
                  width="100%"
                  title="Survey"
                  style={{ minHeight: "800px" }}
                ></iframe>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
