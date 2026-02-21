"use client"

import { useState } from 'react'
import { Mode } from './calendar/calendar-types'
import { BookingRequest } from "@/app/generated/prisma/browser"
import { mapBookingsToEvents } from '@/lib/calendar-utils'
import Calendar from './calendar/calendar'

interface AdminCalendarProps {
  bookings: BookingRequest[]
}

export default function AdminCalendar({ bookings }: AdminCalendarProps) {
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