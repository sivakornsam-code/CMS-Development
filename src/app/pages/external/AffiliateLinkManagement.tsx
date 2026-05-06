import { useState } from "react";
import { X, Link2, MousePointerClick, UserCheck, ShoppingBag, TrendingUp } from "lucide-react";
import { mockAffiliateLinks, mockPartners, formatNumber } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { SortIndicator } from "../../components/ui/SortIndicator";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TablePagination } from "../../components/ui/TablePagination";
import { sortByStatus } from "../../components/ui/utils";

const PAGE_SIZE = 5;
const STATUS_PRIORITY = ["Active", "Inactive"];

type AffLink = typeof mockAffiliateLinks[0];

function MetricPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
      <div className="text-slate-500">{icon}</div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function LinkDetailModal({ link, onClose }: { link: AffLink; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h3 className="text-sm font-semibold text-slate-900">Affiliate Link Detail</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Overview</h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                ["Link Name", link.name],
                ["Partner", link.partner],
                ["Status", ""],
                ["Tracking Code", link.code],
                ["Affiliate URL", link.url],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  {label === "Status" ? (
                    <StatusBadge status={link.status} />
                  ) : label === "Affiliate URL" ? (
                    <a href="#" className="text-xs text-blue-600 hover:underline text-right break-all">{value}</a>
                  ) : (
                    <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-2">
              <MetricPill icon={<MousePointerClick size={14} />} label="Clicks" value={formatNumber(link.clicks)} />
              <MetricPill icon={<UserCheck size={14} />} label="Registrations" value={formatNumber(link.registrations)} />
              <MetricPill icon={<ShoppingBag size={14} />} label="Purchases" value={formatNumber(link.purchases)} />
              <MetricPill icon={<TrendingUp size={14} />} label="Conversion Rate" value={`${link.conversionRate}%`} />
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="w-full py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">Close</button>
        </div>
      </div>
    </div>
  );
}

function CreateLinkModal({ onClose, onSave }: { onClose: () => void; onSave: (v: Partial<AffLink>) => void }) {
  const [name, setName] = useState("");
  const [partner, setPartner] = useState("");
  const [status, setStatus] = useState("Active");
  const autoCode = name && partner ? `${partner.slice(0, 4).toUpperCase()}-${name.replace(/\s+/g, "").slice(0, 3).toUpperCase()}-${(mockAffiliateLinks.length + 1).toString().padStart(3, "0")}` : "AUTO-GENERATED";
  const autoUrl = autoCode !== "AUTO-GENERATED" ? `https://app.thaipass.com/ref/${autoCode}` : "Auto-generated";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h3 className="text-sm font-semibold text-slate-900">Create Affiliate Link</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Basic Info</p>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Link Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Homepage Banner"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Partner</label>
            <select value={partner} onChange={e => setPartner(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">— Select partner —</option>
              {mockPartners.map(p => <option key={p.id} value={p.code}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Status</label>
            <div className="flex gap-2">
              {["Active", "Inactive"].map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${status === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Tracking Setup</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Tracking Code</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
                  <span className="text-xs text-slate-500 font-mono flex-1">{autoCode}</span>
                  <span className="text-xs text-slate-400 italic">Auto-generated</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Affiliate URL</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
                  <span className="text-xs text-slate-500 flex-1 break-all">{autoUrl}</span>
                  <span className="text-xs text-slate-400 italic shrink-0">Auto-generated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-5 py-4 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => {
            onSave({ name, partner: mockPartners.find(p => p.code === partner)?.name || partner, status, code: autoCode, url: autoUrl, clicks: 0, registrations: 0, purchases: 0, conversionRate: 0 });
            onClose();
          }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
            Create Link
          </button>
        </div>
      </div>
    </div>
  );
}

export function AffiliateLinkManagement() {
  const [links, setLinks] = useState(mockAffiliateLinks);
  const [search, setSearch] = useState("");
  const [viewLink, setViewLink] = useState<AffLink | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [sortActive, setSortActive] = useState(false);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function handleSortStatus() {
    if (sortActive) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortActive(true);
      setSortDir("asc");
    }
    setPage(1);
  }

  const filtered = links.filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.partner.toLowerCase().includes(search.toLowerCase()));
  const sorted = sortActive ? sortByStatus(filtered, "status", STATUS_PRIORITY, sortDir) : filtered;
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {viewLink && <LinkDetailModal link={viewLink} onClose={() => setViewLink(null)} />}
      {showCreate && <CreateLinkModal onClose={() => setShowCreate(false)} onSave={(v) => {
        const newLink = { id: `AL00${links.length + 1}`, ...v } as AffLink;
        setLinks([newLink, ...links]);
      }} />}

      <FilterBar
        showSearch
        searchableFields={["Name", "Partner"]}
        showPeriod={false}
        showCreate
        createLabel="Create Link"
        onSearch={(q) => { setSearch(q); setPage(1); }}
        onCreate={() => setShowCreate(true)}
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Link Name", "Partner", "Tracking Code", "Clicks", "Registrations", "Purchases", "Conv. Rate"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="sticky right-24 bg-slate-50 border-l border-slate-100 z-10 text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-slate-600" onClick={handleSortStatus}>
                  <span className="inline-flex items-center gap-1">Status<SortIndicator active={sortActive} direction={sortDir} /></span>
                </th>
                <th className="sticky right-0 w-24 bg-slate-50 border-l border-slate-100 z-10 text-right text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((l) => (
                <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">{l.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{l.partner}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{l.code}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{formatNumber(l.clicks)}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{formatNumber(l.registrations)}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{formatNumber(l.purchases)}</td>
                  <td className="px-4 py-3 text-xs font-medium text-emerald-600">{l.conversionRate}%</td>
                  <td className="sticky right-24 bg-white border-l border-slate-100 px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="sticky right-0 w-24 bg-white border-l border-slate-100 px-4 py-3 text-right">
                    <button className="text-xs text-blue-600 hover:underline" onClick={() => setViewLink(l)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No links found</div>}
        <TablePagination total={filtered.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  );
}
