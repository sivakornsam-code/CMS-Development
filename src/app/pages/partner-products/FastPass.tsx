import { useState } from "react";
import { X, Ticket, Users, ShoppingBag, LayoutGrid, Pencil, Check, Image as ImageIcon } from "lucide-react";
import { mockFastPass } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination } from "../../components/ui/TablePagination";

const PAGE_SIZE = 5;

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
    <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto">
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

function formatHistoryDate(dt: string) {
  const [datePart, timePart] = dt.split(" ");
  const [year, month, day] = datePart.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}, ${timePart}`;
}

function getFastPassHistory(record: FP) {
  const detailsUpdated = record.history.find((h) => h.event !== "FastPass verified");
  const verified = record.history.find((h) => h.event === "FastPass verified");

  return [
    detailsUpdated && { event: "FastPass details updated", dateTime: detailsUpdated.dateTime },
    { event: "FastPass verified", dateTime: verified?.dateTime ?? record.lastUpdated },
  ].filter(Boolean) as { event: string; dateTime: string }[];
}

const ALL_STATUSES = ["Ready to use", "Redeemed", "Expired"];

function MiniDash() {
  const total = mockFastPass.length;
  const totalPurchased = mockFastPass.reduce((s, r) => s + r.travelers, 0);
  const unique = new Set(mockFastPass.map((r) => r.user)).size;
  const bundle = mockFastPass.filter((r) => r.purchaseFrom === "Bundle").length;
  const direct = mockFastPass.filter((r) => r.purchaseFrom === "Direct").length;

  const cards = [
    { label: "Total FastPass Orders", value: total, sub: "Number of orders", icon: <Ticket size={16} className="text-blue-600" />, bg: "bg-blue-50" },
    { label: "Total FastPass Purchased", value: totalPurchased, sub: "Number of FastPass", icon: <ShoppingBag size={16} className="text-violet-600" />, bg: "bg-violet-50" },
    { label: "Unique Purchasing Users", value: unique, sub: "Unique users", icon: <Users size={16} className="text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Bundle vs Direct", value: `${bundle} · ${direct}`, sub: "Bundle · Direct", icon: <LayoutGrid size={16} className="text-amber-600" />, bg: "bg-amber-50" },
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

function DetailModal({ record, onClose }: { record: FP; onClose: () => void }) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(record.status);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl shadow-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
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

        <div className="flex-1 overflow-y-auto p-5">
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Status</span>
            {editing ? (
              <div className="flex items-center gap-2">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
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

          <div className="mt-5 space-y-5">
            <Section title="Personal Details">
              {[
                ["Full Name", record.fullName],
                ["Passport Number", record.passport],
                ["Nationality", record.nationality],
                ["Date of Birth", record.dob],
                ["Gender", record.gender],
              ]}
            </Section>

            {status === "Ready to use" && (
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Passport Detail</h4>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-3">Passport Cover</p>
                  <div className="w-full flex justify-center">
                    <div className="w-64 max-w-full aspect-[3/4] rounded-xl border border-dashed border-slate-300 bg-white flex items-center justify-center">
                      <ImageIcon size={42} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Section title="Contact Info">
              {[["User Account", record.user]]}
            </Section>

            <Section title="Flight Information">
              {[
                ["Airport", record.airport],
                ["Flight No.", record.flightNo],
                ["Arrival / Departure", record.arrivalDeparture],
                ["Flight Date / Time", record.flightDateTime],
              ]}
            </Section>

            <Section title="Additional Services">
              {[
                ["Travelers in Party", String(record.travelers)],
                ["Golf Cart", record.golfCart ? "Yes" : "No"],
                ["Butler Service", record.butler ? "Yes" : "No"],
                ...(record.butler ? [["Butler Amount", String(record.butlerAmount)] as [string, string]] : []),
              ]}
            </Section>

            <Section title="Order Details">
              {[
                ["Order ID", record.orderId],
                ["FastPass ID", record.fastpassId],
                ["Purchase Date", record.purchaseDate],
                ["Purchase From", record.purchaseFrom === "Bundle" ? `Bundle — ${(record as any).bundleName}` : "Direct"],
              ]}
            </Section>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">History Log</h4>
              <div className="space-y-2">
                {getFastPassHistory(record).map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-800">{h.event}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{formatHistoryDate(h.dateTime)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

export function FastPass() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [airportFilter, setAirportFilter] = useState("");
  const [selected, setSelected] = useState<FP | null>(null);
  const [page, setPage] = useState(1);

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

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full flex flex-col gap-4">
      {selected && <DetailModal record={selected} onClose={() => setSelected(null)} />}

      <MiniDash />

      <AirportTabs value={airportFilter} onChange={(v) => { setAirportFilter(v); setPage(1); }} />

      <FilterBar
        showSearch
        searchPlaceholder="Order ID, email, name, flight no…"
        showPeriod
        showExport
        onSearch={(q) => { setSearch(q); setPage(1); }}
        extraFilters={
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        }
      />

      <div className="w-full min-w-0 bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <span className="text-xs text-slate-500">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["User Account", "Airport", "Flight No.", "Arr/Dep", "Flight Date/Time", "Full Name", "Passport", "Nationality", "Order ID", "FastPass ID"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="sticky right-0 bg-slate-50 border-l border-slate-100 z-10 text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => (
                <tr key={r.fastpassId} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => setSelected(r)}>
                  <td className="px-4 py-3 text-xs text-blue-600 font-medium whitespace-nowrap">{r.user}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.airport}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.flightNo}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.arrivalDeparture}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.flightDateTime}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.fullName}</td>
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
