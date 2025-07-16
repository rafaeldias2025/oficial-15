import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string;
  value?: DateRange | null;
  onChange?: (range: DateRange | null) => void;
}

export function DatePickerWithRange({
  className,
  value,
  onChange
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    value ? { from: value.from, to: value.to } : {
      from: new Date(),
      to: addDays(new Date(), 20),
    }
  )

  React.useEffect(() => {
    if (onChange && date) {
      onChange({ from: date.from!, to: date.to! });
    }
  }, [date, onChange]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Selecionar período</span>
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
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}