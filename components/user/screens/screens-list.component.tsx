import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScreenFooter } from '@/components/user/screens/screen-footer.component'
import { ScreenHeader } from '@/components/user/screens/screen-header.component'
import { Separator } from '@/components/ui/separator'
import { ButtonChoiceScreen } from './screen-button-choice.component'


const ScreensList = () => {
  return (
    <Accordion type="single" collapsible className="w-full overflow-x-hidden" defaultValue='item-2'>
      <AccordionItem value="item-1">
        <AccordionTrigger className='uppercase hover:no-underline'>Header & Footer</AccordionTrigger>
        <AccordionContent className='w-full'>
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
        <AccordionTrigger className='uppercase hover:no-underline'>Screens</AccordionTrigger>
        <AccordionContent>
          {/* <ButtonChoiceScreen /> */}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ScreensList
