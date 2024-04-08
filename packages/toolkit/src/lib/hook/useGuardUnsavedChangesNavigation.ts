"use client";

import * as React from "react";
import {
  InstillStore,
  useInstillStore,
  useShallow,
} from "../use-instill-store";
import { useRouter } from "next/navigation";

const selector = (store: InstillStore) => ({
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  updateWarnUnsavdChangesDialogState: store.updateWarnUnsavdChangesDialogState,
});

export function useGuardUnsavedChangesNavigation() {
  const { pipelineRecipeIsDirty, updateWarnUnsavdChangesDialogState } =
    useInstillStore(useShallow(selector));
  const router = useRouter();

  return React.useCallback(
    (url: string) => {
      if (pipelineRecipeIsDirty) {
        updateWarnUnsavdChangesDialogState(() => ({
          open: true,
          confirmNavigation: () => {
            router.push(url);
          },
        }));
      } else {
        router.push(url);
      }
    },
    [pipelineRecipeIsDirty, updateWarnUnsavdChangesDialogState, router]
  );
}
