import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

import { createEditorSlice } from "./editorSlice";
import { createGeneralSlice } from "./generalSlice";
import { createPipelineBuilderSlice } from "./pipelineBuilderSlice";
import { createRecentlyUsedSlice } from "./recentlyUsedSlice";
import { createSmartHintSlice } from "./smartHintSlice";
import { InstillStore } from "./types";

export const useInstillStore = create<InstillStore>()(
  subscribeWithSelector(
    devtools((...a) => ({
      ...createSmartHintSlice(...a),
      ...createPipelineBuilderSlice(...a),
      ...createGeneralSlice(...a),
      ...createRecentlyUsedSlice(...a),
      ...createEditorSlice(...a),
    })),
  ),
);
