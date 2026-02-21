import { Badge } from "@/components/ui/badge"

export default function StatusBadge({
  status,
}: {
  status: "PENDING" | "ACCEPTED"
}) {
  if (status === "ACCEPTED") {
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