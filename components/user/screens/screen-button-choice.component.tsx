import React, { useEffect, useState } from "react"

import { ScreenFooter } from "@/components/user/screens/screen-footer.component"
import { ScreenHeader } from "@/components/user/screens/screen-header.component"
import { Element, Frame, useNode } from "@craftjs/core"
import { UserText,UserTextSettings } from "../user-text.component"
import { ProgressBar } from "@/components/progress-bar.component"
import { Check, Cross } from "lucide-react"
import { Button } from "@/components/ui/button"

export const ButtonChoiceScreen = ({...props}) => {
  // const {
  //   connectors: { connect, drag },
  //   selected,
  //   actions: { setProp },
  // } = useNode((state) => ({
  //   selected: state.events.selected,
  //   dragged: state.events.dragged,

  // }));
  // const [editable, setEditable] = useState(false);

  // useEffect(() => {
  //   if (selected) {
  //     return;
  //   }

  //   setEditable(false);
  // }, [selected]);
  return (
    <div
    className="flex flex-col items-center justify-center gap-6 py-6">
        <Element
          is={"div"}
          padding={5}
          background="#ad2121"
          canvas
          className="min-h-screen min-w-full"
          id="button-choice-screens"
        >
          <Element
          is={"div"}
          background="#ad2121"
          canvas
          className="flex min-w-full flex-col items-center justify-center gap-6 py-6"
          id="button-choice-header"
        >
          <ScreenHeader />
          <ProgressBar />
          </Element>
          <Element
          is={"div"}
          background="#ad2121"
          canvas
          className="flex min-w-full flex-col items-center justify-center gap-6 py-6"
          id="one-choice-content"
        >
            <UserText
              text="See how much you can save with Convify."
              fontSize={45}
              textAlign="center"
              fontWeight="font-bold"
            />
            <UserText
              text="Does your business have a website"
              fontSize={32}
              textAlign="center"
              fontWeight="font-medium"
            />
            <Element
            is={"div"}
            background="#ad2121"
            canvas
            className="flex min-w-full max-w-md flex-row items-center justify-center gap-2 px-4"
            id="button-choice-buttons"
          >
            <Button className="flex h-24 w-24 max-w-md flex-col items-center justify-center gap-2 px-2 text-center">
               <Check /><span>Yes</span>
            </Button>

            <Button className="flex h-24 w-24 max-w-md flex-col items-center justify-center gap-2 px-2 text-center">
              <Cross /> <span>No</span>
            </Button>
          </Element>
            </Element>
          <Element
          is={"div"}
          background="#ad2121"
          canvas
          className="flex min-w-full flex-col items-center justify-center gap-6 py-6"
          id="button-choice-footer"
        >
          <ScreenFooter />
          </Element>
        </Element>
    </div>
  )
}


ButtonChoiceScreen.craft = {
  displayName: 'Button Choice',
  props: {
  },
  rules: {
    canDrag: (self: Node, helper) => true,
    canMoveIn: (incoming: Node[], self: Node, helper) => true,
    canMoveOut: (outgoing: Node[], self: Node, helper) => true
  },
};

