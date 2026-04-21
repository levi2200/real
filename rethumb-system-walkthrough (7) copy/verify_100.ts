import { analyseTopic } from '/Users/yasser/Desktop/rethumb full base/99 copy 5/src/lib/cinema.ts';

const topics = [
  // Gaming & Esports
  "I beat the hardest boss in Elden Ring without taking damage",
  "Unboxing the PS6 full setup early",
  "Inside the biggest Fortnite tournament in history",
  "Why Minecraft is secretly terrifying",
  "I built a $10,000 ultimate gaming setup",
  "Ranking every GTA game from worst to best",
  "My reaction to the crazy GTA 6 trailer",
  "Getting 100 kills in Warzone using only a pistol",
  "Speedrunning Super Mario 64 blindfolded",
  "We hacked into an unreleased video game",
  
  // Finance & Wealth
  "How I turned $100 into $1M in one year",
  "I spent $50,000 on a ridiculous watch",
  "Why the crypto market just crashed today",
  "Exposing the biggest real estate scam",
  "I survived the worst day on Wall Street",
  "Inside a billionaire's hidden underground bunker",
  "I bought an abandoned mansion for $1",
  "Giving away $500,000 to random subscribers",
  "Testing cheap vs luxury private jets",
  "My exact investment portfolio revealed",

  // Survival & Challenges
  "I survived 50 hours in the frozen tundra",
  "Trapped in the middle of the ocean on a tiny raft",
  "I built an unbreakable survival shelter in the jungle",
  "Escaping the world's most dangerous prison",
  "Surviving a category 5 hurricane in a DIY boat",
  "I ate nothing but survival rations for 30 days",
  "I got left behind in the Sahara desert",
  "Bitten by the deadliest snake in Australia",
  "I won a $100k prize for living in a cave",
  "Climbing Mount Everest with no oxygen",

  // Adventure & Exploration
  "I snuck into a forgotten medieval castle at midnight",
  "Exploring the terrifying Catacombs of Paris",
  "I found a secret vault under my house",
  "What happens if you fall into a volcano?",
  "I got lost in the Amazon rainforest alone",
  "Diving 1000ft to a sunken pirate ship",
  "Trespassing in an abandoned nuclear facility",
  "I traveled to the most isolated island on Earth",
  "Finding ancient Roman ruins in my backyard",
  "Sleeping in a haunted Victorian asylum",

  // Tech & Science
  "Testing a homemade iron man suit",
  "I built a robot that cooks Michelin star food",
  "What actually happens inside a black hole?",
  "I mixed liquid nitrogen and boiling water",
  "Destroying an iPhone 15 with a massive hydraulic press",
  "Why AI is about to change everything",
  "I hacked my own brain with computer chips",
  "Testing the world's strongest laser pointer",
  "Inside the secret Apple testing laboratory",
  "We launched a couch into orbit",

  // Food & Lifestyle
  "Eating the spiciest pepper on earth",
  "I tried a $5,000 gold plated steak",
  "Surviving 24 hours eating only cheap ramen",
  "Cooking a massive feast for 100 homeless people",
  "I ruined my kitchen making Gordon Ramsay's recipe",
  "Testing viral TikTok food hacks",
  "Inside the most exclusive restaurant in Tokyo",
  "I built a secret underground kitchen",
  "Tasting 100 year old military MREs",
  "The truth about fast food kitchens",

  // Vlogs & Storytime
  "The craziest prank I pulled on my best friend",
  "I quit my high paying tech job today",
  "My transformation from broke to wealthy",
  "Why I am leaving YouTube forever",
  "I surprised my mom with her dream car",
  "The worst date I have ever been on",
  "I confronted my childhood bully",
  "A day in my life living in a tiny van",
  "I got stranded at the airport for 48 hours",
  "The truth about my tragic accident",

  // Fitness & Sports
  "I trained like an Olympic gymnast for a week",
  "Lifting the heaviest weight in the gym",
  "Inside the most underground fight club",
  "I ran an ultramarathon with no prep",
  "My epic 90-day muscle transformation",
  "Testing the most dangerous extreme sport",
  "I challenged a pro boxer to a real fight",
  "How to build muscle using only a towel",
  "This intense workout completely ruined me",
  "Winning the gold medal against all odds",

  // Drama & Culture
  "Exposing the truth about Hollywood celebrities",
  "Why everyone is canceling this famous influencer",
  "I snuck backstage at a massive music festival",
  "The greatest rap battle of all time",
  "The hidden scandal behind this pop star",
  "I bought every ticket to my enemy's concert",
  "What really happened during the live broadcast",
  "Uncovering the biggest internet mystery",
  "The secret lives of private detectives",
  "I went undercover in a dangerous cult",
  
  // Random / Miscellaneous
  "I built a working roller coaster in my backyard",
  "What happens if you microwave a glowing lightbulb",
  "I survived the world's scariest roller coaster",
  "I found an actual treasure map",
  "We adopted 50 stray dogs in one day",
  "The most expensive mistake in history",
  "I lived like a medieval king for a week",
  "We created a real life Jurassic Park",
  "Testing the strongest glue in the universe",
  "I spent 24 hours entirely in VR"
];

let failedCount = 0;
let defaultCount = 0;

for (const t of topics) {
  const result = analyseTopic(t);
  
  // We consider it a "fallback" if the background is the exact default "sweeping cinematic landscape" 
  // or if the expression is the exact default "wide open mouth expression of maximum shock".
  const isDefaultScene = result.scene.bg.includes('sweeping cinematic landscape, dramatic golden hour lighting, vast scale, atmospheric depth haze, the perfect backdrop for maximum visual impact');
  const isDefaultExpr = result.expression.includes('archetypal viral YouTube expression');
  
  if (isDefaultScene) defaultCount++;
  
  // You can adjust logging verbosity as needed
  if (isDefaultScene || isDefaultExpr || result.scene.location.includes("dramatic cinematic environment")) {
    console.log(`\n⚠️ POTENTIAL FALLBACK DETECTED: "${t}"`);
    console.log(`Location:   ${result.scene.location}`);
    console.log(`Expression: ${result.expression.substring(0, 60)}...`);
    console.log(`Prop:       ${result.prop}`);
  }
}

console.log(`\nTotal topics tested: ${topics.length}`);
console.log(`Total completely default scenes: ${defaultCount}`);
