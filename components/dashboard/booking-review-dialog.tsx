"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { BookingStatus } from "@/app/generated/prisma/enums";
import { reviewBooking } from "@/lib/server-actions";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

interface Props {
  booking: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookingReviewDialog({ booking, open, onOpenChange }: Props) {
  const [decision, setDecision] = useState<BookingStatus | null>(null);
  const [reason, setReason] = useState("");
  const router = useRouter();

  async function handleConfirm() {
    if (!decision) return;
    await reviewBooking(booking.id, decision, reason);
    onOpenChange(false);
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
            <p>{booking.room.building} Room {booking.room.number}</p>
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
          <Button
            className="w-full"
            disabled={!decision}
            onClick={handleConfirm}
          >
            Confirm Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}