import { useState } from "react";
import { X, Download } from "lucide-react";
import { mockTDAC } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination } from "../../components/ui/TablePagination";

const PAGE_SIZE = 5;

type TDAC = typeof mockTDAC[0];

function DetailModal({ record, onClose }: { record: TDAC; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">TDAC Detail</h3>
            <p className="text-xs text-slate-500">{record.email}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">TDAC Status</span>
            <StatusBadge status={record.status} />
          </div>

          {/* Personal Info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Personal Information</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                ["Account Email", record.email],
                ["Full Name", record.name],
                ["Passport No.", record.passportNo],
                ["Nationality", record.nationality],
                ["Arrival Card No.", record.arrivalCardNo],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrival Info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Arrival Information</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                ["Date of Arrival", record.arrivalDate],
                ["Flight No. / Vehicle No.", record.arrivalFlightNo],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Departure Info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Departure Information</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                ["Date of Departure", record.departureDate],
                ["Flight No. / Vehicle No.", record.departureFlightNo],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Submission</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                ["Submitted Date", record.submittedAt],
                ["Updated Date / Time", record.updatedAt],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download PDF */}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
            <Download size={14} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export function TDACList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<TDAC | null>(null);
  const [page, setPage] = useState(1);

  const filtered = mockTDAC.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.email.toLowerCase().includes(q) ||
      r.arrivalCardNo.toLowerCase().includes(q);
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {selected && <DetailModal record={selected} onClose={() => setSelected(null)} />}

      <FilterBar
        showSearch
        searchPlaceholder="User email or arrival card number…"
        showPeriod
        onSearch={(q) => { setSearch(q); setPage(1); }}
        extraFilters={
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <span className="text-xs text-slate-500">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Email", "Name (TDAC)", "Arrival Card No.", "Nationality", "Arrival Date", "Departure Date", "Submitted Date/Time", "Updated Date/Time"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="sticky right-0 bg-slate-50 border-l border-slate-100 z-10 text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => (
                <tr
                  key={r.arrivalCardNo}
                  className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer"
                  onClick={() => setSelected(r)}
                >
                  <td className="px-4 py-3 text-xs text-blue-600 font-medium whitespace-nowrap">{r.email}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap font-mono">{r.arrivalCardNo}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.nationality}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.arrivalDate}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.departureDate}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{r.submittedAt}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{r.updatedAt}</td>
                  <td className="sticky right-0 bg-white border-l border-slate-100 px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No records found</div>
        )}
        <TablePagination total={filtered.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  );
}
