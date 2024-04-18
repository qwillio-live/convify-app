import React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CreateFlowComponent() {
  return (
    <div className="min-h-screen w-full">
      <div className="flex h-full min-h-screen flex-row justify-between gap-0">
        <div className="h-full max-h-screen min-h-screen basis-[15%] overflow-y-auto border-r px-2 py-4 pl-0">
          <div className="section-header flex items-center justify-between">
            <h4 className="text-base font-normal tracking-tight">Content</h4>
            <Button size="icon" className="h-6 w-6">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="section-body"></div>
        </div>
        <div className="h-full  max-h-screen min-h-screen basis-[55%] overflow-y-auto border-r px-2 py-4 ">
          <div className="section-header flex items-center justify-between">
            <h4 className="text-base font-normal tracking-tight">
              Content Form
            </h4>
          </div>
          <div className="section-body"></div>
        </div>
        <div className="h-full  max-h-screen min-h-screen basis-[15%]  overflow-y-auto border-r px-2 py-4 ">
          <div className="section-header flex items-center justify-between">
            <h4 className="text-base font-normal tracking-tight">Content</h4>
            <Button size="icon" className="h-6 w-6">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="section-body"></div>
        </div>
        <div className="h-full  max-h-screen min-h-screen basis-[15%]  overflow-y-auto py-4 pl-2  pr-4 lg:pr-6">
          <div className="section-header flex items-center justify-between">
            <h4 className="text-base font-normal tracking-tight">
              Content Settings
            </h4>
          </div>
          <div className="section-body overflow-y-auto"></div>
        </div>
      </div>
    </div>
  )
}

CreateFlowComponent
