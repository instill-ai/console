"use client";

import * as React from "react";

import { useToast } from "@instill-ai/design-system";

import {
  InstillStore,
  toastInstillError,
  useInstillStore,
  useRouteInfo,
  useShallow,
  useUpdateNamespacePipeline,
} from "../../../lib";

const selector = (store: InstillStore) => ({
  updateIsSavingRecipe: store.updateIsSavingRecipe,
  updateHasUnsavedRecipe: store.updateHasUnsavedRecipe,
  editorRef: store.editorRef,
  accessToken: store.accessToken,
  editorDebouncedRecipeUpdater: store.editorDebouncedRecipeUpdater,
});

/**
 * This function is used when you try to update the recipe outside of editor's
 * onChange event, or anywhere that is hard to access the editor original value
 */
export function useAutonomousEditorRecipeUpdater() {
  const routeInfo = useRouteInfo();
  const { toast } = useToast();
  const {
    updateIsSavingRecipe,
    updateHasUnsavedRecipe,
    editorRef,
    accessToken,
    editorDebouncedRecipeUpdater,
  } = useInstillStore(useShallow(selector));

  const updatePipeline = useUpdateNamespacePipeline();

  const autonomousRecipeUpdater = React.useCallback(() => {
    if (!routeInfo.isSuccess || !editorRef || !routeInfo.data.pipelineName) {
      return;
    }

    const rawRecipe = editorRef.getValue();

    try {
      updateIsSavingRecipe(() => true);

      updatePipeline.mutateAsync({
        rawRecipe,
        namespacePipelineName: routeInfo.data.pipelineName,
        accessToken,
        metadata: {
          pipelineIsNew: false,
        },
      });

      editorDebouncedRecipeUpdater?.cancel();

      // Smooth the indicator transition, if the update goes too fast, the indicator
      // will blink
      setTimeout(() => {
        updateIsSavingRecipe(() => false);
        updateHasUnsavedRecipe(() => false);
      }, 500);
    } catch (error) {
      toastInstillError({
        toast,
        title: "Failed to update pipeline",
        error,
      });
      console.error(error);
    }
  }, [
    editorRef,
    routeInfo.isSuccess,
    routeInfo.data.pipelineName,
    accessToken,
    editorDebouncedRecipeUpdater,
  ]);

  return autonomousRecipeUpdater;
}
