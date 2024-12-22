import React from "react"
import { Reorder } from "framer-motion"
import {
  Clipboard,
  ClipboardCopy,
  Delete,
  Edit,
  MousePointer,
  Pencil,
  PlusCircle,
  Scissors,
  Trash2,
} from "lucide-react"

import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import ResolvedComponentsFromCraftState from "../settings/resolved-components"
import { useParams } from "next/navigation"

export const ScreenListItem = ({
  screen,
  index,
  handleScreenClick,
  handleDuplicateScreen,
  handleAddScreen,
  handleDeleteScreen,
}) => {
  const { flowId = "" } = useParams<{ flowId: string }>() ?? {}
  const backgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )

  const selectedScreenIndex = useAppSelector(
    (state) => state?.screen?.flows[flowId]?.selectedScreen
  )

  return (
    <Reorder.Item
      key={screen?.screenName}
      id={screen?.screenName}
      value={screen}
      className="relative"
    >
      <ContextMenu>
        <ContextMenuTrigger>
          {" "}
          <div className="mt-4 flex flex-row items-center justify-between gap-4 px-2">
            <span>{index + 1}</span>
            <span className="flex grow flex-row items-center justify-end gap-2 bg-slate-500 p-2 text-current hover:cursor-text">
              <Pencil size={16} />
              {screen?.screenName ?? "New Screen"}
            </span>
          </div>
          <Card
            style={{ backgroundColor: backgroundColor }}
            className={cn(
              "relative mt-2 flex h-60 w-[14vw] flex-col items-center justify-center overflow-hidden border hover:cursor-pointer",
              {
                "border-blue-500": selectedScreenIndex === index,
              }
            )}
            onClick={() => handleScreenClick(index)}
          >
            <div className="text-muted-foreground relative scale-[.20] text-xs">
              <div className="absolute left-0 top-0 z-10 h-full w-full bg-transparent"></div>
              <ResolvedComponentsFromCraftState
                screen={screen.screenData ? screen.screenData : {}}
              />
            </div>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className="flex flex-row items-center gap-2 text-inherit hover:cursor-pointer"
            onClick={() => handleAddScreen(index)}
          >
            <PlusCircle size={18} />
            <span>Add screen</span>
          </ContextMenuItem>
          <ContextMenuItem
            className="flex flex-row items-center gap-2 text-inherit hover:cursor-pointer"
            onClick={() => handleDuplicateScreen(index)}
          >
            <ClipboardCopy size={18} />
            <span>Duplicate</span>
          </ContextMenuItem>
          <ContextMenuItem
            className="flex flex-row items-center gap-2 text-inherit hover:cursor-pointer"
            onClick={() => handleDeleteScreen(index)}
          >
            <Trash2 size={18} />
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </Reorder.Item>
  )
}
