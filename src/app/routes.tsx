import { createBrowserRouter, Navigate, useLocation } from "react-router";
import { Layout } from "./components/layout/Layout";
import { isAuthenticated, getAdminRole, type AdminRole } from "./lib/auth";

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

const ROLE_ALLOWED: Record<AdminRole, string[]> = {
  super: [],
  transport: ["/partner-products/transportation", "/system/accounts"],
  immigration: ["/partner-products/fastpass", "/system/accounts"],
};

const ROLE_DEFAULT: Record<AdminRole, string> = {
  super: "/operations/orders",
  transport: "/partner-products/transportation",
  immigration: "/partner-products/fastpass",
};

function RoleGuard({ children }: { children: React.ReactNode }) {
  const role = getAdminRole();
  const location = useLocation();
  if (!role || role === "super") return <>{children}</>;
  const allowed = ROLE_ALLOWED[role];
  if (!allowed.some((p) => location.pathname.startsWith(p))) {
    return <Navigate to={ROLE_DEFAULT[role]} replace />;
  }
  return <>{children}</>;
}
import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardGeneral } from "./pages/dashboard/DashboardGeneral";
import { DashboardRevenue } from "./pages/dashboard/DashboardRevenue";
import { DashboardCommission } from "./pages/dashboard/DashboardCommission";
import { OrderTransaction } from "./pages/operations/OrderTransaction";
import { UserAccount } from "./pages/operations/UserAccount";
import { TDACList } from "./pages/operations/TDACList";
import { VendorManagement } from "./pages/external/VendorManagement";
import { PartnerManagement } from "./pages/external/PartnerManagement";
import { AffiliateLinkManagement } from "./pages/external/AffiliateLinkManagement";
import { ProductList } from "./pages/products/ProductList";
import { VoucherComponent } from "./pages/products/VoucherComponent";
import { StubPage } from "./pages/StubPage";
import { AccountManagement } from "./pages/system/AccountManagement";
import { FastPass } from "./pages/partner-products/FastPass";
import { Transportation } from "./pages/partner-products/Transportation";
import { ESim } from "./pages/partner-products/ESim";
import { Insurance } from "./pages/partner-products/Insurance";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <RequireAuth><RoleGuard><Layout /></RoleGuard></RequireAuth>,
    children: [
      { index: true, element: <Navigate to="/operations/orders" replace /> },

      // Dashboard
      { path: "dashboard/general", element: <DashboardGeneral /> },
      { path: "dashboard/revenue", element: <DashboardRevenue /> },
      { path: "dashboard/commission", element: <DashboardCommission /> },

      // Operations
      { path: "operations/orders", element: <OrderTransaction /> },
      { path: "operations/users", element: <UserAccount /> },
      { path: "operations/tdac", element: <TDACList /> },

      // Partner Products
      { path: "partner-products/fastpass", element: <FastPass /> },
      { path: "partner-products/transportation", element: <Transportation /> },
      { path: "partner-products/esim", element: <ESim /> },
      { path: "partner-products/insurance", element: <Insurance /> },
      { path: "partner-products/coupon", element: <StubPage title="Coupon" description="Manage coupon partner product configurations and redemption rules." /> },

      // Product Management
      { path: "products/list", element: <ProductList /> },
      { path: "products/vouchers", element: <VoucherComponent /> },

      // External Management
      { path: "external/vendors", element: <VendorManagement /> },
      { path: "external/partners", element: <PartnerManagement /> },
      { path: "external/affiliate-links", element: <AffiliateLinkManagement /> },

      // App Settings
      { path: "settings/app-config", element: <StubPage title="App Configuration" description="Configure global application settings, feature flags, and system parameters." /> },
      { path: "settings/documents", element: <StubPage title="Documents Management" description="Manage platform documents, terms of service, and policy files." /> },

      // System
      { path: "system/accounts", element: <AccountManagement /> },
      { path: "system/roles", element: <StubPage title="Roles & Permissions" description="Configure role-based access control and permission sets for admin users." /> },

      // Catch all
      { path: "*", element: <Navigate to="/operations/orders" replace /> },
    ],
  },
]);
