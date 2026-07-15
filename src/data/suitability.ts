import type { Level, Stage, SuitabilityResult, Recipe } from "./types";
import { tabooByName } from "./taboos";

// 菜谱在某一阶段的适宜性计算
// 规则：任一 forbidden -> forbidden；任一 caution -> caution；其余 safe
export function computeSuitability(
  recipe: Recipe,
  stage: Stage,
): SuitabilityResult {
  let level: Level = "safe";
  const flagged: SuitabilityResult["flagged"] = [];

  for (const ing of recipe.ingredients) {
    const taboo = tabooByName.get(ing.name);
    if (!taboo) continue;
    const lvl = stage === "pregnancy" ? taboo.pregnancyLevel : taboo.confinementLevel;
    if (lvl === "safe") continue;
    flagged.push({ name: ing.name, role: ing.role, taboo });
    if (lvl === "forbidden") level = "forbidden";
    else if (level !== "forbidden") level = "caution";
  }

  const conclusion = buildConclusion(level, stage, flagged);
  return { level, flagged, conclusion };
}

function buildConclusion(
  level: Level,
  stage: Stage,
  flagged: SuitabilityResult["flagged"],
): string {
  const stageLabel = stage === "pregnancy" ? "孕期" : "月子期";
  if (level === "safe") return `${stageLabel}可以安心食用。`;
  const names = [...new Set(flagged.map((f) => f.name))].join("、");
  if (level === "forbidden")
    return `${stageLabel}不宜食用：含${names}，存在风险或刺激。`;
  return `${stageLabel}建议慎食：含${names}，可减量或寻找替代。`;
}

// 等级展示信息
export const levelMeta: Record<
  Level,
  { label: string; text: string; bg: string; border: string; ring: string; dot: string }
> = {
  safe: {
    label: "适宜",
    text: "text-safe",
    bg: "bg-safe",
    border: "border-safe",
    ring: "ring-safe/30",
    dot: "bg-safe",
  },
  caution: {
    label: "慎食",
    text: "text-caution",
    bg: "bg-caution",
    border: "border-caution",
    ring: "ring-caution/30",
    dot: "bg-caution",
  },
  forbidden: {
    label: "禁食",
    text: "text-forbidden",
    bg: "bg-forbidden",
    border: "border-forbidden",
    ring: "ring-forbidden/30",
    dot: "bg-forbidden",
  },
};

// 阶段展示信息
export const stageMeta: Record<Stage, { label: string; sub: string }> = {
  pregnancy: { label: "孕期", sub: "Pregnancy" },
  confinement: { label: "月子期", sub: "Confinement" },
};

// 视频跳转链接构造
export const buildDouyinUrl = (name: string): string =>
  `https://www.douyin.com/search/${encodeURIComponent(`${name} 做法`)}`;

// 菜谱封面：emoji + 渐变色块（参考 HowToCook Dashboard 风格）
const recipeCoverMap: Record<string, { emoji: string; gradient: string }> = {
  "fanqie-chaodan": { emoji: "🍅", gradient: "from-red-400 to-orange-300" },
  "zheng-shuidan": { emoji: "🥚", gradient: "from-yellow-300 to-amber-200" },
  "xiaomi-nangua-zhou": { emoji: "🎃", gradient: "from-orange-400 to-yellow-300" },
  "xihongshi-jidan-mian": { emoji: "🍜", gradient: "from-red-400 to-rose-300" },
  "shanyao-paigu-tang": { emoji: "🦴", gradient: "from-amber-300 to-stone-200" },
  "yiner-lianzi-hongzao-geng": { emoji: "🫕", gradient: "from-rose-300 to-pink-200" },
  "qingchao-xilanhua": { emoji: "🥦", gradient: "from-green-400 to-emerald-300" },
  "jiucai-jidan": { emoji: "🥬", gradient: "from-lime-400 to-green-300" },
  "hongshao-rou": { emoji: "🥩", gradient: "from-red-500 to-amber-400" },
  "yimi-hongdou-shui": { emoji: "🥤", gradient: "from-red-300 to-rose-200" },
  "guiyuan-hongzao-cha": { emoji: "🍵", gradient: "from-amber-400 to-orange-300" },
  "shanzha-wumei-yin": { emoji: "🧃", gradient: "from-red-400 to-purple-300" },
  "danggui-shengjiang-yangrou-tang": { emoji: "🍲", gradient: "from-amber-400 to-red-300" },
  "zui-ji": { emoji: "🍗", gradient: "from-yellow-300 to-amber-200" },
  "qing-zheng-luyu": { emoji: "🐟", gradient: "from-cyan-400 to-blue-300" },
  "yumi-niurou-zhou": { emoji: "🌽", gradient: "from-yellow-400 to-amber-300" },
  "shicai-tang": { emoji: "🍅", gradient: "from-red-500 to-orange-400" },
  "bocai-chaodan": { emoji: "🥬", gradient: "from-green-400 to-teal-300" },
  "xihongshi-niunan-mian": { emoji: "🍝", gradient: "from-red-400 to-amber-400" },
  "dayou-congbao-ji": { emoji: "🐔", gradient: "from-amber-400 to-yellow-300" },
  "wuhua-rou-dun-mogu": { emoji: "🍄", gradient: "from-stone-400 to-amber-300" },
  "qing-zheng-nangua": { emoji: "🎃", gradient: "from-orange-300 to-yellow-200" },
  "shanyao-xiaomi-zhou": { emoji: "🥣", gradient: "from-amber-200 to-yellow-100" },
  "lingzhi-jitang": { emoji: "🍗", gradient: "from-amber-300 to-orange-200" },
  "luosifen-tang": { emoji: "🪷", gradient: "from-pink-300 to-rose-200" },
  "baicai-doufu-tang": { emoji: "🥬", gradient: "from-lime-300 to-green-200" },
  "yangzhou-chaofan": { emoji: "🍚", gradient: "from-yellow-300 to-amber-200" },
  "xihongshi-doufu-tang": { emoji: "🍅", gradient: "from-rose-300 to-red-200" },
  "ganguo-huacai": { emoji: "🥦", gradient: "from-emerald-400 to-green-300" },
  "mianjin-saicai": { emoji: "🥟", gradient: "from-amber-400 to-orange-300" },
  "huluobo-chao-rou": { emoji: "🥕", gradient: "from-orange-400 to-red-300" },
  "douya-jidan-tang": { emoji: "🌱", gradient: "from-lime-300 to-green-200" },
  "zimian-bingtang-shui": { emoji: "🫘", gradient: "from-purple-400 to-pink-300" },
  "xueli-chuanbei-gao": { emoji: "🍐", gradient: "from-emerald-300 to-teal-200" },
  "congyou-bing": { emoji: "🫓", gradient: "from-yellow-400 to-orange-300" },
  "suncai-chaorou": { emoji: "🎋", gradient: "from-lime-400 to-emerald-300" },
};

export const defaultCover = { emoji: "🍽️", gradient: "from-clay/40 to-sage/30" };

export const getRecipeCover = (recipeId: string) =>
  recipeCoverMap[recipeId] || defaultCover;

// 保留 buildImageUrl 以兼容详情页头图
type ImageSize =
  | "square_hd"
  | "square"
  | "portrait_4_3"
  | "portrait_16_9"
  | "landscape_4_3"
  | "landscape_16_9";

const sizeMap: Record<ImageSize, string> = {
  square_hd: "800/800",
  square: "400/400",
  portrait_4_3: "600/800",
  portrait_16_9: "600/1066",
  landscape_4_3: "800/600",
  landscape_16_9: "1066/600",
};

const foodSeedMap: Record<string, number> = {
  "fanqie-chaodan": 1,
  "zheng-shuidan": 2,
  "xiaomi-nangua-zhou": 3,
  "xihongshi-jidan-mian": 4,
  "shanyao-paigu-tang": 5,
  "yiner-lianzi-hongzao-geng": 6,
  "qingchao-xilanhua": 7,
  "jiucai-jidan": 8,
  "hongshao-rou": 9,
  "yimi-hongdou-shui": 10,
  "guiyuan-hongzao-cha": 11,
  "shanzha-wumei-yin": 12,
  "danggui-shengjiang-yangrou-tang": 13,
  "zui-ji": 14,
};

export const buildImageUrl = (
  recipeId: string,
  size: ImageSize = "landscape_4_3",
): string => {
  const seed = foodSeedMap[recipeId] || Math.floor(Math.random() * 1000);
  return `https://picsum.photos/seed/food${seed}/${sizeMap[size]}`;
};
