"use client";

import BookingCard from "./booking-card";
import { BookingRequest } from "@/app/generated/prisma/browser";
import { useState } from "react"
import BookingReviewDialog from "./booking-review-dialog";

export default function PendingBookings({ bookings }: any) {
  const [selected, setSelected] = useState<any>(null)

  return (
    <>
      <div className="space-y-3">
        {bookings.map((b: any) => (
          <div
            key={b.id}
            onClick={() => setSelected(b)}
            className="cursor-pointer border border-border rounded-lg p-4 bg-card hover:shadow-md transition"
          >
            <p className="font-semibold">
              {b.room.building} {b.room.number}
            </p>
            <p suppressHydrationWarning>
              {new Date(b.startTime).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <BookingReviewDialog
        booking={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  )
}