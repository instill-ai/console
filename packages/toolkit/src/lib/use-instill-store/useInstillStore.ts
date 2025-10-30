import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

import { createEditorSlice } from "./editorSlice";
import { createFeatureFlagSlice } from "./featureFlagSlice";
import { createFolderSlice } from "./folderSlice";
import { createGeneralSlice } from "./generalSlice";
import { createPipelineBuilderSlice } from "./pipelineBuilderSlice";
import { createRecentlyUsedSlice } from "./recentlyUsedSlice";
import { createSmartHintSlice } from "./smartHintSlice";
import { createTableSlice } from "./tableSlice";
import { InstillStore } from "./types";

export const useInstillStore = create<InstillStore>()(
  subscribeWithSelector(
    devtools((...a) => ({
      ...createSmartHintSlice(...a),
      ...createPipelineBuilderSlice(...a),
      ...createGeneralSlice(...a),
      ...createRecentlyUsedSlice(...a),
      ...createEditorSlice(...a),
      ...createFeatureFlagSlice(...a),
      ...createTableSlice(...a),
      ...createFolderSlice(...a),
    })),
  ),
);
