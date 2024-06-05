import React from "react"
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
import {GlobalThemeSettings} from "./global-theme-settings"

export const SettingsPanel = () => {
  const { actions, selected, isEnabled } = useEditor((state, query) => {
    const currentNodeId = query.getEvent("selected").last()
    let selected

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
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
  return (
    <Tabs defaultValue="element" className="">
      <TabsList>
        <TabsTrigger
          className="h-full p-4 rounded-none border-b-4 border-transparent data-[state=active]:border-current data-[state=active]:bg-inherit"
          value="element"
        >
          Element
        </TabsTrigger>
        <TabsTrigger
          className="h-full p-4 rounded-none border-b-4 border-transparent data-[state=active]:border-current data-[state=active]:bg-inherit"
          value="theme"
        >
          Theme
        </TabsTrigger>
      </TabsList>
      <TabsContent value="element">
        <ScrollArea>
          {isEnabled && selected && (
            // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
            <div className="">
              <div className="flex flex-col gap-0">
                <div>
                  <div className="pb-2">
                    <div className="flex flex-row items-center">
                      <h4 className="ml-2 text-lg font-medium leading-none">
                        Customize
                      </h4>
                    </div>
                  </div>
                </div>
                <div
                  data-cy="settings-panel"
                  className="settings-panel mb-4 flex-col gap-2"
                >
                  {selected.settings && React.createElement(selected.settings)}
                </div>
                {selected.isDeletable ? (
                  <Button
                    onClick={() => {
                      actions.delete(selected.id)
                    }}
                    variant="destructive"
                    className="mb-4"
                  >
                    Delete
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
