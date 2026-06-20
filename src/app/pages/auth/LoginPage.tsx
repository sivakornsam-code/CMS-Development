import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { EyeOff, Eye } from "lucide-react";
import thaiPassLogoFull from "@/app/assets/thaipass-logo-full.svg";
import loginBg from "@/app/assets/login-bg.svg";
import patternOrnament from "@/app/assets/pattern-ornament.svg";
import patternStar from "@/app/assets/pattern-star.svg";
import {
  getStoredPassword,
  isAuthenticated,
  setAuthenticated,
  setAdminRole,
  type AdminRole,
} from "@/app/lib/auth";

// ── Admin role selection modal ────────────────────────────────────────────────

const roles: { id: AdminRole; label: string; defaultPath: string }[] = [
  { id: "super",       label: "Super Admin",       defaultPath: "/operations/orders" },
  { id: "transport",   label: "Transport Admin",    defaultPath: "/partner-products/transportation" },
  { id: "immigration", label: "Immigration Admin",  defaultPath: "/partner-products/fastpass" },
];

function AdminRoleModal({ onSelect }: { onSelect: (role: AdminRole) => void }) {
  const [selected, setSelected] = useState<AdminRole>("super");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Demo Mode</p>
          <h2 className="text-slate-900 text-lg font-semibold">Select a role to continue</h2>
          <p className="text-slate-400 text-sm mt-1">In production, this is determined automatically.</p>
        </div>

        <div className="px-6 py-4 space-y-2">
          {roles.map((role) => {
            const isChosen = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all cursor-pointer
                  ${isChosen
                    ? "border-blue-400 bg-white ring-2 ring-blue-500/10"
                    : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
              >
                <span className={`text-sm font-medium ${isChosen ? "text-blue-600" : "text-slate-700"}`}>
                  {role.label}
                </span>
                <div className={`shrink-0 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center
                  ${isChosen ? "border-blue-500" : "border-slate-300"}`}
                >
                  {isChosen && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={() => onSelect(selected)}
            className="w-full h-12 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-sm"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Login page ────────────────────────────────────────────────────────────────

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/operations/orders" replace />;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== getStoredPassword()) {
      setError("Invalid username or password");
      return;
    }
    setError("");
    setShowRoleModal(true);
  }

  function handleRoleSelect(role: AdminRole) {
    const chosen = roles.find((r) => r.id === role)!;
    setAuthenticated(true);
    setAdminRole(role);
    navigate(chosen.defaultPath);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (error) setError("");
  }

  const canSubmit = username.trim().length > 0 && password.length > 0;

  return (
    <>
      <div
        className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden"
        style={{ backgroundColor: "#345073" }}
      >
        {/* Background layer */}
        <img src={loginBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" />

        {/* Decorative patterns */}
        <img src={patternStar} alt="" aria-hidden className="absolute -top-8 -left-8 w-40 opacity-20 pointer-events-none select-none" />
        <img src={patternOrnament} alt="" aria-hidden className="absolute -bottom-6 -right-6 w-32 opacity-15 pointer-events-none select-none" />
        <img src={patternStar} alt="" aria-hidden className="absolute bottom-16 left-12 w-16 opacity-10 pointer-events-none select-none" />
        <img src={patternOrnament} alt="" aria-hidden className="absolute top-12 right-16 w-20 opacity-10 pointer-events-none select-none" />

        {/* Login card */}
        <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Logo */}
          <div className="flex flex-col items-center pt-16 px-6">
            <img src={thaiPassLogoFull} alt="ThaiPass" className="h-24 object-contain" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pt-11 pb-8 space-y-3">
            <div className={`bg-white border rounded-2xl px-4 pt-2 pb-2 focus-within:ring-2 transition ${error ? "border-red-400 focus-within:border-red-400 focus-within:ring-red-500/10" : "border-slate-200 focus-within:border-blue-400 focus-within:ring-blue-500/10"}`}>
              <label className="block text-sm font-medium text-slate-700 mb-0.5">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); if (error) setError(""); }}
                className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent outline-none"
              />
            </div>

            <div className={`relative bg-white border rounded-2xl px-4 pt-2 pb-2 focus-within:ring-2 transition ${error ? "border-red-400 focus-within:border-red-400 focus-within:ring-red-500/10" : "border-slate-200 focus-within:border-blue-400 focus-within:ring-blue-500/10"}`}>
              <label className="block text-sm font-medium text-slate-700 mb-0.5">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full pr-8 text-sm text-slate-900 placeholder-slate-400 bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            <div className="pt-5">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full h-12 rounded-xl text-sm font-semibold transition-all
                  ${canSubmit
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
              >
                Log in
              </button>
            </div>

            <p className="text-xs text-center min-h-[1rem] pt-2">
              {error
                ? <span className="text-red-500">{error}</span>
                : <span className="text-slate-400">Demo mode — sign in with any username and password <span className="font-mono font-medium text-slate-500">{getStoredPassword()}</span></span>
              }
            </p>
          </form>
        </div>
      </div>

      {showRoleModal && <AdminRoleModal onSelect={handleRoleSelect} />}
    </>
  );
}
