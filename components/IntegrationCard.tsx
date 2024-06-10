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
}

const IntegrationCard = ({
  Integrationitem,
  updateStatus,
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
      className="mb-2.5 rounded-md border bg-white shadow dark:bg-[#070e1f]"
    >
      <AccordionTrigger
        className="flex flex-col md:flex-row items-start md:items-center px-4 py-6 hover:no-underline min-h-32"
        noIcon={true}
      >
        <div>
          <Image src={image} width={60} height={60} alt={alt} />
        </div>
        <div className="mt-2 md:mt-0 ml-0 md:ml-4 lg:ml-10 flex w-full items-center justify-between">
          <div className="w-4/5 flex-col justify-start text-base font-normal text-black">
            <div className="mb-1 flex items-center ">
              <h1 className="text-black dark:text-white">{t(title)}</h1>
              {status === "active" && (
                <small className="ml-3 flex items-center rounded-2xl bg-[#EBF9F1] px-2 py-0.5 text-[11px] font-semibold leading-4 text-[#34AC68] capitalize">
                  {t("active")}
                  <Check className="ml-1 w-3 h-3" strokeWidth={3} />
                </small>
              )}
            </div>
            <p className="text-left text-sm text-black dark:text-white">
              {t(description)}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-0">
        <Content handleStatusUpdate={handleStatusUpdate} status={status} />
      </AccordionContent>
    </AccordionItem>
  )
}

export default IntegrationCard
