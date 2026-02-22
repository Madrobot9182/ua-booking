import { useCalendarContext } from "../calendar-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { ColorPicker } from "@/components/form/color-picker"

export default function CalendarViewEventDialog() {
  const { manageEventDialogOpen, setManageEventDialogOpen, selectedEvent, setSelectedEvent, events, setEvents } =
    useCalendarContext()

  function handleCancelRequest() {
    if (!selectedEvent) return
    setEvents(events.filter((event) => event.id !== selectedEvent.id))
    handleClose()
  }

  function handleClose() {
    setManageEventDialogOpen(false)
    setSelectedEvent(null)
  }

  if (!selectedEvent) return null

  return (
    <Dialog open={manageEventDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input value={selectedEvent.title} readOnly className="bg-gray-100 cursor-not-allowed" />
          </div>

          {/* Start */}
          <div>
            <Label>Start</Label>
            <Input
              value={format(selectedEvent.start, "yyyy-MM-dd HH:mm")}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* End */}
          <div>
            <Label>End</Label>
            <Input
              value={format(selectedEvent.end, "yyyy-MM-dd HH:mm")}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Color */}
          <div>
            <Label>Color</Label>
            <ColorPicker field={{ value: selectedEvent.color, onChange: () => {} }} />
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Cancel Request</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Event Request</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this request? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Event</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelRequest}>Cancel Request</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}