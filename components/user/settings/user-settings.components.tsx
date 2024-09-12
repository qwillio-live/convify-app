import React, { useEffect } from "react"
import { Layers } from "@craftjs/layers/"

import { useEditor } from "@/lib/craftjs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlobalThemeSettings } from "./global-theme-settings"
import { useTranslations } from "next-intl"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import {
  removeField,
  setSelectedComponent,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"

export const SettingsPanel = () => {
  const t = useTranslations("Components")
  const dispatch = useAppDispatch()
  const mobileScreen = useAppSelector((state) => state?.theme?.mobileScreen)
  const selectedComponent = useAppSelector(
    (state) => state?.screen?.selectedComponent
  )
  const { actions, selected, isEnabled, query } = useEditor((state, query) => {
    const currentNodeId = selectedComponent
      ? selectedComponent
      : query.getEvent("selected").last()
    let selected

    if (currentNodeId && state.nodes[currentNodeId]) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        fieldType:
          state.nodes[currentNodeId]?.data?.props.fieldType || "design",
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      }
    }
    return {
      selected,
      isEnabled: state.options.enabled,
    }
  })

  useEffect(() => {
    if (selected || selectedComponent) {
      actions.selectNode(selectedComponent || "ROOT")
    }
  }, [mobileScreen, selectedComponent])
  return (
    <Tabs defaultValue="element" className="font-poppins">
      <TabsList className="h-15 w-full rounded-none border-b px-5 pb-0">
        <TabsTrigger
          className="size-full rounded-none border-b-2 border-transparent p-4 uppercase data-[state=active]:border-current data-[state=active]:bg-inherit"
          value="element"
        >
          {t("Element")}
        </TabsTrigger>
        <TabsTrigger
          className="size-full rounded-none border-b-2 border-transparent p-4 uppercase data-[state=active]:border-current data-[state=active]:bg-inherit"
          value="theme"
        >
          {t("Theme")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="element" className="px-4">
        <ScrollArea>
          {isEnabled && selected && (
            // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
            <div className="">
              <div className="flex flex-col gap-0">
                <div
                  data-cy="settings-panel"
                  className="settings-panel mb-3 flex-col gap-2"
                >
                  {selected.settings && React.createElement(selected.settings)}
                </div>
                {selected.isDeletable ? (
                  <Button
                    onClick={() => {
                      actions.delete(selected.id),
                        dispatch(setSelectedComponent("ROOT"))
                      if (selected.fieldType === "data") {
                        dispatch(removeField(selected.id))
                      }
                    }}
                    variant="destructive"
                    className="font-poppins my-4 text-base font-medium"
                  >
                    {t("Delete")}
                  </Button>
                ) : null}
              </div>
            </div>
          )}
          {/* <Layers expandRootOnLoad={true} /> */}
        </ScrollArea>
      </TabsContent>
      <TabsContent value="theme">
        <GlobalThemeSettings />
      </TabsContent>
    </Tabs>
  )
}
