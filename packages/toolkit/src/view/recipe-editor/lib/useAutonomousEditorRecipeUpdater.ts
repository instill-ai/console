"use client";

import * as React from "react";

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
  const {
    updateIsSavingRecipe,
    updateHasUnsavedRecipe,
    editorRef,
    accessToken,
    editorDebouncedRecipeUpdater,
  } = useInstillStore(useShallow(selector));

  const updatePipeline = useUpdateNamespacePipeline();

  const autonomousRecipeUpdater = React.useCallback(async () => {
    if (
      !routeInfo.isSuccess ||
      !editorRef ||
      !routeInfo.data.pipelineName ||
      !routeInfo.data.namespaceId ||
      !routeInfo.data.resourceId
    ) {
      return;
    }

    const rawRecipe = editorRef.getValue();

    try {
      updateIsSavingRecipe(() => true);

      await updatePipeline.mutateAsync({
        rawRecipe,
        namespaceId: routeInfo.data.namespaceId,
        pipelineId: routeInfo.data.resourceId,
        accessToken,
        metadata: {
          pipelineIsNew: false,
        },
      });

      // Cancel the debounced recipe updater sequnce to prevent the duplicate update
      editorDebouncedRecipeUpdater?.cancel();

      // Smooth the indicator transition, if the update goes too fast, the indicator
      // will blink
      setTimeout(() => {
        updateIsSavingRecipe(() => false);
        updateHasUnsavedRecipe(() => false);
      }, 500);
    } catch (error) {
      toastInstillError({
        title: "Failed to update pipeline",
        error,
      });
      console.error(error);
    } finally {
      updateIsSavingRecipe(() => false);
    }
  }, [
    editorRef,
    routeInfo.isSuccess,
    routeInfo.data.namespaceId,
    routeInfo.data.resourceId,
    routeInfo.data.pipelineName,
    accessToken,
    editorDebouncedRecipeUpdater,
    updateIsSavingRecipe,
    updateHasUnsavedRecipe,
    updatePipeline,
  ]);

  return autonomousRecipeUpdater;
}
