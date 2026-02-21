"use server";

import { prisma } from "@/lib/prisma";
import { sendBookingEmail } from "@/lib/mailer";

/**
 * Confirm a booking request has been sent and notify the user
 */
export async function confirmBooking(bookingId: string) {
  const booking = await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: { status: "PENDING" },
    include: { user: true, room: true },
  });

  // Send confirmation email
  await sendBookingEmail({
    to: booking.user.email,
    subject: "Your Booking Request Has Been Submitted!",
    html: `
      <h1>Booking Request Confirmation</h1>
      <p>This is a confirmation that your booking request for <strong>${booking.room.building} ${booking.room.number}</strong> from <strong>${booking.startTime.toLocaleString()}</strong> to <strong>${booking.endTime.toLocaleString()}</strong> has been received. Please allow a few days for an admin to review your request</p>
      <p>You will receive another email if your request is approved or denied. Please do not reply to this email. Thank you<p>
    `,
  });

  return booking;
}

/**
 * Approve a booking and send confirmation email to the user
 */
export async function approveBooking(bookingId: string) {
  const booking = await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: { status: "APPROVED" },
    include: { user: true, room: true },
  });

  // Send confirmation email
  await sendBookingEmail({
    to: booking.user.email,
    subject: "Booking Approved!",
    html: `
      <h1>Booking Approved</h1>
      <p>Your booking for <strong>${booking.room.building} ${booking.room.number}</strong> from <strong>${booking.startTime.toLocaleString()}</strong> to <strong>${booking.endTime.toLocaleString()}</strong> has been approved. Please see your dashboard for more information</p>
    `,
  });

  return booking;
}

/**
 * Reject a booking and notify the user
 */
export async function rejectBooking(bookingId: string) {
  const booking = await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: { status: "REJECTED" },
    include: { user: true, room: true },
  });

  await sendBookingEmail({
    to: booking.user.email,
    subject: "Booking Rejected",
    html: `
      <h1>Booking Rejected</h1>
      <p>Unfortunately, your booking request for <strong>${booking.room.building} ${booking.room.number}</strong> from <strong>${booking.startTime.toLocaleString()}</strong> to <strong>${booking.endTime.toLocaleString()}</strong> has been rejected. Please see your dashboard for more information</p>
    `,
  });

  return booking;
}