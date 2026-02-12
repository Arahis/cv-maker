"use client";

import { useMemo, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import {
  format,
  parseISO,
  isValid,
  getDate,
  setDate,
  lastDayOfMonth,
} from "date-fns";
import { Button } from "../ui/button";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString(navigator.language, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function DatePickerInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ value, onChange }: ControllerRenderProps<TFieldValues, TName>) {
  const [open, setOpen] = useState(false);

  // RHF ISO to Date
  const selectedFromValue = useMemo(() => {
    if (!value) return undefined;
    const d = parseISO(String(value));
    return isValid(d) ? d : undefined;
  }, [value]);

  const [selected, setSelected] = useState<Date | undefined>(selectedFromValue);
  const [month, setMonth] = useState<Date>(selectedFromValue ?? new Date());

  const selectedDayRef = useRef<number>(
    selectedFromValue ? getDate(selectedFromValue) : getDate(new Date()),
  );

  const handleMonthOrYearChange = (m: Date) => {
    // Keep day if picked by user
    const wantedDay = selectedDayRef.current;

    // Ensure the selected day exists in the target month
    // Prevent invalid dates (e.g. 31st in February)
    const maxDay = getDate(lastDayOfMonth(m));
    const safeDay = Math.min(wantedDay, maxDay);

    const next = setDate(m, safeDay);

    setMonth(next);
    setSelected(next);
    onChange(format(next, "yyyy-MM-dd"));
  };

  const handleResetDate = () => {
    setSelected(undefined);
    setMonth(new Date());
    selectedDayRef.current = getDate(new Date());
    onChange(undefined as any);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          id="date-picker"
          variant="outline"
          aria-label="Select date"
          className="flex items-center gap-2"
        >
          <CalendarIcon className="h-4 w-4 grow-0" />
          <span className="grow">
            {selected ? formatDate(selected) : "Select date"}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto overflow-hidden p-0" align="end">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={selected}
          month={month}
          onMonthChange={(m) => {
            handleMonthOrYearChange(m);
          }}
          onSelect={(d) => {
            setSelected(d);
            if (d) {
              selectedDayRef.current = getDate(d);
              onChange(format(d, "yyyy-MM-dd"));
            } else {
              onChange(undefined as any);
            }
            setOpen(false);
          }}
        />
        <div className="w-full text-right">
          <Button
            type="button"
            id="date-picker-reset"
            variant="ghost"
            aria-label="Reset date"
            onClick={handleResetDate}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
