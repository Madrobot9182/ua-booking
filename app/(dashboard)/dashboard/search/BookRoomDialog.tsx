"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, ArrowRight } from "lucide-react";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { createBooking } from "./actions"; // Import your server action

// Accept the room data passed down from the server component
export default function BookRoomDialog({ room, userId }: { room: any, userId: any }) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [endTime, setEndTime] = useState<string>("10:00");
  const [description, setDescription] = useState<string>("")
  const handleConfirm = async () => {
    alert(room.id)
    alert(userId)
    const bookingData = {

      roomId: (room.id),
      userId: (userId),
      startTime: `${startDate ? format(startDate, "yyyy-MM-dd") : ""}T${startTime}:00-07:00`,
      endTime: `${endDate ? format(endDate, "yyyy-MM-dd") : ""}T${endTime}:00-07:00`,
      description: description
    };
     
      
    
    const response = await createBooking(bookingData);
    if (response.success) {
    alert(`Successfully booked ${room.building} ${room.number}!`);
    }
    
    alert(`Successfully booked ${room.building} ${room.number}!`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">Book Room</Button>
      </DialogTrigger>
      
      <DialogContent className="md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-1xl">
            Book {room.building} {room.number}
          </DialogTitle>
          <DialogDescription>
            Select your check-in and check-out times for this reservation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Start Date & Time */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold flex items-center gap-2 mb-3">
                  <CalendarIcon className="h-4 w-4 text-primary" /> Start Date
                </Label>
                <div className="border rounded-md p-3 bg-card inline-block w-full flex justify-center">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} className="rounded-md" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" /> Start Time
                </Label>
                <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full" />
              </div>
            </div>

            {/* End Date & Time */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold flex items-center gap-2 mb-3">
                  <CalendarIcon className="h-4 w-4 text-primary" /> End Date
                </Label>
                <div className="border rounded-md p-3 bg-card inline-block w-full flex justify-center">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} className="rounded-md" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" /> End Time
                </Label>
                <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full" />
              </div>
            </div>

          </div>
            {/* Description / Notes Box */}
          <div className="space-y-2 pt-2 border-t">
            <Label htmlFor="description" className="text-base font-semibold flex items-center gap-2">
               Booking Notes / Description
            </Label>
            <Textarea 
              id="description" 
              placeholder="Add any special requests, purpose of booking, or additional notes..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] w-full resize-y"
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between border-t pt-4 gap-4 mt-4">
            <div className="text-sm text-muted-foreground w-full">
              {startDate && endDate ? (
                <p>
                  Booking from <strong className="text-foreground">{format(startDate, "MMM do")} at {startTime}</strong> to <strong className="text-foreground">{format(endDate, "MMM do")} at {endTime}</strong>
                </p>
              ) : (
                <p>Please select your dates.</p>
              )}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <DialogClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
              </DialogClose>
              <Button onClick={handleConfirm} className="w-full sm:w-auto gap-2">
                Confirm Booking <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}