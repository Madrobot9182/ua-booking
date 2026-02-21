import { Badge } from "@/components/ui/badge"
import { BookingStatus } from "@/app/generated/prisma/enums"

export default function StatusBadge({
  status,
}: {
  status: BookingStatus
}) {
  if (status === "APPROVED") {
    return (
      <Badge variant="default">
        Accepted
      </Badge>
    )
  }

  return (
    <Badge variant="secondary">
      Pending
    </Badge>
  )
}