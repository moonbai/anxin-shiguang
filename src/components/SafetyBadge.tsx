import type { Level } from "@/data/types";
import { levelMeta } from "@/data/suitability";
import { cn } from "@/lib/utils";

interface SafetyBadgeProps {
  level: Level;
  size?: "sm" | "md";
  withDot?: boolean;
  className?: string;
}

// 安全等级徽章
export function SafetyBadge({
  level,
  size = "md",
  withDot = true,
  className,
}: SafetyBadgeProps) {
  const meta = levelMeta[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill font-medium",
        meta.text,
        "bg-white/70 ring-1",
        meta.ring,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        className,
      )}
    >
      {withDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      )}
      {meta.label}
    </span>
  );
}
