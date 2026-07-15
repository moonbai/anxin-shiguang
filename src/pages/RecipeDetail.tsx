import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  PlayCircle,
  ExternalLink,
  Leaf,
  AlertTriangle,
  Ban,
  Lightbulb,
} from "lucide-react";
import { recipeById, categoryLabels } from "@/data/recipes";
import { tabooByName } from "@/data/taboos";
import {
  computeSuitability,
  buildDouyinUrl,
  getRecipeCover,
  levelMeta,
  stageMeta,
} from "@/data/suitability";
import { useStageStore } from "@/store/useStageStore";
import { SafetyBadge } from "@/components/SafetyBadge";
import type { Level } from "@/data/types";
import { cn } from "@/lib/utils";

const levelIcon: Record<Level, typeof Leaf> = {
  safe: Leaf,
  caution: AlertTriangle,
  forbidden: Ban,
};

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const stage = useStageStore((s) => s.stage);
  const recipe = id ? recipeById.get(id) : undefined;

  // 每个食材的安全等级（基于当前阶段）
  const ingredientLevels = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.map((ing) => {
      const taboo = tabooByName.get(ing.name);
      const level: Level = taboo
        ? stage === "pregnancy"
          ? taboo.pregnancyLevel
          : taboo.confinementLevel
        : "safe";
      return { ing, taboo, level };
    });
  }, [recipe, stage]);

  if (!recipe) {
    return (
      <div className="container py-24 text-center">
        <p className="font-display text-3xl text-ink">没有找到这道菜</p>
        <Link to="/" className="mt-4 inline-block text-clay hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  const { level, conclusion, flagged } = computeSuitability(recipe, stage);
  const Icon = levelIcon[level];
  const otherStage = stage === "pregnancy" ? "confinement" : "pregnancy";
  const otherResult = computeSuitability(recipe, otherStage);
  const cover = getRecipeCover(recipe.id);

  return (
    <article className="animate-fade">
      {/* 头图区：emoji + 渐变色块 */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${cover.gradient}`}>
        <div className="container flex min-h-[38vh] flex-col justify-end pb-6 pt-20 md:min-h-[44vh] md:pb-8 md:pt-24">
          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[120px] opacity-20 md:text-[180px] select-none">
            {cover.emoji}
          </span>
          <Link
            to="/"
            className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-pill bg-ink/20 px-3 py-1.5 text-xs font-medium text-ink backdrop-blur hover:bg-ink/30"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回菜谱
          </Link>
          <div className="relative z-10">
            <span className="rounded-pill bg-ink/20 px-2.5 py-0.5 text-[11px] font-medium text-ink backdrop-blur">
              {categoryLabels[recipe.category]}
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl lg:text-6xl">
              {recipe.name}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-ink/80">
              {recipe.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container -mt-6 md:-mt-8 space-y-8 md:space-y-10 py-8 md:py-10">
        {/* 安全结论卡（首要） */}
        <SafetyConclusionCard
          level={level}
          conclusion={conclusion}
          icon={Icon}
          stageLabel={stageMeta[stage].label}
          otherStageLabel={stageMeta[otherStage].label}
          otherLevel={otherResult.level}
        />

        {/* 视频教程跳转 */}
        <section>
          <h2 className="mb-3 font-display text-2xl font-bold text-ink">
            想看视频教程？
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={buildDouyinUrl(recipe.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl bg-douyin px-5 py-4 text-cream shadow-soft transition-transform hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-3">
                <PlayCircle className="h-6 w-6" />
                <span>
                  <span className="block text-sm font-medium">抖音搜教程</span>
                  <span className="block text-xs text-cream/60">
                    搜索「{recipe.name} 做法」
                  </span>
                </span>
              </span>
              <ExternalLink className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </section>

        {/* 食材禁忌清单 */}
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-bold text-ink">
              食材与禁忌标注
            </h2>
            <span className="text-xs text-inksoft">
              当前阶段 · {stageMeta[stage].label}
            </span>
          </div>
          <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5">
            <ul className="divide-y divide-ink/5">
              {ingredientLevels.map(({ ing, taboo, level: l }) => (
                <IngredientRow
                  key={ing.name}
                  name={ing.name}
                  role={ing.role}
                  level={l}
                  taboo={taboo}
                  stage={stage}
                />
              ))}
            </ul>
          </div>
        </section>

        {/* 做法步骤 */}
        <section>
          <h2 className="mb-4 font-display text-2xl font-bold text-ink">
            做法步骤
          </h2>
          <ol className="space-y-3">
            {recipe.steps.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink/5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clay/10 font-display text-sm font-bold text-clay">
                  {i + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 来源 */}
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-creamdark/50 p-4 text-sm">
          <span className="text-inksoft">
            菜谱内容采用开源项目 HowToCook 整理
          </span>
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-clay hover:underline"
          >
            查看原始菜谱
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </section>
      </div>
    </article>
  );
}

function SafetyConclusionCard({
  level,
  conclusion,
  icon: Icon,
  stageLabel,
  otherStageLabel,
  otherLevel,
}: {
  level: Level;
  conclusion: string;
  icon: typeof Leaf;
  stageLabel: string;
  otherStageLabel: string;
  otherLevel: Level;
}) {
  const meta = levelMeta[level];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border-2 p-5 shadow-card md:p-6 lg:p-8",
        meta.border,
        level === "safe"
          ? "bg-sage/8"
          : level === "caution"
            ? "bg-caution/10"
            : "bg-forbidden/10",
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white",
              meta.bg,
            )}
          >
            <Icon className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-inksoft">
              {stageLabel} · 安全结论
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={cn("font-display text-2xl font-bold md:text-3xl", meta.text)}>
                {meta.label}
              </span>
              <SafetyBadge level={level} />
            </div>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink">
              {conclusion}
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-white/60 px-4 py-3 text-xs text-inksoft md:text-right">
          切换到
          <span className="mx-1 font-medium text-ink">{otherStageLabel}</span>
          时：
          <SafetyBadge level={otherLevel} size="sm" className="ml-1" />
        </div>
      </div>
    </div>
  );
}

function IngredientRow({
  name,
  role,
  level,
  taboo,
  stage,
}: {
  name: string;
  role: "main" | "aux";
  level: Level;
  taboo?: ReturnType<typeof tabooByName.get>;
  stage: "pregnancy" | "confinement";
}) {
  const [open, setOpen] = useState(false);
  const meta = levelMeta[level];
  const expandable = level !== "safe";

  return (
    <li>
      <button
        type="button"
        disabled={!expandable}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors",
          expandable ? "hover:bg-creamdark/40 cursor-pointer" : "cursor-default",
        )}
      >
        <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", meta.dot)} />
        <span className="flex-1 text-sm font-medium text-ink">{name}</span>
        <span className="text-[11px] text-inksoft/70">
          {role === "main" ? "主料" : "辅料"}
        </span>
        <SafetyBadge level={level} size="sm" withDot={false} />
        {expandable && (
          <ChevronDown
            className={cn(
              "h-4 w-4 text-inksoft transition-transform",
              open && "rotate-180",
            )}
          />
        )}
      </button>
      {expandable && open && taboo && (
        <div className="mx-5 mb-4 grid gap-3 rounded-2xl bg-creamdark/40 p-4 text-sm sm:grid-cols-2">
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-inksoft">
              <Ban className="h-3.5 w-3.5" />
              原因
            </p>
            <p className="leading-relaxed text-ink">{taboo.reason}</p>
          </div>
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-inksoft">
              <Lightbulb className="h-3.5 w-3.5" />
              替代建议
            </p>
            <p className="leading-relaxed text-ink">{taboo.alternative}</p>
          </div>
          <p className="text-[11px] text-inksoft/70 sm:col-span-2">
            当前阶段 · {stageMeta[stage].label} ·
            另一阶段等级可能不同，请切换顶部查看
          </p>
        </div>
      )}
    </li>
  );
}
