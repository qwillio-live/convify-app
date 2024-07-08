"use client"

import { format, subDays, differenceInCalendarDays, addHours } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"
import { DateRange } from "react-day-picker"
import { enUS, es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
const getInitialDate = () => {
  const storedDate = localStorage.getItem('date');
  if (storedDate) {
    const parsedDate = JSON.parse(storedDate);
    return {
      from: new Date(parsedDate.startDate),
      to: new Date(parsedDate.endDate),
    };
  } else {
    return {
      from: subDays(new Date(), 7),
      to: new Date(),
    };
  }
};

export function DatePickerWithRange({
  className,
  locale = enUS, // Default locale
  setDater,
  setStatus,
  status,
  days,
  setDays
}: React.HTMLAttributes<HTMLDivElement> & { status, days: number, setDays, setStatus, locale?: Locale; setDater: (v: { startDate: Date; endDate: Date }) => void }) {
  const [date, setDate] = React.useState<DateRange | undefined>(getInitialDate)

  React.useEffect(() => {
    const startDate = date?.from || subDays(new Date(), days);
    let endDate = date?.to || new Date();

    const isToday = (new Date().toDateString() === new Date(endDate).toDateString());
    const difference = differenceInCalendarDays(new Date(endDate), new Date(startDate));

    setDater({ startDate, endDate });
    localStorage.setItem('date', JSON.stringify({ startDate, endDate }));

    if (isToday && difference === days) {
    } else {
      setStatus(!status);
    }
  }, [date]);

  React.useEffect(() => {
    setDate({
      from: subDays(new Date(), days),
      to: new Date(),
    })
    // const localdays = JSON.parse(localStorage.getItem('days') || 'null');
    // if (localdays != days) {
    //   setDate({
    //     from: subDays(new Date(), days),
    //     to: new Date(),
    //   })
    // }
  }, [days])

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
            <CalendarIcon className="mr-2 size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale })} -{" "}
                  {format(date.to, "LLL dd, y", { locale })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale })
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
            onSelect={setDate}
            numberOfMonths={2}
            locale={locale}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

