"use client"
import React, { use } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScreenFooter } from '@/components/user/screens/screen-footer.component';
import { ScreenHeader } from '@/components/user/screens/screen-header.component';
import { Separator } from '@/components/ui/separator';
import { ButtonChoiceScreen } from './screen-button-choice.component';
import { useAppSelector, useAppDispatch } from '@/lib/state/flows-state/hooks';
import { reorderScreens, setSelectedScreen } from '@/lib/state/flows-state/features/placeholderScreensSlice';
import { Editor, useEditor,Frame,Element } from '@/lib/craftjs';
import { DragDrop } from './drag-drop-screens.component';
import { Card} from '@/components/ui/card';
import emptyScreenData from '@/components/user/screens/empty-screen.json'
import { ScreenOneChoice } from './screen-one-choice.component';
import { ScreenOneInput } from './screen-one-input.component';
import { cn } from '@/lib/utils';



const ScreensList = () => {
  const screens = useAppSelector(state => state.screen.screens);
  const dispatch = useAppDispatch();
  const selectedScreen = useAppSelector(state => state.screen.screens[state.screen.selectedScreen]);
  const selectedScreenIndex = useAppSelector(state => state.screen.selectedScreen);
  const { actions } = useEditor(
    (state, query) => ({
      enabled: state.options.enabled,
    })
  );


  React.useEffect(() => {
    actions.deserialize(selectedScreen);
  }, [actions, selectedScreen]);

  return (

    <Accordion type="single" collapsible className="w-full overflow-x-hidden" defaultValue="item-2">
      <AccordionItem value="item-1">
        <AccordionTrigger className="uppercase hover:no-underline">Header & Footer</AccordionTrigger>
        <AccordionContent className="w-full">
          <p className="text-sm text-muted-foreground">
            Header
          </p>
          <ScreenHeader scale={0.6} />
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            Footer
          </p>
          <ScreenFooter scale={0.6} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="uppercase hover:no-underline">Screens</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-2'>

          {screens.map((screen: any, index) => (
            <div key={index}>
              <Card
                className={cn(
                  "flex h-28 w-full flex-col items-center justify-center border p-4 hover:cursor-pointer",
                  { 'border-blue-500': selectedScreenIndex === index, 'border-transparent': selectedScreenIndex !== index }
                )}
                onClick={() => dispatch(setSelectedScreen(index))}
              >
                <div className='text-sm text-muted-foreground'>{screen[screen?.ROOT?.nodes[0]]?.displayName ??  "New Screen"}</div>
              </Card>
            </div>
          ))}

        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

function DisplayEditor(){
  const screens = useAppSelector(state => state.screen.screens);


  return(
    <>
  <div>
          {screens.map((item: any, index: any) => {
            console.log(item.libraryContent);
            const htmlContent = item.libraryContent.outerHTML;
            return (
              <div className="my-2 border-solid border-black" key={index}>
                <div>
                  <p>{item.libraryName}</p>
                </div>
                <ul
                  style={{
                    transform: "scale(0.178922)",
                    maxWidth: "150px",
                    height: "100px"
                  }}
                >
                  <Frame data={htmlContent} />
                  {/* {item.libraryContent} */}
                </ul>
              </div>
            );
          })}
        </div>
    </>
  )
}

export default ScreensList;
