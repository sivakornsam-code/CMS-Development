import { useState, useRef, useCallback, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Tag,
  Building2,
  Handshake,
  Link2,
  Settings,
  FileText,
  Shield,
  UserCog,
  Wifi,
  Umbrella,
  Ticket,
  Zap,
  Car,
  BarChart3,
  X,
  ChevronDown,
} from "lucide-react";

function ThaiPassIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path d="M8 0 L9.8 6.2 L16 8 L9.8 9.8 L8 16 L6.2 9.8 L0 8 L6.2 6.2 Z" />
    </svg>
  );
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavSection {
  section: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const DEFAULT_COLLAPSED_SECTIONS = new Set([
  "Dashboard",
  "Product Management",
  "External Management",
  "App Settings",
  "System",
]);

const navSections: NavSection[] = [
  {
    section: "Dashboard",
    icon: <LayoutDashboard size={16} />,
    items: [
      { label: "General",    path: "/dashboard/general",    icon: <BarChart3 size={16} /> },
      { label: "Revenue",    path: "/dashboard/revenue",    icon: <TrendingUp size={16} /> },
      { label: "Commission", path: "/dashboard/commission", icon: <DollarSign size={16} /> },
    ],
  },
  {
    section: "Operations",
    icon: <ShoppingCart size={16} />,
    items: [
      { label: "Order Transaction", path: "/operations/orders", icon: <ShoppingCart size={16} /> },
      { label: "User Account",      path: "/operations/users",  icon: <Users size={16} /> },
      { label: "TDAC List",         path: "/operations/tdac",   icon: <FileText size={16} /> },
    ],
  },
  {
    section: "Product Management",
    icon: <Package size={16} />,
    items: [
      { label: "Selling Product List", path: "/products/list",     icon: <Package size={16} /> },
      { label: "Voucher Component",    path: "/products/vouchers", icon: <Tag size={16} /> },
    ],
  },
  {
    section: "External Management",
    icon: <Building2 size={16} />,
    items: [
      { label: "Vendor Management",         path: "/external/vendors",         icon: <Building2 size={16} /> },
      { label: "Partner Management",        path: "/external/partners",        icon: <Handshake size={16} /> },
      { label: "Affiliate Link Management", path: "/external/affiliate-links", icon: <Link2 size={16} /> },
    ],
  },
  {
    section: "Partner Products",
    icon: <Package size={16} />,
    items: [
      { label: "FastPass",       path: "/partner-products/fastpass",       icon: <Zap size={16} /> },
      { label: "Transportation", path: "/partner-products/transportation", icon: <Car size={16} /> },
      { label: "eSIM",           path: "/partner-products/esim",           icon: <Wifi size={16} /> },
      { label: "Insurance",      path: "/partner-products/insurance",      icon: <Umbrella size={16} /> },
      { label: "Coupon",         path: "/partner-products/coupon",         icon: <Ticket size={16} /> },
    ],
  },
  {
    section: "App Settings",
    icon: <Settings size={16} />,
    items: [
      { label: "App Configuration",    path: "/settings/app-config", icon: <Settings size={16} /> },
      { label: "Documents Management", path: "/settings/documents",  icon: <FileText size={16} /> },
    ],
  },
  {
    section: "System",
    icon: <Shield size={16} />,
    items: [
      { label: "Account Management",  path: "/system/accounts", icon: <UserCog size={16} /> },
      { label: "Roles & Permissions", path: "/system/roles",    icon: <Shield size={16} /> },
    ],
  },
];

function NavSection({ section }: { section: NavSection }) {
  const location = useLocation();
  const hasActive = section.items.some((item) => location.pathname === item.path);
  const [open, setOpen] = useState(
    hasActive || !DEFAULT_COLLAPSED_SECTIONS.has(section.section),
  );

  useEffect(() => {
    if (hasActive) {
      setOpen(true);
    }
  }, [hasActive]);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-1.5 mt-4 first:mt-0 group"
      >
        <span className="text-xs text-slate-500 uppercase tracking-wider group-hover:text-slate-300 transition-colors">
          {section.section}
        </span>
        <ChevronDown
          size={12}
          className={`text-slate-600 group-hover:text-slate-400 transition-all duration-200 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>

      {open && (
        <div className="mt-0.5 space-y-0.5">
          {section.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "text-white bg-blue-600"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navRef = useRef<HTMLElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    el.classList.add("is-scrolling");
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      el.classList.remove("is-scrolling");
    }, 800);
  }, []);

  return (
    <>
      {/* Overlay (mobile + desktop when sidebar is open over content) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-slate-900 flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo / Header */}
        <div className="flex items-center justify-between px-4 border-b border-slate-700/50 h-14 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <ThaiPassIcon size={16} className="text-white" />
            </div>
            <div>
              <div className="text-white text-sm font-semibold">ThaiPass</div>
              <div className="text-slate-400 text-xs">CMS Admin</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav ref={navRef} onScroll={handleScroll} className="sidebar-nav flex-1 overflow-y-auto py-3">
          <div className="px-2">
            {navSections.map((section) => (
              <NavSection key={section.section} section={section} />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700/50 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-slate-300 text-xs font-medium truncate">Admin User</div>
              <div className="text-slate-500 text-xs truncate">admin@thaipass.com</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
