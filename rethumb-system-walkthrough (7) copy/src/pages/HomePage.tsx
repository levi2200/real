// HomePage.tsx — Premium UI with all features
// Batch Generate, Random Topic, Copy Toast, Negative Prompt, Composition Preview

import { useState, useRef, useEffect } from "react";
import { STYLES, buildPrompt, buildBatchPrompts, RANDOM_TOPICS, COMPOSITION_LAYOUTS, type BatchResult } from "../lib/styles";
import { isFreeUsageExhausted, getRemainingFree, incrementUsage } from "../lib/usage";
import { type UserState } from "../lib/userStore";
import { type AnalysisResult } from "../lib/cinema";
import StyleCard from "../components/StyleCard";
import PaywallModal from "../components/PaywallModal";
import Icon from "../components/Icons";

interface HomePageProps {
  user: UserState;
  onRedeemCode: (code: string) => { success: boolean; message: string };
}

const NICHES = [
  "Entertainment", "Gaming", "Tech", "Finance", "Food",
  "Sports", "Education", "Music", "Travel", "Vlogs",
  "Comedy", "Horror", "Fitness", "Fashion",
];

const ASPECT_RATIOS = ["16:9", "9:16", "4:5", "1:1"];
const PLATFORMS = [
  { id: "midjourney", name: "Midjourney", icon: "midjourney" as const },
  { id: "dalle", name: "DALL-E", icon: "dalle" as const },
  { id: "firefly", name: "Firefly", icon: "firefly" as const },
];

export default function HomePage({ user, onRedeemCode }: HomePageProps) {
  const [selectedStyle, setSelectedStyle] = useState("auto");
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("Entertainment");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [platform, setPlatform] = useState("midjourney");
  const [customBg, setCustomBg] = useState("");
  const [showBgSection, setShowBgSection] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [showNegSection, setShowNegSection] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [chosenStyle, setChosenStyle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const [batchResults, setBatchResults] = useState<BatchResult | null>(null);
  const [batchTab, setBatchTab] = useState(0);
  const [showBatch, setShowBatch] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [remaining, setRemaining] = useState(getRemainingFree());

  const isRegen = useRef(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleRandomTopic = () => {
    const randomIdx = Math.floor(Math.random() * RANDOM_TOPICS.length);
    setTopic(RANDOM_TOPICS[randomIdx]);
  };

  const handleGenerate = () => {
    if (!topic.trim()) return;
    const isRegeneration = isRegen.current;
    isRegen.current = false;

    if (!isRegeneration && !user.isPro && isFreeUsageExhausted()) {
      setShowPaywall(true);
      return;
    }

    setIsGenerating(true);
    setShowBatch(false);
    setBatchResults(null);

    setTimeout(() => {
      const result = buildPrompt(topic, selectedStyle, aspectRatio, platform, customBg.trim() || undefined, negativePrompt.trim() || undefined);
      setPrompt(result.prompt);
      setAnalysis(result.analysis);
      setChosenStyle(result.chosenStyle);
      setShowAnalysis(true);

      if (!isRegeneration && !user.isPro) {
        incrementUsage();
        setRemaining(getRemainingFree());
      }
      setIsGenerating(false);
    }, 600);
  };

  const handleBatchGenerate = () => {
    if (!topic.trim()) return;
    if (!user.isPro && isFreeUsageExhausted()) {
      setShowPaywall(true);
      return;
    }

    setIsGenerating(true);
    setPrompt("");
    setBatchResults(null);

    setTimeout(() => {
      const result = buildBatchPrompts(topic, aspectRatio, platform, customBg.trim() || undefined, negativePrompt.trim() || undefined);
      setBatchResults(result);
      setBatchTab(0);
      setShowBatch(true);
      setAnalysis(result.prompts[0].analysis);
      setChosenStyle(result.prompts[0].styleId);
      setShowAnalysis(true);

      if (!user.isPro) {
        incrementUsage();
        setRemaining(getRemainingFree());
      }
      setIsGenerating(false);
    }, 800);
  };

  const handleRegenerate = () => {
    if (!prompt && !showBatch) return;
    isRegen.current = true;
    if (showBatch && batchResults) {
      const result = buildBatchPrompts(topic, aspectRatio, platform, customBg.trim() || undefined, negativePrompt.trim() || undefined);
      setBatchResults(result);
      setBatchTab(0);
      setAnalysis(result.prompts[0].analysis);
      setChosenStyle(result.prompts[0].styleId);
    } else {
      handleGenerate();
    }
  };

  const handleCopy = async (textToCopy?: string) => {
    const text = textToCopy || prompt;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Copied to clipboard!");
    }
  };

  useEffect(() => {
    if (showBatch && batchResults) {
      const el = document.getElementById("batch-tab-" + batchTab);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [batchTab, showBatch, batchResults]);

  return (
    <div className="min-h-screen pt-20">
      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-slideDown">
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl shadow-2xl shadow-green-500/30">
            <Icon name="check" size={18} />
            {toast}
          </div>
        </div>
      )}

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden py-24 sm:py-36">
        {/* Hero background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-500/[0.07] rounded-full blur-[120px] orb-1" />
          <div className="absolute top-1/3 right-1/5 w-[400px] h-[400px] bg-purple-500/[0.05] rounded-full blur-[100px] orb-2" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-orange-500/[0.03] to-transparent" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 glass rounded-full text-orange-400 text-xs font-semibold mb-8 animate-hero-text border-orange-500/20">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            Semantic Analysis Engine v2.0
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-8 animate-hero-text-delay">
            Generate{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent animate-gradient-text">
              Cinematic
            </span>
            <br />
            Thumbnail Prompts
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed animate-hero-text-delay2">
            Type your video topic. Our AI reads every word, detects the scene, emotion, props, and builds a
            professional thumbnail prompt in seconds.
          </p>

          {/* Intelligence Legend */}
           <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto animate-hero-text-delay2">
            {[
              { num: "20+", label: "Expressions", icon: "shock" as const },
              { num: "34", label: "Cameras", icon: "camera" as const },
              { num: "25", label: "Lighting", icon: "sun" as const },
              { num: "14", label: "Styles", icon: "film" as const },
              { num: "30+", label: "Color Grades", icon: "palette" as const },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-2xl p-4 stat-card gradient-border"
              >
                <div className="text-orange-400 mb-2 flex justify-center"><Icon name={stat.icon} size={28} /></div>
                <div className="text-2xl font-black text-white">{stat.num}</div>
                <div className="text-gray-500 text-xs font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STYLE PICKER ═══════ */}
      <section id="styles" className="max-w-7xl mx-auto px-4 py-16">
        <div id="tour-styles">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Choose Your Style</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">Select a composition style or let AI pick the best one for your topic</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {STYLES.map((style) => (
              <div key={style.id} className="relative">
                <StyleCard
                  id={style.id}
                  icon={style.icon}
                  name={style.name}
                  desc={style.desc}
                  selected={selectedStyle === style.id}
                  onClick={() => setSelectedStyle(style.id)}
                />
                {selectedStyle === style.id && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-orange-500/15 border border-orange-500/25 rounded-full text-orange-400 text-[10px] font-semibold whitespace-nowrap">
                      <Icon name="layout" size={10} />
                      {COMPOSITION_LAYOUTS[style.id]?.label || "Full"}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Composition Preview */}
          {selectedStyle && (
            <div className="mt-10 flex justify-center animate-fade-in">
              <div className="glass rounded-2xl p-6 max-w-md w-full gradient-border">
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="eye" size={16} className="text-orange-400" />
                  <span className="text-sm font-semibold text-white">Composition Preview</span>
                  <span className="text-xs text-gray-500 ml-auto">{COMPOSITION_LAYOUTS[selectedStyle]?.label}</span>
                </div>
                <CompositionPreview type={COMPOSITION_LAYOUTS[selectedStyle]?.type || "full"} />
                <p className="text-xs text-gray-500 mt-4 text-center">{COMPOSITION_LAYOUTS[selectedStyle]?.desc}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ GENERATOR ═══════ */}
      <section id="generator" className="max-w-4xl mx-auto px-4 py-12">
        <div className="glass-strong rounded-3xl p-6 sm:p-10 gradient-border">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Icon name="zap" size={20} className="text-black" />
              </div>
              Prompt Generator
            </h2>
            {!user.isPro && (
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${remaining > 1 ? "bg-green-500/10 text-green-400 border border-green-500/20" : remaining === 1 ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                  {remaining}/3 free
                </div>
              </div>
            )}
          </div>

          {/* Topic Input */}
          <div className="mb-5" id="tour-topic">
            <label className="block text-sm font-semibold text-gray-300 mb-2">Video Topic</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder='e.g. "I Survived 100 Days on a Luxury Yacht"'
                className="flex-1 px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white placeholder-gray-600 text-base focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <button
                type="button"
                onClick={handleRandomTopic}
                title="Random Topic"
                className="px-5 py-4 bg-white/[0.04] border border-white/[0.08] hover:border-orange-500/30 hover:bg-orange-500/5 rounded-2xl text-gray-400 hover:text-orange-400 transition-all flex items-center gap-2 shrink-0"
              >
                <Icon name="dice" size={20} />
                <span className="hidden sm:inline text-sm font-medium">Surprise Me</span>
              </button>
            </div>
          </div>

          {/* Custom Background */}
          <div id="tour-optional" className="mb-5">
            <button
              type="button"
              onClick={() => setShowBgSection(!showBgSection)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors mb-2"
            >
              <Icon name="image" size={16} />
              <span>{showBgSection ? "Hide" : "Add"} Custom Background (Optional)</span>
              <svg className={`w-4 h-4 transition-transform ${showBgSection ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showBgSection && (
              <div className="space-y-3 animate-fade-in">
                <textarea
                  value={customBg}
                  onChange={(e) => setCustomBg(e.target.value)}
                  placeholder='Describe your ideal background... e.g. "Inside a neon-lit Tokyo alley at night with rain reflections"'
                  rows={3}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all resize-none"
                />
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Luxury penthouse at night with city lights",
                    "Neon-lit Tokyo street with rain",
                    "Ancient Egyptian temple at golden hour",
                    "Gaming arena with LED screens",
                    "Dark warehouse with single spotlight",
                    "Tropical beach with crystal water",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setCustomBg(suggestion)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                        customBg === suggestion
                          ? "bg-orange-500/15 border border-orange-500/30 text-orange-400"
                          : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-gray-300 hover:border-white/[0.12]"
                      }`}
                    >
                      {suggestion.length > 35 ? suggestion.slice(0, 35) + "..." : suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Negative Prompt */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setShowNegSection(!showNegSection)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors mb-2"
            >
              <Icon name="minus" size={16} />
              <span>{showNegSection ? "Hide" : "Add"} Negative Prompt (Optional)</span>
              <svg className={`w-4 h-4 transition-transform ${showNegSection ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showNegSection && (
              <div className="space-y-3 animate-fade-in">
                <textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder='What to AVOID... e.g. "no text overlay, no blur, no cartoon style"'
                  rows={2}
                  className="w-full px-4 py-3 bg-red-950/10 border border-red-500/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/30 focus:ring-1 focus:ring-red-500/15 transition-all resize-none"
                />
                <div className="flex items-start gap-2">
                  <Icon name="info" size={14} className="text-gray-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Describe what you don't want. This gets appended as a negative prompt.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "no text, no watermarks",
                    "no blur, no noise",
                    "no cartoon style",
                    "no dark lighting",
                    "no multiple people",
                    "no childish elements",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setNegativePrompt(prev => prev ? prev + ", " + suggestion : suggestion)}
                      className="px-2.5 py-1 bg-red-500/5 border border-red-500/10 rounded-lg text-xs text-red-400/70 hover:text-red-400 hover:border-red-500/25 transition-all"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Row */}
          <div id="tour-settings" className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Niche</label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500/40 appearance-none cursor-pointer"
              >
                {NICHES.map((n) => <option key={n} value={n} className="bg-gray-900">{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500/40 appearance-none cursor-pointer"
              >
                {ASPECT_RATIOS.map((r) => <option key={r} value={r} className="bg-gray-900">{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">AI Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500/40 appearance-none cursor-pointer"
              >
                {PLATFORMS.map((p) => <option key={p.id} value={p.id} className="bg-gray-900">{p.name}</option>)}
              </select>
            </div>
          </div>

          {/* Generate Buttons */}
          <div id="tour-generate" className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="flex-1 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 text-black font-extrabold text-base rounded-2xl btn-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Icon name="zap" size={20} />
                  Generate Prompt
                </>
              )}
            </button>
            <button
              onClick={handleBatchGenerate}
              disabled={isGenerating || !topic.trim()}
              className="px-6 py-4 bg-white/[0.04] border border-white/[0.08] hover:border-purple-500/30 hover:bg-purple-500/5 text-gray-300 hover:text-purple-400 font-bold text-sm rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Icon name="layers" size={18} />
              <span className="hidden sm:inline">Batch x3</span>
              <span className="sm:hidden">x3</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ OUTPUT — SINGLE ═══════ */}
      {prompt && !showBatch && (
        <section className="max-w-4xl mx-auto px-4 pb-12 animate-slide-up">
          {/* Analysis Panel */}
          {showAnalysis && analysis && (
            <AnalysisPanel analysis={analysis} chosenStyle={chosenStyle} show={showAnalysis} onToggle={() => setShowAnalysis(!showAnalysis)} />
          )}

          {/* Prompt Output */}
          <div className="glass-strong rounded-3xl p-6 sm:p-8 output-glow gradient-border">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                Generated Prompt
              </h3>
              <button
                onClick={() => handleCopy()}
                className="px-5 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-orange-500/30 text-gray-300 hover:text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
              >
                <Icon name="copy" size={14} />
                Copy
              </button>
            </div>
            <pre className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto bg-black/20 rounded-2xl p-5 border border-white/[0.03]">
              {prompt}
            </pre>
          </div>

          {/* Regenerate */}
          <div className="mt-4">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-white/[0.03] border border-white/[0.06] hover:border-orange-500/25 hover:bg-orange-500/[0.03] text-gray-400 hover:text-orange-400 font-bold text-sm rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Icon name="refresh" size={18} />
              Regenerate — Free
              <span className="text-xs text-gray-600 font-normal ml-1">(new camera + lighting variations)</span>
            </button>
          </div>
        </section>
      )}

      {/* ═══════ OUTPUT — BATCH ═══════ */}
      {showBatch && batchResults && (
        <section className="max-w-4xl mx-auto px-4 pb-12 animate-slide-up">
          {showAnalysis && analysis && (
            <AnalysisPanel analysis={analysis} chosenStyle={chosenStyle} show={showAnalysis} onToggle={() => setShowAnalysis(!showAnalysis)} />
          )}

          {/* Batch Tabs */}
          <div className="flex gap-2 mb-4">
            {batchResults.prompts.map((bp, idx) => (
              <button
                key={bp.styleId}
                id={"batch-tab-" + idx}
                onClick={() => {
                  setBatchTab(idx);
                  setAnalysis(bp.analysis);
                  setChosenStyle(bp.styleId);
                }}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  batchTab === idx
                    ? "bg-gradient-to-r from-purple-500/15 to-blue-500/15 border-2 border-purple-500/30 text-purple-400"
                    : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:border-gray-700 hover:text-gray-300"
                }`}
              >
                <Icon name={STYLES.find(s => s.id === bp.styleId)?.icon as any || "auto"} size={16} />
                {bp.styleName}
              </button>
            ))}
          </div>

          {/* Active Batch Prompt */}
          <div className="glass-strong rounded-3xl p-6 sm:p-8 output-glow gradient-border">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Icon name="layers" size={14} className="text-purple-400" />
                Variation {batchTab + 1} of 3
              </h3>
              <button
                onClick={() => handleCopy(batchResults.prompts[batchTab]?.prompt)}
                className="px-5 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-purple-500/30 text-gray-300 hover:text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
              >
                <Icon name="copy" size={14} />
                Copy
              </button>
            </div>
            <pre className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto bg-black/20 rounded-2xl p-5 border border-white/[0.03]">
              {batchResults.prompts[batchTab]?.prompt}
            </pre>
          </div>

          {/* Batch Regenerate */}
          <div className="mt-4">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/25 hover:bg-purple-500/[0.03] text-gray-400 hover:text-purple-400 font-bold text-sm rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Icon name="refresh" size={18} />
              Regenerate All 3 — Free
              <span className="text-xs text-gray-600 font-normal ml-1">(new camera + lighting variations)</span>
            </button>
          </div>
        </section>
      )}

      {/* PAYWALL */}
      <PaywallModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        onRedeem={onRedeemCode}
        remaining={remaining}
      />
    </div>
  );
}

// ─── ANALYSIS PANEL ──────────────────────────────────────
function AnalysisPanel({ analysis, chosenStyle, show, onToggle }: {
  analysis: AnalysisResult;
  chosenStyle: string;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="glass rounded-3xl p-6 mb-4 gradient-border">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-green-500/15 flex items-center justify-center">
            <Icon name="info" size={14} className="text-green-400" />
          </div>
          Semantic Analysis
          <span className="text-xs px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full font-semibold">
            Detected
          </span>
        </h3>
        <button onClick={onToggle} className="text-gray-500 hover:text-white text-sm transition-colors px-3 py-1 rounded-lg hover:bg-white/[0.05]">
          {show ? "Hide" : "Show"}
        </button>
      </div>

      {show && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
          <AnalysisBadge label="Style Used" value={STYLES.find((s) => s.id === chosenStyle)?.name || chosenStyle} />
          <AnalysisBadge label="Energy" value={analysis.energy} />
          <AnalysisBadge label="Scene Category" value={analysis.scene.category} />
          <AnalysisBadge label="Location" value={truncate(analysis.scene.location, 60)} />
          <AnalysisBadge label="Expression" value={truncate(analysis.expression, 60)} />
          <AnalysisBadge label="Prop" value={truncate(analysis.prop, 60)} />
          <AnalysisBadge label="Color Grade" value={truncate(analysis.colorGrade, 50)} />
          <AnalysisBadge label="Lighting" value={truncate(analysis.lighting, 50)} />

          {analysis.customBg && (
            <div className="col-span-2 sm:col-span-3 mt-2">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Icon name="image" size={12} className="text-blue-400" />
                Custom Background Applied:
              </p>
              <p className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/15 rounded-xl p-3 leading-relaxed">
                {analysis.customBg}
              </p>
            </div>
          )}

          {analysis.detectedAdjectives && analysis.detectedAdjectives.length > 0 && (
            <div className="col-span-2 sm:col-span-3 mt-2">
              <p className="text-xs text-gray-500 mb-2">Detected Adjectives:</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.detectedAdjectives.map((adj) => (
                  <span key={adj} className="px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold capitalize">
                    {adj}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="col-span-2 sm:col-span-3 mt-1">
            <p className="text-xs text-gray-500 mb-2">Active Modifiers:</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(analysis.modifiers).map(([key, val]) => (
                val && (
                  <span key={key} className="px-2.5 py-1 bg-orange-500/8 border border-orange-500/15 text-orange-400 rounded-lg text-xs font-mono">
                    {key}: {String(val)}
                  </span>
                )
              ))}
              {Object.keys(analysis.modifiers).filter((k) => analysis.modifiers[k as keyof typeof analysis.modifiers]).length === 0 && (
                <span className="text-gray-600 text-xs">No modifiers detected — using defaults</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMPOSITION PREVIEW ─────────────────────────────────
function CompositionPreview({ type }: { type: string }) {
  const base = "w-full h-36 rounded-xl overflow-hidden flex";

  switch (type) {
    case "split-v":
      return (
        <div className={base}>
          <div className="w-1/2 bg-white/[0.03] flex items-center justify-center border-r border-white/[0.06]">
            <div className="space-y-1 text-center">
              <div className="w-8 h-8 bg-blue-500/15 rounded-full mx-auto" />
              <div className="w-12 h-1.5 bg-white/[0.06] rounded mx-auto" />
              <div className="w-10 h-1 bg-white/[0.04] rounded mx-auto" />
            </div>
          </div>
          <div className="w-1/2 bg-white/[0.02] flex items-center justify-center">
            <div className="space-y-1 text-center">
              <div className="w-10 h-10 bg-orange-500/15 rounded-full mx-auto" />
              <div className="w-12 h-1.5 bg-white/[0.06] rounded mx-auto" />
            </div>
          </div>
        </div>
      );

    case "split-diagonal":
      return (
        <div className={`${base} relative`}>
          <div className="absolute inset-0 bg-white/[0.02] flex items-center justify-center">
            <div className="space-y-1 text-center mt-4">
              <div className="w-8 h-8 bg-blue-500/15 rounded-full mx-auto" />
              <div className="w-10 h-1 bg-white/[0.04] rounded mx-auto" />
            </div>
          </div>
          <div className="absolute inset-0 bg-white/[0.04]" style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 20% 100%)" }}>
            <div className="flex items-center justify-center h-full">
              <div className="space-y-1 text-center">
                <div className="w-10 h-10 bg-orange-500/15 rounded-full mx-auto" />
                <div className="w-12 h-1.5 bg-white/[0.06] rounded mx-auto" />
              </div>
            </div>
          </div>
          <div className="absolute inset-0" style={{ clipPath: "polygon(58% 0, 62% 0, 22% 100%, 18% 100%)", background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 4px)" }} />
        </div>
      );

    case "closeup":
      return (
        <div className={`${base} items-center justify-center bg-black/30`}>
          <div className="relative">
            <div className="w-20 h-24 bg-white/[0.06] rounded-full mx-auto" />
            <div className="w-16 h-16 bg-orange-500/15 rounded-full mx-auto -mt-2" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-yellow-500/15 rounded-full -mt-4" />
          </div>
        </div>
      );

    case "split-compare":
      return (
        <div className={base}>
          <div className="w-1/2 bg-white/[0.02] flex items-center justify-center border-r border-dashed border-white/[0.08]">
            <div className="space-y-1 text-center">
              <div className="w-8 h-10 bg-blue-500/10 rounded mx-auto" />
              <div className="w-8 h-1 bg-white/[0.04] rounded mx-auto" />
              <span className="text-[8px] text-gray-600 uppercase">Before</span>
            </div>
          </div>
          <div className="w-[2px] bg-gradient-to-b from-yellow-500/40 via-orange-500/50 to-yellow-500/40" />
          <div className="flex-1 bg-white/[0.03] flex items-center justify-center">
            <div className="space-y-1 text-center">
              <div className="w-8 h-10 bg-orange-500/15 rounded mx-auto" />
              <div className="w-8 h-1 bg-white/[0.06] rounded mx-auto" />
              <span className="text-[8px] text-gray-600 uppercase">After</span>
            </div>
          </div>
        </div>
      );

    case "center-chaos":
      return (
        <div className={`${base} items-center justify-center bg-white/[0.02] relative`}>
          {[
            { top: 8, left: 15, rot: 12 },
            { top: 5, right: 20, rot: -8 },
            { bottom: 10, left: 25, rot: 20 },
            { bottom: 15, right: 15, rot: -15 },
            { top: 30, left: 5, rot: 5 },
            { top: 25, right: 8, rot: -20 },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-orange-500/15 rounded-sm"
              style={{ ...pos, transform: `rotate(${pos.rot}deg)` }}
            />
          ))}
          <div className="w-12 h-12 bg-orange-500/15 rounded-full z-10 flex items-center justify-center border border-orange-500/20">
            <div className="w-2 h-2 bg-orange-400 rounded-full" />
          </div>
        </div>
      );

    case "left-data":
      return (
        <div className={base}>
          <div className="w-3/5 bg-white/[0.02] flex items-center justify-center">
            <div className="w-10 h-10 bg-orange-500/15 rounded-full" />
          </div>
          <div className="flex-1 bg-white/[0.03] flex flex-col items-start justify-center gap-2 px-4">
            <div className="w-14 h-2 bg-green-500/20 rounded" />
            <div className="w-12 h-2 bg-green-500/15 rounded" />
            <div className="w-10 h-2 bg-green-500/10 rounded" />
            <div className="w-6 h-4 bg-green-500/15 rounded text-center" />
          </div>
        </div>
      );

    case "handheld":
      return (
        <div className={`${base} bg-white/[0.02] relative`}>
          <div className="w-14 h-16 bg-orange-500/10 rounded absolute left-6 top-4" />
          <div className="absolute right-4 top-2 space-y-1.5">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500/20 rounded-full" />
              <div className="w-8 h-0.5 bg-red-500/15" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500/20 rounded-full" />
              <div className="w-6 h-0.5 bg-red-500/15" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500/20 rounded-full" />
              <div className="w-10 h-0.5 bg-red-500/15" />
            </div>
          </div>
        </div>
      );

    case "split-era":
      return (
        <div className={base}>
          <div className="w-1/2 bg-amber-900/10 flex items-center justify-center border-r border-amber-500/15">
            <div className="space-y-1 text-center">
              <div className="w-8 h-8 bg-amber-500/15 rounded mx-auto" />
              <div className="w-10 h-1.5 bg-amber-500/8 rounded mx-auto" />
              <span className="text-[8px] text-amber-600">Era</span>
            </div>
          </div>
          <div className="w-1/2 bg-white/[0.02] flex items-center justify-center">
            <div className="space-y-1 text-center">
              <div className="w-8 h-8 bg-orange-500/15 rounded-full mx-auto" />
              <div className="w-10 h-1.5 bg-white/[0.06] rounded mx-auto" />
              <span className="text-[8px] text-gray-600">Modern</span>
            </div>
          </div>
        </div>
      );

    case "tilted":
      return (
        <div className={`${base} items-center justify-center bg-black/20`} style={{ transform: "rotate(-3deg)" }}>
          <div className="space-y-1 text-center">
            <div className="w-10 h-12 bg-white/[0.06] rounded mx-auto" />
            <div className="w-3 h-3 bg-red-500/20 rounded-full mx-auto -mt-8 -ml-8 relative" />
          </div>
        </div>
      );

    case "versus":
      return (
        <div className={base}>
          <div className="w-[42%] bg-red-500/5 flex items-center justify-center">
            <div className="w-8 h-8 bg-red-500/15 rounded-full" />
          </div>
          <div className="w-[16%] bg-gradient-to-b from-yellow-500/20 via-orange-500/30 to-yellow-500/20 flex items-center justify-center">
            <div className="w-2 h-8 bg-orange-500/40 rounded-full" />
          </div>
          <div className="flex-1 bg-blue-500/5 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500/15 rounded-full" />
          </div>
        </div>
      );

    case "card":
      return (
        <div className={`${base} items-center justify-center bg-white/[0.02]`}>
          <div className="w-20 h-28 bg-gradient-to-b from-yellow-500/15 to-purple-500/15 rounded-lg border border-yellow-500/20 flex items-center justify-center">
            <div className="space-y-1 text-center">
              <div className="w-8 h-8 bg-orange-500/15 rounded-full mx-auto" />
              <div className="w-12 h-1 bg-yellow-500/15 rounded mx-auto" />
              <div className="flex gap-1 justify-center">
                <div className="w-3 h-1 bg-yellow-500/10 rounded" />
                <div className="w-3 h-1 bg-yellow-500/10 rounded" />
                <div className="w-3 h-1 bg-yellow-500/10 rounded" />
              </div>
            </div>
          </div>
        </div>
      );

    case "poster":
      return (
        <div className={`${base} items-center justify-center bg-amber-900/5`}>
          <div className="w-24 h-32 bg-white/[0.03] rounded border border-amber-500/15 relative p-2">
            <div className="w-6 h-1 bg-red-500/20 absolute top-2 right-2 rounded" />
            <div className="text-[7px] text-amber-600 text-center mt-1 font-bold tracking-wider">WANTED</div>
            <div className="w-8 h-10 bg-white/[0.06] rounded mx-auto mt-1" />
            <div className="w-12 h-1 bg-amber-500/8 rounded mx-auto mt-1" />
            <div className="w-10 h-0.5 bg-amber-500/6 rounded mx-auto mt-0.5" />
          </div>
        </div>
      );

    default:
      return (
        <div className={`${base} bg-white/[0.02] relative`}>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 space-y-1">
            <div className="w-16 h-2 bg-orange-500/15 rounded mx-auto" />
            <div className="w-12 h-1.5 bg-white/[0.06] rounded mx-auto" />
          </div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
            <div className="w-10 h-14 bg-orange-500/10 rounded-full" />
          </div>
        </div>
      );
  }
}

// ─── HELPERS ──────────────────────────────────────────────
function AnalysisBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.04]">
      <p className="text-gray-500 text-xs mb-1 font-medium">{label}</p>
      <p className="text-white text-xs font-semibold leading-tight">{value}</p>
    </div>
  );
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max) + "...";
}
