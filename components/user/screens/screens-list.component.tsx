import React from 'react';
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
import { Editor,useEditor } from '@craftjs/core';
import { DragDrop } from './drag-drop-screens.component';
import { Element } from '@craftjs/core';



const ScreensList = () => {
  const screens = useAppSelector(state => state.screen.screens);
  const dispatch = useAppDispatch();
  const selectedScreen = useAppSelector(state => state.screen.screens[state.screen.selectedScreen]);
  const { actions } = useEditor(
    (state, query) => ({
      enabled: state.options.enabled,
    })
  );


  React.useEffect(() => {
    actions.deserialize(selectedScreen || '');
  }, [actions, selectedScreen]);

  return (
    <>
    <Element
        is={"div"}
        padding={5}
        background="#ad2121"
        canvas
        className="min-w-ful min-h-screen max-w-md"
        id="one-input-screens"
      >
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
        <AccordionContent>
          {screens.map((screen, index) => (
            <div key={index}>
              <li onClick={() => dispatch(setSelectedScreen(index))}>Screen {index}</li>

            </div>
          ))}
          <DragDrop />

        </AccordionContent>
      </AccordionItem>
    </Accordion></Element>
    </>
  );
};

export default ScreensList;
