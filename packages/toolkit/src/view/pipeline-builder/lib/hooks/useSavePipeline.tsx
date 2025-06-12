"use client";

import * as React from "react";
import {
  CreateNamespacePipelineRequest,
  UpdateNamespacePipelineRequest,
} from "instill-sdk";

import {
  composeEdgesFromNodes,
  composePipelineMetadataMapFromNodes,
  composePipelineRecipeFromNodes,
} from "..";
import {
  InstillStore,
  sendAmplitudeData,
  toastInstillError,
  toastInstillSuccess,
  useAmplitudeCtx,
  useCreateNamespacePipeline,
  useInstillStore,
  useRouteInfo,
  useShallow,
  useUpdateNamespacePipeline,
} from "../../../../lib";
import { composeCompleteNodesUnderEditingIteratorMode } from "../composeCompleteNodesUnderEditingIteratorMode";
import { createNodesFromPipelineRecipe } from "../createNodesFromPipelineRecipe";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  pipelineId: store.pipelineId,
  pipelineIsNew: store.pipelineIsNew,
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  accessToken: store.accessToken,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updatePipelineIsNew: store.updatePipelineIsNew,
  tempSavedNodesForEditingIteratorFlow:
    store.tempSavedNodesForEditingIteratorFlow,
  updateTempSavedNodesForEditingIteratorFlow:
    store.updateTempSavedNodesForEditingIteratorFlow,
  isEditingIterator: store.isEditingIterator,
  editingIteratorID: store.editingIteratorID,
});

export type UseSavePipelineProps =
  | {
      setIsSaving?: (value: boolean) => void;
    }
  | undefined;

export function useSavePipeline(props: UseSavePipelineProps = {}) {
  const { setIsSaving } = props;
  const routeInfo = useRouteInfo();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const updatePipeline = useUpdateNamespacePipeline();
  const createPipeline = useCreateNamespacePipeline();

  const {
    nodes,
    updateNodes,
    updateEdges,
    pipelineId,
    pipelineIsNew,
    pipelineRecipeIsDirty,
    accessToken,
    updatePipelineRecipeIsDirty,
    updatePipelineIsNew,
    tempSavedNodesForEditingIteratorFlow,
    updateTempSavedNodesForEditingIteratorFlow,
    isEditingIterator,
    editingIteratorID,
  } = useInstillStore(useShallow(selector));

  return React.useCallback(
    async function () {
      if (
        !pipelineId ||
        !routeInfo.isSuccess ||
        !routeInfo.data.namespaceId ||
        !routeInfo.data.resourceId
      ) {
        return;
      }

      if (setIsSaving) {
        setIsSaving(true);
      }

      let targetNodes = nodes;

      if (isEditingIterator && editingIteratorID) {
        targetNodes = composeCompleteNodesUnderEditingIteratorMode({
          editingIteratorID,
          nodesInIterator: nodes,
          nodesOutsideIterator: tempSavedNodesForEditingIteratorFlow,
        });
      }

      if (!pipelineIsNew && pipelineRecipeIsDirty) {
        const payload: UpdateNamespacePipelineRequest = {
          namespaceId: routeInfo.data.namespaceId,
          pipelineId: routeInfo.data.resourceId,
          recipe: composePipelineRecipeFromNodes(targetNodes),
          metadata: composePipelineMetadataMapFromNodes(targetNodes),
        };

        try {
          const { pipeline: newPipeline } = await updatePipeline.mutateAsync({
            ...payload,
            accessToken,
          });

          if (amplitudeIsInit) {
            sendAmplitudeData("update_pipeline_recipe");
          }

          if (!newPipeline.recipe) {
            return;
          }

          const newNodes = createNodesFromPipelineRecipe(newPipeline.recipe, {
            metadata: newPipeline.metadata,
          });

          const newEdges = composeEdgesFromNodes(newNodes);

          if (isEditingIterator) {
            updateTempSavedNodesForEditingIteratorFlow(() => newNodes);
          } else {
            updateNodes(() => newNodes);
            updateEdges(() => newEdges);
          }

          toastInstillSuccess({
            title: "Pipeline is saved",
          });

          updatePipelineRecipeIsDirty(() => false);
        } catch (error) {
          toastInstillError({
            title: "Something went wrong when save the pipeline",
            error,
          });
        }

        if (setIsSaving) {
          setIsSaving(false);
        }

        return;
      }

      // If the user haven't created the pipeline yet, we will create the pipeline

      const payload: CreateNamespacePipelineRequest = {
        namespaceId: routeInfo.data.namespaceId,
        id: pipelineId,
        recipe: composePipelineRecipeFromNodes(targetNodes),
        metadata: composePipelineMetadataMapFromNodes(targetNodes),
      };

      try {
        const { pipeline: newPipeline } = await createPipeline.mutateAsync({
          payload,
          accessToken,
        });

        if (!newPipeline.recipe) {
          return;
        }

        const newNodes = createNodesFromPipelineRecipe(newPipeline.recipe, {
          metadata: newPipeline.metadata,
        });
        const newEdges = composeEdgesFromNodes(newNodes);

        if (isEditingIterator) {
          updateTempSavedNodesForEditingIteratorFlow(() => newNodes);
        } else {
          updateNodes(() => newNodes);
          updateEdges(() => newEdges);
        }

        updatePipelineRecipeIsDirty(() => false);
        updatePipelineIsNew(() => false);

        if (amplitudeIsInit) {
          sendAmplitudeData("create_pipeline");
        }

        toastInstillSuccess({
          title: "Successfully saved the pipeline",
        });
      } catch (error) {
        toastInstillError({
          title: "Something went wrong when save the pipeline",
          error,
        });
      }

      if (setIsSaving) {
        setIsSaving(false);
      }
    },
    [
      accessToken,
      amplitudeIsInit,
      createPipeline,
      routeInfo.isSuccess,
      routeInfo.data,
      nodes,
      pipelineId,
      pipelineIsNew,
      pipelineRecipeIsDirty,
      updatePipelineIsNew,
      updatePipelineRecipeIsDirty,
      updatePipeline,
      setIsSaving,
      isEditingIterator,
      editingIteratorID,
      tempSavedNodesForEditingIteratorFlow,
      updateNodes,
      updateTempSavedNodesForEditingIteratorFlow,
      updateEdges,
    ],
  );
}
