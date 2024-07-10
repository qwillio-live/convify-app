import { ChevronLeft } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import { useState } from "react"

const extractFlowIdFromUrl = (currentPath) => {
  const url = currentPath; // Get the current URL
  const matchShare = url && url.match(/dashboard\/([^\/]+)\/share/); // Use regex to match the flowId
  const matchConnect = url && url.match(/dashboard\/([^\/]+)\/connect/); // Use regex to match the flowId
  const matchResult = url && url.match(/dashboard\/([^\/]+)\/results/); // Use regex to match the flowId
  if (matchShare && matchShare[1] && matchShare[1] !== "flows") {
    return matchShare[1]
  }
  else if (matchConnect && matchConnect[1] && matchConnect[1] !== "flows") {
    return matchConnect[1]
  }
  else if (matchResult && matchResult[1] && matchResult[1] !== "flows") {
    return matchResult[1]
  }
  return null
};
export function BreadCrumbs() {
  const t = useTranslations("CreateFlow")
  const currentPath = usePathname();
  const [flowId, setFlowId] = useState<string | null>(extractFlowIdFromUrl(currentPath));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            <span className="hidden lg:inline-block">{t("My workspace")}</span>
            <Button
              className="lg:hidden p-0 size-8 max-h-8"
              size="sm"
              variant="outline"
            >
              <ChevronLeft />
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden lg:inline-block">
          /
        </BreadcrumbSeparator>
        <BreadcrumbItem className="max-lg:ml-3.5">
          <BreadcrumbPage>{
            flowId ? flowId : t("My new form")
          }</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
