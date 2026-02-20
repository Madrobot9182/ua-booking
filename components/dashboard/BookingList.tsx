// components/dashboard/BookingList.tsx

type Booking = {
  id: string
  title: string
  date: string
  status: "upcoming" | "review"
}

function BookingCard({ title, date }: any) {
  return (
    <div className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-muted-foreground">{date}</div>
    </div>
  )
}

function Section({ title, items }: any) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No bookings
          </div>
        )}

        {items.map((item: any) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-muted-foreground">
              {item.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}