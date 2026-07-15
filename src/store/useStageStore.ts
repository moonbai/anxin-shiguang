import { create } from "zustand";
import type { Stage } from "@/data/types";

interface StageState {
  stage: Stage;
  setStage: (s: Stage) => void;
}

// 全局孕产阶段状态
export const useStageStore = create<StageState>((set) => ({
  stage: "pregnancy",
  setStage: (stage) => set({ stage }),
}));
