// AdminPanel.tsx — Full admin dashboard with partner management

import { useState, useEffect } from "react";
import { resetUsage, getUsageCount } from "../lib/usage";
import { clearProAccess, getUserState, getPartners, addPartner, removePartner, redeemCode, type PartnerCode } from "../lib/userStore";
import Icon from "./Icons";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  onUserUpdate: () => void;
}

const ADMIN_PASSWORD = "yaM2006@";

export default function AdminPanel({ open, onClose, onUserUpdate }: AdminPanelProps) {
  const [tab, setTab] = useState<"overview" | "partners" | "settings">("overview");
  const [partners, setPartners] = useState<PartnerCode[]>([]);
  const [newCode, setNewCode] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [partnerMsg, setPartnerMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Password gate state
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (open) {
      setPartners(getPartners());
      setConfirmClear(false);
      // Reset auth on each open for security
      if (!authenticated) {
        setAuthenticated(false);
        setPasswordInput("");
        setPasswordError(false);
      }
    }
  }, [open]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  if (!open) return null;

  // ── PASSWORD GATE ──
  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
        <div className="relative glass-strong rounded-3xl w-full max-w-sm shadow-2xl shadow-black/50 overflow-hidden animate-scale-in gradient-border">
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-b border-gray-700 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="lock" size={28} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Admin Access</h2>
            <p className="text-gray-500 text-sm mt-1">Enter password to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                placeholder="Enter admin password"
                autoFocus
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 text-center text-lg font-mono tracking-widest focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                autoComplete="off"
              />
              {passwordError && (
                <p className="text-red-400 text-xs mt-2 text-center flex items-center justify-center gap-1">
                  <Icon name="x" size={12} />
                  Incorrect password. Try again.
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!passwordInput.trim()}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold rounded-xl transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon name="key" size={16} />
              Unlock Dashboard
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              Cancel
            </button>
          </form>

          {/* Security notice */}
          <div className="px-6 pb-4">
            <p className="text-gray-700 text-[10px] text-center">
              This area is restricted. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const user = getUserState();
  const usageCount = getUsageCount();

  const handleAddPartner = () => {
    const result = addPartner(newCode, newLabel || "Partner Access");
    setPartnerMsg({ text: result.message, ok: result.success });
    if (result.success) {
      setPartners(getPartners());
      setNewCode("");
      setNewLabel("");
    }
    setTimeout(() => setPartnerMsg(null), 3000);
  };

  const handleRemovePartner = (code: string) => {
    removePartner(code);
    setPartners(getPartners());
  };

  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    localStorage.clear();
    onUserUpdate();
    setPartners(getPartners());
    setConfirmClear(false);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass-strong rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl shadow-black/50 flex flex-col animate-scale-in gradient-border">
        {/* Header */}
        <div className="border-b border-white/[0.04] p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
              <Icon name="key" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Admin Dashboard</h2>
              <p className="text-gray-500 text-xs">Hidden access — manage partners & system settings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 shrink-0">
          {(["overview", "partners", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setConfirmClear(false); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors capitalize flex items-center justify-center gap-1.5 ${
                tab === t
                  ? "text-orange-400 border-b-2 border-orange-400 bg-orange-500/5"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon name={t === "overview" ? "info" : t === "partners" ? "users" : "settings"} size={14} />
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* ═══════ OVERVIEW TAB ═══════ */}
          {tab === "overview" && (
            <>
              {/* Session Card */}
              <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Icon name="shield" size={14} className="text-blue-400" />
                  Current Session
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <span className="text-gray-500 text-xs block mb-1">Access Tier</span>
                    <p className="text-white font-semibold">{user.tier ? user.tier.toUpperCase() : "FREE"}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <span className="text-gray-500 text-xs block mb-1">PRO Status</span>
                    <p className={`font-semibold flex items-center gap-1 ${user.isPro ? "text-green-400" : "text-red-400"}`}>
                      <Icon name={user.isPro ? "check" : "x"} size={14} />
                      {user.isPro ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <span className="text-gray-500 text-xs block mb-1">Access Code</span>
                    <p className="text-white font-mono text-xs">{user.accessCode || "None"}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <span className="text-gray-500 text-xs block mb-1">Label</span>
                    <p className="text-white text-xs">{user.label || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Usage Card */}
              <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Icon name="zap" size={14} className="text-yellow-400" />
                  Usage
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400">Free generations used</span>
                      <span className="text-white font-mono">{usageCount} / 3</span>
                    </div>
                    <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          usageCount >= 3 ? "bg-red-500" : usageCount >= 2 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min((usageCount / 3) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    user.isPro
                      ? "bg-green-500/20 text-green-400"
                      : usageCount >= 3
                        ? "bg-red-500/20 text-red-400"
                        : "bg-gray-700 text-gray-300"
                  }`}>
                    {user.isPro ? "UNLIMITED" : usageCount >= 3 ? "EXHAUSTED" : `${3 - usageCount} LEFT`}
                  </span>
                </div>
              </div>

              {/* System Card */}
              <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Icon name="film" size={14} className="text-purple-400" />
                  Engine Capabilities
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { label: "Composition Styles", value: "15" },
                    { label: "Camera Variations", value: "5" },
                    { label: "Lighting Variations", value: "5" },
                    { label: "Expression Profiles", value: "20+" },
                    { label: "Color Grades", value: "30+" },
                    { label: "Scene Categories", value: "25+" },
                    { label: "AI Platforms", value: "3" },
                    { label: "Active Partners", value: String(partners.length) },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-1.5 px-2 bg-gray-900/40 rounded">
                      <span className="text-gray-500 text-xs">{item.label}</span>
                      <span className="text-white font-mono text-xs font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Access */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <h4 className="text-blue-400 font-semibold text-xs mb-2 flex items-center gap-1.5">
                  <Icon name="info" size={12} />
                  How to Access This Panel
                </h4>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>Click the "R" logo 5 times rapidly (within 3 seconds)</li>
                  <li>Or navigate to <code className="text-blue-300 bg-gray-800 px-1 rounded">yoursite.com/#admin</code></li>
                  <li>This panel is completely hidden from normal users</li>
                </ul>
              </div>
            </>
          )}

          {/* ═══════ PARTNERS TAB ═══════ */}
          {tab === "partners" && (
            <>
              {/* Info Banner */}
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                <p className="text-yellow-400 text-xs flex items-start gap-2">
                  <Icon name="warning" size={14} className="mt-0.5 shrink-0" />
                  Partner codes give users free unlimited PRO access. Users enter these codes in the paywall popup after their 3 free trials.
                </p>
              </div>

              {/* Add Partner Form */}
              <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Icon name="plus" size={14} className="text-green-400" />
                  Create New Partner Code
                </h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                      placeholder="CODE (e.g. JOHN-PARTNER)"
                      className="flex-1 px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-600 text-sm font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
                    />
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Label (e.g. John - YouTuber)"
                      className="flex-1 px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleAddPartner}
                    disabled={!newCode.trim()}
                    className="w-full py-2.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 text-green-400 font-medium rounded-lg transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <Icon name="plus" size={14} />
                    Add Partner Code
                  </button>
                  {partnerMsg && (
                    <p className={`text-xs font-medium px-1 ${partnerMsg.ok ? "text-green-400" : "text-red-400"}`}>
                      {partnerMsg.ok ? <Icon name="check" size={12} className="inline mr-1" /> : <Icon name="x" size={12} className="inline mr-1" />}
                      {partnerMsg.text}
                    </p>
                  )}
                </div>
              </div>

              {/* Partner List */}
              <div>
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Icon name="users" size={14} className="text-orange-400" />
                  Active Partner Codes
                  <span className="text-xs text-gray-500 font-normal">({partners.length})</span>
                </h3>

                {partners.length === 0 ? (
                  <div className="bg-gray-800/20 border border-gray-800 rounded-xl p-8 text-center">
                    <Icon name="users" size={32} className="text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">No partner codes yet.</p>
                    <p className="text-gray-700 text-xs mt-1">Create one above to grant free PRO access.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {partners.map((p) => (
                      <div key={p.code} className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-3 flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center shrink-0">
                          <Icon name="key" size={14} className="text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-mono text-sm font-medium">{p.code}</p>
                          <p className="text-gray-500 text-xs truncate">{p.label} — added {new Date(p.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => handleRemovePartner(p.code)}
                          className="shrink-0 p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-50 group-hover:opacity-100"
                          title="Delete this partner code"
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Built-in codes */}
              <div className="bg-gray-800/20 border border-gray-800 rounded-xl p-4">
                <h4 className="text-gray-500 font-medium text-xs mb-3 flex items-center gap-1.5">
                  <Icon name="lock" size={12} />
                  Built-in Codes (always active)
                </h4>
                <div className="space-y-2">
                  {[
                    { code: "RETHUMB-ADMIN", desc: "Full admin access — never expires" },
                    { code: "RETHUMB-PRO-2024", desc: "PRO access" },
                    { code: "RETHUMB-BETA", desc: "Beta tester access" },
                    { code: "RETHUMB-LIFETIME", desc: "Lifetime PRO — never expires" },
                  ].map((c) => (
                    <div key={c.code} className="flex items-center justify-between text-xs bg-gray-900/40 rounded px-3 py-2">
                      <span className="text-gray-400 font-mono">{c.code}</span>
                      <span className="text-gray-600">{c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ═══════ SETTINGS TAB ═══════ */}
          {tab === "settings" && (
            <>
              {/* Reset Usage */}
              <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
                <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                  <Icon name="refresh" size={14} className="text-blue-400" />
                  Reset Free Usage
                </h3>
                <p className="text-gray-500 text-xs mb-3">Reset the free generation counter back to 0/3 for testing.</p>
                <button
                  onClick={() => {
                    resetUsage();
                    onUserUpdate();
                  }}
                  className="w-full py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Icon name="refresh" size={14} />
                  Reset to 0/3 Free Generations
                </button>
              </div>

              {/* Clear PRO */}
              <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
                <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                  <Icon name="logout" size={14} className="text-yellow-400" />
                  Clear PRO Access
                </h3>
                <p className="text-gray-500 text-xs mb-3">Remove current PRO/Admin status. User goes back to free tier.</p>
                <button
                  onClick={() => {
                    clearProAccess();
                    onUserUpdate();
                  }}
                  className="w-full py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Icon name="logout" size={14} />
                  Clear PRO / Logout
                </button>
              </div>

              {/* Clear Everything */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <h3 className="text-red-400 font-semibold text-sm mb-1 flex items-center gap-2">
                  <Icon name="trash" size={14} />
                  Clear All Data
                </h3>
                <p className="text-gray-500 text-xs mb-3">
                  {confirmClear
                    ? "Click again to confirm. This will delete ALL local data including partner codes."
                    : "Wipe everything — usage, PRO status, partner codes, all settings."
                  }
                </p>
                <button
                  onClick={handleClearAll}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    confirmClear
                      ? "bg-red-500/30 border border-red-500/50 text-red-300 animate-pulse"
                      : "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400"
                  }`}
                >
                  <Icon name={confirmClear ? "warning" : "trash"} size={14} />
                  {confirmClear ? "CONFIRM — Click to Delete Everything" : "Clear All Local Data"}
                </button>
                {confirmClear && (
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="w-full mt-2 py-2 text-gray-500 text-xs hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Quick Test Codes */}
              <div className="bg-gray-800/20 border border-gray-800 rounded-xl p-4">
                <h4 className="text-gray-500 font-medium text-xs mb-2">Quick Test</h4>
                <p className="text-gray-600 text-xs mb-3">Enter one of the built-in codes in the paywall screen to test PRO access.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      clearProAccess();
                      onUserUpdate();
                    }}
                    className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs rounded-lg transition-colors"
                  >
                    Simulate Free User
                  </button>
                  <button
                    onClick={() => {
                      redeemCode("RETHUMB-ADMIN");
                      onUserUpdate();
                    }}
                    className="flex-1 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs rounded-lg transition-colors border border-orange-500/20"
                  >
                    Simulate Admin
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
