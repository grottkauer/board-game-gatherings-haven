
import { useState, useEffect } from "react";
import { useEvents } from "@/contexts/EventContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, CalendarIcon, X, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const EventFilter = () => {
  const { events, setCityFilter, setDateFilter, cityFilter, dateFilter } = useEvents();
  const [cities, setCities] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(
    dateFilter ? new Date(dateFilter) : undefined
  );

  // Extract unique cities from events
  useEffect(() => {
    const uniqueCities = Array.from(new Set(events.map(event => event.city))).sort();
    setCities(uniqueCities);
  }, [events]);

  const handleCityClick = (city: string) => {
    setCityFilter(cityFilter === city ? null : city);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setDateFilter(newDate?.toISOString() ?? null);
  };

  const clearFilters = () => {
    setCityFilter(null);
    setDateFilter(null);
    setDate(undefined);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="font-medium">Filter Events:</div>
        
        {/* City chips */}
        <div className="flex flex-wrap gap-2">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => handleCityClick(city)}
              className={cn(
                "filter-chip",
                cityFilter === city && "active"
              )}
            >
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {city}
              </div>
            </button>
          ))}
        </div>
        
        {/* Date filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "filter-chip",
                dateFilter && "active",
                "border border-board-purple-light"
              )}
            >
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {dateFilter ? format(new Date(dateFilter), "MMM d, yyyy") : "Select date"}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        {/* Clear filters button - only show if any filter is active */}
        {(cityFilter || dateFilter) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-sm text-muted-foreground"
            onClick={clearFilters}
          >
            <X className="h-3 w-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventFilter;
