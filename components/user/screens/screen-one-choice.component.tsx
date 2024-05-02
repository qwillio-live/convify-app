import React, { useEffect, useState } from "react"
import { ArrowRight, Facebook, Github, Globe, Linkedin } from "lucide-react"

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

export const ScreenOneChoice = ({ ...props }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6">
      <Element
        is={"div"}
        padding={5}
        background="#ad2121"
        canvas
        className="min-h-screen min-w-full"
        id="one-choice-screens"
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
            {...TextDefaultProps}
            text="Which marketing channels do you use?"
            fontSize={40}
            textAlign="center"
            fontWeight="font-bold"
            textColor={"inherit"}
            tagType={"p"}
          />
          <Element
            is={"div"}
            background="#ad2121"
            canvas
            className="flex w-full max-w-md flex-col items-center justify-center gap-2 px-6"
            id="one-choice-field"
          >
            <Button
              variant="outline"
              className="flex w-full max-w-md flex-row items-center justify-start gap-2 p-6"
            >
              <Github />
              <span>Google</span>
            </Button>{" "}
            <Button
              variant="outline"
              className="flex w-full max-w-md flex-row items-center justify-start gap-2 p-6"
            >
              <Facebook />
              <span>Facebook</span>
            </Button>{" "}
            <Button
              variant="outline"
              className="flex w-full max-w-md flex-row items-center justify-start gap-2 p-6"
            >
              <Linkedin />
              <span>Linkedin</span>
            </Button>{" "}
            <Button
              variant="outline"
              className="flex w-full max-w-md flex-row items-center justify-start gap-2 p-6"
            >
              <Globe />
              <span>Other</span>
            </Button>
          </Element>
          <Element
            is={"div"}
            background="#ad2121"
            canvas
            className="flex min-w-full max-w-md flex-col items-center justify-center gap-6 px-4"
            id="one-input-field"
          >
            <Button className="flex w-full max-w-md flex-row items-center justify-center gap-2 px-4">
              <span>Continue</span> <ArrowRight />
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

ScreenOneChoice.craft = {
  displayName: "One Choice",
  props: {},
  rules: {
    canDrag: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
}
