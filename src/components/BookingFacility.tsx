import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCheckAvailabilityQuery } from "@/redux/api/checkAvailability/checkAvailabilityApi";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { BookKey, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { toast } from "sonner";
import { useCreateBookingMutation } from "@/redux/api/bookingsApi/bookingsApi";
import { Link, useNavigate } from "react-router-dom";

const BookingFacility = ({ facility }) => {
  const { _id} = facility;
  const [createBooking] = useCreateBookingMutation();
  const navigate = useNavigate();

  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
  const { data } = useCheckAvailabilityQuery(formattedDate);
  const availableTimes = data?.data;

  
  // Handle slot selection and split the value into start and end times
  const handleSelect = (value: string) => {
    setSelectedSlot(value);
    const [selectedStartTime, selectedEndTime] = value.split("-");
    setStartTime(selectedStartTime);
    setEndTime(selectedEndTime);
  };


  const handleBooking = async(e) => {
    e.preventDefault();
    
    try {
      // Check if all fields are filled
    if (!date || !startTime || !endTime) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }

    const bookingInfo = {
      facility: _id,
      date: formattedDate,
      startTime: startTime,
      endTime: endTime
    }


    const res = await createBooking(bookingInfo);

    // Add your booking logic here
      // After successful booking
      if (res?.data?.success === true) {
        toast.success("Booking confirmed!");
        navigate("/checkout");
      }
      if (res?.error?.data?.success === false) { 
        toast.error(res?.error?.data?.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    // Reset fields
    setDate(undefined);
    setStartTime("");
    setEndTime("");
    setSelectedSlot("");
  }

  return (
    <div className="lg:max-w-7xl mx-auto bg-purple-100 p-6">
      <div>CheckAvailability</div>

        <form onSubmit={handleBooking}  className="bg-lime-100 flex gap-4">
      
    {/* date picker */}
        <div>
        <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    </div>
    {/* date picker */}


        <div>
        <Select value={selectedSlot} onValueChange={handleSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Time Slot" />
        </SelectTrigger>
        <SelectContent>
              {
            availableTimes?.length <=0 ? <SelectItem disabled value="not available">No slots available</SelectItem> :    
                
            availableTimes?.map(
            (slot: { startTime: string; endTime: string }, index: number) => (
              <SelectItem
                key={index}
                value={`${slot.startTime}-${slot.endTime}`}
              >
                {slot.startTime} - {slot.endTime}
              </SelectItem>
            )
          )}
         
        </SelectContent>
        </Select>
      </div>

        <div>
          <Button>Confirm Booking</Button>
      </div>
        
        </form>
    </div>
  );
};

export default BookingFacility;
