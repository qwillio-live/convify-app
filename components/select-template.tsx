"use client"

import React, { useEffect, useState } from "react"
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
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const pathname = usePathname()

  const idParams = useSearchParams()
  const id = idParams?.get("id")
  const [isLoading, setIsLoading] = useState(false) // S

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

      setCategories(Object?.keys(uniqueTags) || [])
      setSelectedCategory(Object?.keys(uniqueTags)[0])
      setTemplates(templates)
      dispatch(setNewFlowSettings(JSON.parse(templates[0]?.templateSettings)))
      dispatch(setTemplateId(templates[0]?.id))
    }

    getTemplates()
  }, [])
  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/flows", {
        method: "POST",
        body: JSON.stringify({
          flowSettings: { general, mobileScreen, header, text },
          templateId,
          link: templateLink,
        }),
      }).then((res) => {
        // setSuccessMessage(t("Flow created successfully!"))
        return res
      })

      const data = await res.json()
      console.log("result:", data)
      setIsLoading(false) // Stop loading
      router.push(`/dashboard/${data.id}/create-flow`)
    } catch (err) {
      setIsLoading(false) // Stop loading
    }
  }
  const handleCardClick = (index: string) => {
    const relativeIndex = templates.findIndex((tem) => tem.id === index)
    console.log(
      "relativeIndex",
      relativeIndex,
      templates[relativeIndex]?.templateSettings
    )
    dispatch(setNewFlowSettings(templates[relativeIndex]?.templateSettings))
    dispatch(setTemplateId(index))
    dispatch(setTemplateLink(templates[relativeIndex]?.link))
  }
  const filteredCards = templates.filter((card) =>
    JSON.parse(card.tags).includes(selectedCategory)
  )

  return (
    <div>
      <div className="-mx-6 flex items-center gap-2 overflow-x-auto pb-4 min-[960px]:pb-8 lg:mx-0">
        {categories.map((item) => (
          <React.Fragment key={item}>
            <Button
              className={`h-auto rounded-full px-[1em] py-[0.85em] text-[13px] font-semibold leading-none first:ml-6 last:mr-6 lg:first:mx-0 ${
                item === selectedCategory
                  ? "bg-[#4050ff] text-white hover:bg-[#3646ec]"
                  : "bg-[#f2f2f2] text-[#3b3b3b] hover:bg-[#ebebeb]"
              }`}
              onClick={() => setSelectedCategory(item)}
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
            onClick={() => handleCardClick(tem.id)}
          >
            <div className="group relative w-full overflow-hidden rounded-[5px] border border-gray-100">
              <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
                <div className="flex flex-col items-stretch gap-[0.6em]">
                  <Button
                    onClick={handleSubmit}
                    className="h-auto w-full min-w-[150px] rounded-[3px] border border-solid border-[#4050ff] bg-[#4050ff] px-[1em] py-[0.85em] text-[13px] font-semibold leading-none text-white hover:border-[#3646ec] hover:bg-[#3646ec]"
                    disabled={isLoading} // Disable button while loading
                  >
                    Start building
                    {isLoading && (
                      <div>
                        <Icons.spinner className=" z-20 ml-2 h-4 w-4 animate-spin" />
                      </div>
                    )}
                  </Button>
                  <Button className="h-auto w-full min-w-[150px] rounded-[3px] border border-solid border-[rgb(235,235,235)] bg-[rgb(242,242,242)] px-[1em] py-[0.85em] text-[13px] font-semibold leading-none text-[rgb(59,59,59)] hover:bg-[rgb(235,235,235)] hover:text-[rgb(33,33,33)]">
                    Preview template
                  </Button>
                </div>
              </div>
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
