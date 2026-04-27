import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/layout/Layout";
import { DashboardGeneral } from "./pages/dashboard/DashboardGeneral";
import { DashboardRevenue } from "./pages/dashboard/DashboardRevenue";
import { DashboardCommission } from "./pages/dashboard/DashboardCommission";
import { OrderTransaction } from "./pages/operations/OrderTransaction";
import { UserAccount } from "./pages/operations/UserAccount";
import { VendorManagement } from "./pages/external/VendorManagement";
import { PartnerManagement } from "./pages/external/PartnerManagement";
import { AffiliateLinkManagement } from "./pages/external/AffiliateLinkManagement";
import { ProductList } from "./pages/products/ProductList";
import { VoucherComponent } from "./pages/products/VoucherComponent";
import { StubPage } from "./pages/StubPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: <Navigate to="/dashboard/general" replace /> },

      // Dashboard
      { path: "dashboard/general", element: <DashboardGeneral /> },
      { path: "dashboard/revenue", element: <DashboardRevenue /> },
      { path: "dashboard/commission", element: <DashboardCommission /> },

      // Operations
      { path: "operations/orders", element: <OrderTransaction /> },
      { path: "operations/users", element: <UserAccount /> },

      // Partner Products
      { path: "partner-products/fastpass", element: <StubPage title="FastPass" description="Manage FastPass partner product configurations, inventory, and settings." /> },
      { path: "partner-products/transportation", element: <StubPage title="Transportation" description="Manage transportation partner product configurations and pricing." /> },
      { path: "partner-products/esim", element: <StubPage title="eSIM" description="Manage eSIM partner product configurations, data plans, and pricing." /> },
      { path: "partner-products/insurance", element: <StubPage title="Insurance" description="Manage insurance partner product configurations and coverage options." /> },
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
      { path: "system/accounts", element: <StubPage title="Account Management" description="Manage admin user accounts, permissions, and access levels." /> },
      { path: "system/roles", element: <StubPage title="Roles & Permissions" description="Configure role-based access control and permission sets for admin users." /> },

      // Catch all
      { path: "*", element: <Navigate to="/dashboard/general" replace /> },
    ],
  },
]);
