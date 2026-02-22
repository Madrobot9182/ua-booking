"use client"

import { useState } from 'react'
import { Mode } from './calendar/calendar-types'
import { BookingWithRelations } from "@/lib/types/prisma-type"
import { mapBookingsToEvents } from '@/lib/calendar-utils'
import Calendar from './calendar/calendar'

interface AdminCalendarProps {
  bookings: BookingWithRelations[]
}

export default function AdminCalendar({ bookings }: AdminCalendarProps) {
  // const [events, setEvents] = useState<CalendarEvent[]>(generateMockEvents())
  const [events, setEvents] = useState(mapBookingsToEvents(bookings))
  const [mode, setMode] = useState<Mode>('week')
  const [date, setDate] = useState<Date>(new Date())

  return (
    <Calendar
        events={events}
        setEvents={setEvents}
        mode={mode}
        setMode={setMode}
        date={date}
        setDate={setDate}
    />
  )
}