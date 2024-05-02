import React, { useEffect, useState } from "react"
import { Element, Frame, useNode } from "@/lib/craftjs"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProgressBar } from "@/components/progress-bar.component"
import { ScreenFooter } from "@/components/user/screens/screen-footer.component"
import { ScreenHeader } from "@/components/user/screens/screen-header.component"

import { TextDefaultProps, UserText, UserTextSettings } from "../user-text.component"
import { ArrowRight } from "lucide-react"

export const ScreenOneInput = ({ ...props }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6">
      <Element
        is={"div"}
        padding={5}
        background="#ad2121"
        canvas
        className="min-w-ful min-h-screen max-w-md"
        id="one-input-screens"
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
            text="Two more steps."
            fontSize={45}
            textAlign="center"
            fontWeight="font-bold" textColor={"inherit"} tagType={"p"}
            />
          <UserText
            text="Last few details required"
            fontSize={22}
            textAlign="center"
            fontWeight="font-light" textColor={"inherit"} tagType={"p"}          />
          <Element
            is={"div"}
            background="#ad2121"
            canvas
            className="flex min-w-full max-w-md flex-col items-center justify-center gap-6 px-4"
            id="one-input-field"
          >
            <Input type="text" placeholder="Company name" />
          </Element>
          <Element
            is={"div"}
            background="#ad2121"
            canvas
            className="flex min-w-full max-w-md flex-col items-center justify-center gap-6 px-4"
            id="one-input-field"
          >
            <Button className="flex min-w-full max-w-md flex-row items-center justify-center gap-2 px-4">
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

ScreenOneInput.craft = {
  displayName: "One Input",
  props: {},
  rules: {
    canDrag: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
}
