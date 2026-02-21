"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache"
import { approveBooking, rejectBooking } from "./mailer-server-actions";
import { BookingStatus } from "@/app/generated/prisma/enums";

export async function reviewBooking(
  bookingId: string,
  decision: BookingStatus,
  reason: string
) {
  const booking = await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: {
      status: decision,
      description: reason, // optional admin reasoning field
    },
    include: {
      room: true,
      user: true,
    },
  })
  
  {decision === "APPROVED"? await approveBooking(bookingId) : await rejectBooking(bookingId)}

  revalidatePath("/admin")
}