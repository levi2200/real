// PaywallModal.tsx — Premium glass paywall overlay

import { useState } from "react";
import Icon from "./Icons";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  onRedeem: (code: string) => { success: boolean; message: string };
  remaining: number;
}

const PAYPAL_URL = "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-0DW84387YH059613JNG74QAQ";

export default function PaywallModal({ open, onClose, onRedeem }: PaywallModalProps) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  if (!open) return null;

  const handleRedeem = () => {
    if (!code.trim()) return;
    const result = onRedeem(code);
    setMsg({ text: result.message, ok: result.success });
    if (result.success) {
      setTimeout(() => {
        onClose();
        setCode("");
        setMsg(null);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative glass-strong rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-black/50 animate-scale-in gradient-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.05]"
        >
          <Icon name="x" size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500/15 to-orange-500/15 border border-orange-500/20 flex items-center justify-center">
            <Icon name="lock" size={32} className="text-orange-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Free Trial Expired</h2>
          <p className="text-gray-400 text-sm">
            You've used all 3 free generations. Upgrade to PRO for unlimited access.
          </p>
        </div>

        {/* PRO Features */}
        <div className="bg-white/[0.03] rounded-2xl p-5 mb-6 border border-white/[0.04]">
          <h3 className="text-yellow-400 font-bold text-sm mb-3 flex items-center gap-2">
            <Icon name="zap" size={14} />
            PRO includes:
          </h3>
          <ul className="space-y-2.5 text-sm text-gray-300">
            {[
              "Unlimited prompt generations",
              "All 15 cinematic styles",
              "All AI platforms (Midjourney, DALL-E, Firefly)",
              "Semantic analysis engine",
              "Batch generation (x3)",
              "Priority support",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <Icon name="check" size={12} className="text-green-400" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* PayPal CTA */}
        <button
          className="w-full py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 text-black font-extrabold rounded-2xl btn-glow mb-5 flex items-center justify-center gap-2 text-base"
          onClick={() => window.open(PAYPAL_URL, "_blank")}
        >
          <Icon name="sparkle" size={20} />
          Subscribe — $2/month
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-gray-600 text-xs font-medium">or enter access code</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Access Code */}
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter access code..."
            className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
            onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
          />
          <button
            onClick={handleRedeem}
            className="px-6 py-3 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-orange-500/30 text-white font-semibold rounded-xl transition-all text-sm"
          >
            Redeem
          </button>
        </div>

        {msg && (
          <p className={`mt-3 text-sm text-center font-medium ${msg.ok ? "text-green-400" : "text-red-400"}`}>
            {msg.text}
          </p>
        )}
      </div>
    </div>
  );
}
