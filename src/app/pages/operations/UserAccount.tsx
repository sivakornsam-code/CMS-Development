import { useState } from "react";
import { X, ShoppingCart, DollarSign, Activity, AlertCircle, Check } from "lucide-react";
import { mockUsers, mockOrders } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { FilterDropdown } from "../../components/ui/FilterDropdown";
import { SortIndicator } from "../../components/ui/SortIndicator";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination, PAGE_SIZE } from "../../components/ui/TablePagination";
import { formatDate, sortByStatusWithDate, sortByDatetime } from "../../components/ui/utils";
const STATUS_PRIORITY = ["Active", "Inactive"];
type SortKey = "status" | "registered";
type SortDir = "asc" | "desc";

type User = typeof mockUsers[0] & { status: string };

const userOrders = (email: string) => mockOrders.filter((o) => o.user === email);


function InactivateConfirmDialog({
  user,
  onConfirm,
  onCancel,
}: {
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <AlertCircle size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Inactivate Account</h3>
            <p className="text-xs text-slate-500 mt-0.5">This action will block app login</p>
          </div>
        </div>
        <p className="text-xs text-slate-600 mb-1">
          Are you sure you want to inactivate <span className="font-medium text-slate-900">{user.email}</span>?
        </p>
        <p className="text-xs text-slate-500 mb-5">
          The user will not be able to log in to the app. An error pop-up will be shown to them on login.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Inactivate
          </button>
        </div>
      </div>
    </div>
  );
}

function UserDetailModal({
  user,
  onClose,
  onStatusChange,
}: {
  user: User;
  onClose: () => void;
  onStatusChange: (email: string, status: string) => void;
}) {
  const orders = userOrders(user.email);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localStatus, setLocalStatus] = useState(user.status);
  const activityLog = [...orders]
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    .map((o) => ({ action: "Purchase" as const, product: o.product, date: o.created }));

  const parseTHB = (s: string) => parseFloat(s.replace(/,/g, "").replace(" THB", "")) || 0;
  const totalOrders = orders.length;
  const totalSpend = orders.reduce((sum, o) => sum + parseTHB(o.total), 0);
  const totalSpendFormatted = totalSpend.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " THB";

  function handleInactivate() {
    setLocalStatus("Inactive");
    onStatusChange(user.email, "Inactive");
    setShowConfirm(false);
  }

  function handleReactivate() {
    setLocalStatus("Active");
    onStatusChange(user.email, "Active");
  }

  return (
    <>
      {showConfirm && (
        <InactivateConfirmDialog
          user={user}
          onConfirm={handleInactivate}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
        <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">User Detail</h3>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {localStatus === "Active" ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <X size={12} /> Inactivate
                </button>
              ) : (
                <button
                  onClick={handleReactivate}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-emerald-200 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <Check size={12} /> Reactivate
                </button>
              )}
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">User Detail</h4>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                {[
                  ["Account Email", user.email],
                  ["Registered Date/Time", formatDate(user.registered)],
                  ["User Type", user.userType],
                  ["Partner Source", user.partner],
                  ["TDAC Status", user.tdac],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-xs text-slate-500 shrink-0">{label}</span>
                    <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                  </div>
                ))}
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">Account Status</span>
                  <StatusBadge status={localStatus} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Transaction Log — Summary
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <ShoppingCart size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Orders</p>
                    <p className="text-sm font-semibold text-slate-900">{totalOrders}</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <DollarSign size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Spending</p>
                    <p className="text-sm font-semibold text-slate-900">{totalSpendFormatted}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full table-fixed text-sm" style={{ minWidth: "420px" }}>
                  <colgroup>
                    {/* Fixed column widths — intentional, do not remove */}
                    <col style={{ width: "100px" }} />{/* Order ID */}
                    <col style={{ width: "90px" }} /> {/* Category */}
                    <col style={{ width: "140px" }} />{/* Product */}
                    <col style={{ width: "90px" }} /> {/* Total Paid */}
                  </colgroup>
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      {["Order ID", "Category", "Product", "Total Paid"].map((h) => (
                        <th key={h} className="text-left text-xs font-medium text-slate-400 px-3 py-2">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((o) => (
                        <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                          <td className="px-3 py-2 text-xs text-blue-600 font-medium">{o.id}</td>
                          <td className="px-3 py-2 text-xs text-slate-600">{o.category}</td>
                          <td className="px-3 py-2 text-xs text-slate-700">{o.product}</td>
                          <td className="px-3 py-2 text-xs text-slate-700 font-medium">{o.total}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-xs text-slate-400 text-center">
                          No orders from this user in current view
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                <span className="flex items-center gap-2">
                  <Activity size={13} />
                  Activity Log
                </span>
              </h4>
              <div className="space-y-2">
                {activityLog.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        a.action === "Purchase" ? "bg-blue-100" : "bg-emerald-100"
                      }`}
                    >
                      <span className="text-[10px] font-semibold">
                        {a.action === "Purchase" ? "P" : "U"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-slate-800">
                        {a.action} — <span className="text-slate-600">{a.product}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{formatDate(a.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function UserAccount() {
  const [users, setUsers] = useState(mockUsers.map((u) => ({ ...u })));
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tdacFilter, setTdacFilter] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("registered");
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

  function handleStatusChange(email: string, status: string) {
    setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, status } : u)));
    if (selectedUser?.email === email) {
      setSelectedUser((prev) => (prev ? { ...prev, status } : null));
    }
  }

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.email.toLowerCase().includes(search.toLowerCase());
    const matchType = !userTypeFilter || u.userType === userTypeFilter;
    const matchStatus = !statusFilter || u.status === statusFilter;
    const matchTdac = !tdacFilter || u.tdac === tdacFilter;
    return matchSearch && matchType && matchStatus && matchTdac;
  });

  const sorted = sortKey === "status"
    ? sortByStatusWithDate(filtered, "status", STATUS_PRIORITY, sortDir, "registered")
    : sortByDatetime(filtered, "registered", sortDir);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const parseTHBTable = (s: string) => parseFloat(s.replace(/,/g, "").replace(" THB", "")) || 0;
  const userStatsMap: Record<string, { orders: number; spend: string }> = {};
  for (const u of mockUsers) {
    const ords = mockOrders.filter((o) => o.user === u.email);
    const spend = ords.reduce((sum, o) => sum + parseTHBTable(o.total), 0);
    userStatsMap[u.email] = {
      orders: ords.length,
      spend: spend.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " THB",
    };
  }

  return (
    <div>
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <FilterBar
        showSearch
        searchableFields={["User Account"]}
        showPeriod
        onSearch={(q) => { setSearch(q); setPage(1); }}
        extraFilters={
          <>
            <FilterDropdown
              value={userTypeFilter}
              onChange={(value) => { setUserTypeFilter(value); setPage(1); }}
              placeholder="All User Types"
              options={[
                { label: "All User Types", value: "" },
                { label: "Organic", value: "Organic" },
                { label: "Affiliate", value: "Affiliate" },
              ]}
            />
            <FilterDropdown
              value={statusFilter}
              onChange={(value) => { setStatusFilter(value); setPage(1); }}
              placeholder="All Statuses"
              options={[
                { label: "All Statuses", value: "" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
            <FilterDropdown
              value={tdacFilter}
              onChange={(value) => { setTdacFilter(value); setPage(1); }}
              placeholder="All TDAC Status"
              options={[
                { label: "All TDAC Status", value: "" },
                { label: "Verified", value: "Verified" },
                { label: "Pending", value: "Pending" },
              ]}
            />
          </>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto relative">
          <table className="w-full table-fixed text-sm" style={{ minWidth: "930px" }}>
            <colgroup>
              {/* Fixed column widths — intentional, do not remove */}
              <col style={{ width: "200px" }} />{/* Email */}
              <col style={{ width: "90px" }} /> {/* Total Orders */}
              <col style={{ width: "90px" }} /> {/* Total Spend */}
              <col style={{ width: "90px" }} /> {/* User Type */}
              <col style={{ width: "120px" }} />{/* Partner Source */}
              <col style={{ width: "100px" }} />{/* TDAC Status */}
              <col style={{ width: "150px" }} />{/* Registered Date/Time */}
              <col style={{ width: "90px" }} /> {/* Status */}
            </colgroup>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["User Account", "Total Orders", "Total Spend", "User Type", "Partner Source", "TDAC Status"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("registered")}>
                  <span className="inline-flex items-center gap-1">Registered Date/Time<SortIndicator active={sortKey === "registered"} direction={sortDir} /></span>
                </th>
                <th className="sticky right-0 bg-slate-50 border-l border-slate-100 z-10 text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("status")}>
                  <span className="inline-flex items-center gap-1">Status<SortIndicator active={sortKey === "status"} direction={sortDir} /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((u) => (
                <tr
                  key={u.email}
                  className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer"
                  onClick={() => setSelectedUser(u)}
                >
                  <td className="px-4 py-3 text-xs text-blue-600 font-medium truncate">{u.email}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{userStatsMap[u.email]?.orders ?? 0}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">{userStatsMap[u.email]?.spend ?? "0 THB"}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.userType} /></td>
                  <td className="px-4 py-3 text-xs text-slate-600">{u.partner}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.tdac} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatDate(u.registered)}</td>
                  <td className="sticky right-0 bg-white border-l border-slate-100 px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={u.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No users found</div>}
        <TablePagination total={filtered.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  );
}
