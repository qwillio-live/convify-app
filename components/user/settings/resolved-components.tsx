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
import { CardContentGen } from "../card/user-card.component"
import globalThemeSlice, { setPartialStyles, themeSlice } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"

const CraftJsUserComponents = {
  [CRAFT_ELEMENTS.USERCONTAINER]: "div",
  [CRAFT_ELEMENTS.LOGO]: UserLogo,
  [CRAFT_ELEMENTS.CARD]: "div",
  [CRAFT_ELEMENTS.CARDCONTENT]: CardContentGen,
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
  // useEffect(() => {

  // }, [screen])

  // useEffect(() => {
  //   console.log("Screen rerendered from global theme change")
  // },[globalTheme])
  useEffect(() => {
    try {
      // const craftState = JSON.parse(lz.decompress(lz.decodeBase64(compressedCraftState)) || '{}');
      const craftState = JSON.parse(screen) || "{}"

      const resolveComponents = () => {

        const parsedNodes = {}

        const parse = (nodeId: string, parentNodeId?: string) => {
          if (parsedNodes[nodeId]) return parsedNodes[nodeId]

          const nodeData = craftState[nodeId]
          if (!nodeData) return null

          const { type, props, nodes = [], linkedNodes = {} } = nodeData
          const resolvedName = type?.resolvedName
          const ReactComponent = resolvedName ? CraftJsUserComponents[resolvedName] : null

          const childNodes = nodes.map((childNodeId: string) => parse(childNodeId, nodeId))
          const linkedNodesElements = nodes.concat(Object.values(linkedNodes)).map((linkedNodeData: any) => {
            const linkedNodeId = linkedNodeData.nodeId || linkedNodeData
            return parse(linkedNodeId, nodeId)
          })

          const parsedNode = ReactComponent ? (
            <ReactComponent {...props} parentNodeId={parentNodeId} nodeId={nodeId} key={nodeId}>
              {/* {childNodes} */}
              {linkedNodesElements}
            </ReactComponent>
          ) : (
            <div {...props} parentNodeId={parentNodeId} nodeId={nodeId} key={nodeId}>
              {/* {childNodes} */}
              {linkedNodesElements}
            </div>
          )

          parsedNodes[nodeId] = parsedNode
          return parsedNode
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
