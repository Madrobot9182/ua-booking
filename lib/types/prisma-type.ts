import { Prisma, Room } from "@/app/generated/prisma/browser";

export type BookingWithRelations = Prisma.BookingRequestGetPayload<{
  include: {
    room: true;
    user: true;
  };
}>;

export type RoomWithResources = Prisma.RoomGetPayload<{
  include: {
    resources: {
      include: {
        resource: true;
      };
    };
  };
}>;