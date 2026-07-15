import { Link } from "react-router-dom";
import type { Recipe } from "@/data/types";
import { categoryLabels } from "@/data/recipes";
import { computeSuitability, buildImageUrl } from "@/data/suitability";
import { useStageStore } from "@/store/useStageStore";
import { SafetyBadge } from "./SafetyBadge";

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

// 菜谱卡片：安全徽章优先显示
export function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const stage = useStageStore((s) => s.stage);
  const { level } = computeSuitability(recipe, stage);

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card animate-rise"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-creamdark">
        <img
          src={buildImageUrl(recipe.imagePrompt, "landscape_4_3")}
          alt={recipe.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <SafetyBadge level={level} />
        </div>
        <div className="absolute right-3 top-3 rounded-pill bg-ink/70 px-2.5 py-0.5 text-[11px] font-medium text-cream backdrop-blur">
          {categoryLabels[recipe.category]}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-xl font-semibold leading-snug text-ink">
          {recipe.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-inksoft">
          {recipe.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3 text-[11px] text-inksoft/70">
          <span>HowToCook</span>
          <span className="inline-flex items-center gap-1 font-medium text-clay transition-transform group-hover:translate-x-0.5">
            查看做法 →
          </span>
        </div>
      </div>
    </Link>
  );
}
