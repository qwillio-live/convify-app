"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "./ui/button"
import {
  setNewFlowSettings,
  setTemplateId,
  setTemplateLink,
} from "@/lib/state/flows-state/features/theme/globalewTheme"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { Icons } from "./icons"
import { Loader2 } from "lucide-react"

const SelectTemplate = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>()

  const [categories, setCategories] = useState<string[]>([])
  const general = useAppSelector((state) => state.newTheme?.general)
  const router = useRouter()
  const mobileScreen = useAppSelector((state) => state.newTheme?.mobileScreen)
  const header = useAppSelector((state) => state.newTheme?.header)
  const text = useAppSelector((state) => state.newTheme?.text)
  const templateLink = useAppSelector((state) => state.newTheme?.templateLink)
  const templateId = useAppSelector((state) => state.newTheme?.templateId)
  const [loadingCardIndex, setLoadingCardIndex] = useState<string>("")
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const pathname = usePathname()

  const idParams = useSearchParams()
  const id = idParams?.get("id")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null
  )

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      // Clear the previous timeout if there was one
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }

      // Show scrollbar
      scrollContainerRef.current.classList.add("show-scrollbar")

      // Set a timeout to hide scrollbar after scrolling stops
      const newTimeout = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.classList.remove("show-scrollbar")
        }
      }, 1000) // Adjust delay time as needed

      setScrollTimeout(newTimeout)
    }
  }
  useEffect(() => {
    // Add scroll event listener
    const container = scrollContainerRef.current
    container?.addEventListener("scroll", handleScroll)

    // Cleanup event listener on component unmount
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [scrollTimeout])
  // Fetch templates from the API
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

      setCategories([
        "All",
        ...(uniqueTags ? Object?.keys(uniqueTags) : [] || []),
        "Start from scratch",
      ])
      setSelectedCategory("All")
      setTemplates(templates)
      dispatch(setNewFlowSettings(JSON.parse(templates[0]?.templateSettings)))
      dispatch(setTemplateId(templates[0]?.id))
    }

    getTemplates()
  }, [])
  const handleCardClick = async (index: string) => {
    const relativeIndex = templates.findIndex((tem) => tem.id === index)
    setLoadingCardIndex(index)
    console.log(
      "relativeIndex",
      relativeIndex,
      templates[relativeIndex]?.templateSettings
    )
    dispatch(setNewFlowSettings(templates[relativeIndex]?.templateSettings))
    dispatch(setTemplateId(index))
    dispatch(setTemplateLink(templates[relativeIndex]?.link))
    console.log("templateId", templateId)
    try {
      const res = await fetch("/api/flows", {
        method: "POST",
        body: JSON.stringify({
          flowSettings: templates[relativeIndex]?.templateSettings,
          templateId: index,
          link: templates[relativeIndex]?.link,
        }),
      }).then((res) => {
        // setSuccessMessage(t("Flow created successfully!"))
        return res
      })

      const data = await res.json()
      console.log("result:", data)
      router.push(`/dashboard/${data.id}/create-flow`)
    } catch (err) {}
  }
  // useEffect(() => {
  //   // Add scroll event listener
  //   const container = scrollContainerRef.current
  //   container?.addEventListener("scroll", handleScroll)

  //   // Cleanup event listener on component unmount
  //   return () => {
  //     container?.removeEventListener("scroll", handleScroll)
  //   }
  // }, [])

  const filteredCards =
    selectedCategory === "All"
      ? templates
      : templates.filter((card) =>
          JSON.parse(card.tags).includes(selectedCategory)
        ).length > 0
      ? templates.filter((card) =>
          JSON.parse(card.tags).includes(selectedCategory)
        )
      : templates.filter(
          (card) =>
            card.name === "Start from Scratch" &&
            selectedCategory === "Start from scratch"
        )
  console.log("templates", templates)
  return (
    <div>
      <div
        ref={scrollContainerRef}
        className="scroll-container -mx-6 flex items-center gap-2 pb-4 min-[960px]:pb-8 lg:mx-0"
      >
        {categories.map((item) => (
          <React.Fragment key={item}>
            <Button
              className={`h-auto rounded-full px-[1em] py-[0.85em] text-[13px] font-semibold leading-none first:ml-6 last:mr-6 lg:first:mx-0 ${
                item === selectedCategory
                  ? "bg-[#4050ff] text-white hover:bg-[#3646ec]"
                  : "bg-[#f2f2f2] text-[#3b3b3b] hover:bg-[#ebebeb]"
              }`}
              onClick={() =>
                setSelectedCategory(item === selectedCategory ? "All" : item)
              }
            >
              {item}
            </Button>
            {item === "Recommended" && (
              <div className="hidden h-[27px] w-px basis-px bg-[hsl(0,0%,54%)] min-[720px]:block"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid gap-12 min-[696px]:grid-cols-2">
        {filteredCards.map((tem, index) => (
          <div
            className="flex flex-col gap-2"
            key={tem.id}
            // onClick={() => handleCardClick(tem.id)}
          >
            <div
              className="group relative w-full overflow-hidden rounded-[5px] border border-gray-100"
              onClick={() => handleCardClick(tem.id)}
            >
              {loadingCardIndex === tem.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="loader row flex items-center justify-center text-white">
                    <Loader2 className="loader-icon mr-2" />
                    loading
                  </div>
                </div>
              )}
              <Image
                src={tem.preview}
                width={300}
                height={300}
                alt={tem.name || ""}
                className="h-full w-full"
              />
            </div>
            <span className="text-base font-semibold">{tem.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectTemplate
