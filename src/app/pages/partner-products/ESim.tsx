import { useState } from "react";
import { X, DollarSign, ShoppingBag, Wifi, TrendingUp } from "lucide-react";
import { mockEsim } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination } from "../../components/ui/TablePagination";

const PAGE_SIZE = 5;

type ES = typeof mockEsim[0];

const ALL_STATUSES = ["Processing", "Not installed", "Inactive", "Active", "Out of data", "Expired"];

function MiniDash() {
  const totalRevenue = mockEsim.reduce((sum, r) => {
    return sum + parseFloat(r.total.replace(/,/g, "").replace(" THB", ""));
  }, 0);

  const totalOrders = mockEsim.length;

  const bundleOrders = mockEsim.filter((r) => r.purchaseFrom === "Bundle");
  const directOrders = mockEsim.filter((r) => r.purchaseFrom === "Direct");
  const directStandard = directOrders.filter((r) => !r.productName.toLowerCase().includes("top-up"));
  const directTopup = directOrders.filter((r) => r.productName.toLowerCase().includes("top-up"));

  const bundleByName: Record<string, number> = {};
  bundleOrders.forEach((r) => {
    if (r.bundleName) bundleByName[r.bundleName] = (bundleByName[r.bundleName] || 0) + 1;
  });

  const installedStatuses = new Set(["Inactive", "Active", "Out of data", "Expired"]);
  const totalInstalled = mockEsim.filter((r) => installedStatuses.has(r.status)).length;

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
            <p className="text-xl font-semibold text-slate-900 mt-0.5">฿{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-0.5">All eSIM transactions</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <ShoppingBag size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total eSIM Orders</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">{totalOrders}</p>
            <p className="text-xs text-slate-400 mt-0.5">Number of orders</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
            <Wifi size={16} className="text-violet-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total eSIM Installed</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">{totalInstalled}</p>
            <p className="text-xs text-slate-400 mt-0.5">Activated on device</p>
          </div>
        </div>
      </div>

      {/* Row 2 – list cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* eSIM Package Orders Count */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag size={13} className="text-blue-600" />
            <p className="text-xs font-semibold text-slate-700">eSIM Package Orders Count</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Bundle</span>
              <span className="font-semibold text-slate-800">{bundleOrders.length}</span>
            </div>
            {Object.entries(bundleByName).map(([name, count]) => (
              <div key={name} className="flex justify-between text-xs pl-3">
                <span className="text-slate-400">{name}</span>
                <span className="text-slate-600">{count}</span>
              </div>
            ))}
            <div className="border-t border-slate-100 my-1" />
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Direct – Standard</span>
              <span className="font-semibold text-slate-800">{directStandard.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Direct – Top-up</span>
              <span className="font-semibold text-slate-800">{directTopup.length}</span>
            </div>
          </div>
        </div>

        {/* Top 5 Most Purchased */}
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

function DetailModal({ record, onClose }: { record: ES; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">eSIM Detail</h3>
            <p className="text-xs text-slate-500">{record.orderId}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Status</span>
            <StatusBadge status={record.status} />
          </div>

          <Section title="eSIM Details">
            {[
              ["User Account", record.user],
              ["Product Name", record.productName],
              ["Purchase From", record.purchaseFrom === "Bundle" ? `Bundle — ${record.bundleName}` : "Direct"],
              ["ICCID", record.iccid],
              ["Vendor Source Package Code", record.vendorCode],
              ["Purchased Date / Time", record.purchasedDate],
            ]}
          </Section>

          <Section title="Payment Details">
            {[
              ["Order ID", record.orderId],
              ["Payment Date / Time", record.paymentDate],
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
                  <span className="text-xs text-slate-500 mt-0.5">{entry.dateTime}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ESim() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<ES | null>(null);
  const [page, setPage] = useState(1);

  const filtered = mockEsim.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.orderId.toLowerCase().includes(q) ||
      r.user.toLowerCase().includes(q);
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <span className="text-xs text-slate-500">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["User Account", "Order ID", "Product Name", "Purchase From", "Purchased Date/Time"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="sticky right-0 bg-slate-50 border-l border-slate-100 z-10 text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => (
                <tr key={r.orderId} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => setSelected(r)}>
                  <td className="px-4 py-3 text-xs text-blue-600 font-medium whitespace-nowrap">{r.user}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.orderId}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{r.productName}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                    {r.purchaseFrom === "Bundle" ? `Bundle — ${r.bundleName}` : "Direct"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{r.purchasedDate}</td>
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
