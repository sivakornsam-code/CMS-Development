import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { X, Umbrella, FileText, CheckCircle, XCircle } from "lucide-react";
import { mockInsurance } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { FilterDropdown } from "../../components/ui/FilterDropdown";
import { SortIndicator } from "../../components/ui/SortIndicator";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination, PAGE_SIZE } from "../../components/ui/TablePagination";
import { formatDate, sortByStatusWithDate, sortByDatetime } from "../../components/ui/utils";
import { exportCSV, exportXLSX, parseExcelDate, exportDateTag } from "../../components/ui/exportUtils";
import { formatTHBString } from "../../data/formatters";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

type INS = typeof mockInsurance[0];

const ALL_STATUSES = ["Not submitted", "Active", "Rejected", "Expired"];
const STATUS_PRIORITY = ["Not submitted", "Active", "Rejected", "Expired"];
type SortKey = "status" | "purchasedDate";
type SortDir = "asc" | "desc";

function MiniDash() {
  const totalIssued = mockInsurance.length;
  const totalSubmitted = mockInsurance.filter((r) => r.submissionDate !== null).length;
  const totalApproved = mockInsurance.filter((r) => r.status === "Active").length;
  const totalDenied = mockInsurance.filter((r) => r.status === "Rejected").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <Umbrella size={16} className="text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Insurance Issued</p>
          <p className="text-xl font-semibold text-slate-900 mt-0.5">{totalIssued}</p>
          <p className="text-xs text-slate-400 mt-0.5">All time</p>
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
        <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
          <XCircle size={16} className="text-orange-500" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Rejected</p>
          <p className="text-xl font-semibold text-slate-900 mt-0.5">{totalDenied}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {totalSubmitted > 0 ? Math.round((totalDenied / totalSubmitted) * 100) : 0}% rejection rate
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

function DetailModal({ record, onClose, onBack }: { record: INS; onClose: () => void; onBack?: () => void }) {
  useBodyScrollLock();
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="w-full sm:max-w-xl flex flex-col">
        {onBack && (
          <div className="px-4 sm:px-0 pb-2" onClick={(e) => e.stopPropagation()}>
            <button
              className="flex items-center gap-1.5 text-xs font-medium text-white/90 hover:text-white bg-black/25 hover:bg-black/40 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
              onClick={onBack}
            >
              ← Back to Order
            </button>
          </div>
        )}
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full shadow-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Insurance Detail</h3>
            <p className="text-xs text-slate-500">{record.orderId}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">Status</span>
              <StatusBadge status={record.status} />
            </div>
            {record.status === "Rejected" && (record as any).rejectReason && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">Reason</span>
                <span className="text-xs text-orange-700">{(record as any).rejectReason}</span>
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
              ["Payment Date/Time", formatDate(record.paymentDate)],
              ["Payment Method", record.paymentMethod],
              ["Subtotal", formatTHBString(record.subtotal)],
              ["Total", formatTHBString(record.total)],
            ]}
          </Section>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Status Log</h4>
            <div className="space-y-2">
              {[...record.statusLog].reverse().map((entry, i) => {
                const dotClass =
                  entry.status === "Approved" ? "bg-emerald-500" :
                  entry.status === "Rejected" ? "bg-orange-500" :
                  entry.status === "Expired" ? "bg-red-500" :
                  "bg-blue-500";
                return (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotClass}`} />
                    <div>
                      <p className="text-xs font-medium text-slate-800">{entry.status}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{formatDate(entry.dateTime)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

const INS_HEADERS = [
  "User Account", "Order ID", "Product Name", "Purchase From",
  "Purchased Date/Time", "Status",
];

function insCSVRow(r: INS): string[] {
  return [
    r.user, r.orderId, r.productName,
    `Bundle — ${r.bundleName}`,
    formatDate(r.purchasedDate), r.status,
  ];
}

function insXLSXRow(r: INS): (string | number | Date | null)[] {
  return [
    r.user, r.orderId, r.productName,
    `Bundle — ${r.bundleName}`,
    parseExcelDate(r.purchasedDate) as Date | string, r.status,
  ];
}

export function Insurance() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<INS | null>(null);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnUserEmail, setReturnUserEmail] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("purchasedDate");

  useEffect(() => {
    const id = sessionStorage.getItem("returnToOrderId");
    if (id) {
      sessionStorage.removeItem("returnToOrderId");
      setReturnOrderId(id);
    }
    const email = sessionStorage.getItem("returnToUserEmail");
    if (email) {
      sessionStorage.removeItem("returnToUserEmail");
      setReturnUserEmail(email);
    }
  }, []);

  function handleBack() {
    sessionStorage.setItem("openOrderId", returnOrderId!);
    if (returnUserEmail) sessionStorage.setItem("returnToUserEmail", returnUserEmail);
    setReturnOrderId(null);
    navigate("/operations/orders");
  }

  useEffect(() => {
    const refId = sessionStorage.getItem("openInsuranceRefId");
    if (refId) {
      sessionStorage.removeItem("openInsuranceRefId");
      const record = mockInsurance.find((r) => r.referenceId === refId);
      if (record) setSelected(record);
      return;
    }
    const orderId = sessionStorage.getItem("openInsuranceOrderId");
    if (orderId) {
      sessionStorage.removeItem("openInsuranceOrderId");
      const record = mockInsurance.find((r) => r.orderId === orderId);
      if (record) setSelected(record);
    }
  }, []);
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

  const filtered = mockInsurance.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.orderId.toLowerCase().includes(q) ||
      r.user.toLowerCase().includes(q);
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = sortKey === "status"
    ? sortByStatusWithDate(filtered, "status", STATUS_PRIORITY, sortDir, "purchasedDate")
    : sortByDatetime(filtered, "purchasedDate", sortDir);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {selected && <DetailModal record={selected} onClose={() => { setSelected(null); setReturnOrderId(null); }} onBack={returnOrderId ? handleBack : undefined} />}

      <MiniDash />

      <FilterBar
        showSearch
        searchableFields={["Order ID", "User Account"]}
        showPeriod
        showExport
        exportDisabled={sorted.length === 0}
        onExportCSV={() => exportCSV(INS_HEADERS, sorted.map(insCSVRow), `insurance-${exportDateTag()}.csv`)}
        onExportXLSX={() => exportXLSX(INS_HEADERS, sorted.map(insXLSXRow), `insurance-${exportDateTag()}.xlsx`)}
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
        <div className="overflow-x-auto relative">
          <table className="w-full table-fixed text-sm" style={{ minWidth: "970px" }}>
            <colgroup>
              {/* Fixed column widths — intentional, do not remove */}
              <col style={{ width: "180px" }} />{/* User Account */}
              <col style={{ width: "120px" }} />{/* Order ID */}
              <col style={{ width: "200px" }} />{/* Product Name */}
              <col style={{ width: "180px" }} />{/* Purchase From */}
              <col style={{ width: "150px" }} />{/* Purchased Date/Time */}
              <col style={{ width: "140px" }} />{/* Status */}
            </colgroup>
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
                <tr key={r.referenceId ?? `${r.orderId}-${r.passportNo}`} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => setSelected(r)}>
                  <td className="px-4 py-3 text-xs text-blue-600 font-medium truncate">{r.user}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.orderId}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 truncate">{r.productName}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">Bundle — {r.bundleName}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(r.purchasedDate)}</td>
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
