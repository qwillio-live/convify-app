import React, { useEffect, useState } from "react"
import { Check, Cross } from "lucide-react"

import { Element, Frame, useNode } from "@/lib/craftjs"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/progress-bar.component"
import { ScreenFooter } from "@/components/user/screens/screen-footer.component"
import { ScreenHeader } from "@/components/user/screens/screen-header.component"

import {
  TextDefaultProps,
  UserText,
  UserTextSettings,
} from "../user-text.component"
import { ContainerDefaultProps, UserContainer } from "../container/user-container.component"
import { DefaultSerializer } from "v8"
import { CardTop } from "../card/user-card.component"
import { PictureChoice, PictureChoiceDefaultProps } from "../picture-choice/picture-choice.component"

export const ButtonChoiceScreen = ({ ...props }) => {
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
    <div className="flex flex-col items-center justify-center gap-6 py-6">
      <Element
        is={UserContainer}
        {...ContainerDefaultProps}
        padding={5}
        canvas
        className="min-h-screen min-w-full"
        id="button-choice-screens"
      >
        <Element
          is={CardTop}
          background="#ad2121"
          canvas
          className="flex min-w-full flex-col items-center justify-center gap-6 py-6"
          id="button-choice-header"
        >
          <ScreenHeader />
        </Element>
        <Element
          is={"div"}
          background="#ad2121"
          canvas
          className="flex min-w-full flex-col items-center justify-center gap-6 py-6"
          id="one-choice-content"
        >
          <ProgressBar />
          <UserText
            {...TextDefaultProps}
            text="See how much you can save with Convify."
            fontSize={45}
            textAlign="center"
            fontWeight="font-bold"
            textColor={"inherit"}
            tagType={"p"}
          />
          <UserText
            {...TextDefaultProps}
            text="Does your business have a website"
            fontSize={32}
            textAlign="center"
            fontWeight="font-medium"
            textColor={"inherit"}
            tagType={"p"}
          />
        <Element
        is={PictureChoice}
        canvas
        {...PictureChoiceDefaultProps}
        />
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
  displayName: "Button Choice",
  props: {},
  rules: {
    canDrag: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
}
