import { useState } from "react";
import { X, Handshake } from "lucide-react";
import { mockPartners } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { SortIndicator } from "../../components/ui/SortIndicator";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination } from "../../components/ui/TablePagination";
import { formatDate, sortByStatus, sortByDatetime } from "../../components/ui/utils";

const PAGE_SIZE = 5;
const STATUS_PRIORITY = ["Active", "Inactive"];
type SortKey = "status" | "created" | "updated";
type SortDir = "asc" | "desc";

type Partner = typeof mockPartners[0];

const attributionTypes = ["First touch", "Last touch", "Linear"];
const attributionDurations = ["Lifetime", "First purchase", "Product base", "Time-based"];

function PartnerForm({ partner, onClose, onSave, title }: {
  partner?: Partner; onClose: () => void; onSave: (v: Partial<Partner>) => void; title: string;
}) {
  const [form, setForm] = useState<Partial<Partner>>(partner || {
    name: "", code: "", contact: "", email: "", phone: "", status: "Active", attribution: "First touch", duration: "Lifetime",
  });
  const [notes, setNotes] = useState("");
  const set = (k: keyof Partner, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Basic Info</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Name", key: "name", placeholder: "Partner name" },
              { label: "Partner Code", key: "code", placeholder: "e.g. ITTT" },
              { label: "Contact Person", key: "contact", placeholder: "Full name" },
              { label: "Contact Email", key: "email", placeholder: "email@example.com" },
              { label: "Contact Phone", key: "phone", placeholder: "+xx-xxx-xxx-xxxx" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className={key === "name" || key === "email" ? "col-span-2" : ""}>
                <label className="text-xs font-medium text-slate-600 block mb-1">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={(form as Record<string, string>)[key] || ""}
                  onChange={(e) => set(key as keyof Partner, e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Status</label>
            <div className="flex gap-2">
              {["Active", "Inactive"].map((s) => (
                <button key={s} onClick={() => set("status", s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${form.status === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Internal Notes</label>
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add internal notes..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Attribution Setup</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">Attribution Type</label>
                <select value={form.attribution} onChange={(e) => set("attribution", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {attributionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <p className="text-xs text-slate-400 mt-1">How attribution is credited to this partner</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">Attribution Duration</label>
                <select value={form.duration} onChange={(e) => set("duration", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {attributionDurations.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <p className="text-xs text-slate-400 mt-1">How long this partner owns the user</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-5 py-4 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
            {partner ? "Save Changes" : "Create Partner"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PartnerDetailModal({ partner, onClose, onEdit }: { partner: Partner; onClose: () => void; onEdit: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h3 className="text-sm font-semibold text-slate-900">Partner Detail</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Handshake size={18} className="text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{partner.name}</p>
              <p className="text-xs text-slate-400">{partner.code}</p>
            </div>
            <div className="ml-auto"><StatusBadge status={partner.status} /></div>
          </div>
          {[
            ["Partner Code", partner.code],
            ["Contact Person", partner.contact],
            ["Contact Email", partner.email],
            ["Contact Phone", partner.phone],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <span className="text-xs text-slate-500">{label}</span>
              <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Attribution</p>
            {[
              ["Attribution Type", partner.attribution],
              ["Attribution Duration", partner.duration],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4 mt-2">
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Affiliate Links</p>
            <div className="text-xs text-slate-400 italic">View in Affiliate Link Management</div>
          </div>
          {[
            ["Created", formatDate(partner.created)],
            ["Last Updated", formatDate(partner.updated)],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <span className="text-xs text-slate-500">{label}</span>
              <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 px-5 py-4 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">Close</button>
          <button onClick={onEdit} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">Edit Partner</button>
        </div>
      </div>
    </div>
  );
}

export function PartnerManagement() {
  const [partners, setPartners] = useState(mockPartners);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [viewPartner, setViewPartner] = useState<Partner | null>(null);
  const [editPartner, setEditPartner] = useState<Partner | null>(null);
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

  const filtered = partners.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = !sortKey ? filtered
    : sortKey === "status" ? sortByStatus(filtered, "status", STATUS_PRIORITY, sortDir)
    : sortByDatetime(filtered, sortKey, sortDir);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {showCreate && <PartnerForm title="Create Partner" onClose={() => setShowCreate(false)} onSave={(v) => {
        const newP = { ...v, id: `P00${partners.length + 1}`, created: new Date().toISOString().slice(0, 16).replace("T", " "), updated: new Date().toISOString().slice(0, 16).replace("T", " ") } as Partner;
        setPartners([newP, ...partners]);
      }} />}
      {viewPartner && !editPartner && <PartnerDetailModal partner={viewPartner} onClose={() => setViewPartner(null)} onEdit={() => { setEditPartner(viewPartner); setViewPartner(null); }} />}
      {editPartner && <PartnerForm title="Edit Partner" partner={editPartner} onClose={() => setEditPartner(null)} onSave={(v) => {
        setPartners(partners.map((p) => p.id === editPartner.id ? { ...p, ...v } : p));
      }} />}

      <FilterBar
        showSearch
        searchPlaceholder="Search partner name..."
        showPeriod
        showCreate
        createLabel="Create Partner"
        onSearch={(q) => { setSearch(q); setPage(1); }}
        onCreate={() => setShowCreate(true)}
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <span className="text-xs text-slate-500">{filtered.length} partners</span>
        </div>
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Code", "Name", "Contact", "Attribution", "Duration"].map(h => (
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
              {paginated.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{p.code}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">{p.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{p.contact}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{p.attribution}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{p.duration}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(p.created)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(p.updated)}</td>
                  <td className="sticky right-24 bg-white border-l border-slate-100 px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="sticky right-0 w-24 bg-white border-l border-slate-100 px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-xs text-slate-600 hover:text-blue-600" onClick={() => setViewPartner(p)}>View</button>
                      <button className="text-xs text-blue-600 hover:underline" onClick={() => setEditPartner(p)}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No partners found</div>}
        <TablePagination total={filtered.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  );
}
