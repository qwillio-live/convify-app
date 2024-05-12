import Image from "next/image"
// types and constants
import { TIntegrationCardData } from "@/types"
import { Check } from "lucide-react"

// ui components
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

  return (
    <AccordionItem
      value={title}
      className="mb-2.5 rounded-md border bg-white shadow dark:bg-[#070e1f]"
    >
      <AccordionTrigger className="flex items-center px-5 py-2.5 hover:no-underline">
        <div>
          <Image src={image} width={60} height={60} alt={alt} />
        </div>
        <div className="ml-10 flex w-full items-center justify-between">
          <div className="w-4/5 flex-col justify-start text-base font-normal text-black">
            <div className="mb-1 flex items-center ">
              <h1 className="text-black dark:text-white">{title}</h1>
              {status === "active" && (
                <small className="ml-3 flex items-center rounded-2xl bg-[#EBF9F1] px-2 py-0.5 text-[11px] font-semibold leading-4 text-[#34AC68]">
                  Active
                  <Check className="ml-1 size-3" />
                </small>
              )}
            </div>
            <p className="text-left text-sm text-black dark:text-white">
              {description}
            </p>
          </div>
          {/* {status !== "active" && (
            <div>
              <Button className="bg-black text-white hover:bg-black dark:bg-white dark:text-black">
                Connect
              </Button>
            </div>
          )} */}
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-0">
        <Content handleStatusUpdate={handleStatusUpdate} status={status} />
      </AccordionContent>
    </AccordionItem>
  )
}

export default IntegrationCard
