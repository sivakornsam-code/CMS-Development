import { useState } from "react";
import { X, DollarSign, ShoppingBag, Wifi, TrendingUp } from "lucide-react";
import { mockEsim } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { FilterDropdown } from "../../components/ui/FilterDropdown";
import { SortIndicator } from "../../components/ui/SortIndicator";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination, PAGE_SIZE } from "../../components/ui/TablePagination";
import { formatDate, sortByStatusWithDate, sortByDatetime } from "../../components/ui/utils";
import { exportCSV, exportXLSX, parseExcelDate, exportDateTag } from "../../components/ui/exportUtils";

type ES = typeof mockEsim[0];

const ALL_STATUSES = ["Not Installed", "Inactive", "Active", "Out of Data", "Expired"];
const STATUS_PRIORITY = ["Not Installed", "Inactive", "Active", "Out of Data", "Expired"];
type SortKey = "status" | "purchasedDate";
type SortDir = "asc" | "desc";

function resolvePurchaseFrom(record: ES): string {
  if (record.type === "Top-up") return "—";
  return record.purchaseFrom === "Bundle" ? `Bundle — ${record.bundleName}` : "Direct";
}

function parseProductSpecs(productName: string): { data: string; duration: string } {
  const durationMatch = productName.match(/(\d+)D/i);
  const dataMatch = productName.match(/(\d+(?:\.\d+)?)\s*(GB|MB)/i);
  return {
    duration: durationMatch ? `${durationMatch[1]} ${durationMatch[1] === "1" ? "Day" : "Days"}` : "—",
    data: dataMatch ? `${dataMatch[1]} ${dataMatch[2].toUpperCase()}` : "—",
  };
}

function MiniDash() {
  const totalRevenue = mockEsim.reduce((sum, r) => {
    return sum + parseFloat(r.total.replace(/,/g, "").replace(" THB", ""));
  }, 0);

  const totalOrders = mockEsim.length;

  const bundleCount = mockEsim.filter((r) => r.type === "Standard" && r.purchaseFrom === "Bundle").length;
  const directCount = mockEsim.filter((r) => r.type === "Standard" && r.purchaseFrom === "Direct").length;
  const topupCount = mockEsim.filter((r) => r.type === "Top-up").length;

  const installedStatuses = new Set(["Inactive", "Active"]);
  const totalInstalled = new Set(
    mockEsim.filter((r) => installedStatuses.has(r.status)).map((r) => r.iccid)
  ).size;

  const packageCounts: Record<string, number> = {};
  mockEsim.forEach((r) => {
    packageCounts[r.productName] = (packageCounts[r.productName] || 0) + 1;
  });
  const top5 = Object.entries(packageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Row 1 – stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <DollarSign size={16} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Revenue</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">฿{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-xs text-slate-400 mt-0.5">All eSIM orders</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <ShoppingBag size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total eSIM Orders</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">{totalOrders}</p>
            <p className="text-xs text-slate-400 mt-0.5">Standard & Top-up</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
            <Wifi size={16} className="text-violet-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total eSIM Installed</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">{totalInstalled}</p>
            <p className="text-xs text-slate-400 mt-0.5">Installed on device</p>
          </div>
        </div>
      </div>

      {/* Row 2 – list cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag size={13} className="text-blue-600" />
            <p className="text-xs font-semibold text-slate-700">eSIM Package Orders Count</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Bundle</span>
              <span className="font-semibold text-slate-800">{bundleCount}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Direct</span>
              <span className="font-semibold text-slate-800">{directCount}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Top-up</span>
              <span className="font-semibold text-slate-800">{topupCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={13} className="text-violet-600" />
            <p className="text-xs font-semibold text-slate-700">Most Purchased eSIM Package (Top 5)</p>
          </div>
          <div className="space-y-2">
            {top5.map(([name, count], i) => (
              <div key={name} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 w-4 text-right shrink-0">{i + 1}</span>
                <span className="flex-1 text-xs text-slate-700 truncate">{name}</span>
                <span className="text-xs font-semibold text-slate-800 shrink-0">{count}</span>
              </div>
            ))}
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

function TypeBadge({ type }: { type: "Standard" | "Top-up" }) {
  if (type === "Top-up") {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">Top-up</span>;
  }
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-transparent">Standard</span>;
}

function DetailModal({ record, onClose, onOpenOrder }: { record: ES; onClose: () => void; onOpenOrder: (r: ES) => void }) {
  const specs = parseProductSpecs(record.productName);
  const parentRecord = record.type === "Top-up" && record.parentOrderId
    ? mockEsim.find((r) => r.orderId === record.parentOrderId) ?? null
    : null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Order Details</h3>
            <p className="text-xs text-slate-500">{record.orderId}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">Type</span>
              <TypeBadge type={record.type} />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">Status</span>
              <StatusBadge status={record.status} variant="esim" />
            </div>
          </div>

          <Section title="Details">
            {[
              ["User Account", record.user],
              ["Product Name", record.productName],
              ["Data", specs.data],
              ["Duration", specs.duration],
              ...(record.type === "Standard" ? [["Purchase From", resolvePurchaseFrom(record)] as [string, string]] : []),
              ["ICCID", record.iccid],
              ["Vendor Source Package Code", record.vendorCode],
              ["Purchased Date / Time", formatDate(record.purchasedDate)],
            ] as [string, string][]}
          </Section>

          {/* Payment Details — rendered directly to allow the Parent Order ID link */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Payment Details</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs text-slate-500 shrink-0">Order ID</span>
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-800">{record.orderId}</span>
                  {parentRecord && (
                    <button
                      className="block text-xs text-blue-500 hover:text-blue-700 hover:underline mt-0.5 ml-auto"
                      onClick={(e) => { e.stopPropagation(); onOpenOrder(parentRecord); }}
                    >
                      Parent: {record.parentOrderId}
                    </button>
                  )}
                </div>
              </div>
              {([
                ["Payment Date / Time", formatDate(record.paymentDate)],
                ["Payment Method", record.paymentMethod],
                ["Subtotal", record.subtotal],
                ["Total", record.total],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Status Log</h4>
            <div className="space-y-2">
              {[...record.statusLog].reverse().map((entry, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl">
                  <StatusBadge status={entry.status} variant="esim" />
                  <span className="text-xs text-slate-500 shrink-0">{formatDate(entry.dateTime)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ESIM_HEADERS = [
  "User Account", "Order ID", "Type", "Product Name", "Data", "Duration",
  "Purchased Date/Time", "Status",
];

function esimCSVRow(r: ES): string[] {
  const specs = parseProductSpecs(r.productName);
  return [
    r.user, r.orderId, r.type, r.productName,
    specs.data, specs.duration,
    formatDate(r.purchasedDate), r.status,
  ];
}

function esimXLSXRow(r: ES): (string | number | Date | null)[] {
  const specs = parseProductSpecs(r.productName);
  return [
    r.user, r.orderId, r.type, r.productName,
    specs.data, specs.duration,
    parseExcelDate(r.purchasedDate) as Date | string, r.status,
  ];
}

export function ESim() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<ES | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("purchasedDate");
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

  const filtered = mockEsim.filter((r) => {
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
      {selected && <DetailModal record={selected} onClose={() => setSelected(null)} onOpenOrder={(r) => setSelected(r)} />}

      <MiniDash />

      <FilterBar
        showSearch
        searchableFields={["Order ID", "Email"]}
        showPeriod
        showExport
        exportDisabled={sorted.length === 0}
        onExportCSV={() => exportCSV(ESIM_HEADERS, sorted.map(esimCSVRow), `esim-${exportDateTag()}.csv`)}
        onExportXLSX={() => exportXLSX(ESIM_HEADERS, sorted.map(esimXLSXRow), `esim-${exportDateTag()}.xlsx`)}
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
          <table className="w-full table-fixed text-sm" style={{ minWidth: "1020px" }}>
            <colgroup>
              {/* Fixed column widths — intentional, do not remove */}
              <col style={{ width: "160px" }} />{/* User Account */}
              <col style={{ width: "120px" }} />{/* Order ID */}
              <col style={{ width: "100px" }} />{/* Type */}
              <col style={{ width: "180px" }} />{/* Product Name */}
              <col style={{ width: "80px" }} />{/* Data */}
              <col style={{ width: "90px" }} />{/* Duration */}
              <col style={{ width: "160px" }} />{/* Purchased Date/Time */}
              <col style={{ width: "130px" }} />{/* Status */}
            </colgroup>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["User Account", "Order ID", "Type", "Product Name", "Data", "Duration"].map((h) => (
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
                  <td className="px-4 py-3 text-xs text-blue-600 font-medium truncate">{r.user}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.orderId}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    <TypeBadge type={r.type} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700 truncate">{r.productName}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{parseProductSpecs(r.productName).data}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{parseProductSpecs(r.productName).duration}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(r.purchasedDate)}</td>
                  <td className="sticky right-0 bg-white border-l border-slate-100 px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={r.status} variant="esim" />
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
