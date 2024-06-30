import React from "react"
import Image from "next/image"
import { LocalImages } from "@/public/images"
import { useTranslations } from "next-intl"

const EmptyResponse = () => {
  const t = useTranslations("CreateFlow.ResultsPage")
  return (
    <div
      className="flex  min-w-full items-center justify-center">
      <div className="mt-[70px] lg:mt-6 flex h-full w-full items-center justify-center ">
        <div className="max-w-[360px]">
          <div className="mb-2 flex items-center justify-center ">
            <Image src={LocalImages.noresponse} alt="no response" className="mt-8 w-56 " />
          </div>
          <span className="leading-32 block text-center text-xl font-light  ">
            {t("This flow doesnt have any responses yet")}
          </span>
          {/* <div className="mt-2">
            <span className="block text-center text-xs leading-5 opacity-90">
              This flow doesn’t have any responses yet. If you haven’t set
              up notifications, you can do that now and we’ll message you when
              someone responds.
            </span>
          </div>
          <div className="mt-4 grid">
            <a
              color="#737373"
              href="/"
              target="_blank"
              className="relative text-center leading-5  underline  opacity-90 outline-none  "
            >
              How to set up notifications
            </a>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default EmptyResponse
