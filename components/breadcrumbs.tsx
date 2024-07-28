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

export function BreadCrumbs() {
  const t = useTranslations("CreateFlow")

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
        <BreadcrumbItem>
          <BreadcrumbPage>My new form</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}