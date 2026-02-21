"use client"

import { Search } from "lucide-react"
import { useState } from "react"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")

  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bookings..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="rounded-xl border bg-input px-4 py-2 text-foreground"
      >
        <option value="all">All</option>
        <option value="upcoming">Upcoming</option>
        <option value="review">Under Review</option>
      </select>
    </div>
  )
}