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
import { useEditor } from '@/lib/craftjs';
import { DragDrop } from './drag-drop-screens.component';
import { Card } from '@/components/ui/card';



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

          {screens.map((screen, index) => (
            <div key={index}>
              <Card className='flex h-28 w-full flex-col items-center justify-center p-4 hover:cursor-pointer' onClick={() => dispatch(setSelectedScreen(index))}><span>Screen {index+1}</span></Card>

            </div>
          ))}
          {/* <DragDrop /> */}

        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ScreensList;
