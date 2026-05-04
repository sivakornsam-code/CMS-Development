import { useState } from "react";
import { X, Pencil, Check, Umbrella, FileText, CheckCircle, XCircle } from "lucide-react";
import { mockInsurance } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { FilterDropdown } from "../../components/ui/FilterDropdown";
import { SortIndicator } from "../../components/ui/SortIndicator";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination } from "../../components/ui/TablePagination";
import { formatDate, sortByStatus, sortByDatetime } from "../../components/ui/utils";

const PAGE_SIZE = 5;

type INS = typeof mockInsurance[0];

const ALL_STATUSES = ["Not submitted", "Active", "Rejected"];
const STATUS_PRIORITY = ["Not submitted", "Active", "Rejected"];
type SortKey = "status" | "purchasedDate";
type SortDir = "asc" | "desc";

function MiniDash() {
  const totalIssued = mockInsurance.length;
  const totalSubmitted = mockInsurance.filter((r) => r.submissionDate !== null).length;
  const totalApproved = mockInsurance.filter((r) => r.status === "Active").length;
  const totalDenied = mockInsurance.filter((r) => r.status === "Rejected").length;

  const bundleByName: Record<string, number> = {};
  mockInsurance.forEach((r) => {
    bundleByName[r.bundleName] = (bundleByName[r.bundleName] || 0) + 1;
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {/* Total Issued – list-style card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Umbrella size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Insurance Issued</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">{totalIssued}</p>
          </div>
        </div>
        <div className="space-y-1.5 border-t border-slate-100 pt-2.5">
          {Object.entries(bundleByName).map(([name, count]) => (
            <div key={name} className="flex justify-between text-xs">
              <span className="text-slate-400">{name}</span>
              <span className="font-medium text-slate-700">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
          <FileText size={16} className="text-violet-600" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Submitted</p>
          <p className="text-xl font-semibold text-slate-900 mt-0.5">{totalSubmitted}</p>
          <p className="text-xs text-slate-400 mt-0.5">Out of {totalIssued} issued</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
          <CheckCircle size={16} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Approved</p>
          <p className="text-xl font-semibold text-slate-900 mt-0.5">{totalApproved}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {totalSubmitted > 0 ? Math.round((totalApproved / totalSubmitted) * 100) : 0}% approval rate
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
          <XCircle size={16} className="text-red-500" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Denied</p>
          <p className="text-xl font-semibold text-slate-900 mt-0.5">{totalDenied}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {totalSubmitted > 0 ? Math.round((totalDenied / totalSubmitted) * 100) : 0}% denial rate
          </p>
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
            <span className="text-xs font-medium text-slate-800 text-right">{value ?? "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailModal({ record, onClose }: { record: INS; onClose: () => void }) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(record.status);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl shadow-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Insurance Detail</h3>
            <p className="text-xs text-slate-500">{record.orderId}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              <Pencil size={12} /> Manage
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
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
              <div className="flex items-center gap-2">
                <StatusBadge status={status} />
                {record.status === "Rejected" && (record as any).rejectReason && (
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-lg">{(record as any).rejectReason}</span>
                )}
              </div>
            )}
          </div>

          <Section title="Product Details">
            {[
              ["User Account", record.user],
              ["Product Name", record.productName],
              ["Purchase From", `Bundle — ${record.bundleName}`],
              ["Purchased Date", formatDate(record.purchasedDate)],
              ["Submission Date", record.submissionDate ? formatDate(record.submissionDate) : "Not submitted"],
              ["Coverage Period", record.coveragePeriod],
              ["Reference ID", record.referenceId ?? "—"],
            ]}
          </Section>

          <Section title="Personal Details">
            {[
              ["Title", record.title],
              ["First Name", record.firstName],
              ["Last Name", record.lastName],
              ["Gender", record.gender],
              ["Birthday", record.birthday],
            ]}
          </Section>

          <Section title="Passport Info">
            {[
              ["Passport Number", record.passportNo],
              ["Passport Expiration Date", formatDate(record.passportExpiry)],
            ]}
          </Section>

          <Section title="Trip Information">
            {[["Arrival Date to Thailand", formatDate(record.arrivalDate)]]}
          </Section>

          <Section title="Contact Information">
            {[
              ["Email", record.email],
              ["Phone Number", record.phone],
            ]}
          </Section>

          <Section title="Payment Details">
            {[
              ["Order ID", record.orderId],
              ["Payment Date / Time", formatDate(record.paymentDate)],
              ["Payment Method", record.paymentMethod],
              ["Subtotal", record.subtotal],
              ["Total", record.total],
            ]}
          </Section>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Status Log</h4>
            <div className="space-y-2">
              {[...record.statusLog].reverse().map((entry, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <StatusBadge status={entry.status} />
                  <span className="text-xs text-slate-500 mt-0.5">{formatDate(entry.dateTime)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Insurance() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<INS | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "status" ? "asc" : "desc");
    }
    setPage(1);
  }

  const filtered = mockInsurance.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.orderId.toLowerCase().includes(q) ||
      r.user.toLowerCase().includes(q);
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = !sortKey ? filtered
    : sortKey === "status" ? sortByStatus(filtered, "status", STATUS_PRIORITY, sortDir)
    : sortByDatetime(filtered, "purchasedDate", sortDir);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {selected && <DetailModal record={selected} onClose={() => setSelected(null)} />}

      <MiniDash />

      <FilterBar
        showSearch
        searchPlaceholder="Order ID or user email…"
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

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <span className="text-xs text-slate-500">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["User Account", "Order ID", "Product Name", "Purchase From"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("purchasedDate")}>
                  <span className="inline-flex items-center gap-1">Purchased Date/Time<SortIndicator active={sortKey === "purchasedDate"} direction={sortDir} /></span>
                </th>
                <th className="sticky right-0 bg-slate-50 border-l border-slate-100 z-10 text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("status")}>
                  <span className="inline-flex items-center gap-1">Status<SortIndicator active={sortKey === "status"} direction={sortDir} /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => (
                <tr key={r.orderId} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => setSelected(r)}>
                  <td className="px-4 py-3 text-xs text-blue-600 font-medium whitespace-nowrap">{r.user}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.orderId}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.productName}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">Bundle — {r.bundleName}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(r.purchasedDate)}</td>
                  <td className="sticky right-0 bg-white border-l border-slate-100 px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={r.status} />
                      {r.status === "Rejected" && (r as any).rejectReason && (
                        <span className="text-xs text-red-500 hidden lg:inline">({(r as any).rejectReason})</span>
                      )}
                    </div>
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
