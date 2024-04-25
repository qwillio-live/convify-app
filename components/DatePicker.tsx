// "use client"

// import * as React from "react"
// import { addDays,format } from "date-fns"
// import { DateRange } from "react-day-picker"
// import { Calendar as CalendarIcon } from "lucide-react"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"



// interface DatePickerProps {
//   date: Date
//   setDate: (date: Date) => void
//   className?: string
// }

// export function DatePicker({ date, setDate }: DatePickerProps) {
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant={"outline"}
//           className={cn(
//             "w-[162px] items-center justify-start text-left font-normal",
//             !date && "text-muted-foreground"
//           )}
//         >
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           {date ? (
//             <span className="flex items-center">{format(date, "PPP")}</span>
//           ) : (
//             <span>Pick a date</span>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0">
//         <Calendar
//           mode="single"
//           selected={date}
//           onSelect={setDate}
//           initialFocus
//         />
//       </PopoverContent>
//     </Popover>
//   )
// }



"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface dateDetails {
  from: Date | undefined,
  to: Date | undefined,
}

interface DatePickerProps {
  date: dateDetails;
  setDate: (date: dateDetails) => void;
  className?: string;
}


export function DatePicker({ date, setDate, className }: DatePickerProps) {

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date?.from, "LLL dd, y")} -{" "}
                  {format(date?.to, "LLL dd, y")}
                </>
              ) : (
                format(date?.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              (range.from && range.to) && setDate({ from: range.from, to: range.to });
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
