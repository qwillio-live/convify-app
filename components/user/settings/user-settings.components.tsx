import React from "react"
import { useEditor } from "@craftjs/core"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Layers } from '@craftjs/layers';

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

  return isEnabled && selected ? (
    // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
    <div className="">
      <div className="flex flex-col gap-0">
        <div>
          <div className="pb-2">
            <div className="flex flex-row items-center">
              <h4 className="mr-2 text-lg font-medium leading-none">
                Customize {selected.name}
              </h4>
            </div>
          </div>
        </div>
        <div
          data-cy="settings-panel"
          className="settings-panel mb-4 flex-col gap-2"
        >
          {selected.settings && React.createElement(selected.settings) }
        </div>
        {selected.isDeletable ? (
          <Button
            onClick={() => {
              actions.delete(selected.id)
            }}
            variant="destructive"
          >
            Delete
          </Button>
        ) :
        null
        }
        <Layers expandRootOnLoad={true} expanded={true} />
      </div>
    </div>
  ) : null
}
