"use client";

import BookingCard from "./booking-card";
import { BookingRequest } from "@/app/generated/prisma/browser";

interface PendingBookingsProps {
  bookings: BookingRequest[];
}

export default function PendingBookings({ bookings }: PendingBookingsProps) {
  return (
    <div className="space-y-2">
      {bookings.length === 0 && <p className="text-muted-foreground">No pending bookings</p>}
      {bookings.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </div>
  );
}