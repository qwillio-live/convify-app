import React, { Suspense, useEffect, useState } from "react";
// import lz from "lzutf8";
import {CRAFT_ELEMENTS} from "@/components/user/settings/craft-elements";

import { UserContainer } from "@/components/user/container/user-container.component";
import { UserLogo } from "@/components/user/logo/user-logo.component";
import { IconButton } from "@/components/user/icon-button/user-icon-button.component";
import { UserText } from "@/components/user/text/user-text.component";
import { HeadlineText } from "@/components/user/headline-text/headline-text.component";
import { Button as CustomButton} from "@/components/ui/button";
import jsonData from "./parse.json"
const CraftJsUserComponents = {
   [CRAFT_ELEMENTS.USERCONTAINER]: "div",
   [CRAFT_ELEMENTS.USERLOGO]: UserLogo,
   [CRAFT_ELEMENTS.DIV]: "div",
    [CRAFT_ELEMENTS.ICONBUTTON]: "CustomButton",
    [CRAFT_ELEMENTS.USERTEXT]: "UserText",
    [CRAFT_ELEMENTS.HEADLINETEXT]: "HeadlineText",
};

interface Props {
   compressedCraftState: string;
}



// const Loader =() => {
//   return(
//     <Button disabled>
//       <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
//       Loading...
//     </Button>
//   )
// }

// const ResolvedComponentsFromCraftState = ({ compressedCraftState }: Props): React.ReactElement | null => {
  const ResolvedComponentsFromCraftState = (): React.ReactElement | null => {
   const [toRender, setToRender] = useState<React.ReactElement | null>(null);

   useEffect(() => {
    console.log("USE EFFECT WAS CALLED")
      // const craftState = JSON.parse(lz.decompress(lz.decodeBase64(compressedCraftState)));
      const craftState = jsonData;
      console.log("CRAFT STATE: ", craftState)

      const resolvedComponents: React.ReactElement = (() => {
         const parse = (nodeId: string, parentNodeId?: string): React.ReactElement => {
            if (nodeId === null || nodeId === "") return <></>;

            const childNodeNames: string[] = craftState[nodeId]?.nodes || [];
            const ReactComponent = (CraftJsUserComponents as any)[craftState[nodeId].type.resolvedName];
            const extendedProps = {
               ...craftState[nodeId].props,
               parentNodeId,
               nodeId,
               key: nodeId,
            };

            if (childNodeNames.length === 0) return <ReactComponent {...extendedProps} />;

            const childNodes = childNodeNames.map((childNodeId) => {
               return parse(childNodeId, nodeId);
            });

            return <ReactComponent {...extendedProps}>{childNodes}</ReactComponent>;
         };

         return parse("ROOT");
      })();

      setToRender(resolvedComponents);
   }, []);

   return <Suspense fallback={<h2>Loading...</h2>}>{toRender}</Suspense>;
};

export default ResolvedComponentsFromCraftState;
