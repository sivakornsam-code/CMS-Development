import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Link2, ShoppingCart, Download, ArrowUpRight } from "lucide-react";
import { mockStats, mockProductPerformance, formatNumber, formatCurrency } from "../../data/mockData";
import { FilterBar } from "../../components/ui/FilterBar";

const downloadData = [
  { month: "Nov", ios: 3200, android: 2800 },
  { month: "Dec", ios: 4100, android: 3600 },
  { month: "Jan", ios: 3800, android: 3300 },
  { month: "Feb", ios: 4500, android: 3900 },
  { month: "Mar", ios: 5200, android: 4500 },
  { month: "Apr", ios: 6100, android: 5200 },
];

function MetricCard({ title, value, subtitle, icon, trend, color }: {
  title: string; value: string; subtitle?: string; icon: React.ReactNode; trend?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-xs mb-1">{title}</p>
          <p className="text-slate-900 text-2xl font-semibold">{value}</p>
          {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-emerald-600 text-xs">
          <ArrowUpRight size={12} />
          {trend}
        </div>
      )}
    </div>
  );
}

export function DashboardGeneral() {
  return (
    <div className="space-y-5">
      {/* Info bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Updated daily at 23:59
        </div>
        <FilterBar showSearch={false} showPeriod={true} />
      </div>

      {/* Growth Section */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Growth</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="App Downloads"
            value={formatNumber(mockStats.appDownloads)}
            subtitle="iOS + Android installs"
            icon={<Download size={18} className="text-blue-600" />}
            color="bg-blue-50"
            trend="+12.4% vs last month"
          />
          <MetricCard
            title="Active Users"
            value={formatNumber(mockStats.activeUsers)}
            subtitle="Total registered users"
            icon={<Users size={18} className="text-violet-600" />}
            color="bg-violet-50"
            trend="+8.7% vs last month"
          />
          <MetricCard
            title="Active Affiliate Users"
            value={formatNumber(mockStats.activeAffiliateUsers)}
            subtitle="Via partner links"
            icon={<Link2 size={18} className="text-amber-600" />}
            color="bg-amber-50"
            trend="+15.2% vs last month"
          />
          <MetricCard
            title="Affiliate Contribution"
            value={`${mockStats.affiliateContribution}%`}
            subtitle="Affiliate / Total Users"
            icon={<TrendingUp size={18} className="text-emerald-600" />}
            color="bg-emerald-50"
            trend="+2.1% vs last month"
          />
        </div>
      </div>

      {/* Business Section */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Business</h2>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(mockStats.totalRevenue)}
            subtitle="Gross revenue from all completed transactions"
            icon={<TrendingUp size={18} className="text-blue-600" />}
            color="bg-blue-50"
            trend="+18.5% vs last month"
          />
          <MetricCard
            title="Total Orders"
            value={formatNumber(mockStats.totalOrders)}
            subtitle="Number of completed transactions"
            icon={<ShoppingCart size={18} className="text-violet-600" />}
            color="bg-violet-50"
            trend="+9.3% vs last month"
          />
        </div>
      </div>

      {/* Charts + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Downloads chart */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">App Downloads Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={downloadData}>
              <defs>
                <linearGradient id="ios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="android" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Area type="monotone" dataKey="ios" name="iOS" stroke="#3b82f6" fill="url(#ios)" strokeWidth={2} />
              <Area type="monotone" dataKey="android" name="Android" stroke="#8b5cf6" fill="url(#android)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-3 h-0.5 bg-blue-500 rounded" /> iOS
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-3 h-0.5 bg-violet-500 rounded" /> Android
            </div>
          </div>
        </div>

        {/* Product Performance */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Product Performance</h3>
          <div className="space-y-2.5">
            <div className="grid grid-cols-3 gap-2 text-xs font-medium text-slate-400 pb-1 border-b border-slate-100">
              <span>Product</span>
              <span className="text-right">Orders</span>
              <span className="text-right">Revenue</span>
            </div>
            {mockProductPerformance.map((p) => (
              <div key={p.name} className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-slate-700 font-medium truncate" title={p.name}>{p.name}</span>
                <span className="text-right text-slate-600">{formatNumber(p.orders)}</span>
                <span className="text-right text-slate-600">
                  {(p.revenue / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
