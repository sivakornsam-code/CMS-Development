import { useState } from "react";
import { X, Download } from "lucide-react";
import { mockOrders } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";

function OrderDetailModal({ order, onClose }: { order: typeof mockOrders[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Order Detail</h3>
            <p className="text-xs text-slate-500">{order.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Product Detail</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                ["Order ID", order.id],
                ["Category", order.category],
                ["Product Name", order.product],
                ["Amount", order.amount],
                ["User Account", order.user],
                ["User Type", order.userType],
                ["Partner Source", order.partner],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Payment Detail</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                ["Transaction ID", "TXN-" + order.id.replace("ORD-", "")],
                ["Total Paid", order.total],
                ["Payment Method", "Credit Card"],
                ["Payment Date", order.created],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderTransaction() {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");

  const filtered = mockOrders.filter((o) => {
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.user.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || o.category === categoryFilter;
    const matchType = !userTypeFilter || o.userType === userTypeFilter;
    return matchSearch && matchCat && matchType;
  });

  return (
    <div>
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}

      <FilterBar
        showSearch
        searchPlaceholder="Search Order ID or email..."
        showPeriod
        showExport
        onSearch={setSearch}
        extraFilters={
          <>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {["Bundle", "Transport", "eSIM", "Insurance", "Airport Service", "Coupons"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All User Types</option>
              <option value="Organic">Organic</option>
              <option value="Affiliate">Affiliate</option>
            </select>
          </>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">{filtered.length} transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Order ID", "User Account", "Category", "Product", "Amount", "Total Paid", "User Type", "Partner Source", "Created", "Updated"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer"
                  onClick={() => setSelectedOrder(o)}
                >
                  <td className="px-4 py-3 text-xs text-blue-600 font-medium whitespace-nowrap">{o.id}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{o.user}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{o.category}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{o.product}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{o.amount}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800 whitespace-nowrap">{o.total}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={o.userType} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{o.partner}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{o.created}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{o.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No transactions found</div>
        )}
      </div>
    </div>
  );
}
