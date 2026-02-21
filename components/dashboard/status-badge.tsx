import { Badge } from "@/components/ui/badge"

export default function StatusBadge({
  status,
}: {
  status: "PENDING" | "APPROVED" | "REJECTED"
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