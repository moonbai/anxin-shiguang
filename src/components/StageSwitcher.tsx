import { useStageStore } from "@/store/useStageStore";
import { stageMeta } from "@/data/suitability";
import type { Stage } from "@/data/types";
import { cn } from "@/lib/utils";

const stages: Stage[] = ["pregnancy", "confinement"];

// 顶部阶段切换器：决定全局过滤与提醒标准
export function StageSwitcher() {
  const { stage, setStage } = useStageStore();
  return (
    <div className="inline-flex items-center gap-1 rounded-pill bg-creamdark/80 p-1 ring-1 ring-ink/5">
      {stages.map((s) => {
        const active = s === stage;
        return (
          <button
            key={s}
            type="button"
            onClick={() => setStage(s)}
            className={cn(
              "relative rounded-pill px-5 py-2 text-sm font-medium transition-all duration-300",
              active
                ? "bg-clay text-cream shadow-soft"
                : "text-inksoft hover:text-ink",
            )}
            aria-pressed={active}
          >
            <span className="relative z-10">{stageMeta[s].label}</span>
            {active && (
              <span className="absolute inset-0 -z-0 rounded-pill opacity-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}
