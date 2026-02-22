"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { BookingStatus } from "@/app/generated/prisma/enums"
import { reviewBooking } from "@/lib/server-actions"
import { useRouter } from 'next/navigation'
interface Props {
  booking: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BookingReviewDialog({
  booking,
  open,
  onOpenChange,
}: Props) {
  const [decision, setDecision] = useState<BookingStatus | null>(null)
  const [reason, setReason] = useState("")
  const router = useRouter()
  async function handleConfirm() {
    if (!decision) return
    await reviewBooking(booking.id, decision, reason)
    onOpenChange(false)
    router.refresh()
  }

  if (!booking) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Review Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* User Info */}
          <div>
            <h3 className="font-semibold">User</h3>
            <p>Name: {booking.user.name}</p>
            <p>Email: {booking.user.email}</p>
          </div>

          {/* Room Info */}
          <div>
            <h3 className="font-semibold">Room</h3>
            <p>{booking.room.building} Room {booking.room.number}</p>
            <p>Capacity: {booking.room.capacity}</p>
            <p>{booking.room.description}</p>
          </div>

          {/* Time Info */}
          <div>
            <h3 className="font-semibold">Time</h3>
            <p>
              {new Date(booking.startTime).toLocaleString()} →{" "}
              {new Date(booking.endTime).toLocaleString()}
            </p>
          </div>

          {/* Admin Reason */}
          <div>
            <h3 className="font-semibold">Reason</h3>
            <Textarea
              placeholder="Provide reasoning for your decision..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Decision */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={decision === "APPROVED"}
                onCheckedChange={() => setDecision("APPROVED")}
              />
              <span>Approve</span>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={decision === "REJECTED"}
                onCheckedChange={() => setDecision("REJECTED")}
              />
              <span>Deny</span>
            </div>
          </div>

          {/* Confirm */}
          <Button
            className="w-full"
            disabled={!decision}
            onClick={handleConfirm}
          >
            Confirm Decision
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}