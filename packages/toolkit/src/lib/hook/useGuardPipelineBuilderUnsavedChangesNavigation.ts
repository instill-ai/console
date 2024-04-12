"use client";

import * as React from "react";
import {
  InstillStore,
  useInstillStore,
  useShallow,
} from "../use-instill-store";
import { usePathname, useRouter } from "next/navigation";
import { pathnameEvaluator } from "../pathname-evaluator";

const selector = (store: InstillStore) => ({
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  updateWarnUnsavdChangesDialogState: store.updateWarnUnsavdChangesDialogState,
});

export function useGuardPipelineBuilderUnsavedChangesNavigation() {
  const pathname = usePathname();
  const { pipelineRecipeIsDirty, updateWarnUnsavdChangesDialogState } =
    useInstillStore(useShallow(selector));
  const router = useRouter();

  return React.useCallback(
    (url: string) => {
      if (
        pipelineRecipeIsDirty &&
        pathnameEvaluator.isPipelineBuilderPage(pathname)
      ) {
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
