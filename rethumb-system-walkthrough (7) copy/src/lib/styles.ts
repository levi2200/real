// MASTER PROMPT BUILDER V5 — all 14 templates + smart auto pick + batch + negative prompt

import {
  analyseTopic,
  applyPostProcessing,
  getOrientation,
  getArFlag,
  type AnalysisResult,
} from "./cinema";

const FACE_COMP =
  "face front-facing, well lit, neutral skin tone — will be replaced in post-production";

function orientation(ar: string): string {
  return getOrientation(ar);
}

// ─── COMPOSITION PREVIEW LAYOUTS ─────────────────────────
// Each style has a visual layout type for the preview component
export type LayoutType = "full" | "split-v" | "split-diagonal" | "closeup" | "split-compare" | "center-chaos" | "left-data" | "handheld" | "split-era" | "tilted" | "versus" | "card" | "poster";

export const COMPOSITION_LAYOUTS: Record<string, { type: LayoutType; label: string; desc: string }> = {
  auto:         { type: "full",         label: "Auto",         desc: "AI picks the best layout" },
  mrbeast:      { type: "full",         label: "Full Scene",   desc: "Subject in environment with bold title" },
  hunter:       { type: "split-v",      label: "Split",        desc: "Left: dark scene / Right: reaction" },
  caught:       { type: "full",         label: "Caught",       desc: "Subject caught off-guard, police lights" },
  splitnight:   { type: "split-diagonal", label: "Torn Split", desc: "Diagonal torn paper — location vs creator" },
  confession:   { type: "closeup",      label: "Close-up",     desc: "Face fills 80%, overhead spotlight" },
  beforeafter:  { type: "split-compare", label: "Compare",     desc: "Left: before / Right: after" },
  overwhelmed:  { type: "center-chaos", label: "Center Chaos", desc: "Face center, chaos exploding behind" },
  revenue:      { type: "left-data",    label: "Data + Face",  desc: "Creator left, financial data right" },
  documentary:  { type: "handheld",     label: "Handheld",     desc: "Natural documentary, evidence board" },
  historical:   { type: "split-era",    label: "Era Split",    desc: "Historical recreation vs modern reaction" },
  horror_suspense: { type: "tilted",    label: "Tilted",       desc: "Dutch tilt 15°, terror, implied threat" },
  versus_battle: { type: "versus",      label: "Versus",       desc: "Two subjects, explosive center divider" },
  fc_gaming:    { type: "card",         label: "Card",         desc: "FUT card frame, holographic foil" },
  wanted_thriller: { type: "poster",    label: "Poster",       desc: "Aged wanted poster, surveillance aesthetic" },
};

export const STYLES = [
  { id: "auto", icon: "auto", name: "Auto Pick", desc: "AI selects the best style for your topic" },
  { id: "mrbeast", icon: "trophy", name: "MrBeast Survival", desc: "Full cinematic scene with bold title" },
  { id: "hunter", icon: "search", name: "Hunter / Expose", desc: "Split panel — dark mystery vs reaction" },
  { id: "caught", icon: "siren", name: "Caught In Act", desc: "Red/blue police light split" },
  { id: "splitnight", icon: "moon", name: "Split Scene Night", desc: "Torn paper split — location vs creator" },
  { id: "confession", icon: "candle", name: "Dark Confession", desc: "Extreme close-up, overhead spotlight" },
  { id: "beforeafter", icon: "bolt", name: "Before vs After", desc: "Transformation split with lightning crack" },
  { id: "overwhelmed", icon: "shock", name: "Overwhelmed", desc: "Home Alone pose, chaos, fisheye" },
  { id: "revenue", icon: "dollar", name: "Revenue Reveal", desc: "Financial data floating, money raining" },
  { id: "documentary", icon: "clipboard", name: "Documentary", desc: "Investigative journalism, evidence board" },
  { id: "historical", icon: "columns", name: "Historical Epic", desc: "Split panel — historical vs modern" },
  { id: "horror_suspense", icon: "ghost", name: "Horror Suspense", desc: "Extreme terror, Dutch tilt" },
  { id: "versus_battle", icon: "swords", name: "Versus Battle", desc: "Two subjects, explosive center" },
  { id: "fc_gaming", icon: "football", name: "FC Gaming", desc: "FUT card aesthetic, holographic foil" },
  { id: "wanted_thriller", icon: "target", name: "Wanted Thriller", desc: "Aged wanted poster, surveillance" },
];

// ─── AUTO PICK — 4-tier priority system ──────────────────
function pickAutoStyle(a: AnalysisResult): string {
  const t = a.topic.toLowerCase();
  const m = a.modifiers;
  const cat = a.scene.category;

  // ── TIER 1: Strong modifier energy ──
  if (m.scary || m.decay || a.energy === "terrified") return "horror_suspense";
  if (m.sad || a.energy === "emotional") return "confession";
  if (m.angry) return "versus_battle";
  if (m.funny) return "overwhelmed";
  if (m.cute) return "mrbeast";
  if (m.hidden || m.exclusive || a.energy === "suspicious" || a.energy === "secretive") return "hunter";
  if (m.achievement) return "mrbeast";
  if (m.wealth && !m.negative) return "revenue";
  if (m.negative && m.positive) return "beforeafter";
  if (m.cheap) return "beforeafter";
  if (m.extreme || a.energy === "disbelief") return "overwhelmed";
  if (m.risk || a.energy === "fear") {
    if (cat === "jungle" || cat === "survival" || cat === "water" || cat === "mountain" || cat === "animal_danger") return "mrbeast";
    return "horror_suspense";
  }

  // ── TIER 2: Scene category ──
  if (cat === "gaming") return "fc_gaming";
  if (cat === "horror") return "horror_suspense";
  if (cat === "crime" || cat === "prison") return "wanted_thriller";
  if (cat === "money" || cat === "water_wealth") return "revenue";
  if (cat === "ancient") return "historical";
  if (cat === "school" || cat === "hospital") return "mrbeast";
  if (cat === "music") return "overwhelmed";
  if (cat === "fashion" || cat === "shopping") return "mrbeast";
  if (cat === "car") return "versus_battle";
  if (cat === "food") return "mrbeast";
  if (cat === "tech" || cat === "product" || cat === "science") return "overwhelmed";
  if (cat === "sports" || cat === "victory" || cat === "military") return "versus_battle";
  if (cat === "beach" || cat === "travel") return "mrbeast";
  if (cat === "animal_danger") return "horror_suspense";
  if (cat === "animal" || cat === "animal_cute") return "mrbeast";
  if (cat === "emotion") return "confession";
  if (cat === "defeat") return "beforeafter";
  if (cat === "discovery") return "hunter";
  if (cat === "exploration") return "splitnight";
  if (cat === "challenge") return "mrbeast";
  if (cat === "wedding") return "mrbeast";
  if (cat === "fantasy") return "mrbeast";
  if (cat === "nature" || cat === "home") return "mrbeast";
  if (cat === "art") return "mrbeast";
  if (cat === "social") return "overwhelmed";
  if (cat === "building") return "mrbeast";

  // ── TIER 3: Keyword matching ──
  if (/\b(fc|fifa|fut|pack|squad)\\b/.test(t)) return "fc_gaming";
  if (/\b(history|war|empire|king|queen|kingdom)\\b/.test(t)) return "historical";
  if (/\b(documentary|investigation|expose|exposed|truth)\\b/.test(t)) return "documentary";
  if (/\b(wanted|missing|disappear|fugitive)\\b/.test(t)) return "wanted_thriller";
  if (/\b(vs|versus|battle|against|fight|face off)\\b/.test(t)) return "versus_battle";
  if (/\b(ghost|haunted|horror|demon|paranormal)\\b/.test(t)) return "horror_suspense";
  if (/\b(secret|expose|truth|conspiracy|lie|liar)\\b/.test(t)) return "hunter";
  if (/\b(money|rich|million|billion|cash|profit)\\b/.test(t)) return "revenue";
  if (/\b(before|after|transform|then vs now|glow up)\\b/.test(t)) return "beforeafter";
  if (/\b(confess|admit|sorry|i need to tell|coming clean)\\b/.test(t)) return "confession";
  if (/\b(night|private|trespass|sneak|breaking in|after dark)\\b/.test(t)) return "splitnight";
  if (/\b(survive|jungle|island|wild|100 days|challenge)\\b/.test(t)) return "mrbeast";
  if (/\b(caught|busted|red handed|exposed)\\b/.test(t)) return "caught";
  if (/\b(prank|funny|hilarious|fail|stupid)\\b/.test(t)) return "overwhelmed";
  if (/\b(unbox|unboxing|reveal|opening|bought)\\b/.test(t)) return "mrbeast";
  if (/\b(review|rating|roasting|worst|best)\\b/.test(t)) return "overwhelmed";
  if (/\b(accepted|admitted|graduated|scholarship)\\b/.test(t)) return "mrbeast";

  // ── TIER 4: Energy fallback ──
  if (a.energy === "triumphant") return "mrbeast";
  if (a.energy === "explosive") return "overwhelmed";
  if (a.energy === "fear") return "horror_suspense";
  if (a.energy === "isolated") return "confession";
  if (a.energy === "nervous") return "mrbeast";

  return "mrbeast";
}

// ─── STYLE TEMPLATES ────────────────────────────────────

function buildMrBeast(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic cinematic YouTube thumbnail photograph.
VIDEO TITLE: "${a.topic}"

SUBJECT: Young male creator with ${a.expression}. ${a.prop}. Wearing casual streetwear slightly disheveled.
FACE COMPOSITING: ${FACE_COMP}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg}
TIME: ${a.scene.time || "Golden hour"}
ATMOSPHERE: ${a.scene.atmosphere || "Cinematic narrative tension"}

${a.titleIntegration}

LIGHTING: ${a.lighting} ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. Atmospheric dust + lens flare.
TECHNICAL: ${orientation(ar)}. ${a.camera}. ISO 800 film grain.

--ar ${getArFlag(ar)} --v 6 --style raw --q 2`;
}

function buildHunter(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic investigative YouTube thumbnail.
VIDEO TITLE: "${a.topic}"

SUBJECT: Creator with ${a.expression}, dark hoodie, round glasses catching light, holding flashlight aimed at something shocking.
FACE COMPOSITING: ${FACE_COMP}

COMPOSITION: Perfect vertical split down center.
LEFT HALF: ${a.scene.bg} rendered dark and mysterious — heavy shadows, underexposed.
RIGHT HALF: Creator up close, hard spotlight, reacting with ${a.expression}

GRAPHIC: Red circle highlight. Faint "THE TRUTH" text. ${a.titleIntegration}
LIGHTING: Hard moody teal-orange grade. ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. Desaturated shadows. Paranoid atmosphere.
TECHNICAL: ${orientation(ar)}. ${a.camera}.

--ar ${getArFlag(ar)} --v 6 --style raw`;
}

function buildCaught(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic high-tension "caught in the act" thumbnail.
VIDEO TITLE: "${a.topic}"

SUBJECT: Creator caught off-guard, body turning toward camera. ${a.expression}. ${a.prop}. One hand raised to cover mouth.
FACE COMPOSITING: ${FACE_COMP}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg} — chaotic, blurred with motion. Red and blue flashing police lights cast split-color wash.

${a.titleIntegration}
LIGHTING: Harsh split — red gel left, blue gel right. Bright overhead spotlight. ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. Heavy vignette. Chromatic aberration.
TECHNICAL: Camera slightly below eye level tilted up 15 degrees. ${orientation(ar)}. ${a.camera}.

--ar ${getArFlag(ar)} --v 6 --style raw`;
}

function buildSplitNight(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic cinematic split-panel night mystery thumbnail.
VIDEO TITLE: "${a.topic}"

COMPOSITION: Torn-paper / ripped photograph effect running diagonally upper-left to lower-right. Rough fibers, curl, depth shadow.

LEFT PANEL — THE LOCATION:
${a.scene.bg} at night, full moon, mist, ground fog. Forbidden/restricted area.

RIGHT PANEL — THE CREATOR:
${a.expression}. Flashlight illuminating face from below — horror underglow. Dark hoodie. Finger pressed to lips in "shhh" gesture.

${a.titleIntegration}
LIGHTING: Full moon cold blue-silver for location. Flashlight warm amber for creator. ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. Deep teal midnight atmosphere.
TECHNICAL: 24mm wide for location. 50mm portrait for creator. Both f/1.4.

--ar ${getArFlag(ar)} --v 6 --style raw`;
}

function buildConfession(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic intimate dark confession thumbnail.
VIDEO TITLE: "${a.topic}"

SUBJECT: Creator leaning extremely close to camera — nearly whispering. ${a.expression}. Hand cupped near mouth.
FACE COMPOSITING: ${FACE_COMP}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg} — pushed almost to pure black. Wisps of smoke catch the spotlight.

${a.titleIntegration}
LIGHTING: Single spotlight from directly overhead at 90 degrees. Hard top-light only. Strong shadows under brows, nose, chin. Halo on crown. Below collarbone = complete darkness. ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. Maximum intimacy and claustrophobic presence.
TECHNICAL: Face fills 80% of frame. Slight upward tilt 10 degrees. ${orientation(ar)}. ${a.camera}.

--ar ${getArFlag(ar)} --v 6 --style raw`;
}

function buildBeforeAfter(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic dramatic transformation before/after thumbnail.
VIDEO TITLE: "${a.topic}"

COMPOSITION: Clean vertical split. LEFT = BEFORE. RIGHT = AFTER. Lightning bolt energy crack between panels.

LEFT PANEL (BEFORE):
Same creator — defeated posture, shoulders curved, head down. Devastation, tired eyes. Flat unflattering lighting. Cold desaturated blue-grey. Background: ${a.scene.bg} at its most bleak.

RIGHT PANEL (AFTER):
Same creator — powerful upright stance. ${a.expression}. ${a.prop}. Strong cinematic key light. Vibrant warm color. Same background now at its most epic.

${a.titleIntegration}
LIGHTING: BEFORE: flat grey single weak frontal light. AFTER: ${a.lighting}. ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. "BEFORE" and "AFTER" labels integrated.
TECHNICAL: Clean studio composite. 50mm lens. ${orientation(ar)}. ${a.camera}.

--ar ${getArFlag(ar)} --v 6 --style raw`;
}

function buildOverwhelmed(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic overwhelming chaos reaction thumbnail.
VIDEO TITLE: "${a.topic}"

SUBJECT: Creator dead center. ${a.expression}. Both hands pressed flat against cheeks — Home Alone pose. Bright solid-color clothing.
FACE COMPOSITING: ${FACE_COMP}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg} — total visual chaos. Dozens of objects flying outward like a detonating explosion. Spinning objects, flying papers. Bright warm backlight burst creating halo.

${a.titleIntegration}
LIGHTING: Bright high-key frontal flash on subject. Warm explosive backlight. Slightly overexposed. ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. Maximum saturation. Motion-blurred background.
TECHNICAL: Extreme fisheye warping. Face at exact geometric center. ${orientation(ar)}. ${a.camera}.

--ar ${getArFlag(ar)} --v 6 --style raw --q 2`;
}

function buildRevenue(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic wealth and revenue reveal thumbnail.
VIDEO TITLE: "${a.topic}"

SUBJECT: Creator positioned left of center, pointing at floating financial data. ${a.expression}. ${a.prop}. Well-dressed — fitted shirt or slim blazer.
FACE COMPOSITING: ${FACE_COMP}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg}
Bold dollar amounts floating as 3D volumetric elements. Rising bar charts. Money raining from above catching warm light.

${a.titleIntegration}
LIGHTING: ${a.lighting}. Gold and emerald green tones. Numbers emit own glow. ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. Creator fills left 60%. Financial data fills right 40%.
TECHNICAL: ${orientation(ar)}. ${a.camera}.

--ar ${getArFlag(ar)} --v 6 --style raw`;
}

function buildDocumentary(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic cinematic documentary-style thumbnail.
VIDEO TITLE: "${a.topic}"

SUBJECT: Creator in authentic documentary pose — handheld camera energy, caught in a real moment. ${a.expression}. ${a.prop}. Field jacket or neutral urban wear.
FACE COMPOSITING: ${FACE_COMP}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg}
Evidence board visible — photographs, red string, handwritten notes, timestamps, classified stamps. Active investigation feel.

${a.titleIntegration}
LIGHTING: Soft available light mixed with one practical source. ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. Slight handheld grain. Desaturated midtones. Journalism grade.
TECHNICAL: 35mm lens, pulled focus, naturalistic framing — witnessed not staged. ${orientation(ar)}. ${a.camera}.

--ar ${getArFlag(ar)} --v 6 --style raw`;
}

function buildHistorical(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic epic historical thumbnail.
VIDEO TITLE: "${a.topic}"

COMPOSITION: Split panel — historical recreation vs modern creator reacting.

HISTORICAL SIDE:
${a.scene.bg}
Epic scale, dramatic golden hour or stormy lighting. Period-accurate architecture, clothing, lighting.

CREATOR SIDE:
Modern creator with ${a.expression}. ${a.prop}. Confronting incomprehensible scale of history.
FACE COMPOSITING: ${FACE_COMP}

${a.titleIntegration}
LIGHTING: Historical = period-accurate natural light. Creator = ${a.lighting}. ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. Atmospheric depth haze. History brought to life.
TECHNICAL: ${orientation(ar)}. ${a.camera}.

--ar ${getArFlag(ar)} --v 6 --style raw`;
}

function buildHorrorSuspense(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic horror suspense thumbnail.
VIDEO TITLE: "${a.topic}"

SUBJECT: Creator in extreme terror. ${a.expression}. Body pressed against wall or recoiling backward. Pale skin, wide eyes. ${a.prop}.
FACE COMPOSITING: ${FACE_COMP}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg}
Something deeply wrong in the background — a shape in darkness, figure at window, door that shouldn't be open. Threat implied not shown.

${a.titleIntegration}
LIGHTING: Single cold moonlight from above. Something glowing unnaturally. Absolute darkness in corners. ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. Deep crushed blacks. Ice cold temperature. Heavy grain.
TECHNICAL: Dutch tilt 15 degrees off horizontal = visual unease. ${orientation(ar)}. ${a.camera}.

--ar ${getArFlag(ar)} --v 6 --style raw`;
}

function buildVersusBattle(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic epic versus battle thumbnail.
VIDEO TITLE: "${a.topic}"

COMPOSITION: Two subjects facing each other — explosive center divider (lightning bolt / fire wall / energy crack).

LEFT SIDE (CHALLENGER):
Creator — ${a.expression}. Aggressive stance. ${a.prop}. Maximum competitive energy.
FACE COMPOSITING: ${FACE_COMP}

RIGHT SIDE (OPPONENT):
Opposing element — equally powerful visual presence. Mirror energy but opposing color temperature.

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg} — intense arena or battleground.
${a.titleIntegration}
LIGHTING: Each side lit from own direction — warm vs cool split. Center destruction element = violent light. ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. Maximum contrast. Color of competition.
TECHNICAL: Perfect symmetrical composition with explosive center. ${orientation(ar)}. ${a.camera}.

--ar ${getArFlag(ar)} --v 6 --style raw`;
}

function buildFcGaming(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic FC / FIFA gaming thumbnail.
VIDEO TITLE: "${a.topic}"

COMPOSITION: FUT card aesthetic — Ultimate Team card frame. Holographic foil effects, player stats visible. Pack-opening golden light explosion.

SUBJECT: Creator positioned as player card — powerful athletic stance. ${a.expression}. ${a.prop}. Kit colors matching referenced club/nation.
FACE COMPOSITING: ${FACE_COMP}

BACKGROUND: ${a.scene.bg}
Neon gaming arena behind card. Pack-opening golden light rays. Particle effects + digital data streaming. Scattered blurred cards.

${a.titleIntegration}
LIGHTING: Dramatic golden overhead light — guaranteed TOTY pull. Electric blue-green neon from below. ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. Holographic metallic sheen. Maximum saturation.
TECHNICAL: ${orientation(ar)}. ${a.camera}.

--ar ${getArFlag(ar)} --v 6 --style raw`;
}

function buildWantedThriller(a: AnalysisResult, ar: string): string {
  return `Hyper-realistic wanted poster thriller thumbnail.
VIDEO TITLE: "${a.topic}"

COMPOSITION: Aged wanted poster — worn paper texture, printed photograph, official stamps, reward amount in heavy serif type. Executed as hyper-realistic photograph.

SUBJECT: Creator in mug shot / surveillance photo style. ${a.expression}. ${a.prop}. Slightly disheveled — someone on the run.
FACE COMPOSITING: ${FACE_COMP}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg} — rendered as printed photograph behind worn paper. WANTED in massive distressed letters.

${a.titleIntegration}
LIGHTING: Harsh single-source surveillance lighting — unflattering, revealing. ${a.lightingVariation}
COLOR GRADE: ${a.colorGrade}. Aged sepia-to-modern split. Heavy grain and distress.
TECHNICAL: Surveillance camera aesthetic — barrel distortion, date/time stamp, case number. ${orientation(ar)}. ${a.camera}.

--ar ${getArFlag(ar)} --v 6 --style raw`;
}

// ─── MAIN BUILD FUNCTION ────────────────────────────────
const BUILDERS: Record<string, (a: AnalysisResult, ar: string) => string> = {
  mrbeast: buildMrBeast,
  hunter: buildHunter,
  caught: buildCaught,
  splitnight: buildSplitNight,
  confession: buildConfession,
  beforeafter: buildBeforeAfter,
  overwhelmed: buildOverwhelmed,
  revenue: buildRevenue,
  documentary: buildDocumentary,
  historical: buildHistorical,
  horror_suspense: buildHorrorSuspense,
  versus_battle: buildVersusBattle,
  fc_gaming: buildFcGaming,
  wanted_thriller: buildWantedThriller,
};

export function buildPrompt(
  topic: string,
  styleId: string,
  aspectRatio: string,
  platform: string,
  customBg?: string,
  negativePrompt?: string
): { prompt: string; analysis: AnalysisResult; chosenStyle: string } {
  const analysis = analyseTopic(topic, customBg);
  let chosenStyle = styleId;

  if (styleId === "auto") {
    chosenStyle = pickAutoStyle(analysis);
  }

  const builder = BUILDERS[chosenStyle] || buildMrBeast;
  let rawPrompt = builder(analysis, aspectRatio);

  // Append negative prompt if provided
  if (negativePrompt && negativePrompt.trim()) {
    rawPrompt += `\n\nNEGATIVE PROMPT — AVOID ALL OF THE FOLLOWING:\n${negativePrompt.trim()}\nDo not include any of the elements listed above. Exclude them completely from the generated image.`;
  }

  const prompt = applyPostProcessing(rawPrompt, platform);

  return { prompt, analysis, chosenStyle };
}

// ─── BATCH GENERATION — 3 diverse style variations ──────
const DIVERSE_STYLE_SETS: string[][] = [
  ["mrbeast", "overwhelmed", "hunter"],
  ["mrbeast", "splitnight", "documentary"],
  ["overwhelmed", "revenue", "horror_suspense"],
  ["mrbeast", "versus_battle", "beforeafter"],
  ["hunter", "confession", "caught"],
  ["overwhelmed", "fc_gaming", "wanted_thriller"],
  ["mrbeast", "historical", "caught"],
  ["revenue", "beforeafter", "documentary"],
];

export interface BatchResult {
  prompts: { prompt: string; styleId: string; styleName: string; analysis: AnalysisResult }[];
}

export function buildBatchPrompts(
  topic: string,
  aspectRatio: string,
  platform: string,
  customBg?: string,
  negativePrompt?: string
): BatchResult {
  const analysis = analyseTopic(topic, customBg);
  const autoStyle = pickAutoStyle(analysis);

  // Pick a diverse set that always includes the auto-selected style
  let styleSet: string[] = [];
  for (const set of DIVERSE_STYLE_SETS) {
    if (set.includes(autoStyle)) {
      styleSet = [...set];
      break;
    }
  }
  if (styleSet.length === 0) {
    styleSet = [autoStyle, "overwhelmed", "hunter"];
  }

  // Replace first item with auto style if not already there
  if (styleSet[0] !== autoStyle) {
    styleSet = [autoStyle, ...styleSet.filter(s => s !== autoStyle).slice(0, 2)];
  }

  const results = styleSet.slice(0, 3).map(styleId => {
    const builder = BUILDERS[styleId] || buildMrBeast;
    let rawPrompt = builder(analysis, aspectRatio);

    if (negativePrompt && negativePrompt.trim()) {
      rawPrompt += `\n\nNEGATIVE PROMPT — AVOID ALL OF THE FOLLOWING:\n${negativePrompt.trim()}\nDo not include any of the elements listed above. Exclude them completely from the generated image.`;
    }

    const prompt = applyPostProcessing(rawPrompt, platform);
    const styleName = STYLES.find(s => s.id === styleId)?.name || styleId;

    return { prompt, styleId, styleName, analysis };
  });

  return { prompts: results };
}

// ─── RANDOM TOPICS ──────────────────────────────────────
export const RANDOM_TOPICS: string[] = [
  "I Survived 100 Days on a Luxury Yacht",
  "I Spent 24 Hours in a Haunted Mansion",
  "I Bought the Most Expensive iPhone in the World",
  "I Tried Every Item on the McDonald's Menu",
  "I Built a Secret Room Under My House",
  "I Got Accepted Into Harvard and Here's How",
  "I Lived Like a Billionaire for 7 Days",
  "I Survived 50 Hours in the Amazon Rainforest",
  "I Played FIFA for 48 Hours Straight",
  "I Found a Hidden Room in My New Apartment",
  "I Paid People $10,000 to Quit Their Jobs",
  "I Explored an Abandoned Hospital at Night",
  "I Trained Like a Navy SEAL for 30 Days",
  "I Ate Only $1 Food for a Whole Week",
  "I Got Lost in Tokyo With No Money",
  "I Challenged a Chess Grandmaster",
  "I Flew First Class for the First Time",
  "I Went Undercover in a Luxury Store",
  "I Built a Gaming PC Using Only Used Parts",
  "I Tried to Survive on a Deserted Island",
  "I Spent 24 Hours in a Prison Cell",
  "I Cooked a Michelin Star Meal at Home",
  "I Drove a Ferrari for the First Time",
  "I Visited the Most Dangerous Neighborhood",
  "I Learned to Code in 7 Days",
  "I Had the Best Day of My Life",
  "I Found Out My Best Friend Was Lying",
  "I Became a Professional Boxer for a Day",
  "I Climbed Mount Everest Base Camp",
  "I Attended a Secret Underground Party",
  "I Tested the Cheapest vs Most Expensive Sneakers",
  "I Swam with Great White Sharks",
  "I Tried Every Extreme Sport in One Week",
  "I Won $50,000 at a Poker Tournament",
  "I Infiltrated a Secret Society",
  "I Survived 24 Hours in the Desert",
  "I Got the Ultimate Revenge on My Bully",
  "I Lived in a Van for 30 Days",
  "I Crashed a Wedding in Dubai",
  "I Replaced My Boss for a Day",
  "I Discovered an Ancient Temple",
  "I Stayed in the Most Expensive Hotel Room",
  "I Went to Space in VR for 24 Hours",
  "I Fought a Professional MMA Fighter",
  "I Unboxed a $100,000 Mystery Box",
  "I Ate at Every Michelin Star Restaurant",
  "I Survived a Real Zombie Apocalypse Simulation",
  "I Went on the Scariest Rollercoaster in the World",
  "I Learned Every Language in 30 Days",
  "I Became TikTok Famous Overnight",
];
