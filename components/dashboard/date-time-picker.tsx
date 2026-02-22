"use client"

import { format, isBefore, startOfDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { CalendarIcon, Clock2Icon } from "lucide-react"

interface DateTimePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  minDate?: Date
}

export function DateTimePicker({
  value,
  onChange,
  placeholder,
  minDate,
}: DateTimePickerProps) {

  function handleTimeChange(time: string) {
    if (!value) return
    const [hours, minutes] = time.split(":").map(Number)
    const updated = new Date(value)
    updated.setHours(hours)
    updated.setMinutes(minutes)
    onChange(updated)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[100px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "MMM d, HH:mm") : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4 space-y-4">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) =>
            isBefore(date, startOfDay(minDate ?? new Date()))
          }
          autoFocus
        />

        <InputGroup>
          <InputGroupInput
            type="time"
            step="60"
            value={value ? format(value, "HH:mm") : ""}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
          />
          <InputGroupAddon>
            <Clock2Icon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </PopoverContent>
    </Popover>
  )
}