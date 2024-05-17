"use client"
import React, { Suspense, useEffect, useState } from "react"
import { UserContainer } from "@/components/user/container/user-container.component"
import { HeadlineTextGen } from "@/components/user/headline-text/headline-text.component"
import { IconButtonGen } from "@/components/user/icon-button/user-icon-button.component"
import { UserLogo } from "@/components/user/logo/user-logo.component"
// import lz from "lzutf8";
import { CRAFT_ELEMENTS } from "@/components/user/settings/craft-elements"
import { UserTextGen } from "@/components/user/text/user-text.component"

import { UserInputGen } from "../input/user-input.component"
import { LogoBarGen } from "../logo-bar/logo-bar.component"
import { ProgressBarGen } from "../progress/user-progress.component"
import jsonData from "./parse.json"
import { PictureChoiceGen } from "../picture-choice/picture-choice.component"
import { MultipleChoiceGen } from "../multiple-choice/user-multiple-choice.component"
import { ScreenFooterGen } from "../screens/screen-footer.component"

const CraftJsUserComponents = {
  [CRAFT_ELEMENTS.USERCONTAINER]: "div",
  [CRAFT_ELEMENTS.LOGO]: UserLogo,
  [CRAFT_ELEMENTS.DIV]: "div",
  [CRAFT_ELEMENTS.LOGOBAR]: LogoBarGen,
  [CRAFT_ELEMENTS.PROGRESSBAR]: ProgressBarGen,
  [CRAFT_ELEMENTS.ICONBUTTON]: IconButtonGen,
  [CRAFT_ELEMENTS.USERINPUT]: UserInputGen,
  [CRAFT_ELEMENTS.USERTEXT]: UserTextGen,
  [CRAFT_ELEMENTS.HEADLINETEXT]: HeadlineTextGen,
  [CRAFT_ELEMENTS.PICTURECHOICE]: PictureChoiceGen,
  [CRAFT_ELEMENTS.MULTIPLECHOICE]: MultipleChoiceGen,
  [CRAFT_ELEMENTS.SCREENFOOTER]: ScreenFooterGen,
}

interface Props {
  compressedCraftState: string
}

const ResolvedComponentsFromCraftState = ({screen}): React.ReactElement | null => {
  const [toRender, setToRender] = useState<React.ReactElement | null>(null)
  useEffect(() => {

  }, [screen])
  useEffect(() => {
    try {
      // const craftState = JSON.parse(lz.decompress(lz.decodeBase64(compressedCraftState)) || '{}');
      const craftState = JSON.parse(screen) || "{}"

      const resolveComponents = () => {
        const parse = (
          nodeId: string,
          parentNodeId?: string
        ): React.ReactElement | null => {
          if (!nodeId) return null

          const nodeData = craftState[nodeId]
          if (!nodeData) return null

          const { nodes: childNodeIds = [], type, props } = nodeData
          const resolvedName = type?.resolvedName
          const ReactComponent = resolvedName
            ? (CraftJsUserComponents as any)[resolvedName]
            : null

          if (resolvedName && !ReactComponent) {
            console.error(
              `Component ${resolvedName} not found in CraftJsUserComponents.`
            )
            return null
          }

          const extendedProps = {
            ...props,
            parentNodeId,
            nodeId,
            key: nodeId,
          }

          const childNodes = childNodeIds
            .map((childNodeId: string) => parse(childNodeId, nodeId))
            .filter(Boolean)

          return ReactComponent ? (
            <ReactComponent {...extendedProps}>{childNodes}</ReactComponent>
          ) : (
            <div {...extendedProps}>{childNodes}</div>
          )
        }

        return parse("ROOT") || <></>
      }

      setToRender(resolveComponents())
    } catch (error) {
      console.error("Error parsing craft state: ", error)
      setToRender(<div>Error loading components.</div>)
    }
  }, [screen])

  return <Suspense fallback={<h2>Loading...</h2>}>{toRender}</Suspense>
}

export default ResolvedComponentsFromCraftState
