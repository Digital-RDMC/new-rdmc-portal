// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './calendar';
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { type DateRange } from 'react-day-picker';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default calendar view
export const Default: Story = {
  render: () => <Calendar />,
};

// Calendar with pre-selected date
export const WithSelectedDate: Story = {
  render: function SelectedExample() {
    const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 10)); // June 10, 2025
    
    return (
      <div className="space-y-4">
        <Calendar 
          mode="single"
          selected={date}
          onSelect={setDate}
        />
        <div className="text-sm text-center">
          Selected: {date ? date.toDateString() : 'None'}
        </div>
      </div>
    );
  }
};

// Calendar with date range selection
export const DateRangeSelection: Story = {
  render: function RangeExample() {
    // Use the correct DateRange type from react-day-picker
    const [range, setRange] = useState<DateRange>({
      from: new Date(2025, 5, 8), // June 8, 2025 
      to: new Date(2025, 5, 15)    // June 15, 2025
    });
    
    return (
      <div className="space-y-4">
        <Calendar 
          mode="range"
          selected={range}
          onSelect={(selectedRange) => {
            // Handle potential undefined case
            if (selectedRange) {
              setRange(selectedRange);
            }
          }}
        />
        <div className="text-sm text-center">
          Selected range: {range.from ? range.from.toDateString() : 'None'} to {range.to ? range.to.toDateString() : 'None'}
        </div>
      </div>
    );
  }
};

// Calendar with disabled dates
export const WithDisabledDates: Story = {
  render: function DisabledExample() {
    const disabledDays = [
      new Date(2025, 5, 5), // June 5, 2025
      new Date(2025, 5, 12), // June 12, 2025
      new Date(2025, 5, 19), // June 19, 2025
      { from: new Date(2025, 5, 25), to: new Date(2025, 5, 28) } // June 25-28, 2025
    ];
    
    return (
      <div className="space-y-4">
        <Calendar 
          mode="single"
          disabled={disabledDays}
          defaultMonth={new Date(2025, 5)}
        />
        <div className="text-sm text-center text-muted-foreground">
          Some dates are disabled (June 5, 12, 19, 25-28)
        </div>
      </div>
    );
  }
};

// Calendar with footer
export const WithFooter: Story = {
  render: function FooterExample() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    
    return (
      <div className="space-y-4 border rounded-md shadow">
        <Calendar 
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-t-md"
        />
        <div className="border-t px-4 py-3 flex justify-end gap-2">
          <button
            onClick={() => setDate(new Date())}
            className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setDate(undefined)}
            className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    );
  }
};

// Calendar with multiple months
export const MultipleMonths: Story = {
  render: () => (
    <Calendar 
      mode="single"
      numberOfMonths={2}
      className="max-w-[800px]"
    />
  ),
};

// Calendar with custom day render
export const CustomDayRender: Story = {
  render: function CustomDayExample() {
    // Event dates to highlight
    const events = [
      new Date(2025, 5, 4),
      new Date(2025, 5, 9),
      new Date(2025, 5, 15),
      new Date(2025, 5, 22)
    ];
    
    // Function to check if a date has an event
    const hasEvent = (date: Date) => {
      return events.some(eventDate => 
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    };
    
    return (      <div className="space-y-4">        <Calendar 
          mode="single"
          defaultMonth={new Date(2025, 5)}
          modifiers={{
            event: (date) => hasEvent(date)
          }}
          modifiersClassNames={{
            event: "has-event"
          }}          components={{
            Day: ({ day, ...props }) => {
              const isEvent = day && hasEvent(day.date);
              
              return (
                <div 
                  {...props}
                  className={`${props.className} relative`}
                >
                  <span>{day.date.getDate()}</span>
                  {isEvent && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                  )}
                </div>
              )
            }
          }}
        />
        <div className="text-sm text-center text-muted-foreground">
          Days with events (June 4, 9, 15, 22) have a blue dot indicator
        </div>
      </div>
    );
  }
};

// Date Picker with Popover
export const DatePicker: Story = {
  render: function DatePickerExample() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    
    return (
      <div className="flex flex-col space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Date of birth</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? (
                  format(date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-sm text-muted-foreground mt-2">
            Selected date: {date ? format(date, "PPP") : "None"}
          </p>
        </div>
      </div>
    );
  }
};

// Date Range Picker with Popover
export const DateRangePicker: Story = {
  render: function DateRangePickerExample() {
    const [dateRange, setDateRange] = useState<DateRange>({
      from: new Date(2025, 5, 8),  // June 8, 2025
      to: new Date(2025, 5, 15)    // June 15, 2025
    });
    
    return (
      <div className="flex flex-col space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Select date range</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(selectedRange) => {
                  if (selectedRange) {
                    setDateRange(selectedRange);
                  }
                }}
                numberOfMonths={2}
                defaultMonth={dateRange.from}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }
};