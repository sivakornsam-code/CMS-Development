import { useState } from "react";
import { X, ShoppingCart, DollarSign, Activity } from "lucide-react";
import { mockUsers, mockOrders } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";

const userOrders = (email: string) => mockOrders.filter((o) => o.user === email);

const activityLog = [
  { action: "Purchase", product: "ThaiPass Plus", date: "2025-04-24 09:32" },
  { action: "Used", product: "Airport Transfer", date: "2025-04-20 14:10" },
  { action: "Purchase", product: "eSIM 7D Standard", date: "2025-03-15 11:00" },
];

function UserDetailModal({ user, onClose }: { user: typeof mockUsers[0]; onClose: () => void }) {
  const orders = userOrders(user.email);
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">User Detail</h3>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* User Info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">User Detail</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                ["Email", user.email],
                ["Registered Date", user.registered],
                ["User Type", user.userType],
                ["Partner Source", user.partner],
                ["TDAC Status", user.tdac],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Summary */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Transaction Log — Summary</h4>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Orders</p>
                  <p className="text-sm font-semibold text-slate-900">{user.orders}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <DollarSign size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Spending</p>
                  <p className="text-sm font-semibold text-slate-900">{user.spend}</p>
                </div>
              </div>
            </div>

            {/* Transaction table */}
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {["Order ID", "Category", "Product", "Total Paid"].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-slate-400 px-3 py-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? orders.map((o) => (
                    <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                      <td className="px-3 py-2 text-xs text-blue-600 font-medium">{o.id}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{o.category}</td>
                      <td className="px-3 py-2 text-xs text-slate-700">{o.product}</td>
                      <td className="px-3 py-2 text-xs text-slate-700 font-medium">{o.total}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-xs text-slate-400 text-center">No orders from this user in current view</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Log */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              <span className="flex items-center gap-2"><Activity size={13} />Activity Log</span>
            </h4>
            <div className="space-y-2">
              {activityLog.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${a.action === "Purchase" ? "bg-blue-100" : "bg-emerald-100"}`}>
                    <span className="text-[10px] font-semibold">{a.action === "Purchase" ? "P" : "U"}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-slate-800">
                      {a.action} — <span className="text-slate-600">{a.product}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{a.date}</div>
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

export function UserAccount() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [tdacFilter, setTdacFilter] = useState("");

  const filtered = mockUsers.filter((u) => {
    const matchSearch = !search || u.email.toLowerCase().includes(search.toLowerCase());
    const matchType = !userTypeFilter || u.userType === userTypeFilter;
    const matchTdac = !tdacFilter || u.tdac === tdacFilter;
    return matchSearch && matchType && matchTdac;
  });

  return (
    <div>
      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

      <FilterBar
        showSearch
        searchPlaceholder="Search user email..."
        showPeriod
        onSearch={setSearch}
        extraFilters={
          <>
            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All User Types</option>
              <option value="Organic">Organic</option>
              <option value="Affiliate">Affiliate</option>
            </select>
            <select
              value={tdacFilter}
              onChange={(e) => setTdacFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All TDAC Status</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
            </select>
          </>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <span className="text-xs text-slate-500">{filtered.length} users</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Email", "Total Orders", "Total Spend", "User Type", "Partner Source", "TDAC Status", "Registered Date"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.email}
                  className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer"
                  onClick={() => setSelectedUser(u)}
                >
                  <td className="px-4 py-3 text-xs text-blue-600 font-medium">{u.email}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{u.orders}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">{u.spend}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.userType} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{u.partner}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.tdac} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{u.registered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
