import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign, ShoppingCart, ArrowUpRight } from "lucide-react";
import { revenueChartData, revenueByProduct, formatNumber, formatCurrency } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";

function MetricCard({ title, value, subtitle, icon, color, trend }: {
  title: string; value: string; subtitle?: string; icon: React.ReactNode; color: string; trend?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-xs mb-1">{title}</p>
          <p className="text-slate-900 text-2xl font-semibold">{value}</p>
          {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-emerald-600 text-xs">
          <ArrowUpRight size={12} /> {trend}
        </div>
      )}
    </div>
  );
}

export function DashboardRevenue() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Updated daily at 23:59
        </div>
        <FilterBar showSearch={false} showPeriod={true} />
      </div>

      {/* Overview cards */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            title="Gross Revenue"
            value="฿12,480,500"
            subtitle="Before tax & refunds"
            icon={<TrendingUp size={18} className="text-blue-600" />}
            color="bg-blue-50"
            trend="+18.5% vs last month"
          />
          <MetricCard
            title="Net Revenue"
            value="฿9,984,400"
            subtitle="After tax & refunds"
            icon={<DollarSign size={18} className="text-emerald-600" />}
            color="bg-emerald-50"
            trend="+17.2% vs last month"
          />
          <MetricCard
            title="Total Orders"
            value="9,842"
            subtitle="Completed transactions"
            icon={<ShoppingCart size={18} className="text-violet-600" />}
            color="bg-violet-50"
            trend="+9.3% vs last month"
          />
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Revenue Trend (6 months)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueChartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip
              formatter={(v: number) => formatCurrency(v)}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
            />
            <Bar dataKey="gross" name="Gross Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="net" name="Net Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-3 h-2.5 bg-blue-500 rounded-sm inline-block" /> Gross Revenue
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-3 h-2.5 bg-emerald-500 rounded-sm inline-block" /> Net Revenue
          </div>
        </div>
      </div>

      {/* Revenue by Product */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Revenue Distribution by Product</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-medium text-slate-400 pb-2">Product Name</th>
                <th className="text-right text-xs font-medium text-slate-400 pb-2">Total Orders</th>
                <th className="text-right text-xs font-medium text-slate-400 pb-2">Gross Revenue</th>
                <th className="text-right text-xs font-medium text-slate-400 pb-2">Net Revenue</th>
                <th className="text-right text-xs font-medium text-slate-400 pb-2">Margin</th>
              </tr>
            </thead>
            <tbody>
              {revenueByProduct.map((p) => {
                const margin = ((p.netRevenue / p.grossRevenue) * 100).toFixed(0);
                return (
                  <tr key={p.name} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-2.5 text-slate-800 font-medium text-xs">{p.name}</td>
                    <td className="py-2.5 text-right text-slate-600 text-xs">{formatNumber(p.orders)}</td>
                    <td className="py-2.5 text-right text-slate-600 text-xs">{formatCurrency(p.grossRevenue)}</td>
                    <td className="py-2.5 text-right text-slate-600 text-xs">{formatCurrency(p.netRevenue)}</td>
                    <td className="py-2.5 text-right">
                      <span className="text-xs text-emerald-600 font-medium">{margin}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td className="py-2.5 text-xs font-semibold text-slate-700">Total</td>
                <td className="py-2.5 text-right text-xs font-semibold text-slate-700">
                  {formatNumber(revenueByProduct.reduce((a, p) => a + p.orders, 0))}
                </td>
                <td className="py-2.5 text-right text-xs font-semibold text-slate-700">
                  {formatCurrency(revenueByProduct.reduce((a, p) => a + p.grossRevenue, 0))}
                </td>
                <td className="py-2.5 text-right text-xs font-semibold text-slate-700">
                  {formatCurrency(revenueByProduct.reduce((a, p) => a + p.netRevenue, 0))}
                </td>
                <td className="py-2.5 text-right text-xs font-semibold text-emerald-600">80%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
