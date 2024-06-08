import { useEditor } from "@/lib/craftjs"
import { GripHorizontal, GripVertical, Trash2 } from "lucide-react"
import React from "react"
import { Move } from "lucide-react"

export const Controller = ({ nameOfComponent }) => {
  const { actions, selected, isEnabled, isHovered } = useEditor(
    (state, query) => {
      const currentNodeId = query.getEvent("selected").last()
      const currentHoveredNodeId = query.getEvent("hovered").last()
      let selected
      let hovered
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
      if (currentHoveredNodeId) {
        hovered = {
          id: currentHoveredNodeId,
          name: state.nodes[currentHoveredNodeId].data.name,
          settings:
            state.nodes[currentHoveredNodeId].related &&
            state.nodes[currentHoveredNodeId].related.settings,
          isDeletable: query.node(currentHoveredNodeId).isDeletable(),
        }
      }

      return {
        selected,
        isEnabled: state.options.enabled,
        isHovered: hovered,
      }
    }
  )
  return (
    <div className="special absolute bottom-[100%] left-0 flex flex-row items-center gap-4 bg-blue-500 p-2 text-xs text-white">
      <span className="hover:cursor-default uppercase">{nameOfComponent}</span>
      <span className="hover:cursor-move">
        <Move />
      </span>
      {isHovered.isDeletable && (
        <button
          onClick={() => {
            actions.delete(selected.id)
          }}
          className="hover:cursor-pointer"
        >
          <Trash2 />
        </button>
      )}
    </div>
  )
}
