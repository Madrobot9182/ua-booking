import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const result = await resend.emails.send({
      from: "no-reply@ua-booking.vercel.app",
      to,
      subject,
      html,
    });
    return result;
  } catch (error) {
    console.error("Failed to send email:", error);
  }
} 