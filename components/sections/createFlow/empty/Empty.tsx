import React from "react"
import Image from "next/image"
import { LocalImages } from "@/public/images"

const EmptyResponse = () => {
  return (
    <div
      className="flex  min-w-full items-center justify-center"
    >
      <div className="flex h-full w-full items-center justify-center mt-56">
        <div className="max-w-[360px]">
          <div className="flex items-center justify-center mb-2">
            <Image src={LocalImages.noresponse} alt="no response" className="w-56"/>
          </div>
          <span className="text-xl leading-32 block text-center font-light">
            No signs of movement...
          </span>
          <div className="mt-2">
            <span className="block text-center text-xs leading-5 opacity-90">
              This typeform doesn’t have any responses yet. If you haven’t set
              up notifications, you can do that now and we’ll message you when
              someone responds.
            </span>
          </div>
          <div className="mt-4 grid">
            <a
              color="#737373"
              href="/"
              target="_blank"
              className="relative text-center opacity-90 leading-5 underline outline-none"
            >
              How to set up notifications
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyResponse
