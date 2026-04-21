// SEMANTIC ANALYSIS ENGINE V5
// Context-first: extract subject → determine context → drive everything from context

export interface Modifiers {
  wealth?: boolean;
  prestige?: boolean;
  exclusive?: boolean;
  decay?: boolean;
  scale?: string;
  negative?: boolean;
  positive?: boolean;
  hidden?: boolean;
  extreme?: boolean;
  risk?: boolean;
  historical?: boolean;
  milestone?: boolean;
  ending?: boolean;
  scary?: boolean;
  funny?: boolean;
  sad?: boolean;
  angry?: boolean;
  cute?: boolean;
  cheap?: boolean;
  intense?: boolean;
  achievement?: boolean;
}

export interface Scene {
  location: string;
  bg: string;
  time?: string;
  atmosphere?: string;
  category: string;
}

export interface AnalysisResult {
  topic: string;
  modifiers: Modifiers;
  energy: string;
  detectedAdjectives: string[];
  scene: Scene;
  expression: string;
  prop: string;
  colorGrade: string;
  lighting: string;
  camera: string;
  lightingVariation: string;
  titleIntegration: string;
  customBg?: string;
}

// ─── CAMERA VARIATIONS ─────────────────────────────────
const CAMERA_VARIATIONS = [
  // Ultra-wide / Fisheye
  "Shot on Sony A7 IV, 14mm ultra-wide fisheye, extreme barrel distortion, f/1.4",
  "Shot on GoPro Hero 12 Black ultra-wide, extreme proximity, fisheye look, immersive POV",
  "Shot on Canon R5 with 8-15mm fisheye zoom, full circular fisheye, edge-to-edge distortion, f/2.8",
  // Anamorphic / Cinema
  "Shot on RED V-Raptor, 12mm anamorphic, cinematic 2.39:1 compression, horizontal flare, f/2.0",
  "Shot on ARRI Alexa Mini LF, 18mm master prime, true cinema quality, shallow depth of field, f/1.8",
  "Shot on Sony Venice 2, 25mm anamorphic, organic lens breathing, warm skin tones, f/2.2",
  // Photojournalistic / Raw
  "Shot on Canon R5, 16mm ultra-wide, f/2.0, photojournalistic raw energy, natural grain",
  "Shot on Nikon Z9, 24mm, fast autofocus lock, reportage style, captured moment energy, f/1.8",
  // Low Angle / Dramatic
  "Shot on Sony FX3, 24mm, low angle from ground level looking up at subject, dramatic power perspective, f/1.4",
  "Shot on Canon R3, 20mm, camera positioned at knee height tilted up 20 degrees, heroic proportions, f/2.0",
  // Bird's Eye / Drone
  "Shot on DJI Inspire 3, Zenmuse X9, 90-degree overhead bird's-eye view, looking straight down, gimbal stabilized",
  "Shot on DJI Mavic 3 Pro, 45-degree high angle sweep, sweeping environmental context, aerial cinematic",
  // Dutch Tilt / Tension
  "Shot on Blackmagic URSA Mini Pro 12K, 35mm, Dutch tilt 15-20 degrees off horizontal, psychological tension, f/2.8",
  "Shot on Sony A7S III, 28mm, extreme Dutch angle 30 degrees, disorienting, maximum unease, f/1.4",
  // Close-up / Portrait
  "Shot on Canon R5 with RF 85mm f/1.2 L, extreme close-up, tight on face, bokeh master, eye-tracking lock",
  "Shot on Hasselblad X2D 100C, 65mm f/2.8, medium format skin detail, incredible texture resolution",
  "Shot on Sony A1, 135mm f/1.8 GM, compressed portrait, beautiful background separation, creamy bokeh",
  // Wide / Establishing
  "Shot on Leica SL2, 21mm Summilux, wide establishing shot, environmental storytelling, f/1.4",
  "Shot on Fujifilm GFX 100S, 23mm, medium format wide angle, incredible dynamic range, cinematic color",
  // Over-the-shoulder / Immersive
  "Shot on Sony A7 IV, 35mm f/1.4 GM, over-the-shoulder perspective, subject seen from behind another person",
  "Shot on Canon R6 II, 28mm, slightly off-axis, three-quarter angle, natural documentary framing, f/2.0",
  // Worm's Eye / Extreme Low
  "Shot on Nikon Z8, 14mm, worm's-eye view, camera literally on ground pointing up, towering perspective, f/1.8",
  "Shot on Sony FX6, 16mm, ground-level worm's eye, dramatic ceiling/extend sky, f/2.0",
  // Telephoto / Compressed
  "Shot on Canon R3 with RF 200mm f/2 L, telephoto compression, subject isolated from background, f/2.0",
  "Shot on Sony A1 with 70-200mm f/2.8 GM, 200mm end, flattened perspective, subject pops from background",
  // POV / First-person
  "Shot on Insta360 X3, first-person POV, chest-mounted, subject's own hands visible reaching forward",
  "Shot on GoPro Hero 12, head-mounted POV, seeing exactly what the subject sees, maximum immersion",
  // Crane / Jib
  "Shot on Sony Venice 2 on Technocrane, 24mm, high-angle sweeping crane shot, slow descent toward subject, f/2.0",
  "Shot on ARRI Alexa 35 on Scorpio telescoping crane, 35mm, sweeping overhead to eye-level reveal, cinematic motion",
  // Reflection / Creative
  "Shot through a mirror reflection, Canon C300 Mark III, 50mm, subject seen in mirror, depth layers, f/2.0",
  "Shot through water puddle reflection, Nikon Z9, 35mm, subject reflected in rain-soaked ground, inverted symmetry, f/2.8",
  // Surveillance / Voyeuristic
  "Shot in CCTV surveillance style, fixed 6mm lens, slight barrel distortion, timestamp overlay feel, unflattering angle",
  "Shot through a partially open door frame, Canon R5, 50mm, voyeuristic framing, subject unaware, natural behavior, f/1.8",
  // Macro / Detail
  "Shot on Canon R5 with RF 100mm f/2.8 L Macro, extreme close-up on details, shallow DOF, texture visible",
  // Split Diopter
  "Shot on ARRI Alexa 65 with split-focus diopter, foreground and background both in razor focus, impossible depth",
];

// ─── LIGHTING VARIATIONS ────────────────────────────────
const LIGHTING_VARIATIONS = [
  // Classic Studio
  "Single hard key light from upper-left at 45\u00B0 creating classic Rembrandt triangle shadow under opposite eye",
  "Soft diffused large-source front light creating luxury beauty lighting, even and flattering",
  "Split lighting — one half of face brightly lit, other half in deep shadow, dramatic contrast",
  // Natural / Golden Hour
  "Golden hour backlight creating intense glowing rim halo around subject's hair and shoulders, warm haze",
  "Natural window light from the left, soft directional falloff, painterly quality, gentle shadows",
  "Late afternoon sun low and warm, long dramatic shadows stretching across the ground, amber glow",
  // Edge / Rim
  "Strong edge rim lighting from behind — subject silhouetted with bright outline, dark center, mysterious",
  "Dual rim lights from both sides at 120 degrees, bright edges framing the subject against dark background",
  // Under / Horror
  "Under-lighting from below — horror campfire effect, unnatural upward shadows on face, eerie and unsettling",
  "Single cold moonlight from directly above, pale blue-white, deep shadows under all facial planes",
  // Colored / Neon
  "Multiple colored practical lights — warm orange left, cool cyan right, creating complex mixed-color shadows",
  "Neon sign wash — hot pink and electric blue neon tubes casting saturated colored glow across the scene",
  "RGB LED gel wash — cycling color temperature across the scene, magenta and green competing shadows",
  // Paparazzi / Flash
  "Harsh direct on-camera flash — paparazzi style, flat lighting, hard shadow on background wall, overexposed highlights",
  "Strobe flash freeze — catchlight in eyes, frozen motion, harsh but high-impact commercial look",
  // Practical / Ambient
  "Practicals only — warm candlelight and table lamps as sole light sources, intimate and organic",
  "Firelight — warm flickering orange glow, dynamic dancing shadows, primal and atmospheric",
  "Computer screen glow as only light source — cold blue-white emanating from monitor, hacker/midnight vibe",
  // Ring / Beauty
  "Ring light front-on — perfect circular catch lights in subject's eyes, beauty influencer style, even and bright",
  "Large octabox beauty dish from above at 30 degrees, soft wraparound light, magazine editorial quality",
  // Theatrical / Spot
  "Single hard overhead theatrical spotlight from directly above, everything else in deep shadow, stage presence",
  "HMI daylight balanced spotlight through window, shaft of visible light through haze, volume light beam",
  // Experimental
  "Projector light — patterns or text projected onto subject and wall, textured light, editorial creative",
  "Fairy lights and bokeh — hundreds of tiny warm lights creating dreamy out-of-focus background bokeh",
  "Laser grid — thin beams of colored laser light creating geometric patterns through smoke across the scene",
];

// ─── SCENE-AWARE CAMERA SELECTION ──────────────────────
function pickCameraForScene(category: string): string {
  const wideAngles = CAMERA_VARIATIONS.filter(c =>
    /14mm|fisheye|ultra-wide|8-15mm|worm|ground|barrel/.test(c)
  );
  const cinematic = CAMERA_VARIATIONS.filter(c =>
    /RED|ARRI|anamorphic|Venice|Alexa|crane|jib|split.diopter/.test(c)
  );
  const portrait = CAMERA_VARIATIONS.filter(c =>
    /85mm|135mm|medium format|Hasselblad|bokeh|portrait|close-up/.test(c)
  );
  const documentary = CAMERA_VARIATIONS.filter(c =>
    /photojournalistic|reportage|Nikon Z9|Canon R5, 16mm|documentary/.test(c)
  );
  const pov = CAMERA_VARIATIONS.filter(c =>
    /POV|Insta360|head-mount|chest-mount|first.person/.test(c)
  );
  const drone = CAMERA_VARIATIONS.filter(c =>
    /DJI|bird|aerial|overhead/.test(c)
  );
  const tilt = CAMERA_VARIATIONS.filter(c =>
    /Dutch|URSA|disorient|unease|tension/.test(c)
  );
  const surveillance = CAMERA_VARIATIONS.filter(c =>
    /CCTV|surveillance|voyeur|door frame/.test(c)
  );
  const dramatic = CAMERA_VARIATIONS.filter(c =>
    /low angle|ground level|knee height|heroic|towering/.test(c)
  );
  const telephoto = CAMERA_VARIATIONS.filter(c =>
    /200mm|telephoto|compress|isolated/.test(c)
  );
  const creative = CAMERA_VARIATIONS.filter(c =>
    /mirror|water puddle|reflection|Macro|split-focus/.test(c)
  );

  const pool: string[] = [];

  switch (category) {
    case "space": pool.push(...cinematic, ...wideAngles); break;
    case "underwater": pool.push(...cinematic, ...wideAngles, ...creative); break;
    case "horror": pool.push(...surveillance, ...tilt, ...portrait); break;
    case "crime": pool.push(...surveillance, ...documentary, ...telephoto); break;
    case "school": pool.push(...cinematic, ...documentary); break;
    case "money": pool.push(...cinematic, ...portrait, ...dramatic); break;
    case "gaming": pool.push(...pov, ...wideAngles, ...cinematic); break;
    case "food": pool.push(...portrait, ...creative); break;
    case "tech": pool.push(...cinematic, ...creative, ...portrait); break;
    case "city": pool.push(...drone, ...dramatic, ...cinematic); break;
    case "fashion": pool.push(...portrait, ...cinematic); break;
    case "car": pool.push(...wideAngles, ...dramatic, ...cinematic); break;
    case "music": pool.push(...cinematic, ...dramatic, ...wideAngles); break;
    case "beach": pool.push(...drone, ...wideAngles, ...cinematic); break;
    case "mountain": pool.push(...drone, ...wideAngles, ...dramatic); break;
    case "desert": pool.push(...drone, ...cinematic, ...telephoto); break;
    case "sports": pool.push(...telephoto, ...wideAngles, ...documentary); break;
    case "ancient": pool.push(...cinematic, ...drone, ...creative); break;
    case "hospital": pool.push(...documentary, ...surveillance, ...portrait); break;
    case "military": pool.push(...documentary, ...wideAngles, ...dramatic); break;
    case "wedding": pool.push(...portrait, ...cinematic, ...creative); break;
    case "prison": pool.push(...surveillance, ...tilt, ...documentary); break;
    case "fantasy": pool.push(...cinematic, ...creative, ...dramatic); break;
    case "home": pool.push(...documentary, ...portrait); break;
    case "product": pool.push(...portrait, ...creative, ...cinematic); break;
    case "animal": pool.push(...telephoto, ...documentary, ...wideAngles); break;
    case "social": pool.push(...pov, ...documentary, ...portrait); break;
    case "nature": pool.push(...drone, ...telephoto, ...cinematic); break;
    case "travel": pool.push(...drone, ...documentary, ...wideAngles); break;
    case "art": pool.push(...portrait, ...creative, ...cinematic); break;
    case "science": pool.push(...portrait, ...creative, ...documentary); break;
    case "water_boat": pool.push(...drone, ...wideAngles, ...cinematic); break;
    case "jungle": pool.push(...documentary, ...wideAngles, ...telephoto); break;
    case "custom": pool.push(...cinematic, ...dramatic, ...portrait); break;
    default: pool.push(...CAMERA_VARIATIONS); break;
  }

  return pickRandom(pool.length > 0 ? pool : CAMERA_VARIATIONS);
}

// ─── SCENE-AWARE LIGHTING SELECTION ─────────────────────
function pickLightingForScene(category: string): string {
  const warm = LIGHTING_VARIATIONS.filter(l =>
    /golden|warm|candle|fire|amber|fairy/.test(l)
  );
  const cold = LIGHTING_VARIATIONS.filter(l =>
    /moonlight|cold|blue-white|cyan/.test(l)
  );
  const dramatic = LIGHTING_VARIATIONS.filter(l =>
    /split|overhead|spotlight|hard|HMI|volume/.test(l)
  );
  const neon = LIGHTING_VARIATIONS.filter(l =>
    /neon|RGB|colored|laser|projector/.test(l)
  );
  const soft = LIGHTING_VARIATIONS.filter(l =>
    /soft|beauty|ring|diffused|window|octabox/.test(l)
  );
  const horror = LIGHTING_VARIATIONS.filter(l =>
    /under-light|horror|campfire|eerie|unnatural|surveillance|screen glow/.test(l)
  );
  const flash = LIGHTING_VARIATIONS.filter(l =>
    /flash|paparazzi|strobe|on-camera/.test(l)
  );
  const practical = LIGHTING_VARIATIONS.filter(l =>
    /practical|lamp|firelight|ambient|monitor|computer/.test(l)
  );

  const pool: string[] = [];

  switch (category) {
    case "horror": pool.push(...horror, ...dramatic, ...cold); break;
    case "space": pool.push(...cold, ...dramatic); break;
    case "underwater": pool.push(...dramatic, ...cold); break;
    case "jungle": pool.push(...warm, ...dramatic, ...practical); break;
    case "desert": pool.push(...warm, ...dramatic); break;
    case "mountain": pool.push(...dramatic, ...cold); break;
    case "city": pool.push(...neon, ...dramatic); break;
    case "gaming": pool.push(...neon, ...practical); break;
    case "tech": pool.push(...practical, ...neon, ...cold); break;
    case "fashion": pool.push(...soft, ...warm); break;
    case "food": pool.push(...warm, ...soft); break;
    case "car": pool.push(...neon, ...dramatic, ...warm); break;
    case "music": pool.push(...neon, ...dramatic, ...flash); break;
    case "beach": pool.push(...warm, ...soft); break;
    case "sports": pool.push(...dramatic, ...flash); break;
    case "school": pool.push(...soft, ...practical); break;
    case "money": pool.push(...warm, ...dramatic); break;
    case "crime": pool.push(...dramatic, ...horror, ...practical); break;
    case "hospital": pool.push(...cold, ...practical, ...dramatic); break;
    case "military": pool.push(...dramatic, ...cold); break;
    case "wedding": pool.push(...warm, ...soft, ...practical); break;
    case "prison": pool.push(...dramatic, ...cold, ...horror); break;
    case "fantasy": pool.push(...neon, ...dramatic, ...warm); break;
    case "home": pool.push(...practical, ...warm, ...soft); break;
    case "product": pool.push(...soft, ...dramatic); break;
    case "animal": pool.push(...warm, ...soft, ...dramatic); break;
    case "social": pool.push(...soft, ...neon, ...flash); break;
    case "nature": pool.push(...warm, ...dramatic); break;
    case "travel": pool.push(...warm, ...dramatic, ...soft); break;
    case "art": pool.push(...dramatic, ...neon, ...warm); break;
    case "science": pool.push(...cold, ...practical, ...dramatic); break;
    case "ancient": pool.push(...warm, ...dramatic); break;
    case "water_boat": pool.push(...warm, ...dramatic); break;
    case "custom": pool.push(...dramatic, ...warm, ...neon); break;
    default: pool.push(...LIGHTING_VARIATIONS); break;
  }

  return pickRandom(pool.length > 0 ? pool : LIGHTING_VARIATIONS);
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── ADJECTIVE MODIFIERS ────────────────────────────────
function detectModifiers(topic: string): { mods: Modifiers; energy: string; detected: string[] } {
  const t = topic.toLowerCase();
  const mods: Modifiers = {};
  let energy = "neutral";
  const detected: string[] = [];

  if (/\b(accepted|admitted|approved|hired|promoted|qualified|selected|chosen|passed|achieved|accomplished|graduated|won|earned|certified|appointed|invited|shortlisted|licensed|accredited)\\b/.test(t)) {
    mods.achievement = true; mods.positive = true; mods.milestone = true;
    if (energy === "neutral") energy = "triumphant";
    detected.push("achievement");
  }

  if (/\b(luxury|luxurious|expensive|premium|high[- ]end|designer|fancy|exclusive|five[- ]star|first[- ]class|vip|opulent|extravagant)\\b/.test(t)) {
    mods.wealth = true; mods.prestige = true; energy = "controlled";
    detected.push("luxury");
  }
  if (/\b(rich|wealthy|millionaire|billionaire|loaded|affluent|prosperous)\\b/.test(t)) {
    mods.wealth = true; energy = "triumphant";
    detected.push("rich");
  }
  if (/\b(cheap|free|worthless|bargain|discount|budget|dollar|affordable|broke|bankrupt|poor|penniless)\\b/.test(t)) {
    mods.cheap = true; mods.negative = true; energy = "devastated";
    detected.push("cheap");
  }

  if (/\b(best|amazing|insane|crazy|awesome|incredible|epic|fantastic|wonderful|beautiful|gorgeous|perfect|legendary|unreal|sick|dope|fire|lit|goated|god[- ]tier|phenomenal|mind[- ]blowing|extraordinary)\\b/.test(t)) {
    mods.positive = true; energy = "explosive";
    detected.push("positive");
  }
  if (/\b(good|great|nice|cool|sweet|love|loved|enjoy|happy|fun|exciting|thrilling|pleasant|delightful|excellent|superb|brilliant)\\b/.test(t)) {
    mods.positive = true;
    if (energy === "neutral" || energy === "nervous") energy = "explosive";
    detected.push("good");
  }

  if (/\b(worst|ugly|terrible|horrible|awful|nasty|gross|disgusting|trash|garbage|failure|fail|ruined|destroyed|devastating|pathetic|disaster|horrendous|dreadful)\\b/.test(t)) {
    mods.negative = true; energy = "devastated";
    detected.push("negative");
  }
  if (/\b(bad|poor|sad|depressing|tragic|heartbreaking|miserable|painful|sucks|wrong|terrible|unfortunate|regret)\\b/.test(t)) {
    mods.negative = true;
    if (energy === "neutral") energy = "devastated";
    detected.push("bad");
  }

  if (/\b(scary|creepy|terrifying|horrifying|nightmare|spooky|disturbing|demon|ghost|haunted|horror|paranormal|curse|cursed|demonic|sinister|dread|petrifying|chilling|frightening|terrified)\\b/.test(t)) {
    mods.scary = true; mods.decay = true; energy = "terrified";
    detected.push("scary");
  }

  if (/\b(abandoned|ruined|destroyed|wrecked|rotten|decayed|forgotten|derelict|crumbling|dilapidated)\\b/.test(t)) {
    mods.decay = true; energy = "terrified";
    detected.push("abandoned");
  }

  if (/\b(secret|hidden|fake|exposed|mystery|classified|conspiracy|lie|liar|cover[- ]up|revealed|expose|underground|smuggle|smuggled|stolen|illegal|scam|fraud|hoax)\\b/.test(t)) {
    mods.hidden = true; energy = "suspicious";
    detected.push("secret");
  }

  if (/\b(private|restricted|forbidden|banned|no entry|off[- ]limits|members only|backstage|vip|exclusive|confidential|classified)\\b/.test(t)) {
    mods.exclusive = true; energy = "secretive";
    detected.push("private");
  }

  if (/\b(impossible|viral|unbelievable|never[- ]before|world[- ]record|record|unheard[- ]of|shocking|astonishing|inconceivable|miraculous)\\b/.test(t)) {
    mods.extreme = true; energy = "disbelief";
    detected.push("extreme");
  }

  if (/\b(dangerous|risk|deadly|hazardous|lethal|toxic|extreme|death[- ]defying|life[- ]threatening|perilous|treacherous)\\b/.test(t)) {
    mods.risk = true; energy = "fear";
    detected.push("dangerous");
  }

  if (/\b(biggest|giant|massive|huge|enormous|colossal|mega|ultimate|gigantic|titanic|monumental|immense)\\b/.test(t)) {
    mods.scale = "massive"; energy = "explosive";
    detected.push("massive");
  }

  if (/\b(smallest|tiny|mini|micro|microscopic|puny|little|minute)\\b/.test(t)) {
    mods.scale = "tiny";
    detected.push("tiny");
  }

  if (/\b(ancient|historical|medieval|vintage|antique|classic|prehistoric|centuries|eternal|archaic|primitive)\\b/.test(t)) {
    mods.historical = true; energy = "awe";
    detected.push("ancient");
  }

  if (/\b(lost|alone|trapped|stranded|isolated|nowhere|deserted|helpless|abandoned|forsaken|marooned)\\b/.test(t)) {
    mods.negative = true; energy = "isolated";
    detected.push("lost");
  }

  if (/\b(first|new|latest|brand new|fresh|debut|inaugural|never seen|novel|recent|unprecedented)\\b/.test(t)) {
    mods.milestone = true;
    if (energy === "neutral") energy = "nervous";
    detected.push("new");
  }

  if (/\bfinal\b|\bending\b|\blast\b/.test(t)) {
    mods.ending = true; energy = "emotional";
    detected.push("last");
  }

  if (/\b(funny|hilarious|comedy|laugh|stupid|dumb|ridiculous|prank|joke|memes|meme|comical|absurd|goofy|wacky|hilarious)\\b/.test(t)) {
    mods.funny = true; mods.positive = true; energy = "explosive";
    detected.push("funny");
  }

  if (/\b(sad|crying|tears|heartbreak|death|died|funeral|grief|mourn|loss|painful|sorrow|depressed|heartbroken|tragic|devastated|devastating)\\b/.test(t)) {
    mods.sad = true; mods.negative = true; energy = "emotional";
    detected.push("sad");
  }

  if (/\b(angry|furious|rage|mad|hate|revenge|attack|fight|war|battle|beast|savage|brutal|violent|wrath|hostile|aggressive)\\b/.test(t)) {
    mods.angry = true; mods.intense = true; energy = "fear";
    detected.push("angry");
  }

  if (/\b(cute|adorable|sweet|lovely|pretty|beautiful|baby|puppy|kitten|fluffy|precious|charming|darling|innocent)\\b/.test(t)) {
    mods.cute = true; mods.positive = true; energy = "explosive";
    detected.push("cute");
  }

  if (/\b(intense|extreme|hardcore|brutal|savage|raw|wild|ferocious|relentless|merciless|fierce)\\b/.test(t)) {
    mods.intense = true;
    if (energy === "neutral") energy = "explosive";
    detected.push("intense");
  }

  if (/\b(survive|survived|survival|escape|escaped|rescued|endure|endurance|challenge)\\b/.test(t)) {
    mods.intense = true; mods.risk = true;
    if (energy === "neutral") energy = "fear";
    detected.push("survival");
  }

  return { mods, energy, detected };
}

// ─── SCENE DETECTOR (context-first) ─────────────────────
function detectScene(topic: string, mods: Modifiers): Scene {
  const t = topic.toLowerCase();

  // ── Horror/Scary override ──
  if (mods.scary || /\b(ghost|haunted|horror|demon|paranormal|curse|cursed|scary|creepy|nightmare|spirit|zombie|vampire|demonic|sinister|dread|chilling|petrifying|disturbing|witch|satan|exorcism|ouija|seance|poltergeist)\\b/.test(t)) {
    return {
      location: "Horror setting — Victorian mansion or abandoned location",
      bg: "Victorian mansion hallway at midnight, peeling wallpaper, flickering candlelight casting dancing shadows, a door at the end of the corridor slightly ajar with something glowing behind it, dust particles in moonbeams, floorboards creaking, something watching from the darkness",
      time: "Midnight — only moonlight and candlelight",
      atmosphere: "Pure dread, the feeling of being watched, something deeply wrong",
      category: "horror",
    };
  }

  // ── Elite University / College / School ──
  if (/\b(oxford|cambridge|harvard|yale|stanford|mit|princeton|columbia|brown|dartmouth|cornell|caltech|imperial|eth zurich|sorbonne|heidelberg|uc berkeley|university|college|campus|accepted|admitted|scholarship|enrollment|enrolled|admission|graduated|graduation|diploma|degree|exam|professor|dean|lecture|library|dorm|semester|tuition|academic|valedictorian|salutatorian|ivy|league|freshman|sophomore|junior|senior|alumni|grad school|master|phd|doctorate|bachelor|honors|thesis|school)\\b/.test(t)) {
    const uniMatch = t.match(/\b(oxford|cambridge|harvard|yale|stanford|mit|princeton|columbia|brown|dartmouth|cornell|caltech|imperial|eth zurich|sorbonne|heidelberg|uc berkeley)\b/);
    const uniName = uniMatch ? uniMatch[0].charAt(0).toUpperCase() + uniMatch[0].slice(1) : "";
    const placeName = uniName || "prestigious university";
    return {
      location: `${placeName} campus interior`,
      bg: `Inside the grand halls of ${placeName}, towering stone columns and vaulted Gothic ceilings, stained glass windows casting colored light across rows of leather-bound books in the library, polished wooden desks with brass lamps, students in academic robes crossing cobblestone quadrangles visible through arched windows, the weight of centuries of academic tradition in every detail, ivy climbing ancient stone walls`,
      time: "Late morning — warm light streaming through stained glass windows",
      atmosphere: "Academic prestige, centuries of tradition, the air of intellectual greatness",
      category: "school",
    };
  }

  // ── Water / Boat / Yacht ──
  if (/\b(boat|yacht|ship|harbour|sea|ocean|cruise|sailing|sailboat|submarine|sail|navy|pirate|marina|dock|port|beach|island|titanic)\\b/.test(t)) {
    if (mods.wealth || mods.prestige) {
      return {
        location: "Luxury superyacht deck",
        bg: "Polished teak deck of a multi-deck luxury superyacht, sparkling ocean stretching to horizon, chrome railings catching golden sunlight, white leather loungers, crystal-clear turquoise water below, champagne on ice",
        time: "Golden hour — warm amber sunlight cascading across the deck",
        atmosphere: "Opulent maritime luxury, salt air mixed with champagne",
        category: "water_wealth",
      };
    }
    return {
      location: "Open water / harbour",
      bg: "Weathered boat railing with ocean spray hitting the deck, dramatic clouds, churning dark blue water, harbour lights in the distance, the raw power of the sea",
      time: "Late afternoon with dramatic cloud cover",
      atmosphere: "Raw maritime energy, wind and salt",
      category: "water",
    };
  }

  // ── Space / Rocket ──
  if (/\b(space|rocket|nasa|moon|mars|orbit|launch|astronaut|galaxy|universe|satellite|star|planet|cosmos|telescope|iss|shuttle|asteroid|comet)\\b/.test(t)) {
    return {
      location: "Rocket launch site / outer space",
      bg: "Massive rocket on launch pad engulfed in smoke and fire, or the void of space with Earth visible below, stars stretching to infinity, the curvature of the planet glowing blue at the edge",
      time: "Pre-dawn or deep space — no natural light",
      atmosphere: "Primordial awe of cosmic scale",
      category: "space",
    };
  }

  // ── Jungle / Survival / Wild ──
  if (/\b(jungle|amazon|rainforest|survival|survive|wild|safari|africa|tribe|island|deserted|tropical forest|rain forest|swamp|everglades|outback)\\b/.test(t)) {
    return {
      location: "Dense jungle / African savanna",
      bg: "Dense canopy of an Amazon rainforest with massive vines, towering trees blocking most light, exotic birds in flight, mist rolling through the undergrowth, or vast African savanna with acacia trees against a burning orange sunset",
      time: "Dawn or dusk — dappled light through canopy",
      atmosphere: "Primal survival tension, nature at its most raw and untamed",
      category: "jungle",
    };
  }

  // ── Underwater ──
  if (/\b(underwater|diving|sunken|atlantis|coral|deep sea|scuba|submarine|ocean floor|scuba|snorkel|marine)\\b/.test(t)) {
    return {
      location: "Sunken civilization ruins / deep ocean",
      bg: "Ancient sunken ruins covered in coral and barnacles, shafts of pale blue light piercing down from the surface, bioluminescent creatures floating in the darkness beyond, mysterious doorways leading into blackness",
      time: "Deep underwater — eternal blue twilight",
      atmosphere: "Otherworldly silence and the crushing weight of the deep",
      category: "underwater",
    };
  }

  // ── Desert ──
  if (/\b(desert|sahara|sand|dune|oasis|cactus|arabian|pyramid|egypt|sphinx|cairo)\\b/.test(t)) {
    return {
      location: "Endless Sahara / desert",
      bg: "Towering sand dunes stretching to every horizon, heat shimmer distorting the air, or a hidden oasis with palm trees reflected in still water, wind-carved rock formations",
      time: "Harsh midday sun or golden hour with long shadows",
      atmosphere: "Beautiful desolation, the indifferent scale of nature",
      category: "desert",
    };
  }

  // ── Mountain / Climbing ──
  if (/\b(mountain|everest|summit|climb|peak|glacier|alpine|volcano|ridge|cliff|altitude|rock climbing|ice climbing|himalaya|andes|kilimanjaro)\\b/.test(t)) {
    return {
      location: "Brutal icy mountain summit",
      bg: "Jagged glacial peaks shrouded in blizzard, sheer ice walls, a tiny figure visible against the massive face, snow being violently whipped horizontally, clouds below the summit",
      time: "Overcast with occasional sun breaking through storm clouds",
      atmosphere: "Nature at its most hostile and indifferent",
      category: "mountain",
    };
  }

  // ── City / Urban ──
  if (/\b(city|urban|skyscraper|downtown|new york|paris|london|tokyo|dubai|los angeles|chicago|miami|vegas|las vegas|manhattan|brooklyn|hollywood|times square|tokyo|seoul|shanghai|singapore|hong kong|sydney|rome|barcelona|amsterdam|berlin|beijing|mumbai|toronto|san francisco)\\b/.test(t)) {
    return {
      location: "City rooftop / urban streets",
      bg: "High-rise luxury rooftop with panoramic city skyline at golden hour, or neon-soaked city streets at night with taxi lights streaking, towering skyscrapers creating urban canyons",
      time: "Golden hour or neon night",
      atmosphere: "Urban energy and ambition, the electric pulse of civilization",
      category: "city",
    };
  }

  // ── Ancient / Historical / Ruins ──
  if (/\b(ancient|pyramid|rome|temple|castle|medieval|pharaoh|roman|greek|empire|king|queen|knight|crusade|viking|samurai|gladiator|colosseum|petra|angkor|machu picchu|stonehenge|parthenon|forbidden city|great wall|taj mahal)\\b/.test(t)) {
    return {
      location: "Ancient historical landmark",
      bg: "Massive weathered stone blocks of an ancient monument at golden hour, hieroglyphics or roman columns catching warm light, dust motes floating in shafts of light, carvings worn by millennia",
      time: "Golden hour — the most photogenic angle of ancient stone",
      atmosphere: "The weight of centuries, history made tangible and immediate",
      category: "ancient",
    };
  }

  // ── Money / Finance / Wealth ──
  if (/\b(money|million|invest|crypto|trading|profit|billion|stock|bitcoin|forex|bank|finance|wealth|rich|cash|gold|diamond|jewel|luxury|fortune|dividend|portfolio|wall street|hedge fund|startup|ipo)\\b/.test(t)) {
    return {
      location: "Luxury penthouse / trading floor",
      bg: "Floor-to-ceiling penthouse windows overlooking a glittering city at night, stacks of cash and gold bars on a marble table, multiple screens showing green charts, leather and mahogany everywhere",
      time: "Night — screens and city lights the only illumination",
      atmosphere: "Pure financial power and the intoxication of wealth",
      category: "money",
    };
  }

  // ── Gaming / Esports ──
  if (/\b(game|gaming|esports|stream|tournament|console|playstation|xbox|nintendo|twitch|gamer|pc|steam|fortnite|minecraft|roblox|valorant|league|overwatch|apex|call of duty|warzone|zelda|mario|pokémon|gta)\\b/.test(t)) {
    return {
      location: "Professional esports arena",
      bg: "Massive esports arena with LED stages, holographic displays, packed stands with laser lights, giant screens showing gameplay, professional gaming stations with RGB everything",
      time: "Arena lighting — LED and laser show",
      atmosphere: "Electric competitive energy, the roar of the crowd",
      category: "gaming",
    };
  }

  // ── FC / FIFA ──
  if (/\b(fc|fifa|fut|pack|squad|ultimate team|toty|ronaldo|messi|mbappe|haaland|neymar|salah|de bruyne|modric|vinicius|bellingham|pedri|gavi)\\b/.test(t)) {
    return {
      location: "FC gaming arena",
      bg: "Neon gaming arena with holographic FUT card effects, golden pack-opening light rays, particle effects and digital data streaming, scattered blurred player cards floating in space",
      time: "Arena lighting — golden and electric blue",
      atmosphere: "The thrill of the pack pull, electric competitive energy",
      category: "gaming",
    };
  }

  // ── Food / Cooking ──
  if (/\b(food|cook|chef|restaurant|kitchen|eat|recipe|pizza|burger|cake|bake|meal|dinner|lunch|breakfast|steak|sushi|pasta|ramen|taco|sandwich|dessert|ice cream|chocolate|cookie|donut|fries|fried|grill|bbq|buffet|feast|taste|delicious|spicy|gordon ramsay|bake off)\\b/.test(t)) {
    return {
      location: "Professional kitchen / restaurant",
      bg: "Professional kitchen with copper pots hanging, flames leaping from pans, steam rising, perfectly plated dishes on marble, or chaotic kitchen with ingredients flying, multiple pots boiling, flour dust in the air",
      time: "Warm tungsten kitchen lighting",
      atmosphere: "Culinary intensity, the controlled chaos of a professional kitchen",
      category: "food",
    };
  }

  // ── Tech / AI / Coding ──
  if (/\b(tech|ai|robot|code|coding|hack|cyber|matrix|computer|software|app|silicon|startup|program|algorithm|chatgpt|openai|google|apple|microsoft|meta|quantum|blockchain|neural|machine learning|data|server|cloud|samsung|xiaomi|huawei)\\b/.test(t)) {
    return {
      location: "Dark server room / futuristic lab",
      bg: "Rows of server racks with blinking blue LEDs stretching into darkness, or a futuristic lab with holographic displays, floating data visualizations, dark metallic surfaces reflecting cyan code",
      time: "No natural light — only screen glow and LED",
      atmosphere: "The cold intelligence of technology, digital omnipotence",
      category: "tech",
    };
  }

  // ── Sports / Gym / Fitness ──
  if (/\b(gym|fitness|boxing|fight|sport|athlete|marathon|workout|exercise|weight|muscle|run|running|race|soccer|football|basketball|tennis|swim|wrestling|mma|ufc|cricket|rugby|golf|baseball|volleyball|crossfit|olympic|championship|league|score|goal|touchdown|knockout|ring|octagon|track|field|stadium|arena|weightlifting|deadlift|squat|bench press|cardio|yoga|pilates)\\b/.test(t)) {
    return {
      location: "Boxing arena / sports stadium",
      bg: "Boxing ring under harsh overhead lights with crowd blur beyond the ropes, or professional gym with weights, mirrors, and sweat, or marathon finish line with crowd barriers and banners",
      time: "Arena lighting — dramatic overhead spots",
      atmosphere: "Physical intensity, the pain and glory of competition",
      category: "sports",
    };
  }

  // ── Fashion / Shopping / Brands ──
  if (/\b(nike|adidas|shoes|sneaker|fashion|shopping|store|mall|clothes|outfit|gucci|louis vuitton|supreme|zara|h&m|prada|balenciaga|jordan|dior|brand|style|wear|dress|hoodie|jacket|sneakers|boots|heels|purse|wardrobe|runway|model|vogue|fashion week|off[- ]white|yeezy|new balance|puma|reebok|converse|vans|timberland|ugg|lululemon|shein|fashion nova|zara|bershka|revolve)\\b/.test(t)) {
    return {
      location: "Trendy fashion store / boutique",
      bg: "Modern streetwear store with products displayed on floating illuminated shelves, industrial concrete floors, neon accent lighting, mirror walls reflecting limited-edition items, glass display cases with exclusive drops",
      time: "Cool retail lighting — LED accent with warm highlights",
      atmosphere: "Hype culture energy, the excitement of a fresh purchase",
      category: "fashion",
    };
  }

  // ── Car / Vehicle / Driving ──
  if (/\b(car|vehicle|ferrari|lambo|porsche|bmw|mercedes|tesla|driving|drive|race|racing|speed|highway|road|auto|motor|motorcycle|bike|supercar|truck|van|cab|taxi|mustang|corvette|bugatti|audi|lamborghini|mclaren|koenigsegg|aston martin|rolls royce|bentley|range rover|jeep|dodge|ford|chevy|nissan|honda|toyota|hyundai|kia|volvo|subaru|mazda)\\b/.test(t)) {
    return {
      location: "Dramatic road / car showroom",
      bg: "Long stretch of open highway disappearing into the horizon with dramatic sky, or sleek car showroom with mirror-polished floor reflecting a vehicle, dramatic overhead spotlights",
      time: "Golden hour or dramatic storm sky",
      atmosphere: "The freedom and thrill of the open road",
      category: "car",
    };
  }

  // ── Music / Concert ──
  if (/\b(music|concert|guitar|piano|song|album|rapper|singing|band|dj|festival|stage|mic|microphone|drum|beat|studio|vocals|rap|hip hop|pop|rock|spotify|billboard|itunes|grammy|ariana|taylor|drake|bad bunny|weeknd|billie|ed sheeran|kanye|eminem|travis scott|coachella)\\b/.test(t)) {
    return {
      location: "Concert stage / recording studio",
      bg: "Massive concert stage with pyrotechnics, laser lights cutting through theatrical smoke, a wall of speakers, screaming crowd visible as a blur of hands and phone lights, or intimate recording studio with soundproofing, mixing console, and warm studio lighting",
      time: "Stage lighting — dramatic spotlights and lasers",
      atmosphere: "The raw energy of live music, the electricity of performance",
      category: "music",
    };
  }

  // ── Beach / Pool / Vacation ──
  if (/\b(beach|pool|swim|vacation|holiday|resort|tropical|palm|surf|surfing|bikini|swimsuit|cabana|bali|maldives|hawaii|cancun|caribbean|ibiza|santorini|fiji|bahamas|cabo|phuket|boracay)\\b/.test(t)) {
    return {
      location: "Tropical beach resort",
      bg: "Pristine white sand beach with crystal-clear turquoise water, palm trees swaying, luxury cabanas with white drapes, beachfront infinity pool, tropical flowers, gentle waves breaking on the shore",
      time: "Late afternoon golden hour with warm ocean breeze",
      atmosphere: "Paradise relaxation, the luxury of escape",
      category: "beach",
    };
  }

  // ── Home / House / Room ──
  if (/\b(house|room|home|apartment|bedroom|living room|mansion|bathroom|basement|attic|garage|garden|backyard|penthouse|villa|cabin|cottage|interior|kitchen|decor|furniture|renovation|remodel|airbnb|air bnb| Airbnb)\\b/.test(t)) {
    if (mods.wealth || mods.prestige) {
      return {
        location: "Luxury penthouse interior",
        bg: "Expansive luxury penthouse with floor-to-ceiling windows, designer furniture, marble surfaces, art on the walls, panoramic city views, ambient lighting",
        time: "Evening — ambient interior lighting with city glow",
        atmosphere: "Luxury living, the comfort of success",
        category: "home",
      };
    }
    return {
      location: "Home interior",
      bg: "Warm lived-in room with comfortable furniture, personal items scattered around, warm lamp light, bookshelves, a lived-in authenticity that tells a story",
      time: "Evening — warm interior lamp lighting",
      atmosphere: "Domestic life, relatable and real",
      category: "home",
    };
  }

  // ── Product / Tech gadgets / Unboxing ──
  if (/\b(iphone|phone|laptop|macbook|ipad|tablet|watch|headphones|camera|drone|gadget|unbox|unboxing|product|device|screen|monitor|keyboard|mouse|console|headset|speaker|airpods|galaxy|pixel|surface|kindle|gopro|sony|bose|jbl|razer|logitech|asus|msi|canon|nikon)\\b/.test(t)) {
    return {
      location: "Product reveal setup",
      bg: "Clean dark studio setup with dramatic product photography lighting, floating product illuminated by precise rim lights, dark matte background with subtle gradient",
      time: "Studio lighting — precise product photography setup",
      atmosphere: "The anticipation of a reveal, consumer excitement",
      category: "product",
    };
  }

  // ── Animal / Pet ──
  if (/\b(dog|cat|pet|puppy|kitten|animal|horse|elephant|lion|tiger|bear|snake|shark|whale|dolphin|monkey|gorilla|dinosaur|dragon|creature|beast|spider|insect|bug|bird|eagle|owl|crocodile|fox|wolf|rabbit|hamster|parrot|turtle|tortoise|penguin|koala|panda|giraffe|zebra|deer|squirrel|raccoon|otter|seal|jellyfish|octopus)\\b/.test(t)) {
    if (mods.cute) {
      return {
        location: "Adorable pet setting",
        bg: "Warm cozy environment with soft blankets, the pet looking directly at camera with maximum cuteness, soft bokeh background, warm lighting that makes fur glow",
        time: "Soft warm natural light",
        atmosphere: "Pure wholesome joy, the warmth of a companion",
        category: "animal_cute",
      };
    }
    if (/\b(shark|bear|lion|tiger|snake|crocodile|spider|dinosaur|dragon|beast|gorilla|wolf)\\b/.test(t)) {
      return {
        location: "Dangerous close encounter",
        bg: "The creature rendered at terrifying scale and proximity, dramatic low-angle shot emphasizing size and threat, the environment matching the animal — dark water, dense jungle, open savanna",
        time: "Dramatic dangerous lighting — dark with sharp highlights",
        atmosphere: "Primal fear and the awe of a predator encounter",
        category: "animal_danger",
      };
    }
    return {
      location: "Natural habitat / close encounter",
      bg: "The animal in its natural environment rendered cinematically with dramatic lighting that emphasizes the scale and presence of the creature",
      time: "Golden hour or dramatic natural lighting",
      atmosphere: "The awe and tension of a close animal encounter",
      category: "animal",
    };
  }

  // ── Social Media / Influencer / YouTube ──
  if (/\b(tiktok|youtube|instagram|followers|subscribers|views|influencer|content|stream|streamer|podcast|live|reels|shorts|channel|video|post|dm|comment|like|follower|viral|trending|fyp|algorithm|monetize|subscribe|creator|influencer|vlog|collab|sponsor|brand deal)\\b/.test(t)) {
    return {
      location: "Content creator studio",
      bg: "Professional content creator setup with ring lights, multiple monitors, camera on tripod, RGB accent lighting, acoustic foam panels, gaming chair or creator desk",
      time: "Studio lighting — ring light and LED panels",
      atmosphere: "The digital hustle, creator energy",
      category: "social",
    };
  }

  // ── Nature / Outdoors ──
  if (/\b(nature|outdoor|outside|forest|tree|lake|river|waterfall|camping|camp|hike|hiking|trail|park|flower|sunrise|sunset|sky|cloud|rain|storm|snow|winter|ice|fire|autumn|spring|summer|fall|meadow|field|cave|cliff|canyon|volcano|geyser|hot spring|aurora|northern lights)\\b/.test(t)) {
    return {
      location: "Dramatic natural landscape",
      bg: "Breathtaking natural landscape with dramatic sky, sweeping vistas, environmental elements catching cinematic light, atmosphere of scale and natural beauty",
      time: "Golden hour or dramatic weather lighting",
      atmosphere: "The sublime power of nature",
      category: "nature",
    };
  }

  // ── Travel / Explore ──
  if (/\b(travel|trip|journey|adventure|explore|visit|tour|flight|fly|airport|hotel|motel|backpack|wander|destination|abroad|foreign|world|country|continent|passport|visa|luggage|suitcase|road trip|backpacker|hostel|landmark|monument|wonder|unesco)\\b/.test(t)) {
    return {
      location: "Iconic travel destination",
      bg: "Recognizable landmark or exotic location rendered cinematically, warm travel light, passport and boarding passes visible, the excitement of arrival in a new place",
      time: "Travel golden hour — the magic time for photography",
      atmosphere: "Wanderlust and the thrill of discovery",
      category: "travel",
    };
  }

  // ── Art / Creative ──
  if (/\b(paint|draw|art|canvas|design|creative|sculpture|museum|gallery|illustration|sketch|graffiti|street art|portrait|photograph|artist|artwork|masterpiece|exhibition|watercolor|acrylic|oil painting|digital art|nft)\\b/.test(t)) {
    return {
      location: "Artist studio / gallery",
      bg: "Creative studio with paint-splattered floors, canvases stacked against walls, dramatic skylight illumination, works in progress, art supplies scattered",
      time: "Studio skylight or gallery spot lighting",
      atmosphere: "Creative energy and artistic expression",
      category: "art",
    };
  }

  // ── Crime / Police / Mystery ──
  if (/\b(police|cop|arrest|crime|criminal|jail|prison|stolen|rob|theft|murder|detective|investigation|evidence|court|judge|lawyer|trial|wanted|fugitive|chase|swat|fbi|cia|interpol|mafia|gang|heist|bank robbery|serial|kidnap|hostage|escape|prison break)\\b/.test(t)) {
    return {
      location: "Crime scene / interrogation room",
      bg: "Harshly lit interrogation room with metal table and single overhead light, or crime scene with yellow tape, forensic equipment, or dark alley with blue and red flashing lights on wet pavement",
      time: "Harsh fluorescent or crime scene flash lighting",
      atmosphere: "Tension, the weight of justice and consequences",
      category: "crime",
    };
  }

  // ── Relationship / Emotion ──
  if (/\b(love|heart|relationship|girlfriend|boyfriend|date|dating|marriage|wedding|breakup|cheat|betray|friend|family|baby|pregnant|born|death|die|funeral|cry|tears|emotion|feel|miss|kiss|hug|divorce|propose|engagement|ring|valentine|anniversary|birthday)\\b/.test(t)) {
    return {
      location: "Emotionally charged cinematic setting",
      bg: "A setting that amplifies the emotional weight — rain-streaked windows, an empty room, a sunset silhouette, or a crowd of blurred faces — whatever maximizes emotional impact",
      time: "Emotionally appropriate lighting — warm for love, cold for loss",
      atmosphere: "Raw human emotion, the weight of real feelings",
      category: "emotion",
    };
  }

  // ── Science / Discovery ──
  if (/\b(science|experiment|lab|laboratory|discovery|research|chemist|physics|biology|dna|atom|molecule|formula|test|theory|quantum|gravity|energy|reaction|einste?in|hawking|tesla|curie|nobel|space|rocket|nasa)\\b/.test(t)) {
    return {
      location: "Research laboratory",
      bg: "High-tech laboratory with glass beakers containing glowing liquids, complex equipment, holographic data displays, stainless steel surfaces, atmospheric smoke from reactions",
      time: "Lab lighting — fluorescent and equipment glow",
      atmosphere: "The thrill of scientific discovery, knowledge at the edge",
      category: "science",
    };
  }

  // ── Hospital / Medical ──
  if (/\b(hospital|doctor|nurse|surgery|medical|health|clinic|emergency|ambulance|patient|disease|cancer|sick|illness|medicine|pharmacy|prescription|therapy|rehab|blood|vaccine|covid|corona|pandemic|surgeon|icu|x-ray|mri|scan|transplant|donor)\\b/.test(t)) {
    return {
      location: "Hospital corridor / operating room",
      bg: "Sterile hospital corridor with harsh fluorescent lighting, or dramatic operating room with surgical lights creating pools of white light, medical equipment, monitors glowing",
      time: "Harsh fluorescent hospital lighting",
      atmosphere: "Life and death stakes, the gravity of medical situations",
      category: "hospital",
    };
  }

  // ── Military / War ──
  if (/\b(military|army|navy|air force|soldier|war|combat|battle|tank|jet|missile|marine|commando|special forces|navy seal|sniper|grenade|bunker|trench|warfare|veteran|medal|honor|drill|sergeant|cadet|boot camp)\\b/.test(t)) {
    return {
      location: "Military battlefield / base",
      bg: "Dramatic military scene with smoke, explosions in the distance, military vehicles, soldiers in formation, or close-quarters combat environment with dramatic lighting",
      time: "Overcast battlefield lighting or night vision",
      atmosphere: "The gravity and intensity of military service",
      category: "military",
    };
  }

  // ── Wedding / Ceremony ──
  if (/\b(wedding|marry|married|bride|groom|ceremony|vow|altar|aisle|ring|bouquet|flower girl|ring bearer|reception|honeymoon|engagement|propose|proposal)\\b/.test(t)) {
    return {
      location: "Grand wedding venue",
      bg: "Elegant wedding venue with flowers, soft fairy lights, the altar decorated with white roses and candles, guests in formal attire, warm romantic lighting",
      time: "Soft golden hour or warm evening reception lighting",
      atmosphere: "Romance, celebration, the most important day",
      category: "wedding",
    };
  }

  // ── Prison / Locked up ──
  if (/\b(prison|jail|cell|inmate|convict|sentence|warden|guards|locked up|behind bars|solitary|maximum security|penitentiary|correctional|parole|escape|prison break)\\b/.test(t)) {
    return {
      location: "Prison interior",
      bg: "Dark prison cell with steel bars, concrete walls, a narrow window with bars letting in a sliver of light, metal bunk bed, harsh fluorescent buzzing overhead",
      time: "Harsh fluorescent lighting with deep shadows in corners",
      atmosphere: "Confinement, the weight of consequences",
      category: "prison",
    };
  }

  // ── Magic / Fantasy ──
  if (/\b(magic|wizard|witch|spell|potion|wand|enchant|sorcerer|harry potter|hogwarts|lord of the rings|fantasy|mythical|dragon|unicorn|fairy|elf|dwarf|troll|goblin|dungeon|realm|kingdom|throne|castle|quest|prophecy)\\b/.test(t)) {
    return {
      location: "Mystical fantasy realm",
      bg: "Ethereal fantasy landscape with floating particles of light, ancient magical symbols glowing on stone walls, misty enchanted forest with bioluminescent plants, or grand castle interior with magical artifacts",
      time: "Magical twilight — otherworldly purple and gold light",
      atmosphere: "Wonder and enchantment, the impossible made real",
      category: "fantasy",
    };
  }

  // ── Smart verb-based defaults ──
  if (/\b(bought|purchased|got|ordered|grabbed|scored|copped)\\b/.test(t)) {
    // Try to determine WHAT was bought from context
    if (/\b(nike|adidas|shoes|sneaker|jordan|yeezy|clothes|hoodie|jacket|shirt|dress|fashion|brand)\\b/.test(t)) {
      return {
        location: "Fashion store / product reveal",
        bg: "Modern retail store with the product displayed heroically, clean dramatic product reveal lighting, the excitement of a fresh purchase",
        time: "Studio lighting — product hero shot",
        atmosphere: "Consumer excitement, the thrill of ownership",
        category: "fashion",
      };
    }
    if (/\b(car|vehicle|truck|motorcycle|bike)\\b/.test(t)) {
      return {
        location: "Car showroom / dramatic road",
        bg: "Sleek showroom with mirror-polished floor reflecting the vehicle, dramatic overhead spotlights, the moment of taking possession",
        time: "Showroom dramatic spot lighting",
        atmosphere: "Automotive excitement, the thrill of ownership",
        category: "car",
      };
    }
    return {
      location: "Product reveal scene",
      bg: "Clean dramatic setup with the purchased item hero-lit in the center, soft rim lighting creating a halo effect, the moment of showing off the purchase",
      time: "Studio lighting — product photography hero shot",
      atmosphere: "Consumer excitement, the thrill of ownership",
      category: "shopping",
    };
  }

  if (/\b(won|earned|achieved|conquered|defeated|beat|dominated|champion|trophy|medal|first place|gold medal|victory)\\b/.test(t)) {
    return {
      location: "Victory celebration stage",
      bg: "Victory stage with confetti falling, trophy or prize in hand, crowd cheering in the background, dramatic spotlights, celebration energy, fireworks or pyrotechnics",
      time: "Arena lighting — dramatic celebration spots",
      atmosphere: "Triumph and glory, the taste of victory",
      category: "victory",
    };
  }

  if (/\b(lost|failed|broke|ruined|collapsed|crashed|burned|destroyed|devastated|bankrupt|evicted|fired|dumped|rejected|denied)\\b/.test(t)) {
    return {
      location: "Devastation / aftermath scene",
      bg: "Aftermath of destruction, broken objects scattered, dramatic dark sky with a single shaft of light breaking through, rubble and debris, the scene of defeat",
      time: "Dark overcast with single dramatic light break",
      atmosphere: "The weight of loss and devastation",
      category: "defeat",
    };
  }

  if (/\b(survived|survive|escape|escaped|rescued)\\b/.test(t)) {
    return {
      location: "Survival aftermath scene",
      bg: "Dramatic survival scene, battered but standing, harsh environmental conditions, dramatic sky, evidence of the ordeal visible, sweat and exhaustion",
      time: "Dramatic natural lighting — survival golden hour",
      atmosphere: "Relief and exhaustion, the aftermath of survival",
      category: "survival",
    };
  }

  if (/\b(found|discovered|revealed|exposed|uncovered|dig|dug|excavated|unearthed)\\b/.test(t)) {
    return {
      location: "Discovery scene",
      bg: "The moment of discovery rendered cinematically, dramatic lighting revealing something unexpected, dust particles in shafts of light, the discoverer lit by the glow of what they found",
      time: "Dramatic reveal lighting — darkness pierced by discovery light",
      atmosphere: "The shock of finding something, revelation energy",
      category: "discovery",
    };
  }

  if (/\b(made|built|created|constructed|designed|crafted|forged|assembled|diy|restored|renovated|rebuilt|upcycled)\\b/.test(t)) {
    return {
      location: "Workshop / creation scene",
      bg: "Dramatic workshop or build scene, tools and materials scattered, the creation in progress or complete, sparks flying, sawdust or debris, the energy of making something from nothing",
      time: "Workshop lighting — warm practicals and dramatic task lighting",
      atmosphere: "Creative energy, the satisfaction of building",
      category: "building",
    };
  }

  if (/\b(went|visited|entered|explored|trespassed|sneaked|broke in|infiltrated|sneak|broke into)\\b/.test(t)) {
    return {
      location: "Mysterious destination",
      bg: "The moment of arrival or entry, dramatic doorway or threshold, the unknown stretching ahead, atmospheric haze, tension in the air about what lies beyond",
      time: "Dramatic threshold lighting — light from beyond the entry",
      atmosphere: "Anticipation and the thrill of the unknown",
      category: "exploration",
    };
  }

  if (/\b(spent|lived|stayed|days|hours|weeks|months|years|24|48|72|100|challenged|challenge|endured)\\b/.test(t)) {
    return {
      location: "Endurance challenge environment",
      bg: "Dramatic environment showing the passage of time and the toll of endurance, clock or timer visible, the subject showing wear and determination, environmental storytelling of the challenge",
      time: "Dramatic cinematic lighting — emphasizing the passage of time",
      atmosphere: "Endurance and determination, the will to keep going",
      category: "challenge",
    };
  }

  // ── Default cinematic ──
  return {
    location: "Cinematic environment",
    bg: "Dramatic cinematic wide shot with atmospheric depth, environmental storytelling elements, the scene set to maximize visual impact and narrative tension",
    time: "Cinematic golden hour with dramatic atmosphere",
    atmosphere: "Story tension and cinematic drama",
    category: "cinematic",
  };
}

// ─── EXPRESSION DETECTOR ────────────────────────────────
function detectExpression(topic: string, mods: Modifiers, energy: string): string {
  // ── MODIFIER-BASED ──
  if (mods.scary) {
    return "primal terror — eyes blown impossibly wide with whites fully visible, mouth open in a silent scream showing teeth, eyebrows pushed to maximum height, body physically recoiling backward, skin drained of color";
  }
  if (mods.cute) {
    return "adorable heartwarming joy — the softest warmest smile possible, eyes crinkled into happy crescents, cheeks pushed up high, a slight head tilt of pure innocence";
  }
  if (mods.funny) {
    return "explosive uncontrolled laughter — mouth wide open in mid-laugh, eyes squeezed completely shut, head thrown back, cheeks bunched up, tears of laughter forming";
  }
  if (mods.sad) {
    return "deep sorrow — eyes glistening with forming tears, lower lip trembling, eyebrows pushed together in anguish, chin wrinkled, head tilted slightly down";
  }
  if (mods.angry) {
    return "intense rage — eyebrows pushed down creating a furious V-shape, jaw clenched tight, nostrils flared, eyes narrowed to a burning glare, veins visible on forehead and neck";
  }
  if (mods.wealth && mods.prestige) {
    return "controlled confident satisfaction — knowing subtle smile, chin raised, eyes half-lidded with quiet triumph, jaw relaxed, head tilted 5 degrees to one side";
  }
  if (mods.cheap) {
    return "disappointed disgust — nose wrinkled, one eyebrow raised in judgment, lips curled into a skeptical sneer, eyes narrowed";
  }
  if (mods.achievement) {
    return "explosive triumphant pride — the biggest beaming smile possible, eyes sparkling with tears of joy, chin raised high, arms instinctively moving upward in victory";
  }

  // ── ENERGY-BASED ──
  if (energy === "controlled") return "controlled confident satisfaction — knowing subtle smile, chin raised, eyes half-lidded with quiet triumph";
  if (energy === "terrified") return "primal terror — eyes blown impossibly wide, mouth in silent scream, body recoiling, skin drained of color";
  if (energy === "devastated") return "complete devastation — head dropped, eyes hollow, mouth slightly open in disbelief, shoulders collapsed inward";
  if (energy === "suspicious") return "suspicious knowing — one eyebrow raised, slight smirk, eyes narrowed and scanning, jaw clenched slightly";
  if (energy === "secretive") return "conspiratorial whisper — eyes darting left and right, knowing grin, eyebrows raised in a knowing look";
  if (energy === "disbelief") return "maximum disbelief — jaw dropped, mouth forming a perfect O, both hands on cheeks, eyes at maximum width";
  if (energy === "awe") return "quiet awe — mouth slightly open, eyes wide and soft with wonder, head tilted slightly upward";
  if (energy === "triumphant") return "explosive triumph — fist raised, massive grin showing all teeth, chest puffed out, eyes blazing with victory";
  if (energy === "isolated") return "haunting isolation — eyes distant and unfocused, face slack and empty, shoulders hunched inward";
  if (energy === "nervous") return "nervous anticipation — wide eyes darting with excited anxiety, lower lip caught between teeth, slight nervous smile";
  if (energy === "emotional") return "raw emotional vulnerability — eyes brimming with tears, mouth slightly trembling, chin wrinkled";
  if (energy === "fear") return "genuine fear — eyes wide and locked on threat, mouth open in frozen gasp, skin pale, body leaning away";
  if (energy === "explosive" && mods.positive) return "explosive euphoria — biggest possible smile, eyes squeezed nearly shut with joy, head thrown back";
  if (energy === "explosive") return "explosive shock — mouth wide open, eyes at maximum width, eyebrows at hairline, hands raised";

  // ── KEYWORD-BASED ──
  const t = topic.toLowerCase();
  if (/\b(survive|danger|attack)\\b/.test(t)) return "extreme primal survival shock — eyes blown wide with animal terror, face drained of color, sweat visible";
  if (/\b(won|champion|trophy)\\b/.test(t)) return "explosive victory — arms thrown wide, mouth in roar of triumph, tears of joy";
  if (/\b(lost|fail|disaster)\\b/.test(t)) return "complete collapse — head in hands, shoulders heaving, eyes hollow, total defeat";
  if (/\b(found|discover|revealed)\\b/.test(t)) return "stunned discovery — mouth forming perfect O, eyes locked forward, one hand raised toward discovery";
  if (/\b(bought|received|unboxed|opened)\\b/.test(t)) return "excited reveal — wide excited smile, eyes bright and sparkling, pure unbridled excitement";
  if (/\b(confess|truth|sorry|admit)\\b/.test(t)) return "serious confessional — eyes locked into camera, jaw clenched, lips pressing then parting to speak";
  if (/\b(accepted|admitted|hired|promoted|graduated)\\b/.test(t)) return "overwhelmed joyful disbelief — mouth open in shocked scream of joy, eyes wide with tears of happiness, hands covering mouth";

  return "wide open mouth maximum shock — jaw dropped, eyes at maximum width, one arm extending toward camera";
}

// ─── PROP DETECTOR — SCENE-FIRST APPROACH ───────────────
// Priority: 1) Specific object user mentioned → 2) Scene-appropriate default
function detectProp(topic: string, _mods: Modifiers, scene: Scene): string {
  const t = topic.toLowerCase();

  // ── SPECIFIC OBJECT USER MENTIONED (highest priority) ──
  // Only trigger for direct physical objects the user explicitly mentions
  if (/\b(trophy|medal|championship|champion belt)\\b/.test(t)) return "raising a championship trophy high above their head with both hands, the metal catching golden light";
  if (/\b(snake|python|cobra|viper)\\b/.test(t)) return "gripping a large snake with both hands, muscles straining, the creature writhing";
  if (/\b(shark|whale|dolphin)\\b/.test(t)) return "reaching toward the massive creature in the water, hand inches from its surface";
  if (/\b(bear|lion|tiger|crocodile|gorilla|elephant|dinosaur|dragon)\\b/.test(t)) return "standing face-to-face with the massive creature, arms raised defensively";

  // ── ACCEPTANCE / ACADEMIC (check BEFORE fashion) ──
  if (/\b(accepted|admitted|approval|enrollment|admission|scholarship|grant|funding|enrolled)\\b/.test(t)) return "holding up an official acceptance letter with both hands, golden university seal catching the light, trembling with excitement";
  if (/\b(graduated|graduation|diploma|degree|bachelor|master|phd|doctorate)\\b/.test(t)) return "holding up a diploma with one hand, graduation cap in the other, both catching golden light";
  if (/\b(exam|test|finals|midterm|quiz)\\b/.test(t)) return "holding up a test paper with a massive A+ grade circled in red, paper catching golden light";

  // ── SCENE-BASED PROP (the main driver) ──
  const cat = scene.category;
  switch (cat) {
    case "school":
      return "holding up an official acceptance letter or open textbook with both hands, pages catching warm light through stained glass, university crest visible";
    case "horror":
      return "clutching a flashlight with white knuckles, beam cutting through darkness, knuckles bloodless from grip";
    case "tech":
    case "product":
    case "science":
      return "holding a glowing device or holographic display toward the camera, screen illuminating their face";
    case "food":
      return "holding an absurdly oversized food item toward the camera — impossibly large and photogenic, steam rising";
    case "fashion":
      if (/\b(nike|adidas|jordan|yeezy|shoes|sneaker|boots)\\b/.test(t)) return "holding up the sneakers toward the camera with both hands in an excited reveal, soles facing forward, shoes perfectly lit";
      if (/\b(shirt|hoodie|jacket|coat|dress|top)\\b/.test(t)) return "holding up the clothing item on a hanger toward the camera, fabric catching dramatic light";
      if (/\b(bag|purse|backpack)\\b/.test(t)) return "holding up the bag toward the camera with both hands, logo catching the light";
      return "holding up the product toward the camera with both hands in an excited reveal pose, perfectly lit";
    case "sports":
    case "victory":
      return "raising sports equipment or a trophy above head with both hands, muscles tensed, sweat visible";
    case "music":
      return "gripping a microphone with one hand, the other raised toward the crowd, stage sweat visible";
    case "car":
      return "dangling car keys toward the camera with a knowing smile, the keys catching dramatic light";
    case "money":
    case "water_wealth":
      return "holding an enormous fanned stack of cash toward the camera, bills catching warm golden light";
    case "gaming":
      return "holding a glowing controller toward the camera, screen reflecting in eyes, RGB lighting everywhere";
    case "beach":
      return "holding up a tropical drink or surfboard toward the camera, ocean spray catching golden light";
    case "nature":
      return "holding a compass or walking stick, pointing toward the horizon with the other hand";
    case "crime":
      return "holding up a classified document or evidence file toward the camera, red stamp visible";
    case "animal":
    case "animal_cute":
      return "holding an adorable animal up toward the camera, both cradling and presenting it gently";
    case "animal_danger":
      return "arms raised defensively facing the creature, muscles tensed, bracing for impact";
    case "emotion":
      return "reaching out toward the camera with an open hand, emotionally vulnerable, palm forward";
    case "discovery":
      return "holding up the discovered item toward the camera with reverence, golden light emanating from it";
    case "defeat":
      return "head in both hands, shoulders collapsed, the universal pose of defeat";
    case "building":
      return "holding the finished creation or a key tool up toward the camera triumphantly";
    case "shopping":
      return "holding the purchased item toward the camera with both hands in an excited reveal pose";
    case "challenge":
      return "holding up a timer or score display showing the result, numbers glowing";
    case "exploration":
      return "holding a flashlight beam ahead, illuminating what lies beyond the threshold";
    case "space":
      return "pointing at the rocket or planet with fully extended arm, visor reflecting cosmic light";
    case "underwater":
      return "holding a glowing artifact or diving equipment toward the camera, bubbles rising around";
    case "mountain":
      return "gripping an ice axe or planting a flag at the summit, wind and snow whipping around";
    case "desert":
      return "holding a compass or water bottle, squinting against the blinding sun";
    case "jungle":
    case "survival":
      return "holding a machete or survival tool, sweat and dirt on face, jungle canopy behind";
    case "water":
      return "gripping the boat railing as spray hits, knuckles white, wind in hair";
    case "city":
      return "pointing toward the city skyline with one arm extended, urban energy radiating";
    case "ancient":
      return "holding an ancient artifact or torch, the object catching dramatic firelight";
    case "art":
      return "holding a paintbrush or the finished artwork toward the camera, colors vibrant";
    case "social":
      return "holding a phone toward the camera showing a viral post, screen glowing with notifications";
    case "travel":
      return "holding a passport or boarding pass toward the camera with excitement, stamps visible";
    case "home":
      return "holding keys or a meaningful personal item, domestic warmth in the background";
    case "hospital":
      return "holding medical results or a stethoscope, the gravity of the moment visible";
    case "military":
      return "holding military equipment or a medal, standing at attention, the weight of service visible";
    case "wedding":
      return "holding up a wedding ring or bouquet toward the camera, diamonds catching the light";
    case "prison":
      return "gripping steel bars with both hands, face pressed between them, knuckles white";
    case "fantasy":
      return "holding a glowing magical artifact or wand, mystical energy emanating from it";
    default:
      return "pointing dramatically toward camera with fully extended arm, finger extended";
  }
}

// ─── TITLE INTEGRATION — ALWAYS SCENE-CONTEXTUAL ────────
function detectTitleIntegration(scene: Scene, mods: Modifiers): string {
  const cat = scene.category;

  // Modifier overrides
  if (mods.scary || cat === "horror") return "The video title scratched desperately into a wall, letters rough and uneven, lit by a single flickering light";
  if (mods.funny) return "The video title in bright bold floating letters, playful and energetic, comedy marquee style";
  if (mods.sad) return "The video title handwritten on a personal letter, ink slightly smudged, intimate and emotional";
  if (mods.angry) return "The video title in bold aggressive red typography, heavy impact font, confrontational";
  if (mods.cute) return "The video title in soft pastel lettering on a warm greeting card, gentle and heartwarming";
  if (mods.achievement) return "The video title embossed in gold on an official certificate, formal and triumphant, gold seal visible";
  if (mods.wealth && mods.prestige) return "The video title in polished gold lettering on marble, each letter catching warm light, luxury signage";

  // Scene-based — NO wooden boards ever
  switch (cat) {
    case "school": return "The video title embossed on an official acceptance letter or engraved on a classical stone university archway overhead";
    case "tech": case "product": case "science": return "The video title as a floating holographic display or glowing on a sleek screen, futuristic LED aesthetic";
    case "gaming": return "The video title as a neon arcade marquee or integrated into a game HUD overlay, RGB-lit";
    case "music": return "The video title as a neon concert venue marquee sign, glowing in warm amber against darkness";
    case "car": return "The video title on a custom license plate or illuminated across the car's dashboard display";
    case "fashion": return "The video title on a glossy magazine cover or luxury shopping bag, fashion editorial typography";
    case "food": return "The video title written artistically on a chalkboard menu or plated in decorative sauce by a chef";
    case "sports": case "victory": return "The video title blazing on a stadium scoreboard or jumbotron, arena-style block letters";
    case "city": return "The video title as a massive neon billboard in the city background, urban signage cutting through the night";
    case "beach": return "The video title written in sand with tropical flowers and shells nearby, gentle waves in the background";
    case "nature": return "The video title carved into natural stone or formed from arranged natural elements in the scene";
    case "space": return "The video title as a constellation of stars or floating chrome letters in zero gravity";
    case "underwater": return "The video title glowing with bioluminescent light, letters formed by underwater organisms";
    case "mountain": return "The video title carved into ice or picked out in bright stones on a snowy peak";
    case "desert": return "The video title traced in sand with wind-carved precision, vast desert behind";
    case "jungle": case "survival": return "The video title carved into rough bark or woven from jungle vines";
    case "money": case "water_wealth": return "The video title spelled out in gold bullion letters on marble or floating as 3D gold text";
    case "crime": return "The video title as a classified document header stamped in red, or a case file number";
    case "home": return "The video title on a framed photo or decorative wall art in the background";
    case "animal": case "animal_cute": case "animal_danger": return "The video title on a National Geographic-style magazine cover";
    case "social": return "The video title as a viral social media notification or trending overlay";
    case "art": return "The video title painted on a canvas in bold brushstrokes or as a gallery wall label";
    case "travel": return "The video title on a vintage luggage tag or passport stamp design";
    case "emotion": return "The video title handwritten on a personal letter or journal page";
    case "shopping": return "The video title on a sleek price tag or product label, clean modern retail aesthetic";
    case "defeat": return "The video title crumpled on a discarded newspaper headline, the typography of failure";
    case "discovery": return "The video title revealed in a beam of light on an ancient scroll, the typography of revelation";
    case "building": return "The video title on a blueprint or workshop drawing, construction aesthetic";
    case "exploration": return "The video title on a weathered treasure map or expedition journal";
    case "challenge": return "The video title on a countdown timer display or challenge card";
    case "water": return "The video title on a weathered ship's wheel or painted on the boat hull";
    case "ancient": return "The video title carved into ancient stone tablets, the weight of ages in every letter";
    case "hospital": return "The video title on a medical chart or illuminated hospital display screen";
    case "military": return "The video title stenciled on military equipment or a medal engraving";
    case "wedding": return "The video title in elegant calligraphy on a wedding invitation or ceremony program";
    case "prison": return "The video title scratched into a concrete prison wall or on a visitor badge";
    case "fantasy": return "The video title glowing with magical runes on an ancient spellbook or floating in mystical energy";
    default: return "The video title integrated naturally into the scene environment, displayed contextually";
  }
}

// ─── COLOR GRADE DETECTOR ───────────────────────────────
function detectColorGrade(mods: Modifiers, scene: Scene): string {
  const cat = scene.category;

  // Modifier overrides
  if (mods.scary) return "Desaturated cold horror grade — blue-green shadows, crushed blacks, desaturated midtones, the color of nightmare";
  if (mods.sad) return "Cold desaturated melancholy grade — blue-grey midtones, muted shadows, a single warm light source, the color of heartbreak";
  if (mods.angry) return "Aggressive high-contrast rage grade — deep red shadows, harsh orange highlights, maximum contrast, the color of fury";
  if (mods.funny) return "Bright oversaturated comedy grade — punchy vibrant warm golden tones, lifted blacks, the color of viral comedy";
  if (mods.cute) return "Soft warm pastel grade — gentle warm tones, soft peach and cream highlights, the color of warmth and innocence";
  if (mods.wealth && mods.prestige) return "Rich warm gold and deep velvet black luxury grade — luminous skin tones, rich deep shadows, golden highlights";
  if (mods.cheap) return "Harsh discount grade — flat unflattering desaturated fluorescent tones, the visual equivalent of a dollar store";
  if (mods.achievement) return "Warm triumphant success grade — rich golden highlights, deep warm shadows, warm amber throughout";
  if (mods.decay) return "Desaturated cold decay grade — sickly green-grey midtones, the color of rot and abandonment";
  if (mods.extreme) return "Hyper-saturated extreme grade — maximum color punch, crushed blacks, everything pushed to the limit";

  // Scene-based
  switch (cat) {
    case "horror": return "Desaturated cold horror grade — blue-green shadows, crushed blacks, the color of nightmare";
    case "space": case "underwater": return "Deep blue-purple otherworldly grade — bioluminescent cyan and deep space violet";
    case "jungle": case "survival": return "Extreme warm golden-amber National Geographic grade — rich amber and burnt orange";
    case "desert": return "Harsh warm amber desert grade — burning orange midtones, deep umber shadows, the color of endless sand";
    case "mountain": return "Ice-cold alpine grade — steel blue and crisp white highlights, deep cool grey shadows";
    case "city": return "Urban neon-warm grade — mixed tungsten and neon, deep city blacks punctuated by colored light sources";
    case "money": case "water_wealth": return "Gold and emerald luxury grade — the colors of money and success, rich warm gold highlights";
    case "gaming": return "Hyper-saturated neon gaming grade — electric blue and hot magenta, RGB wash, maximum saturation";
    case "tech": case "product": case "science": return "Cold cyan-matrix grade — deep blacks with cyan highlights, the color of digital interfaces";
    case "food": return "Rich warm kitchen grade — deep orange and amber, steam catching golden backlight, mouth-watering saturation";
    case "sports": case "victory": return "High-contrast arena grade — dramatic warm spotlight, deep cool shadow, saturated skin with sweat glistening";
    case "water": return "Oceanic blue-steel grade — deep navy shadows, teal midtones, silver highlights from ocean spray";
    case "fashion": return "Clean editorial fashion grade — crisp whites and cool neutrals, subtle warm skin tones, desaturated sophistication";
    case "car": return "Automotive chrome grade — deep metallic blacks, cool steel-blue highlights, warm accent on paintwork";
    case "music": return "Electric stage grade — saturated warm stage lights cutting through cool smoke, piercing colored light sources";
    case "beach": return "Tropical paradise grade — warm golden sand, crystal turquoise and aqua blues, soft white cloud highlights";
    case "ancient": case "school": return "Warm amber heritage grade — rich golden highlights, deep warm umber shadows, the color of history and tradition";
    case "home": return "Warm domestic grade — soft tungsten amber tones, cozy shadows, the color of comfort";
    case "animal": case "animal_cute": return "Documentary wildlife grade — natural warm tones, rich earth colors, authentic fur tones";
    case "animal_danger": return "Dark predatory grade — deep blacks with amber predator-eye highlights, desaturated environment";
    case "social": return "Digital creator grade — slightly oversaturated screen-lit tones, mixed color temperatures, modern and punchy";
    case "nature": return "Natural cinematic grade — authentic earth tones, rich greens and warm browns, enhanced sky saturation";
    case "travel": return "Warm travel grade — golden hour warmth, rich cultural colors, warm skin tones";
    case "art": return "Creative studio grade — balanced neutral with artistic color pops, enhanced creative element saturation";
    case "crime": return "Cold surveillance grade — desaturated with green-tinted midtones, harsh contrast, security footage color";
    case "emotion": return "Emotional cinematic grade — warm golden for positive, cold blue-teal for negative emotions";
    case "shopping": return "Clean retail studio grade — crisp whites with warm product highlights, sophisticated product photography color";
    case "defeat": return "Cold desaturated defeat grade — drained of warmth and life, blue-grey midtones, the color of hopelessness";
    case "discovery": return "Dramatic discovery grade — warm golden reveal light cutting through cool dark shadows";
    case "building": return "Warm workshop grade — rich amber from sparks and hot metal, warm practical lighting";
    case "exploration": return "Mysterious exploration grade — cool shadows, warm light from the destination";
    case "challenge": return "Intense endurance grade — high contrast warm tones, sweat-catching highlights, dramatic shadows";
    case "hospital": return "Cold clinical grade — sterile blue-white highlights, green-tinted midtones, the color of medical environments";
    case "military": return "Desaturated tactical grade — olive and khaki midtones, desaturated shadows, the color of military operations";
    case "wedding": return "Soft romantic grade — warm peach and rose gold tones, lifted shadows, the color of romance and celebration";
    case "prison": return "Cold institutional grade — harsh fluorescent green-grey, crushed shadows, the color of confinement";
    case "fantasy": return "Magical ethereal grade — rich purple and gold tones, otherworldly color shifts, the palette of enchantment";
    case "custom": return detectCustomColorGrade(scene.bg);
    default: return "Cinematic editorial grade — rich warm midtones, controlled contrast, professional editorial photography color";
  }
}

function detectCustomColorGrade(bg: string): string {
  const b = bg.toLowerCase();
  if (/dark|night|black|shadow|cave|tunnel|underground/.test(b)) return "Deep cinematic dark grade — rich blacks, single warm source cutting through darkness, dramatic contrast";
  if (/ocean|sea|water|blue|underwater|pool|aquatic/.test(b)) return "Oceanic blue-steel grade — deep navy shadows, teal midtones, silver highlights from water reflection";
  if (/forest|tree|green|jungle|nature|garden|plant/.test(b)) return "Natural cinematic grade — rich emerald greens, warm dappled light, earthy browns";
  if (/fire|flame|red|lava|volcano|burning|inferno/.test(b)) return "Intense fire grade — deep orange and crimson, glowing ember highlights, warm black shadows";
  if (/snow|ice|cold|frozen|winter|arctic|white/.test(b)) return "Ice-cold alpine grade — steel blue and crisp white highlights, deep cool grey shadows";
  if (/gold|luxury|premium|rich|elegant|palace/.test(b)) return "Rich warm gold luxury grade — luminous skin tones, rich deep shadows, golden highlights";
  if (/neon|cyber|punk|glow|electric|vapor/.test(b)) return "Hyper-saturated neon grade — electric cyan and hot magenta, RGB wash, maximum saturation";
  if (/sunset|sunrise|dawn|dusk|golden|warm/.test(b)) return "Golden hour sunset grade — deep orange and magenta horizon, warm amber throughout";
  if (/space|star|galaxy|cosmic|nebula|planet/.test(b)) return "Deep space grade — deep blue-purple, bioluminescent cyan accents, cosmic violet shadows";
  if (/rain|storm|cloud|grey|mist|fog/.test(b)) return "Moody atmospheric grade — desaturated blue-grey, single warm light source, cinematic fog";
  if (/city|urban|street|building|skyline|downtown/.test(b)) return "Urban neon-warm grade — mixed tungsten and neon, deep city blacks punctuated by colored light sources";
  if (/desert|sand|dry|dust|sahara|canyon/.test(b)) return "Harsh warm amber desert grade — burning orange midtones, deep umber shadows";
  if (/blood|horror|scary|creepy|haunted/.test(b)) return "Desaturated cold horror grade — blue-green shadows, crushed blacks, the color of nightmare";
  if (/pink|pastel|soft|dream|candy|bubblegum/.test(b)) return "Soft warm pastel grade — gentle warm tones, soft peach and cream highlights";
  return "Cinematic editorial grade — rich warm midtones, controlled contrast, professional editorial photography color";
}

// ─── LIGHTING DETECTOR ──────────────────────────────────
function detectLighting(mods: Modifiers, scene: Scene): string {
  const cat = scene.category;

  // Modifier overrides
  if (mods.scary) return "Single hard spotlight from directly above — absolute darkness everywhere else, hard shadows under brow and nose";
  if (mods.sad) return "Cold isolated lighting — single weak cool light from one side, long shadows, no fill, the lighting of loneliness";
  if (mods.angry) return "Harsh under-lighting — strong light from below casting ominous shadows, hard edge, dramatic contrast";
  if (mods.funny) return "Bright even comedy lighting — high-key flat front illumination with warm fill, no dramatic shadows";
  if (mods.cute) return "Soft warm beauty lighting — large soft diffused key, warm golden fill, soft catchlights in eyes";
  if (mods.wealth && mods.prestige) return "Multiple controlled studio sources — luxury commercial photography, large soft key, warm rim light";
  if (mods.achievement) return "Triumph lighting — warm golden key from above-left, soft warm fill, golden and celebratory throughout";

  // Scene-based
  switch (cat) {
    case "horror": return "Single hard spotlight from above — absolute darkness elsewhere, hard shadows, one pool of light";
    case "space": case "underwater": return "Single directional cold light with bioluminescent glow — cold blue-white with organic cyan accents";
    case "jungle": case "survival": return "Dappled golden hour through canopy — god rays through foliage, warm pools of gold among deep shadow";
    case "desert": return "Brutal overhead sun or golden hour backlight — punishing direct light or dramatic low-angle backlight";
    case "mountain": return "Cold diffused overcast with sudden dramatic golden shafts through storm clouds reflecting off ice";
    case "city": return "Mixed urban lighting — warm tungsten street lights with cool neon signage, complex color temperatures";
    case "money": case "water_wealth": return "Multiple controlled studio sources — luxury commercial lighting, soft key, warm rim, subtle fill";
    case "gaming": return "LED arena lighting — multiple colored LED sources creating RGB wash, no natural light";
    case "tech": case "product": case "science": return "Precise product lighting — clean key with subtle rim highlights, dark background absorbing light";
    case "food": return "Warm backlit kitchen — strong warm backlight creating steam halos, soft fill preserving food colors";
    case "sports": case "victory": return "Dramatic overhead arena spots — harsh directional light from above, warm key, cool ambient fill";
    case "water": return "Maritime backlight — strong backlight from sun over water, rim light on subject, ocean spray catching light";
    case "ancient": case "school": return "Warm directional natural light — golden hour through architectural openings, shafts through dust motes";
    case "fashion": return "Clean fashion editorial — large soft beauty dish key, subtle rim light, clean fill preserving detail";
    case "car": return "Dramatic automotive — long light strips reflecting off surfaces, strong rim light defining silhouette";
    case "music": return "Dramatic stage — colored spotlights through smoke, harsh key from above, rim lights creating halos";
    case "beach": return "Natural tropical sunlight — warm golden sun low in sky, soft diffusion from atmospheric haze";
    case "home": return "Warm practical — soft warm lamp light, ambient fill from other rooms, intimate home lighting";
    case "animal": case "animal_cute": return "Wildlife photography — natural directional golden hour, catchlight in eyes, shallow depth of field";
    case "animal_danger": return "Dramatic predator — low-angle hard light, amber eye-glow catchlights, dark with creature emerging from shadow";
    case "social": return "Content creator — ring light even front illumination, LED accent strips, monitor glow as secondary";
    case "nature": return "Golden hour natural — warm directional sun at low angle, god rays through atmospheric haze";
    case "travel": return "Travel photography — golden hour warmth with environmental practicals, mixed natural and artificial";
    case "art": return "Gallery studio — skylight or large north-facing window, even and diffuse, professional art lighting";
    case "crime": return "Harsh interrogation — single bare bulb from above, unflattering, harsh shadows, no ambient fill";
    case "emotion": return "Emotional cinematic — warm for love and joy, cold for sadness, always dramatic and purposeful";
    case "shopping": return "Clean retail studio — soft even key, subtle warm rim on product, clean white fill";
    case "defeat": return "Flat desolated — weak diffused grey light, no warmth, the light of hopelessness";
    case "discovery": return "Reveal lighting — warm golden light emanating from discovery, illuminating face from the side";
    case "building": return "Workshop practical — warm task light overhead, sparks providing intermittent illumination";
    case "exploration": return "Threshold — cool darkness behind, warm light from ahead drawing forward";
    case "challenge": return "Endurance — harsh dramatic light showing every bead of sweat, high contrast";
    case "hospital": return "Clinical — harsh fluorescent from above, cold and sterile, no warmth";
    case "military": return "Tactical — mix of natural light and equipment glow, dramatic and gritty";
    case "wedding": return "Romantic — soft golden light with warm fill, fairy lights providing sparkle and bokeh";
    case "prison": return "Institutional — single harsh fluorescent buzzing overhead, deep shadows in corners";
    case "fantasy": return "Magical — ethereal multi-colored light sources, particles catching light, otherworldly glow";
    case "custom": return detectCustomLighting(scene.bg);
    default: return "Dramatic cinematic backlight — god rays through haze, intense rim light creating glowing halo";
  }
}

function detectCustomLighting(bg: string): string {
  const b = bg.toLowerCase();
  if (/dark|night|black|shadow|cave|tunnel|underground/.test(b)) return "Single dramatic source — one warm light cutting through absolute darkness, intense shadows";
  if (/ocean|sea|water|blue|underwater|pool/.test(b)) return "Directional caustic light — rippling water patterns refracting light from above, silvery shafts";
  if (/forest|tree|green|jungle|nature|garden/.test(b)) return "Dappled golden hour through canopy — god rays through foliage, warm pools of gold";
  if (/fire|flame|red|lava|volcano|burning/.test(b)) return "Dramatic firelight — strong warm orange key from below, flickering embers providing fill";
  if (/snow|ice|cold|frozen|winter|arctic/.test(b)) return "Cold diffused overcast — flat even cool light with occasional golden shafts through clouds";
  if (/gold|luxury|premium|rich|elegant/.test(b)) return "Multiple controlled studio sources — luxury commercial photography, soft key, warm rim";
  if (/neon|cyber|punk|glow|electric/.test(b)) return "LED multi-color wash — multiple colored LED sources creating RGB glow, no natural light";
  if (/sunset|sunrise|dawn|dusk|golden/.test(b)) return "Low-angle golden backlight — intense warm rim light, sun flare, god rays through haze";
  if (/space|star|galaxy|cosmic/.test(b)) return "Single directional cold light with subtle bioluminescent glow — cold blue-white";
  if (/rain|storm|cloud|mist|fog/.test(b)) return "Soft diffused through atmosphere — misty even light, weak directional source, moody fill";
  if (/city|urban|street|building/.test(b)) return "Mixed urban lighting — warm tungsten street lights with cool neon signage, complex color temperatures";
  return "Dramatic cinematic backlight — god rays through haze, intense rim light creating glowing halo";
}

// ─── SAFE MODE ──────────────────────────────────────────
function applySafeMode(prompt: string): string {
  const replacements: Record<string, string> = {
    "gun": "tool", "guns": "tools", "blood": "paint", "kill": "defeat",
    "murder": "confrontation", "dead": "defeated", "death": "ending",
    "weapon": "object", "bomb": "device", "explosive": "dramatic",
    "drug": "substance", "drugs": "substances", "poison": "mixture",
    "stab": "strike", "shoot": "capture", "bullet": "projectile",
  };
  let result = prompt;
  for (const [word, replacement] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    result = result.replace(regex, replacement);
  }
  return result;
}

const FACE_LOCK = `\n\nFACE LOCK: Preserve the exact facial features, proportions, and identity of the reference face. Do not alter eye color, nose shape, jawline, cheekbone structure, lip shape, ear position, or skin tone. The face must be photorealistic and perfectly composited into the scene. Maintain exact facial geometry — this is a face replacement composite.`;

export function getPlatformSuffix(platform: string): string {
  switch (platform) {
    case "midjourney": return " --cref --s 250";
    case "firefly": return "\n\nSTYLE NOTES for Adobe Firefly: Photorealistic output, cinematic composition, maintain all described lighting and color grading exactly as specified.";
    case "dalle": return "\n\nIMPORTANT for DALL-E: Generate this as a photorealistic image. Do not add text overlays or watermarks. Maintain cinematic composition as described.";
    default: return "";
  }
}

// ─── MAIN EXPORT ────────────────────────────────────────
export function analyseTopic(topic: string, customBg?: string): AnalysisResult {
  const { mods, energy, detected } = detectModifiers(topic);
  const autoScene = detectScene(topic, mods);
  const expression = detectExpression(topic, mods, energy);

  // If user provided a custom background, build a scene from it
  let scene = autoScene;
  if (customBg && customBg.trim()) {
    const bgDesc = customBg.trim();
    scene = {
      location: bgDesc,
      bg: bgDesc,
      time: autoScene.time,
      atmosphere: autoScene.atmosphere,
      category: "custom",
    };
  }

  const prop = detectProp(topic, mods, scene);
  const colorGrade = detectColorGrade(mods, scene);
  const lighting = detectLighting(mods, scene);
  const titleIntegration = customBg?.trim()
    ? detectTitleIntegrationForCustomBg(customBg.trim(), mods)
    : detectTitleIntegration(scene, mods);
  const camera = pickCameraForScene(scene.category);
  const lightingVariation = pickLightingForScene(scene.category);

  return {
    topic,
    modifiers: mods,
    energy,
    detectedAdjectives: detected,
    scene,
    expression,
    prop,
    colorGrade,
    lighting,
    camera,
    lightingVariation,
    titleIntegration,
    customBg: customBg?.trim() || undefined,
  };
}

function detectTitleIntegrationForCustomBg(bg: string, mods: Modifiers): string {
  const b = bg.toLowerCase();
  if (/school|class|university|campus|college|academy|oxford|harvard|lecture|library/.test(b))
    return "the video title elegantly embossed on a prestigious diploma or engraved on a stone university archway";
  if (/hospital|clinic|doctor|medical|ward|operating/.test(b))
    return "the video title displayed on a glowing medical chart or digital health monitor";
  if (/jungle|forest|wilderness|tree|savanna|amazon/.test(b))
    return "the video title carved into rough bark or formed from twisted jungle vines";
  if (/ocean|sea|water|beach|pool|underwater|coral/.test(b))
    return "the video title written in sea foam or formed from glowing bioluminescent particles on the water surface";
  if (/space|star|galaxy|moon|planet|rocket|nebula/.test(b))
    return "the video title formed as a constellation of bright stars against the cosmic background";
  if (/city|skyline|street|urban|downtown|neon|skyscraper/.test(b))
    return "the video title as a massive neon billboard or glowing digital display integrated into the cityscape";
  if (/desert|sand|dune|sahara|oasis/.test(b))
    return "the video title written in the sand with dramatic shadow casting or formed from scattered desert rocks";
  if (/mountain|peak|summit|cliff|ice|glacier|everest/.test(b))
    return "the video title carved into ancient mountain rock or formed from blowing snow crystals";
  if (/castle|palace|temple|ancient|ruin|medieval|pyramid/.test(b))
    return "the video title etched into ancient stone tablets or glowing on weathered temple walls";
  if (/gym|ring|arena|stadium|track|field|court|boxing/.test(b))
    return "the video title blazing on the stadium jumbotron or arena scoreboard";
  if (/studio|stage|concert|music|festival|dj|band/.test(b))
    return "the video title blazing on a concert venue marquee or massive LED stage display";
  if (/kitchen|restaurant|food|chef|dining|bakery/.test(b))
    return "the video title written in elegant sauce drizzle on a plate or on a rustic chalkboard menu";
  if (/car|garage|road|highway|race|track|drift|ferrari|lambo/.test(b))
    return "the video title glowing on a digital dashboard display or formed from tire marks on asphalt";
  if (/prison|cell|jail|court|police|crime|evidence/.test(b))
    return "the video title stamped as an official case file number or classified document header";
  if (/cave|tunnel|mine|underground|bunker|basement|dark/.test(b))
    return "the video title scratched into stone walls and barely illuminated by flickering torchlight";
  if (/garden|park|flower|meadow|greenhouse|green/.test(b))
    return "the video title formed from blooming flowers and climbing ivy on a garden archway";
  if (/snow|winter|ice|frozen|arctic|christmas/.test(b))
    return "the video title carved from ice crystals or written in fresh snow with dramatic backlight";
  if (/fire|flame|lava|volcano|explosion|burning/.test(b))
    return "the video title formed from roaring flames and floating embers against the inferno";
  if (/game|gaming|esports|arcade|screen|pixel|retro/.test(b))
    return "the video title in glowing neon arcade lettering or as a holographic HUD overlay";
  if (/fashion|store|shop|mall|boutique|runway|closet/.test(b))
    return "the video title on a glossy magazine cover or illuminated storefront window display";
  if (/church|mosque|wedding|ceremony|grave|cemetery/.test(b))
    return "the video title in elegant calligraphy on aged parchment or stained glass";
  if (/office|corporate|meeting|boardroom|desk/.test(b))
    return "the video title on a sleek digital presentation screen or etched on a glass office wall";
  if (/lab|science|experiment|chemistry|biology/.test(b))
    return "the video title projected as a holographic display from a futuristic lab device";
  if (mods.wealth)
    return "the video title embossed in gold leaf on polished marble with diamond accents";
  if (mods.scary)
    return "the video title scratched desperately into a dark surface, letters dripping";
  if (mods.funny)
    return "the video title in bold comic-book style letters with impact lines behind";
  return "the video title seamlessly integrated into the environment — carved, projected, or formed from natural elements in the scene";
}

export function applyPostProcessing(prompt: string, platform: string): string {
  let result = applySafeMode(prompt);
  result += FACE_LOCK;
  result += getPlatformSuffix(platform);
  return result;
}

export function getOrientation(aspectRatio: string): string {
  switch (aspectRatio) {
    case "16:9": return "Landscape orientation 16:9";
    case "9:16": return "Portrait orientation 9:16";
    case "4:5": return "Portrait orientation 4:5";
    case "1:1": return "Square orientation 1:1";
    default: return "Landscape orientation 16:9";
  }
}

export function getArFlag(aspectRatio: string): string {
  switch (aspectRatio) {
    case "16:9": return "16:9";
    case "9:16": return "9:16";
    case "4:5": return "4:5";
    case "1:1": return "1:1";
    default: return "16:9";
  }
}
