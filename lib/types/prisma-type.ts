import { Prisma } from "@/app/generated/prisma/browser";

export type BookingWithRelations = Prisma.BookingRequestGetPayload<{
  include: {
    room: true;
    user: true;
  };
}>;
