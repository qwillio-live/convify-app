import Image from "next/image"
// types and constants
import { TIntegrationCardData } from "@/types"
import { Check } from "lucide-react"
// ui components
import { useTranslations } from "next-intl"

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"

type UpdateStatusFunction = (id: number, newStatus: string) => void

interface IntegrationCardProps {
  Integrationitem: TIntegrationCardData
  updateStatus: UpdateStatusFunction
  flowData: any
  setEffectCall: any
}

const IntegrationCard = ({
  Integrationitem,
  updateStatus,
  flowData,
  setEffectCall,
}: IntegrationCardProps) => {
  const { title, description, image, status, alt, id, Content } =
    Integrationitem

  const handleStatusUpdate = (newStatus) => {
    updateStatus(id, newStatus)
  }

  const t = useTranslations("CreateFlow.ConnectPage")

  return (
    <AccordionItem
      value={title}
      className="mb-6 md:rounded-[20px] rounded-[12px] border border-[#E9E9E9] bg-white dark:bg-[#070e1f] font-poppins"
    >
      <AccordionTrigger
        className="flex flex-col md:flex-row md:gap-8 gap-2 items-start md:items-center md:p-6 p-[20px] lg:mx-0 hover:no-underline"
        noIcon={true}
      >
        <div className="md:h-12 h-8 md:w-12 w-8">
          <Image src={image} width={60} height={60} alt={alt} className="h-full w-full object-contain" />
        </div>
        <div className="mt-2 md:mt-0 ml-0 flex w-full items-center justify-between">
          <div className="w-full flex-col justify-start text-base font-normal text-black">
            <div className="mb-1 flex items-center ">
              <h1 className="font-semibold text-[#23262C] dark:text-white">{t(title)}</h1>
              {status === "active" && (
                <small className="ml-3 flex items-center rounded-2xl bg-[#0EB300] px-2 py-0.5 text-[11px] font-semibold leading-4 text-white capitalize">
                  {t("active")}
                  <Check className="ml-1 w-3 h-3" strokeWidth={3} />
                </small>
              )}
            </div>
            <p className="text-left w-full text-sm text-[#505050] dark:text-white">
              {t(description)}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-0">
        <Content handleStatusUpdate={handleStatusUpdate} status={status} flowData={flowData} setEffectCall={setEffectCall} />
      </AccordionContent>
    </AccordionItem>
  )
}

export default IntegrationCard