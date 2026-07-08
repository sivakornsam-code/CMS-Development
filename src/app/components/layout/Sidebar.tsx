import { useState, useRef, useCallback, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
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
  Zap,
  Car,
  BarChart3,
  X,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import thaiPassLogo from "@/app/assets/thai-pass-logo.svg";
import { setAuthenticated, getAdminRole, type AdminRole } from "@/app/lib/auth";

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

const DEFAULT_COLLAPSED_SECTIONS = new Set<string>();

// Temporarily hidden from the sidebar. Remove entries here to restore them.
const HIDDEN_SECTIONS = new Set<string>([
  "Dashboard",
  "Product Management",
  "External Management",
  "App Settings",
]);
const HIDDEN_PATHS = new Set<string>([
  "/system/roles",
]);

const COMING_SOON_PATHS = new Set([
  "/dashboard/general",
  "/dashboard/revenue",
  "/dashboard/commission",
  "/products/list",
  "/products/vouchers",
  "/external/vendors",
  "/external/partners",
  "/external/affiliate-links",
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

const ROLE_ALLOWED: Record<AdminRole, string[]> = {
  super: [],
  transport: ["/partner-products/transportation", "/system/accounts"],
  immigration: ["/partner-products/fastpass", "/system/accounts"],
};

const ROLE_LABELS: Record<AdminRole, string> = {
  super: "Super Admin",
  transport: "Transport Admin",
  immigration: "Immigration Admin",
};

function getFilteredSections(role: AdminRole | null): NavSection[] {
  const visible = navSections
    .filter((s) => !HIDDEN_SECTIONS.has(s.section))
    .map((s) => ({ ...s, items: s.items.filter((item) => !HIDDEN_PATHS.has(item.path)) }))
    .filter((s) => s.items.length > 0);

  if (!role || role === "super") return visible;
  const allowed = ROLE_ALLOWED[role];
  return visible
    .map((s) => ({ ...s, items: s.items.filter((item) => allowed.includes(item.path)) }))
    .filter((s) => s.items.length > 0);
}

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
        className="w-full flex items-center justify-between px-3 py-1.5 mt-4 first:mt-0 group cursor-pointer"
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
          {section.items.map((item) => {
            const soon = COMING_SOON_PATHS.has(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "text-white bg-blue-600"
                      : soon
                        ? "text-slate-600 opacity-50 hover:opacity-100 hover:text-slate-300 hover:bg-white/5"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LogoutModal({ onClose, onLogout }: { onClose: () => void; onLogout: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-4">
            <LogOut size={18} className="text-rose-500" />
          </div>
          <h2 className="text-slate-900 text-lg font-semibold">Log out of your account?</h2>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            You're about to log out. You'll need to sign in again to continue managing the system.
          </p>
          <div className="flex items-center justify-end gap-2.5 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              <LogOut size={14} strokeWidth={2.5} />
              Logout
            </button>
          </div>
        </div>
      </div>
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
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);
  const role = getAdminRole();
  const filteredSections = getFilteredSections(role);
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
          <div className="flex items-center gap-2">
            <img src={thaiPassLogo} alt="ThaiPass logo" className="h-9 w-9 shrink-0 object-contain" />
            <div>
              <div className="text-white text-sm font-semibold">ThaiPass</div>
              <div className="text-slate-400 text-xs">CMS Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav ref={navRef} onScroll={handleScroll} className="sidebar-nav flex-1 overflow-y-auto py-3">
          <div className="px-2">
            {filteredSections.map((section) => (
              <NavSection key={section.section} section={section} />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700/50 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
              <User size={14} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-slate-300 text-xs font-medium truncate">
                {role ? ROLE_LABELS[role] : "Admin User"}
              </div>
              <div className="text-slate-500 text-xs truncate">admin@thaipass.com</div>
            </div>
            <button
              onClick={() => setShowLogout(true)}
              className="text-slate-500 hover:text-rose-400 transition-colors shrink-0 cursor-pointer"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {showLogout && (
        <LogoutModal
          onClose={() => setShowLogout(false)}
          onLogout={() => { setShowLogout(false); setAuthenticated(false); navigate("/login", { replace: true }); }}
        />
      )}
    </>
  );
}
