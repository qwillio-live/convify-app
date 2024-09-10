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
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { json } from "stream/consumers"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import {
  setNewFlowSettings,
  setTemplateId,
  setTemplateLink,
} from "@/lib/state/flows-state/features/theme/globalewTheme"
import { Drawer } from "@/components/ui/drawer"
import { DrawerContent } from "@/components/ui/drawerDesctop"
import { env } from "@/env.mjs"

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
    <div className="font-sans3 flex h-screen flex-col overflow-hidden tracking-wide">
      {!desktopDrawerOpen && (
        <div className="flex h-full w-full px-6">
          <div className="flex w-full">
            <div className="w-full md:w-6/12">
              <ScrollArea className="z-20  h-full pb-9 pl-6 pr-6">
                <div className="mb-9">
                  <h2 className="mb-5 mt-9 text-4xl font-semibold">
                    {t("selectTemplateHeader")}
                  </h2>
                  <Breadcrumb className="mb-6 mt-4 text-base font-normal hover:cursor-pointer">
                    <BreadcrumbList>
                      <BreadcrumbItem className="mr-2 text-base">
                        <BreadcrumbPage className="font-semibold">
                          {t("templateBreadcrumb")}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem className="mx-2 text-base">
                        <BreadcrumbLink>
                          <Link
                            href={`/dashboard/flows/create-flow/select-color?allow=${isAllowed}`}
                          >
                            {t("colorsBreadcrumb")}
                          </Link>
                        </BreadcrumbLink>
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
                  <div className=" mb-6 mt-12 flex w-auto flex-wrap gap-3  pr-2">
                    <Button
                      className={`grow !px-[0.3rem] font-normal ${
                        selectedCategory === "all" ? "font-semibold" : ""
                      } `}
                      size={"filterIcon"}
                      variant={`${
                        selectedCategory === "all" ? "secondary" : "outline"
                      }`}
                      onClick={() => handleFilterClick("all")}
                    >
                      {t("All")}
                    </Button>
                    {categories.map((category, index) => {
                      return (
                        <Button
                          key={index}
                          className={`grow font-normal ${
                            selectedCategory === category ? "font-semibold" : ""
                          }`}
                          size="filterIcon"
                          variant={`${
                            selectedCategory === category
                              ? "secondary"
                              : "outline"
                          }`}
                          onClick={() => handleFilterClick(category)}
                        >
                          {category}
                        </Button>
                      )
                    })}

                    <Button
                      className="grow border-0 bg-white font-semibold"
                      variant="secondary"
                      size="filterIcon"
                      onClick={() => {
                        let scratchTemplate = templates.find(
                          (template) => template.name === "Start from Scratch"
                        )
                        dispatch(
                          setNewFlowSettings(scratchTemplate?.templateSettings)
                        )
                        dispatch(setTemplateId(scratchTemplate?.id))
                        router.push("./select-color")
                      }}
                    >
                      {t("startFromScratch")}
                    </Button>
                  </div>

                  <div className="!z-0 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {filteredCards.map((card, index) => (
                      <div key={index} className="pr-2">
                        <div
                          className={`relative h-44 w-full cursor-pointer space-y-3 overflow-hidden rounded-md border xl:h-40 2xl:h-56 ${
                            selectedCard - 1 === index
                              ? "border-black"
                              : "border-none"
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
                            <div className="h-full w-full rounded-md">
                              <img
                                alt="Thinking Components"
                                loading="lazy"
                                decoding="async"
                                data-nimg="1"
                                className={`h-full w-full rounded-md object-cover transition-all ${
                                  loadingCardIndex !== index
                                    ? "hover:scale-105"
                                    : ""
                                }`}
                                src={card.preview}
                              />
                            </div>
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-md my-2 font-semibold leading-none">
                            {card?.name}
                          </h3>
                          {card?.isPopular && (
                            <Badge
                              variant="default"
                              className="font-sans3 rounded-md bg-black px-2 py-1 font-semibold"
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
            </div>
            <Separator orientation="vertical" className="z-40" />
            <div className=" mx-auto w-full py-6 md:w-6/12">
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
          <div className="fixed bottom-0 left-4 right-5  z-30 flex w-full items-center justify-between bg-white px-6 py-3 pr-11  md:w-6/12">
            <Link href={"/dashboard"}>
              <Button variant="secondary" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex hover:cursor-pointer">
              <Link href={"/dashboard"}>
                <Button
                  className="mr-2 w-32 font-bold"
                  size="lg"
                  variant="outline"
                >
                  {t("exit")}
                </Button>
              </Link>
              <Link
                href={`/dashboard/flows/create-flow/select-color?allow=${isAllowed}`}
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
