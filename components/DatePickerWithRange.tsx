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
import { useTranslations } from "next-intl"

const setItems = (key: string, value: any) => {
  const storedFlowData: Record<string, any> = JSON.parse(localStorage.getItem('flowData') ?? "null");
  if (storedFlowData) {
    const updatedFlowData = {
      ...storedFlowData,
      [key]: value,
    };
    // Store the updated flowData object back in localStorage
    localStorage.setItem('flowData', JSON.stringify(updatedFlowData));
  }
}

const getItems = (key: string) => {
  const storedFlowData = JSON.parse(localStorage.getItem('flowData') ?? "null");
  if (storedFlowData) {
    return storedFlowData[key];
  }
}
const getInitialDate = () => {
  const storedDate = getItems('date');
  if (storedDate) {
    return {
      from: new Date(storedDate.startDate),
      to: new Date(storedDate.endDate),
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
  firstRender,
  setDays
}: React.HTMLAttributes<HTMLDivElement> & { firstRender, status, days: number, setDays, setStatus, locale?: Locale; setDater: (v: { startDate: Date; endDate: Date }) => void }) {
  const [date, setDate] = React.useState<DateRange | undefined>(getInitialDate)
  const t = useTranslations("CreateFlow.ResultsPage");

  React.useEffect(() => {
    if (date?.from && date?.to) {
      const startDate = date?.from || subDays(new Date(), days);
      let endDate = date?.to || new Date();

      const isToday = (new Date().toDateString() === new Date(endDate).toDateString());
      const difference = differenceInCalendarDays(new Date(endDate), new Date(startDate));

      setDater({ startDate, endDate });
      setItems('date', { startDate, endDate });

      if (isToday && difference === days) {
      }
      else {
        setStatus(!status);
      }
    }
  }, [date]);

  React.useEffect(() => {
    const localdays = getItems('days');
    if (localdays !== days) {
      setItems('days', days);
      setDate({
        from: subDays(new Date(), days),
        to: new Date(),
      })
    }
  }, [days])

  React.useEffect(() => {
    if (firstRender) {
      setDate({
        from: subDays(new Date(), 7),
        to: new Date(),
      })
    }
  }, [firstRender])
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full md:w-fit text-base justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {/* {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale })} -{" "}
                  {format(date.to, "LLL dd, y", { locale })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale })
              )
            ) : (
              <span>{t("Pick a date")}</span>
            )} */}
            {date?.from && date?.to ? (
              <>
                {format(date.from, "LLL dd, y", { locale })} - {format(date.to, "LLL dd, y", { locale })}
              </>
            ) : (
              <span>{t("Pick a date")}</span>
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

