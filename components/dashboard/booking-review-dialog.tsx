"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { BookingStatus } from "@/app/generated/prisma/enums";
import { reviewBooking } from "@/lib/server-actions";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import {
  checkBookingConflict,
  deleteBookingConflicts,
} from "@/lib/booking-server-conflict";
import { Separator } from "@/components/ui/separator";

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

  // Check for conflicts whenever dialog opens or booking changes
  useEffect(() => {
    async function verifyConflict() {
      if (!open || !booking) return;
      setIsCheckingConflict(true);
      try {
        const result = await checkBookingConflict(
          booking.roomId,
          booking.startTime,
          booking.endTime,
          booking.id
        );
        setHasConflict(result.hasConflict);
      } catch (error) {
        console.error(error);
      } finally {
        setIsCheckingConflict(false);
      }
    }
    verifyConflict();
  }, [open, booking]);

  async function handleConfirm() {
    if (!decision) return;
    await reviewBooking(booking.id, decision, reason);
    onOpenChange(false);
    await deleteBookingConflicts(
      booking.roomId,
      booking.startTime,
      booking.endTime,
      booking.id
    );
    router.refresh();
  }

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Warning */}
          {hasConflict && !isCheckingConflict && (
            <div className="flex items-start gap-2 p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20">
              <AlertTriangle className="w-5 h-5 mt-0.5" />
              <p>
                <strong>Warning:</strong> This time slot conflicts with other pending booking(s). Approving this booking will remove all conflicting pending bookings.
              </p>
            </div>
          )}
          {hasConflict && isCheckingConflict && (
            <p className="text-sm text-muted-foreground">Checking for conflicts...</p>
          )}

          {/* User Info */}
          <div className="space-y-1 text-sm">
            <h3 className="font-semibold text-base">User</h3>
            <p>Name: {booking.user.name}</p>
            <p>Email: {booking.user.email}</p>
          </div>
          <Separator />

          {/* Room Info */}
          <div className="space-y-1 text-sm">
            <h3 className="font-semibold text-base">Room</h3>
            <p>
              {booking.room.building} Room {booking.room.number}
            </p>
            <p>Capacity: {booking.room.capacity}</p>
            {booking.room.description && <p>{booking.room.description}</p>}
          </div>
          <Separator />

          {/* Time Info */}
          <div className="space-y-1 text-sm">
            <h3 className="font-semibold text-base">Time</h3>
            <p>
              {new Date(booking.startTime).toLocaleString()} →{" "}
              {new Date(booking.endTime).toLocaleString()}
            </p>
          </div>
          <Separator />

          {/* Admin Reason */}
          <div className="space-y-2">
            <h3 className="font-semibold text-base">Reason</h3>
            <Textarea
              placeholder="Provide reasoning for your decision..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <Separator />

          {/* Decision */}
          <div className="flex gap-6 items-center">
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
        </div>

        <DialogFooter className="mt-4">
          <Button className="w-full" disabled={!decision} onClick={handleConfirm}>
            Confirm Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}