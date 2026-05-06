import { useEffect, useRef, useState } from "react";
import { Calendar, Search, Download, Plus } from "lucide-react";
import { FilterDropdown } from "./FilterDropdown";
import { Calendar as DayCalendar } from "./calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

const periodOptions = ["All time", "Today", "Last 7 days", "Last 30 days", "This month", "Custom range"];

interface FilterBarProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchableFields?: string[];
  showPeriod?: boolean;
  showCreate?: boolean;
  createLabel?: string;
  onSearch?: (v: string) => void;
  onPeriodChange?: (v: string) => void;
  onCreate?: () => void;
  showExport?: boolean;
  onExport?: () => void;
  extraFilters?: React.ReactNode;
}

function DateRangePopover({
  onApply,
  onCancel,
  initialRange,
}: {
  onApply: (range: DateRange) => void;
  onCancel: () => void;
  initialRange?: DateRange;
}) {
  const [range, setRange] = useState<DateRange | undefined>(initialRange);

  return (
    <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
      <DayCalendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={1}
        disabled={{ after: new Date() }}
        classNames={{
          months: "flex gap-4 p-1",
          month: "flex flex-col gap-2",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-xs font-semibold text-slate-700",
          nav: "flex items-center gap-1",
          nav_button:
            "inline-flex items-center justify-center size-6 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse",
          head_row: "flex",
          head_cell: "text-slate-400 w-8 text-center text-[10px] font-medium py-1",
          row: "flex w-full mt-1",
          cell: "relative p-0 text-center [&:has([aria-selected])]:bg-blue-50 first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full [&:has(>.day-range-start)]:rounded-l-full [&:has(>.day-range-end)]:rounded-r-full",
          day: "size-8 rounded-full text-xs font-normal text-slate-700 hover:bg-slate-100 aria-selected:opacity-100 flex items-center justify-center",
          day_range_start: "day-range-start bg-blue-600 text-white hover:bg-blue-600 rounded-full",
          day_range_end: "day-range-end bg-blue-600 text-white hover:bg-blue-600 rounded-full",
          day_selected: "bg-blue-600 text-white hover:bg-blue-600",
          day_today: "font-semibold text-blue-600",
          day_outside: "text-slate-300 aria-selected:text-slate-400",
          day_disabled: "text-slate-300 opacity-40 cursor-not-allowed",
          day_range_middle: "aria-selected:bg-blue-50 aria-selected:text-slate-700 rounded-none",
          day_hidden: "invisible",
        }}
      />
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-slate-100">
        <span className="text-xs text-slate-500">
          {range?.from && range?.to
            ? `${format(range.from, "d MMM yyyy")} – ${format(range.to, "d MMM yyyy")}`
            : range?.from
            ? `${format(range.from, "d MMM yyyy")} – pick end date`
            : "Pick a start date"}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!range?.from || !range?.to}
            onClick={() => range?.from && range?.to && onApply(range)}
            className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export function FilterBar({
  showSearch = true,
  searchPlaceholder = "Search",
  searchableFields,
  showPeriod = true,
  showCreate = false,
  createLabel = "Create",
  onSearch,
  onPeriodChange,
  onCreate,
  showExport = false,
  onExport,
  extraFilters,
}: FilterBarProps) {
  const [period, setPeriod] = useState("All time");
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [appliedRange, setAppliedRange] = useState<DateRange | undefined>();
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showDatePicker) return;
    const handler = (e: MouseEvent) => {
      if (!datePickerRef.current?.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDatePicker]);

  const handlePeriod = (p: string) => {
    if (p === "Custom range") {
      setShowDatePicker(true);
      return;
    }
    setPeriod(p);
    setAppliedRange(undefined);
    onPeriodChange?.(p);
  };

  const handleApply = (range: DateRange) => {
    setAppliedRange(range);
    const label = `${format(range.from!, "d MMM")} – ${format(range.to!, "d MMM")}`;
    setPeriod(label);
    setShowDatePicker(false);
    onPeriodChange?.(`custom:${range.from!.toISOString()}|${range.to!.toISOString()}`);
  };

  const periodDisplayOptions = periodOptions.map((p) => ({ label: p, value: p }));

  const showTooltip = focused && !search && !!searchableFields?.length;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {showSearch && (
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); onSearch?.(e.target.value); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {showTooltip && (
            <div className="absolute bottom-full left-0 mb-1.5 z-50 bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 w-max max-w-xs pointer-events-none">
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">Search by</p>
              <p className="text-xs text-slate-700 leading-relaxed">
                {searchableFields!.join(", ")}
              </p>
              <div className="absolute top-full left-4 w-2 h-2 bg-white border-b border-r border-slate-200 rotate-45 -mt-1" />
            </div>
          )}
        </div>
      )}

      {showPeriod && (
        <div className="relative" ref={datePickerRef}>
          <FilterDropdown
            value={appliedRange ? "Custom range" : period}
            options={periodDisplayOptions}
            onChange={handlePeriod}
            icon={Calendar}
            displayLabel={appliedRange ? period : undefined}
          />
          {showDatePicker && (
            <DateRangePopover
              onApply={handleApply}
              onCancel={() => setShowDatePicker(false)}
              initialRange={appliedRange}
            />
          )}
        </div>
      )}

      {extraFilters}

      <div className="ml-auto flex items-center gap-2">
        {showExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
          >
            <Download size={13} />
            Export
          </button>
        )}
        {showCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
          >
            <Plus size={13} />
            {createLabel}
          </button>
        )}
      </div>
    </div>
  );
}
