import BookingCard from "./booking-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { BookingStatus } from "@/app/generated/prisma/enums"

type Booking = {
  id: string
  startTime: Date
  endTime: Date
  status: BookingStatus
  description: string | null
  createdAt: Date
  room: {
    building: string
    number: string
    capacity: number
  }
}

export default function BookingList({ bookings }: { bookings: Booking[] }) {
  const upcoming = bookings.filter(b => b.status === "APPROVED")
  const pending = bookings.filter(b => b.status === "PENDING")

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-8">
        <Section title="Upcoming" bookings={upcoming} />
        <Separator />
        <Section title="Under Review" bookings={pending} />
      </div>
    </ScrollArea>
  )
}

function Section({
  title,
  bookings,
}: {
  title: string
  bookings: Booking[]
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">
        {title}
      </h2>

      {bookings.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No bookings found.
        </p>
      )}

      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  )
}