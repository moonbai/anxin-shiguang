import type { Level, Stage, SuitabilityResult, Recipe } from "./types";
import { tabooByName } from "./taboos";
export { getRecipeCover, defaultCover } from "./recipeCovers";

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

// 图片尺寸类型（兼容旧接口）
type ImageSize =
  | "square_hd"
  | "square"
  | "portrait_4_3"
  | "portrait_16_9"
  | "landscape_4_3"
  | "landscape_16_9";

export const buildImageUrl = (
  recipeId: string,
  size: ImageSize = "landscape_4_3",
): string => {
  const sizeMap: Record<ImageSize, string> = {
    square_hd: "800/800",
    square: "400/400",
    portrait_4_3: "600/800",
    portrait_16_9: "600/1066",
    landscape_4_3: "800/600",
    landscape_16_9: "1066/600",
  };
  return `https://picsum.photos/seed/${encodeURIComponent(recipeId)}/${sizeMap[size]}`;
};
