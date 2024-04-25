import React from "react"
import Image from "next/image"
// types and constants
import { TIntegrationCardData } from "@/types"
import { Check } from "lucide-react"

// ui components
import { Button } from "./ui/button"

interface IntegrationCardProps {
  Integrationitem: TIntegrationCardData
}

const IntegrationCard = ({ Integrationitem }: IntegrationCardProps) => {
  const { title, description, image, status, alt, id } = Integrationitem
  return (
    <div className="mb-6 flex items-center rounded-md bg-white px-4 py-6">
      <div>
        <Image src={image} width={60} height={60} alt={alt} />
      </div>
      <div className="ml-10 flex w-full items-center justify-between">
        <div className="w-4/5 flex-col justify-start text-base font-normal text-black">
          <div className="mb-1 flex items-center ">
            <h1 className="">{title}</h1>
            {status === "active" && (
              <small className="ml-3 flex items-center rounded-2xl bg-[#EBF9F1] px-4  py-1 text-sm text-[#34AC68]">
                Active
                <Check className="ml-1 size-4" />
              </small>
            )}
          </div>
          <p className="text-sm">{description}</p>
        </div>
        {status !== "active" && (
          <div>
            <Button className="bg-black text-white hover:bg-black">
              Connect
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default IntegrationCard
