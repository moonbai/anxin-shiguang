import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";
import { recipes, categoryLabels, categoryList } from "@/data/recipes";
import { computeSuitability, stageMeta } from "@/data/suitability";
import { useStageStore } from "@/store/useStageStore";
import { RecipeCard } from "@/components/RecipeCard";
import type { Level, RecipeCategory } from "@/data/types";
import { cn } from "@/lib/utils";

type Filter = "all" | Level;

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "safe", label: "适宜" },
  { key: "caution", label: "慎食" },
  { key: "forbidden", label: "禁食" },
];

export default function Home() {
  const stage = useStageStore((s) => s.stage);
  const [filter, setFilter] = useState<Filter>("all");
  const [category, setCategory] = useState<RecipeCategory | "all">("all");
  const [query, setQuery] = useState("");

  // 今日安心推荐：当前阶段 safe 菜谱取前 3
  const recommendations = useMemo(() => {
    return recipes
      .map((r) => ({ r, level: computeSuitability(r, stage).level }))
      .filter((x) => x.level === "safe")
      .slice(0, 3)
      .map((x) => x.r);
  }, [stage]);

  // 过滤后的菜谱墙
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      const level = computeSuitability(r, stage).level;
      if (filter !== "all" && level !== filter) return false;
      if (category !== "all" && r.category !== category) return false;
      if (q) {
        const inName = r.name.toLowerCase().includes(q);
        const inIng = r.ingredients.some((i) =>
          i.name.toLowerCase().includes(q),
        );
        if (!inName && !inIng) return false;
      }
      return true;
    });
  }, [stage, filter, category, query]);

  return (
    <div className="animate-fade">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/5">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-clay/15 blur-3xl" />
          <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-sage/20 blur-3xl" />
        </div>
        <div className="container py-14 md:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/70 px-3 py-1 text-xs font-medium text-clay ring-1 ring-clay/20 animate-rise">
              <Sparkles className="h-3.5 w-3.5" />
              当前阶段 · {stageMeta[stage].label}
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] text-ink md:text-7xl animate-rise" style={{ animationDelay: "80ms" }}>
              先看能不能吃，
              <br />
              <span className="text-clay">再做给最爱的人</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-inksoft md:text-lg animate-rise" style={{ animationDelay: "160ms" }}>
              基于 HowToCook 开源菜谱，叠加孕期 / 月子期食材安全判定。
              打开菜谱第一眼看到安全结论，想学还能一键跳抖音、小红书看视频。
            </p>
          </div>

          {/* 搜索栏 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // 搜索即过滤，保持当前页
            }}
            className="mt-8 flex max-w-xl items-center gap-2 rounded-pill bg-white p-1.5 pl-5 shadow-soft ring-1 ring-ink/5 animate-rise"
            style={{ animationDelay: "240ms" }}
          >
            <Search className="h-4 w-4 shrink-0 text-inksoft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜菜名或食材，如 番茄、当归、薏米"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-inksoft/50"
            />
            <button type="submit" className="btn-pill bg-clay px-5 text-cream hover:bg-claydark">
              搜索
            </button>
          </form>
        </div>
      </section>

      <div className="container space-y-14 py-12 md:py-16">
        {/* 今日安心推荐 */}
        <section>
          <SectionHeader
            eyebrow="TODAY · 安心推荐"
            title={`今日${stageMeta[stage].label}安心菜`}
            desc={`已按当前阶段过滤出「适宜」菜谱，可放心烹饪`}
          />
          {recommendations.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((r, i) => (
                <RecipeCard key={r.id} recipe={r} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState text="当前阶段暂无适宜菜谱推荐" />
          )}
        </section>

        {/* 禁忌速查入口 */}
        <section>
          <Link
            to="/taboos"
            className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-3xl bg-ink p-8 text-cream shadow-card transition-transform hover:-translate-y-1 md:flex-row md:items-center md:justify-between md:p-10"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-clay/30 blur-3xl" />
            <div className="relative flex items-center gap-5">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-clay text-cream">
                <ShieldAlert className="h-7 w-7" strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold md:text-3xl">
                  禁忌食材速查
                </h3>
                <p className="mt-1 text-sm text-cream/70">
                  孕期 / 月子期 食材安全等级全库 · 含原因与替代建议
                </p>
              </div>
            </div>
            <span className="relative inline-flex items-center gap-2 rounded-pill bg-cream/10 px-5 py-2.5 text-sm font-medium ring-1 ring-cream/20 transition-colors group-hover:bg-cream group-hover:text-ink">
              进入速查
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </section>

        {/* 菜谱墙 */}
        <section>
          <SectionHeader
            eyebrow="RECIPES · 菜谱大厅"
            title="按安全等级浏览"
            desc={`当前阶段 ${stageMeta[stage].label} · 共 ${list.length} 道菜`}
          />

          {/* 安全等级过滤 + 分类导航 */}
          <div className="mb-6 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "rounded-pill px-4 py-1.5 text-sm font-medium transition-all",
                    filter === f.key
                      ? "bg-ink text-cream shadow-soft"
                      : "bg-white text-inksoft ring-1 ring-ink/5 hover:text-ink",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-ink/5 pt-3">
              <button
                onClick={() => setCategory("all")}
                className={cn(
                  "rounded-pill px-3.5 py-1 text-xs font-medium transition-all",
                  category === "all"
                    ? "bg-clay/15 text-clay"
                    : "text-inksoft hover:bg-creamdark",
                )}
              >
                全部分类
              </button>
              {categoryList.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-pill px-3.5 py-1 text-xs font-medium transition-all",
                    category === c
                      ? "bg-clay/15 text-clay"
                      : "text-inksoft hover:bg-creamdark",
                  )}
                >
                  {categoryLabels[c]}
                </button>
              ))}
            </div>
          </div>

          {list.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((r, i) => (
                <RecipeCard key={r.id} recipe={r} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState text="没有符合当前筛选的菜谱，试试切换阶段或过滤条件" />
          )}
        </section>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-semibold tracking-[0.25em] text-clay">
        {eyebrow}
      </p>
      <h2 className="mt-1.5 font-display text-3xl font-bold text-ink md:text-4xl">
        {title}
      </h2>
      {desc && <p className="mt-1.5 text-sm text-inksoft">{desc}</p>}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 py-16 text-center text-sm text-inksoft">
      {text}
    </div>
  );
}
