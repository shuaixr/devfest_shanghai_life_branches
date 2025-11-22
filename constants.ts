import { Era, EraConfig } from './types';

export const ERA_CONFIGS: Record<Era, EraConfig> = {
  [Era.QingDynasty]: {
    id: Era.QingDynasty,
    name: "晚清风云",
    year: "1890",
    description: "西风东渐，长袍马褂与煤气灯的初遇",
    color: "text-stone-800",
    bgGradient: "from-stone-200 to-stone-100",
    defaultPrompt: "Vintage wet plate photography portrait of this person in 1890 Late Qing Dynasty Shanghai. Wearing traditional Qing dynasty silk robe or magua. Background shows traditional Shikumen architecture mixed with early western brick buildings, gas lamps. Sepia tone, scratches, heavy film grain, historical archive aesthetic.",
    captionPrompt: "为这位身处1890年晚清上海的人物写一句简短的中文独白（20字以内），体现传统与变革交织的迷茫或希望。"
  },
  [Era.OldShanghai]: {
    id: Era.OldShanghai,
    name: "繁花旧梦",
    year: "1930",
    description: "十里洋场，爵士乐与旗袍的黄金时代",
    color: "text-amber-800",
    bgGradient: "from-amber-100 to-orange-50",
    defaultPrompt: "A vintage highly detailed portrait photo of this person in 1930s Old Shanghai. Sepia toned, film grain. Background features Art Deco architecture of The Bund. The person is wearing elegant period clothing (Qipao or Changshan suit). Soft, warm lighting, nostalgic atmosphere, Wong Kar-wai movie style aesthetic.",
    captionPrompt: "为这位身处1930年代旧上海的人物写一句简短的中文独白（20字以内），体现优雅、怀旧或当时名流的身份。"
  },
  [Era.ReformEra]: {
    id: Era.ReformEra,
    name: "激荡岁月",
    year: "1990",
    description: "霓虹初上，出租车与建设中的东方明珠",
    color: "text-indigo-900",
    bgGradient: "from-indigo-100 to-purple-100",
    defaultPrompt: "A 1990s film style portrait of this person in Shanghai. Retro fashion, oversized suit or denim. Background shows busy Nanjing Road with many neon signs, bicycles, and the Oriental Pearl Tower under construction. High contrast, slightly grainy color film, vivid nostalgic Wong Kar-wai 'Fallen Angels' vibe.",
    captionPrompt: "为这位身处1990年代改革开放初期上海的人物写一句简短的中文独白（20字以内），体现奋斗、机遇与时代的活力。"
  },
  [Era.ModernShanghai]: {
    id: Era.ModernShanghai,
    name: "魔都格调",
    year: "2025",
    description: "M50艺术区与陆家嘴天际线的交响",
    color: "text-slate-800",
    bgGradient: "from-slate-100 to-gray-50",
    defaultPrompt: "A high-quality modern editorial portrait of this person in 2025 Contemporary Shanghai. Background shows the blurred Shanghai Tower and Lujiazui skyline or M50 art district. The person is wearing stylish, smart-casual modern fashion. Crisp, natural lighting, depth of field, high resolution, trendy urban lifestyle vibe.",
    captionPrompt: "为这位身处2025年现代上海的人物写一句简短的中文独白（20字以内），体现都市精英、艺术家或享受生活的态度。"
  },
  [Era.FutureShanghai]: {
    id: Era.FutureShanghai,
    name: "赛博东方",
    year: "2050",
    description: "霓虹闪烁的浦东，虚实共生的未来",
    color: "text-fuchsia-600",
    bgGradient: "from-fuchsia-900 via-purple-900 to-slate-900",
    defaultPrompt: "A cinematic futuristic portrait of this person in 2050 Cyberpunk Shanghai. Neon lights, holographic advertisements in Chinese characters in the background. The person has subtle cybernetic implants or AR glasses, wearing high-tech functional fashion. Cool blue and magenta lighting, misty atmosphere, blade runner aesthetic.",
    captionPrompt: "为这位身处2050年未来上海的人物写一句简短的中文独白（20字以内），体现高科技、赛博朋克或对未来的思考。"
  },
  [Era.StellarCity]: {
    id: Era.StellarCity,
    name: "星际魔都",
    year: "2100",
    description: "反重力浮空城，人类文明的新高度",
    color: "text-cyan-400",
    bgGradient: "from-slate-900 via-cyan-900 to-black",
    defaultPrompt: "Concept art portrait of this person in 2100 Shanghai. The city is now a floating metropolis in the clouds / space elevator base. The person wears sleek, ethereal post-human clothing with glowing geometric patterns. Background shows anti-gravity structures and starships. Ethereal lighting, clean sci-fi aesthetic, 8k resolution.",
    captionPrompt: "为这位身处2100年星际时代上海的人物写一句简短的中文独白（20字以内），体现超越地球、探索宇宙的宏大视角。"
  },
};

export const MOCK_IMAGES: Record<Era, string> = {
  [Era.QingDynasty]: "https://picsum.photos/400/500?sepia",
  [Era.OldShanghai]: "https://picsum.photos/400/500?grayscale",
  [Era.ReformEra]: "https://picsum.photos/400/500?contrast",
  [Era.ModernShanghai]: "https://picsum.photos/400/500",
  [Era.FutureShanghai]: "https://picsum.photos/400/500?blur=2",
  [Era.StellarCity]: "https://picsum.photos/400/500?blur=4",
};

export const INITIAL_PROMPTS: Record<Era, string> = {
  [Era.QingDynasty]: ERA_CONFIGS[Era.QingDynasty].defaultPrompt,
  [Era.OldShanghai]: ERA_CONFIGS[Era.OldShanghai].defaultPrompt,
  [Era.ReformEra]: ERA_CONFIGS[Era.ReformEra].defaultPrompt,
  [Era.ModernShanghai]: ERA_CONFIGS[Era.ModernShanghai].defaultPrompt,
  [Era.FutureShanghai]: ERA_CONFIGS[Era.FutureShanghai].defaultPrompt,
  [Era.StellarCity]: ERA_CONFIGS[Era.StellarCity].defaultPrompt,
};