import * as React from "react";
import {
  CreateUserPipelinePayload,
  InstillStore,
  UpdateUserPipelinePayload,
  getInstillApiErrorMessage,
  sendAmplitudeData,
  useAmplitudeCtx,
  useAppEntity,
  useCreateUserPipeline,
  useInstillStore,
  useShallow,
  useUpdateUserPipeline,
} from "../../../../lib";
import {
  composeEdgesFromNodes,
  composePipelineMetadataMapFromNodes,
  composePipelineRecipeFromNodes,
} from "..";
import { useToast } from "@instill-ai/design-system";
import { isAxiosError } from "axios";
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
  const entity = useAppEntity();
  const { toast } = useToast();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const updateUserPipeline = useUpdateUserPipeline();
  const createUserPipeline = useCreateUserPipeline();

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
        !entity.isSuccess ||
        !entity.data.pipelineName ||
        !entity.data.entityName
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
        const payload: UpdateUserPipelinePayload = {
          name: entity.data.pipelineName,
          recipe: composePipelineRecipeFromNodes(targetNodes),
          metadata: composePipelineMetadataMapFromNodes(targetNodes),
        };

        try {
          const { pipeline: newPipeline } =
            await updateUserPipeline.mutateAsync({
              payload,
              accessToken,
            });

          if (amplitudeIsInit) {
            sendAmplitudeData("update_pipeline_recipe");
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

          toast({
            title: "Pipeline is saved",
            variant: "alert-success",
            size: "small",
          });

          updatePipelineRecipeIsDirty(() => false);
        } catch (error) {
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when save the pipeline",
              description: getInstillApiErrorMessage(error),
              variant: "alert-error",
              size: "large",
            });
          } else {
            toast({
              title: "Something went wrong when save the pipeline",
              variant: "alert-error",
              size: "large",
            });
          }
        }

        if (setIsSaving) {
          setIsSaving(false);
        }

        return;
      }

      // If the user haven't created the pipeline yet, we will create the pipeline

      const payload: CreateUserPipelinePayload = {
        id: pipelineId,
        recipe: composePipelineRecipeFromNodes(targetNodes),
        metadata: composePipelineMetadataMapFromNodes(targetNodes),
      };

      try {
        const { pipeline: newPipeline } = await createUserPipeline.mutateAsync({
          entityName: entity.data.entityName,
          payload,
          accessToken,
        });

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

        toast({
          title: "Successfully saved the pipeline",
          variant: "alert-success",
          size: "small",
        });
      } catch (error) {
        if (isAxiosError(error)) {
          toast({
            title: "Something went wrong when save the pipeline",
            description: getInstillApiErrorMessage(error),
            variant: "alert-error",
            size: "large",
          });
        } else {
          toast({
            title: "Something went wrong when save the pipeline",
            variant: "alert-error",
            size: "large",
          });
        }
      }

      if (setIsSaving) {
        setIsSaving(false);
      }
    },
    [
      accessToken,
      amplitudeIsInit,
      createUserPipeline,
      entity,
      nodes,
      pipelineId,
      pipelineIsNew,
      pipelineRecipeIsDirty,
      toast,
      updatePipelineIsNew,
      updatePipelineRecipeIsDirty,
      updateUserPipeline,
      setIsSaving,
      isEditingIterator,
      editingIteratorID,
      tempSavedNodesForEditingIteratorFlow,
      updateNodes,
      updateTempSavedNodesForEditingIteratorFlow,
      updateEdges,
    ]
  );
}
