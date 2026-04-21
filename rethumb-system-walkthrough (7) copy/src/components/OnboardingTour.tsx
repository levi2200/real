// OnboardingTour.tsx — First-time user walkthrough with spotlight tooltips
import { useState, useEffect, useCallback } from "react";
import Icon from "./Icons";

const TOUR_KEY = "rethumb_tour_done";
const TOUR_STEPS = [
  {
    targetId: null,
    title: "Welcome to Rethumb",
    body: "Generate cinematic YouTube thumbnail prompts in seconds. Our AI reads your video topic, detects the scene, emotion, and props — then builds a professional prompt ready for Midjourney, DALL·E, or Firefly.\n\nLet us show you how it works in 60 seconds.",
    icon: "sparkle" as const,
  },
  {
    targetId: "tour-styles",
    title: "1. Pick a Style",
    body: "Choose from 15 composition styles — or let AI auto-pick the best one. Each style controls the layout: split-screen, close-up, versus, documentary, and more. A live preview shows the composition below.",
    icon: "film" as const,
  },
  {
    targetId: "tour-topic",
    title: "2. Type Your Video Topic",
    body: "Enter your video title or topic. Be descriptive! The AI reads every word — 'luxury yacht', 'haunted house', 'accepted into Harvard' — each triggers different scenes, expressions, and props.\n\nHit the dice button for a random topic inspiration.",
    icon: "zap" as const,
  },
  {
    targetId: "tour-optional",
    title: "3. Optional Tweaks",
    body: "Custom Background: Describe exactly where you want the scene. Negative Prompt: Tell the AI what to avoid. Both are optional — the AI is smart enough on its own.",
    icon: "sliders" as const,
  },
  {
    targetId: "tour-settings",
    title: "4. Fine-Tune Settings",
    body: "Choose your content niche, the aspect ratio (16:9 for YouTube, 9:16 for Shorts/TikTok), and which AI platform you're targeting. Each platform gets optimized formatting.",
    icon: "settings" as const,
  },
  {
    targetId: "tour-generate",
    title: "5. Generate!",
    body: "Hit Generate Prompt for a single cinematic prompt, or Batch x3 to get 3 different style variations at once. You get 3 free generations — after that, upgrade to PRO for unlimited.\n\nRegenerate is always free — it creates new camera and lighting variations.",
    icon: "zap" as const,
  },
  {
    targetId: null,
    title: "You're Ready!",
    body: "That's it! Type a topic, pick a style, and hit Generate. The Semantic Analysis panel shows you exactly what the AI detected — scene, expression, prop, color grade, and lighting.\n\nClick the ? button in the navbar anytime to replay this tour.",
    icon: "check" as const,
  },
];

interface TourProps {
  open: boolean;
  onClose: () => void;
}

export default function OnboardingTour({ open, onClose }: TourProps) {
  const [step, setStep] = useState(0);
  const [spotRect, setSpotRect] = useState<DOMRect | null>(null);
  const [tipPos, setTipPos] = useState<"top" | "bottom" | "center">("center");

  const currentStep = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;
  const isFirst = step === 0;
  const isCenter = !currentStep.targetId;

  // Measure target element position
  const measureTarget = useCallback(() => {
    if (!currentStep.targetId) {
      setSpotRect(null);
      setTipPos("center");
      return;
    }
    const el = document.getElementById(currentStep.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setSpotRect(rect);
      // Position tooltip based on where the element is on screen
      if (rect.top > window.innerHeight * 0.45) {
        setTipPos("top");
      } else {
        setTipPos("bottom");
      }
    } else {
      setSpotRect(null);
      setTipPos("center");
    }
  }, [currentStep.targetId]);

  useEffect(() => {
    if (open) {
      setStep(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    measureTarget();
    window.addEventListener("resize", measureTarget);
    window.addEventListener("scroll", measureTarget, true);
    return () => {
      window.removeEventListener("resize", measureTarget);
      window.removeEventListener("scroll", measureTarget, true);
    };
  }, [open, step, measureTarget]);

  // Scroll target into view
  useEffect(() => {
    if (!open || !currentStep.targetId) return;
    const el = document.getElementById(currentStep.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(measureTarget, 400);
    }
  }, [open, step, currentStep.targetId, measureTarget]);

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem(TOUR_KEY, "1");
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) setStep((s) => s - 1);
  };

  const handleSkip = () => {
    localStorage.setItem(TOUR_KEY, "1");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Spotlight: box-shadow creates the dark overlay WITH a cutout */}
      {spotRect && !isCenter ? (
        <div
          className="absolute border-2 border-orange-400 rounded-xl transition-all duration-300 pointer-events-none"
          style={{
            top: spotRect.top - 10,
            left: spotRect.left - 10,
            width: spotRect.width + 20,
            height: spotRect.height + 20,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.75)",
          }}
        >
          {/* Corner indicators */}
          <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-orange-400 rounded-tl" />
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-orange-400 rounded-tr" />
          <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-orange-400 rounded-bl" />
          <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-orange-400 rounded-br" />
        </div>
      ) : (
        /* Full overlay for centered steps (no spotlight) */
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      )}

      {/* Tooltip Card */}
      <div
        className={`absolute transition-all duration-300 w-[380px] max-w-[92vw] ${
          isCenter
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            : "left-1/2 -translate-x-1/2"
        }`}
        style={
          !isCenter && spotRect
            ? tipPos === "top"
              ? { bottom: window.innerHeight - spotRect.top + 10 + 20, transform: "translateX(-50%)" }
              : { top: spotRect.bottom + 10 + 20, transform: "translateX(-50%)" }
            : undefined
        }
      >
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-b border-gray-800 px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400">
              <Icon name={currentStep.icon} size={22} />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">{currentStep.title}</h3>
              <p className="text-gray-500 text-xs">
                Step {step + 1} of {TOUR_STEPS.length}
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="ml-auto text-gray-500 hover:text-white transition-colors"
            >
              <Icon name="x" size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {currentStep.body}
            </p>
          </div>

          {/* Progress dots */}
          <div className="px-5 pb-2 flex justify-center gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-orange-400" : i < step ? "w-1.5 bg-orange-400/40" : "w-1.5 bg-gray-700"
                }`}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 flex items-center justify-between border-t border-gray-800">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Skip Tour
            </button>
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <Icon name="arrowLeft" size={14} />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-bold text-sm rounded-lg transition-all flex items-center gap-1.5"
              >
                {isLast ? "Got It!" : "Next"}
                {!isLast && <Icon name="arrowRight" size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility: check if tour has been completed
export function isTourDone(): boolean {
  return localStorage.getItem(TOUR_KEY) === "1";
}
