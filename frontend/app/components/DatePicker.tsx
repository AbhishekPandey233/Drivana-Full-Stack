"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string; // "yyyy-mm-dd", same format as a native <input type="date">
  onChange: (value: string) => void;
  min?: string; // "yyyy-mm-dd"
  placeholder?: string;
}

// Parse/format using local date parts (avoids the UTC-midnight off-by-one
// day shift that `new Date("yyyy-mm-dd")` causes in negative UTC offsets).
function parseDateStr(value: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function DatePicker({ value, onChange, min, placeholder = "Select date" }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => parseDateStr(value), [value]);
  const minDate = useMemo(() => parseDateStr(min ?? ""), [min]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 bg-[#FAFAFC] border rounded-xl px-4 py-3 text-xs font-semibold text-left transition-smooth-fast outline-none ${
          open ? "border-[#6366F1] ring-2 ring-[#6366F1]/30" : "border-slate-200 hover:border-slate-300"
        } ${selected ? "text-slate-800" : "text-slate-400"}`}
      >
        {selected ? formatDisplay(selected) : placeholder}
        <Calendar className="w-4 h-4 text-[#6366F1] shrink-0" strokeWidth={2.25} />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 animate-scale-in origin-top">
          <DayPicker
            mode="single"
            selected={selected}
            defaultMonth={selected ?? minDate}
            disabled={minDate ? { before: minDate } : undefined}
            onSelect={(date) => {
              if (date) {
                onChange(formatDateStr(date));
                setOpen(false);
              }
            }}
            showOutsideDays
            classNames={{
              months: "flex flex-col",
              month: "space-y-3 relative",
              month_caption: "flex items-center justify-center px-9 h-8",
              caption_label: "text-sm font-bold text-slate-800",
              nav: "flex items-center justify-between absolute inset-x-1 top-0 h-8",
              button_previous:
                "w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-indigo-50 hover:text-[#6366F1] transition-smooth-fast disabled:opacity-30",
              button_next:
                "w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-indigo-50 hover:text-[#6366F1] transition-smooth-fast disabled:opacity-30",
              month_grid: "w-full border-collapse",
              weekdays: "flex",
              weekday: "w-9 h-8 flex items-center justify-center text-[10px] font-bold uppercase text-slate-400",
              week: "flex",
              day: "w-9 h-9 p-0 text-center",
              day_button:
                "w-9 h-9 rounded-full text-xs font-semibold text-slate-700 flex items-center justify-center transition-smooth-fast hover:bg-indigo-50 hover:text-[#6366F1]",
              today: "[&>button]:ring-1 [&>button]:ring-[#6366F1]/50 [&>button]:font-black",
              selected: "[&>button]:bg-[#6366F1] [&>button]:text-white [&>button]:shadow-md [&>button]:hover:bg-indigo-600 [&>button]:hover:text-white",
              outside: "[&>button]:text-slate-300",
              disabled: "[&>button]:text-slate-200 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent",
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? (
                  <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                ),
            }}
          />

          <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 px-1">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-smooth-fast"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                if (!minDate || today >= minDate) {
                  onChange(formatDateStr(today));
                  setOpen(false);
                }
              }}
              className="text-xs font-bold text-[#6366F1] hover:text-indigo-700 transition-smooth-fast"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
