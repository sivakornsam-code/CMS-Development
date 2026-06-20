import { useState } from "react";
import { X, Building2 } from "lucide-react";
import { mockVendors } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { ComingSoonOverlay } from "../../components/ui/ComingSoonOverlay";
import { SortIndicator } from "../../components/ui/SortIndicator";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination } from "../../components/ui/TablePagination";
import { formatDate, sortByStatus, sortByDatetime } from "../../components/ui/utils";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

const PAGE_SIZE = 5;
const STATUS_PRIORITY = ["Active", "Inactive"];
type SortKey = "status" | "created" | "updated";
type SortDir = "asc" | "desc";

type Vendor = typeof mockVendors[0];

const emptyVendor: Omit<Vendor, "id" | "created" | "updated"> = {
  name: "", code: "", contact: "", email: "", phone: "", status: "Active",
};

function VendorForm({ vendor, onClose, onSave, title }: {
  vendor?: Vendor; onClose: () => void; onSave: (v: Partial<Vendor>) => void; title: string;
}) {
  useBodyScrollLock();
  const [form, setForm] = useState<Partial<Vendor>>(vendor || { ...emptyVendor });
  const [notes, setNotes] = useState("");

  const set = (k: keyof Vendor, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Basic Info</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Name", key: "name", placeholder: "Vendor name" },
              { label: "Vendor Code", key: "code", placeholder: "e.g. BAS" },
              { label: "Contact Person", key: "contact", placeholder: "Full name" },
              { label: "Contact Email", key: "email", placeholder: "email@example.com" },
              { label: "Contact Phone", key: "phone", placeholder: "+66-xx-xxx-xxxx" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className={key === "name" || key === "email" ? "col-span-2" : ""}>
                <label className="text-xs font-medium text-slate-600 block mb-1">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={(form as Record<string, string>)[key] || ""}
                  onChange={(e) => set(key as keyof Vendor, e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Status</label>
            <div className="flex gap-2">
              {["Active", "Inactive"].map((s) => (
                <button
                  key={s}
                  onClick={() => set("status", s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    form.status === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Internal Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-2 px-5 py-4 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 cursor-pointer">
            {vendor ? "Save Changes" : "Create Vendor"}
          </button>
        </div>
      </div>
    </div>
  );
}

function VendorDetailModal({ vendor, onClose, onEdit }: { vendor: Vendor; onClose: () => void; onEdit: () => void }) {
  useBodyScrollLock();
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Vendor Detail</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Building2 size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{vendor.name}</p>
              <p className="text-xs text-slate-400">{vendor.code}</p>
            </div>
            <div className="ml-auto"><StatusBadge status={vendor.status} /></div>
          </div>
          {[
            ["Vendor Code", vendor.code],
            ["Contact Person", vendor.contact],
            ["Contact Email", vendor.email],
            ["Contact Phone", vendor.phone],
            ["Created", formatDate(vendor.created)],
            ["Last Updated", formatDate(vendor.updated)],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <span className="text-xs text-slate-500">{label}</span>
              <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 px-5 py-4 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">Close</button>
          <button onClick={onEdit} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 cursor-pointer">Edit Vendor</button>
        </div>
      </div>
    </div>
  );
}

export function VendorManagement() {
  const [vendors, setVendors] = useState(mockVendors);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null);
  const [editVendor, setEditVendor] = useState<Vendor | null>(null);
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

  const filtered = vendors.filter((v) =>
    !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.code.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = !sortKey ? filtered
    : sortKey === "status" ? sortByStatus(filtered, "status", STATUS_PRIORITY, sortDir)
    : sortByDatetime(filtered, sortKey, sortDir);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <ComingSoonOverlay title="Vendor Management" description="Vendor management is coming in Phase 1.">
    <div>
      {showCreate && (
        <VendorForm title="Create Vendor" onClose={() => setShowCreate(false)} onSave={(v) => {
          const newV = { ...v, id: `V${vendors.length + 1}`.padStart(4, "0"), created: new Date().toISOString().slice(0, 16).replace("T", " "), updated: new Date().toISOString().slice(0, 16).replace("T", " ") } as Vendor;
          setVendors([newV, ...vendors]);
        }} />
      )}
      {viewVendor && !editVendor && (
        <VendorDetailModal vendor={viewVendor} onClose={() => setViewVendor(null)} onEdit={() => { setEditVendor(viewVendor); setViewVendor(null); }} />
      )}
      {editVendor && (
        <VendorForm title="Edit Vendor" vendor={editVendor} onClose={() => setEditVendor(null)} onSave={(v) => {
          setVendors(vendors.map((vnd) => vnd.id === editVendor.id ? { ...vnd, ...v } : vnd));
        }} />
      )}

      <FilterBar
        showSearch
        searchableFields={["Name", "Code"]}
        showPeriod
        showCreate
        createLabel="Create Vendor"
        onSearch={(q) => { setSearch(q); setPage(1); }}
        onCreate={() => setShowCreate(true)}
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Vendor Code", "Name", "Contact", "Email"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("created")}>
                  <span className="inline-flex items-center gap-1">Created<SortIndicator active={sortKey === "created"} direction={sortDir} /></span>
                </th>
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("updated")}>
                  <span className="inline-flex items-center gap-1">Updated<SortIndicator active={sortKey === "updated"} direction={sortDir} /></span>
                </th>
                <th className="sticky right-24 bg-slate-50 border-l border-slate-100 z-10 text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort("status")}>
                  <span className="inline-flex items-center gap-1">Status<SortIndicator active={sortKey === "status"} direction={sortDir} /></span>
                </th>
                <th className="sticky right-0 w-24 bg-slate-50 border-l border-slate-100 z-10 text-right text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((v) => (
                <tr key={v.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{v.code}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">{v.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{v.contact}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{v.email}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(v.created)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(v.updated)}</td>
                  <td className="sticky right-24 bg-white border-l border-slate-100 px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="sticky right-0 w-24 bg-white border-l border-slate-100 px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-xs text-slate-600 hover:text-blue-600 cursor-pointer" onClick={() => setViewVendor(v)}>View</button>
                      <button className="text-xs text-blue-600 hover:underline cursor-pointer" onClick={() => setEditVendor(v)}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No vendors found</div>}
        <TablePagination total={filtered.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
    </ComingSoonOverlay>
  );
}
