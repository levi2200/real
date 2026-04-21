// usage.ts — Free trial counter (localStorage)

const USAGE_KEY = "rethumb_usage";
const MAX_FREE = 3;

export interface UsageData {
  count: number;
  lastGeneration: string | null;
}

export function getUsage(): UsageData {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return { count: 0, lastGeneration: null };
}

export function incrementUsage(): UsageData {
  const current = getUsage();
  const updated: UsageData = {
    count: current.count + 1,
    lastGeneration: new Date().toISOString(),
  };
  localStorage.setItem(USAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function isFreeUsageExhausted(): boolean {
  const { count } = getUsage();
  return count >= MAX_FREE;
}

export function getRemainingFree(): number {
  const { count } = getUsage();
  return Math.max(0, MAX_FREE - count);
}

export function getUsageCount(): number {
  return getUsage().count;
}

export function resetUsage(): void {
  localStorage.removeItem(USAGE_KEY);
}
