import { useState } from "react";
import { X, Ticket, Users, ShoppingBag, LayoutGrid, Pencil, Check, Image as ImageIcon } from "lucide-react";
import { mockFastPass, mockUsers } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { FilterDropdown } from "../../components/ui/FilterDropdown";
import { SortIndicator } from "../../components/ui/SortIndicator";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination, PAGE_SIZE } from "../../components/ui/TablePagination";
import { formatDate, sortByStatusWithDate, sortByDatetime } from "../../components/ui/utils";

const AIRPORTS = [
  { label: "All",  code: "" },
  { label: "BKK", code: "BKK" },
  { label: "DMK", code: "DMK" },
  { label: "CNX", code: "CNX" },
  { label: "CEI", code: "CEI" },
  { label: "HKT", code: "HKT" },
  { label: "HDY", code: "HDY" },
];

function AirportTabs({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  return (
    <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto overflow-y-hidden mb-4">
      {AIRPORTS.map((a) => {
        const isActive = value === a.code;
        return (
          <button
            key={a.code}
            onClick={() => onChange(a.code)}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium border-b-[3px] -mb-px transition-colors whitespace-nowrap ${
              isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {a.label}
          </button>
        );
      })}
    </div>
  );
}

type FP = typeof mockFastPass[0];


function getFastPassHistory(record: FP) {
  const detailsUpdated = record.history.find((h) => h.event !== "FastPass verified");
  const verified = record.history.find((h) => h.event === "FastPass verified");

  return [
    detailsUpdated && { event: "FastPass details updated", dateTime: detailsUpdated.dateTime },
    { event: "FastPass verified", dateTime: verified?.dateTime ?? record.lastUpdated },
  ].filter(Boolean) as { event: string; dateTime: string }[];
}

function getFastPassHistoryDotClass(event: string) {
  if (event === "FastPass verified") return "bg-emerald-500";
  if (event === "FastPass details updated") return "bg-orange-400";
  return "bg-slate-300";
}

const ALL_STATUSES = ["Ready to use", "Redeemed", "Expired"];
const STATUS_PRIORITY = ["Ready to use", "Redeemed", "Expired"];
type SortKey = "status" | "flightDateTime";
type SortDir = "asc" | "desc";

function MiniDash() {
  const totalOrders = new Set(mockFastPass.map((r) => r.orderId)).size;
  const totalFastPasses = mockFastPass.length;
  const unique = new Set(mockFastPass.map((r) => r.user)).size;
  const totalUsers = mockUsers.length;
  const bundleOrders = new Set(mockFastPass.filter((r) => r.purchaseFrom === "Bundle").map((r) => r.orderId)).size;
  const directOrders = new Set(mockFastPass.filter((r) => r.purchaseFrom === "Direct").map((r) => r.orderId)).size;

  const cards = [
    { label: "Total FastPass Orders", value: totalOrders, sub: "All time orders", icon: <Ticket size={16} className="text-blue-600" />, bg: "bg-blue-50" },
    { label: "Total FastPass Purchased", value: totalFastPasses, sub: "Across all orders", icon: <ShoppingBag size={16} className="text-violet-600" />, bg: "bg-violet-50" },
    { label: "Unique Purchasing Users", value: unique, sub: `Out of ${totalUsers} total users`, icon: <Users size={16} className="text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Bundle vs Direct", value: `${bundleOrders} · ${directOrders}`, sub: "Bundle · Direct", icon: <LayoutGrid size={16} className="text-amber-600" />, bg: "bg-amber-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full mb-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 w-full min-w-0">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${c.bg}`}>{c.icon}</div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 leading-tight">{c.label}</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">{c.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PassportDetailPanel() {
  return (
    <div>
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Passport Detail</h4>
      <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 w-full">
        <p className="text-xs text-slate-500">Passport Cover</p>
        <div className="w-full">
          <div className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center gap-2 overflow-hidden">
            <ImageIcon size={56} className="text-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ record, onClose }: { record: FP; onClose: () => void }) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(record.status);
  const isReadyToUse = status === "Ready to use";

  const personalDetailsSection = (
    <Section title="Personal Details">
      {[
        ["Full Name", record.fullName],
        ["Passport Number", record.passport],
        ["Nationality", record.nationality],
        ["Date of Birth", formatDate(record.dob)],
        ["Gender", record.gender],
      ]}
    </Section>
  );

  const contactInfoSection = (
    <Section title="Contact Info">
      {[["User Account", record.user]]}
    </Section>
  );

  const remainingInfoSections = (
    <>
      <Section title="Flight Information">
        {[
          ["Airport", record.airport],
          ["Flight No.", record.flightNo],
          ["Arrival / Departure", record.arrivalDeparture],
          ["Flight Date / Time", formatDate(record.flightDateTime)],
        ]}
      </Section>

      <Section title="Additional Services">
        {[
          ["Travelers in Party", String(record.travelers)],
          ["Golf Cart", record.golfCart ? "Yes" : "No"],
          ["Butler Service", record.butler ? "Yes" : "No"],
        ]}
      </Section>

      <Section title="Order Details">
        {[
          ["Order ID", record.orderId],
          ["FastPass ID", record.fastpassId],
          ["Purchase Date", formatDate(record.purchaseDate)],
          ["Purchase From", record.purchaseFrom === "Bundle" ? `Bundle — ${(record as any).bundleName}` : "Direct"],
        ]}
      </Section>
    </>
  );

  const historyLogSection = (
    <div>
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">History Log</h4>
      <div className="space-y-2">
        {getFastPassHistory(record).map((h, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${getFastPassHistoryDotClass(h.event)}`} />
            <div>
              <p className="text-xs font-medium text-slate-800">{h.event}</p>
              <p className="text-xs text-slate-500 mt-0.5">{formatDate(h.dateTime)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const infoContent = (
    <div className="space-y-5">
      {personalDetailsSection}
      {isReadyToUse && (
        <div className="lg:hidden">
          <PassportDetailPanel />
        </div>
      )}
      {contactInfoSection}
      {remainingInfoSections}
      {historyLogSection}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-t-2xl sm:rounded-2xl w-full shadow-xl max-h-[90vh] overflow-hidden flex flex-col ${isReadyToUse ? "sm:max-w-xl lg:max-w-4xl" : "sm:max-w-xl"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">FastPass Detail</h3>
            <p className="text-xs text-slate-500">{record.fastpassId}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              <Pencil size={12} /> Edit
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
          </div>
        </div>

        {/* Status row */}
        <div className="flex items-center gap-3 px-5 pt-4 shrink-0">
          <span className="text-xs text-slate-500">Status</span>
          {editing ? (
            <div className="flex items-center gap-2">
              <FilterDropdown
                value={status}
                onChange={setStatus}
                options={ALL_STATUSES.map((s) => ({ label: s, value: s }))}
                className="w-36"
              />
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
              >
                <Check size={11} /> Save
              </button>
            </div>
          ) : (
            <StatusBadge status={status} />
          )}
        </div>

        {/* Body */}
        {isReadyToUse ? (
          <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row min-h-0">
            {/* Left column — all info */}
            <div className="lg:flex-[4] lg:overflow-y-auto p-5 lg:border-r border-slate-100">
              {infoContent}
            </div>

            {/* Right column — Passport Detail */}
            <div className="hidden lg:block lg:flex-[3] lg:overflow-y-auto p-5">
              <PassportDetailPanel />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5">
            {infoContent}
          </div>
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

export function FastPass() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [airportFilter, setAirportFilter] = useState("");
  const [selected, setSelected] = useState<FP | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("flightDateTime");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "status" ? "asc" : "desc");
    }
    setPage(1);
  }

  const filtered = mockFastPass.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.orderId.toLowerCase().includes(q) ||
      r.user.toLowerCase().includes(q) ||
      r.fullName.toLowerCase().includes(q) ||
      r.flightNo.toLowerCase().includes(q);
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchAirport = !airportFilter || r.airport.includes(`(${airportFilter})`);
    return matchSearch && matchStatus && matchAirport;
  });

  const sorted = sortKey === "status"
    ? sortByStatusWithDate(filtered, "status", STATUS_PRIORITY, sortDir, "flightDateTime")
    : sortByDatetime(filtered, "flightDateTime", sortDir);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full">
      {selected && <DetailModal record={selected} onClose={() => setSelected(null)} />}

      <MiniDash />

      <AirportTabs value={airportFilter} onChange={(v) => { setAirportFilter(v); setPage(1); }} />

      <FilterBar
        showSearch
        searchableFields={["Order ID", "Email", "Full Name", "Flight No."]}
        showPeriod
        showExport
        onSearch={(q) => { setSearch(q); setPage(1); }}
        extraFilters={
          <FilterDropdown
            value={statusFilter}
            onChange={(value) => { setStatusFilter(value); setPage(1); }}
            placeholder="All Statuses"
            options={[
              { label: "All Statuses", value: "" },
              ...ALL_STATUSES.map((s) => ({ label: s, value: s })),
            ]}
          />
        }
      />

      <div className="w-full min-w-0 bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto relative">
          <table className="w-full table-fixed text-sm" style={{ minWidth: "1370px" }}>
            <colgroup>
              {/* Fixed column widths — intentional, do not remove */}
              <col style={{ width: "180px" }} />{/* User Account */}
              <col style={{ width: "160px" }} />{/* Airport */}
              <col style={{ width: "90px" }} /> {/* Flight No. */}
              <col style={{ width: "80px" }} /> {/* Arr/Dep */}
              <col style={{ width: "150px" }} />{/* Flight Date/Time */}
              <col style={{ width: "150px" }} />{/* Full Name */}
              <col style={{ width: "110px" }} />{/* Passport */}
              <col style={{ width: "100px" }} />{/* Nationality */}
              <col style={{ width: "120px" }} />{/* Order ID */}
              <col style={{ width: "120px" }} />{/* FastPass ID */}
              <col style={{ width: "110px" }} />{/* Status */}
            </colgroup>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["User Account", "Airport", "Flight No.", "Arr/Dep"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("flightDateTime")}>
                  <span className="inline-flex items-center gap-1">Flight Date/Time<SortIndicator active={sortKey === "flightDateTime"} direction={sortDir} /></span>
                </th>
                {["Full Name", "Passport", "Nationality", "Order ID", "FastPass ID"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="sticky right-0 bg-slate-50 border-l border-slate-100 z-10 text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("status")}>
                  <span className="inline-flex items-center gap-1">Status<SortIndicator active={sortKey === "status"} direction={sortDir} /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => (
                <tr key={r.fastpassId} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => setSelected(r)}>
                  <td className="px-4 py-3 text-xs text-blue-600 font-medium truncate">{r.user}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 truncate">{r.airport}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.flightNo}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.arrivalDeparture}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{formatDate(r.flightDateTime)}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 truncate">{r.fullName}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap font-mono">{r.passport}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.nationality}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{r.orderId}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap font-medium">{r.fastpassId}</td>
                  <td className="sticky right-0 bg-white border-l border-slate-100 px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No records found</div>}
        <TablePagination total={filtered.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  );
}
