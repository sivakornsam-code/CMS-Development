import { useState } from "react";
import { Calendar, Search, Download, Plus } from "lucide-react";
import { FilterDropdown } from "./FilterDropdown";

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

  const handlePeriod = (p: string) => {
    setPeriod(p);
    onPeriodChange?.(p);
  };

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
        <FilterDropdown
          value={period}
          options={periodOptions.map((p) => ({ label: p, value: p }))}
          onChange={handlePeriod}
          icon={Calendar}
        />
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
