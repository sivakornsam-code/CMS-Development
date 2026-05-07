import { useState, useEffect, useRef } from "react";
import { X, DollarSign, Car, MapPin, Pencil, Check, ChevronDown, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { mockTransportation } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { FilterDropdown } from "../../components/ui/FilterDropdown";
import { SortIndicator } from "../../components/ui/SortIndicator";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination, PAGE_SIZE } from "../../components/ui/TablePagination";
import { formatDate, formatDateTime, sortByStatusWithDate, sortByDatetime, sortByDatetimePair } from "../../components/ui/utils";
import { exportCSV, exportXLSX, parseExcelDate, exportDateTag } from "../../components/ui/exportUtils";

type TR = typeof mockTransportation[0];

const ALL_STATUSES = ["Pending", "Assigned", "Cancelled", "Complete"];
const ALL_TYPES = ["Airport Transfer", "Chauffeur Service"];
const STATUS_PRIORITY = ["Pending", "Assigned", "Complete", "Cancelled"];

const DROPOFF_LIMIT = 3;

function MiniDash() {
  const [showAllDropoff, setShowAllDropoff] = useState(false);

  const totalRevenue = mockTransportation
    .filter((r) => r.status === "Complete")
    .reduce((sum, r) => sum + parseFloat(r.subtotal.replace(/,/g, "")), 0);
  const airportCount = mockTransportation.filter((r) => r.serviceType === "Airport Transfer").length;
  const chauffeurCount = mockTransportation.filter((r) => r.serviceType === "Chauffeur Service").length;

  const pickupCounts: Record<string, number> = {};
  mockTransportation.forEach((r) => {
    const loc = r.pickUpLocation.split("—")[0].trim();
    pickupCounts[loc] = (pickupCounts[loc] || 0) + 1;
  });

  const dropoffCounts: Record<string, number> = {};
  mockTransportation.forEach((r) => {
    dropoffCounts[r.dropOffArea] = (dropoffCounts[r.dropOffArea] || 0) + 1;
  });

  const dropoffEntries = Object.entries(dropoffCounts);
  const hiddenCount = Math.max(0, dropoffEntries.length - DROPOFF_LIMIT);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
          <DollarSign size={16} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Revenue</p>
          <p className="text-xl font-semibold text-slate-900 mt-0.5">฿{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">All confirmed bookings</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <Car size={16} className="text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Bookings</p>
          <p className="text-xl font-semibold text-slate-900 mt-0.5">{mockTransportation.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Airport {airportCount} · Chauffeur {chauffeurCount}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={13} className="text-violet-600" />
          <p className="text-xs font-medium text-slate-600">Pick-up Locations</p>
        </div>
        <div className="space-y-1">
          {Object.entries(pickupCounts).map(([loc, count]) => (
            <div key={loc} className="flex justify-between text-xs">
              <span className="text-slate-500 truncate max-w-[120px]">{loc}</span>
              <span className="font-medium text-slate-800">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={13} className="text-amber-600" />
          <p className="text-xs font-medium text-slate-600">Drop-off Areas</p>
        </div>
        <div className="space-y-1">
          {dropoffEntries.slice(0, DROPOFF_LIMIT).map(([area, count]) => (
            <div key={area} className="flex justify-between text-xs">
              <span className="text-slate-500">{area}</span>
              <span className="font-medium text-slate-800">{count}</span>
            </div>
          ))}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showAllDropoff ? "max-h-96" : "max-h-0"}`}>
            <div className="space-y-1 pt-1">
              {dropoffEntries.slice(DROPOFF_LIMIT).map(([area, count]) => (
                <div key={area} className="flex justify-between text-xs">
                  <span className="text-slate-500">{area}</span>
                  <span className="font-medium text-slate-800">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {hiddenCount > 0 && (
          <button
            onClick={() => setShowAllDropoff((v) => !v)}
            className="mt-1.5 text-xs text-blue-500 hover:text-blue-700 font-medium"
          >
            {showAllDropoff ? "Show less" : `+ ${hiddenCount} more`}
          </button>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: [string, string][] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{title}</h4>
      <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
        {children.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <span className="text-xs text-slate-500 shrink-0">{label}</span>
            <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type BookingDateFields = {
  pickUpDate: string;
  pickUpTime: string;
  dropOffDate: string;
};

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = value ? new Date(value + "T00:00:00") : null;

  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { date: Date; current: boolean }[] = [];
  for (let i = firstDow - 1; i >= 0; i--)
    cells.push({ date: new Date(viewYear, viewMonth - 1, daysInPrev - i), current: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ date: new Date(viewYear, viewMonth, d), current: true });
  const tail = cells.length % 7;
  if (tail > 0)
    for (let d = 1; d <= 7 - tail; d++)
      cells.push({ date: new Date(viewYear, viewMonth + 1, d), current: false });

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const displayLabel = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "Select date";

  return (
    <div className="relative flex-1" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs hover:bg-slate-50"
      >
        <span className={value ? "text-slate-700" : "text-slate-400"}>{displayLabel}</span>
        <CalendarDays size={13} className="text-slate-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-4 w-64">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-semibold text-slate-800">{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold text-slate-400 pb-1">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((cell, i) => {
              const isSel = selected && sameDay(cell.date, selected);
              const isToday = sameDay(cell.date, today);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => { const d = cell.date; onChange(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`); setOpen(false); }}
                  className={[
                    "relative h-8 w-full flex items-center justify-center rounded-lg text-[11px] font-medium transition-colors",
                    isSel
                      ? "bg-blue-600 text-white shadow-sm"
                      : isToday
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      : cell.current
                      ? "text-slate-700 hover:bg-slate-100"
                      : "text-slate-300 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`);
                setViewMonth(today.getMonth());
                setViewYear(today.getFullYear());
                setOpen(false);
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

function BookingForm({
  initial,
  isChauffeur,
  onSave,
  onCancel,
}: {
  initial: BookingDateFields;
  isChauffeur: boolean;
  onSave: (d: BookingDateFields) => void;
  onCancel: () => void;
}) {
  const [pickUpDate, setPickUpDate] = useState(initial.pickUpDate);
  const [pickUpTime, setPickUpTime] = useState(initial.pickUpTime);
  const [timeOpen, setTimeOpen] = useState(false);
  const timeRef = useRef<HTMLDivElement>(null);
  const timeListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timeOpen) return;
    const handler = (e: MouseEvent) => {
      if (!timeRef.current?.contains(e.target as Node)) setTimeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [timeOpen]);

  useEffect(() => {
    if (!timeOpen || !timeListRef.current) return;
    const container = timeListRef.current;
    const selected = container.querySelector<HTMLButtonElement>("[data-selected]");
    if (selected) {
      container.scrollTop = selected.offsetTop - container.clientHeight / 2 + selected.clientHeight / 2;
    }
  }, [timeOpen]);

  const duration = isChauffeur
    ? Math.round(
        (new Date(initial.dropOffDate).getTime() - new Date(initial.pickUpDate).getTime()) /
          86400000
      )
    : 0;

  const dropOffDate = isChauffeur
    ? (() => {
        const d = new Date(pickUpDate);
        d.setDate(d.getDate() + duration);
        return d.toISOString().split("T")[0];
      })()
    : initial.dropOffDate;

  const hasChanged = pickUpDate !== initial.pickUpDate || pickUpTime !== initial.pickUpTime;

  return (
    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 w-24 shrink-0">Pickup Date</span>
        <DatePicker value={pickUpDate} onChange={setPickUpDate} />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 w-24 shrink-0">Pickup Time</span>
        <div className="relative flex-1" ref={timeRef}>
          <button
            type="button"
            onClick={() => setTimeOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
          >
            <span>{pickUpTime}</span>
            <ChevronDown size={13} className="text-slate-400 shrink-0" />
          </button>
          {timeOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
              <div className="max-h-48 overflow-y-auto" ref={timeListRef}>
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    {...(t === pickUpTime ? { "data-selected": true } : {})}
                    onClick={() => { setPickUpTime(t); setTimeOpen(false); }}
                    className={`block w-full text-left px-3 py-2 text-xs hover:bg-slate-50 ${
                      t === pickUpTime ? "text-blue-600 font-medium bg-blue-50" : "text-slate-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {isChauffeur && (
        <>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-24 shrink-0">End Date</span>
            <div className="flex-1 border border-slate-100 rounded-lg px-3 py-1.5 text-xs text-slate-400 bg-white select-none">
              {formatDate(dropOffDate)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-24 shrink-0">Duration</span>
            <div className="flex-1 border border-slate-100 rounded-lg px-3 py-1.5 text-xs text-slate-400 bg-white select-none">
              {duration + 1 === 1 ? "1 Day" : `${duration + 1} Days`}
            </div>
          </div>
        </>
      )}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave({ pickUpDate, pickUpTime, dropOffDate })}
          disabled={!hasChanged}
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        >
          <Check size={12} /> Save changes
        </button>
      </div>
    </div>
  );
}

type DriverFields = {
  driverName: string;
  driverPhone: string;
  driverPlate: string;
  driverCarColor: string;
  driverCar: string;
};

function DriverForm({
  initial,
  onSave,
  onCancel,
  submitLabel,
  mode,
}: {
  initial: DriverFields;
  onSave: (d: DriverFields) => void;
  onCancel: () => void;
  submitLabel: string;
  mode: "assign" | "edit";
}) {
  const [form, setForm] = useState<DriverFields>(initial);
  const set = (k: keyof DriverFields, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const fields: { label: string; key: keyof DriverFields; placeholder: string; optional?: boolean }[] = [
    { label: "Driver Name",  key: "driverName",     placeholder: "Full name" },
    { label: "Phone No.",    key: "driverPhone",     placeholder: "+66-xx-xxx-xxxx" },
    { label: "Plate No.",    key: "driverPlate",     placeholder: "กข 1234" },
    { label: "Car Color",    key: "driverCarColor",  placeholder: "e.g. Silver",     optional: true },
    { label: "Car Model",    key: "driverCar",       placeholder: "e.g. Toyota Camry", optional: true },
  ];

  const requiredKeys: (keyof DriverFields)[] = ["driverName", "driverPhone", "driverPlate"];

  const hasRequiredFilled = requiredKeys.every((k) => form[k].trim() !== "");
  const hasChanged = (Object.keys(form) as (keyof DriverFields)[]).some((k) => form[k] !== initial[k]);
  const canSubmit = mode === "assign"
    ? hasRequiredFilled
    : hasRequiredFilled && hasChanged;

  return (
    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
      {fields.map(({ label, key, placeholder, optional }) => (
        <div key={key} className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-24 shrink-0">
            {label}
            {optional && (
              <span className="text-slate-400 font-normal"> (optional)</span>
            )}
          </span>
          <input
            type="text"
            value={form[key]}
            onChange={(e) => set(key, e.target.value)}
            placeholder={placeholder}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={!canSubmit}
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        >
          <Check size={12} /> {submitLabel}
        </button>
      </div>
    </div>
  );
}


function DetailModal({ record, onClose, onUpdateBooking }: {
  record: TR;
  onClose: () => void;
  onUpdateBooking: (id: string, fields: BookingDateFields) => void;
}) {
  const [status, setStatus] = useState(record.status);
  const [driver, setDriver] = useState<DriverFields>({
    driverName:    record.driverName    || "",
    driverPhone:   record.driverPhone   || "",
    driverPlate:   record.driverPlate   || "",
    driverCarColor: record.driverCarColor || "",
    driverCar:     record.driverCar     || "",
  });
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [booking, setBooking] = useState<BookingDateFields>({
    pickUpDate:  record.pickUpDate,
    pickUpTime:  record.pickUpTime,
    dropOffDate: record.dropOffDate || "",
  });
  const [showBookingForm, setShowBookingForm] = useState(false);

  const isChauffeur = record.serviceType === "Chauffeur Service";
  const canModify = status === "Pending" || status === "Assigned";
  const canEditBooking = status === "Assigned";

  const openDriverForm = () => setShowDriverForm(true);

  useEffect(() => {
    if (!showDriverForm) return;
    const scroll = document.querySelector<HTMLElement>("[data-modal-scroll]");
    const section = document.querySelector<HTMLElement>("[data-driver-section]");
    if (scroll && section) {
      const containerRect = scroll.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      scroll.scrollTo({ top: scroll.scrollTop + (sectionRect.top - containerRect.top) - 16, behavior: "smooth" });
    }
  }, [showDriverForm]);

  useEffect(() => {
    if (!showBookingForm) return;
    const scroll = document.querySelector<HTMLElement>("[data-modal-scroll]");
    const section = document.querySelector<HTMLElement>("[data-booking-section]");
    if (scroll && section) {
      const containerRect = scroll.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      scroll.scrollTo({ top: scroll.scrollTop + (sectionRect.top - containerRect.top) - 16, behavior: "smooth" });
    }
  }, [showBookingForm]);

  const handleAssign = (d: DriverFields) => {
    setDriver(d);
    setStatus("Assigned");
    setShowDriverForm(false);
  };

  const handleEditDriver = (d: DriverFields) => {
    setDriver(d);
    setShowDriverForm(false);
  };

  const handleSaveBooking = (d: BookingDateFields) => {
    setBooking(d);
    setShowBookingForm(false);
    onUpdateBooking(record.bookingId, d);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl shadow-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Booking Detail</h3>
            <p className="text-xs text-slate-500">{record.bookingId}</p>
          </div>
          <div className="flex items-center gap-2">
            {status === "Pending" && !showDriverForm && (
              <button
                onClick={() => { setShowBookingForm(false); openDriverForm(); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Car size={12} /> Assign Driver
              </button>
            )}
            {status === "Assigned" && !showDriverForm && (
              <button
                onClick={() => { setShowBookingForm(false); openDriverForm(); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                <Pencil size={12} /> Edit Driver
              </button>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
          </div>
        </div>

        <div data-modal-scroll className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Status</span>
            <StatusBadge status={status} />
          </div>

          <Section title="Service Details">
            {[["Service Type", record.serviceType]]}
          </Section>

          <div data-booking-section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date / Time Details</h4>
              {canEditBooking && !showBookingForm && (
                <button
                  onClick={() => { setShowDriverForm(false); setShowBookingForm(true); }}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium px-2"
                >
                  <Pencil size={11} /> Edit
                </button>
              )}
            </div>
            {showBookingForm ? (
              <BookingForm
                initial={booking}
                isChauffeur={isChauffeur}
                onSave={handleSaveBooking}
                onCancel={() => setShowBookingForm(false)}
              />
            ) : (
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                {(isChauffeur
                  ? (() => {
                      const days = Math.round((new Date(booking.dropOffDate).getTime() - new Date(booking.pickUpDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                      return [
                        ["Pick-up Date",  formatDate(booking.pickUpDate)],
                        ["Pick-up Time",  booking.pickUpTime],
                        ["End Date",      formatDate(booking.dropOffDate)],
                        ["Duration",      days === 1 ? "1 Day" : `${days} Days`],
                      ] as [string, string][];
                    })()
                  : [
                      ["Pick-up Date", formatDate(booking.pickUpDate)],
                      ["Pick-up Time", booking.pickUpTime],
                    ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-xs text-slate-500 shrink-0">{label}</span>
                    <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Details with Google Map QR Codes */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Location Details</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                ["Pick-up Location", record.pickUpLocation],
                ["Drop-off Area",    record.dropOffArea],
                ["Address",          record.address],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                </div>
              ))}

              {(() => {
                const query   = `${record.address}, ${record.dropOffArea}`;
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
                const qrUrl   = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(mapsUrl)}`;
                return (
                  <div className="flex items-start justify-between gap-4 pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-500 shrink-0">Google Map QR</span>
                    <div className="flex flex-col items-center gap-1">
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" title="Open drop-off location in Google Maps">
                        <img
                          src={qrUrl}
                          alt="Google Map QR code — Drop-off"
                          className="w-[100px] h-[100px] border border-slate-200 hover:border-blue-400 transition-colors"
                          style={{ borderRadius: "2px" }}
                        />
                      </a>
                      <span className="text-[10px] text-slate-400">Scan to open in Google Maps</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <Section title="Passenger Details">
            {[
              ["Name", record.passengerName],
              ["Phone Number", record.passengerPhone],
              ["Contact Email", record.passengerEmail],
              ["Flight No.", record.flightNo],
              ["Account Email", record.user],
            ]}
          </Section>

          <Section title="Requested Car">
            {[
              ["Car Brand", record.carBrand],
              ["Car Model", record.carModel],
            ]}
          </Section>

          {/* Driver section */}
          <div data-driver-section>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Driver Details</h4>
            {showDriverForm ? (
              <DriverForm
                initial={driver}
                onSave={status === "Pending" ? handleAssign : handleEditDriver}
                onCancel={() => setShowDriverForm(false)}
                submitLabel={status === "Pending" ? "Assign & Confirm" : "Save Changes"}
                mode={status === "Pending" ? "assign" : "edit"}
              />
            ) : status === "Pending" ? (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700">
                No driver assigned yet. Click <span className="font-semibold">Assign Driver</span> to assign one.
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                {[
                  ["Driver Name", driver.driverName],
                  ["Phone No.",   driver.driverPhone],
                  ["Plate No.",   driver.driverPlate],
                  ["Car Color",   driver.driverCarColor],
                  ["Car Model",   driver.driverCar],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-xs text-slate-500 shrink-0">{label}</span>
                    <span className="text-xs font-medium text-slate-800 text-right">{value || "—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Section title="Payment Details">
            {[
              ["Order ID",        record.orderId],
              ["Payment Date",    formatDate(record.paymentDate)],
              ["Payment Method",  record.paymentMethod],
              ["Subtotal",        record.subtotal],
              ["Total",           record.total],
            ]}
          </Section>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Booking Log</h4>
            <div className="space-y-2">
              {[
                ["Last Updated", formatDate(record.updated), "bg-amber-500"],
                ["Created", formatDate(record.created), "bg-emerald-500"],
              ].map(([label, value, dotClass]) => (
                <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotClass}`} />
                  <div>
                    <p className="text-xs font-medium text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingTabs({ value, onChange, pendingCount }: {
  value: "all" | "pending";
  onChange: (v: "all" | "pending") => void;
  pendingCount: number;
}) {
  const tabs: { key: "all" | "pending"; label: string }[] = [
    { key: "all",     label: "All Booking" },
    { key: "pending", label: "Pending Booking" },
  ];
  return (
    <div className="flex items-center gap-1 border-b border-slate-200 mb-4">
      {tabs.map((t) => {
        const isActive = value === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
            {t.key === "pending" && (
              <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                isActive ? "bg-blue-600 text-white" : "bg-amber-100 text-amber-700"
              }`}>
                {pendingCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

type SortKey = "status" | "pickUpDateTime" | "created" | "updated";
type SortDir = "asc" | "desc";

const TR_HEADERS = [
  "User Account", "Order ID", "Service Type", "Booking ID", "Passenger",
  "Pick-up Date & Time", "Drop-off Date", "Pick-up Location", "Drop-off Area",
  "Driver", "Created Date/Time", "Updated Date/Time", "Status",
];

function trCSVRow(r: TR): string[] {
  return [
    r.user, r.orderId, r.serviceType, r.bookingId, r.passengerName,
    formatDateTime(r.pickUpDate, r.pickUpTime),
    r.serviceType === "Chauffeur Service" ? formatDate(r.dropOffDate) : "—",
    r.pickUpLocation, r.dropOffArea,
    r.driverName || "—",
    formatDate(r.created), formatDate(r.updated), r.status,
  ];
}

function trXLSXRow(r: TR): (string | number | Date | null)[] {
  const pickUp = r.pickUpDate && r.pickUpTime
    ? parseExcelDate(`${r.pickUpDate} ${r.pickUpTime}`) as Date | string
    : "—";
  return [
    r.user, r.orderId, r.serviceType, r.bookingId, r.passengerName,
    pickUp,
    r.serviceType === "Chauffeur Service" ? (parseExcelDate(r.dropOffDate) as Date | string) : "—",
    r.pickUpLocation, r.dropOffArea,
    r.driverName || "—",
    parseExcelDate(r.created) as Date | string,
    parseExcelDate(r.updated) as Date | string,
    r.status,
  ];
}

export function Transportation() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [bookingTab, setBookingTab] = useState<"all" | "pending">("all");
  const [selected, setSelected] = useState<TR | null>(null);
  const [rows, setRows] = useState(() => [...mockTransportation]);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("created");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleUpdateBooking = (id: string, fields: BookingDateFields) => {
    setRows((prev) => prev.map((r) => (r.bookingId === id ? { ...r, ...fields } : r)));
    setSelected((prev) => prev && prev.bookingId === id ? { ...prev, ...fields } : prev);
  };

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "status" ? "asc" : "desc");
    }
    setPage(1);
  }

  const pendingCount = rows.filter((r) => r.status === "Pending").length;

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.orderId.toLowerCase().includes(q) ||
      r.bookingId.toLowerCase().includes(q) ||
      r.user.toLowerCase().includes(q) ||
      r.passengerName.toLowerCase().includes(q) ||
      r.driverName.toLowerCase().includes(q);
    const matchTab = bookingTab === "all" || r.status === "Pending";
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchType = !typeFilter || r.serviceType === typeFilter;
    return matchSearch && matchTab && matchStatus && matchType;
  });

  const sorted = (() => {
    if (sortKey === "status") return sortByStatusWithDate(filtered, "status", STATUS_PRIORITY, sortDir, "created");
    if (sortKey === "pickUpDateTime") return sortByDatetimePair(filtered, "pickUpDate", "pickUpTime", sortDir);
    return sortByDatetime(filtered, sortKey, sortDir);
  })();

  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {selected && <DetailModal key={selected.bookingId} record={selected} onClose={() => setSelected(null)} onUpdateBooking={handleUpdateBooking} />}

      <MiniDash />

      <BookingTabs value={bookingTab} onChange={(v) => { setBookingTab(v); setPage(1); }} pendingCount={pendingCount} />

      <FilterBar
        showSearch
        searchableFields={["Order ID", "Booking ID", "Email", "Passenger Name", "Driver Name"]}
        showPeriod
        showExport
        exportDisabled={sorted.length === 0}
        onExportCSV={() => exportCSV(TR_HEADERS, sorted.map(trCSVRow), `transportation-${bookingTab}-${exportDateTag()}.csv`)}
        onExportXLSX={() => exportXLSX(TR_HEADERS, sorted.map(trXLSXRow), `transportation-${bookingTab}-${exportDateTag()}.xlsx`)}
        onSearch={(q) => { setSearch(q); setPage(1); }}
        extraFilters={
          <>
            <FilterDropdown
              value={typeFilter}
              onChange={(value) => { setTypeFilter(value); setPage(1); }}
              placeholder="All Types"
              options={[
                { label: "All Types", value: "" },
                ...ALL_TYPES.map((t) => ({ label: t, value: t })),
              ]}
            />
            <FilterDropdown
              value={statusFilter}
              onChange={(value) => { setStatusFilter(value); setPage(1); }}
              placeholder="All Statuses"
              options={[
                { label: "All Statuses", value: "" },
                ...ALL_STATUSES.map((s) => ({ label: s, value: s })),
              ]}
            />
          </>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto relative">
          <table className="w-full table-fixed text-sm" style={{ minWidth: "1700px" }}>
            <colgroup>
              {/* Fixed column widths — intentional, do not remove */}
              <col style={{ width: "160px" }} />{/* User Account */}
              <col style={{ width: "120px" }} />{/* Order ID */}
              <col style={{ width: "120px" }} />{/* Service Type */}
              <col style={{ width: "130px" }} />{/* Booking ID */}
              <col style={{ width: "130px" }} />{/* Passenger */}
              <col style={{ width: "150px" }} />{/* Pick-up Date & Time */}
              <col style={{ width: "100px" }} />{/* Drop-off Date */}
              <col style={{ width: "160px" }} />{/* Pick-up Location */}
              <col style={{ width: "110px" }} />{/* Drop-off Area */}
              <col style={{ width: "120px" }} />{/* Driver */}
              <col style={{ width: "150px" }} />{/* Created Date/Time */}
              <col style={{ width: "150px" }} />{/* Updated Date/Time */}
              <col style={{ width: "100px" }} />{/* Status */}
            </colgroup>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["User Account", "Order ID", "Service Type", "Booking ID", "Passenger"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("pickUpDateTime")}>
                  <span className="inline-flex items-center gap-1">
                    Pick-up Date &amp; Time
                    <SortIndicator active={sortKey === "pickUpDateTime"} direction={sortDir} />
                  </span>
                </th>
                {["Drop-off Date", "Pick-up Location", "Drop-off Area", "Driver"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("created")}>
                  <span className="inline-flex items-center gap-1">
                    Created Date/Time
                    <SortIndicator active={sortKey === "created"} direction={sortDir} />
                  </span>
                </th>
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("updated")}>
                  <span className="inline-flex items-center gap-1">
                    Updated Date/Time
                    <SortIndicator active={sortKey === "updated"} direction={sortDir} />
                  </span>
                </th>
                <th className="sticky right-0 bg-slate-50 border-l border-slate-100 z-10 text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("status")}>
                  <span className="inline-flex items-center gap-1">
                    Status
                    <SortIndicator active={sortKey === "status"} direction={sortDir} />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => (
                <tr key={r.bookingId} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => setSelected(r)}>
                  <td className="px-4 py-3 text-xs text-blue-600 font-medium truncate">{r.user}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{r.orderId}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.serviceType}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800 whitespace-nowrap">{r.bookingId}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.passengerName}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{formatDateTime(r.pickUpDate, r.pickUpTime)}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                    {r.serviceType === "Chauffeur Service" ? formatDate(r.dropOffDate) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 truncate">{r.pickUpLocation}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.dropOffArea}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.driverName || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(r.created)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(r.updated)}</td>
                  <td className="sticky right-0 bg-white border-l border-slate-100 px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No bookings found</div>}
        <TablePagination total={filtered.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  );
}
