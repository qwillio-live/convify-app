import React from 'react'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import {   Clipboard,
  ClipboardCopy,
  Delete,
  Edit,
  MousePointer,
  PlusCircle,
  Scissors,
  Trash2,
  Pencil, } from 'lucide-react'
  import { Reorder } from 'framer-motion'
import { Card } from '@/components/ui/card'
import ResolvedComponentsFromCraftState from '../settings/resolved-components'
import { useAppSelector } from '@/lib/state/flows-state/hooks'
import { cn } from '@/lib/utils'


export const ScreenListItem = ({
  screen,
  index,
  handleScreenClick,
  handleDuplicateScreen,
  handleAddScreen,
  handleDeleteScreen,
}) => {
  const backgroundColor = useAppSelector((state) => state?.theme?.general?.backgroundColor);

  const selectedScreenIndex = useAppSelector(
    (state) => state?.screen?.selectedScreen
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
                    <div className="mt-4 flex flex-row items-center justify-between px-2 gap-4">
                      <span>{index+1}</span>
                      <span className="flex flex-row gap-2 items-center text-current bg-slate-500 p-2 grow justify-end hover:cursor-text"><Pencil size={16} />{screen?.screenName ?? "New Screen"}</span>
                    </div>
                    <Card
                      style={{ backgroundColor: backgroundColor }}
                      className={cn(
                        "h-60 w-[14vw] mt-2 flex flex-col items-center justify-center border hover:cursor-pointer relative overflow-hidden",
                        {
                          "border-blue-500": (selectedScreenIndex === index),
                        }
                      )}
                      onClick={handleScreenClick(index)}
                    >
                      <div className="text-xs text-muted-foreground scale-[.20] relative">
                        <div className="absolute w-full h-full z-10 bg-transparent top-0 left-0"></div>
                        <ResolvedComponentsFromCraftState screen={screen.screenData ? screen.screenData : {}} />
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
