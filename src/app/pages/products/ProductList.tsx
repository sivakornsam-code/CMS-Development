import { useState } from "react";
import { X, Package, Plus } from "lucide-react";
import { mockProducts } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";

type Product = typeof mockProducts[0];

const categories = ["Bundle", "Transport", "Airport Service", "eSIM", "Coupons", "Insurance"];
const actionTypes = ["Issue Product + Voucher", "Issue Voucher", "Track Only"];

const categoryColor: Record<string, string> = {
  Bundle: "bg-blue-50 text-blue-700",
  Transport: "bg-amber-50 text-amber-700",
  "Airport Service": "bg-violet-50 text-violet-700",
  eSIM: "bg-cyan-50 text-cyan-700",
  Coupons: "bg-rose-50 text-rose-700",
  Insurance: "bg-emerald-50 text-emerald-700",
};

function CategoryBadge({ cat }: { cat: string }) {
  const cls = categoryColor[cat] || "bg-slate-50 text-slate-600";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{cat}</span>;
}

function ProductDetailModal({ product, onClose, onEdit }: { product: Product; onClose: () => void; onEdit: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Product Detail</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{product.name}</p>
              <p className="text-xs text-slate-400 font-mono">{product.code}</p>
            </div>
            <StatusBadge status={product.status} />
          </div>
          {[
            ["Product Code", product.code],
            ["Category", product.category],
            ["Product Name", product.name],
            ["Short Description", "Premium bundle with multiple included services"],
            ["Action Type", "Issue Product + Voucher"],
            ["Price", "฿2,000"],
            ["Created", product.created],
            ["Updated", product.updated],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <span className="text-xs text-slate-500 shrink-0">{label}</span>
              <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 px-5 py-4 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">Close</button>
          <button onClick={onEdit} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">Edit Product</button>
        </div>
      </div>
    </div>
  );
}

function ProductFormModal({ product, onClose, onSave, title }: {
  product?: Product; onClose: () => void; onSave: (v: Partial<Product>) => void; title: string;
}) {
  const [form, setForm] = useState<Partial<Product>>(product || { category: "Bundle", name: "", code: "", status: "Display" });
  const [actionType, setActionType] = useState("Issue Product + Voucher");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const set = (k: keyof Product, v: string) => setForm(f => ({ ...f, [k]: v }));

  const isEdit = !!product;

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
            <label className="text-xs font-medium text-slate-600 block mb-1">Product Category</label>
            {isEdit ? (
              <div className="border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-xs text-slate-500">{form.category} (cannot change)</div>
            ) : (
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Product Name</label>
            <input type="text" value={form.name || ""} onChange={e => set("name", e.target.value)} placeholder="Enter product name"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Short Description</label>
            <textarea rows={2} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief product description"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Status</label>
            <div className="flex gap-2">
              {["Display", "Hide"].map(s => (
                <button key={s} onClick={() => set("status", s)}
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
                  <input type="radio" name="action" value={a} checked={actionType === a} onChange={() => setActionType(a)} className="mt-0.5" />
                  <div>
                    <span className="text-xs font-medium text-slate-700">{a}</span>
                    <p className="text-xs text-slate-400">
                      {a === "Issue Product + Voucher" && "Select Mini App destination (e.g. eSIM, Insurance, FastPass)"}
                      {a === "Issue Voucher" && "Generates coupon in user wallet (e.g. Transport)"}
                      {a === "Track Only" && "Mark in backend only (e.g. Priority support)"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Product Configuration</p>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Base Price (THB)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">VAT (%)</label>
                <input type="number" defaultValue="7" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              {form.category === "Bundle" && (
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Bundle Components</label>
                  <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700">
                    <Plus size={13} /> Add component
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-5 py-4 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
            {isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductList() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.category === catFilter;
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div>
      {viewProduct && !editProduct && <ProductDetailModal product={viewProduct} onClose={() => setViewProduct(null)} onEdit={() => { setEditProduct(viewProduct); setViewProduct(null); }} />}
      {editProduct && <ProductFormModal title="Edit Product" product={editProduct} onClose={() => setEditProduct(null)} onSave={(v) => setProducts(products.map(p => p.id === editProduct.id ? { ...p, ...v } : p))} />}
      {showCreate && <ProductFormModal title="Create Product" onClose={() => setShowCreate(false)} onSave={(v) => {
        const np = { ...v, id: `PRD-${String(products.length + 1).padStart(3, "0")}`, created: new Date().toISOString().slice(0, 16).replace("T", " "), updated: new Date().toISOString().slice(0, 16).replace("T", " ") } as Product;
        setProducts([np, ...products]);
      }} />}

      <FilterBar
        showSearch
        searchPlaceholder="Search product name..."
        showPeriod={false}
        showCreate
        createLabel="Create Product"
        onSearch={setSearch}
        onCreate={() => setShowCreate(true)}
        extraFilters={
          <>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="Display">Display</option>
              <option value="Hide">Hide</option>
            </select>
          </>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <span className="text-xs text-slate-500">{filtered.length} products</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Product Code", "Category", "Product Name", "Status", "Created", "Updated"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
                <th className="text-right text-xs font-medium text-slate-400 px-4 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{p.code}</td>
                  <td className="px-4 py-3"><CategoryBadge cat={p.category} /></td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">{p.name}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{p.created}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{p.updated}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-xs text-slate-600 hover:text-blue-600" onClick={() => setViewProduct(p)}>View</button>
                      <button className="text-xs text-blue-600 hover:underline" onClick={() => setEditProduct(p)}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
