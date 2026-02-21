"use client"

import * as React from "react"
import { addHours, isBefore } from "date-fns"
import { DateTimePicker } from "./date-time-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles, Loader2 } from "lucide-react"

export default function BookingSearchBar() {
  const [start, setStart] = React.useState<Date | undefined>()
  const [end, setEnd] = React.useState<Date | undefined>()
  const [building, setBuilding] = React.useState("")
  const [capacity, setCapacity] = React.useState("")
  const [aiQuery, setAiQuery] = React.useState("")
  const [aiExpanded, setAiExpanded] = React.useState(false)
  const [aiLoading, setAiLoading] = React.useState(false)

  // Auto-set end = +1 hour
  React.useEffect(() => {
    if (start) {
      const defaultEnd = addHours(start, 1)
      if (!end || isBefore(end, start)) {
        setEnd(defaultEnd)
      }
    }
  }, [start])

  // ESC collapses AI mode
  React.useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAiExpanded(false)
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  async function handleAiSubmit() {
    if (!aiQuery) return
    setAiLoading(true)

    // Placeholder for AI processing
    await new Promise((res) => setTimeout(res, 1500))

    setAiLoading(false)
  }

  const suggestions = [
    "Room for 20 students tomorrow morning",
    "Large lecture hall next Friday 2pm",
    "Quiet study room for 4 this afternoon",
  ]

  return (
    <div className="flex flex-col gap-2">

      {/* Header badge when AI active */}
      {aiExpanded && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Mode Active
          </Badge>
          <span className="text-xs text-muted-foreground">
            Press Esc to return to manual filters
          </span>
        </div>
      )}

      <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/40">

        {/* AI Search */}
        <div
          className={`
            relative transition-[width,flex,opacity] duration-300
            ${aiExpanded ? "flex-1" : "w-[260px]"}
          `}
        >
          <Sparkles className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Describe the room you need..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onFocus={() => setAiExpanded(true)}
            className="pl-9 pr-4 h-10"
          />

          {/* Submit Button Inside Input */}
          <div className={`absolute right-1 top-1 ${aiExpanded ? "visible" : "hidden w-0"}`}>
            <Button
              size="sm"
              onClick={handleAiSubmit}
              disabled={aiLoading || !aiQuery}
            >
              {aiLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Go"
              )}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div
          className={`
            flex items-center gap-4 overflow-hidden
            transition-[width,flex,opacity] duration-300
            ${aiExpanded ? "opacity-0 w-0" : "opacity-100"}
          `}
        >
          <Select onValueChange={setBuilding}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Building" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Main</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="library">Library</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setCapacity}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5+</SelectItem>
              <SelectItem value="10">10+</SelectItem>
              <SelectItem value="20">20+</SelectItem>
              <SelectItem value="50">50+</SelectItem>
            </SelectContent>
          </Select>

          <DateTimePicker
            value={start}
            onChange={setStart}
            placeholder="Start"
          />

          <DateTimePicker
            value={end}
            onChange={setEnd}
            placeholder="End"
            minDate={start}
          />

          <Button>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {/* AI Suggestions */}
      {aiExpanded && !aiLoading && (
        <div className="flex flex-wrap gap-2 pl-2">
          {suggestions.map((s) => (
            <Button
              key={s}
              variant="outline"
              size="sm"
              onClick={() => setAiQuery(s)}
              className="text-xs"
            >
              {s}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}