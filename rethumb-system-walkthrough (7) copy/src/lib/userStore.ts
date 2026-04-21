// userStore.ts — PRO access / partner codes / admin

import { useState, useCallback } from "react";

const PRO_KEY = "rethumb_pro";
const CODE_KEY = "rethumb_access_code";
const PARTNERS_KEY = "rethumb_partners";

// Built-in admin code (always valid)
const ADMIN_CODE = "RETHUMB-ADMIN";

export interface PartnerCode {
  code: string;
  label: string;
  createdAt: string;
}

export interface UserState {
  isPro: boolean;
  tier: string | null;
  label: string | null;
  accessCode: string | null;
}

// ─── PARTNER CODE MANAGEMENT ──────────────────────────────

export function getPartners(): PartnerCode[] {
  try {
    const raw = localStorage.getItem(PARTNERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function savePartners(partners: PartnerCode[]): void {
  localStorage.setItem(PARTNERS_KEY, JSON.stringify(partners));
}

export function addPartner(code: string, label: string): { success: boolean; message: string } {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return { success: false, message: "Code cannot be empty." };
  if (trimmed.length < 4) return { success: false, message: "Code must be at least 4 characters." };

  const partners = getPartners();
  if (partners.some((p) => p.code === trimmed)) {
    return { success: false, message: "This code already exists." };
  }

  partners.push({ code: trimmed, label, createdAt: new Date().toISOString() });
  savePartners(partners);
  return { success: true, message: `Partner code "${trimmed}" added successfully.` };
}

export function removePartner(code: string): void {
  const partners = getPartners().filter((p) => p.code !== code);
  savePartners(partners);
}

// ─── CODE VALIDATION ──────────────────────────────────────

function isValidCode(code: string): { valid: boolean; tier: string; label: string } | null {
  const upper = code.trim().toUpperCase();

  // Built-in admin code
  if (upper === ADMIN_CODE) {
    return { valid: true, tier: "admin", label: "Admin Access" };
  }

  // Check dynamic partner codes
  const partners = getPartners();
  const partner = partners.find((p) => p.code === upper);
  if (partner) {
    return { valid: true, tier: "partner", label: partner.label };
  }

  // Built-in legacy codes
  const builtIn: Record<string, { tier: string; label: string }> = {
    "RETHUMB-PRO-2024": { tier: "pro", label: "PRO Access" },
    "RETHUMB-BETA": { tier: "pro", label: "Beta Tester" },
    "RETHUMB-LIFETIME": { tier: "lifetime", label: "Lifetime PRO" },
  };

  if (builtIn[upper]) {
    return { valid: true, tier: builtIn[upper].tier, label: builtIn[upper].label };
  }

  return null;
}

// ─── USER STATE ───────────────────────────────────────────

export function getUserState(): UserState {
  try {
    const raw = localStorage.getItem(PRO_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch { /* ignore */ }
  return { isPro: false, tier: null, label: null, accessCode: null };
}

export function redeemCode(code: string): { success: boolean; message: string } {
  const result = isValidCode(code);
  if (!result) {
    return { success: false, message: "Invalid access code. Please try again." };
  }

  const state: UserState = {
    isPro: true,
    tier: result.tier,
    label: result.label,
    accessCode: code.trim().toUpperCase(),
  };

  localStorage.setItem(PRO_KEY, JSON.stringify(state));
  localStorage.setItem(CODE_KEY, code.trim().toUpperCase());
  return { success: true, message: `${result.label} activated! Enjoy unlimited generations.` };
}

export function clearProAccess(): void {
  localStorage.removeItem(PRO_KEY);
  localStorage.removeItem(CODE_KEY);
}

export function useUserStore() {
  const [user, setUser] = useState<UserState>(getUserState());

  const redeem = useCallback((code: string) => {
    const result = redeemCode(code);
    if (result.success) {
      setUser(getUserState());
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    clearProAccess();
    setUser({ isPro: false, tier: null, label: null, accessCode: null });
  }, []);

  return { user, redeem, logout };
}
