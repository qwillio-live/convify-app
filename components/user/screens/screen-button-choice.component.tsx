import React, { useEffect, useState } from "react"
import { Check, Cross } from "lucide-react"

import { Element, Frame, useNode } from "@/lib/craftjs"
import { Button } from "@/components/ui/button"
import { ScreenFooter } from "@/components/user/screens/screen-footer.component"
import { ScreenHeader } from "@/components/user/screens/screen-header.component"

import {
  TextDefaultProps,
  UserText
} from "../text/user-text.component"
import { UserTextSettings } from "../text/user-text-settings"
import { ContainerDefaultProps, UserContainer } from "../container/user-container.component"
import { DefaultSerializer } from "v8"
import { CardTop } from "../card/user-card.component"
import { PictureChoice, PictureChoiceDefaultProps } from "../picture-choice/picture-choice.component"
import { IconButton, IconButtonDefaultProps } from "../icon-button/user-icon-button.component"
import { ProgressBar,ProgressBarDefaultProps } from "../progress/user-progress.component"

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
    // <div className="flex flex-col items-center justify-center gap-6 py-6">
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
          <UserText
            {...TextDefaultProps}
            text="See how much you can save with Convify."
            fontSize={45}
            marginBottom={12}
            textAlign="center"
            fontWeight="800"
            textColor={"inherit"}
            tagType={"p"}
          />
        <Element
          is={ProgressBar}
          {...ProgressBarDefaultProps}
          id="button-choice-progress-bar"

        />
        <Element
        is={PictureChoice}
        canvas
        {...PictureChoiceDefaultProps}
        />
        </Element>
        <Element
           is={IconButton}
          {...IconButtonDefaultProps}
          id="button-choice-icon-button" />
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
    // </div>
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
