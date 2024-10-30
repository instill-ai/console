"use client";

import * as React from "react";
import { InstillNameInterpreter, Nullable } from "instill-sdk";
import debounce from "lodash.debounce";

import { useToast } from "@instill-ai/design-system";

import {
  InstillStore,
  toastInstillError,
  useInstillStore,
  useShallow,
  useUpdateNamespacePipeline,
} from "../../../lib";

const selector = (store: InstillStore) => ({
  updateIsSavingRecipe: store.updateIsSavingRecipe,
  hasUnsavedRecipe: store.hasUnsavedRecipe,
  updateHasUnsavedRecipe: store.updateHasUnsavedRecipe,
  updateEditorDebouncedRecipeUpdater: store.updateEditorDebouncedRecipeUpdater,
});

export type EditorRecipeUpdater = ReturnType<
  typeof debounce<
    ({
      pipelineName,
      newRawRecipe,
      accessToken,
    }: {
      pipelineName: Nullable<string>;
      newRawRecipe: string;
      accessToken: Nullable<string>;
    }) => void
  >
>;

export function useDebouncedRecipeUpdater(): EditorRecipeUpdater {
  const { toast } = useToast();
  const {
    updateIsSavingRecipe,
    updateHasUnsavedRecipe,
    updateEditorDebouncedRecipeUpdater,
  } = useInstillStore(useShallow(selector));
  const updatePipeline = useUpdateNamespacePipeline();

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const debounceRecipeUpdater = React.useCallback(
    debounce(
      ({
        pipelineName,
        newRawRecipe,
        accessToken,
      }: {
        pipelineName: Nullable<string>;
        newRawRecipe: string;
        accessToken: Nullable<string>;
      }) => {
        if (!accessToken || !pipelineName) {
          return;
        }

        const instillName = InstillNameInterpreter.pipeline(pipelineName);

        try {
          updateIsSavingRecipe(() => true);

          updatePipeline.mutateAsync({
            rawRecipe: newRawRecipe,
            namespaceId: instillName.namespaceId,
            pipelineId: instillName.resourceId,
            accessToken,
            metadata: {
              pipelineIsNew: false,
            },
          });

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
      },
      1000,
    ),
    [],
  );

  React.useEffect(() => {
    updateEditorDebouncedRecipeUpdater(() => debounceRecipeUpdater);
  }, [updateEditorDebouncedRecipeUpdater, debounceRecipeUpdater]);

  return debounceRecipeUpdater;
}
