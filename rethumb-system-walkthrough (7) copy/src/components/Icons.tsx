// Icons.tsx — SVG traced icons (no emojis)

type IconName =
  | "auto" | "trophy" | "search" | "siren" | "moon" | "candle"
  | "bolt" | "shock" | "dollar" | "clipboard" | "columns"
  | "ghost" | "swords" | "football" | "target"
  | "sparkle" | "camera" | "film" | "palette" | "lock"
  | "check" | "copy" | "refresh" | "x" | "menu"
  | "key" | "shield" | "plus" | "trash" | "users"
  | "settings" | "info" | "chevronDown" | "externalLink"
  | "zap" | "regen" | "midjourney" | "dalle" | "firefly"
  | "warning" | "delete" | "logout" | "image"
  | "dice" | "layers" | "layout" | "minus" | "eye" | "sliders"
  | "helpCircle" | "arrowRight" | "arrowLeft" | "sun";

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export default function Icon({ name, className = "", size = 20 }: IconProps) {
  const s = size;
  const props = { className, width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (name) {
    case "auto":
      return <svg {...props}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z"/></svg>;
    case "trophy":
      return <svg {...props}><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>;
    case "search":
      return <svg {...props}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>;
    case "siren":
      return <svg {...props}><path d="M2 20h20"/><path d="M5 20V9a7 7 0 0114 0v11"/><path d="M12 2v2"/><path d="M4.2 4.2l1.4 1.4"/><path d="M18.4 4.2l-1.4 1.4"/><path d="M12 9v4"/><circle cx="12" cy="16" r="1"/></svg>;
    case "moon":
      return <svg {...props}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/><path d="M8 10l2 2-2 2"/><path d="M14 10l2 2-2 2"/></svg>;
    case "candle":
      return <svg {...props}><path d="M12 2c-1.5 2-3.5 3-3.5 5a3.5 3.5 0 007 0C15.5 5 13.5 4 12 2z"/><rect x="9" y="12" width="6" height="10" rx="1"/><line x1="12" y1="12" x2="12" y2="9"/></svg>;
    case "bolt":
      return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "shock":
      return <svg {...props}><circle cx="12" cy="12" r="10"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M8 16h8"/><path d="M9 16v2"/><path d="M15 16v2"/></svg>;
    case "dollar":
      return <svg {...props}><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
    case "clipboard":
      return <svg {...props}><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="14" y2="16"/></svg>;
    case "columns":
      return <svg {...props}><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/></svg>;
    case "ghost":
      return <svg {...props}><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 00-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 00-8-8z"/></svg>;
    case "swords":
      return <svg {...props}><line x1="4" y1="20" x2="20" y2="4"/><line x1="4" y1="4" x2="8" y2="8"/><line x1="20" y1="20" x2="16" y2="16"/><line x1="8" y1="4" x2="4" y2="8"/><line x1="16" y1="20" x2="20" y2="16"/></svg>;
    case "football":
      return <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10"/><path d="M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>;
    case "target":
      return <svg {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case "sparkle":
      return <svg {...props}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z"/></svg>;
    case "camera":
      return <svg {...props}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
    case "film":
      return <svg {...props}><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>;
    case "palette":
      return <svg {...props}><circle cx="13.5" cy="6.5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="8.5" cy="18" r="2"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.04-.23-.29-.38-.63-.38-1.03 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.17-4.36-9-10-9z"/></svg>;
    case "lock":
      return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
    case "check":
      return <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>;
    case "copy":
      return <svg {...props}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>;
    case "refresh":
      return <svg {...props}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>;
    case "x":
      return <svg {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case "menu":
      return <svg {...props}><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
    case "key":
      return <svg {...props}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.78 7.78 5.5 5.5 0 017.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
    case "shield":
      return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "plus":
      return <svg {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "trash":
      return <svg {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>;
    case "users":
      return <svg {...props}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
    case "info":
      return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
    case "chevronDown":
      return <svg {...props}><polyline points="6 9 12 15 18 9"/></svg>;
    case "externalLink":
      return <svg {...props}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
    case "zap":
      return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "regen":
      return <svg {...props}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>;
    case "midjourney":
      return <svg {...props}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z"/></svg>;
    case "dalle":
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
    case "firefly":
      return <svg {...props}><path d="M12 2c-2 3-5 5.5-5 9a5 5 0 0010 0c0-3.5-3-6-5-9z"/><path d="M12 22v-4"/><path d="M10 18h4"/></svg>;
    case "warning":
      return <svg {...props}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case "delete":
      return <svg {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>;
    case "logout":
      return <svg {...props}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
    case "image":
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
    case "dice":
      return <svg {...props}><rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/></svg>;
    case "layers":
      return <svg {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
    case "layout":
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="9" x2="9" y2="21"/></svg>;
    case "minus":
      return <svg {...props}><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "eye":
      return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "sliders":
      return <svg {...props}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>;
    case "helpCircle":
      return <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case "arrowRight":
      return <svg {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    case "arrowLeft":
      return <svg {...props}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
    case "sun":
      return <svg {...props}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
  }
}

// Map style IDs to their icon names
export const STYLE_ICONS: Record<string, IconName> = {
  auto: "auto",
  mrbeast: "trophy",
  hunter: "search",
  caught: "siren",
  splitnight: "moon",
  confession: "candle",
  beforeafter: "bolt",
  overwhelmed: "shock",
  revenue: "dollar",
  documentary: "clipboard",
  historical: "columns",
  horror_suspense: "ghost",
  versus_battle: "swords",
  fc_gaming: "football",
  wanted_thriller: "target",
};
