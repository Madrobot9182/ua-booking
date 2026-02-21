import { BookingRequest } from "@/app/generated/prisma/browser"
import { CalendarEvent } from "@/components/calendar/calendar-types"

export function mapBookingsToEvents(bookings: BookingRequest[]): CalendarEvent[] {
  return bookings.map((b) => ({
    id: b.id,
    title: `${b.room.building} ${b.room.number} (${b.status})`,
    start: new Date(b.startTime),
    end: new Date(b.endTime),
    color: b.status === 'PENDING' ? 'orange' : b.status === 'APPROVED' ? 'green' : 'gray',
    extendedProps: {
      user: b.user.name,
      status: b.status,
    },
  }))
}