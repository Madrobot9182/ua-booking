"use client"

import { useState } from 'react'
import CalendarDemo from './calendar-demo'
import { BookingRequest } from "@/app/generated/prisma/browser"
import { mapBookingsToEvents } from '@/lib/calendar-utils'

interface AdminCalendarProps {
  bookings: BookingRequest[]
}

export default function AdminCalendar({ bookings }: AdminCalendarProps) {
  const [events, setEvents] = useState(mapBookingsToEvents(bookings))

  return (
    <CalendarDemo
      events={events}
      setEvents={setEvents} // allows dynamic updates if you implement approve/reject highlighting
    />
  )
}