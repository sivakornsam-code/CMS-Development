import { useState } from "react";
import { X, Eye, EyeOff, KeyRound, User } from "lucide-react";
import { toast } from "sonner";
import { getStoredPassword, setStoredPassword } from "@/app/lib/auth";

export function AccountManagement() {
  const [showModal, setShowModal]             = useState(false);
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [newPassError, setNewPassError]       = useState("");
  const [confirmError, setConfirmError]       = useState("");

  const PASSWORD_MSG = "Must be at least 8 characters using letters (A–Z, a–z), numbers (0–9), or symbols.";
  const validChars = /^[A-Za-z0-9!@#$%^&*()\-_=+\[\]{};:'",.<>?\/\\|~`]+$/;

  function handleConfirm() {
    let hasError = false;
    if (newPassword.length < 8 || !validChars.test(newPassword)) {
      setNewPassError(PASSWORD_MSG);
      hasError = true;
    }
    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      hasError = true;
    }
    if (hasError) return;
    setStoredPassword(newPassword);
    setShowModal(false);
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password updated successfully.", { style: { color: "#16a34a" } });
  }

  function handleCancel() {
    setShowModal(false);
    setNewPassword("");
    setConfirmPassword("");
    setNewPassError("");
    setConfirmError("");
  }

  return (
    <div className="space-y-3">


      {/* Main card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

        {/* Identity header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/60 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white">
              <User size={18} strokeWidth={2.5} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Admin User</p>
              <p className="text-xs text-slate-400 mt-0.5">admin@thaipass.com</p>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Security</p>

          <div className="flex items-center justify-between py-3 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400 mb-1">Password</p>
              <p className="text-sm font-mono tracking-widest text-slate-500">••••••••</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <KeyRound size={12} />
              Reset Password
            </button>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleCancel}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                <KeyRound size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900">Reset Password</h3>
              </div>
              <button
                onClick={handleCancel}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Fields */}
            <div className="space-y-3 mb-8">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">New password</label>
                <div className={`relative border rounded-xl px-3.5 py-2.5 transition focus-within:ring-2 ${
                  newPassError
                    ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-500/10"
                    : "border-slate-200 focus-within:border-blue-400 focus-within:ring-blue-500/10"
                }`}>
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setNewPassError(""); }}
                    className="w-full pr-8 text-xs text-slate-900 placeholder-slate-300 bg-transparent outline-none"
                  />
                  <button type="button" onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer">
                    {showNew ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
                <p className={`mt-1 text-xs ${newPassError ? "text-red-500" : "text-slate-400"}`}>
                  {newPassError || "Must be at least 8 characters using letters (A–Z, a–z), numbers (0–9), or symbols."}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Confirm new password</label>
                <div className={`relative border rounded-xl px-3.5 py-2.5 transition focus-within:ring-2 ${
                  confirmError
                    ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-500/10"
                    : "border-slate-200 focus-within:border-blue-400 focus-within:ring-blue-500/10"
                }`}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(""); }}
                    className="w-full pr-8 text-xs text-slate-900 placeholder-slate-300 bg-transparent outline-none"
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer">
                    {showConfirm ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
                {confirmError && <p className="mt-1 text-xs text-red-500">{confirmError}</p>}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!newPassword || !confirmPassword}
                className={`flex-1 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                  newPassword && confirmPassword
                    ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
