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
import { ScrollArea } from "@/components/ui/scroll-area"

const ColorPicker = ({ color, onChange }) => {
  const t = useTranslations("Components")
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
        {t("suggestions")}
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
          border: 1px solid #e9e9e9;
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
          border: 1px solid #e9e9e9;
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
          border: 1px solid #e9e9e9;
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
      <div className="flex h-full w-full px-12">
        <div className="flex w-full">
          <div className="w-full  py-9 md:w-6/12">
            <ScrollArea className=" bottom-50 xl-h-[86rem] h-[80vh] pr-6 md:h-[75vh] lg:h-[86vh] ">
              <h2 className="mb-5 text-4xl font-semibold">
                {t("customiseColor")}
              </h2>
              <Breadcrumb className=" mt-4 text-base font-normal hover:cursor-pointer">
                <BreadcrumbList>
                  <BreadcrumbItem className="mr-2 text-base">
                    <BreadcrumbLink>
                      <Link
                        href={"/dashboard/flows/create-flow/select-template"}
                      >
                        {t("templateBreadcrumb")}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="mx-2 text-base">
                    <BreadcrumbPage className="font-semibold">
                      {t("colorsBreadcrumb")}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="mx-2 text-base">
                    <BreadcrumbLink>
                      <Link href={"/dashboard/flows/create-flow/finish"}>
                        {t("finishBreadcrumb")}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              {/* <ScrollArea className="max-h-[calc(100vh - 350px)] h-[38rem] "> */}
              <div className="mb-8 mt-10 flex flex-wrap gap-3 ">
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
            </ScrollArea>
          </div>

          <Separator orientation="vertical" className="z-20 h-full" />
          <div className="mx-auto  w-full py-6 md:w-6/12">
            <iframe
              src="https://convify.io/survey"
              name="page"
              height={800}
              width="100%"
              title="Survey"
            ></iframe>
          </div>
        </div>
        <div className="fixed bottom-0 left-4 z-10 flex w-full items-center justify-between bg-white px-6 py-3 pr-11  md:w-6/12">
          <Link href={"/dashboard/flows/create-flow/select-template"}>
            <Button
              variant="secondary"
              size="icon"
              className="hover:cursor-pointer"
            >
              <ChevronLeft className="z-10 h-4 w-4" />
            </Button>
          </Link>

          <div className="flex">
            <Link href={"/dashboard"}>
              <Button
                className="mr-2 w-32 font-bold hover:cursor-pointer"
                size="lg"
                variant="outline"
              >
                {t("exit")}
              </Button>
            </Link>
            <Link href={"/dashboard/flows/create-flow/finish"}>
              <Button
                className="w-32 font-bold text-white hover:cursor-pointer"
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
