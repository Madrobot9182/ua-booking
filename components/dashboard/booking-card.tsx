import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { format } from "date-fns"
import StatusBadge from "./status-badge"

type Booking = {
  id: string
  startTime: Date
  endTime: Date
  status: "PENDING" | "APPROVED" | "REJECTED"
  description: string | null
  createdAt: Date
  room: {
    building: string
    number: string
    capacity: number
  }
}

export default function BookingCard({ booking }: { booking: Booking }) {
  const { room } = booking

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <div className="font-medium">
            {room.building} · Room {room.number}
          </div>
          <p className="text-sm text-muted-foreground">
            Capacity {room.capacity}
          </p>
        </div>

        <StatusBadge status={booking.status} />
      </CardHeader>

      <CardContent className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">
            {format(booking.startTime, "PPP")}
          </p>
          <p className="text-sm font-medium">
            {format(booking.startTime, "p")} –{" "}
            {format(booking.endTime, "p")}
          </p>
        </div>

        {booking.description && (
          <p className="text-sm text-muted-foreground">
            {booking.description}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Requested {format(booking.createdAt, "PPP")}
        </p>
      </CardContent>
    </Card>
  )
}