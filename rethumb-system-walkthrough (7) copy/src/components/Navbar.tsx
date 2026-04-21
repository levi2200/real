// Navbar.tsx — Glassmorphism top navigation bar with hidden admin trigger
import { useState, useRef } from "react";
import Icon from "./Icons";

interface NavbarProps {
  onAdminToggle: () => void;
  isPro: boolean;
  tier: string | null;
  onReplayTour?: () => void;
}

export default function Navbar({ onAdminToggle, isPro, tier, onReplayTour }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);

    if (clickCount.current >= 5) {
      clickCount.current = 0;
      onAdminToggle();
      return;
    }

    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 3000);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleLogoClick}>
            <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center font-black text-black text-lg shadow-lg shadow-orange-500/25 btn-glow">
              R
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Rethumb
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#styles" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Styles
            </a>
            <a href="#generator" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Generator
            </a>
            {onReplayTour && (
              <button
                onClick={onReplayTour}
                className="text-gray-500 hover:text-orange-400 transition-colors"
                title="Replay Tour"
              >
                <Icon name="helpCircle" size={18} />
              </button>
            )}
            {isPro && (
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/15 to-orange-500/15 border border-yellow-500/25 rounded-full text-yellow-400 text-xs font-bold flex items-center gap-1.5 badge-shimmer" style={{backgroundImage: 'linear-gradient(90deg, rgba(251,146,60,0.08), rgba(251,146,60,0.15), rgba(251,146,60,0.08))'}}>
                <Icon name={tier === "admin" ? "key" : "zap"} size={12} />
                {tier === "admin" ? "ADMIN" : "PRO"}
              </span>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2"
          >
            <Icon name={mobileOpen ? "x" : "menu"} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong border-b border-white/[0.04] px-4 pb-4 animate-fade-in">
          <a href="#styles" className="block py-2 text-gray-400 hover:text-white text-sm" onClick={() => setMobileOpen(false)}>Styles</a>
          <a href="#generator" className="block py-2 text-gray-400 hover:text-white text-sm" onClick={() => setMobileOpen(false)}>Generator</a>
          {onReplayTour && (
            <button
              onClick={() => { setMobileOpen(false); onReplayTour(); }}
              className="flex items-center gap-2 py-2 text-gray-400 hover:text-orange-400 text-sm w-full transition-colors"
            >
              <Icon name="helpCircle" size={16} />
              Replay Tour
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
