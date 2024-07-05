"use client"
import React, { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { HexColorPicker } from "react-colorful"
import tinycolor from "tinycolor2"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

const ColorPicker = ({ color, onChange }) => {
  return (
    <div className="color-picker">
      <HexColorPicker color={color} onChange={onChange} />
      <div className="color-text-container">
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="color-text font-sans3 font-xs font-normal text-[#191919]"
        />
      </div>
      <Separator className="mt-3" />
      <span className="font-sans3 mt-2 flex w-full justify-start text-xs font-normal tracking-wide text-[#919191]">
        Suggestions
      </span>
      <style jsx>{`
        .color-picker {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .color-picker .react-colorful__saturation,
        .color-picker .react-colorful__hue {
          height: 5px !important;
        }
        .color-picker .react-colorful__pointer {
          background: white;
          border-radius: 50%;
        }
        .color-text-container {
          margin-top: 10px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 3px;
          padding: 4px;
          display: flex;
          width: 100%;
          justify-content: center;
        }
        .color-text {
          width: 100%;
          text-align: center;
          border: none;
          outline: none;
        }
      `}</style>
    </div>
  )
}

const ColorPickerWithSuggestions = ({ color, onChange }) => {
  const generateSuggestions = (baseColor) => {
    const colorObj = tinycolor(baseColor)
    return [
      colorObj.darken(10).toHexString(),
      colorObj.desaturate(10).toHexString(),
      colorObj.lighten(5).toHexString(),
      colorObj.lighten(20).toHexString(),
      colorObj.lighten(10).toHexString(),
    ]
  }

  const suggestions = generateSuggestions(color)

  return (
    <div className="color-picker-wrapper">
      <ColorPicker color={color} onChange={onChange} />
      <div className="suggestions">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="suggestion"
            style={{ backgroundColor: suggestion }}
            onClick={() => onChange(suggestion)}
          />
        ))}
      </div>
      <style jsx>{`
        .color-picker-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 9px;
          background-color: #fff;
        }
        .suggestions {
          display: flex;
          justify-content: center;
          margin-top: 8px;
        }
        .suggestion {
          width: 45px;
          height: 40px;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default function SelectColor() {
  const [primaryColor, setPrimaryColor] = useState("#40BF80")
  const [textColor, setTextColor] = useState("#191919")
  const [backgroundColor, setBackgroundColor] = useState("#F4F4F4")
  const t = useTranslations("Components")

  return (
    <div className="font-sans3 flex h-screen flex-col overflow-hidden tracking-wide">
      <div className="flex h-full w-full px-8">
        <div className="flex w-full">
          <div className="w-full  py-9 md:w-6/12">
            <h2 className="mb-5 text-4xl font-semibold">
              {t("customiseColor")}
            </h2>
            <Breadcrumb className="mb-6 mt-4 text-base font-normal">
              <BreadcrumbList>
                <BreadcrumbItem className="mr-2 text-base">
                  <BreadcrumbLink>{t("templateBreadcrumb")}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="mx-2 text-base">
                  <BreadcrumbPage>{t("colorsBreadcrumb")}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="mx-2 text-base">
                  <BreadcrumbLink>{t("finishBreadcrumb")}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="mb-8 mt-12 flex flex-wrap gap-7">
              <div className="flex flex-col">
                <label className="my-3 block text-base font-semibold ">
                  {t("primaryColor")}
                </label>
                <ColorPickerWithSuggestions
                  color={primaryColor}
                  onChange={setPrimaryColor}
                />
              </div>
              <div className="flex flex-col">
                <label className="my-3 block text-base font-semibold ">
                  {t("textColor")}
                </label>
                <ColorPickerWithSuggestions
                  color={textColor}
                  onChange={setTextColor}
                />
              </div>
              <div className="flex flex-col">
                <label className="my-3 block text-base font-semibold ">
                  {t("backgroundColor")}
                </label>
                <ColorPickerWithSuggestions
                  color={backgroundColor}
                  onChange={setBackgroundColor}
                />
              </div>
            </div>
          </div>
          <Separator orientation="vertical" className="mx-4 h-full" />
          <div className="w-full py-6 md:w-5/12">
            <iframe
              src="https://convify.io/survey"
              name="page"
              height={800}
              width="100%"
              title="Survey"
            ></iframe>
          </div>
        </div>
        <div className="fixed bottom-8 left-4 flex w-full items-center justify-between bg-white px-6 py-3 md:w-6/12">
          <Link href={"/dashboard/flows/create-flow/select-template"}>
            <Button variant="secondary" size="icon">
              <ChevronLeft className="z-10 h-4 w-4" />
            </Button>
          </Link>

          <div className="flex">
            <Link href={"/dashboard"}>
              <Button
                className="mr-2 w-32 font-bold"
                size="lg"
                variant="outline"
              >
                {t("exit")}
              </Button>
            </Link>
            <Link href={"/dashboard/flows/create-flow/finish"}>
              <Button
                className="w-32 font-bold text-white"
                size="lg"
                variant="default"
              >
                {t("continue")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
