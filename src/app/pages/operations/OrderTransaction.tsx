import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { useNavigate } from "react-router";
import { mockOrders, mockFastPass, mockTransportation, mockEsim, mockInsurance } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { FilterDropdown } from "../../components/ui/FilterDropdown";
import { SortIndicator } from "../../components/ui/SortIndicator";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination, PAGE_SIZE } from "../../components/ui/TablePagination";
import { formatDate, sortByStatusWithDate, sortByDatetime } from "../../components/ui/utils";
import { exportCSV, exportXLSX, parseExcelDate, exportDateTag } from "../../components/ui/exportUtils";
import { formatTHBString, parseTHBString, formatCurrencyExport } from "../../data/formatters";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
// userType is sorted by business priority, not alphabetically
const USER_TYPE_PRIORITY = ["Organic", "Affiliate"];
type SortKey = "userType" | "created" | "updated";
type SortDir = "asc" | "desc";

export function OrderDetailModal({ order, onClose, onBack, returnUserEmail }: { order: typeof mockOrders[0]; onClose: () => void; onBack?: () => void; returnUserEmail?: string | null }) {
  useBodyScrollLock();
  const navigate = useNavigate();
  const bc = (order as typeof mockOrders[0] & { bundleComponents?: { fastpassIds: string[]; esimIccids: string[]; insuranceRefIds: string[] } }).bundleComponents;

  function setReturnChain(productKey: string, productValue: string) {
    sessionStorage.setItem(productKey, productValue);
    sessionStorage.setItem("returnToOrderId", order.id);
    if (returnUserEmail) sessionStorage.setItem("returnToUserEmail", returnUserEmail);
  }

  function viewFastPass(fpId: string) {
    setReturnChain("openFastPassId", fpId);
    navigate("/partner-products/fastpass");
  }
  function viewEsim(iccid: string) {
    setReturnChain("openEsimIccid", iccid);
    navigate("/partner-products/esim");
  }
  function viewInsurance(refId: string) {
    setReturnChain("openInsuranceRefId", refId);
    navigate("/partner-products/insurance");
  }
  function viewTransport(bookingId: string) {
    setReturnChain("openTransportBookingId", bookingId);
    navigate("/partner-products/transportation");
  }

  const linkedItems: { label: string; id: string; onView: () => void }[] = (() => {
    if (order.category === "FastPass")
      return mockFastPass
        .filter((r) => r.orderId === order.id)
        .map((r) => ({ label: "FastPass", id: r.fastpassId, onView: () => viewFastPass(r.fastpassId) }));
    if (order.category === "eSIM")
      return mockEsim
        .filter((r) => r.orderId === order.id)
        .map((r) => ({ label: "eSIM", id: r.iccid, onView: () => viewEsim(r.iccid) }));
    if (order.category === "Insurance")
      return mockInsurance
        .filter((r) => r.orderId === order.id)
        .map((r) => ({ label: "Insurance", id: r.referenceId, onView: () => viewInsurance(r.referenceId) }));
    if (order.category === "Transport")
      return mockTransportation
        .filter((r) => r.orderId === order.id)
        .map((r) => ({ label: "Booking", id: r.bookingId, onView: () => viewTransport(r.bookingId) }));
    return [];
  })();

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="w-full sm:max-w-lg flex flex-col">
        {onBack && (
          <div className="px-4 sm:px-0 pb-2" onClick={(e) => e.stopPropagation()}>
            <button
              className="flex items-center gap-1.5 text-xs font-medium text-white/90 hover:text-white bg-black/25 hover:bg-black/40 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
              onClick={onBack}
            >
              ← Back to User
            </button>
          </div>
        )}
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full shadow-xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Order Detail</h3>
            <p className="text-xs text-slate-500">{order.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Product Detail</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                ["Order ID", order.id],
                ["Category", order.category],
                ["Product Name", order.product],
                ["Quantity", String(order.quantity)],
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

          {linkedItems.length > 0 && (
            <div className="space-y-2.5">
              {linkedItems.map((item) => (
                <button key={item.id} onClick={item.onView} className="w-full bg-slate-50 hover:bg-slate-100 rounded-xl px-4 py-3 flex items-center justify-between gap-4 transition-colors cursor-pointer">
                  <div className="min-w-0 text-left">
                    <span className="text-xs text-slate-500 block">{item.label}</span>
                    <span className="text-xs font-medium text-slate-800">{item.id}</span>
                  </div>
                  <span className="text-blue-600 shrink-0">→</span>
                </button>
              ))}
            </div>
          )}

          {order.category === "Bundle" && bc && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Bundle Components</h4>
              {bc.fastpassIds.length === 0 && bc.esimIccids.length === 0 && bc.insuranceRefIds.length === 0 ? (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 text-center py-1">No components linked</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {bc.fastpassIds.map((fpId, i) => {
                    const iccid = bc.esimIccids[i] ?? null;
                    const refId = bc.insuranceRefIds[i] ?? null;
                    return (
                      <div key={fpId} className="bg-slate-50 rounded-xl overflow-hidden">
                        <button onClick={() => viewFastPass(fpId)} className="w-full px-4 py-3 flex items-center justify-between gap-4 hover:bg-slate-100 transition-colors cursor-pointer">
                          <div className="min-w-0 text-left">
                            <span className="text-xs text-slate-500 block">FastPass</span>
                            <span className="text-xs font-medium text-slate-800">{fpId}</span>
                          </div>
                          <span className="text-blue-600 shrink-0">→</span>
                        </button>
                        {iccid && (
                          <button onClick={() => viewEsim(iccid)} className="w-full px-4 py-3 flex items-center justify-between gap-4 hover:bg-slate-100 transition-colors border-t border-slate-100 cursor-pointer">
                            <div className="min-w-0 text-left">
                              <span className="text-xs text-slate-500 block">eSIM</span>
                              <span className="text-xs font-medium text-slate-800">{iccid}</span>
                            </div>
                            <span className="text-blue-600 shrink-0">→</span>
                          </button>
                        )}
                        {refId && (
                          <button onClick={() => viewInsurance(refId)} className="w-full px-4 py-3 flex items-center justify-between gap-4 hover:bg-slate-100 transition-colors border-t border-slate-100 cursor-pointer">
                            <div className="min-w-0 text-left">
                              <span className="text-xs text-slate-500 block">Insurance</span>
                              <span className="text-xs font-medium text-slate-800">{refId}</span>
                            </div>
                            <span className="text-blue-600 shrink-0">→</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Payment Detail</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                ["Transaction ID", "TXN-" + order.id.replace("ORD-", "")],
                ["Subtotal", formatTHBString(order.subtotal)],
                ["Total Paid", formatTHBString(order.total)],
                ["Payment Method", "Credit Card"],
                ["Payment Date/Time", formatDate(order.created)],
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
    </div>
  );
}

type ORD = typeof mockOrders[0];

const ORD_HEADERS = [
  "Order ID", "User Account", "Category", "Product Name", "Quantity",
  "Total Paid (THB)", "User Type", "Partner Source", "Payment Date/Time", "Updated Date/Time",
];

function ordCSVRow(o: ORD): string[] {
  return [
    o.id, o.user, o.category, o.product,
    String(o.quantity), formatCurrencyExport(parseTHBString(o.total)), o.userType, o.partner,
    formatDate(o.created), formatDate(o.updated),
  ];
}

function ordXLSXRow(o: ORD): (string | number | Date | null)[] {
  return [
    o.id, o.user, o.category, o.product,
    o.quantity, formatCurrencyExport(parseTHBString(o.total)), o.userType, o.partner,
    parseExcelDate(o.created) as Date | string,
    parseExcelDate(o.updated) as Date | string,
  ];
}

export function OrderTransaction() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [returnUserEmail, setReturnUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("openOrderId");
    if (id) {
      sessionStorage.removeItem("openOrderId");
      const order = mockOrders.find((o) => o.id === id);
      if (order) setSelectedOrder(order);
    }
  }, []);

  useEffect(() => {
    const email = sessionStorage.getItem("returnToUserEmail");
    if (email) {
      sessionStorage.removeItem("returnToUserEmail");
      setReturnUserEmail(email);
    }
  }, []);

  function handleBackToUser() {
    sessionStorage.setItem("openUserEmail", returnUserEmail!);
    setReturnUserEmail(null);
    navigate("/operations/users");
  }
  const [categoryFilter, setCategoryFilter] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("created");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "userType" ? "asc" : "desc");
    }
    setPage(1);
  }

  const filtered = mockOrders.filter((o) => {
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.user.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || o.category === categoryFilter;
    const matchType = !userTypeFilter || o.userType === userTypeFilter;
    return matchSearch && matchCat && matchType;
  });
  const sorted = sortKey === "userType"
    ? sortByStatusWithDate(filtered, "userType", USER_TYPE_PRIORITY, sortDir, "created")
    : sortByDatetime(filtered, sortKey, sortDir);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => { setSelectedOrder(null); setReturnUserEmail(null); }} onBack={returnUserEmail ? handleBackToUser : undefined} returnUserEmail={returnUserEmail} />}

      <FilterBar
        showSearch
        searchableFields={["Order ID", "User Account"]}
        showPeriod
        showExport
        exportDisabled={sorted.length === 0}
        onExportCSV={() => exportCSV(ORD_HEADERS, sorted.map(ordCSVRow), `order-transaction-${exportDateTag()}.csv`)}
        onExportXLSX={() => exportXLSX(ORD_HEADERS, sorted.map(ordXLSXRow), `order-transaction-${exportDateTag()}.xlsx`)}
        onSearch={(q) => { setSearch(q); setPage(1); }}
        extraFilters={
          <>
            <FilterDropdown
              value={categoryFilter}
              onChange={(value) => { setCategoryFilter(value); setPage(1); }}
              placeholder="All Categories"
              options={[
                { label: "All Categories", value: "" },
                ...["Bundle", "Transport", "eSIM", "Insurance", "FastPass"].map((c) => ({ label: c, value: c })),
              ]}
            />
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
          </>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto relative">
          <table className="w-full table-fixed text-sm" style={{ minWidth: "1300px" }}>
            <colgroup>
              {/* Fixed column widths — intentional, do not remove */}
              <col style={{ width: "120px" }} />{/* Order ID */}
              <col style={{ width: "180px" }} />{/* User Account */}
              <col style={{ width: "100px" }} />{/* Category */}
              <col style={{ width: "200px" }} />{/* Product Name */}
              <col style={{ width: "80px" }} /> {/* Quantity */}
              <col style={{ width: "90px" }} /> {/* Total Paid */}
              <col style={{ width: "110px" }} />{/* User Type */}
              <col style={{ width: "120px" }} />{/* Partner Source */}
              <col style={{ width: "150px" }} />{/* Payment Date/Time */}
              <col style={{ width: "150px" }} />{/* Updated Date/Time */}
            </colgroup>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Order ID", "User Account", "Category", "Product Name", "Quantity", "Total Paid"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("userType")}>
                  <span className="inline-flex items-center gap-1">User Type<SortIndicator active={sortKey === "userType"} direction={sortDir} /></span>
                </th>
                {["Partner Source"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("created")}>
                  <span className="inline-flex items-center gap-1">Payment Date/Time<SortIndicator active={sortKey === "created"} direction={sortDir} /></span>
                </th>
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("updated")}>
                  <span className="inline-flex items-center gap-1">Updated Date/Time<SortIndicator active={sortKey === "updated"} direction={sortDir} /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer"
                  onClick={() => setSelectedOrder(o)}
                >
                  <td className="px-4 py-3 text-xs text-blue-600 font-medium whitespace-nowrap">{o.id}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 truncate">{o.user}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{o.category}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{o.product}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{o.quantity}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800 whitespace-nowrap">{formatTHBString(o.total)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={o.userType} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{o.partner}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(o.created)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(o.updated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No transactions found</div>
        )}
        <TablePagination total={filtered.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  );
}
