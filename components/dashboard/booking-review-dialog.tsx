"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { BookingStatus } from "@/app/generated/prisma/enums";
import { reviewBooking } from "@/lib/server-actions";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { checkBookingConflict, deleteBookingConflicts } from "@/lib/booking-server-conflict";
interface Props {
  booking: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookingReviewDialog({
  booking,
  open,
  onOpenChange,
}: Props) {
  const [decision, setDecision] = useState<BookingStatus | null>(null);
  const [reason, setReason] = useState("");
  const [hasConflict, setHasConflict] = useState(false);
  const [isCheckingConflict, setIsCheckingConflict] = useState(false);
  const router = useRouter();

  // Check for conflicts whenever the dialog opens or the booking changes
  useEffect(() => {
    async function verifyConflict() {
      if (!open || !booking) return;
      console.log("CONFLICT!")
      setIsCheckingConflict(true);
      try {
        const result = await checkBookingConflict(
          booking.roomId,
          booking.startTime,
          booking.endTime,
          booking.id,
        );
        setHasConflict(result.hasConflict);
      } catch (error) {
        console.error(error);
      } finally {
        setIsCheckingConflict(false);
      }
    }

    verifyConflict()
  }, [open, booking])
  async function handleConfirm() {
    if (!decision) return;
    await reviewBooking(booking.id, decision, reason);
    onOpenChange(false);
    await deleteBookingConflicts(booking.roomId, booking.startTime, booking.endTime, booking.id,)
    router.refresh();
  }

  if (!booking) return null;
  const showWarning = booking;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Review Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Label */}
          {hasConflict && !isCheckingConflict && (
            <div className="flex items-center gap-2 p-3 text-sm rounded-md bg-destructive/15 text-destructive border border-destructive/20">
              <AlertTriangle className="w-15 h-15" />
              <p>
                <strong>Warning:</strong> This time slot conflicts with other pending booking(s). Approving this booking will remove all conflicting pending bookings.
              </p>
            </div>
          )}
          {/* User Info */}
          <div>
            <h3 className="font-semibold">User</h3>
            <p>Name: {booking.user.name}</p>
            <p>Email: {booking.user.email}</p>
          </div>

          {/* Room Info */}
          <div>
            <h3 className="font-semibold">Room</h3>
            <p>
              {booking.room.building} Room {booking.room.number}
            </p>
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
  );
}
