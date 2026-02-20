import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const bookings = [
  {
    BookingId: "1",
    Room: "ECHA 1-150",
    BookingStatus: "Pending",
    StartDateTime: "2026-03-12T10:00",
    EndDateTime: "2026-03-12T22:00",
  },
  {
    BookingId: "11",
    Room: "ECHA 1-150",
    BookingStatus: "Approved",
    StartDateTime: "2026-03-12T10:00",
    EndDateTime: "2026-03-12T22:00",
  },
  {
    BookingId: "13",
    Room: "ECHA 1-150",
    BookingStatus: "Rejected",
    StartDateTime: "2026-03-12T10:00",
    EndDateTime: "2026-03-12T22:00",
  },
  {
    BookingId: "15",
    Room: "ECHA 1-150",
    BookingStatus: "Paid",
    StartDateTime: "2026-03-12T10:00",
    EndDateTime: "2026-03-12T22:00",
  },
  {
    BookingId: "21",
    Room: "ECHA 1-150",
    BookingStatus: "Paid",
    StartDateTime: "2026-03-12T10:00",
    EndDateTime: "2026-03-12T22:00",
  },
  {
    BookingId: "67",
    Room: "ECHA 1-150",
    BookingStatus: "Paid",
    StartDateTime: "2026-03-12T10:00",
    EndDateTime: "2026-03-12T22:00",
  },
  {
    BookingId: "3",
    Room: "ECHA 1-150",
    BookingStatus: "Paid",
    StartDateTime: "2026-03-12T10:00",
    EndDateTime: "2026-03-12T22:00",
  },
]

export function BookingTable() {
  return (
    <Table>
      <TableCaption>Your Bookings.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Booking ID</TableHead>
          <TableHead className="w-[100px]">Room</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead className="text-right">End Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.slice(0, 5).map((booking) => (
          <TableRow key={booking.BookingId}>
            <TableCell className="font-medium">{booking.BookingId}</TableCell>
            <TableCell className="font-medium">{booking.Room}</TableCell>
            <TableCell>{booking.BookingStatus}</TableCell>
            <TableCell>{booking.StartDateTime}</TableCell>
            <TableCell className="text-right">{booking.EndDateTime}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
