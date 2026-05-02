import { useState } from "react";
import { X, Tag, Upload, Plus } from "lucide-react";
import { mockVouchers, mockProducts } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination } from "../../components/ui/TablePagination";

const PAGE_SIZE = 5;

type Voucher = typeof mockVouchers[0];

const actionTypes = ["Issue Product + Voucher", "Issue Voucher", "Track Only"];

function VoucherDetailModal({ voucher, onClose, onEdit }: { voucher: Voucher; onClose: () => void; onEdit: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Voucher Component Detail</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Overview</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Tag size={16} className="text-violet-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{voucher.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{voucher.code}</p>
                </div>
                <StatusBadge status={voucher.status} />
              </div>
              {[
                ["Display Name", voucher.name],
                ["Short Description", `${voucher.source} voucher component`],
                ["Action Type", voucher.actionType],
                ["Status", ""],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  {label === "Status" ? <StatusBadge status={voucher.status} /> : <span className="text-xs font-medium text-slate-800 text-right">{value}</span>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Source Configuration</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                ["Source Type", "Existing Internal"],
                ["Linked Product", voucher.source],
                ["Mini App", voucher.actionType === "Issue Product + Voucher" ? "eSIM / FastPass" : "-"],
                ["Wallet Voucher", voucher.actionType === "Issue Voucher" ? "Yes" : "No"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Configurations</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                ["Quantity", "1"],
                ["Validity", "30 days"],
                ["Usage Restriction", voucher.actionType === "Issue Voucher" ? "Yes — Transport" : "No"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Linked Products</h4>
            <div className="space-y-1.5">
              {["ThaiPass Lite", "ThaiPass Plus", "ThaiPass Pro"].map(name => (
                <div key={name} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-5 py-4 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">Close</button>
          <button onClick={onEdit} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">Edit Voucher</button>
        </div>
      </div>
    </div>
  );
}

function VoucherFormModal({ voucher, onClose, onSave, title }: {
  voucher?: Voucher; onClose: () => void; onSave: (v: Partial<Voucher>) => void; title: string;
}) {
  const [form, setForm] = useState({ name: voucher?.name || "", code: voucher?.code || "", status: voucher?.status || "Active", actionType: voucher?.actionType || "Issue Voucher" });
  const [desc, setDesc] = useState("");
  const [sourceProduct, setSourceProduct] = useState(voucher?.source || "");
  const [qty, setQty] = useState("1");
  const [validity, setValidity] = useState("30");
  const [restriction, setRestriction] = useState("No");

  const autoCode = form.name ? `VC-${form.name.replace(/\s+/g, "").slice(0, 6).toUpperCase()}` : "";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Basic Info</p>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Code (unique ID)</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
              <span className="text-xs text-slate-500 font-mono flex-1">{autoCode || "Auto-generated from name"}</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Display Name</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Transportation (500 THB Discount)"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Short Description</label>
            <textarea rows={2} value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. 500 THB discount for transport services"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Upload Icon</label>
            <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <Upload size={14} className="text-slate-400 mb-1" />
              <span className="text-xs text-slate-400">Upload icon image</span>
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Status</label>
            <div className="flex gap-2">
              {["Active", "Inactive"].map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${form.status === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Action Type</label>
            <div className="space-y-2">
              {actionTypes.map(a => (
                <label key={a} className="flex items-start gap-2 cursor-pointer">
                  <input type="radio" name="vaction" value={a} checked={form.actionType === a} onChange={() => setForm(f => ({ ...f, actionType: a }))} className="mt-0.5" />
                  <div>
                    <span className="text-xs font-medium text-slate-700">{a}</span>
                    <p className="text-xs text-slate-400">
                      {a === "Issue Product + Voucher" && "Select Mini App destination"}
                      {a === "Issue Voucher" && "Generates coupon in user wallet"}
                      {a === "Track Only" && "Mark in backend only"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Source Configuration</p>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Select Source Product</label>
              <select value={sourceProduct} onChange={e => setSourceProduct(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">— Select product —</option>
                {mockProducts.map(p => <option key={p.id} value={p.name}>{p.name} ({p.code})</option>)}
              </select>
              <p className="text-xs text-slate-400 mt-1">Product should be set as "Not Display / No selling price"</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Configuration Settings</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Quantity</label>
                <input type="number" value={qty} onChange={e => setQty(e.target.value)} min="1"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Validity (days)</label>
                <input type="number" value={validity} onChange={e => setValidity(e.target.value)} min="1"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {form.actionType === "Issue Voucher" && (
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Usage Restriction</label>
                  <div className="flex gap-2 mb-2">
                    {["Yes", "No"].map(v => (
                      <button key={v} onClick={() => setRestriction(v)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${restriction === v ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                  {restriction === "Yes" && (
                    <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Transport</option>
                      <option>eSIM</option>
                      <option>Insurance</option>
                      <option>Airport Service</option>
                    </select>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-5 py-4 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => { onSave({ ...form, code: autoCode, source: sourceProduct }); onClose(); }}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
            {voucher ? "Save Changes" : "Create Voucher"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function VoucherComponent() {
  const [vouchers, setVouchers] = useState(mockVouchers);
  const [search, setSearch] = useState("");
  const [viewVoucher, setViewVoucher] = useState<Voucher | null>(null);
  const [editVoucher, setEditVoucher] = useState<Voucher | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = vouchers.filter(v => !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.code.toLowerCase().includes(search.toLowerCase()));

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {viewVoucher && !editVoucher && <VoucherDetailModal voucher={viewVoucher} onClose={() => setViewVoucher(null)} onEdit={() => { setEditVoucher(viewVoucher); setViewVoucher(null); }} />}
      {editVoucher && <VoucherFormModal title="Edit Voucher Component" voucher={editVoucher} onClose={() => setEditVoucher(null)} onSave={(v) => setVouchers(vouchers.map(vo => vo.id === editVoucher.id ? { ...vo, ...v } : vo))} />}
      {showCreate && <VoucherFormModal title="Create Voucher Component" onClose={() => setShowCreate(false)} onSave={(v) => {
        const nv = { id: `VOU-00${vouchers.length + 1}`, ...v, updated: new Date().toISOString().slice(0, 16).replace("T", " "), created: new Date().toISOString().slice(0, 16).replace("T", " ") } as Voucher;
        setVouchers([nv, ...vouchers]);
      }} />}

      <FilterBar
        showSearch
        searchPlaceholder="Search voucher name or code..."
        showPeriod={false}
        showCreate
        createLabel="Create Voucher"
        onSearch={(q) => { setSearch(q); setPage(1); }}
        onCreate={() => setShowCreate(true)}
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <span className="text-xs text-slate-500">{filtered.length} voucher components</span>
        </div>
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Code", "Display Name", "Action Type", "Source Product", "Updated", "Created"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="sticky right-24 bg-slate-50 border-l border-slate-100 z-10 text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">Status</th>
                <th className="sticky right-0 w-24 bg-slate-50 border-l border-slate-100 z-10 text-right text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(v => (
                <tr key={v.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{v.code}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">{v.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{v.actionType}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{v.source}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{v.updated}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{v.created}</td>
                  <td className="sticky right-24 bg-white border-l border-slate-100 px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="sticky right-0 w-24 bg-white border-l border-slate-100 px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-xs text-slate-600 hover:text-blue-600" onClick={() => setViewVoucher(v)}>View</button>
                      <button className="text-xs text-blue-600 hover:underline" onClick={() => setEditVoucher(v)}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No voucher components found</div>}
        <TablePagination total={filtered.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  );
}
