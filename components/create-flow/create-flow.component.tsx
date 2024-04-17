import React from "react"
import {Button} from "@/components/ui/button"
import { Plus } from "lucide-react"

export function CreateFlowComponent() {
  return (
    <div className="min-h-screen w-full">
      <div className="flex h-full min-h-screen flex-row justify-between gap-0">
        <div className="h-full min-h-screen basis-[15%] border-r border-gray-950 px-2 py-4 pl-0 dark:border-slate-100">
          <div className="section-header flex items-center justify-between">
            <h4 className="text-base font-normal tracking-tight">Content</h4>
            <Button size="icon" className="h-6 w-6">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="h-full min-h-screen basis-[55%] border-r border-gray-950 px-2 py-4 dark:border-slate-100">
        <h4 className="text-base font-normal tracking-tight">Content Form</h4>
        </div>
        <div className="h-full min-h-screen basis-[15%] border-r border-gray-950 px-2 py-4 dark:border-slate-100">
        <div className="section-header flex items-center justify-between">
            <h4 className="text-base font-normal tracking-tight">Content</h4>
            <Button size="icon" className="h-6 w-6">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="h-full min-h-screen basis-[15%] px-2 py-4 pr-0">
        <h4 className="text-base font-normal tracking-tight">Content Settings</h4>
        </div>
      </div>
    </div>
  )
}

CreateFlowComponent
