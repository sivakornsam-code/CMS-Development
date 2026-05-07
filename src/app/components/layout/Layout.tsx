import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Toaster } from "sonner";
import { Menu } from "lucide-react";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard/general":               { title: "General",                   subtitle: "Dashboard" },
  "/dashboard/revenue":               { title: "Revenue",                   subtitle: "Dashboard" },
  "/dashboard/commission":            { title: "Commission",                subtitle: "Dashboard" },
  "/operations/orders":               { title: "Order Transaction",         subtitle: "Operations" },
  "/operations/users":                { title: "User Account",              subtitle: "Operations" },
  "/operations/tdac":                 { title: "TDAC List",                 subtitle: "Operations" },
  "/partner-products/fastpass":       { title: "FastPass",                  subtitle: "Partner Products" },
  "/partner-products/transportation": { title: "Transportation",            subtitle: "Partner Products" },
  "/partner-products/esim":           { title: "eSIM",                      subtitle: "Partner Products" },
  "/partner-products/insurance":      { title: "Insurance",                 subtitle: "Partner Products" },
  "/partner-products/coupon":         { title: "Coupon",                    subtitle: "Partner Products" },
  "/products/list":                   { title: "Selling Product List",      subtitle: "Product Management" },
  "/products/vouchers":               { title: "Voucher Component",         subtitle: "Product Management" },
  "/external/vendors":                { title: "Vendor Management",         subtitle: "External Management" },
  "/external/partners":               { title: "Partner Management",        subtitle: "External Management" },
  "/external/affiliate-links":        { title: "Affiliate Link Management", subtitle: "External Management" },
  "/settings/app-config":             { title: "App Configuration",         subtitle: "App Settings" },
  "/settings/documents":              { title: "Documents Management",      subtitle: "App Settings" },
  "/system/accounts":                 { title: "Account Management",        subtitle: "System" },
  "/system/roles":                    { title: "Roles & Permissions",       subtitle: "System" },
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
        className={`flex-1 min-w-0 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
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

        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
