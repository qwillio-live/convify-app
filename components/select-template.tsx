"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { templates } from "@/constant"
import { templateImage } from "@/public/images"
import { Template } from "@/types"

import { Button } from "./ui/button"

const SelectTemplate = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [recommendedTemplate, setRecommendedTemplate] =
    useState<Template | null>()

  const idParams = useSearchParams()
  const id = idParams?.get("id")

  const categories = Array.from(new Set(templates.map((item) => item.category)))

  const filteredData = templates.filter((item) => {
    if (selectedCategory === "Recommended") {
      return item.isRecommended
    } else {
      return item.category === selectedCategory
    }
  })

  useEffect(() => {
    const defaultCategory = "Recommended"
    const defaultTemplate = templates[0]

    const selectItem = (item) => {
      if (item.isRecommended === false) {
        setSelectedCategory(item.category)
        setRecommendedTemplate(null)
      } else {
        setSelectedCategory(defaultCategory)
        setRecommendedTemplate(item)
      }
    }

    if (id) {
      const selectedItem = templates.find((item) => item.id === +id)

      if (selectedItem) {
        selectItem(selectedItem)
      } else {
        setSelectedCategory(defaultCategory)
        setRecommendedTemplate(defaultTemplate)
      }
    } else {
      setSelectedCategory(defaultCategory)
      setRecommendedTemplate(defaultTemplate)
    }
  }, [id])

  return (
    <div>
      <div className="flex gap-2 pb-4 min-[960px]:pb-8 overflow-x-auto items-center -mx-6 lg:mx-0">
        {["Recommended", ...categories].map((item) => (
          <React.Fragment key={item}>
            <Button
              className={`text-[13px] rounded-full py-[0.85em] px-[1em] font-semibold leading-none h-auto first:ml-6 last:mr-6 lg:first:mx-0 ${
                item === selectedCategory
                  ? "bg-[#4050ff] text-white hover:bg-[#3646ec]"
                  : "bg-[#f2f2f2] text-[#3b3b3b] hover:bg-[#ebebeb]"
              }`}
              onClick={() => setSelectedCategory(item)}
            >
              {item}
            </Button>
            {item === "Recommended" && (
              <div className="w-px h-[27px] bg-[hsl(0,0%,54%)] basis-px min-[720px]:block hidden"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      {recommendedTemplate && selectedCategory === "Recommended" && (
        <div>
          <div className="grid min-[960px]:grid-cols-[2fr_1fr] min-[960px]:grid-rows-[auto_1fr] min-[960px]:gap-y-4 min-[960px]:gap-x-6">
            <div className="border border-solid border-[rgb(235,235,235)] rounded-[5px] overflow-hidden min-[960px]:row-[1/3] mt-2 min-[721px]:mt-0">
              <Image
                src={templateImage[recommendedTemplate.img]}
                alt={recommendedTemplate.name}
                className="w-full"
              />
            </div>
            <div className="order-first min-[960px]:order-none my-2 min-[960px]:my-0">
              <div className="flex items-center gap-0.5 min-[960px]:mb-4 mb-2">
                <svg
                  color="#4050FF"
                  height="22"
                  width="22"
                  viewBox="0 0 22 22"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.94164 2.13186C10.1995 1.81138 10.5887 1.625 11 1.625C11.4113 1.625 11.8005 1.81138 12.0583 2.13186L13.3183 3.69936C13.6083 4.06077 14.0626 4.24928 14.5233 4.19936L16.5233 3.98186C16.9334 3.93631 17.342 4.07963 17.6338 4.37141C17.9255 4.66318 18.0689 5.07176 18.0233 5.48186L17.8058 7.48186C17.7559 7.94254 17.9444 8.39686 18.3058 8.68686L19.8733 9.94686C20.1938 10.2047 20.3802 10.5939 20.3802 11.0052C20.3802 11.4165 20.1938 11.8057 19.8733 12.0635L18.3008 13.3177C17.9395 13.6082 17.7511 14.0626 17.8008 14.5235L18.0183 16.5235C18.0642 16.9337 17.921 17.3425 17.6291 17.6343C17.3373 17.9262 16.9285 18.0694 16.5183 18.0235L14.5183 17.806C14.0576 17.756 13.6032 17.9445 13.3133 18.306L12.0583 19.8677C11.8006 20.1885 11.4114 20.3751 11 20.3751C10.5885 20.3751 10.1993 20.1885 9.94164 19.8677L8.68248 18.301C8.39211 17.9396 7.93756 17.7511 7.47664 17.801L5.47664 18.0185C5.06639 18.0647 4.65741 17.9216 4.36548 17.6297C4.07355 17.3378 3.93043 16.9288 3.97664 16.5185L4.19414 14.5185C4.24404 14.0576 4.05556 13.6031 3.69414 13.3127L2.12748 12.0535C1.80671 11.7959 1.62012 11.4066 1.62012 10.9952C1.62012 10.5838 1.80671 10.1945 2.12748 9.93686L3.69414 8.67686C4.05568 8.38696 4.24422 7.93256 4.19414 7.47186L3.97664 5.47186C3.93076 5.06168 4.07398 4.6529 4.36583 4.36105C4.65768 4.0692 5.06646 3.92598 5.47664 3.97186L7.47664 4.18936C7.93753 4.2391 8.39202 4.05065 8.68248 3.68936L9.94164 2.13186Z"
                    fill="#4050FF"
                    stroke="#4050FF"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.45 8.15004C14.7814 8.39857 14.8485 8.86867 14.6 9.20004L11.2825 13.6234C11.0432 13.942 10.6773 14.1415 10.2798 14.1696C9.88243 14.1978 9.49237 14.0521 9.21061 13.7705C9.21059 13.7705 9.21064 13.7705 9.21061 13.7705L7.21978 11.7805C6.92683 11.4877 6.92673 11.0128 7.21956 10.7198C7.51239 10.4269 7.98726 10.4268 8.28022 10.7196L10.1692 12.6078L13.4 8.30004C13.6485 7.96867 14.1186 7.90152 14.45 8.15004ZM10.2711 12.7097C10.2711 12.7096 10.2711 12.7097 10.2711 12.7097Z"
                    fill="white"
                  ></path>
                </svg>
                <span className="text-[#1a1a1a] text-sm leading-[1.36188] font-normal">
                  Recommended template
                </span>
              </div>
              <span className="text-[28px] text-black font-semibold font-heading tracking-[0.4px] leading-[34px]">
                {recommendedTemplate.name}
              </span>
              <div className="text-gray-900 text-sm">
                Based on your profile and responses, we recommend the{" "}
                <strong>{recommendedTemplate.name}</strong> template to start
                with.
              </div>
            </div>
            <div className="flex items-start gap-4 mt-2 min-[721px]:mt-0">
              <Button className="text-white rounded-[3px] bg-[#4050ff] font-semibold hover:bg-[#3646ec] leading-none text-sm h-auto py-[0.85em] px-[1em] w-full min-[960px]:w-auto">
                Start building
              </Button>
              <Button
                variant="secondary"
                className="bg-[rgb(242,242,242)] text-[rgb(59,59,59)] rounded-[3px] h-auto font-semibold leading-none text-sm py-[0.85em] px-[1em] hidden min-[960px]:block hover:bg-[rgb(235,235,235)] hover:text-[rgb(33,33,33)]"
              >
                Preview template
              </Button>
            </div>
          </div>
          <p className="mt-14 min-[960px]:mt-10 text-base mb-2 leading-none">
            Browse other relevant templates
          </p>
        </div>
      )}
      <div className="grid min-[696px]:grid-cols-2 gap-12">
        {filteredData.map((tem) => (
          <div className="flex flex-col gap-2" key={tem.id}>
            <div className="w-full relative rounded-[5px] overflow-hidden border border-gray-100 group">
              <div className="flex flex-col size-full items-center justify-center absolute top-0 left-0 opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-200 ease-in-out">
                <div className="flex flex-col items-stretch gap-[0.6em]">
                  <Button className="bg-[#4050ff] leading-none hover:bg-[#3646ec] text-white  rounded-[3px] text-[13px] h-auto py-[0.85em] px-[1em] font-semibold w-full min-w-[150px] border border-solid border-[#4050ff] hover:border-[#3646ec]">
                    Start building
                  </Button>
                  <Button className="bg-[rgb(242,242,242)] leading-none hover:bg-[rgb(235,235,235)] text-[rgb(59,59,59)] hover:text-[rgb(33,33,33)] rounded-[3px] text-[13px] h-auto py-[0.85em] px-[1em] font-semibold w-full min-w-[150px] border border-solid border-[rgb(242,242,242)] hover:border-[rgb(235,235,235)] hidden min-[696px]:block">
                    Preview template
                  </Button>
                </div>
              </div>
              <Image
                src={templateImage[tem.img]}
                alt={tem.name}
                className="w-full rounded-[5px] border border-solid border-[rgb(235,235,235)]"
              />
            </div>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-black leading-[1.36188]">
                {tem.name}
              </h3>
              {tem.isPopular && (
                <div className="flex gap-1 items-center">
                  <svg
                    color="hsl(45, 86%, 62%)"
                    width="19"
                    height="19"
                    viewBox="0 0 19 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.54894 0.927051C8.8483 0.00574017 10.1517 0.00573993 10.4511 0.927051L11.8574 5.25532C11.9913 5.66734 12.3752 5.9463 12.8085 5.9463H17.3595C18.3282 5.9463 18.731 7.18592 17.9473 7.75532L14.2654 10.4303C13.9149 10.685 13.7683 11.1364 13.9021 11.5484L15.3085 15.8766C15.6078 16.798 14.5533 17.5641 13.7696 16.9947L10.0878 14.3197C9.7373 14.065 9.2627 14.065 8.91221 14.3197L5.23037 16.9947C4.44665 17.5641 3.39217 16.798 3.69153 15.8766L5.09787 11.5484C5.23174 11.1364 5.08508 10.685 4.7346 10.4303L1.05275 7.75532C0.269035 7.18592 0.67181 5.9463 1.64053 5.9463H6.19155C6.62477 5.9463 7.00873 5.66734 7.1426 5.25532L8.54894 0.927051Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span className="text-[rgb(26,26,26)] font-bold text-[11px] leading-[1.36188]">
                    Popular
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectTemplate
