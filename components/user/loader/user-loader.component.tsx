import React from "react"
import { useNode } from "@/lib/craftjs"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import CustomLoader from "@/components/ui/loader"
import { Controller } from "../settings/controller.component"

export const Loader = ({ ...props }) => {
  const {
    actions: { setProp },
    connectors: { connect, drag },
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))

  return (
    <CustomLoader
      ref={(ref: any) => connect(drag(ref))}
      className="relative m-5 border border-dashed border-transparent transition-all duration-200"
      {...props}
    >
      {isHovered && <Controller nameOfComponent={"LOADER"} />}
    </CustomLoader>
  )
}

export const LoaderSettings = () => {
  const {
    actions: { setProp },
    props: { waitTime },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  const handleWaitTimeChange = (e) => {
    const newWaitTime = parseInt(e.target.value)
    if (!isNaN(newWaitTime) && newWaitTime > 0) {
      setProp((props) => (props.waitTime = newWaitTime), 1000)
    }
  }

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
            <span className="text-sm font-medium">General</span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 gap-y-2 p-2">
            <div className="style-control col-span-1 flex flex-col gap-2">
              <p className="text-md text-muted-foreground">
                Wait Time in seconds
              </p>
              <Input
                type="number"
                value={waitTime}
                onChange={handleWaitTimeChange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export const LoaderDefaultProps = {
  size: "default",
  waitTime: 2,
}

Loader.craft = {
  props: LoaderDefaultProps,
  related: {
    settings: LoaderSettings,
  },
}
