import { create } from "zustand";
import { InstillStore } from "./types";
import { createSmartHintSlice } from "./smartHintSlice";
import { createPipelineBuilderSlice } from "./pipelineBuilderSlice";
import { devtools, subscribeWithSelector } from "zustand/middleware";

export const useInstillStore = create<InstillStore>()(
  subscribeWithSelector(
    devtools((...a) => ({
      ...createSmartHintSlice(...a),
      ...createPipelineBuilderSlice(...a),
    }))
  )
);
