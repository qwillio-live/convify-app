"use client"

import { useTranslations } from "next-intl"

export default function NotFound() {
  const t = useTranslations("Not-Found")
  return (
    <div className="flex h-screen w-screen">
      <div className="m-auto flex items-center">
        <h1 className="text-2xl font-[500]">{t("title")}</h1>
        <hr className="border-primary mx-5 h-12 border-r" />
        <h2 className="text-sm">{t("description")}</h2>
      </div>
    </div>
  )
}
