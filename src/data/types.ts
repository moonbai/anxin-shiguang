// 阶段：孕期 / 月子期
export type Stage = "pregnancy" | "confinement";

// 安全等级
export type Level = "safe" | "caution" | "forbidden";

// HowToCook 原始分类（本地映射用）
export type RecipeCategory =
  | "breakfast"
  | "staple"
  | "meat_dish"
  | "vegetarian_dish"
  | "soup"
  | "drink"
  | "dessert"
  | "aquatic";

// 食材在菜谱中的角色
export type IngredientRole = "main" | "aux";

// 菜谱中的食材项
export interface RecipeIngredient {
  name: string;
  role: IngredientRole;
}

// 一道菜谱（数据源自 HowToCook）
export interface Recipe {
  id: string;
  name: string;
  category: RecipeCategory;
  description: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  // HowToCook 原始 markdown 地址
  sourceUrl: string;
}

// 禁忌食材（任一阶段含 caution/forbidden 才收录）
export interface TabooItem {
  id: string;
  name: string;
  category: string;
  pregnancyLevel: Level;
  confinementLevel: Level;
  reason: string;
  alternative: string;
}

// 菜谱在某一阶段的适宜性结论
export interface SuitabilityResult {
  level: Level;
  // 命中的非 safe 食材（用于详情页逐项标注与替代建议）
  flagged: Array<{
    name: string;
    role: IngredientRole;
    taboo: TabooItem;
  }>;
  conclusion: string;
}
