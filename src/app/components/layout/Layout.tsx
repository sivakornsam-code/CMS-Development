import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Menu, Bell, Search } from "lucide-react";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard/general":            { title: "Dashboard — General",           subtitle: "High-level business overview" },
  "/dashboard/revenue":            { title: "Dashboard — Revenue",           subtitle: "Revenue breakdown and analysis" },
  "/dashboard/commission":         { title: "Dashboard — Commission",        subtitle: "Vendor & partner payment management" },
  "/operations/orders":            { title: "Order Transactions",            subtitle: "Track all transactions on app" },
  "/operations/users":             { title: "User Accounts",                 subtitle: "Track all users and activity" },
  "/partner-products/fastpass":    { title: "FastPass",                      subtitle: "FastPass partner product management" },
  "/partner-products/transportation": { title: "Transportation",             subtitle: "Transportation partner product management" },
  "/partner-products/esim":        { title: "eSIM",                          subtitle: "eSIM partner product management" },
  "/partner-products/insurance":   { title: "Insurance",                     subtitle: "Insurance partner product management" },
  "/partner-products/coupon":      { title: "Coupon",                        subtitle: "Coupon partner product management" },
  "/products/list":                { title: "Selling Product List",          subtitle: "Manage all products on app" },
  "/products/vouchers":            { title: "Voucher Component",             subtitle: "Manage reusable voucher components" },
  "/external/vendors":             { title: "Vendor Management",             subtitle: "Manage all service providers on ThaiPass" },
  "/external/partners":            { title: "Partner Management",            subtitle: "Manage partners who bring users" },
  "/external/affiliate-links":     { title: "Affiliate Link Management",     subtitle: "Manage how users enter ThaiPass via partners" },
  "/settings/app-config":          { title: "App Configuration",             subtitle: "Configure application settings" },
  "/settings/documents":           { title: "Documents Management",          subtitle: "Manage platform documents" },
  "/system/accounts":              { title: "Account Management",            subtitle: "Manage admin accounts" },
  "/system/roles":                 { title: "Roles & Permissions",           subtitle: "Configure roles and access control" },
};

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] || { title: "ThaiPass CMS", subtitle: "" };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — shifts right when sidebar is open */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-60" : "lg:ml-0"
        }`}
      >
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1">
            <div className="text-slate-900 text-sm font-semibold">{pageInfo.title}</div>
            {pageInfo.subtitle && (
              <div className="text-slate-500 text-xs">{pageInfo.subtitle}</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold cursor-pointer">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
