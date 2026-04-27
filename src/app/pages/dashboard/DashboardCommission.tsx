import { useState } from "react";
import { DollarSign, Clock, Plus, X, Upload, ChevronDown } from "lucide-react";
import { commissionPayments, formatCurrency } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";

const entities = ["Bangkok Air Services", "AIS eSIM", "Indian TTT", "TrueMove H", "Muang Thai Life", "AOT FastPass", "Agoda Travel", "KKday Thailand"];

function CreatePaymentModal({ onClose }: { onClose: () => void }) {
  const [flow, setFlow] = useState("Payout");
  const [entity, setEntity] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Create Payment</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Select Entity</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
            >
              <option value="">— Select entity —</option>
              {entities.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Select Flow</label>
            <div className="flex gap-2">
              {["Payout", "Return"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFlow(f)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    flow === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Amount (THB)</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Attach File</label>
            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <Upload size={16} className="text-slate-400 mb-1" />
              <span className="text-xs text-slate-400">Click to upload (PDF, PNG, JPG)</span>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>
        <div className="flex gap-2 px-5 py-4 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardCommission() {
  const [showModal, setShowModal] = useState(false);

  const totalPaid = commissionPayments.filter(p => p.flow === "Payout").reduce((a, p) => a + p.amount, 0);
  const totalReturn = commissionPayments.filter(p => p.flow === "Return").reduce((a, p) => a + p.amount, 0);
  const remainingBalance = 9984400 - totalPaid + totalReturn;

  return (
    <div className="space-y-5">
      {showModal && <CreatePaymentModal onClose={() => setShowModal(false)} />}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Updated daily at 23:59
        </div>
        <FilterBar showSearch={false} showPeriod={true} />
      </div>

      {/* Overview */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-xs mb-1">Total Paid</p>
                <p className="text-slate-900 text-2xl font-semibold">{formatCurrency(totalPaid)}</p>
                <p className="text-slate-400 text-xs mt-1">Already paid to vendors/partners</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <DollarSign size={18} className="text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-xs mb-1">Remaining Balance</p>
                <p className="text-slate-900 text-2xl font-semibold">{formatCurrency(remainingBalance)}</p>
                <p className="text-slate-400 text-xs mt-1">Net revenue − paid + returns</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock size={18} className="text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Management */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Payment Management</h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
          >
            <Plus size={13} />
            Create Payment
          </button>
        </div>

        <FilterBar showSearch={false} showPeriod={true} extraFilters={
          <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Entities</option>
            {entities.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        } />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Date", "Name", "Flow", "Amount", "Updated"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 pb-2 pr-4">{h}</th>
                ))}
                <th className="text-right text-xs font-medium text-slate-400 pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {commissionPayments.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2.5 pr-4 text-xs text-slate-600">{p.date}</td>
                  <td className="py-2.5 pr-4 text-xs font-medium text-slate-800">{p.name}</td>
                  <td className="py-2.5 pr-4">
                    <StatusBadge status={p.flow} />
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-slate-700 font-medium">{formatCurrency(p.amount)}</td>
                  <td className="py-2.5 pr-4 text-xs text-slate-500">{p.updatedAt}</td>
                  <td className="py-2.5 text-right">
                    <button className="text-xs text-blue-600 hover:underline">Edit</button>
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
