import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronDown, Search, Download, Plus, SlidersHorizontal } from "lucide-react";

const periodOptions = ["All time", "Today", "Last 7 days", "Last 30 days", "This month", "Custom range"];

interface FilterBarProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
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
  searchPlaceholder = "Search...",
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
  const [periodOpen, setPeriodOpen] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!periodOpen) return;
    const handler = (e: MouseEvent) => {
      if (!periodRef.current?.contains(e.target as Node)) setPeriodOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [periodOpen]);

  const handlePeriod = (p: string) => {
    setPeriod(p);
    setPeriodOpen(false);
    onPeriodChange?.(p);
  };

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
            className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {showPeriod && (
        <div className="relative" ref={periodRef}>
          <button
            onClick={() => setPeriodOpen(!periodOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
          >
            <Calendar size={13} />
            {period}
            <ChevronDown size={13} />
          </button>
          {periodOpen && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
              {periodOptions.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriod(p)}
                  className={`block w-full text-left px-3 py-2 text-xs hover:bg-slate-50 ${p === period ? "text-blue-600 font-medium" : "text-slate-700"}`}
                >
                  {p}
                </button>
              ))}
            </div>
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
