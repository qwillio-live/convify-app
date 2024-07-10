import React, { Suspense, useEffect, useState } from "react"
import { UserContainer, UserContainerGen } from "@/components/user/container/user-container.component"
import { HeadlineTextGen } from "@/components/user/headline-text/headline-text.component"
import { IconButtonGen } from "@/components/user/icon-button/user-icon-button.component"
import { UserLogo } from "@/components/user/logo/user-logo.component"
// import lz from "lzutf8";
import { CRAFT_ELEMENTS } from "@/components/user/settings/craft-elements"
import { UserTextInputGen } from "@/components/user/text/user-text.component"
import { UserInputGen } from "../input/user-input.component"
import { LogoBarGen } from "../logo-bar/user-logo-bar.component"
import { ProgressBarGen } from "../progress/user-progress.component"
import { FormContentGen, FormGen } from "../form/user-form.component"
import jsonData from "./parse.json"
import { PictureChoiceGen } from "../picture-choice/user-picture-choice.component"
import { MultipleChoiceGen } from "../multiple-choice/user-multiple-choice.component"
import { ScreenFooterGen } from "../screens/screen-footer.component"
import { CardContentGen, CardGen } from "../card/user-card.component"
import globalThemeSlice, { setPartialStyles, themeSlice } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { UserInputCheckboxGen, UserInputCheckbox } from "../input-checkbox/user-input-checkbox.component"
import { UserInputMailGen, UserInputMail } from "../input-email/user-input-mail.component"
import { User } from "lucide-react"
import { UserInputPhoneGen } from "../input-phone/user-input-phone.component"
import { UserInputTextareaGen } from "../input-textarea/user-input-textarea.component"
import { ImageComponentGen } from "../image-new/user-image.component"
import { SelectGen } from "../select/user-select.component"
import { ChecklistGen } from "../checklist/user-checklist.component"
import { ListGen } from "../list/user-list.component"
import { StepsGen } from "../steps/user-steps.component"
import { AvatarComponentGen } from "../avatar-new/user-avatar.component"
import { LogoComponentGen } from "../logo-new/user-logo.component"
import { LoaderComponentGen } from "../loader-new/user-loader.component"
import { TextImageComponentGen } from "../textImage/user-textImage.component"

const CraftJsUserComponents = {
  [CRAFT_ELEMENTS.USERCONTAINER]: UserContainerGen,
  [CRAFT_ELEMENTS.LOGO]: UserLogo,
  [CRAFT_ELEMENTS.CARD]: CardGen,
  [CRAFT_ELEMENTS.CARDCONTENT]: CardContentGen,
  [CRAFT_ELEMENTS.DIV]: "div",
  [CRAFT_ELEMENTS.LOGOBAR]: LogoBarGen,
  [CRAFT_ELEMENTS.PROGRESSBAR]: ProgressBarGen,
  [CRAFT_ELEMENTS.ICONBUTTON]: IconButtonGen,
  [CRAFT_ELEMENTS.LOGOCOMPONENT]: LogoComponentGen,
  [CRAFT_ELEMENTS.LOADERCOMPONENT]: LoaderComponentGen,
  [CRAFT_ELEMENTS.IMAGECOMPONENT]: ImageComponentGen,
  [CRAFT_ELEMENTS.AVATARCOMPONENT]: AvatarComponentGen,
  [CRAFT_ELEMENTS.TEXTIMAGECOMPONENT]: TextImageComponentGen,
  [CRAFT_ELEMENTS.SELECT]: SelectGen,
  [CRAFT_ELEMENTS.USERINPUT]: UserInputGen,
  [CRAFT_ELEMENTS.USERTEXT]: UserTextInputGen,
  [CRAFT_ELEMENTS.HEADLINETEXT]: HeadlineTextGen,
  [CRAFT_ELEMENTS.PICTURECHOICE]: PictureChoiceGen,
  [CRAFT_ELEMENTS.MULTIPLECHOICE]: MultipleChoiceGen,
  [CRAFT_ELEMENTS.STEPS]: StepsGen,
  [CRAFT_ELEMENTS.CHECKLIST]: ChecklistGen,
  [CRAFT_ELEMENTS.LIST]: ListGen,
  [CRAFT_ELEMENTS.SCREENFOOTER]: ScreenFooterGen,
  [CRAFT_ELEMENTS.INPUTCHECKBOX]: UserInputCheckboxGen,
  [CRAFT_ELEMENTS.INPUTMAIL]: UserInputMailGen,
  [CRAFT_ELEMENTS.INPUTPHONE]: UserInputPhoneGen,
  [CRAFT_ELEMENTS.TEXTAREA]: UserInputTextareaGen,
  [CRAFT_ELEMENTS.FORM]: FormGen,
  [CRAFT_ELEMENTS.FORMCONTENT]: FormContentGen,
}

interface Props {
  compressedCraftState: string
}



const ResolvedComponentsFromCraftState = ({ screen }): React.ReactElement | null => {
  const [toRender, setToRender] = useState<React.ReactElement | null>(null)
  const globalTheme = useAppSelector((state: RootState) => state?.theme)


  useEffect(() => {
    try {
      const craftState = JSON.parse(screen)
      console.log("Parsed Craft State:", craftState); // Log parsed JSON data

      const resolveComponents = () => {
        const parsedNodes = {}

        const parse = (nodeId: string, parentNodeId?: string) => {
          if (parsedNodes[nodeId]) return parsedNodes[nodeId]
          console.log(`Parsing node: ${parsedNodes[nodeId]}`)

          const nodeData = craftState[nodeId]
          if (!nodeData) return null

          const { type, props, nodes = [], linkedNodes = {} } = nodeData
          const resolvedName = type?.resolvedName
          const ReactComponent = resolvedName ? CraftJsUserComponents[resolvedName] : null
          console.log(`Rendering component: ${resolvedName}`, props);

          let filteredNodes = nodes;
          if (resolvedName !== "AvatarComponent") {
            const avatarComponents = nodes.filter(
              (childNodeId) => craftState[childNodeId].type.resolvedName === "AvatarComponent"
            );
            filteredNodes = nodes.filter(
              (childNodeId) => craftState[childNodeId].type.resolvedName !== "AvatarComponent"
            );
            if (avatarComponents.length > 0) {
              filteredNodes.push(avatarComponents[avatarComponents.length - 1]);
            }
          }
          
          const childNodes = filteredNodes.map((childNodeId: string) => parse(childNodeId, nodeId));
          const linkedNodesElements = filteredNodes.concat(Object.values(linkedNodes)).map((linkedNodeData: any) => {
            const linkedNodeId = linkedNodeData.nodeId || linkedNodeData;
            return parse(linkedNodeId, nodeId);
          });


          const parsedNode = ReactComponent ? (
            <ReactComponent {...props} parentNodeId={parentNodeId} nodeId={nodeId} key={nodeId} scrollY={scrollY}>
              {linkedNodesElements}
            </ReactComponent>
          ) : (
            <div {...props} parentNodeId={parentNodeId} nodeId={nodeId} key={nodeId}>
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
  }, [screen, globalTheme])



  return <Suspense fallback={<h2>Loading...</h2>}>{toRender}</Suspense>
}

export default ResolvedComponentsFromCraftState