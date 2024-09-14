import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  MoveHorizontal,
  GripVertical,
  Trash2,
  Plus,
  Search,
  X as IconX,
  StretchHorizontal,
  StretchVertical,
  CloudUpload,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"
import { useTranslations } from "next-intl"

import { throttle, debounce } from "lodash"
import { useNode } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/custom-slider"

import { useAppSelector } from "@/lib/state/flows-state/hooks"
import {
  useScreenNames,
  useScreensLength,
} from "@/lib/state/flows-state/features/screenHooks"
import { RootState } from "@/lib/state/flows-state/store"
import {
  Reorder,
  useDragControls,
  useInView,
  useMotionValue,
} from "framer-motion"
import hexoid from "hexoid"
import icons from "@/constant/streamline.json"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Card } from "@/components/ui/card"

export const InputIconRenderer = ({ iconName, className = "", style = {} }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-0.5 -0.5 15 15"
      dangerouslySetInnerHTML={{ __html: icons[iconName]?.body || "" }}
      className={className}
      style={style}
    />
  )
}

const InputIconPickerItem = ({ iconName, onClick }) => {
  const ref = useRef(null)
  const isInView = useInView(ref)
  return (
    <div className="max-h-[160px]">
      <div
        ref={ref}
        className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex aspect-square h-auto max-h-full w-auto max-w-full items-center justify-center rounded-md bg-transparent p-4 text-center"
        onClick={() => onClick(iconName)}
      >
        {isInView && (
          <InputIconRenderer
            iconName={iconName}
            className="size-20 cursor-pointer"
          />
        )}
      </div>
    </div>
  )
}
export const InputSettingsIconPicker = ({ className = "", icon, onChange }) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const t = useTranslations("CreateFlow")

  const filteredIcons = Object.keys(icons).filter((iconName) =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleChange = (iconName) => {
    onChange(iconName)
    setOpen(false)
  }

  return (
    <div className={`text-center ${className}`}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className={`border-input !size-8 min-w-[22px] border bg-[#FAFAFA] p-0 [&>:first-child]:hover:block [&>:last-child]:hover:!hidden`}
            variant="ghost"
          >
            <CloudUpload className="hidden size-4" />
            <InputIconRenderer
              iconName={icon}
              className="size-4"
              style={{
                color: "#505051",
              }}
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[70%] overflow-y-auto p-0 sm:max-h-[70%] sm:max-w-[80%]">
          <DialogHeader className="sticky top-0 z-10 bg-white px-8 pb-4 pt-10">
            <div className="flex items-center justify-start gap-4">
              <div>
                <DialogTitle>{t("PictureChoice.icon")}</DialogTitle>
                <DialogDescription>
                  {t("PictureChoice.iconDesc")}
                </DialogDescription>
              </div>
              <div className="relative ml-auto flex flex-1 items-center md:grow-0">
                <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
                <Input
                  type="search"
                  placeholder={t("PictureChoice.iconSearch")}
                  className="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[336px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DialogClose asChild>
                <Button variant="ghost">
                  <IconX className="size-5 shrink-0" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>
          <div className="m-6 mt-0 grid grid-cols-6 gap-4">
            {filteredIcons.length > 0 ? (
              filteredIcons.map((iconName) => (
                <InputIconPickerItem
                  key={iconName}
                  iconName={iconName}
                  onClick={handleChange}
                />
              ))
            ) : (
              <div className="col-span-6 mt-4 text-center">
                {t("PictureChoice.iconNotFound")}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
