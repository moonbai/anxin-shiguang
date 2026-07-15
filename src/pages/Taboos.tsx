import { useMemo, useState } from "react";
import { Search, ChevronDown, Ban, Lightbulb } from "lucide-react";
import { tabooItems } from "@/data/taboos";
import { levelMeta, stageMeta } from "@/data/suitability";
import { useStageStore } from "@/store/useStageStore";
import { SafetyBadge } from "@/components/SafetyBadge";
import type { Level, Stage, TabooItem } from "@/data/types";
import { cn } from "@/lib/utils";

type Filter = "all" | Level;

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "safe", label: "适宜" },
  { key: "caution", label: "慎食" },
  { key: "forbidden", label: "禁食" },
];

export default function Taboos() {
  const { stage, setStage } = useStageStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const levelOf = (t: TabooItem, s: Stage): Level =>
    s === "pregnancy" ? t.pregnancyLevel : t.confinementLevel;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tabooItems
      .map((t) => ({ t, level: levelOf(t, stage) }))
      .filter(({ t, level }) => {
        if (filter !== "all" && level !== filter) return false;
        if (q && !t.name.toLowerCase().includes(q)) return false;
        return true;
      });
  }, [stage, filter, query]);

  // 统计
  const counts = useMemo(() => {
    const c = { safe: 0, caution: 0, forbidden: 0 };
    tabooItems.forEach((t) => {
      c[levelOf(t, stage)]++;
    });
    return c;
  }, [stage]);

  return (
    <div className="animate-fade">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/5 bg-ink">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-forbidden/30 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-caution/20 blur-3xl" />
        </div>
        <div className="container relative py-14 md:py-16">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-cream/60">
            TABOO LIBRARY · 禁忌速查
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-cream md:text-6xl">
            孕产期食材安全全库
          </h1>
          <p className="mt-3 max-w-xl text-sm text-cream/70 md:text-base">
            收录 {tabooItems.length} 种常见食材在孕期 / 月子期的安全等级，含原因与替代建议。点击卡片展开详情。
          </p>

          {/* 阶段 tab（同步全局） */}
          <div className="mt-6 inline-flex rounded-pill bg-cream/10 p-1 ring-1 ring-cream/15">
            {(["pregnancy", "confinement"] as Stage[]).map((s) => (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={cn(
                  "rounded-pill px-6 py-2 text-sm font-medium transition-all",
                  stage === s
                    ? "bg-cream text-ink"
                    : "text-cream/70 hover:text-cream",
                )}
              >
                {stageMeta[s].label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-10">
        {/* 统计 + 过滤 + 搜索 */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <StatCard level="safe" count={counts.safe} />
            <StatCard level="caution" count={counts.caution} />
            <StatCard level="forbidden" count={counts.forbidden} />
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
            <div className="flex items-center gap-2 rounded-pill bg-white px-4 py-2 ring-1 ring-ink/5 md:w-72">
              <Search className="h-4 w-4 shrink-0 text-inksoft" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜食材名"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-inksoft/50"
              />
            </div>
          </div>
        </div>

        {/* 食材卡片列表 */}
        {list.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map(({ t, level }, i) => (
              <TabooCard
                key={t.id}
                item={t}
                level={level}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 py-16 text-center text-sm text-inksoft">
            没有匹配的食材，试试其它关键词或阶段
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ level, count }: { level: Level; count: number }) {
  const meta = levelMeta[level];
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-4",
        meta.border,
        "border-opacity-30",
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn("h-2.5 w-2.5 rounded-full", meta.dot)} />
        <span className={cn("text-sm font-medium", meta.text)}>
          {meta.label}
        </span>
      </div>
      <p className="mt-1 font-display text-3xl font-bold text-ink">{count}</p>
    </div>
  );
}

function TabooCard({
  item,
  level,
  index,
}: {
  item: TabooItem;
  level: Level;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const meta = levelMeta[level];
  return (
    <div
      className="group overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5 transition-all hover:shadow-card animate-rise"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-stretch text-left"
      >
        <span className={cn("w-1.5 shrink-0", meta.bg)} />
        <span className="flex flex-1 items-center justify-between gap-3 p-4">
          <span className="flex flex-col">
            <span className="text-[11px] text-inksoft/70">{item.category}</span>
            <span className="font-display text-lg font-semibold text-ink">
              {item.name}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <SafetyBadge level={level} size="sm" withDot={false} />
            <ChevronDown
              className={cn(
                "h-4 w-4 text-inksoft transition-transform",
                open && "rotate-180",
              )}
            />
          </span>
        </span>
      </button>
      <div className="px-4 pb-4">
        <p className="text-xs leading-relaxed text-inksoft">{item.reason}</p>
      </div>
      {open && (
        <div className="grid gap-3 border-t border-ink/5 bg-creamdark/30 p-4 text-sm sm:grid-cols-2">
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-inksoft">
              <Ban className="h-3.5 w-3.5" />
              原因
            </p>
            <p className="leading-relaxed text-ink">{item.reason}</p>
          </div>
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-inksoft">
              <Lightbulb className="h-3.5 w-3.5" />
              替代建议
            </p>
            <p className="leading-relaxed text-ink">{item.alternative}</p>
          </div>
        </div>
      )}
    </div>
  );
}
