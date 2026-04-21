// App.tsx — Layout: Navbar + HomePage + Footer + AdminPanel + OnboardingTour

import { useState, useCallback, useEffect } from "react";
import Navbar from "./components/Navbar";
import AdminPanel from "./components/AdminPanel";
import OnboardingTour, { isTourDone } from "./components/OnboardingTour";
import HomePage from "./pages/HomePage";
import { useUserStore } from "./lib/userStore";

export default function App() {
  const { user, redeem, logout } = useUserStore();
  const [adminOpen, setAdminOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [tourOpen, setTourOpen] = useState(false);

  const handleAdminToggle = useCallback(() => {
    setAdminOpen((v) => !v);
  }, []);

  const handleUserUpdate = useCallback(() => {
    logout();
    setRefreshKey((k) => k + 1);
  }, [logout]);

  const handleReplayTour = useCallback(() => {
    setTourOpen(true);
  }, []);

  // Auto-show tour on first visit
  useEffect(() => {
    if (!isTourDone()) {
      const timer = setTimeout(() => setTourOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Hidden admin: detect #admin hash in URL
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#admin") {
        setAdminOpen(true);
        window.location.hash = "";
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      {/* Animated Background Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden bg-grid">
        {/* Floating orbs */}
        <div className="orb-1 absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-orange-500/[0.04] rounded-full blur-[100px]" />
        <div className="orb-2 absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-purple-500/[0.04] rounded-full blur-[100px]" />
        <div className="orb-3 absolute bottom-[10%] left-[40%] w-[350px] h-[350px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
        {/* Top gradient wash */}
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-orange-500/[0.03] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar
          onAdminToggle={handleAdminToggle}
          isPro={user.isPro}
          tier={user.tier}
          onReplayTour={handleReplayTour}
        />

        <HomePage key={refreshKey} user={user} onRedeemCode={redeem} />

        {/* Footer */}
        <footer className="border-t border-white/[0.04] py-12 mt-8 relative">
          <div className="absolute inset-0 bg-dots opacity-50" />
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center font-black text-black text-sm shadow-lg shadow-orange-500/20">
                  R
                </div>
                <span className="text-sm text-gray-500">
                  Rethumb — Cinematic Thumbnail Prompt Generator
                </span>
              </div>
              <div className="flex items-center gap-6 text-xs text-gray-600">
                <span>15 Styles</span>
                <span className="text-gray-800">/</span>
                <span>20+ Expressions</span>
                <span className="text-gray-800">/</span>
                <span>3 AI Platforms</span>
                <span className="text-gray-800">/</span>
                <span>Semantic Analysis v2.0</span>
              </div>
            </div>
            <div className="text-center mt-6 text-xs text-gray-700">
              &copy; {new Date().getFullYear()} Rethumb. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

      {/* Overlays */}
      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        onUserUpdate={handleUserUpdate}
      />
      <OnboardingTour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
      />
    </div>
  );
}
