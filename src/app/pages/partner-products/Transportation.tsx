import { useState, useEffect } from "react";
import { X, DollarSign, Car, MapPin, Pencil, Check } from "lucide-react";
import { mockTransportation } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination } from "../../components/ui/TablePagination";

const PAGE_SIZE = 5;

type TR = typeof mockTransportation[0];

const ALL_STATUSES = ["Pending", "Assigned", "Cancelled", "Complete"];
const ALL_TYPES = ["Airport Transfer", "Chauffeur"];

function MiniDash() {
  const totalRevenue = mockTransportation
    .filter((r) => r.status === "Complete")
    .reduce((sum, r) => sum + parseFloat(r.subtotal.replace(/,/g, "")), 0);
  const airportCount = mockTransportation.filter((r) => r.serviceType === "Airport Transfer").length;
  const chauffeurCount = mockTransportation.filter((r) => r.serviceType === "Chauffeur").length;

  const pickupCounts: Record<string, number> = {};
  mockTransportation.forEach((r) => {
    const loc = r.pickUpLocation.split("—")[0].trim();
    pickupCounts[loc] = (pickupCounts[loc] || 0) + 1;
  });

  const dropoffCounts: Record<string, number> = {};
  mockTransportation.forEach((r) => {
    dropoffCounts[r.dropOffArea] = (dropoffCounts[r.dropOffArea] || 0) + 1;
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
          <DollarSign size={16} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Revenue</p>
          <p className="text-xl font-semibold text-slate-900 mt-0.5">฿{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Completed bookings</p>
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
          {Object.entries(dropoffCounts).map(([area, count]) => (
            <div key={area} className="flex justify-between text-xs">
              <span className="text-slate-500">{area}</span>
              <span className="font-medium text-slate-800">{count}</span>
            </div>
          ))}
        </div>
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
}: {
  initial: DriverFields;
  onSave: (d: DriverFields) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [form, setForm] = useState<DriverFields>(initial);
  const set = (k: keyof DriverFields, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const fields: { label: string; key: keyof DriverFields; placeholder: string }[] = [
    { label: "Driver Name",  key: "driverName",     placeholder: "Full name" },
    { label: "Phone No.",    key: "driverPhone",     placeholder: "+66-xx-xxx-xxxx" },
    { label: "Plate No.",    key: "driverPlate",     placeholder: "กข 1234" },
    { label: "Car Color",    key: "driverCarColor",  placeholder: "e.g. Silver" },
    { label: "Car Model",    key: "driverCar",       placeholder: "e.g. Toyota Camry" },
  ];

  return (
    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
      {fields.map(({ label, key, placeholder }) => (
        <div key={key} className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-24 shrink-0">{label}</span>
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
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center justify-center gap-1.5"
        >
          <Check size={12} /> {submitLabel}
        </button>
      </div>
    </div>
  );
}

function DetailModal({ record, onClose }: { record: TR; onClose: () => void }) {
  const [status, setStatus] = useState(record.status);
  const [driver, setDriver] = useState<DriverFields>({
    driverName:    record.driverName    || "",
    driverPhone:   record.driverPhone   || "",
    driverPlate:   record.driverPlate   || "",
    driverCarColor: record.driverCarColor || "",
    driverCar:     record.driverCar     || "",
  });
  const [showDriverForm, setShowDriverForm] = useState(false);

  const openDriverForm = () => setShowDriverForm(true);

  useEffect(() => {
    if (!showDriverForm) return;
    const scroll = document.querySelector<HTMLElement>('[data-modal-scroll]');
    const section = document.querySelector<HTMLElement>('[data-driver-section]');
    if (scroll && section) {
      const containerRect = scroll.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      scroll.scrollTo({ top: scroll.scrollTop + (sectionRect.top - containerRect.top) - 16, behavior: "smooth" });
    }
  }, [showDriverForm]);

  const handleAssign = (d: DriverFields) => {
    setDriver(d);
    setStatus("Assigned");
    setShowDriverForm(false);
  };

  const handleEditDriver = (d: DriverFields) => {
    setDriver(d);
    setShowDriverForm(false);
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
                onClick={openDriverForm}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Car size={12} /> Assign Driver
              </button>
            )}
            {status === "Assigned" && !showDriverForm && (
              <button
                onClick={openDriverForm}
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

          <Section title="Date / Time Details">
            {[
              ["Pick-up Date", record.pickUpDate],
              ["Pick-up Time", record.pickUpTime],
              ["Drop-off Date", record.dropOffDate],
            ]}
          </Section>

          <Section title="Location Details">
            {[
              ["Pick-up Location", record.pickUpLocation],
              ["Drop-off Area", record.dropOffArea],
              ["Address", record.address],
            ]}
          </Section>

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
              ["Payment Date",    record.paymentDate],
              ["Payment Method",  record.paymentMethod],
              ["Subtotal",        record.subtotal],
              ["Total",           record.total],
            ]}
          </Section>

          <Section title="Booking Log">
            {[
              ["Created",      record.created],
              ["Last Updated", record.updated],
            ]}
          </Section>
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

export function Transportation() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [bookingTab, setBookingTab] = useState<"all" | "pending">("all");
  const [selected, setSelected] = useState<TR | null>(null);
  const [page, setPage] = useState(1);

  const pendingCount = mockTransportation.filter((r) => r.status === "Pending").length;

  const filtered = mockTransportation.filter((r) => {
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

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {selected && <DetailModal key={selected.bookingId} record={selected} onClose={() => setSelected(null)} />}

      <MiniDash />

      <BookingTabs value={bookingTab} onChange={(v) => { setBookingTab(v); setPage(1); }} pendingCount={pendingCount} />

      <FilterBar
        showSearch
        searchPlaceholder="Order ID, booking ID, email, passenger, driver…"
        showPeriod
        showExport
        onSearch={(q) => { setSearch(q); setPage(1); }}
        extraFilters={
          <>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {ALL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <span className="text-xs text-slate-500">{filtered.length} bookings</span>
        </div>
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["User Account", "Order ID", "Service Type", "Booking ID", "Passenger", "Pick-up Date", "Pick-up Time", "Drop-off Date", "Pick-up Location", "Drop-off Area", "Driver", "Created", "Updated"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="sticky right-0 bg-slate-50 border-l border-slate-100 z-10 text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => (
                <tr key={r.bookingId} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => setSelected(r)}>
                  <td className="px-4 py-3 text-xs text-blue-600 font-medium whitespace-nowrap">{r.user}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{r.orderId}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.serviceType}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800 whitespace-nowrap">{r.bookingId}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.passengerName}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.pickUpDate}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.pickUpTime}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.dropOffDate}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap max-w-[160px] truncate">{r.pickUpLocation}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.dropOffArea}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.driverName || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{r.created}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{r.updated}</td>
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
